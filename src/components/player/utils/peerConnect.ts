interface Subscribe {
  [k: string]: (opt?: any) => void;
}

class WebRTCPeerConnect {
  #peerConnectEvents = {
    candidate: "candidate",
    addstream: "addstream",
  };
  #subscribe: Subscribe = {};
  peerConnect: RTCPeerConnection;

  
  constructor() {
    this.peerConnect = this.createPeerConnect();
    this.bindEvent();
  }

  createPeerConnect() {
    return new RTCPeerConnection();
  }

  createAnswerDescription(sdp: string) {
    const param:RTCSessionDescriptionInit = { sdp: sdp, type: "offer" };
    return new RTCSessionDescription(param);
  }

  createAnswer(
    sdp: string,
    successCallback: (answer: RTCLocalSessionDescriptionInit) => void,
    errorCallback?: (err: DOMException) => void
  ) {
    const description:RTCSessionDescription = this.createAnswerDescription(sdp);
    this.setRemoteDescription(description);
    this.peerConnect
      .createAnswer()
      .then((answer) => {
        this.setLocalDescription(answer);
        successCallback && successCallback(answer);
      })
      .catch((err) => errorCallback && errorCallback(err));
  }

  setRemoteDescription(desc:RTCSessionDescription) {
    this.peerConnect.setRemoteDescription(desc);
  }

  setLocalDescription(desc:RTCLocalSessionDescriptionInit) {
    this.peerConnect.setLocalDescription(desc);
  }

  bindEvent() {
    this.peerConnect.addEventListener("icecandidate", (e:RTCPeerConnectionIceEvent) =>
      this.handleIceCandidate(e)
    );
    this.peerConnect.addEventListener("addstream", (e:Event) =>
      this.handleAddstream(e)
    );
  }

  handleIceCandidate(e: RTCPeerConnectionIceEvent) {
    const candidate = e.candidate;
    if (candidate) {
      this.notifyEvent(this.#peerConnectEvents.candidate, candidate);
    }
  }

  handleAddstream(e:any) {
    this.notifyEvent(this.#peerConnectEvents.addstream, e.stream);
  }

  notifyEvent(eventName:string, data?:any) {
    if (this.#subscribe.hasOwnProperty(eventName)) {
      const callback = this.#subscribe[eventName];
      callback && callback(data)
    }
  }

  addEventListener(eventName: string, callback: (opt?:any) => void) {
    this.#subscribe[eventName] =
      typeof callback == "function" ? callback : () => {};
  }
}

export default WebRTCPeerConnect;
