import { newGuid, formatSignalData } from "./utils";
import {
  LiveSignalOptions,
  PlaybackFindRecordSignalOptions,
  PlaybackStartSignalOptions,
  PlaybackControlCodeEnum,
  LiveSignalMsg,
  PlaybackControlCode,
  PlaybackSignalOptions
} from "../types";

type SignalOptions = LiveSignalOptions | PlaybackSignalOptions;

interface SingalParams {
  [k: string]: SingalParams;
}

interface AnswerOptions {
  sdp: string;
}

class Signaling {
  requestId:string | undefined
  constructor() {
    this.requestId = newGuid();
  }


  // generateParams<T>(opt:SignalOptions):T {
  //   return {
  //     device_id: opt.device_id,
  //     protocal: opt.protocal || "webrtc",
  //     tun_server: opt.tun_server || "",
  //     start_time: opt?.start_time || '',
  //     end_time: opt?.end_time || '',
  //     sip_file_url: opt?.sip_file_url || ''
  //   }
  // }

  /***********************历史流信令********************************************* */
  generateRecordStreamMsg(opt:PlaybackSignalOptions){
    return {
      device_id: opt.device_id,
      protocal: opt.protocal || "webrtc",
      tun_server: opt.tun_server || "",
      start_time: formatSignalData(opt?.start_time) || '',
      end_time: formatSignalData(opt?.end_time) || '',
      sip_file_url: opt?.sip_file_url || ''
    }
  }

  generateSendRecordMsg(opt:PlaybackSignalOptions) {
    const params = this.generateRecordStreamMsg(opt);
    const msg = Object.assign(
      {
        account_token: "",
        cmd_type: "find_record",
        request_id: this.requestId,
        request_type: "start",
        // nmedia_id: 0,
        // spanId: "14e6ab95-422d-46ae-8d8f-051b57f7c666",
        // sw8: "1-NTZmOTBkZTItNjc2NS00ZDFmLTg1MWEtMzJhMGM1Y2Q1OTFi-MzQ0YjE3N2QtNzc2Ny00OTIxLThjNzgtZWVjYzJmM2IwM2Nh-0-S01lZGlhVW5p-MTcyMjIxOTM4Njc3OQ==-aHR0cHM6Ly8xMC42Ni44LjI4L3ZjLyMvZGlzcGF0Y2gvY29udHJvbGxlcg==-d3NzOi8vMTAuNjYuOC4yODozMjAwMQ==",
        // traceId: "56f90de2-6765-4d1f-851a-32a0c5cd591b",
      },
      params
    );
    if (!msg?.device_id) throw new Error("resource_id is undefined");
    return JSON.stringify(msg);
  }

  generateSendPlayControlRecordMsg(opt:PlaybackSignalOptions) {
    const params = this.generateRecordStreamMsg(opt);
    const msg = Object.assign(
      {
        account_token: "",
        cmd_type: "playback",
        request_id: this.requestId,
        request_type: "start",
        stun_server: "",
        // support_reverse: 0,
        // nmedia_id: 0,
      },
      params
    );
    if (!msg?.device_id) throw new Error("resource_id is undefined");
    return JSON.stringify(msg);
  }

