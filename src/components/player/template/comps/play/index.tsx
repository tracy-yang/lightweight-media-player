import cn from "classnames";
import "./index.css";
import { useMemo, useState, memo, useEffect } from "react";

interface Props {
    isPlay?: boolean ,
    play: () => void,
}

const Play = memo((props:Props):JSX.Element => {
    const {isPlay, play} = props;

    const togglePlay = () => {
        play();
    }
    
    return (
        <div className="player-ctrl-btn play" onClick={ togglePlay }>
            <i className={cn('iconfont', {[`icon-${isPlay ? 'pause' : 'player'}`]: true})}></i>
        </div>
    )
})

export default Play;