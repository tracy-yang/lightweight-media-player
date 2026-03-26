import { webRTCEvents } from "./dictionary";
import Signaling from "./Signaling";
import { AddStreamOptions, LiveSrcOptions, PlaybackSrcOptions, LiveSignalOptions, PlaybackControlCodeEnum, PlaybackSignalOptions } from "../types";

type WebRTCOptions = LiveSrcOptions | PlaybackSrcOptions

type Subscribes = {
  [k: string]: (opt?: any) => void;
};

type VideoAttrs = typeof HTMLVideoElement;

enum connectStatus {
  connected = 1,
  disconnected = 3,
};



class WebRTCPlayer {
  websocketUrl: string | null;
  socket: WebSocket | null;
  isConnected: boolean = false;
  peerConnect: RTCPeerConnection | null;
  signalOptions: LiveSignalOptions | PlaybackSignalOptions | null;
  signaling: Signaling;
  #subscribes: Subscribes = {};
  heartbeatTimer: number | null = null;
  isLiveStream:boolean;
  msgList:any[];


  constructor() {
    this.websocketUrl = null;
    this.socket = null;
    this.isConnected = false;
    this.peerConnect = null;
    this.signalOptions = null;
    this.isLiveStream = false;
    this.msgList = []

    this.signaling = new Signaling();
  }


  createWebsocket(opt: WebRTCOptions) {
    this.websocketUrl = opt.websocket_url;
    this.signalOptions = this.__filterOptions(opt, 'websocket_url');
    this.isLiveStream = !(opt.device_id && opt.device_id.startsWith('Rec'));
    console.log(this.isLiveStream)
    if (this.websocketUrl) {
      this.initPeerConnect();
      this.connect();
    }
  }

  __filterOptions(target:WebRTCOptions, filterProp:string):LiveSignalOptions | PlaybackSignalOptions {
    const tempTarget = JSON.parse(JSON.stringify(target));
    delete tempTarget[filterProp];
    return tempTarget;
  }

  initPeerConnect() {
    this.peerConnect = new RTCPeerConnection();;
    this.peerConnect.addEventListener("icecandidate", (e: RTCPeerConnectionIceEvent) => {
      const candidate = e.candidate as RTCIceCandidate;
      if (candidate) {
        this.handleIceCandidate(candidate.candidate);
      }
    }
    );
    this.peerConnect.addEventListener("addstream", (e: any) => {
      console.log('addStream');
      this.handleAddStream(e.stream)
    });
  }

