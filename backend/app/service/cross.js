const Service = require('egg').Service;

const TABLE_NAME = "crossings"
const TABLE_NAME_STATIC = "taxigps20200618_maproads_crossingsta"
const ODMapTABLE_NAME_STATIC = "taxigps20200618_maproads_crossing_odmapdata"

class CrossService extends Service{
  async passCount(){
    const { ctx } = this
    const sql = `select crossings.cid,lat,lng,count from ( select cid,count from taxigps20200618_maproads_crossingsta where GPS_DATE="2020-06-18 00" ) as trajs,crossings where trajs.cid = crossings.cid`
    let res = await this.app.mysql.query(sql)
    return res.map(cross => ({
      lon: cross['lng'],
      lat: cross['lat'],
      count: cross['count']
    }))
  }
  /**
   * 所有路口列表
   */
  async crossList(){
    const res = await this.app.mysql.select(TABLE_NAME);
    return res.map((cross) => {
      cross['roads'] = cross['roads'].split(';')
      return cross
    })
  }
  /**
   * 查询路口信息
   */
  async queryCrossList(){
    return []
  }
  /**
   * 单个路口统计信息
   */
  async crossDailyConut(cid){
    const res = await this.app.mysql.select(TABLE_NAME_STATIC, {
      where: { cid: cid },
      orders: [['GPS_DATE', 'asc']]
    })
    return res
  }
    /**
   * 单个路口统计信息 --> ODMap图表的统计信息
   */
  async crossODMapData(cid){
    const res = await this.app.mysql.query('select * from '+ODMapTABLE_NAME_STATIC+' where (source = ? and target <> ? ) order by count desc limit ?',[cid,cid,5]);
    let cids = res.map(record=>{
      return record.target;
    })
    cids.push(cid);
    let sql = 'select * from '+ODMapTABLE_NAME_STATIC+' where source in ('+cids.toString()+') and target in ('+cids.toString()+') and source <> target'
    const results = await this.app.mysql.query(sql);
    return {cids,results}
  }
}

module.exports = CrossService