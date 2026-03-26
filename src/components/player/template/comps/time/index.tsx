
import "./index.css";
import { memo } from "react";
import { useVideoContext } from "../../playerContext";

interface Props{
    format?: Format,
    duration: number,
    currentTime: number,
}

type Format = 'hh:mm:ss';

const formatTimeText = (format:Format, second = 0, minute = 0, hour = 0) => {
    let hourText:string = '00', 
        minuteText:string = '00', 
        secondText:string = '00';
    format.split(':').forEach(i => {
        if (i.startsWith('h')) {
            hourText = String(i.length > 1 ? hour < 10 ? '0' + hour : hour : hour);
        } else if (i.startsWith('m')) {
            minuteText = String(i.length > 1 ? minute < 10 ? '0' + minute : minute : minute);
        } else if (i.startsWith('s')) {
            secondText = String(i.length > 1 ? second < 10 ? '0' + second : second : second)
        }
    })
    return `${hourText && hourText + ':'}${minuteText}:${secondText}`;
};

const formatTime = (currentTime:string | number, format:Format) => {
    if (typeof currentTime == 'string') return currentTime;
    const time = Number.isInteger(currentTime) ? currentTime : Math.floor(currentTime);
    if (!time || time < 0) return formatTimeText(format);
    if (time < 60) return formatTimeText(format, time);
    const hour = Math.floor(time / (60 * 60));
    const minute = Math.floor((time - (hour * 60 * 60)) / 60);
    const second = Math.floor(time - (hour * 60 * 60) - (minute * 60));
    return formatTimeText(format, second, minute, hour);
}



const Time = memo((props:Props):JSX.Element => {
    // const {duration, currentTime} = useVideoContext();
    const { format = 'hh:mm:ss', duration, currentTime } = props;

    return (<div className="player-ctrl-btn time">
        <span className="current-time">{formatTime(currentTime, format)}</span>
        {
            !!duration && <>
                /
                <span className="duration">{formatTime(duration, format)}</span>
            </>
        }

    </div>)
})

export default Time;