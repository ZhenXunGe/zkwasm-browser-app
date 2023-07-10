import { Modal } from "react-bootstrap";
import { itemsTable } from "../../data/gameplay";
import { useState } from "react";
import "./style.scss";
import { WasmInstance } from "../../types/game";
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
              <div className="item-image">
                <img src={itemsTable[selectedItemIndex].imageSource} alt="" />
              </div>
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
                <div
                  key={index}
                  className={
                    (selectedItemIndex === item ? "selected" : "") + " item"
                  }
                  onClick={() => setSelectedItemIndex(item)}
                >
                  <img src={itemsTable[item].imageSource} alt="" />
                  {/* {itemsTable[item].name} - Item Index {item} */}
                </div>
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
