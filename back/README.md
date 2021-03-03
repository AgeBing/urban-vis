## 开发
参考 https://eggjs.org/zh-cn/intro/index.html

```bash
npm install # 安装依赖
npm run dev # 运行
```
## 部署
首先确保**依赖的数据**存在当前项目中




## 数据流程
#### 1. 原始数据预处理
`data/scripts` 下的脚本，读取原始数据，经过处理后，一部分存储至 `data_in_use` 中， 另一部分存储至  `data/node-server` 下。

因此若当前对应文件夹下不存在数据文件的话，需要手动执行脚本来生成文件。

#### 2. Node.js 数据处理
node 后端从 `data/node-server-data` 读取数据文件后通过对应接口转发

## 数据接口
参考 api.md


## 其他 
- egg-mysel 插件支持 ts 版本
  ```
  // typings/index.d.ts
  import 'egg';

  declare module 'egg' {
    interface Application {
      mysql: any;
    }
  }
  ```