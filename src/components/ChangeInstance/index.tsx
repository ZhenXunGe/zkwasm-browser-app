import { Modal } from "react-bootstrap";
import "./style.scss";
interface ChangeInstanceProps {
  show: boolean;
  currentMap: number;
  handleClose: () => void;
  handleSelect: (choice: number) => void;
}

export default function Events(props: ChangeInstanceProps) {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        className="game-dialog"
      >
        <div className="close-bag"></div>
        <div className="instance-body"></div>
        <div
          className="x-marker"
          style={{ left: "33%", top: "35%" }}
          onClick={() => props.handleSelect(0)}
        ></div>
        <div
          className="x-marker"
          style={{ left: "33%", top: "50%" }}
          onClick={() => props.handleSelect(1)}
        ></div>
        <div
          className="x-marker"
          style={{ left: "63%", top: "38%" }}
          onClick={() => props.handleSelect(2)}
        ></div>
        <div
          className="x-marker"
          style={{ left: "45%", top: "60%" }}
          onClick={() => props.handleSelect(3)}
        ></div>
        <div
          className="x-marker"
          style={{ left: "63%", top: "75%" }}
          onClick={() => props.handleSelect(4)}
        ></div>
        <div
          className="hitbox"
          onClick={() => {
            props.handleClose();
          }}
        ></div>
        <div className="location-name">{props.currentMap}</div>
      </Modal>
    </>
  );
}
