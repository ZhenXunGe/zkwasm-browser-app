import { Modal } from "react-bootstrap";
import { Character } from "../../types/game";
import { formatAge } from "../../utils/game";

export interface GameOverProps {
  show: boolean;
  handleClose: () => void;
  character: Character;
}

export default function GameOver(props: GameOverProps) {
  return (
    <Modal show={props.show} onHide={() => props.handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Game Over</p>
        <div>
          <p>Character: {props.character.name}</p>
          <p>Age: {formatAge(props.character.state.age)}</p>
          <p>Currency: {props.character.state.currency}</p>
        </div>
      </Modal.Body>
    </Modal>
  );
}
