import { Modal } from "react-bootstrap";

interface InventoryProps {
  show: boolean;
  handleClose: () => void;
}

export default function Inventory(props: InventoryProps) {
  return (
    <Modal show={props.show}>
      <Modal.Header>
        <div onClick={() => props.handleClose()} role="button">
          close
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>Inventory</div>
      </Modal.Body>
    </Modal>
  );
}
