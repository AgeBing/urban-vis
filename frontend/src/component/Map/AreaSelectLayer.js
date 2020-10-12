import { EditableGeoJsonLayer, ViewMode, DrawPolygonMode } from "nebula.gl";
import { SELECT_LAYER_MODE } from "./config"
const LAYER_NAME = "AREA_SELECT_LAYER";

export const createAreaSelectLayer = (props = {}, handleSelectFinish) => {
  const { data, config } = props;
  let {
    visible,
    mode 
  } = config
  mode = mode === SELECT_LAYER_MODE['VIEW'] ? ViewMode : DrawPolygonMode

  return new EditableGeoJsonLayer({
    id: LAYER_NAME + Math.random(),
    visible,
    data: data || initialGeojson,
    mode,
    selectedFeatureIndexes: [],
    getLineWidth: 1,
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 2,
    getTentativeFillColor: [255, 255, 255, 0],
    getLineDashArray: [1, 2],
    onEdit: ({ updatedData, editType, featureIndexes }) => {
      if (editType === "addFeature"){
        // console.log(JSON.stringify(updatedData));
        const bounds = updatedData['features'][0]['geometry']['coordinates'][0]
        handleSelectFinish && handleSelectFinish(updatedData, bounds)
      }
    },
  });
};

const initialGeojson = {
  type: "FeatureCollection",
  features: [],
};

// const polygonGeojson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {},
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [118.09653203375495, 24.504953343313737],
//             [118.07977011694756, 24.468665903075927],
//             [118.11146380416416, 24.45277745862921],
//             [118.15109456485071, 24.4582034034822],
//             [118.15709506842158, 24.514097032881075],
//             [118.09653203375495, 24.504953343313737],
//           ],
//         ],
//       },
//     },
//   ],
// };
