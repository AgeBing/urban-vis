### 运行部署
基于 [Egg.js](https://eggjs.org/zh-cn/intro/index.html) 开发


- 首先确保**依赖的数据**（`data/node-server-data/`）存在当前项目中
- `npm i`  安装依赖
- `npm start`  运行

##### 多数据源环境
1. 在 `config` 下新增 `config.casex.ts` 配置文件
  - 在配置文件中写入 `dataSourcePath` 用于配置*数据文件地址*，app 运行时自动添加该目录至 file.ts 工具中
2. 运行时通过 `EGG_SERVER_ENV=casex npm run dev` 或 `EGG_SERVER_ENV=casex npm run start` 来制定运行环境, 读取 casex 对应的配置项


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

- 如何解决在 py 脚本的循环中发起 http 请求而引起的**高并发**的问题
  1. 尽量减少单次请求运行时间，控制在 100 ms 内
  2. 借助 cluster，开启多个 worker 来部署