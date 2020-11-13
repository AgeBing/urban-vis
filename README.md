

###  前端

```bash
cd frontend/
npm i
npm start
// run on localhost:3000
```

-----

### 后端

```bash
cd backend/
npm i
npm run dev
// run on localhost:7001
```

#### 数据

- 拷贝 `backend/config/config.template.js`  至 `backend/config/config.default.js` ，修改其中的 **mysql** 配置

- `/backend/data/`  下用于存放文本数据

  ```bash
  数据列表
  xiamen_poi_gcj02.csv  # 厦门 POI 数据
  ```


### 错误解决

####  1.  前端报错
./node_modules/@turf/difference/index.mjs
Can't import the named export 'diff' from non EcmaScript module (only default export is available)

参考 https://github.com/uber/nebula.gl/issues/285