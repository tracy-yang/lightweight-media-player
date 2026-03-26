import React, { MouseEventHandler, useState, memo, useMemo } from "react";
import "./index.css";
import cn from "classnames";
import { ResolutionItem } from "../../../types";
import { resolutionList } from "../../../utils/utils";

interface Props {
    resolution?: string | number,
    onChange?: (resolution:string) => void
}

const Resolution: React.FC<Props> = memo((props): JSX.Element => {
    const { resolution, onChange } = props;

    
    const currentResolution = useMemo(() => {
        return resolutionList.find(i => i.value === resolution)
    }, [resolution])

    const [showResolutionMenu, setShowResolutionMenu] = useState(false);

    const toggleResolution = () => {
        setShowResolutionMenu(!showResolutionMenu);
    }

    const changeResolution = (item: ResolutionItem) => {
        onChange && onChange(item.value)
    }

    const handleMouseLeave:MouseEventHandler<HTMLUListElement> = () => {
        setShowResolutionMenu(!showResolutionMenu);
    }

    return (<div className="player-ctrl-btn resolution">
        <div className="resolution-name" onClick={toggleResolution}>{currentResolution && currentResolution?.label + currentResolution?.aliasName}</div>
        <ul className={cn('resolution-menu', { 'hidden': !showResolutionMenu })} onMouseLeave={handleMouseLeave}>
            {
                resolutionList.map(item => {
                    return (<li key={item.value} className={cn('resolution-menu-item', { 'active': currentResolution?.value === item.value })} onClick={() => changeResolution(item)}>
                        <span>{item.label + ' ' + item.aliasName}</span>
                    </li>)
                })
            }
        </ul>
    </div>)
})

export default Resolution;