import { TripsLayer } from '@deck.gl/geo-layers';
import { timeInterval } from 'd3';
import React, {useState, useEffect} from 'react';
// https://deck.gl/docs/api-reference/layers/path-layer

/**
 * 出租车轨迹数据
 * @param {Array} data
 *    [{
 *      carNo: "0003cfd5bbad9bc9ce91b39bfc19a45d",
 *      points: [
 *        {
 *          lat: "24.470886",
 *          lon: "118.097338",
 *          time: "2020-06-18 00:00:19",
 *       }
 *      ]
 *    }]
 */
const TIMESTAMP  = new Date("2020-06-18T00:00:00.000Z").getTime();

export function TripLayer( data ){
  const trailLength = 180,
  loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 10

  // const animate = () => {
  //   setTime(t => (t + animationSpeed) % loopLength);
  //   animation.id = window.requestAnimationFrame(animate);
  // };

  // useEffect(
  //   () => {
  //     animation.id = window.requestAnimationFrame(animate);
  //     return () => window.cancelAnimationFrame(animation.id);
  //   },
  //   [animation]
  // );

  let time = 0
  //     animation = {}
  
  // const animate = () => {
  //   time = ((time + animationSpeed) % loopLength)
  //   console.log(time)
  // }

  // let timeout = 500
  // setInterval(() => {
  //   animate();
  // }, timeout);
  

  return new TripsLayer({
    id: 'trips-layer',
    data,
    getPath: d => {
      const points = d['points']
      return points.map(p => [p['lon'], p['lat']])
    },
    getTimestamps: d => {
      const points = d['points']
      let startTimeStamp = new Date(points[0]['time']).getTime();
      startTimeStamp = Math.floor(startTimeStamp / 1000)
      let ts =  points.map(p => Math.floor(new Date(p['time']).getTime() / 1000) - startTimeStamp)
      console.log(ts)
      return ts
    },
    getColor: [253, 128, 93],
    opacity: 0.8,
    widthMinPixels: 5,
    rounded: true,
    trailLength: 200,
    currentTime: time,
  });

}