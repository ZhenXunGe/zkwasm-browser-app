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
import * as gameInstance from "../js/gameplay.wasm_bg";
import { GameHistory, WasmInstance } from "../types/game";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import CurrencyDisplay from "../components/Currency";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import Events from "../components/Events";
import ItemDropChoices from "../components/ItemDrop";
import Inventory from "../components/Inventory";
import { eventsTable } from "../data/gameplay";
import { State, ActionType, Character } from "../types/game";
import { ModalOptions } from "../types/layout";
import ActiveItem from "../components/ActiveItem";

export function Main() {
  const dispatch = useAppDispatch();
  const [instance, setInstance] = useState<WasmInstance | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionType>(
    ActionType.Working
  ); // 0: working, 1: exploring, 2: coasting

  const [character, setCharacter] = useState(
    new Character(
      "Useless Fish",
      100,
      new State(0, 0, 0, 0, 0, 0, 0, 0, 0, 100),
      {
        items: [],
      },
      []
    )
  );

  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [currentModal, setCurrentModal] = useState<ModalOptions | null>(null);
  const [activeItemIndexSelected, setActiveItemIndexSelected] = useState<
    number | null
  >(null);

  let updateState = (ins: WasmInstance) => {
    let newState = new State(
      ins.get_wisdom(),
      ins.get_attack(),
      ins.get_luck(),
      ins.get_charm(),
      ins.get_family(),
      ins.get_speed(),
      ins.get_defence(),
      ins.get_age(),
      ins.get_currency(),
      ins.get_life()
    );
    let newCharacter = character.setState(newState);
    console.log("new character", newCharacter);
    setCharacter(newCharacter);
  };

  useEffect(() => {
    initGameInstance().then((ins: WasmInstance) => {
      //ins.init_rg();
      gameInstance.init_rg();
      updateState(gameInstance);
      setInstance(gameInstance);
      //let test = ins.get_item_context();
      //console.log(test, "item context"); // -> Returns undefined

      //let inventory = ins!.get_inventory();
      //console.log(inventory, "Inital inventory");
    });
  }, []);

  const handleChangeAction = (newAction: ActionType) => {
    if (isMoving) return;
    toggleScrollBackground();
    setCurrentAction(newAction);
    setIsMoving(true);
    setTimeout(() => {
      setIsMoving(false);
      instance!.action(newAction);
      let event_id = instance!.get_event();
      setCurrentEventId(event_id);
      let event = eventsTable[event_id];
      setCurrentModal("event");
      console.log("event description:", event.description);
      console.log("event choices:", event.choices.length);
      console.log("choose from", event.choices);
    }, 3000);
  };

  const handleChoice = (choice: number) => {
    if (!instance) return;
    console.log("choice", choice);
    instance.choose(choice);
    updateState(instance!);
    let item_context = instance.get_item_context();

    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        event_id: currentEventId!,
        choice_id: choice,
        character,
      };
      return [latestAction, ...prev];
    });

    setCurrentEventId(null);

    if (item_context.length > 0) {
      setCurrentModal("itemdrop");
    } else {
      setCurrentModal(null);
    }
  };

  const selectItemDrop = (choice_index: number) => {
    instance!.choose_item(choice_index);
    updateState(instance!);
    console.log(
      instance!.get_item_context(),
      "after choose - item id with option to buy"
    );

    let inventory = instance!.get_inventory();

    setCurrentModal(null);
  };

  const useItem = (item_id: number) => {
    instance!.use_item(item_id);
    updateState(instance!);
  };

  const removeActiveItem = (item_id: number) => {
    instance!.stop_use_item(item_id);
    updateState(instance!);
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

      intervalId = setInterval(() => {
        offset.current = offset.current + 0.5; // Change '1' to control the speed of scrolling
        const bg = document.querySelector(".scrolling-bg") as HTMLElement;
        bg.style.backgroundPositionX = `${offset.current}%`;
      }, 10); // Change '100' to control the speed of scrolling
    } else {
      // Stop scrolling

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
              <div className="content-border"></div>
              <div className="bottom-bar"></div>
              <div className="skills-bar"></div>
              <div className="status-bar"></div>
              <div className="scrolling-bg"></div>
              <div className="status">
                <div className="wisdom">{character.state.wisdom}</div>
                <div className="attack">{character.state.attack}</div>
                <div className="speed">{character.state.speed}</div>
                <div className="defence">{character.state.defence}</div>
                <div className="family">{character.state.family}</div>
                <div className="charm">{character.state.charm}</div>
                <div className="luck">{character.state.luck}</div>
              </div>
              <div className="actions">
                <div
                  onClick={() => handleChangeAction(ActionType.Working)}
                  className={`action-working ${
                    currentAction === 0 ? "current-action" : ""
                  }`}
                >
                  <div className="hitbox"></div>
                </div>
                <div
                  onClick={() => handleChangeAction(ActionType.Exploring)}
                  className={`action-exploring ${
                    currentAction === 1 ? "current-action" : ""
                  }`}
                >
                  <div className="hitbox"></div>
                </div>
                <div
                  onClick={() => handleChangeAction(ActionType.Coasting)}
                  className={`action-coasting ${
                    currentAction === 2 ? "current-action" : ""
                  }`}
                >
                  <div className="hitbox"></div>
                </div>
              </div>
              <div className="character">
                <div className="character-health">
                  <div className="character-name">{character.name}</div>
                  <div
                    className="health-bar"
                    style={{
                      width: `${
                        (character.state.life * 100) / character.max_life
                      }%`,
                    }}
                  >
                    {/* <div className="health-amount"></div> */}
                  </div>
                </div>
              </div>
              <div className="savings">{character.state.currency}</div>
              <div className="age">{character.state.age}</div>
              <div
                className="bag"
                onClick={() => setCurrentModal("inventory")}
              ></div>
              <div className="map"></div>
              <div className="items">
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[0]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[0]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[0] !== undefined
                      ? "item index - " + instance.get_active_items()[0]
                      : "None"}
                  </div>
                </div>
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[1]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[1]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[1] !== undefined
                      ? "item index - " + instance.get_active_items()[1]
                      : "None"}
                  </div>
                </div>
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[2]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[2]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[2] !== undefined
                      ? "item index - " + instance.get_active_items()[2]
                      : "None"}
                  </div>
                </div>
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[3]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[3]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[3] !== undefined
                      ? "item index - " + instance.get_active_items()[3]
                      : "None"}
                  </div>
                </div>
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[4]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[4]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[4] !== undefined
                      ? "item index - " + instance.get_active_items()[4]
                      : "None"}
                  </div>
                </div>
                <div className="item">
                  <div
                    className="active-item"
                    onClick={() => {
                      if (!instance?.get_active_items()[5]) return;
                      setCurrentModal("active-item");
                      setActiveItemIndexSelected(
                        instance.get_active_items()[5]
                      );
                    }}
                  >
                    Active Item -{" "}
                    {instance?.get_active_items()[5] !== undefined
                      ? "item index - " + instance.get_active_items()[5]
                      : "None"}
                  </div>
                </div>
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
      <ActiveItem
        show={currentModal === "active-item"}
        item_id={activeItemIndexSelected!}
        handleClose={handleCloseModal}
        handleRemove={removeActiveItem}
      ></ActiveItem>
      <Events
        show={currentModal === "event"}
        eventId={currentEventId}
        handleSelect={handleChoice}
      ></Events>
      <ItemDropChoices
        show={currentModal === "itemdrop"}
        itemsToShow={
          Array.from(instance?.get_item_context() || []) || [0, 1, 2]
        }
        handleSelect={selectItemDrop}
      ></ItemDropChoices>
      <Inventory
        show={currentModal === "inventory"}
        ownedItems={Array.from(instance?.get_inventory() || [])}
        handleClose={handleCloseModal}
        handleUse={useItem}
      ></Inventory>
      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
