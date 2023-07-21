import { Modal } from "react-bootstrap";
import { Character } from "../../types/game";
import { formatAge } from "../../utils/game";
import "./style.scss";

export interface GameOverProps {
  show: boolean;
  handleClose: () => void;
  //handleRestart: () => void;
  character: Character;
}

export default function GameOver(props: GameOverProps) {
  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
      className="game-dialog"
    >
      <div className="game-over-body">
        <div className="game-highlights">
          <h2>GAME OVER</h2>
          <div className="game-highlight-stats">
            <p>Character: {props.character.name}</p>
            <p>Age: {formatAge(props.character.state.age)}</p>
            <p>Currency: {props.character.state.currency}</p>
          </div>
        </div>
        <button
          className="restart-game"
          onClick={() => {
            //TODO: Do not restart yet, as maybe want to do proof submission
            props.handleClose();
          }}
        ></button>
      </div>
    </Modal>
  );
}
