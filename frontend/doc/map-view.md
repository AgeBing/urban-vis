####  VIS2020 结构

每个 Map 组件，传入各图层数据 data 和图层配置 config，合并后直接传入 Layers 图层。 Map 图层中需要进行框选操作 Select 的控制，合并至 layer 图层中。框选操作的实现通过 Event 总线进行控制（观察者模式）

```javascript
datas = [{
	id,  // 该图层id
	type, // 该图层类型
	data, // 图层对应数据
	config // 图层配置参数
}]
```

#####  图层类型 type

在 `Map/config`  下的  `LAYER_TYPES`  进行定义

##### 图层数据 data

需要在每个 create 函数中定义好传入的数据类型

### Controller 组件



1. 图层映射
   1. 按照 type 参数用对应的图层类型创建者进行构造
   2. 当 data 或者 config 变化时 能重新进行创建
2. 框选图层合并到 layers 数组中
   1. 向外暴露 
      - `startAreaSelect` 接口
      - `changeAreaSelectVisible` 接口

### AreaSelect 框选操作组件

在 Map 组件中注册回调函数，并在回调函数中修改该 layer 中的参数，并进行更新

- `startMapFrameSelect`   // 点击框选时触发该函数
- `endMapFrameSelect`   //   框选结束时触发该函数
- `changeMapFrameSelectVisible`   // 点击修改选择框是否展示时触发该函数

```javascript
{
  id:  '',
  type: '',
	data: {   // 框选图形对应的 geojson 数据，当 features 数组不为空是表示有点
		type: 'FeatureCollection',
		features: []
	},
  config:{
		visible,  // 是否展示
		mode,     // view || draw 表示当前状态    
  }
}
```

