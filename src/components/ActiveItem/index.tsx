import { Modal } from "react-bootstrap";
import { itemsTable } from "../../data/gameplay";
import "./style.scss";
import { WasmInstance } from "../../types/game";

import ItemMain from "../ItemMain";
interface ActiveItemProps {
  show: boolean;
  item_id: number;
  instance: WasmInstance;
  handleRemove: (item_id: number) => void;
  handleClose: () => void;
}

export default function ActiveItem(props: ActiveItemProps) {
  return (
    <>
      <Modal show={props.show} className="game-dialog active-item-dialog">
        <div className="close-bag"></div>
        <div className="active-item-body">
          <ItemMain
            level={props.instance.get_active_item_level(props.item_id)}
            item_id={props.item_id}
          ></ItemMain>

          <div className="name">
            {itemsTable[props.item_id].name} - Level{" "}
            {props.instance.get_active_item_level(props.item_id)}
          </div>
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
