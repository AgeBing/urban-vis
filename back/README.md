### 运行部署
基于 [Egg.js](https://eggjs.org/zh-cn/intro/index.html) 开发


- 首先确保**依赖的数据**（`data/node-server-data/`）存在当前项目中
- `npm i`  安装依赖
- `npm start`  运行

### 数据接口
参考 [api.md](./api.md)

### 其他 
- egg-mysel 插件支持 ts 版本
  ```javascript
  // typings/index.d.ts
  import 'egg';

  declare module 'egg' {
    interface Application {
      mysql: any;
    }
  }
  ```