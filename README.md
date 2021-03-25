
# 城市时空数据可视分析

## 技术栈

- 前端 `/front`  [doc](./front/README.md)
  
  使用 [create-react-app](https://create-react-app.dev/docs/adding-typescript/) 创建支持 ts 的 react 脚手架，采用包含 Hook 的函数式组件。基于 deck.gl 封装了个地理可视化图层
  
- 后端 `/back`  [doc](./back/README.md)
  
  使用 [egg.js](https://eggjs.org/zh-cn/) 框架用于创建后端数据接口。
  
- 数据 `/data`  [doc](./data/README.md)

  使用 Jupyter 来进行原始数据的预处理，并将处理好的数据文件导出，供后端读取

- 其他 

  **typescript 配置**

  由于前后端都采用 js 开发，因此在 `/type` 目录下创建了可复用的 type 文件

  - [typescript 配置 alias](https://medium.com/zero-equals-false/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa)
  - [create-react-app 中配置 alias](https://github.com/facebook/create-react-app/issues/5645)


## 整体流程

1. 使用脚本预处理数据，导出至文件或数据库中
2. 针对导出数据格式，构建查询接口
3. 前端调用接口，绘制可视化图层

