新项目
## 前端 front
- 使用 [create-react-app](https://create-react-app.dev/docs/adding-typescript/) 创建支持 ts 的 react 项目。并且尽量采用包含 Hook 的函数式组件
- 项目结构
- http 请求封装

## 后端 back
- 使用 egg.js 框架，支持 [ts](https://eggjs.org/zh-cn/tutorials/typescript.html)
- 关于插件
  “*Egg 以及它对应的插件，会提供对应的 index.d.ts 文件方便开发者使用*”
- 关于 typings 目录：用于放置 d.ts 文件（大部分会自动生成）

## 整体开发流程
1. 数据准备
2. 后端接口
3. 前端展示

## 业务
### 地图图表绘制

使用 deck.gl 来进行绘制，封装的图层置于 componet/map/ 下
#### 轨迹线图
出租车、手机基站

#### 热力图
#### 点图标
展示 POI 数据

#### 分级地图 choropleth map
#### 隐私展示 plyph

### 交互工具
#### 地图框选
#### 时间栏

### 统计图表展示
antv chart

### Case 数据


<!-- # to learn
- 前后端共享 types
- 如何自己编写 useEffect
- 如何通过 ts 来限制数据的字段 (对不上不会报错？)
- 架构 deck layers -->