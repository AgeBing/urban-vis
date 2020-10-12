/*
	t1 : "2014-01-14 01:36:03" ,
	t2 : "01:36"

	true  t1 , t2 ( t1 早于 t2)
	fasle   t2 , t1 ( t1 晚于 t2)
*/
function compareTime( t1 , t2) {
	const DATE = '2014-01-14 '
	const simpleTimeReg = /^\d\d:\d\d$/   // "01:20"
	if(simpleTimeReg.test( t2 )){
		t2 = DATE + t2
	}
	t1 = new Date(t1)
	t2 = new Date(t2)
	if( t1 == 'Invalid Date' || t2 == 'Invalid Date'){
		console.error('Invalid Date')
		return
	}
	return t1 <= t2
}

/**
 *  start - t - end
 */
function isInTimeInterval(t, [start, end]){
  return compareTime(start, t) && compareTime(t, end)
}

module.exports = {
  compareTime, 
  isInTimeInterval,
}