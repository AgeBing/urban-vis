### 时空数据处理流程

#### 1. 预处理
在 `scripts/*_pre.ipynb` 中，会根据不同数据源的各自结构，
从最原始的文件中，读取一部小部分数据，经过格式转换、清洗后，存储至 `data_in_use/*.json` 中。

其中最原始的文件一般存储在**硬盘文件**中：
- taxi 出租车轨迹数据
- phone 手机行人基站数据，包含基站数据和行人轨迹数据
- weibo 微博数据
- POI 以 poi.sql 的形式存在，可直接导入至 Mysql 中

#### 2. 时空立方体模型处理
为了提高数据的查询性能，需要设置时空立方体模型，
并且针对上述几个数据源，建立索引结构，结果输出至 `node-server-data`

数据列表描述：
- `STCCube.json`  STC 中 cube 列表
- `STCubeConfig.json`  STC 配置信息
- `taxi.json`  出租车详细数据，按照 STC id 进行索引
- `weibo.json` 微博详细数据列表

#### 3. 数据查询服务器
在 `/back` 中搭建了 Node 服务器，读取 `node-server-data` 中的数据，向外开放 http 接口，并返回搜索结果。
具体接口查看 `/back/api.md`

### 注意事项
- 勿将原始及中间过程数据上传，当前在 `.gitignore` 中定义
- 提交代码前需要将 `*.ipynb` 的 **cell output 全部清空**，避免上传的文件过大
- 将 ipynb 转换至 py 代码，方便运行
  ```bash
  jupyter nbconvert --to python phone_pre.ipynb
  ```
