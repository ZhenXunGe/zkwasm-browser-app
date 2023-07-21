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

  function packGameHistoryToU64(gameHistory: GameHistory): string {
    const u64 =
      ((gameHistory.player_input as number) << 32) | (gameHistory.value >>> 0);
    return "0x" + u64.toString(16) + ":bytes-packed";
  }

  const getWitness = (inputs: GameHistory[]) => {
    const witnessData = inputs.map((input) => packGameHistoryToU64(input));

    return witnessData;
  };

  return (
    <div className="historys">
      <div className="suicide" onClick={() => props.restartGame()}></div>
      <NewProveTask
        md5="00064A779FC4F1EB13047A01D6AB03E9"
        inputs={`${years[years.length - 1].length}:i64`}
        witness={getWitness(years[years.length - 1])}
      ></NewProveTask>
      <div className="history">
        {years[years.length - 1] && (
          <>
            <div className="age">{years.length + "yr"}</div>
            <div className="summary">
              {years[years.length - 1].map((input, index) => {
                if (input.player_input !== InputType.Action) return;
                return (
                  <div key={index} className="stamp">
                    {parseActionValue(input.value)}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="history">
        {years[years.length - 2] && (
          <>
            addNewProveTask
            <div className="age">{years.length - 1 + "yr"}</div>
            <div className="summary">
              {years[years.length - 2].map((input, index) => {
                if (input.player_input !== InputType.Action) return;
                return (
                  <div key={index} className="stamp">
                    {parseActionValue(input.value)}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="history">
        {years[years.length - 3] && (
          <>
            <div className="age">{years.length - 2 + "yr"}</div>
            <div className="summary">
              {years[years.length - 3].map((input, index) => {
                if (input.player_input !== InputType.Action) return;
                return (
                  <div key={index} className="stamp">
                    {parseActionValue(input.value)}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
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
