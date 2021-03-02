## 1. 出租车数据

- `get` 请求: 获取示例数据
    ```bash
    wget  host/taxi 
    ```
- `post` 请求，请求格式
    ```json
    {
        payload: {
        // geo: [maxlng, minlng, maxlat, minlat]
        geo: [120.623029, 120.707524, 28.027669, 27.988246],
        // time: [min, max]
        time: ["00:06:33", "00:12:56"]
        }
    }
    ```

- 输出格式: 参考 `type\taxi.ts`
    ```json
    [
        {
            carNo,
            points: [
                {
                    longitude,
                    latitude,
                    time
                },
                ...
            ]
        }
        ...
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
            time,
            name,
            content,
            lng,
            lat
        }
        ...
    ]
    ```