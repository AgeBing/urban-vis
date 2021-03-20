import { Controller } from 'egg';
import {formatDate} from '../utils/util'
/**
 * 用于 VAUD CASE
 */
export default class TaxiController extends Controller {


  public querySinglePhoneTraj(){
    let data = [
      [
          120.695844,
          27.991995
      ],
      [
          120.691788,
          27.992942
      ],
      [
          120.68269,
          27.995898
      ],
      [
          120.681167,
          27.999574
      ],
      [
          120.681703,
          28.002302
      ],
      [
          120.68739,
          28.003761
      ],
      [
          120.69372,
          28.00359
      ],
      [
          120.695951,
          27.999328
      ],
      [
          120.696488,
          27.996126
      ]
  ];
  let startTime:any = new Date("2014-01-01 08:00:00").getTime();
  let endTime:any = new Date("2014-01-01 08:30:00").getTime();
  let interval = (endTime - startTime)/data.length;
  this.ctx.body =
    data.map(p=>{
      return {
        "time":formatDate(new Date(startTime+interval),"yyyy-MM-dd hh-mm:ss"),
        "longitude": p[0],
        "latitude": p[1]
      }
    })
}


}