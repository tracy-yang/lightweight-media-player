import { memo } from "react";
import Slider from "../../../components/slider";
import { useVideoContext } from "../../playerContext";

interface Props {
    currentTime: number,
    duration: number,
    onChange: (current:number) => void
}

const Progress = memo((props:Props):JSX.Element => {
    const { currentTime = 0, duration, onChange} = props;
    // const {currentTime, duration, setCurrentTime} = useVideoContext();

    const handleSliderChange = (progress:number) => {
        onChange(progress / 100 * duration)
    }

    return (<div>
        <Slider progress={parseFloat((currentTime / duration * 100).toFixed(2))} onChange={handleSliderChange}/>
    </div>)
})

export default Progress;