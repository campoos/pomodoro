import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [pomodorosDone, setPomodorosDone] = useState(0);

  const FOCUS_TIME = 0.1 * 60;
  const BREAK_TIME = 0.05 * 60;
  const LONG_BREAK_TIME = 0.1 * 60;

  const getInitialTime = () => {
    if (mode === "focus") return FOCUS_TIME;
    if (mode === "break") return BREAK_TIME;
    return LONG_BREAK_TIME;
  };

  const [time, setTime] = useState(getInitialTime());

  const progress =
    ((getInitialTime() - time) / getInitialTime()) * 100;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          if (mode === "focus") {
            const newCount = pomodorosDone + 1;
            setPomodorosDone(newCount);

            if (newCount % 4 === 0) {
              setMode("longBreak");
              setTime(LONG_BREAK_TIME);
            } else {
              setMode("break");
              setTime(BREAK_TIME);
            }
          } else {
            setMode("focus");
            setTime(FOCUS_TIME);
          }

          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, pomodorosDone]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const nowSec = Math.floor(Date.now() / 1000);
  const endSec = nowSec + time;
  const endDate = new Date(endSec * 1000);

  const formattedEndTime = `${endDate.getHours()}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const handleReset = () => {
    setIsRunning(false);
    setMode("focus");
    setPomodorosDone(0);
    setTime(FOCUS_TIME);
  };

  return (
    <div className={`app ${mode}`}>
      <div className={`progress-bar-container ${time === getInitialTime() ? "disabled" : ""}`}>
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="counter">
        <h1>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </h1>

        <div className="buttons">
          <button disabled={!isRunning} onClick={handleReset}>
            Reset
          </button>

          <button onClick={() => setIsRunning(prev => !prev)}>
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>

        <span className="status">
          {mode === "focus" && "🍅 Foco"}
          {mode === "break" && "☕ Pausa"}
          {mode === "longBreak" && "🛌 Pausa longa"}
        </span>
      </div>

      <div className="finishAt">
        <h2>Concluídos: {pomodorosDone % 4}/4</h2>
        <h2>
          Termina às: <strong>{formattedEndTime}</strong>
        </h2>
      </div>
    </div>
  );
}

export default App;
