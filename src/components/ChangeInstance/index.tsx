import { Modal } from "react-bootstrap";
import "./style.scss";
interface ChangeInstanceProps {
  show: boolean;
  handleClose: () => void;
  //handleSelect: (choice: number) => void;
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
        <div className="x-marker" style={{ left: "33%", top: "35%" }}></div>
        <div className="x-marker" style={{ left: "33%", top: "50%" }}></div>
        <div className="x-marker" style={{ left: "63%", top: "38%" }}></div>
        <div className="x-marker" style={{ left: "45%", top: "60%" }}></div>
        <div className="x-marker" style={{ left: "63%", top: "75%" }}></div>
        <div
          className="hitbox"
          onClick={() => {
            props.handleClose();
          }}
        ></div>
      </Modal>
    </>
  );
}
