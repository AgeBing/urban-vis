## 接口使用
在 api.py 中会发起 HTTP get 或 post 请求从 Node.js 后端获取数据。

因此请求前确保 Node 服务器开启并运行在正确的端口上，api.py 文件中可配置 `HOST` ，并运行以下**示例代码**查看接口是否联通。

```python
import api
api = api.API()
api.getTest()
api.postTest()
```
## 接口列表

#### 1. 出租车数据请求
请求格式
```json
payload: {
  // geo: [maxlng, minlng, maxlat, minlat]
  geo: [120.623029, 120.707524, 28.027669, 27.988246],
  // time: [min, max]
  time: ["00:06:33", "00:12:56"]
}
```
输出格式
