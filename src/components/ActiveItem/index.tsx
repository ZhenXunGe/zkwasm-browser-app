import { Modal } from "react-bootstrap";
import "./style.scss";
interface ActiveItemProps {
  show: boolean;
  item_id: number;
  handleRemove: (item_id: number) => void;
  handleClose: () => void;
}

export default function ActiveItem(props: ActiveItemProps) {
  return (
    <>
      <Modal show={props.show} className="game-dialog active-item-dialog">
        <div className="close-bag"></div>
        <div className="active-item-body">
          <div className="item-image"></div>
          <div className="name">Item Index - {props.item_id}</div>
          <div className="stats">
            <div>Wisdom +12</div>
            <div>Speed +20</div>
            <div>Luck +1</div>
          </div>
          <div className="sell"></div>
          <div
            className="remove"
            onClick={() => props.handleRemove(props.item_id)}
          ></div>
        </div>
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