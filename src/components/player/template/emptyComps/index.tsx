import WaitingPic from "../../assets/images/waiting.png";
import "./index.css";

const EmptyComp = ():React.ReactElement => {
    return (<div className="player-empty">
        <img src={WaitingPic} alt="empty" />
    </div>)   
}

export default EmptyComp;