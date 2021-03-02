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
参考 back\README.md
