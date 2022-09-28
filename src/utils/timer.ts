import { PTimeout } from ".";

type TimerProps = {
  time: number; // ns
  callback: (...args: any[]) => void;
}[];

export function setTimer(tasks: TimerProps) {
  const timers = tasks.map(({ time, callback }) => {
    // setTimeout(callback, time);
    return new PTimeout(callback, time);
  });
  return {
    pause: () => timers.forEach((t) => t.pause()),
    resume: () => timers.forEach((t) => t.resume()),
  };
}
