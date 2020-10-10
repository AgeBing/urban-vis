## 介绍

项目使用 [egg.js](https://eggjs.org/zh-cn/intro/index.html) 进行搭建，基于 Koa 框架进行封装。主要包括 Router、Controller、Service 等结构，开发成本较低。

### 运行

```bash
cd repo
npm i
npm run dev 
// ... started on http://127.0.0.1:7001
```

### 使用插件

在  `/config/plugin.js`  中进行配置 

- [egg-mysql](https://eggjs.org/zh-cn/tutorials/mysql.html)  进行 Mysql 数据库读取
- `util/file.js`  csv 文件读取 
  - 数据文件保存在 `/data`  目录下
- [egg-cors](https://github.com/eggjs/egg-cors)  支持跨域请求，具体白名单需要配置

##  测试

框架中内置了[单元测试工具](https://eggjs.org/zh-cn/core/unittest.html)，因此可对某具体进行测试。在开发过程中也可通过编写测试用例的方式来进行运行，提升开发效率

```bash
npm run test
```

----

##  数据

当前数据来源主要包括 CSV 文件和 Mysql 数据表。最好提前根据**数据对象**定义 **Model 的格式字段**，并以此为标准。

####  1. POI

来源于高德地图的POI服务，经过转换后存储为 CSV 格式

```typescript
class POI {
  lon: number;
  lat: number;
  name: string;
}
```

#### 出租车轨迹

```typescript
class Point{
  lon: number;
  lat: number;
  time: string;
}
class Trajectory{
  cardNo: string;
  points: Point[];
}
```
#### 预处理

1. 轨迹点按照 车牌 group
2. 一条轨迹内的轨迹点按照时间顺序排序

##### 存储

------

##  其他

### 地理坐标系统

安装 [coordtransform](https://github.com/wandergis/coordtransform) 模块进行转换
- wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
- gcj02国测局坐标(火星坐标,比如高德地图在用)

### 地理条件处理
[Turf.js](http://turfjs.org/)

