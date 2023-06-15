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
import Title from "../images/2048_title.png";

export function Main() {
  const dispatch = useAppDispatch();
  const [currency, setCurrency] = useState(20);
  const [submitURI, setSubmitURI] = useState("");

  let ready = useAppSelector(tasksLoaded);

  useEffect(() => {
    initGameInstance().then((ins: any) => {
            console.log("current wisdom", ins.get_wisdom());
            ins.step();
            console.log("post wisdom", ins.get_wisdom());

    });
  }, []);

  function restartGame() {
    //reload the window for now
    window.location.reload();
  }

  return (
    <>
      <MainNavBar currency={currency} handleRestart={restartGame}></MainNavBar>
      <Container className="justify-content-center mb-4">
        <Row className="justify-content-md-center  m-auto mt-3">
          <Col className="d-flex justify-content-between align-items-center p-0 game-width">
            <img src={Title} height="40px" alt="title" className="me-4" />
            <CurrencyDisplay
              tag="Best"
              value={12}
              className="high-score mx-2"
            ></CurrencyDisplay>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="content">
            </div>
          </Col>
        </Row>
      </Container>
      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
