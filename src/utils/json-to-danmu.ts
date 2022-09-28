import { Danmu } from "../type";

type Json = {
  DorC: boolean;
  Layer: number;
  Start: string; // 0:00:08.05 -> 8050
  End: string;
  Style: string;
  Name: string;
  MarginL: number;
  MarginR: number;
  MarginV: number;
  Effect: string;
  Text: string;
}[];

export function jsonToDanmu(json: Json): Danmu[] {
  return json
    .map(({ Start, Text }) => ({
      content: Text.split("}").at(-1),
      timestamp:
        Number(
          Start.split("")
            .filter((c) => c !== ":" && c !== ".")
            .join("")
        ) * 10,
    }))
    .filter((d) => d.content);
}
