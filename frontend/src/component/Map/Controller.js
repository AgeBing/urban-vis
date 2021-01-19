import React, { Component } from "react";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import Event from "../../util/event"
import BaseMap from "./BaseMap";
import { LAYER_CONSTRUCTOR, LAYER_TYPES, SELECT_LAYER_MODE, SELECT_EVENT_NAME } from "./config";

class Controller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: uuid(),
      controller: true,
      layers: [],
      selectLayer: null,
      selectData: null
    };
  }
  componentWillMount() {
    this.initSelectLayer()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.datas !== nextProps.datas ) {
      this.layersFactory(nextProps.datas);
    }else if(!deepCompare(this.props.datas, nextProps.datas)){
      // 对比内部 data 是否变化
      this.layersFactory(nextProps.datas);
    }
  }
  render() {
    const { layers, selectLayer, selectData } = this.state;
    return (
      <div className="deck-map">
        <BaseMap 
          layers={layers.concat(selectLayer)} 
          cursor={getCursor(selectData)}  
        />
      </div>
    );
  }
  /**
   * 图层数据 使用对应的 图层创建函数进行创建，并返回 layer
   * @param {Array} datas 
   */
  layersFactory = (datas) => {
    const layers = []
    for (let i = 0; i < datas.length; i++) {
      const { type, data } = datas[i];
      const func = LAYER_CONSTRUCTOR[type];
      if (func) {
        layers.push(func(data));
      }
    }
    this.setState({ layers });
  }
  /**
   * 框选图层
   */
  initSelectLayer = () => {
    const selectData = {
      id: uuid(),
      type: LAYER_TYPES["SELECT_LAYER"],
      data: {
        type: "FeatureCollection",
        features: [],
      },
      config: {
        visible: true,
        mode: SELECT_LAYER_MODE["VIEW"]
      }
    }
    this.setState({ selectData }) 
    this.createSelectLayer(selectData)

    // 注册响应事件
    Event.on(SELECT_EVENT_NAME['SRART_SELECT'], this.startSelect, this)
    Event.on(SELECT_EVENT_NAME['CHANGE_VISIBLE'], this.changeSelectVisible, this)
  }
  // 每次更新需要重新创建 layer
  createSelectLayer = (selectData) => {
    const cbFunc = this.handleSelectLayerFinish.bind(this)
    const selectLayer = LAYER_CONSTRUCTOR["SELECT_LAYER"](selectData, cbFunc)
    this.setState({selectLayer})
  }
  // 点击开始画区域
  startSelect = () => {
    const { selectData } = this.state
    selectData['config']['mode'] = SELECT_LAYER_MODE['DRAW']
    selectData['data'] = {
        type: "FeatureCollection",
        features: [],
    }
    this.createSelectLayer(selectData)
    this.setState({ selectData })
  }
  // 绘制结束时的回调
  handleSelectLayerFinish = (updatedData, bounds) => {
    const { selectData } = this.state
    selectData['data'] = updatedData
    selectData['config']['mode'] = SELECT_LAYER_MODE['VIEW']
    this.createSelectLayer(selectData)
    this.setState({ selectData })

    // 触发注册的事件
    Event.emit(SELECT_EVENT_NAME['FINISH_SELECT'], bounds)
  }
  // 点击改变是否可见
  changeSelectVisible = () => {

  }
}

/**
 * 图层数据
 */
Controller.propTypes = {
  datas: PropTypes.array,
};


/**
 * 工具函数
 */
const getCursor = (selectData) =>{
  const cursorDefault = "grab"
  const cursorDraw = "crosshair"
  let cursor = cursorDefault
  if(selectData && selectData["config"] 
    && selectData["config"]["mode"] === SELECT_LAYER_MODE['DRAW']){
    cursor = cursorDraw
  }
  return cursor
}

const deepCompare = (prevDatas, nextDatas) => {
  let nextDataMap = {}
  nextDatas.map(dObj => nextDataMap[ dObj['id'] ] = dObj)
  for(let i = 0; i < prevDatas.length;i++){
    let { id, data } = prevDatas[i]
    if(data !==  nextDataMap[id]['data']){
      return false
    }
  }
  return true
}

export default Controller;

