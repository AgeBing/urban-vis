import { MAP_INITIAL_VIEW_STATE, MAPBOX_TOKEN, MAP_STYLE } from "./config";
import MapGL from "react-map-gl";
import DeckGL from "@deck.gl/react";
import React, { Component } from "react";

export default class BaseMap extends Component {
  render() {
    const { layers = [], cursor = "grab" } = this.props;
    // console.log("BaseMap Layers: ", layers);
    return (
      <DeckGL
        controller
        layers={layers}
        initialViewState={MAP_INITIAL_VIEW_STATE}
        getCursor={() => cursor}
        // getTooltip={({object}) => object && `${object.name}\n${object.content}`}
      >
        <MapGL
          reuseMaps
          mapStyle={MAP_STYLE}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        ></MapGL>
      </DeckGL>
    );
  }
}