  disconnect() {
    if (this.socket) {
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);

      const msg = this.isLiveStream ? 
        this.signaling.generateCloseLiveSteamMsg():
        this.signaling.generateCloseRecordMsg(this.signalOptions?.device_id!)
      this.socket.send(msg);

      this.notifyEvent(webRTCEvents.disconnect)

      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;

      this.heartbeatTimer = null;
      this.peerConnect = null;
      this.socket = null;
      this.isConnected = false;
    }
  }

  connect() {
    if (!this.websocketUrl) return;
    if ("WebSocket" in window) {
      this.socket = new WebSocket(this.websocketUrl);
      this.socket.onopen = (e:Event) => this.handleSocketOpen(e);
      this.socket.onclose = (e:CloseEvent) => this.handleSocketClose(e);
      this.socket.onerror = (e:Event) => this.handleSocketError(e);
      this.socket.onmessage = (e:MessageEvent) => this.handleSocketMessage(e);
    }
  }

  handleSocketOpen(e: Event) {
    if (this.socket?.readyState === connectStatus.connected) {
      if (this.signalOptions) {
        this.msgList = [];
        if (this.isLiveStream) {
          const msg = this.signaling.generateSendLiveStreamMsg(this.signalOptions);
          this.msgList.push(msg);
        } else {
          const startMsg = this.signaling.generateSendRecordMsg(this.signalOptions as PlaybackSignalOptions);
          const playControlMsg = this.signaling.generateSendPlayControlRecordMsg(this.signalOptions as PlaybackSignalOptions);
          this.msgList.push(startMsg);
          this.msgList.push(playControlMsg);
        }
        if (this.socket) {
          const msg = this.msgList.shift();
          msg && this.socket && this.socket.send(msg);
          this.heartbeatTimer = window.setInterval(
            () => this.sendHeartbeat(),
            1000 * 10
          );
          this.notifyEvent(webRTCEvents.connect, true)
        }
      }
    }
  }

  handleSocketClose(e: CloseEvent) {
    if (this.socket?.readyState === connectStatus.disconnected) {
      this.isConnected = false;
      this.disconnect();
    }
  }

  handleSocketError(e: Event) {
    console.log('handleSocketError', e);
    const target = e.target || e.currentTarget;
    this.isConnected = false;
    this.notifyEvent(webRTCEvents.error, target)
  }

  handleSocketMessage(event: MessageEvent) {
    // console.log(event, 'handleSocketMessage');
    const msgType = event.type;
    console.log(msgType, 'msgType-1')
    if (msgType === "message") {
      const data = JSON.parse(event.data);
      console.log(data, 'msgType-2')
      if (data.error === '-1') {
        return this.disconnect();
      } else {
        if (this.msgList.length) {
          const msg = this.msgList.shift();
          msg && this.socket && this.socket.send(msg);
        }
        if (data.record_info) {
          console.log(data.record_info, 'data.record_info')
          this.notifyEvent(webRTCEvents.recordInfo, data.record_info);
        }

        const cmdType = data.cmd_type;
        if (cmdType === "ice") {
          if (data.request_type === "offer") {
            this.handleOffer(data.sdp)
          }
        } else if (data.hasOwnProperty("second")) {
          const progress = parseFloat(data.play_percent);
          this.notifyEvent(webRTCEvents.playProgress, progress);
        }
      }
    }
  }

  handleOffer(sdp:string) {
    // sdp = sdp.replace(" 98 100", " 100 98");
    // sdp = sdp.replace(" 8 0 18", " 18 8 0");
    this.createAnswer(sdp, (desc) => this.sendAnswerFn(desc));
  }

  sendAnswerFn(desc: any) {
    console.log(desc, "desc");
    const sdp = desc.sdp;
    const msg = this.signaling.generateAnswerMsg({ sdp });
    this.socket && this.socket.send(msg);
  }

  sendHeartbeat() {
    const msg = this.signaling.generateHeartbeatMsg();
    this.socket && this.socket.send(msg);
  }

  handleIceCandidate(candidate: string) {
    const signal = this.signaling.generateIceCandidateMsg({ candidate });
    this.socket && this.socket.send(signal);
  }

  handleAddStream(stream: MediaStream) {
    const params: AddStreamOptions = { src: stream };
    this.notifyEvent(webRTCEvents.videoLoadData, params)
  }

  handlePlayOrPause(isPlay:boolean) {
    if (this.isLiveStream) return;
    const signal = this.signaling.generatePlayControlMsg(isPlay ? 'resume' : 'pause');
    this.socket && this.socket.send(signal);
  }

  notifyEvent(eventName:string, data?:any) {
    if (this.#subscribes.hasOwnProperty(eventName)) {
      const cb = this.#subscribes[eventName];
      cb && cb(data);
    }
  }

  addEventListener(event: string, callback: (opt?: any) => void) {
    console.log(event, 'event');
    const cb = typeof callback == "function" ? callback : () => {};
    this.#subscribes[event] = cb;
  }

  /*********************peerConnect**************************************/

  createAnswerDescription(sdp: string) {
    const param: RTCSessionDescriptionInit = { sdp: sdp, type: "offer" };
    return new RTCSessionDescription(param);
  }

  createAnswer(
    sdp: string,
    successCallback: (answer: RTCLocalSessionDescriptionInit) => void,
    errorCallback?: (err: DOMException) => void
  ) {
    const description: RTCSessionDescription =  this.createAnswerDescription(sdp);
    this.setRemoteDescription(description);
    this.peerConnect &&
      this.peerConnect
        .createAnswer()
        .then((answer) => {
          this.setLocalDescription(answer);
          successCallback && successCallback(answer);
        })
        .catch((err) => errorCallback && errorCallback(err));
  }

  setRemoteDescription(desc: RTCSessionDescription) {
    this.peerConnect && this.peerConnect.setRemoteDescription(desc);
  }

  setLocalDescription(desc: RTCLocalSessionDescriptionInit) {
    this.peerConnect && this.peerConnect.setLocalDescription(desc);
  }

}

export default WebRTCPlayer;
