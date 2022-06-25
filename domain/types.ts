import { GeoJSONProps } from "react-leaflet";

export type GeoJson = GeoJSONProps["data"];

export type Coordinate = {
  lng: number;
  lat: number;
};

export type Line = {
  start: Coordinate;
  end: Coordinate;
};

export type Grid = { lines: Line[] };