  generatePlayControlMsg(playControl: PlaybackControlCode, rateValue?:number) {
    const result = {
      scale:playControl === 'changeRate'? rateValue : undefined,
      npt: playControl === 'changeRate' ? rateValue : undefined,
    };
    const msg = Object.assign({
      account_token: "",
      cmd_type: "playback",
      control_code: PlaybackControlCodeEnum[playControl],
      request_id: this.requestId,
      request_type: "play_control",
      // spanId: "14e6ab95-422d-46ae-8d8f-051b57f7c666",
      // sw8: "1-NTZmOTBkZTItNjc2NS00ZDFmLTg1MWEtMzJhMGM1Y2Q1OTFi-MzQ0YjE3N2QtNzc2Ny00OTIxLThjNzgtZWVjYzJmM2IwM2Nh-0-S01lZGlhVW5p-MTcyMjIxOTM4Njc3OQ==-aHR0cHM6Ly8xMC42Ni44LjI4L3ZjLyMvZGlzcGF0Y2gvY29udHJvbGxlcg==-d3NzOi8vMTAuNjYuOC4yODozMjAwMQ==",
      // traceId: "56f90de2-6765-4d1f-851a-32a0c5cd591b",
    }, result);
    return JSON.stringify(msg);
  }

 
  generateCloseRecordMsg(deviceId:string) {
    const msg = Object.assign(
      {
        account_token: "",
        device_id: deviceId,
        request_id: this.requestId,
        cmd_type: "playback",
        request_type: "stop",
      }
    );
    if (!msg.device_id) throw new Error("resource_id is undefined");
    return JSON.stringify(msg);
  }


  /***********************实时流信令********************************************* */
  generateLiveStreamOption(opt: LiveSignalOptions) {
    if (!Object.keys(opt).length) return {};
    if (!opt.device_id) throw new Error("resource_id is required");
    return {
      device_id: opt.device_id,
      protocol: opt.protocal || "webrtc",
      tun_server: opt.tun_server || "",
      video_code: opt.video_code || "H264",
      video_resolution: opt.video_resolution || "1080",
    };
  }

  generateSendLiveStreamMsg(opt: SignalOptions) {
    const params = this.generateLiveStreamOption(opt);
    const baseSignal: LiveSignalMsg = {
      account_token: "",
      cmd_type: "live",
      request_id: this.requestId,
      request_type: "start",
      // nmedia_id: 0,
      // spanId: "14e6ab95-422d-46ae-8d8f-051b57f7c666",
      // sw8: "1-NTZmOTBkZTItNjc2NS00ZDFmLTg1MWEtMzJhMGM1Y2Q1OTFi-MzQ0YjE3N2QtNzc2Ny00OTIxLThjNzgtZWVjYzJmM2IwM2Nh-0-S01lZGlhVW5p-MTcyMjIxOTM4Njc3OQ==-aHR0cHM6Ly8xMC42Ni44LjI4L3ZjLyMvZGlzcGF0Y2gvY29udHJvbGxlcg==-d3NzOi8vMTAuNjYuOC4yODozMjAwMQ==",
      // traceId: "56f90de2-6765-4d1f-851a-32a0c5cd591b",
    };
    const msg = Object.assign(baseSignal, params);
    if (!msg?.device_id) throw new Error("resource_id is undefined");
    return JSON.stringify(msg);
  }

  generateCloseLiveSteamMsg(opt?: object) {
    const baseSignal: LiveSignalMsg = {
      request_id: this.requestId,
      account_token: "",
      cmd_type: "live",
      request_type: "stop",
    };
    const msg = Object.assign(baseSignal, opt);
    return JSON.stringify(msg);
  }

  generateAnswerMsg(opt: AnswerOptions) {
    const msg = Object.assign(
      {
        account_token: "",
        cmd_type: "ice",
        request_type: "answer",
        sdp: "",
      },
      opt
    );
    if (!msg.sdp) throw new Error("sdp is undefined");
    return JSON.stringify(msg);
  }

  generateHeartbeatMsg(opt?: object) {
    let msg = Object.assign(
      {
        account_token: "",
        cmd_type: "detect",
        request_type: "heartbeat",
      },
      opt
    );
    return JSON.stringify(msg);
  }

  generateIceCandidateMsg(opt?: object) {
    const msg = Object.assign(
      {
        account_token: "",
        cmd_type: "ice",
        request_type: "candidate",
        candidate: "",
      },
      opt
    );
    if (!msg.candidate) throw new Error("candidate is undefined");
    return JSON.stringify(msg);
  }
}

export default Signaling;
