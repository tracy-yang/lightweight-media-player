import { useRef, useContext, createContext, useMemo, useState, MouseEventHandler, forwardRef, memo, type Ref, useImperativeHandle, useEffect, Suspense, createElement, HTMLAttributes, VideoHTMLAttributes, DetailedHTMLProps, useCallback } from "react";
import cn from "classnames";
import { VideoContext } from "./playerContext";
import { PlayerRefObject, LoadVideoOption, MediaDisplay, defaultTools } from "../types";
import { videoEvents } from "../utils/dictionary";
import { createDOM, rateList, resolutionList } from "../utils/utils";

import "./player.css";

import Rate from "./comps/rate";
// import Video, { RefObject } from './comps/video'
import Play from "./comps/play";
import Resolution from "./comps/resolution";
import Fullscreen from "./comps/fullscreen";
import Volume from "./comps/volume";
import Progress from "./comps/progress"
import Time from "./comps/time";
import EmptyComps from "./emptyComps";
import Loading from "./loadingComps";


enum loadMediaStreamStatus {
    isWaiting,
    isLoading,
    loaded
}

enum loadStreamTypes {
    file,
    live,
    record
}


type Attrs = typeof HTMLVideoElement.prototype;

interface VideoInfo {
    isPlaying: boolean,
    currentTime: number,
    volume: number,
    duration: number,
    rate: number,
    resolution: string | number,
}

const defaultValue = 50;
const defaultPlaybackRate = rateList.find(item => item.value === 1)?.value;
const defaultResolution = resolutionList[0]?.value;


export interface RefObject {
    loadVideo: (opt: LoadVideoOption, isLiveStream:boolean) => void,
    loadFile: (opt:string) => void,
    play: () => void,
    pause: () => void,
    getDuration: () => number,
    setDuration: (duration:number) => void,
    getVolume:() => number,
    changeVolume: (volume: number) => void,
    getPlaybackRate:() => number,
    changePlayBackRate: (rate: number) => void,
    getCurrentTime:() => number,
    changeCurrentTime: (time:number) => void,
    addEventListener: (eventName:string, callback:Function) => void,
    getResolution: () => string,
    changeResolution: (resolution:string) => void
}

interface Subscribe {
    [k:string]: Function
}

const subscribes:Subscribe = {}


// const PlayerInstance = forwardRef<MediaDisplay>((props, ref) => {
//     const { tools = Array.from(defaultTools) } = props; 

//     const playerVideoArea = useRef<HTMLDivElement>(null);
//     const videoDOM = useRef<HTMLVideoElement>(null);
//     const videoWrapDom = useRef<HTMLDivElement>(null)

//     const [showBtnControlWrap, setShowBtnControlWrap] = useState(false);
//     const [videoLoadStatus, setVideoLoadStatus] = useState(loadMediaStreamStatus.isWaiting);
//     const [loadStreamType, setLoadStreamType] = useState(loadStreamTypes.file);

//     // const [isPlaying, setPlayingStatus] = useState(false);
//     // const [volume, setVolume] = useState(0);
//     // const [duration, setMediaDuration] = useState(0);
//     // const [currentTime, setCurrentTime] = useState(0);
//     // const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
//     // const [resolution, setResolution] = useState(defaultResolution);



//     const isPlaying = useRef<boolean>(false);
//     const setPlayingStatus = (val:boolean) => {
//         isPlaying.current = val;
//     }

//     const volume = useRef<number>(0);
//     const setVolume = (val:number) => {
//         volume.current = val;
//     }

//     const duration = useRef<number>(0);
//     const setMediaDuration = (val:number) => {
//         currentTime.current = val;
//     }

//     const currentTime = useRef<number>(0);
//     const setCurrentTime = (val:number) => {
//         currentTime.current = val;
//     }
    
//     const resolution = useRef<string>(defaultResolution);
//     const setResolution = (val:string) => {
//         resolution.current = val;
//     }

//     const playbackRate = useRef<number>(defaultPlaybackRate!);
//     const setPlaybackRate = (val:number) => {
//         playbackRate.current = val;
//     }


//     const showResolution = useMemo(() => tools && tools.includes('resolution'), []);


//     const __checkVideoDom = (): HTMLVideoElement | null => {
//         return videoDOM?.current;
//     }

//     useEffect(() => {
//         if (!videoDOM.current) return;
//         bindVideoEvent(videoDOM.current, listenVideoEvent);
//     }, [videoDOM]);

