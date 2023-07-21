import { Modal } from "react-bootstrap";
import { Character } from "../../types/game";
import { formatAge } from "../../utils/game";
import "./style.scss";

export interface ConfirmRestart {
  show: boolean;
  handleClose: () => void;
  handleRestart: () => void;
  character: Character;
}

export default function ConfirmRestart(props: ConfirmRestart) {
  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
      className="game-dialog"
    >
      <div className="game-over-body">
        <div className="game-highlights">
          <h2>Restart Game?</h2>
          <div className="game-highlight-stats">
            <p>Character: {props.character.name}</p>
            <p>Age: {formatAge(props.character.state.age)}</p>
            <p>Currency: {props.character.state.currency}</p>
          </div>
        </div>
        <button
          className="restart-game"
          onClick={() => {
            props.handleRestart();
            //TODO: Do not restart yet, as maybe want to do proof submission
            props.handleClose();
          }}
        ></button>
        <button
          className="keep-going"
          onClick={() => {
            //TODO: Do not restart yet, as maybe want to do proof submission
            props.handleClose();
          }}
        >
          Keep Going
        </button>
      </div>
    </Modal>
  );
}
