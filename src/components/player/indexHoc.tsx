import "./css/index.css";

import React, { forwardRef, useImperativeHandle, useRef, Suspense, useMemo, lazy, memo, Component, createRef, useCallback, useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import moment from "moment";

import { render, unmount } from 'rc-util/lib/React/render';
import { renderToString } from 'react-dom/server';
import { isNode } from "./utils/utils";
import { PlayerRefObject, MediaOptions } from "./types";
import { JsxFragment } from "typescript";
import { createDOM } from "./utils/utils";
import { createPortal } from "react-dom";

import EmptyComps from "./template/emptyComps";
import useInternalPlayer, { RefObject } from "./template/index";
import Player from "./template/index_back1";


import WebRTC from "./utils/webrtc";
// import WebRTC from "./utils/webrtc_old";
import { LoadVideoOptions, AddStreamOptions, LoadFileOption, RecordInfo } from "./types";
import { webRTCEvents } from "./utils/dictionary";


interface Props {
    el: string | HTMLElement,
    options?: MediaOptions
}

interface Subscribes {
    [eventName: string]: (opt?: any) => void
}

let act: (callback: VoidFunction) => Promise<void> | void = (callback) => callback();
// type HookAPI = keyof PlayerRefObject;

let instanceApi: RefObject | null = null;

let isMounted: { current: boolean } = { current: false };

const useIsMounted = (): { current: boolean } => {
    const componentIsMounted = useRef(true)
    useEffect(() => () => { componentIsMounted.current = false }, [])
    return componentIsMounted
}

const getContainerDOM = (el: string | HTMLElement): HTMLElement => {
    if (isNode(el)) return el as HTMLElement;
    let DOM;
    if (typeof el === 'string') DOM = document.querySelector(el) as HTMLElement;
    if (DOM && isNode(DOM)) return DOM;
    const root = document.getRootNode() as HTMLElement;
    DOM = root.querySelector('body');
    if (!DOM) {
        const body = document.createElement('body');
        root.appendChild(body);
        DOM = body;
    }
    return DOM;
}


const PlayerComps = forwardRef((props, ref: any) => {
    console.log(props, 'props')
    const [api, Player] = useInternalPlayer(props);
    // instanceApi = api;
    // console.log(instanceApi, 'instanceApi-test')

    // const LazyPlayer = lazy(() => delayPlayer(import("./template/index")));
    // return (<Suspense fallback={<EmptyComps />}>
    //     <LazyPlayer ref={ref}/>
    // </Suspense>)

    useImperativeHandle(ref, () => ({
        instance: { ...api }
    }))

    return Player;
})

type Task =
    | {
        type: 'loadFile';
        config: any;
    }

let taskQueue: Task[] = [];

// const flushMedia = (root:ReactDOM.Root) => {
//     if (!instanceApi) {
//         root.render(<PlayerComps ref={(node:any)=> {
//             console.log(node, 'node');
//             if (node && node?.instance) {
//                 instanceApi = node.instance;
//                 console.log(instanceApi, 'instanceApi')
//             }
//         }} />);
//     }

//     if (!instanceApi) {
//         return;
//     }

//     taskQueue.forEach((task) => {
//         switch(task?.key) {
//             case 'loadFile': {
//                 act(() => {
//                     instanceApi?.loadVideo(task?.config)
//                 })
//                 break;
//             }
//             case 'addEventListener': {
//                 act(() => {
//                     // instanceApi?.addEventListener(task.key, task.config)
//                 })
//                 break;
//             }
//         }
//     })

//     taskQueue = [];
// }



const loadMediaStreamStatus = {
    isWaiting: 0,
    isLoading: 1,
    loaded: 2
}

const defaultVolume = 50;

class PlayerClass {
    #api: RefObject | null;
    webRTC: WebRTC;
    loadStatus: number = loadMediaStreamStatus.isWaiting;
    #subscribes: Subscribes = {};
    isLoadLiveStream: boolean = false
    _option:LoadVideoOptions | null = null;

    constructor(props: Props) {
        this.#api = null;

        this.webRTC = new WebRTC();
        this.webRTC.addEventListener(webRTCEvents.videoLoadData, (opt: AddStreamOptions) => this.handleVideoLoadData(opt))
        this.webRTC.addEventListener(webRTCEvents.playProgress, (progress:number) => this.handleProgress(progress));
        this.webRTC.addEventListener(webRTCEvents.recordInfo, (recordInfo:RecordInfo[]) => this.setVideoInfo(recordInfo));

        this.renderPlayer(props);
    }

    renderPlayer(props: Props) {
        const { el, options } = props;
        const { display = {} } = options || {};
        const containerDOM = getContainerDOM(el);
        const root = ReactDOM.createRoot(containerDOM);
        
        root.render(<PlayerComps {...display} ref={(node: any) => {
            if (node && node?.instance) {
                instanceApi = node.instance;
                this.notifyEvent();
            }
        }} />);
    }

    notifyEvent() {
        // if (taskQueue.length) {
        //     taskQueue.forEach((item:Task) => {
        //         if (item.type === 'loadFile') {
        //             instanceApi?.loadFile(item.config);
        //         }
        //     })
        //     taskQueue = [];
        // }
        if (Object.keys(this.#subscribes).length > 0) {
            if (instanceApi) {
                for (const key in this.#subscribes) {
                    if (Object.prototype.hasOwnProperty.call(this.#subscribes, key)) {
                        const callback = this.#subscribes[key];
                        instanceApi.addEventListener(key, (opt?: any) => callback && callback(opt));
                        delete this.#subscribes[key];
                    }
                }
            }
        }
    }

    private bindVideoEvents() {
        console.log(instanceApi, 'instanceApi');
        instanceApi && instanceApi.addEventListener('play', () => {
            this.webRTC.handlePlayOrPause(true);
        });
        instanceApi && instanceApi.addEventListener('pause', () => {
            console.log('video-pause');
            this.webRTC.handlePlayOrPause(false);
        });
    }

    loadVideo(opt: LoadVideoOptions) {
        const {src, autoplay = true, muted = true} = opt;
        this._option = opt;
        this.webRTC.createWebsocket(src);
        setTimeout(() => {
            this.bindVideoEvents();
        }, 0);
    }

    handleVideoLoadData(opt: AddStreamOptions) {
        const { src } = opt;
        console.log(this._option, src, 'handleVideoLoadData')
        src && instanceApi?.loadVideo(src, this.webRTC.isLiveStream);
        if (this._option) {
            const {muted = true, autoplay = true} = this._option;
            if (muted) instanceApi?.changeVolume(0);
            if (autoplay) instanceApi?.play();
        }
    }

    private handleProgress(progress:number) {
        if (progress === 100) {
            instanceApi?.pause();
        }
    }

    private setVideoInfo(recordInfo:RecordInfo[]) {
        const { start_time, end_time } = recordInfo[0];
        const start = moment(start_time, moment.ISO_8601);
        const end = moment(end_time, moment.ISO_8601);
        const duration = end.diff(start) / 1000;
        if (duration) instanceApi?.setDuration(duration);
    }

    loadFile(opt: LoadFileOption) {
        const {src, autoplay = true, muted = true} = opt;
        this.isLoadLiveStream = false;
        console.log(instanceApi, isMounted, 'instanceApi')
        setTimeout(() => {
            instanceApi?.loadFile(src as string);
            instanceApi?.changeVolume(muted ? 0 : defaultVolume);
            if (autoplay) instanceApi?.play();
        }, 0);
        // if (instanceApi) {
        //     instanceApi?.loadFile(src);
        // } else {
        //     taskQueue.push({
        //         type: 'loadFile',
        //         config: src
        //     })
        // }
    }

    loop(isLoop: boolean) {
        // this.webRTC.loop(isLoop);
    }

    addEventListener(eventName: string, callback: (opt?: any) => void) {
        const cb = typeof callback === 'function' ? callback : (opt?: any) => { };
        this.#subscribes[eventName] = cb;
    }
}

export default PlayerClass;


// function HOC(Component: any) {
//     class Wrap extends React.Component {
//         componentDidMount() {
//             console.log(instanceApi, 'instanceApi');


//         }

//         handleApi = (node: RefObject) => {
//             if (node && !instanceApi) {
//                 instanceApi = node;
//             }
//         }

//         render() {
//             return <Component ref={this.handleApi}></Component>
//         }
//     }


//     return class Player {
//         constructor(props: Props) {
//             const { el, options } = props;
//             const containerDOM = getContainerDOM(el);
//             const root = ReactDOM.createRoot(containerDOM);
//             root.render(<Wrap />);
//         }

//         loadFile(src: string) {
//             console.log(instanceApi, 'instanceApi')
//             // setTimeout(() => {
//             // instanceApi?.loadVideo(src);
//             // }, 0);
//         }
//     }
// }

// const PlayerMedia = HOC(Player);



// export default PlayerMedia

