import { Modal } from "react-bootstrap";
import "./style.scss";
import { itemsTable } from "../../data/gameplay";
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
            <div className="text">Item index - {props.itemsToShow[0]}</div>
            <button onClick={() => props.handleSelect(props.itemsToShow[0])}>
              Choose This Item
            </button>
          </div>
          <div
            className="choice-2 choice-box "
            onClick={() => props.handleSelect(1)}
          >
            <div className="text">Item index -{props.itemsToShow[1]}</div>
            <button onClick={() => props.handleSelect(props.itemsToShow[1])}>
              Choose This Item
            </button>
          </div>
          <div
            className="choice-3 choice-box "
            onClick={() => props.handleSelect(2)}
          >
            <div className="text">Item index -{props.itemsToShow[2]}</div>
            <button onClick={() => props.handleSelect(props.itemsToShow[2])}>
              Choose This Item
            </button>
          </div>
          <div
            className="choice-4 choice-box "
            onClick={() => props.handleSelect(2)}
          >
            <div className="text">Item index -{props.itemsToShow[2]}</div>
            <button onClick={() => props.handleSelect(props.itemsToShow[2])}>
              Choose This Item
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
