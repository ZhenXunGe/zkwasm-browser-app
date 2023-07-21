import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { GameHistory, InputType, WasmInstance } from "../../types/game";
import { NewProveTask } from "../../modals/addNewProveTask";
import "./style.scss";
interface HistoryProps {
  restartGame: () => void;
  instance: WasmInstance;
  stack: GameHistory[];
}

export default function History(props: HistoryProps) {
  const years = GetYearSummary(props.stack);

  //TODO: From the information in each year, create a summary of the year

  return (
    <div className="historys">
      <div className="suicide" onClick={() => props.restartGame()}></div>
      <HistorySummary years={years} year={years.length - 1}></HistorySummary>
      <HistorySummary years={years} year={years.length - 2}></HistorySummary>
      <HistorySummary years={years} year={years.length - 3}></HistorySummary>
    </div>
  );
}

interface HistorySummaryProps {
  years: GameHistory[][];
  year: number;
}

const HistorySummary = ({ years, year }: HistorySummaryProps) => {
  const [taskId, setTaskId] = useState<string>("");

  const showProveButton = (year: number) => {
    if (!years[year]) return false;
    if (taskId.length != 0) return false;
    let actionCount = years[year].filter(
      (input) => input.player_input === InputType.Action
    ).length;

    if (actionCount === 12) {
      return true;
    }
    return false;
  };

  const handleTaskSubmit = (data: any) => {
    console.log(data);
    let newTaskId = data.id;
    setTaskId(newTaskId);
  };

  useEffect(() => {
    setTaskId("");
  }, [years]);

  return (
    <div className="history">
      {years[year] && (
        <>
          <div className="age">{year + 1 + "yr"}</div>
          <div className="summary">
            <div className="stamps">
              {years[year].map((input, index) => {
                if (input.player_input !== InputType.Action) return;
                return (
                  <div key={index} className="stamp">
                    {parseActionValue(input.value)}
                  </div>
                );
              })}
            </div>
            <div className="proofsubmit">
              {showProveButton(year) ? (
                <NewProveTask
                  md5="5AFFC5ED1EF5339F60DF7BBEBCCDEA2E"
                  inputs={`${years[year].length}:i64`}
                  witness={getWitness(years[year])}
                  OnTaskSubmitSuccess={handleTaskSubmit}
                ></NewProveTask>
              ) : taskId ? (
                <>
                  <a
                    href={`https://zkwasm-explorer.delphinuslab.com/task/${taskId}`}
                    target="_blank"
                    className="proof"
                  >
                    View <Spinner style={{ marginLeft: "5px" }}></Spinner>
                  </a>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const parseActionValue = (value: number) => {
  switch (value) {
    case 0:
      return "W";
    case 1:
      return "E";
    case 2:
      return "C";
    default:
      return "N";
  }
};

function padAndReverseBytes(hex: string): string {
  const padded = hex.padStart(8, "0");
  return (
    padded.slice(6, 8) +
    padded.slice(4, 6) +
    padded.slice(2, 4) +
    padded.slice(0, 2)
  );
}

function packGameHistoryToU64(gameHistory: GameHistory): string {
  const player_input_hex = padAndReverseBytes(
    (gameHistory.player_input >>> 0).toString(16)
  );

  const value_hex = padAndReverseBytes((gameHistory.value >>> 0).toString(16));
  return "0x" + value_hex + player_input_hex + ":bytes-packed";
}

const getWitness = (inputs: GameHistory[]) => {
  const witnessData = inputs.map((input) => packGameHistoryToU64(input));
  console.log("witnessData", witnessData);
  return witnessData;
};

const GetYearSummary = (input_stack: GameHistory[]) => {
  let year = 0;
  let actionCount = 0; // Count for 'Action' input type occurrences
  let years: GameHistory[][] = [[]];

  for (let i = 0; i < input_stack.length; i++) {
    const curr = input_stack[i];

    // Increment actionCount only when 'Action' input type occurs
    if (curr.player_input === InputType.Action) {
      actionCount++;
    }

    // If there are already 12 'Action' inputs in the current year and the next input is an 'Action',
    // increment the year and continue to the next input
    if (actionCount > 12 && curr.player_input === InputType.Action) {
      year++;
      actionCount = 1; // reset the action count for the new year, set to 1 as current input is an 'Action'
      years[year] = []; // Initialize the new year
    }

    // Add the current input to the current year
    years[year].push(curr);
  }

  return years;
};
