import { useEffect, useState } from "react";
import { useTime } from "~/hooks/useTime";

const STROKE_DASHARRAY = 282;

const colors = {
  work: ["#e91e63", "#673ab7"] as const,
  break: ["#67B26F", "#4ca2cd"] as const,
};

const isBreak = (time: Date): boolean => {
  const minutes = time.getMinutes();
  return minutes >= 50;
};

const getM = (time: Date): number => {
  const minutes = time.getMinutes();
  // 休憩
  if (isBreak(time)) {
    return 59 - minutes;
  }
  return 49 - minutes;
};

const getS = (time: Date): number => {
  const seconds = time.getSeconds();
  return 59 - seconds;
};

// 8時から何回目のタイマーなのか
const getCount = (time: Date) => {
  const hours = time.getHours();
  // TODO: 24時以降の処理
  return hours - 8;
};

const zeroPadding = (num: number): string => {
  return ("0" + num.toString()).slice(-2);
};

const getProgress = (time: Date): number => {
  const m = getM(time);
  const s = getS(time);
  const ms = m * 60 + s;
  if (isBreak(time)) {
    return 1 - ms / (60 * 10);
  }
  return ms / (60 * 50);
};

const getStrokeDashoffset = (progress: number): number => {
  return progress * STROKE_DASHARRAY;
};

export const PomodoroTimer = () => {
  const time = useTime();
  const [m, setM] = useState("");
  const [s, setS] = useState("");
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<"work" | "break">("work");

  useEffect(() => {
    setM(zeroPadding(getM(time)));
    setS(zeroPadding(getS(time)));
    setCount(getCount(time));
    setProgress(getProgress(time));
    setState(isBreak(time) ? "break" : "work");
  }, [time]);

  return (
    <div className="timer" data-state={state}>
      <>
        <span className="timer__title">POMODORO</span>
        <span className="timer__content">
          {m}:{s}
        </span>
        <span className="timer__count">#{count}</span>
        <svg className="timer__svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" id="stop1" className={state} />
              <stop offset="100%" id="stop2" className={state} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDashoffset: `${getStrokeDashoffset(progress)}`,
            }}
          />
        </svg>
      </>
    </div>
  );
};
