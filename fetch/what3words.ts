import { getApi, WHAT3WORDS } from ".";
import { CoordinateTuple } from "../domain/lib/util";
import { Line } from "../domain/types";

type GetGridSectionResponseType = { lines: Line[] };

const what3WordsUrl = "https://api.what3words.com/v3/";

export const getGridSection = ([sw, ne]: CoordinateTuple) =>
  getApi<GetGridSectionResponseType>(
    what3WordsUrl +
      `grid-section?bounding-box=${sw.lat},${sw.lng},${ne.lat},${ne.lng}&format=json&key=${WHAT3WORDS}`
  ).then((res) => res.lines);
