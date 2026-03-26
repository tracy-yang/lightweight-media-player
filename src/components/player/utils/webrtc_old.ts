import WebRTCPeerConnect from "./peerConnect";
import { webRTCEvents } from "./dictionary";
import Signaling from "./Signaling";
import { AddStreamOptions, LiveSrcOptions, PlaybackSrcOptions, LiveSignalOptions, PlaybackStartSignalOptions, PlaybackFindRecordSignalOptions, PlaybackSignalOptions } from "../types";

type WebRTCOptions = LiveSrcOptions | PlaybackSrcOptions

type Subscribes = {
  [k: string]: (opt?: any) => void;
};

type VideoAttrs = typeof HTMLVideoElement;


interface SonnectStatus {
  connected: number;
  disconnected: number;
}

const connectStatus: SonnectStatus = {
  connected: 1,
  disconnected: 3,
};


class WebRTCPlayer {
  websocketUrl: string | null;
  socket: WebSocket | null;
  isConnected: boolean = false;
  peerConnect: WebRTCPeerConnect | null;
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
    this.peerConnect = new WebRTCPeerConnect();
    this.peerConnect.addEventListener("candidate", (opt) => {
      console.log(opt.candidate, 'opt.candidate')
      this.handleIceCandidate(opt.candidate)
    });
    this.peerConnect.addEventListener("addstream", (stream:MediaStream) =>
      this.handleAddStream(stream)
    );
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
            1000 * 20
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
    console.log(event, 'handleSocketMessage');
    const msgType = event.type;
    if (msgType === "message") {
      const data = JSON.parse(event.data);
      if (data.error === '-1') {
        return this.disconnect();
      } else {
        if (this.msgList.length) {
          const msg = this.msgList.shift();
          msg && this.socket && this.socket.send(msg);
        }


        const cmdType = data.cmd_type;
        if (cmdType === "ice") {
          if (data.request_type === "offer") {
            this.handleOffer(data.sdp)
          }
        } else if (data.hasOwnProperty("second")) {
          const progress = data.play_percent;
          this.notifyEvent(webRTCEvents.playProgress, progress);
          if (parseInt(progress) === 100) {
          }
        }
      }
    }
  }

  handleOffer(sdp:string) {
    // sdp = sdp.replace(" 98 100", " 100 98");
    // sdp = sdp.replace(" 8 0 18", " 18 8 0");
    this.peerConnect &&
    this.peerConnect.createAnswer(sdp, (desc) => this.sendAnswerFn(desc));
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

  handleIceCandidate(candidate: any) {
    const signal = this.signaling.generateIceCandidateMsg({ candidate });
    this.socket && this.socket.send(signal);
  }

  handleAddStream(stream: MediaStream) {
    const params: AddStreamOptions = { src: stream };
    this.notifyEvent(webRTCEvents.videoLoadData, params)
  }

  notifyEvent(eventName:string, data?:any) {
    if (this.#subscribes.hasOwnProperty(eventName)) {
      const cb = this.#subscribes[eventName];
      cb && cb(data);
    }
  }

  addEventListener(event: string, callback: (opt?: any) => void) {
    const cb = typeof callback == "function" ? callback : () => {};
    this.#subscribes[event] = cb;
  }
}

export default WebRTCPlayer;
