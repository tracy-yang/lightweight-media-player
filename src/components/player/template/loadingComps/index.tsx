

import classes from "./index.module.css";

const Loading = ():React.ReactElement => {
    return ( 
        <div className={classes['player-loading-panel']}>
            <div className={classes['player-loading-panel__text']}></div>
            <div className={classes['player-loading-panel__icon-wrap']}>
                <div className={classes['player-loading-panel-icon']}>
                </div>
            </div>
        </div>
    )
}

export default Loading;