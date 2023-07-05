import { Modal } from "react-bootstrap";

interface ChangeInstanceProps {
  show: boolean;
  handleClose: () => void;
  //handleSelect: (choice: number) => void;
}

export default function Events(props: ChangeInstanceProps) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>Change Map</Modal.Header>
      </Modal>
    </>
  );
}
