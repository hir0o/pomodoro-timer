import { useTime } from "~/hooks/useTime";

const STROKE_DASHARRAY = 282;

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
  return num.toString().padStart(2, "0");
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
  const minutes = zeroPadding(time.getMinutes());
  const seconds = zeroPadding(time.getSeconds());
  const count = getCount(time);
  const progress = getProgress(time);
  const state = isBreak(time) ? "break" : "work";

  return (
    <div className="timer" data-state={state}>
      <>
        <span className="timer__state timer__state--work">Work</span>
        <span className="timer__state timer__state--break">Break</span>
        <span className="timer__content">
          {minutes}:{seconds}
        </span>
        <span className="timer__count">No.{count}</span>
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
