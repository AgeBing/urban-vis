import { Service } from 'egg';
import { Cube, CubeCell, GeoParams, TimeParams, STCDataItem } from '@type/cube';
import { BoolOperate, DS, Point, QueryDataByMode } from '@type/base';
import { query, loadCube, timeToSliceIndex } from '../utils/stc';
import { DEFAULT_GEO, DEFAULT_TIME, stcs2locas } from '../utils/stc'
import { queryRes, queryResItem } from '../controller/py';
import { timeFormat1 } from '../utils/math';

const fileUtil = require('../utils/file');

enum STCIndexType{
  'full',
  'data2cube',
  'cube2data',
}
const FILE_PATH = {
  [(DS.MobileTraj + 1).toString()]: {
    [STCIndexType.data2cube]: 'phoneSDATA.json',
    [STCIndexType.cube2data]: 'phoneSTCube.json',
    [STCIndexType.full]: 'phone.json',
  },
  [(DS.TaxiTraj + 1).toString()]: {
    [STCIndexType.data2cube]: 'taxiSDATA.json',
    [STCIndexType.cube2data]: 'taxiSTCube.json',
  },
};

const datas = {
  [(DS.MobileTraj + 1).toString()]: {
    [STCIndexType.data2cube]: null,
    [STCIndexType.cube2data]: null,
    [STCIndexType.full]: null,
  },
  [(DS.TaxiTraj + 1).toString()]: {
    [STCIndexType.data2cube]: null,
    [STCIndexType.cube2data]: null,
  },
};

export default class STC extends Service {
  // 数据缓存
  public async getData(source:DS, indexType:STCIndexType) {
    const sourceIdx = (source + 1).toString();
    if (!datas[sourceIdx][indexType]) {
      // 读取一次性所有数据，此处需要读取大文件
      const data = await fileUtil.readJson(FILE_PATH[sourceIdx][indexType]);
      datas[sourceIdx][indexType] = data;
    }
    return datas[sourceIdx][indexType] || {};
  }

  /**
   * 查询符合条件范围的 立方体单元
   */
  public async queryCellsInRange(): Promise<CubeCell[]> {
    const { ctx } = this;
    console.time('queryCellsInRange');
    const cube: Cube = await loadCube();

    /**
      *  // geo: [maxlng, minlng, maxlat, minlat]
      *  geo: [120.623029, 120.707524, 28.027669, 27.988246],
      *  // time: [min, max]
      *  time: ["00:06:33", "00:12:56"]
     */
    const { geo, time, boolOp = BoolOperate['Intersection'] } = ctx.request.body;
    this.logger.info("queryCellsInRange", "geo: ", geo, " time :", time)
    let geoParams: GeoParams | null = null,
      timeParams:TimeParams | null = null;

    if (Array.isArray(geo) && geo.length === 4) {
      geoParams = {
        MaxLng: ctx.request.body.geo[0],
        MinLng: ctx.request.body.geo[1],
        MaxLat: ctx.request.body.geo[2],
        MinLat: ctx.request.body.geo[3],
      };
    }

    if (Array.isArray(time) && time.length === 2) {
      const minTime = ctx.request.body.time[0],
        maxTime = ctx.request.body.time[1],
        timeInterval = cube.config.timeSlice;
      timeParams = {
        MinTime: timeToSliceIndex(minTime, timeInterval),
        MaxTime: timeToSliceIndex(maxTime, timeInterval),
      };
    }
    query({ cube, geoParams, timeParams, boolOp });

    console.timeEnd('queryCellsInRange');
    return cube.cellsInFilter;
  }

  /**
   * 经过这些立方体单元的数据 ID
   * @param cells 时空立方体单元
   * @param source 数据源
   */
  public async getIdsInCells(cellsId: string[], source:DS): Promise<string[]> {
    console.time('getIdsInCells');
    console.time('getIdsInCells Load');
    const data = await this.getData(source, STCIndexType.cube2data);
    console.timeEnd('getIdsInCells Load');

    let idArr: Set<string> = new Set(),
      datasIncell = {};
    // console.log(cellsId.length)
    // console.time(`getIdsInCells for`)
    cellsId.forEach((cellId:string) => {
      // console.log(cellId)
      datasIncell = data[cellId] || {};

      Object.keys(datasIncell).forEach(id => {
        idArr.add(id);
      });
      // idArr = idArr.concat(
      //   Object.keys(datasIncell)
      // )
    });
    // console.timeEnd(`getIdsInCells for`)

    console.timeEnd('getIdsInCells');
    let res =  Array.from(idArr)
    this.logger.info(`getIdsInCells Len: ${res.length}`)
    return res
  }

  // 获取数据源中的所有id
  public async getDataSetIds(source:DS):Promise<string[]> {
    const data = await this.getData(source, STCIndexType.data2cube);
    return Object.keys(data)
  }

