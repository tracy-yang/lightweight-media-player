

// import Player from "../../components/player/index";
import Player from "../../components/player/indexHoc";


const src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const src2 = 'http://127.0.0.1:5501/lib/video/3.mp4'
const src3 = 'http://127.0.0.1:5501/lib/video/rabbit320.mp4'
const params = {
    el: document.querySelector('body')!,
    options: {
        display: {
            tools: ['rate']
        }
    }
}
const test = new Player(params)
const srcParams = {
    src: src,
    autoplay:true
}
test.loadFile(srcParams)

// let websocketUrl = 'wss://10.66.8.28:32001/';
let websocketUrl = 'ws://127.0.0.1:32000/'
const videoParams = {
    src: {
        websocket_url: websocketUrl,
        device_id: '32057100001127000001'
    },
    autoplay:true
    
}

const videoParams2 = {
    src: {
        websocket_url: websocketUrl,
        device_id: '32057100001127000001',
    },
    autoplay:true
}

const videoParams3 = {
    src: {
        websocket_url: websocketUrl,
        device_id: 'Rec17272316595870078',
        start_time: '2024-09-25 10:34:20',
        end_time: '2024-09-25 10:35:33',
    },
    autoplay:true
}
// test.loadVideo(videoParams3);

// console.log(test, 'tes333')

// setTimeout(() => {
//     console.log(test, 'tes3333')
//     test?.loadVideo(src)
// }, 1000);

test.addEventListener('play', () => {
    console.log('test-play')
})


// const player = Player({
//     el: document.querySelector('body')!
// });
// const fn = player();
// console.log(fn, 'test')
// const test = fn.loadFile();
// console.log(test, 'test333')
// test.desotry(src);
// player?.loadVideo(src);
// setTimeout(() => {
//     player.loadFile(src)
//     // player.loadVideo && player?.loadVideo(src);
// }, 2000);



const Media = () => {
    // const ref = useRef(null);
    // console.log(ref.current, 'test333')


    return (<>
        {/* <Player ref={ref}/> */}
    </>)
}

export default Media;