//     const isVertical = useMemo(() => {
//         if (videoLoadStatus === loadMediaStreamStatus.loaded) {
//             if(videoDOM.current) {
//                 const resolutionWidth = videoDOM.current.videoWidth, 
//                 resolutioinHeight = videoDOM.current.videoHeight;

//                 const wrapWidth = videoWrapDom?.current?.clientWidth || 0,
//                 wrapHeight = videoWrapDom?.current?.clientHeight || 0;
                
//                 const isVertical = wrapWidth / wrapHeight > resolutionWidth / resolutioinHeight

//                 return isVertical;
//             }
//         }
//     }, [videoLoadStatus])

//     const listenVideoEvent = (key:string, e:MouseEvent) => {
//         // const target = e.target;
//         // console.log(target, 'target')
//         // if (key === videoEvents.loadstart) {
//         //     setVideoLoadStatus(loadMediaStreamStatus.isLoading);
//         // } else if (key === videoEvents.loadeddata) {
//         //     if (videoDOM.current?.duration !== Infinity) setMediaDuration(getDuration());
//         //     setVideoLoadStatus(loadMediaStreamStatus.loaded);
//         // } else if (key === videoEvents.timeupdate) {
//         //     setCurrentTime(getCurrentTime());
//         // } else if (key === videoEvents.pause) {
//         //     setPlayingStatus(false);
//         // } else if (key === videoEvents.play) {
//         //     console.log('videoEvents.play')
//         //     setPlayingStatus(true);
//         // } else if (key === videoEvents.volumechange) {
//         //     setVolume(getVolume())
//         // } else if (key === videoEvents.ratechange) {
//         //     setPlaybackRate(getPlaybackRate())
//         // }
//     }

//     const bindVideoEvent = (DOM:HTMLVideoElement, callback:Function) => {
//         for (const key in videoEvents) {
//             if (Object.hasOwn(videoEvents,key)) {
//                 DOM.addEventListener(key, (e) => {
//                     callback && callback(key, e);
//                     subscribes[key] && subscribes[key](e);
//                 })
//             }
//         }
//     }

//     const __isCurrentFullscreenEle = (fullscreenDOM: HTMLElement):boolean => {
//         const node = document.fullscreenElement;
//         if (!node) return false;
//         return node === fullscreenDOM;
//     };
//     const changeFullscreen = useCallback(() => {
//         const fullscreenDOM = playerVideoArea.current;
//         if (!fullscreenDOM) return;
//         if (__isCurrentFullscreenEle(fullscreenDOM)) {
//             document.exitFullscreen().then(res => { });
//         } else {
//             fullscreenDOM.requestFullscreen().then(res => { })
//         }
//     }, [])

//     const toggleBtnControlWrapVisible = (flag:boolean) => {
//         if (videoLoadStatus === loadMediaStreamStatus.loaded) {
//             setShowBtnControlWrap(flag);
//         }
//     }


//     const Player = (<>
//         <div className="player">
//             <div className="player-video-area" ref={playerVideoArea} onMouseEnter={() => toggleBtnControlWrapVisible(true)} onMouseLeave={() => toggleBtnControlWrapVisible(false)}>
//                 <div className="player-video">
//                     <div ref={videoWrapDom} className={cn('player-video-wrap', isVertical ? 'vertical-fill' : 'horizontal-fill')}>
//                         <video ref={videoDOM}></video>
//                     </div>
//                 </div>
//                 <div className={cn('player-control-wrap', {'hidden': !showBtnControlWrap || videoLoadStatus !== loadMediaStreamStatus.loaded})} >
//                     <div className="player-control-top">
//                        { loadStreamType === loadStreamTypes.live ? null : <Progress currentTime={currentTime} duration={duration} onChange={changeCurrentTime}/> } 
//                     </div>
//                     <div className="player-control-bottom">
//                         <div className="player-control-bottom__left">
//                             <Play play={play} isPlay={isPlaying}/>
//                             { loadStreamType !== loadStreamTypes.live ?  <Time currentTime={currentTime} duration={duration}/> : null } 
//                         </div>
//                         <div className="player-control-bottom__right">
//                             { showResolution && <Resolution resolution={resolution} onChange={changeResolution}/> }
//                             <Rate onChange={changePlayBackRate} rate={playbackRate.current}/>
//                             <Volume onChange={changeVolume} volume={volume}/>
//                             <Fullscreen changeFullscreen={changeFullscreen}/>
//                         </div>
//                     </div>
//                 </div>
//                 {
//                     videoLoadStatus === loadMediaStreamStatus.isLoading ? 
//                     <Loading />
//                     : null
//                 }
//             </div>
//         </div>
//     </>);
// })


