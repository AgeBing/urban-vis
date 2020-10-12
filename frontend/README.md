## 介绍
本项目基于 React、Redux、Deck.gl、AntDesign 等框架进行开发。

### React 脚手架
使用 Create-React-App 创建
- 添加 node-sass 
- proxy config

#### React

- 尽量多抽取出 **无状态组件**，避免使用 renderXXXX 函数
- 组件接口 props 的命名力求简洁而且清晰，利用 propTypes 进行规范定义
- 组合 composition
- `shouldComponentUpdate`  优化，使用 `PureComponen`
  - prop 深层比较，`React.memo` 
- 高阶组件使用，提高复用性

## 整体结构

![图片](http://assets.processon.com/chart_image/5f71c0de07912952ebfc6d55.png)

### 地图视图 *MapView*

基于 Deck.gl 进行地理视图的绘制，其中地图部分使用 [Mapbox](https://www.mapbox.com/)。

#### MapController

- `layer`  各个图层的数据
-  `select`   地图上筛选
  - 

#### 地图上框选

使用基于 deck.gl 封装的图形编辑库 nebula.gl 提供的  [EditableGeoJsonLayer](https://nebula.gl/docs/api-reference/layers/editable-geojson-layer)  图层。

### 查询视图 *QueryView*

具体参考 [query-view.md](./doc/query-view.md)

