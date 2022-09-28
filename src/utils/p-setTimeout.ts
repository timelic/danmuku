export class PTimeout<T extends any[]> {
  timerId: number;
  start: number;
  remaining: number;
  callback: (...args: T) => void;
  constructor(callback: (...args: T) => void, delay: number, ...args: T) {
    this.callback = callback;
    this.remaining = delay;
    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
  }
  remove() {
    clearTimeout(this.timerId);
  }
  pause() {
    window.clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }
  resume() {
    this.start = Date.now();
    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(this.callback, this.remaining);
  }
}
