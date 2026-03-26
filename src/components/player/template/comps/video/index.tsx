import { forwardRef, useRef, useImperativeHandle, useEffect, type Ref, useCallback, useContext } from "react";
import { videoEvents } from "../../../utils/dictionary";
import { useVideoContext } from "../../playerContext";
import { LoadVideoOption } from "../../../types";


interface Props {

}

interface Subscribe {
    [k:string]: Function
}

const subscribes:Subscribe = {}


export interface RefObject {
    loadVideo: (opt: LoadVideoOption) => void,
    play: () => void,
    pause: () => void,
    duration: () => number,
    volume:() => number,
    changeVolume: (volume: number) => void,
    playbackRate:() => number,
    changePlayBackRate: (rate: number) => void,
    getCurrentTime:() => number,
    changeCurrentTime: (time:number) => void,
    addEventListener: (eventName:string, callback:Function) => void
}

const Video = forwardRef((props: Props, ref: Ref<RefObject>) => {
    const {setDuration, setCurrentTime, currentTime} = useVideoContext()

    const videoDOM = useRef<HTMLVideoElement>(null);
    const videoWrap = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!videoDOM.current) return;
        bindVideoEvent(videoDOM.current, setVideoInfo);
    }, [videoDOM])

    useEffect(()=> {
        changeCurrentTime(currentTime);
    }, [currentTime])


    const __checkVideoDom = (): HTMLVideoElement | null => {
        return videoDOM?.current;
    }

    const setVideoInfo = (key:string, e:MouseEvent) => {
        if (key === videoEvents.loadeddata) {
            setDuration(duration());
        } else if (key === videoEvents.timeupdate) {
            setCurrentTime(videoDOM.current?.currentTime || 0);
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





    /**********************************expose***********************************************/

    const getCurrentTime = ():number => videoDOM?.current?.currentTime || 0;
    const duration = ():number => videoDOM?.current?.duration || 0;
    const playbackRate = ():number => videoDOM?.current?.playbackRate || 1;
    const volume = ():number => videoDOM?.current?.volume || 0;


    const loadVideo = (opt: LoadVideoOption) => {
        const video = videoDOM.current!;
        if (typeof opt == 'string') {
            video.src = opt;
        } else {
            if ('srcObject' in video) {
                video.srcObject = opt;
            } else {
                // const url = URL.createObjectURL(opt) as string;
                // URL.revokeObjectURL(url)
                // video.src = url;
            }
        }
    }

    const changeVolume = (volume: number) => {
        const video = videoDOM.current!;
        const comVolume = volume > 1 ? volume / 100 : volume;
        video.volume = parseFloat(comVolume.toFixed(2));
    }

    const play = () => {
        const video = videoDOM.current!;
        if (video.paused) {
            video.play().then(() => { })
        } else {
            video.pause();
        }
    }

    const pause = () => {
        play();
    }
   
    const changePlayBackRate = (rate: number) => {
        const video = videoDOM.current!;
        video.playbackRate = rate;
    }

    const changeCurrentTime = (time: number) => {
        const video = videoDOM.current!;
        video.currentTime = time;
    }

    const addEventListener = (eventName:string, callback:Function) => {
        subscribes[eventName] = callback;
        console.log(subscribes, 'subscribes')
    }


    const originFnList: RefObject = {
        loadVideo,
        play,
        pause,
        duration,
        volume,
        changeVolume,
        playbackRate,
        changePlayBackRate,
        getCurrentTime,
        changeCurrentTime, 
        addEventListener
    }

    const exposeFnList = new Proxy(originFnList, {
        get(target, prop) {
            if (!Reflect.has(target, prop)) return;
            if (!__checkVideoDom()) return;
            return Reflect.get(target, prop);
        },
    })

    useImperativeHandle(ref, () => exposeFnList)

    return (<></>)
})


export default Video;