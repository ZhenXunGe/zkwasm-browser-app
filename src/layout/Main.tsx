import React, { createRef, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  loadStatus,
  selectTasks,
  tasksLoaded,
  addProvingTask,
} from "../data/statusSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import initGameInstance from "../js/game";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import CurrencyDisplay from "../components/Currency";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import Events from "../components/Events";
import Inventory from "../components/Inventory";
import { eventsTable } from "../data/gameplay";
import { State, ActionType, Character } from "../types/game";

export function Main() {
  const dispatch = useAppDispatch();
  const [instance, setInstance] = useState<any>(null);
  const [state, setState] = useState(new State(0, 0, 0, 0, 0, 0, 0, 0, 0));
  const [currentAction, setCurrentAction] = useState<ActionType>(
    ActionType.Working
  ); // 0: working, 1: exploring, 2: coasting

  const [character, setCharacter] = useState(
    new Character(
      "Useless Fish",
      0,
      100,
      100,
      new State(0, 0, 0, 0, 0, 0, 0, 0, 0)
    )
  );

  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  let updateState = (ins: any) => {
    setState(
      new State(
        ins.get_wisdom(),
        ins.get_attack(),
        ins.get_luck(),
        ins.get_charm(),
        ins.get_family(),
        ins.get_speed(),
        ins.get_defence(),
        ins.get_age(),
        ins.get_currency()
      )
    );
  };

  useEffect(() => {
    initGameInstance().then((ins: any) => {
      ins.init_rg();
      updateState(ins);
      setInstance(ins);
    });
  }, []);

  const handleChangeAction = (newAction: ActionType) => {
    if (isMoving) return;
    toggleScrollBackground();
    setCurrentAction(newAction);
    setIsMoving(true);
    setTimeout(() => {
      setIsMoving(false);
      instance.action(newAction);
      let event_id = instance.get_event();
      setCurrentEventId(event_id);
      let event = eventsTable[event_id];
      setCurrentModal("event");
      console.log("event description:", event.description);
      console.log("event choices:", event.choices.length);
      console.log("choose from", event.choices);
    }, 3000);
  };

  const handleChoice = (choice: number) => {
    instance.choose(choice);
    updateState(instance);
    setCurrentEventId(null);
    setCurrentModal(null);
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
  };

  function restartGame() {
    //reload the window for now
    window.location.reload();
  }

  const [isMoving, setIsMoving] = useState(false);
  const [movingSpeed, setMovingSpeed] = useState(0.5);

  const offset = useRef(0); // Use ref instead of state to avoid unnecessary re-renders

  // Function to start/stop the background scrolling
  const toggleScrollBackground = () => {
    setIsMoving((prevScroll) => !prevScroll);
  };

  // Start or stop scrolling the background when the 'scroll' state changes
  useEffect(() => {
    let intervalId: any;

    if (isMoving) {
      // Start scrolling
      console.log("start scrolling");
      intervalId = setInterval(() => {
        offset.current = offset.current + 0.5; // Change '1' to control the speed of scrolling
        const bg = document.querySelector(".scrolling-bg") as HTMLElement;
        console.log("offset", offset.current);
        bg.style.backgroundPositionX = `${offset.current}%`;
      }, 10); // Change '100' to control the speed of scrolling
    } else {
      // Stop scrolling
      console.log("stop scrolling");
      clearInterval(intervalId);
    }

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [isMoving]);
  return (
    <>
      <MainNavBar currency={0} handleRestart={restartGame}></MainNavBar>
      <Container className="justify-content-center mb-4">
        <Row className="mt-3">
          <Col>
            <div className="content">
              <div className="scrolling-bg"></div>
              <div className="status">
                <div className="wisdom">Wisdom: {state.wisdom}</div>
                <div className="attack">Attack: {state.attack}</div>
                <div className="speed">speed: {state.speed}</div>
                <div className="defence">defence: {state.defence}</div>
                <div className="family">Family: {state.family}</div>
                <div className="charm">charm: {state.charm}</div>
                <div className="luck">luck: {state.luck}</div>
              </div>
              <div className="actions">
                <div
                  onClick={() => handleChangeAction(ActionType.Working)}
                  className={`action-working ${
                    currentAction === 0 ? "current-action" : ""
                  }`}
                ></div>
                <div
                  onClick={() => handleChangeAction(ActionType.Exploring)}
                  className={`action-exploring ${
                    currentAction === 1 ? "current-action" : ""
                  }`}
                ></div>
                <div
                  onClick={() => handleChangeAction(ActionType.Coasting)}
                  className={`action-coasting ${
                    currentAction === 2 ? "current-action" : ""
                  }`}
                ></div>
              </div>
              <div className="character">
                <div className="character-health">
                  <div className="character-name">{character.name}</div>
                  <div className="health-bar">
                    {/* <div className="health-amount"></div> */}
                  </div>
                </div>
              </div>
              <div className="savings">{character.savings}</div>
              <div className="age">{character.state.age}</div>
              <div
                className="bag"
                onClick={() => setCurrentModal("inventory")}
              ></div>
              <div className="map"></div>
              <div className="items">
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
              </div>

              <div className="stickers">
                <div className="sticker"></div>
                <div className="sticker"></div>
                <div className="sticker"></div>
                <div className="sticker"></div>
                <div className="sticker"></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="historys">
          <div className="history"></div>
          <div className="history"></div>
          <div className="history"></div>
        </div>
      </Container>
      <Events
        show={currentModal === "event"}
        eventId={currentEventId}
        handleSelect={handleChoice}
      ></Events>
      <Inventory
        show={currentModal === "inventory"}
        handleClose={handleCloseModal}
      ></Inventory>
      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
