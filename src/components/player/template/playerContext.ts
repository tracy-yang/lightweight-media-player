import { createContext, useContext } from "react";

interface VideoInfo {
    duration: number,
    setDuration: (duration:number) => void,
    currentTime: number,
    setCurrentTime: (currentTime:number) => void
}


export const VideoContext = createContext<VideoInfo>({
    duration: 0, 
    setDuration: () => {},
    currentTime: 0,
    setCurrentTime: () => {}
});

export const useVideoContext = () => useContext(VideoContext);