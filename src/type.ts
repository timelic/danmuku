import type { ReactNode, CSSProperties } from "react";

export type Danmu = {
  timestamp: number;
  content: ReactNode;
  id?: string;
};

export type DanmuWrapProps = {
  children?: ReactNode;
  /**
   * 弹幕库：所有弹幕的组成
   */
  danmuku: Danmu[];
  /**
   * 设置一个 id 以免出现多个弹幕 wrap 之间的重复
   */
  id?: string;
  /**
   * 在播吗
   */
  isPlaying?: boolean;
  /**
   * 速度：1s 内经过 speed * 10% 的屏幕
   */
  speed?: number;
  /**
   * 多少个弹幕轨道
   */
  numOfChannels?: number;
};

export type DanmuBoardProps = {
  danmuList: DanmuListItem[];
  isPlaying: boolean;
};
export interface DanmuListItem extends Required<Danmu> {
  top: number;
  speed: number;
}

export type DanmuPieceProps = {
  children: ReactNode;
  style?: CSSProperties | Record<string, string | number>;
  top: number;
  isPlaying: boolean | undefined;
  speed: number | undefined;
};
