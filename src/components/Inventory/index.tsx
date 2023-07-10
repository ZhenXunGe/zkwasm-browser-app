import { Modal } from "react-bootstrap";
import { itemsTable } from "../../data/gameplay";
import { useState } from "react";
import "./style.scss";
import { WasmInstance } from "../../types/game";
import ItemMain from "../ItemMain";
interface InventoryProps {
  show: boolean;
  ownedItems: number[];
  instance: WasmInstance;
  handleClose: () => void;
  handleUse: (item: number) => void;
}

export default function Inventory(props: InventoryProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  //console.log(props.instance.get_active_item_level(0));
  return (
    <Modal show={props.show} className="game-dialog">
      <div className="close-bag"></div>
      <div className="bag-body">
        <div className="current-item">
          {selectedItemIndex !== null && (
            <>
              <ItemMain
                level={props.instance.get_inventory_item_level(
                  selectedItemIndex
                )}
                item_id={selectedItemIndex}
                style={{ width: "120px", height: "120px" }}
              ></ItemMain>
              <div className="details">
                <div className="name">
                  {itemsTable[selectedItemIndex].name} - Level:{" "}
                  {props.instance.get_inventory_item_level(selectedItemIndex)}
                </div>
                <div className="stats">
                  <div>Wisdom +12</div>
                  <div>Speed +20</div>
                  <div>Luck +1</div>
                </div>
              </div>
              <div className="sell">
                <span className="value">100</span>
              </div>
              <div
                className="use"
                onClick={() => {
                  setSelectedItemIndex(null);
                  props.handleUse(selectedItemIndex);
                }}
              ></div>
            </>
          )}
        </div>

        <div className="bag-items">
          <div className="categories">
            <div className="clothes"></div>
            <div className="hat"></div>
            <div className="shoes"></div>
            <div className="weapon"></div>
            <div className="shield"></div>
            <div className="accessory"></div>
          </div>
          <div className="inventory-items">
            {props.ownedItems.map((item, index) => {
              return (
                <ItemMain
                  key={index}
                  className={
                    (selectedItemIndex === item ? "selected" : "") + " item"
                  }
                  level={props.instance.get_inventory_item_level(item)}
                  item_id={item}
                  onClick={() => setSelectedItemIndex(item)}
                ></ItemMain>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="hitbox"
        onClick={() => {
          props.handleClose();
          setSelectedItemIndex(null);
        }}
      ></div>
    </Modal>
  );
}
