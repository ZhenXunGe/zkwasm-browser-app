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
      <HistorySummary
        years={years}
        year={years.length - 1}
        key={years.length - 1}
      ></HistorySummary>
      <HistorySummary
        years={years}
        year={years.length - 2}
        key={years.length - 2}
      ></HistorySummary>
      <HistorySummary
        years={years}
        year={years.length - 3}
        key={years.length - 3}
      ></HistorySummary>
    </div>
  );
}

interface HistorySummaryProps {
  years: GameHistory[][];
  year: number;
}

const HistorySummary = ({ years, year }: HistorySummaryProps) => {
  const [taskId, setTaskId] = useState<string>("");
  const [proofSubmitted, setProofSubmitted] = useState(false);

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
    setProofSubmitted(true);
  };

  useEffect(() => {
    setTaskId("");
  }, [years]);

  const placeholderStamps = () => {
    // Default stamps
    let stamps = [];
    for (let i = 0; i < 12; i++) {
      stamps.push(
        <div key={i} className="stamp stamp-empty">
          <div className="month">{monthMapping[i]}</div>
        </div>
      );
    }

    // Substitute with year stamps if available
    let stampIndex = 0; // separate index for stamps
    for (let i = 0; i < years[year].length && stampIndex < 12; i++) {
      let input = years[year][i];

      // Skip non-action inputs
      if (input.player_input !== InputType.Action) continue;

      let stamp;
      if (input.value === 0)
        stamp = (
          <div key={stampIndex} className="stamp stamp-walk">
            <div className="month">{monthMapping[stampIndex]}</div>
          </div>
        );
      else if (input.value === 1)
        stamp = (
          <div key={stampIndex} className="stamp stamp-run">
            <div className="month">{monthMapping[stampIndex]}</div>
          </div>
        );
      else if (input.value === 2)
        stamp = (
          <div key={stampIndex} className="stamp stamp-coast">
            <div className="month">{monthMapping[stampIndex]}</div>
          </div>
        );
      else
        stamp = (
          <div key={stampIndex} className="stamp">
            <div className="month">{monthMapping[stampIndex]}</div>
          </div>
        );

      // Replace the default stamp with the year stamp
      stamps[stampIndex] = stamp;
      stampIndex++; // increment stamp index only if an action input was processed
    }

    return stamps;
  };

  return (
    <div className="history">
      {years[year] && (
        <>
          <div className="age">{year + 1 + "yr"}</div>
          <div className="summary">
            <div className="stamps">{placeholderStamps()}</div>
            <div className="proofsubmit">
              {showProveButton(year) && !proofSubmitted ? (
                <NewProveTask
                  md5="1FB071584C899F8E2E56FB668EC20331"
                  inputs={`${years[year].length}:i64`}
                  witness={getWitness(years[year])}
                  OnTaskSubmitSuccess={handleTaskSubmit}
                ></NewProveTask>
              ) : taskId && proofSubmitted ? (
                <>
                  <a
                    href={`https://zkwasm-explorer.delphinuslab.com/task/${taskId}`}
                    target="_blank"
                    className="proof"
                  ></a>
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

const monthMapping = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
    gameHistory.player_input.toString(16)
  );

  const value_hex = padAndReverseBytes(gameHistory.value.toString(16));
  return "0x" + player_input_hex + value_hex + ":bytes-packed";
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
