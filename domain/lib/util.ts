import { Coordinate, GeoJson, Line } from "../types";
import { Feature, GeoJSON } from "geojson";
import { LatLng } from "react-native-maps";

export type DestructuredGrid = [Line[], Line[]];
export type CoordinateTuple = [Coordinate, Coordinate];

/**
 * TODO: Sort lines?
 * Probably best to memoize this
 * @param lines
 * @returns [ verticalLines[], horizontalLines[]]
 */
export const gridDestructure = (lines: Line[]): DestructuredGrid => {
  const [verticalLines, horizontalLines]: DestructuredGrid = [[], []];
  for (let line of lines) {
    const { start, end } = line;
    if (start.lat === end.lat) {
      horizontalLines.push(line);
    } else if (start.lng === end.lng) {
      verticalLines.push(line);
    }
  }
  return [verticalLines, horizontalLines];
};

/**
 * @param [ vericalLine[], horizontalLine[]]
 * @returns Coodinate[]
 */
export const linesToCoordinates = ([
  verticalLines,
  horizontalLines,
]: DestructuredGrid): Coordinate[] => {
  const coordinates: Coordinate[] = [];
  for (let hline of horizontalLines) {
    for (let vline of verticalLines) {
      coordinates.push({ lat: hline.start.lat, lng: vline.start.lng });
    }
  }

  return coordinates;
};

/**
 * Returns NW and NE points of a tile given a set of intersecting lines
 * Assumes ordered lines.
 * WARNING: a shape like this ( # ) would return a single square because only one square is formed.
 * @param [ vericalLine[], horizontalLine[]]
 * @returns CoordinateTuple[]
 *
 */
export const linesToCoordinatePairs = ([
  verticalLines,
  horizontalLines,
]: DestructuredGrid): CoordinateTuple[] => {
  const coordinates: CoordinateTuple[] = [];
  for (let hlineIndx = 0; hlineIndx < horizontalLines.length - 1; hlineIndx++) {
    for (let vlineIndx = 0; vlineIndx < verticalLines.length - 1; vlineIndx++) {
      const [swLat, swlng] = [
        horizontalLines[hlineIndx].start.lat,
        verticalLines[vlineIndx].start.lng,
      ];
      const [neLat, nelng] = [
        horizontalLines[hlineIndx + 1].start.lat,
        verticalLines[vlineIndx + 1].start.lng,
      ];
      coordinates.push([
        { lat: swLat, lng: swlng },
        { lat: neLat, lng: nelng },
      ]);
    }
  }

  return coordinates;
};

/**
 *
 * @param coordinates processed lat/lng coordinates
 * @returns Feature array for GeoJson composition
 */
export const coodinatesToGetJsonPoints = (
  coordinates: Coordinate[]
): Feature[] =>
  coordinates.map((coor) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [coor.lat, coor.lng],
    },
  }));

export const linesToGeoJson = (lines: Line[]): GeoJSON => ({
  type: "FeatureCollection",
  features: coodinatesToGetJsonPoints(
    linesToCoordinates(gridDestructure(lines))
  ),
});

/**
 *
 * @param param0
 * @returns Coordinate
 */
export const latLngToCoordinate = ({
  latitude,
  longitude,
}: LatLng): Coordinate => ({
  lat: latitude,
  lng: longitude,
});
