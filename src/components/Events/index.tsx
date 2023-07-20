import { Modal } from "react-bootstrap";
import { useState } from "react";
import "./style.scss";
import { eventsTable } from "../../data/gameplay";
import DefaultEventImage from "../../assets/event/picture.png";
import { Fragment } from "react";
interface EventsProps {
  show: boolean;
  eventId: number | null;
  handleSelect: (choice: number) => void;
}

export default function Events(props: EventsProps) {
  let event = eventsTable[props.eventId || 0]; //TODO: fix the 0 and handle null case

  return (
    <>
      <Modal show={props.show} className="game-dialog">
        <div className="event-body">
          <img
            src={event.image || DefaultEventImage}
            alt=""
            className="image"
          />
          {/* <div className="image">{selectedEventId}</div> */}
          <div className="description">{event.description}</div>
          <div
            className="choice-a choice-box "
            onClick={() => {
              props.handleSelect(0);
            }}
          >
            <div className="text">{event.choices[0].name}</div>
          </div>
          <div
            className="choice-b choice-box "
            onClick={() => {
              props.handleSelect(1);
            }}
          >
            <div className="text">{event.choices[1].name}</div>
          </div>
          <div
            className="choice-c choice-box "
            onClick={() => {
              props.handleSelect(2);
            }}
          >
            <div className="text">{event.choices[2].name}</div>
          </div>
          {/* <div className="confirm-button" onClick={() => confirmChoice()}></div> */}
        </div>
      </Modal>
    </>
  );
}
