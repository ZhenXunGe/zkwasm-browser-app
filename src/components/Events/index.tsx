import { Modal } from "react-bootstrap";
import { eventsTable } from "../../data/gameplay";
import { Fragment } from "react";
interface EventsProps {
  show: boolean;
  eventId: number | null;
  handleSelect: (choice: number) => void;
}

export default function Events(props: EventsProps) {
  let event = eventsTable[props.eventId || 0];
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header>New Encounter!</Modal.Header>
        <Modal.Body className="show-grid">
          <div className="h5">Description</div>
          <div>{event.description}</div>
          <div className="mt-4 h5">Choices</div>
          {event.choices.map((choice, index) => (
            <Fragment key={index}>
              <div className="my-1 d-flex align-items-center justify-content-between">
                {choice}{" "}
                <button onClick={() => props.handleSelect(index)}>
                  Choose Choice {index + 1}
                </button>
              </div>
            </Fragment>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}
