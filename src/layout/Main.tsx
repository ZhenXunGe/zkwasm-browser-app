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
import { GameHistory, InputType, WasmInstance } from "../types/game";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";
import { formatAge } from "../utils/game";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import CurrencyDisplay from "../components/Currency";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import Events from "../components/Events";
import ItemDropChoices from "../components/ItemDrop";
import Inventory from "../components/Inventory";
import ChangeInstance from "../components/ChangeInstance";
import GameOver from "../components/GameOver";
import { eventsTable } from "../data/gameplay";
import { State, ActionType, Character } from "../types/game";
import { ModalOptions } from "../types/layout";
import ActiveItem from "../components/ActiveItem";

const initializeGame = async () => {
  await initGameInstance();
  gameInstance.init_rg();
  return gameInstance;
};

const initialInstance = initializeGame();

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
    let char = character.syncWASM(ins);
    setCharacter(char);

    if (char.state.life <= 0) {
      console.log("game over");
      setCurrentModal("gameover");
    }
  };

  useEffect(() => {
    initialInstance.then((ins: WasmInstance) => {
      console.log("setting instance");
      updateState(ins);
      setInstance(ins);
    });
  }, []);

  const handleChangeAction = (newAction: ActionType) => {
    if (!character.isAlive()) return;
    if (isMoving) return;
    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        player_input: InputType.Action,
        value: newAction,
      };
      return [latestAction, ...prev];
    });
    toggleScrollBackground();
    setCurrentAction(newAction);
    setIsMoving(true);
    instance!.action(newAction);
    let event_id = instance!.get_event();
    let event = eventsTable[event_id];
    setTimeout(() => {
      setIsMoving(false);
      setCurrentEventId(event_id);
      setCurrentModal("event");
      console.log("event description:", event.description);
      console.log("event choices:", event.choices.length);
      console.log("choose from", event.choices);
    }, 3000);
  };

  const handleChoice = (choice: number) => {
    if (!character.isAlive()) return;
    if (!instance) return;
    console.log("choice", choice);
    instance.choose(choice);

    let item_context = instance.get_item_context();
    console.log(item_context, "item context after choose");
    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        player_input: InputType.Choice,
        value: choice,
      };
      return [latestAction, ...prev];
    });

    setCurrentEventId(null);

    if (item_context.length > 0) {
      setCurrentModal("itemdrop");
    } else {
      setCurrentModal(null);
      updateState(instance!);
    }
  };

  const selectItemDrop = (choice_index: number) => {
    if (!character.isAlive()) return;
    instance!.choose_item(choice_index);
    updateState(instance!);
    console.log(
      instance!.get_item_context(),
      "after choose - item id with option to buy"
    );
    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        player_input: InputType.ItemDrop,
        value: choice_index,
      };
      return [latestAction, ...prev];
    });

    setCurrentModal(null);
  };

  const useItem = (item_id: number) => {
    if (!character.isAlive()) return;
    instance!.use_item(item_id);
    updateState(instance!);
    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        player_input: InputType.ItemUse,
        value: item_id,
      };
      return [latestAction, ...prev];
    });
  };

  const removeActiveItem = (item_id: number) => {
    if (!character.isAlive()) return;
    instance!.stop_use_item(item_id);
    updateState(instance!);
    setGameHistory((prev) => {
      let latestAction: GameHistory = {
        player_input: InputType.ItemRemove,
        value: item_id,
      };
      return [latestAction, ...prev];
    });
    setActiveItemIndexSelected(null);
    setCurrentModal(null);
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
  };

  function restartGame() {
    instance!.reset_character();
    updateState(instance!);
    setGameHistory([]);
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
              <div className="bottom-bar">
                <div className="savings">{character.state.currency}</div>
                <div className="age">{formatAge(character.state.age)}</div>
                <div className="items">
                  <div className="item">
                    <div
                      className="active-item"
                      onClick={() => {
                        if (instance!.get_active_items()[0] === undefined)
                          return;
                        console.log("active item clicked");
                        console.log(instance!.get_active_items());
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[0]
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
                        if (instance?.get_active_items()[1] === undefined)
                          return;
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[1]
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
                        if (instance?.get_active_items()[2] === undefined)
                          return;
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[2]
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
                        if (instance?.get_active_items()[3] === undefined)
                          return;
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[3]
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
                        if (instance?.get_active_items()[4] === undefined)
                          return;
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[4]
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
                        if (instance?.get_active_items()[5] === undefined)
                          return;
                        setCurrentModal("active-item");
                        setActiveItemIndexSelected(
                          instance!.get_active_items()[5]
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
              </div>
              <div className="skills-bar">
                <div className="stickers">
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                </div>
              </div>
              <div className="status-bar">
                <div className="status">
                  <div className="wisdom">{character.state.wisdom}</div>
                  <div className="attack">{character.state.attack}</div>
                  <div className="speed">{character.state.speed}</div>
                  <div className="defence">{character.state.defence}</div>
                  <div className="family">{character.state.family}</div>
                  <div className="charm">{character.state.charm}</div>
                  <div className="luck">{character.state.luck}</div>
                </div>
              </div>
              <div className="scrolling-bg"></div>
              <div className="action-pipe">
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
                <div className="character-art"></div>
              </div>

              <div
                className="bag"
                onClick={() => setCurrentModal("inventory")}
              ></div>
              <div
                className="map"
                onClick={() => setCurrentModal("instance")}
              ></div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="historys">
          <div className="suicide" onClick={() => restartGame()}></div>
          <div className="history"></div>
          <div className="history"></div>
          <div className="history"></div>
        </div>
        <div>
          {gameHistory.map((a, index) => (
            <div key={index}>
              ACTION: {a.player_input} - VALUE: {a.value}
            </div>
          ))}
        </div>
      </Container>
      {instance && (
        <>
          {activeItemIndexSelected !== null && (
            <ActiveItem
              show={currentModal === "active-item"}
              item_id={activeItemIndexSelected}
              instance={instance}
              handleClose={handleCloseModal}
              handleRemove={removeActiveItem}
            ></ActiveItem>
          )}
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
          <GameOver
            show={currentModal === "gameover"}
            character={character}
            handleClose={handleCloseModal}
          ></GameOver>
          <Inventory
            show={currentModal === "inventory"}
            instance={instance!}
            ownedItems={Array.from(instance?.get_inventory() || [])}
            handleClose={handleCloseModal}
            handleUse={useItem}
          ></Inventory>
          <ChangeInstance
            show={currentModal === "instance"}
            handleClose={handleCloseModal}
          ></ChangeInstance>
        </>
      )}

      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
