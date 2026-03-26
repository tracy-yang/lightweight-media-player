import React, { MouseEventHandler, useState, useRef, useMemo, memo, useReducer, useEffect } from "react";
import classes from "./index.module.css";
import cn from "classnames";

interface Props {
    vertical?: boolean,
    max?: number,
    min?: number,
    progress?: number,
    onChange?: (state:number)=> void
}

const defaultBoundary = {
    max: 100, 
    min: 0
}
const dragStatus = {
    idle: '0',
    dragging: '1',
};

const getComputedStyle = (node: HTMLElement, propName: string):number => {
    if (!node) return 0;
    const style = window.getComputedStyle(node);
    if (!style) return 0;
    const strValue = style.getPropertyValue(propName);
    return !strValue ? 0 : parseInt(strValue);
}



const Slider = memo((props:Props):JSX.Element => {
    const { vertical, onChange, progress = 0 } = props;

    let currentDragStatus = dragStatus.idle;

    const posName = vertical ? 'clientY' : 'clientX';
    const styleName = vertical ? 'bottom' : 'left';
    const wrapPropName = vertical ? 'height' : 'width';

    let startX = 0;
    let sliderWrapSize = 0;
    // let sliderBtnSize = 0;

    const [currentProgress, setCurrentProgress] = useState(progress);

    useEffect(()=> {
        setCurrentProgress(progress)
    }, [progress])

    
    const sliderWrap = useRef(null);
    const sliderBtn = useRef(null);

    // const reducer = (state:any, action:any) => {
    //     // if (action.type == '')
    //     console.log(state, action, 'reducer');
    // }

    // const [state, dispatch] = useReducer(reducer, {[`${styleName}`]: '0', [`${wrapPropName}`]: '0'})

      
    
    const handleMouseMove = (e:MouseEvent):void => {
        e.stopPropagation();
        if (currentDragStatus === dragStatus.dragging) {
            const currentPos = e[posName];
            let distance = 0;
            if (vertical) {
                distance =  (startX - currentPos) / sliderWrapSize * 100;
            } else {
                distance =  (currentPos - startX) / sliderWrapSize * 100;
            }
            let newPosition = distance + currentProgress;
            // const offset = sliderBtnSize / sliderWrapSize * 100;

            if (newPosition > defaultBoundary.max) {
                newPosition = defaultBoundary.max;
            } else if (newPosition < defaultBoundary.min) {
                newPosition = defaultBoundary.min;
            }

            let resultValue = Math.floor(Number(newPosition));

            setCurrentProgress(resultValue);
            onChange && onChange(resultValue);
        }
    }

    const handleMouseUp:EventListener = (e):void => {
        e.stopPropagation();
        document.removeEventListener('mousemove', handleMouseMove, false);
    }

    const bindEvent = () => {
        document.addEventListener('mousemove', handleMouseMove, false);
        document.addEventListener('mouseup', handleMouseUp, false);
    }

    const handleMouseDown:React.MouseEventHandler<HTMLDivElement> = (e:React.MouseEvent<HTMLDivElement, MouseEvent>):void => {
        e.stopPropagation();
        currentDragStatus = dragStatus.dragging;
        startX = e[posName];
        if (sliderWrap.current) {
            const dom = sliderWrap.current as HTMLElement;
            const sliderRect:DOMRect = dom.getBoundingClientRect();
            sliderWrapSize = sliderRect[wrapPropName];
        }
        // if (sliderBtn.current) {
        //     const dom = sliderBtn.current as HTMLElement;
        //     const sliderBtnRect:DOMRect = dom.getBoundingClientRect();
        //     sliderBtnSize = sliderBtnRect[wrapPropName];
        // }
        bindEvent();
    }

    return (<div className={cn(classes.slider, )} ref={sliderWrap}>
        <div className={cn(classes.slider__runway, {[`${classes['is-vertical']}`]: vertical})} >
            <div className={classes.slider__bar} style={{[`${wrapPropName}`]: currentProgress + '%'}}></div>
            <div className={classes['slider__button-wrap']} onMouseDown={handleMouseDown} style={{[`${styleName}`]: currentProgress + '%'}}>
                <div className={classes.slider__button}  ref={sliderBtn}></div>
            </div>
        </div>
    </div>)
})

export default Slider;