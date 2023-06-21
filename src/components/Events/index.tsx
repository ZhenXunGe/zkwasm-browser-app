import { Modal } from "react-bootstrap";
import "./style.scss";
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
      <Modal show={props.show} className="game-dialog">
        <div className="event-body">
          <div className="image"></div>
          <div className="description">{event.description}</div>
          <div
            className="choice-a choice-box "
            onClick={() => props.handleSelect(0)}
          >
            <div className="text">{event.choices[0]}</div>
          </div>
          <div
            className="choice-b choice-box "
            onClick={() => props.handleSelect(1)}
          >
            <div className="text">{event.choices[1]}</div>
          </div>
          <div
            className="choice-c choice-box "
            onClick={() => props.handleSelect(2)}
          >
            <div className="text">{event.choices[2]}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}
