import { FC, useEffect, useState, memo, useRef, CSSProperties } from "react";
import styles from "./index.module.scss";
import {
  Danmu,
  DanmuBoardProps,
  DanmuListItem,
  DanmuPieceProps,
  DanmuWrapProps,
} from "./type";
import { setTimer } from "./utils";
import classnames from "classnames";
export * from "./type";

const DanmuPiece: FC<DanmuPieceProps> = memo(
  ({ children, style, isPlaying, speed = 1.25, top }) => {
    const cssVars = {
      "--sec": `${10 / speed}s`,
      "--top": `${top}px`,
    } as CSSProperties;
    return (
      <span
        style={{
          ...style,
          ...cssVars,
        }}
        className={classnames(styles["danmu-piece"], styles.run, {
          [styles.paused]: !isPlaying,
        })}
      >
        {children}
      </span>
    );
  }
);

const DanmuBoard: FC<DanmuBoardProps> = ({ danmuList, isPlaying }) => {
  return (
    <>
      {danmuList.map(({ content, id, top, speed }) => (
        <DanmuPiece key={id} top={top} speed={speed} isPlaying={isPlaying}>
          {content}
        </DanmuPiece>
      ))}
    </>
  );
};

export const DanmuWrap: FC<DanmuWrapProps> = (props) => {
  const {
    children,
    danmuku,
    speed = 1.25,
    isPlaying = true,
    numOfChannels = 10,
  } = props;
  const core = useRef(new Core(numOfChannels));
  const [danmuList, setDanmuList] = useState<DanmuBoardProps["danmuList"]>([]);
  const pauseTimer = useRef<(() => void) | undefined>(),
    resumeTimer = useRef<(() => void) | undefined>();
  useEffect(() => {
    const { pause, resume } = setTimer(
      setDanmukuId(danmuku).map(({ content, timestamp, id }) => ({
        time: timestamp,
        callback: async () => {
          const channelId = await core.current.addDanmu(
            200 * Number(content?.toString()?.length)
          );
          if (channelId < 0) return;
          const top = channelId * (14 + 6);
          setDanmuList((l) => [...l, { content, timestamp, id, top, speed }]);
          const _timer = setTimeout(() => {
            setDanmuList((existPool) => removeDanmu(existPool, id));
            clearTimeout(_timer);
          }, (10 / speed) * 1000 + 100);
        },
      }))
    );
    [pauseTimer.current, resumeTimer.current] = [pause, resume];
  }, []);
  useEffect(() => {
    console.log(isPlaying, pauseTimer);
    isPlaying ? resumeTimer.current?.() : pauseTimer.current?.();
  }, [isPlaying]);
  return (
    <div className={styles["danmu-wrap"]}>
      {children}
      <DanmuBoard danmuList={danmuList} isPlaying={isPlaying} />
    </div>
  );
};

function setDanmukuId(danmuku: Danmu[]): Required<Danmu>[] {
  return danmuku.map((d) => {
    d.id = d.id || ID();
    return d as Required<Danmu>;
  });
}

function removeDanmu(elements: DanmuListItem[], id: string) {
  return elements.filter((e) => e.id !== id);
}

const ID = function () {
  return "_" + Math.random().toString(36).slice(2, 9);
};

class Core {
  channels: boolean[];
  lock = false;
  constructor(channelsAmount: number) {
    this.channels = new Array(channelsAmount).fill(false);
  }
  /**
   * @params lastingTime: 这个弹幕进场时候需要的时间
   * @return channelId：从 0 算起的
   */
  add(lastingTime: number) {
    if (this.lock) return -1;
    this.lock = true;
    let channelId = -1;
    for (let i = 0; i < this.channels.length; i++) {
      if (!this.channels[i]) {
        // 占据这个轨道
        this.channels[i] = true;
        channelId = i;
        const timer = setTimeout(() => {
          this.channels[i] = false;
          clearTimeout(timer);
        }, lastingTime);
        break;
      }
    }
    this.lock = false;
    return channelId;
  }
  /**
   * @params lastingTime: 这个弹幕进场时候需要的时间
   * @return channelId：从 0 算起的
   */
  async addDanmu(lastingTime: number) {
    let channelId = this.add(lastingTime);
    for (let i = 0; i < 3; i++) {
      if (channelId < 0) {
        channelId = this.add(lastingTime);
      } else {
        break;
      }
      await sleep(200);
    }
    return channelId;
  }
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
