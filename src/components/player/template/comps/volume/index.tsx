import { useMemo, useState, useRef, useEffect, memo } from "react";
import cn from "classnames";
import "./index.css";
import Slider from "../../../components/slider";

interface Props {
    volume: number,
    onChange: (volume:number) => void
}

const defaultVolume = 50;

const Volume = memo((props:Props):JSX.Element => {
    console.log('volume组件')
    const { volume, onChange } = props;

    const volumeAlias = useMemo(() => {
        return volume > 1 ? volume : Math.floor(volume * 100);
    }, [volume]);

    const [showVolumeMenu, setShowVolumeMenu] = useState(false);

    const toggleVolume:React.MouseEventHandler<HTMLDivElement> = ():void => {
        onChange(volume ? volume > 0 ? 0 : volume : defaultVolume);
    }

    let timer:NodeJS.Timeout;
    const handleTriggerMouseEnter:React.MouseEventHandler<HTMLDivElement> = ():void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setShowVolumeMenu(true);
        }, 50);
    }

    const handleMouseLeave:React.MouseEventHandler<HTMLDivElement> = ():void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setShowVolumeMenu(false);
        }, 50)
    }

    const handleSliderChange = (progress:number):void => {
        onChange(progress);
    }
    return (<div className="player-ctrl-btn volume">
        <div className="volume-name" onClick={toggleVolume} onMouseEnter={handleTriggerMouseEnter} onMouseLeave={handleMouseLeave}>
            <i className={cn('iconfont', {[`icon-${volume > 0 ? 'volume' : 'mute'}`]: true})}></i>
        </div>
        <div className={cn('volume-range-wrap', {'hidden': !showVolumeMenu})} onMouseEnter={handleTriggerMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="volume-number">{volumeAlias}</div>
            <Slider vertical={true} onChange={handleSliderChange} progress={volumeAlias}/>
        </div>
    </div>)
})

export default Volume