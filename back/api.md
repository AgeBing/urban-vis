## 1. 出租车数据

- `get` 请求: 获取示例数据
    ```bash
    wget  host/taxi 
    ```
- `post` 请求，请求格式
    
    ```json
    {
        "geo": [120.623029, 120.707524, 28.027669, 27.988246],
        "time": ["00:06:33", "00:12:56"],
        "boolOp": 2
    }
    ```
    
    - `geo` :  `[maxlng, minlng, maxlat, minlat]`
    - `time` : `[min, max]`
    - 默认情况下需要同时传 geo 和 time 数据，否则后台会自动添加测试的条件
    - `boolOp` : 时间和空间条件是布尔组合。1 表示 Union并集，2 表示 Intersection交集，不传默认为2


- 输出格式: 参考 `type\taxi.ts`
    ```json
    [
        {
            "carNo": "浙C05132.LOG-0",
            "points": [
                {
                    "longitude": 120.642326355,
                    "latitude": 28.0106506348,
                    "time": "2014-01-01 00:00:11"
                },
                {
                    "longitude": 120.6402282715,
                    "latitude": 28.0094795227,
                    "time": "2014-01-01 00:00:41"
                }
            ]
        },
        {
            "carNo": "浙C05132.LOG-1",
            "points": [
                {
                    "longitude": 120.6373977661,
                    "latitude": 27.99766922,
                    "time": "2014-01-01 00:07:11"
                }
            ]
        }
    ]
    ```

## 2. 手机基站轨迹
todo 

## 3. 微博数据
- `get` 请求: 获取所有微博数据
    ```bash
    wget  host/weibo 
    ```
- 输出格式: 参考 `type\weibo.ts`
    ```json
    [
        {
            "time": "2014-01-14 00:50",
            "name": "红唇",
            "content": "1月14日凌晨00：49从松台广场到杏花路百花苑丢...",
            "road": "杏花路百花苑",
            "lng": 120.6462979,
            "lat": 28.00516276
        }
    ]
    ```