const useInternalPlayer = (props:MediaDisplay): readonly [RefObject, React.ReactElement] => {
    const { tools = Array.from(defaultTools) } = props; 

    const playerVideoArea = useRef<HTMLDivElement>(null);
    const videoDOM = useRef<HTMLVideoElement>(null);
    const videoWrapDom = useRef<HTMLDivElement>(null)

    const [showBtnControlWrap, setShowBtnControlWrap] = useState(false);
    const [videoLoadStatus, setVideoLoadStatus] = useState(loadMediaStreamStatus.isWaiting);
    const [loadStreamType, setLoadStreamType] = useState(loadStreamTypes.file);

    // const [isPlaying, setPlayingStatus] = useState(false);
    const [volume, setVolume] = useState(0);
    const [duration, setMediaDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    // const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
    const [resolution, setResolution] = useState(defaultResolution);


    const isPlaying = useRef<boolean>(false);
    const setPlayingStatus = (val:boolean) => {
        isPlaying.current = val;
    }

    const playbackRate = useRef<number>(defaultPlaybackRate!);
    const setPlaybackRate = (val:number) => {
        playbackRate.current = val;
    }


    const showResolution = useMemo(() => tools && tools.includes('resolution'), []);


    const __checkVideoDom = (): HTMLVideoElement | null => {
        return videoDOM?.current;
    }

    useEffect(() => {
        if (!videoDOM.current) return;
        bindVideoEvent(videoDOM.current, listenVideoEvent);
    }, [videoDOM]);

    const isVertical = useMemo(() => {
        if (videoLoadStatus === loadMediaStreamStatus.loaded) {
            if(videoDOM.current) {
                const resolutionWidth = videoDOM.current.videoWidth, 
                resolutioinHeight = videoDOM.current.videoHeight;

                const wrapWidth = videoWrapDom?.current?.clientWidth || 0,
                wrapHeight = videoWrapDom?.current?.clientHeight || 0;
                
                const isVertical = wrapWidth / wrapHeight > resolutionWidth / resolutioinHeight

                return isVertical;
            }
        }
    }, [videoLoadStatus])

    const listenVideoEvent = (key:string, e:MouseEvent) => {
        // const target = e.target;
        // console.log(target, 'target')
        if (key === videoEvents.loadstart) {
            setVideoLoadStatus(loadMediaStreamStatus.isLoading);
        } else if (key === videoEvents.loadeddata) {
            if (videoDOM.current?.duration !== Infinity) setMediaDuration(getDuration());
            setVideoLoadStatus(loadMediaStreamStatus.loaded);
        } else if (key === videoEvents.timeupdate) {
            setCurrentTime(getCurrentTime());
        } else if (key === videoEvents.pause) {
            setPlayingStatus(false);
        } else if (key === videoEvents.play) {
            console.log('videoEvents.play')
            setPlayingStatus(true);
        } else if (key === videoEvents.volumechange) {
            setVolume(getVolume())
        } else if (key === videoEvents.ratechange) {
            setPlaybackRate(getPlaybackRate())
        }
    }

    const bindVideoEvent = (DOM:HTMLVideoElement, callback:Function) => {
        for (const key in videoEvents) {
            if (Object.hasOwn(videoEvents,key)) {
                DOM.addEventListener(key, (e) => {
                    callback && callback(key, e);
                    subscribes[key] && subscribes[key](e);
                })
            }
        }
    }

    const __isCurrentFullscreenEle = (fullscreenDOM: HTMLElement):boolean => {
        const node = document.fullscreenElement;
        if (!node) return false;
        return node === fullscreenDOM;
    };
    const changeFullscreen = useCallback(() => {
        const fullscreenDOM = playerVideoArea.current;
        if (!fullscreenDOM) return;
        if (__isCurrentFullscreenEle(fullscreenDOM)) {
            document.exitFullscreen().then(res => { });
        } else {
            fullscreenDOM.requestFullscreen().then(res => { })
        }
    }, [])

    const toggleBtnControlWrapVisible = (flag:boolean) => {
        if (videoLoadStatus === loadMediaStreamStatus.loaded) {
            setShowBtnControlWrap(flag);
        }
    }

    const __setVideoAttributes = (attrs:Attrs) => {
        const video = videoDOM.current!;
        Object.entries(attrs).forEach(([key, value]) => {
            video.setAttribute(key, value);
        })
    }

  

    /*******************************expose********************************************** */

    const getCurrentTime = ():number => videoDOM?.current?.currentTime || 0;
    const getDuration = ():number => {
        if (videoDOM?.current?.duration) return videoDOM?.current?.duration;
        return 0;
    };
    const getPlaybackRate = ():number => videoDOM?.current?.playbackRate || 1;
    const getVolume = ():number => videoDOM?.current?.volume || 0;
    const getResolution = ():string => resolution || defaultResolution;

    const loadVideo = (opt: LoadVideoOption, isLiveStream:boolean) => {
        setLoadStreamType(isLiveStream ? loadStreamTypes.live : loadStreamTypes.record);
        const video = videoDOM.current!;
        if ('srcObject' in video) {
            video.srcObject = opt;
        } else {
            // const url = URL.createObjectURL(opt) as string;
            // URL.revokeObjectURL(url)
            // video.src = url;
        }
    }

    const loadFile = (opt:string) => {
        setLoadStreamType(loadStreamTypes.file);
        const video = videoDOM.current!;
        video.src = opt;
    }

    const changeVolume = useCallback((volumeNum: number ) => {
        const video = videoDOM.current!;
        const comVolume = volumeNum > 1 ? volumeNum / 100 : volumeNum;
        video.volume = parseFloat(comVolume.toFixed(2));
    },[])

    const play = useCallback(() => {
        const video = videoDOM.current!;
        if (video.paused) {
            video.play().then(() => {})
        } else {
            video.pause();
        }
    },[])

    const pause = () => {
        play();
    }

    const changeResolution = useCallback((resolution:string) => {
        setResolution(resolution);
    }, [])
   
    const changePlayBackRate = useCallback((rate: number) => {
        const video = videoDOM.current!;
        video.playbackRate = rate;
    }, [])

    const changeCurrentTime = useCallback((time: number) => {
        const video = videoDOM.current!;
        video.currentTime = time;
    }, [])

    const addEventListener = (eventName:string, callback:Function) => {
        subscribes[eventName] = callback;
    }

    const setDuration = (duration:number) => {
        setMediaDuration(duration);
    }

    

    const originFnList: RefObject = {
        loadVideo,
        loadFile,
        play,
        pause,
        getDuration,
        setDuration,
        getVolume,
        changeVolume,
        getPlaybackRate,
        changePlayBackRate,
        getCurrentTime,
        changeCurrentTime, 
        addEventListener,
        getResolution,
        changeResolution,
    }

    const exposeFnList = useMemo(() => (
        new Proxy(originFnList, {
            get(target, prop) {
                if (!Reflect.has(target, prop)) return;
                if (!__checkVideoDom()) return;
                return Reflect.get(target, prop);
            },
        })
    ), [])

    const Player = (<>
            <div className="player">
                <div className="player-video-area" ref={playerVideoArea} onMouseEnter={() => toggleBtnControlWrapVisible(true)} onMouseLeave={() => toggleBtnControlWrapVisible(false)}>
                    <div className="player-video">
                        <div ref={videoWrapDom} className={cn('player-video-wrap', isVertical ? 'vertical-fill' : 'horizontal-fill')}>
                            <video ref={videoDOM}></video>
                        </div>
                    </div>
                    <div className={cn('player-control-wrap', {'hidden': !showBtnControlWrap || videoLoadStatus !== loadMediaStreamStatus.loaded})} >
                        <div className="player-control-top">
                           { loadStreamType === loadStreamTypes.live ? null : <Progress currentTime={currentTime} duration={duration} onChange={changeCurrentTime}/> } 
                        </div>
                        <div className="player-control-bottom">
                            <div className="player-control-bottom__left">
                                <Play play={play} isPlay={isPlaying.current}/>
                                { loadStreamType !== loadStreamTypes.live ?  <Time currentTime={currentTime} duration={duration}/> : null } 
                            </div>
                            <div className="player-control-bottom__right">
                                { showResolution && <Resolution resolution={resolution} onChange={changeResolution}/> }
                                <Rate onChange={changePlayBackRate} rate={playbackRate.current}/>
                                <Volume onChange={changeVolume} volume={volume}/>
                                <Fullscreen changeFullscreen={changeFullscreen}/>
                            </div>
                        </div>
                    </div>
                    {
                        videoLoadStatus === loadMediaStreamStatus.isLoading ? 
                        <Loading />
                        : null
                    }
                </div>
            </div>
        </>);
    
    return [exposeFnList, Player];

}

export default useInternalPlayer;