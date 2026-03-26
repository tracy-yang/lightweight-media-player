import { MouseEventHandler, useState, memo, useEffect, useMemo } from "react";
import "./index.css";
import cn from 'classnames';
import { rateList } from "../../../utils/utils";
import { RateItem } from "../../../types";

interface Props {
    rate?:number,
    onChange:(rate:number) =>void
}

const Rate = memo((props:Props):JSX.Element => {
    console.log('rate组件')
    const { onChange, rate } = props;

    const currentPlaybackRate = useMemo(() => {
        return rateList.find(i => i.value === rate);
    }, [rate]);

    const changePlaybackRate = (item:RateItem) => {
        onChange(item.value);
    }

    const [showRateMenu, setShowRateMenu] = useState(false);
    const toggleRateMenu = () => {
        setShowRateMenu(!showRateMenu);
    }

    const handleMouseLeave:React.MouseEventHandler<HTMLUListElement> = ():void => {
        setShowRateMenu(!showRateMenu);
    }

    // const handleMouseOut:MouseEventHandler<HTMLElement> = ():void => {
    //     setShowRateMenu(!showRateMenu);
    // }

    return (<div className="player-ctrl-btn playback-rate">
        <div className="playback-rate-name" onClick={toggleRateMenu}>{currentPlaybackRate?.aliasName || currentPlaybackRate?.label}</div>
        <ul className={cn('playback-rate-menu', {'hidden': !showRateMenu})} onMouseLeave={handleMouseLeave}>
            {
                rateList.map(item => {
                    return (<li key={item.value} className={cn('playback-rate-menu-item', {'active': currentPlaybackRate?.value === item.value})} onClick={() => changePlaybackRate(item)}>
                        <span>{item.label}</span>
                    </li>)
                })
            }
        </ul>
    </div>)
})

export default Rate;