const Service = require('egg').Service;
const fileReader = require('../util/file')
const coorUtil = require('../util/coor')
const geoUtil = require('../util/geo')

// 从文件读取
const fileName = 'xiamen_poi_gcj02.csv'  // 厦门岛所有POI


class POIService extends Service{
  
  /**
   * 约 70000 个点
   */
  async list(){
    const { ctx } = this
    let data = await fileReader.csv(fileName)
    ctx.logger.info("POI 数量", data.length)
    const filter = data.map(d => {
      return {
        name : d.name,
        lon: d.lon,
        lat: d.lat,
        id: d.id
      } 
    })
    .filter(d => isWithinInXiamengland(d) )  // 过滤岛内
    // ctx.logger.info("过滤后 POI 数量", filter.length)
    return filter.map(poi => coorUtil.gcj02towgs84(poi))
  }

  /**
   * 根据 Region 过滤
   * spaceRegions: 
   * [
   *  [
   *    {lng,lat},
   *    {lng,lat},
   *    {lng,lat},
   *    {lng,lat},
   *  ],
   *  [...]
   * ]
   */
  async query(spaceRegions){
    const { ctx } = this
    let allPois = await this.list();
    
    // 抽取一部分
    allPois = sample(allPois, 0.1)

    ctx.logger.info("Query POI 数量", allPois.length)

    if(!spaceRegions || spaceRegions.length == 0 || spaceRegions[0] == null)
      return allPois

    return allPois.filter( poi => {
      const { lon, lat } = poi
      const point = [lon, lat]
      const regions  = spaceRegions.map((_spaceRegion) => {
        return _spaceRegion.map((p) => [p.lng, p.lat])
      })
      return geoUtil.isPointInRegions(point, regions)
    })
  }
//pid:poi id   获取poi的大众点评数据
async getCommentsData(pid) {

  let imgUrl,poiName,star = "0",commentsNum = "0",poiType,address,tel,price,comments = [];
  const sqlBasic = `select * from poi where poi.id = "${pid}"`;
  let res = await this.app.mysql.query(sqlBasic);
  if (res.length>0){
    res = res[0];
    poiName = res["name"];
    address = res["address"];
    // format tel
    if (res["tel"]=="[]"){
      tel = "暂无联系方式"
    }else{
      tel = res["tel"].split(';');
      if (tel.length>2) tel = tel.slice(0,2)
      tel = tel.join(';')
    }
    
    let type = res["type"]
    if (type!=null){
      poiType = type.substring(type.indexOf(';')+1,type.length)
      type = type.substring(0,type.indexOf(';'))//poi对应的大类，用于编码poi颜色
    }
    switch(type){
      case "餐饮服务":
        let minCharNum = 120;
        let maxCommentsNum = 2;
        let sql = `select * from poi_basic_comment where id = "${pid}"`
        res = await this.app.mysql.query(sql)
        if(res.length==0) break;
        else 
          res = res[0];
        imgUrl = res["img"]
        price = res["price"]
        star = res["rank"]
        sql = `select * from poicomments where id = "${pid}"`
        res = await this.app.mysql.query(sql)
        for(let i=0;i<res.length;i++){
          let row = res[i]
          if (row["text"].length<minCharNum) continue;// text大于110，保证评论至少占四行
          comments.push({unick:row["unick"],score:row["rank"],text:row["text"].replace(/\n/g,'')})
          if(comments.length==maxCommentsNum) break;
        }
        // 手动添加评论，哭了
        if (comments.length==0) comments=comments.concat(this.getComments())
        commentsNum = comments.length
        break;
        
      default:
        break;
    }
  }

  return { poiInfo:{imgUrl,poiName,star,commentsNum,poiType,address,tel,price},comments }
}
// 构建评价
getComments(){
  return [
    {
      unick: '是欣不是心',
      score: '50',
      text: '已经是第二次过来吃了，第一次是妹妹说这里特别好吃带我过来尝了感觉真的是非常不错呢[薄荷]环境：位置还是比较好找的店内环境还不错，也比较大有一楼跟二楼二楼，我们是选在窗户旁边，还能看到外面的车来车往。[服务铃]服务：服务特别周到，隔一段时间服务员就会过来看一下一汤有没有烧干然后会帮我们加汤。「招牌千张筒锅」味道特别好'
    },
    {
      unick: '张大栗',
      score: '40',
      text: '每次我不知道吃什么的时候就会首选这家店，特别养生?，天气转凉，也是很适合带家里的长辈过来尝试。店内环境很不错，主打的骨汤?也很浓郁鲜美，喝下去胃暖暖☕的。「招牌千张筒锅」我每次必点，小份就有三个超大的大骨棒，千张，笋干，腊肠?，一定要点这个！服务员会先帮你乘一碗汤，浓郁的奶白色大骨原汤加点葱花，真的绝了。也会建议在骨髓煮化之前先吃棒骨?，吸管可以直接吸里面的骨髓，嫩滑一点也不腥。抽屉里配备了一次性手套?。吸管?。湿纸巾?，一应俱全。「竹荪」竹荪爽脆的口感我很喜欢，「手工虾滑」?虾滑新鲜，无功无过。「鲜嫩鸭血」切得很薄，嫩滑无腥味。吧台提供自主蘸料和自主水果??，大部分是当季水果，去的时候是冬枣和橘子，都很新鲜，?人均性价比高，冬日暖胃必备?。'
    }
  ]
}
}

/**
 * 判断点 是否在 厦门岛 内
 * @param {*} param0 
 */
const isWithinInXiamengland = ( {lon,lat} ) => {
  const topleft = [118.05739,24.555591]
  const bottomRight = [118.203348,24.416553]
  const lngMax = bottomRight[0],
        lngMin = topleft[0],
        latMax = topleft[1],
        latMin = bottomRight[1]
  
  return  lon && lat && ( lon < lngMax && lon > lngMin && lat < latMax && lat > latMin ) 
}

const getRegionBoundry = (region) => {
  let lngMax = region[0]['lng'],
      lngMin = lngMax,
      latMax = region[0]['lat'],
      latMin = latMax;
  if(region.length <= 1){
    return { lngMax,lngMin,latMax,latMin }
  }
  for(let i = 1;i < region.length;i++){
      lngMax = region[i]['lng'] > lngMax ? region[i]['lng'] : lngMax
      lngMin = region[i]['lng'] < lngMin ? region[i]['lng'] : lngMin
      latMax = region[i]['lat'] > latMax ? region[i]['lat'] : latMax
      latMin = region[i]['lat'] < latMin ? region[i]['lat'] : latMin
  }
  return { lngMax,lngMin,latMax,latMin }
}


function sample(arr, percent) {
    let result = []
    let size =  Math.floor(arr.length * percent)
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * (arr.length - i))
        const item = arr[randomIndex]
        result.push(item)
        arr[randomIndex] = arr[arr.length - 1 - i]
        arr[arr.length - 1 - i] = item
    }
    return result
}
module.exports = POIService;