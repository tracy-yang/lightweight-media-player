// @ts-nocheck
import "./css/index.css";

import { forwardRef, useImperativeHandle, useRef, Suspense,  useMemo, lazy, memo, Component, createRef, useCallback, useState} from "react";
import ReactDOM from 'react-dom/client';
import moment from "moment";

import { render, unmount } from 'rc-util/lib/React/render';
import { renderToString } from 'react-dom/server';
import { isNode } from "./utils/utils";
import { PlayerRefObject } from "./types";
import { JsxFragment } from "typescript";
import { createDOM } from "./utils/utils";
import { createPortal } from "react-dom";

import EmptyComps from "./template/emptyComps";
import Player, {RefObject} from "./template/index";
import WebRTC from "./utils/webrtc";
import { LoadVideoOptions, AddStreamOptions, RecordInfo  } from "./types";
import { webRTCEvents } from "./utils/dictionary";


interface Props {
    el: string | HTMLElement,
    options?: object
}

let act: (callback: VoidFunction) => Promise<void> | void = (callback) => callback();
// type HookAPI = keyof PlayerRefObject;

let  instanceApi:PlayerRefObject | null = null;

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

// type PlayerType = typeof import("./template/index");

// const delayPlayer = (promise:Promise<PlayerType>):Promise<PlayerType> => {
//     return new Promise((resolve) => {
//         // setTimeout(resolve, 2000);
//     }).then(res => promise)
// }

const PlayerWrapRef = forwardRef((props, ref: any) => {
    // useImperativeHandle(ref, () => {
    //     return {
    //     }
    // })
    // const LazyPlayer = lazy(() => delayPlayer(import("./template/index")));
    // return (<Suspense fallback={<EmptyComps />}>
    //     <LazyPlayer ref={ref}/>
    // </Suspense>)

    useImperativeHandle(ref, () => ({
        instance: ref
    }))

    return (<Player ref={ref} />)
})


// function renderPlayer(props: Props) {
//     const { el, options } = props;

//     const containerDOM = getContainerDOM(el);
//     const root = ReactDOM.createRoot(containerDOM);


//     return new Promise((resolve, reject) => {
//         const ref = (node:any) => {
//             // Promise.resolve().then(res => {
//                 console.log(node, 'tes33')
//                 if (node) {
//                     instanceApi = node as PlayerRefObject;
//                     resolve(node)
//                 }
//             // })
//         }

//         root.render(<PlayerWrapRef ref={ref}/>);
//     })

// }


// class PlayerMedia extends Component {
//     isReady:boolean;
//     constructor(props:Props) {
//         super(props)
//         this.isReady = false;
//     }

//     render() {
//         return(
//             <>
//                 {
//                     this.isReady ? <Player /> : <EmptyComps />
//                 }
//             </>
//         )
//     }
// }

const loadMediaStreamStatus = {
    isWaiting: 0,
    isLoading: 1,
    loaded: 2
}

class PlayerMedia {
    #api:RefObject | null;
    webRTC:WebRTC;
    loadStatus: number = loadMediaStreamStatus.isWaiting;
    
    constructor(props:Props) {
        this.#api = null;

        this.webRTC = new WebRTC();
        this.webRTC.addEventListener(webRTCEvents.videoLoadData, (opt:AddStreamOptions) => this.handleVideoLoadData(opt));
        this.webRTC.addEventListener(webRTCEvents.playProgress, (progress:number) => this.handleProgress(progress));
        this.webRTC.addEventListener(webRTCEvents.recordInfo, (recordInfo:RecordInfo[]) => this.setVideoInfo(recordInfo));
        
        this.renderPlayer(props);
    }
    
    renderPlayer(props:Props) {
        const { el, options } = props;
        const containerDOM = getContainerDOM(el);
        const root:ReactDOM.Root = ReactDOM.createRoot(containerDOM);
        this.updateRender(root);
        
        this.bindVideoEvents();
    }

    updateRender(root:ReactDOM.Root) {
        const setApi = (node:RefObject) => {
            if (node) {
                this.#api = node;
            }
        }
        // let reactDOM:JSX.Element = <EmptyComps />
        // if (this.loadStatus !== loadMediaStreamStatus.isWaiting) {
        //     reactDOM = <Player ref={setApi}/>
        // }
        root.render(<Player ref={setApi}/>);
    }

    private bindVideoEvents() {
        console.log(this.#api, 'api')
        this.#api && this.#api.addEventListener('play', () => {
            console.log('video-play');
        });
        this.#api && this.#api.addEventListener('pause', () => {
            console.log('video-pause');
        });
    }

    loadVideo(opt:LoadVideoOptions) {
        this.webRTC.createWebsocket(opt.src);
    }

    private handleVideoLoadData(opt:AddStreamOptions) {
        const {src} = opt;
        console.log(src.duration, 'test33')
        src && this.#api?.loadVideo(src);
    }

    private handleProgress(progress:number) {
        if (progress === 100) {
            this.#api?.pause();
        }
    }

    private setVideoInfo(recordInfo:RecordInfo[]) {
        console.log('data.record_info');
        const { start_time, end_time } = recordInfo[0];
        console.log(moment(start_time, moment.ISO_8601).format('ss'), 'data.record_info')

    }

    loadFile(src:string) {
        setTimeout(() => {
            this.#api?.loadVideo(src);
        }, 0);
    }

    loop(isLoop:boolean) {
        // this.webRTC.loop(isLoop);
    }
}


// class PlayerElement extends HTMLElement {
//     constructor() {
//         super();
//         this.connectedCallback()
//     }
//     // Get the attributes from the custom element 
//     connectedCallback() { 
//         const containerDOM = getContainerDOM(el);
//         const root = ReactDOM.createRoot(containerDOM);
//         const onClick = () => alert(this.getAttribute("message")); 
//         // Render the React component into the shadow root 
//         root.render(<Player />); 
//     } 
// } 
    
// customElements.define("my-button", PlayerElement); 



export default PlayerMedia;