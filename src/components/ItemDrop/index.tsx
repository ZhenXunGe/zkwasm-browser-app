import { Modal } from "react-bootstrap";
import "./style.scss";
import { itemsTable } from "../../data/gameplay";
import ItemPlaceholder from "../../assets/inventory/small_icon.png";
interface ItemDropChoices {
  show: boolean;
  itemsToShow: number[];
  handleSelect: (choice: number) => void;
}

export default function ItemDropChoices(props: ItemDropChoices) {
  //let event = itemsTable[props.itemsToShow || 0];
  return (
    <>
      <Modal show={props.show} className="game-dialog">
        <div className="item-body">
          {/* <div className="description">{event.description}</div> */}
          <div className="choice-1 choice-box ">
            <img src={ItemPlaceholder} alt="" className="item-image" />
            <div className="text">Item index - {props.itemsToShow[0]}</div>
            <div className="item-stats d-flex align-items-center flex-column">
              <div>Wisdom +12</div>
              <div>Speed +20</div>
              <div>Luck +1</div>
            </div>
            <button
              onClick={() => props.handleSelect(props.itemsToShow[0])}
            ></button>
          </div>
          <div className="choice-2 choice-box ">
            <img src={ItemPlaceholder} alt="" className="item-image" />
            <div className="text">Item index -{props.itemsToShow[1]}</div>
            <div className="item-stats d-flex align-items-center flex-column">
              <div>Wisdom +12</div>
              <div>Speed +20</div>
              <div>Luck +1</div>
            </div>
            <button
              onClick={() => props.handleSelect(props.itemsToShow[1])}
            ></button>
          </div>
          <div className="choice-3 choice-box ">
            <img src={ItemPlaceholder} alt="" className="item-image" />
            <div className="text">Item index -{props.itemsToShow[2]}</div>
            <div className="item-stats d-flex align-items-center flex-column">
              <div>Wisdom +12</div>
              <div>Speed +20</div>
              <div>Luck +1</div>
            </div>
            <button
              onClick={() => props.handleSelect(props.itemsToShow[2])}
            ></button>
          </div>
          <div className="choice-4 choice-box ">
            <img src={ItemPlaceholder} alt="" className="item-image" />

            <div className="text">Item index -{props.itemsToShow[2]}</div>
            <div className="item-stats d-flex align-items-center flex-column">
              <div>Wisdom +12</div>
              <div>Speed +20</div>
              <div>Luck +1</div>
            </div>
            <button
              onClick={() => props.handleSelect(props.itemsToShow[2])}
            ></button>
          </div>
        </div>
      </Modal>
    </>
  );
}
