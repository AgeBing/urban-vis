const Service = require('egg').Service;

const TABLE_NAME = "crossings"
const TABLE_NAME_STATIC = "taxigps20200618_maproads_crossingsta"

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
    const allCross =  res.map((cross) => {
      cross['roads'] = cross['roads'].split(';')
      return cross
    })

    let ps =  await Promise.all(allCross.map(async (c) => {
      c['dailyCount'] = await this.crossDailyConut(c.cid)
      return c;
    }));

    ps = ps.filter(p => p.dailyCount.length == 24);
    return ps;
  }
  /**
   * 查询路口信息
   */
  async queryCrossList(){
    return await this.crossList();
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
}

module.exports = CrossService