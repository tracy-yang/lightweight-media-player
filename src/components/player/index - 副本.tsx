// @ts-nocheck
import "./css/index.css";

import { forwardRef, useImperativeHandle, useRef, Suspense, lazy } from "react";
import ReactDOM from 'react-dom/client';
import { isNode } from "./utils/utils";
import { PlayerRefObject } from "./types";
import { JsxFragment } from "typescript";
import { createDOM } from "./utils/utils";
import { createPortal } from "react-dom";

import EmptyComps from "./template/emptyComps";
import Player from "./template/index";

interface Props {
    el: string | HTMLElement,
    options?: object
}

let act: (callback: VoidFunction) => Promise<void> | void = (callback) => callback();

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

type PlayerType = typeof import("./template/index");

const delayPlayer = (promise:Promise<PlayerType>):Promise<PlayerType> => {
    return new Promise((resolve) => {
        // setTimeout(resolve, 2000);
    }).then(res => promise)
}


const PlayerWrapRef = forwardRef((props, ref: any) => {
    // useImperativeHandle(ref, () => {
    //     return {
    //     }
    // })
    // const LazyPlayer = lazy(() => delayPlayer(import("./template/index")));
    // return (<Suspense fallback={<EmptyComps />}>
    //     <LazyPlayer ref={ref}/>
    // </Suspense>)

    useImperativeHandle(ref, () => {
        return {
            sync: () => ref.current,
            instance: ref,
        }
    })

    return (<Player ref={ref} />)
})


const renderPlayer = (props: Props) => {
    if (instanceApi) return instanceApi;
    const { el, options } = props;
    const containerDOM = getContainerDOM(el);
    const root = ReactDOM.createRoot(containerDOM);

    const handleRef = (node:any) => {
        const {instance, sync} = node || {};

        Promise.resolve().then(res => {
            console.log(node, 'tes33')
            if (instance) {
                instanceApi = node;
                renderPlayer(props);
            }
        })
    }
    act(() => {
        root.render(<PlayerWrapRef ref={handleRef}/>);
    })
}

// const Media = (props: Props) => {
//     const { el, options } = props;
//     const containerDOM = getContainerDOM(el);
//     const root = ReactDOM.createRoot(containerDOM);
//     let instanceApi = null;

//     const handleRef = (node:any) => {
//         console.log(node, 'Media')
//         instanceApi = node || {}
//     }
//     root.render(<PlayerRef ref={handleRef}/>);
// }

class Media {
    constructor(props: Props) {
        // this.init(props);

        const { el, options } = props;
        const containerDOM = getContainerDOM(el);
        const root = ReactDOM.createRoot(containerDOM);
    
        const handleRef = (node:any) => {
            const {instance, sync} = node || {};
            console.log(node, 'handleRef');
    
            // Promise.resolve().then(res => {
            //     console.log(node, 'tes33')
                if (instance) {
                    instanceApi = node;
                    console.log(instanceApi, 'instanceApi');
                }
            // })
        }
        // act(() => {
            root.render(<PlayerWrapRef ref={handleRef}/>);
        // })

        
        // return new Proxy(this, {
        //     get(target, prop) {
        //         console.log(target, prop, 'teee');
        //         return Reflect.get(target, prop);
        //     }
        // })
    }

    init(props: Props) {
        const a = renderPlayer(props)
        console.log(a, 'init')
    }

    loadVideo(src:string) {
        // setTimeout(() => {
            act(() => {
                console.log(instanceApi, 'loadVideo');
                if (instanceApi) {

                }
            })
        // }, 2000);
    }

}

// const media = new Media() as any;
// media.loadVideo();

// console.log(media, 'media')

export default Media;