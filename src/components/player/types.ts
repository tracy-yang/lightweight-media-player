import { setRateList } from "./utils/utils";

export type LoadVideoOption = MediaStream | MediaSource | Blob | File;

export type loadFileOption = string;


export const defaultTools = ['play', 'progress', 'rate', 'resolution', 'volume', 'fullscreen'] as const;

// export type PlayerTools = (typeof defaultTools)[number]

type PlayerTools = 'play' | 'progress' | 'rate' | 'resolution' | 'volume' | 'fullscreen';

export interface MediaDisplay {
  tools?: string[]
}

export interface MediaOptions {
  display?: MediaDisplay
}


export interface RateItem {
  label: string,
  value: number,
  aliasName?: string
}

type videoResolution = '1080' | '720' | '480' | '360';

type VideoCode = 'H264' | 'H265';

type Protocal = 'webrtc' | 'rstp'

// ['1' , '2' , '3' , '4' , '5' , '6' , '7'] as const;

export enum PlaybackControlCodeEnum {
  pause = 2, 
  resume,
  changeRate = 8,  // 8 更改播放速率 通过这两个字段传值"scale":0.125,"npt":0.125
  loop, // 9 重播
}

export type PlaybackControlCode = keyof typeof PlaybackControlCodeEnum; 


export interface PlayerRefObject {
  loadVideo: (opt: LoadVideoOptions) => void;
  loadFile: (opt: string) => void;
}

interface StreamAttrsOptions {
  autoplay:boolean
}

export type AddStreamOptions = {
  src: MediaStream;
};

interface LoadOtherOptions {
  autoplay?: boolean,
  muted?: boolean,
}

export interface LoadVideoOptions extends LoadOtherOptions {
  src: LiveSrcOptions | PlaybackSrcOptions,
}

export interface LoadFileOption extends LoadOtherOptions  {
  src: string,
}

export interface LiveSrcOptions {
    websocket_url: string,
    device_id: string,
    tun_server?: string,
    protocal?: Protocal,
    video_code?: VideoCode;
    video_resolution?: videoResolution;
}

export interface PlaybackSrcOptions extends LiveSrcOptions {
    start_time:string,
    end_time: string,
    sip_file_url?:string
}

export interface PlayerControlOptions {

}

export type LiveSignalOptions = Omit<LiveSrcOptions, 'websocket_url'>

export type PlaybackStartSignalOptions = Omit<PlaybackSrcOptions, 'websocket_url'>

export type PlaybackFindRecordSignalOptions = Omit<PlaybackSrcOptions, 'websocket_url' | 'sip_file_url'>

export type PlaybackSignalOptions = Omit<PlaybackSrcOptions, 'websocket_url'>


export interface LiveSignalMsg {
    account_token?:string,
    cmd_type: string,
    request_type: string
    request_id?: string,
}   


export interface ResolutionItem {
  label: string,
  value: string,
  realValue: string,
  aliasName?: string
}

export type RecordInfo = {
  end_time:string,
  start_time:string,
  file_size: string,
  record_site:number
  record_type:string
}