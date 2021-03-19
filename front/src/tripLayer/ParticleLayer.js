/* global window */
import React, {useState, useEffect} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import { MAP_INITIAL_VIEW_STATE, MAPBOX_TOKEN, MAP_STYLE } from "../map/config";


// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  TRIPS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json' // eslint-disable-line
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [120.69844,27.989922, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = MAP_INITIAL_VIEW_STATE



const landCover = [[[-74.0, 40.7], [-74.02, 40.7], [-74.02, 40.72], [-74.0, 40.72]]];

const loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 2

export default function ParticleLayer({
  // buildings = DATA_URL.BUILDINGS,
  trips,
  trailLength = 50,
  initialViewState = INITIAL_VIEW_STATE,
  mapStyle = MAP_STYLE,
  theme = DEFAULT_THEME,
}) {
  // console.log("trips", trips)
  const [time, setTime] = useState(0);
  const [animation] = useState({});

const animate = () => {
      setTime(t => (t + animationSpeed) % loopLength);
      animation.id = window.requestAnimationFrame(animate);
    };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  },[animation]);

  const layers = [
    new TripsLayer({
      id: 'trips',
      data: trips,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
      opacity: 0.3,
      widthMinPixels: 2,
      rounded: true,
      trailLength,
      currentTime: time,

      shadowEnabled: false
    }),
    // new PolygonLayer({
    //   id: 'buildings',
    //   data: buildings,
    //   extruded: true,
    //   wireframe: false,
    //   opacity: 0.5,
    //   getPolygon: f => f.polygon,
    //   getElevation: f => f.height,
    //   getFillColor: theme.buildingColor,
    //   material: theme.material
    // })
  ];

  return (
    <DeckGL
      layers={layers}
      effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
    >
      <StaticMap 
          mapStyle={MAP_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}