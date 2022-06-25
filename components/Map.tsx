import React, { Component, useRef } from "react";
import MapView, { LatLng, Polygon, Region } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  CoordinateTuple,
  gridDestructure,
  latLngToCoordinate,
  linesToCoordinatePairs,
} from "../domain/lib/util";

import { mockData } from "../mocks";
import { getGridSection } from "../fetch/what3words";

const sineDeltathreshold = 0.0004;
const coordRound = 5;

type TileMapState = {
  tiles: CoordinateTuple[];
  selectedTile: string;
};

type TileMapProps = {};
export default class TileMap extends Component<TileMapProps, TileMapState> {
  mapRef: MapView | null;

  constructor(props: TileMapProps) {
    super(props);
    this.mapRef = null;
    this.state = {
      tiles: linesToCoordinatePairs(gridDestructure(mockData.lines)),
      selectedTile: "",
    };

    this.onMapDrag = this.onMapDrag.bind(this);
    this.setTile = this.setTile.bind(this);
  }

  setTile(tl: string) {
    this.setState({ selectedTile: tl });
  }

  // maybe move this to redux ? I have no idea.s
  onMapDrag(r: Region) {
    if (!!this.mapRef) {
      this.mapRef
        ?.getMapBoundaries()
        .then(({ northEast, southWest }) => {
          const latSinDelta = Math.abs(
            Math.sin(northEast.longitude) - Math.sin(southWest.longitude)
          );

          const lngSinDelta = Math.abs(
            Math.sin(northEast.latitude) - Math.sin(southWest.latitude)
          );

          if (
            latSinDelta < sineDeltathreshold ||
            lngSinDelta < sineDeltathreshold
          ) {
            getGridSection([
              latLngToCoordinate(southWest),
              latLngToCoordinate(northEast),
            ])
              .then((lines) =>
                this.setState({
                  tiles: linesToCoordinatePairs(gridDestructure(lines)),
                })
              )
              .catch((e) => {
                console.log(e);
              });
          } else {
            console.log("range too big");
          }
        })
        .catch((e) => {
          console.log("ERROR: cannot get grid");
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.mapRef = ref;
          }}
          // camera can be redone
          camera={{
            altitude: 400,
            center: {
              latitude: 51.53162275481682,
              longitude: -0.28892298029710906,
            },
            heading: -0,
            pitch: 0,
            zoom: 20,
          }}
          style={styles.map}
          onRegionChangeComplete={this.onMapDrag}
        >
          {this.state.tiles.map((coords) => {
            const { lng, lat } = coords[0];
            const key = `${lat.toFixed(coordRound)}${lng.toFixed(coordRound)}`;

            return (
              <Square
                key={`sqr-${key}`}
                diagonal={coords}
                coordKey={key}
                setTile={this.setTile}
                isSelected={key === this.state.selectedTile}
              />
            );
          })}
        </MapView>
      </View>
    );
  }
}

type SquareProps = {
  diagonal: CoordinateTuple;
  coordKey: string;
  isSelected: boolean;
  setTile: (s: string) => void;
};

/**
 *
 * @param param0
 * @returns Square drawn sw, se, ne, nw
 */

const Square = ({
  diagonal: [sw, ne],
  coordKey,
  isSelected,
  setTile,
}: SquareProps) => {
  const coordinates: LatLng[] = [
    { latitude: sw.lat, longitude: sw.lng },
    { latitude: sw.lat, longitude: ne.lng },
    { latitude: ne.lat, longitude: ne.lng },
    { latitude: ne.lat, longitude: sw.lng },
  ];

  return (
    <Polygon
      coordinates={coordinates}
      tappable={true}
      fillColor={isSelected ? "rgba(255,0,0,0.2)" : "rgba(0,0,0,0)"}
      onPress={() => {
        console.log("meow");
        setTile(coordKey);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