  /**
   * 经过这些立方体单元的详细数据列表
   * @param cells 时空立方体单元
   * @param source 数据源
   */
  public async getDatasInCells(cellsId: string[], source:DS): Promise<STCDataItem[]> {
    const data = await this.getData(source, STCIndexType.cube2data);

    let allData = {},
      datasIncell = {};

    cellsId.forEach((cellId:string) => {
      datasIncell = data[cellId] || {};
      Object.keys(datasIncell).forEach((dataId:string) => {
          if (!allData[dataId]) {
            allData[dataId] = {};
          }
          Object.assign(allData[dataId], datasIncell[dataId]);
      })
    })

    const datasArr:STCDataItem[] = [];


    // 对每一条轨迹的片段进行排序, 按照下标排序
    Object.keys(allData).forEach((dataId:string) => {
      // 轨迹片段
      const segments = allData[dataId];
      // 轨迹片段下标
      const segmentIds = Object.keys(segments);
      let sortedSegments:Point[][] = [];
      // 排序
      segmentIds.sort((a, b) => Number(a) - Number(b));
      // 合并
      if (segmentIds.length <= 1) {
        sortedSegments = Object.values(segments);
      } else {
        sortedSegments.push(segments[segmentIds[0]]);
        for (let i = 1; i < segmentIds.length; i++) {
          if ((Number(segmentIds[i]) - Number(segmentIds[i - 1])) === 1) { // 相邻的
            const lastIdx = sortedSegments.length - 1;
            sortedSegments[lastIdx] = sortedSegments[lastIdx].concat(segments[segmentIds[i]])
            // sortedSegments[lastIdx].push(...segments[segmentIds[i]]);
          } else { //  非相邻
            sortedSegments.push(segments[segmentIds[i]]);
          }
        }
      }

      // 1. 每段算一条
      // sortedSegments.map((segment, i) => {
      //   // l += segment.length
      //   datasArr.push({
      //     id: dataId + '-' + i,
      //     data: segment,
      //   });
      // });

      // 2. 将每一段合成一条
      datasArr.push({
        id: dataId,
        data: sortedSegments.reduce((a:Point[],b:Point[]) => a.concat(b),[])
      })

    });

    this.logger.info(`getDatasInCells 返回数据量: ${datasArr.length}`)
    return datasArr;
  }


  /**
   * 经过这些立方体单元的完整数据列表
   * @param cells 时空立方体单元
   * @param source 数据源
   */
  public async getFullDatasInCells(cellsId: string[], source:DS): Promise<STCDataItem[]> {
    const dataIds = await this.getIdsInCells(cellsId, source);
    const data = await this.getData(source, STCIndexType.full);
    this.logger.info('getFullDatasInCells',dataIds)
    let datas:STCDataItem[] = []
    dataIds.forEach((dataId:string) => {
      datas.push({
        id: dataId,
        data: data[dataId]['points']
      })
    })
    return datas
  }

  public async getOneFullData(dataId:string, source:DS): Promise<STCDataItem> {
    const data = await this.getData(source, STCIndexType.full);
    return {
      id: dataId,
      data: data[dataId]['points']
    }
  }

  /**
   * 获取每个数据的 索引信息
   * @param datasID 数据 id
   * @param source 数据源
   */
  public async getSTCInfoOfDatas(datasID: string[], source:DS): Promise<queryRes> {
    console.time('getSTCInfoofDatas');
    const data = await this.getData(source, STCIndexType.data2cube);
    let res: queryRes = [];
    res = datasID.map((id: string) => {
      const { bbx, stcubes } = data[id.toString()] || {};
      if (!bbx || !stcubes) {
        this.logger.error(`数据 ${id} 在 data2cube 文件中找不到索引`);
        return { id };
      }
      // 原始数据内的格式
      const { timeRange: t, areaRange: a } = bbx;
      return {
        id,
        stcubes,
        scube: stcs2locas(stcubes),
        bbx: {
          time: [ timeFormat1(t.min), timeFormat1(t.max) ],
          geo: [ a.maxLng, a.minLng, a.maxLat, a.minLat ],
        },
      };
    });

    console.timeEnd('getSTCInfoofDatas');
    return res;
  }

  // 根据 STC Info 和 Mode 计算信息
  public async getCellsFromInfo(info: queryResItem, mode=QueryDataByMode['STCubes']): Promise<string[]>{
    let cellIds:string[] = []
    if(mode === QueryDataByMode['STCubes']){
      cellIds = info?.stcubes || []
      return cellIds.map(i => i.toString())
    }

    let geo = DEFAULT_GEO,
        time = DEFAULT_TIME
    console.log(info?.bbx)
    if(mode === QueryDataByMode['Geo']){
      geo = info?.bbx?.geo || DEFAULT_GEO
    }else if(mode === QueryDataByMode['Time']){
      time = info?.bbx?.time || DEFAULT_TIME
    } 
    console.log(geo,time)
    this.ctx.request.body = { geo, time, boolOp:BoolOperate['Intersection']}
    let cells:CubeCell[] = await this.queryCellsInRange()
    cellIds = cells.map(c => c.id.toString())
    return cellIds
  }
}
