import { Modal } from "react-bootstrap";
import "./style.scss";
interface InventoryProps {
  show: boolean;
  handleClose: () => void;
}

export default function Inventory(props: InventoryProps) {
  return (
    <Modal show={props.show} className="game-dialog">
      <div className="close-bag"></div>
      <div className="bag-body">
        <div className="current-item">
          <div className="item-image"></div>
          <div className="details">
            <div className="name">Weapon Name</div>
            <div className="stats">
              <div>Wisdom +12</div>
              <div>Speed +20</div>
              <div>Luck +1</div>
            </div>
          </div>
          <div className="sell">
            <span className="value">100</span>
          </div>
          <div className="use"></div>
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
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
          </div>
        </div>
      </div>
      <div className="hitbox" onClick={() => props.handleClose()}></div>
    </Modal>
  );
}
