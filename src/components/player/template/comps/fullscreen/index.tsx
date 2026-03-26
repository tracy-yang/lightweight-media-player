import { useMemo, useState, memo } from "react";
import cn from "classnames";
import "./index.css";

interface Props {
    isFullscreen?: boolean,
    changeFullscreen: () => void
}
const Fullscreen = memo((props:Props):JSX.Element => {
    const { isFullscreen, changeFullscreen } = props;

    const [ fullscreen, setFullscreen] = useState(isFullscreen ? isFullscreen : false);

    const currentState = useMemo(() => fullscreen ? 'fullscreen-expand-filling' : 'fullscreen-fill', [fullscreen])

    const toggleScreen:React.MouseEventHandler<HTMLDivElement> = () => {
        setFullscreen(!fullscreen);
        changeFullscreen();
    }

    return (<div className="player-ctrl-btn fullscreen" onClick={ toggleScreen }>
        <i className={cn('iconfont', {[`icon-${currentState}`]: true})}></i>
    </div>)
})


export default Fullscreen;