在LDA主题模型初步结果的基础上，改动了：
	① 增加了鼓浪屿上的街区
	② 将相邻的具有相同主题的街区进行了合并
	③ 街区改为了不相交的形式，原来重叠的街区以带孔洞多边形代替
	④ 修改了一些带有缺陷的多边形数据

文件内容说明：
CombinedBlocksByLDATopic.txt：
	街区多边形的坐标。
	内部存放的是一个数组，数组的每个元素代表一个多边形，多边形有两种表示形式：
		一般多边形：一个坐标数组，每个元素是(lat,lng)形式的坐标；
		带孔多边形：一个边界组成的数组，第一个元素是外部边界，后面的是内部边界。每个边界是一个由坐标元组组成的数组，即，与一般多边形格式相同。
	格式：[[(lat, lng), ..., (lat, lng)], ..., [[(lat, lng), ..., (lat, lng)], ..., [(lat, lng), ..., (lat, lng)]], ... ]

CombinedTopicsByLDATopic.txt：
	街区多边形的主题。
	内部存放的是一个数组，数组的每个元素是一个属于{0, 1, 2, 3}的整数（取主题数为4），代表了多边形的主题。
	其顺序与CombinedBlocksByLDATopic.txt中多边形的顺序相同，即CombinedBlocksByLDATopic.txt中第i个多边形的主题是CombinedTopicsByLDATopic.txt中的第i个数。
	格式：[topic, ..., topic]

LDAtopic_list01.txt：
	LDA划分的主题的内容。
	每一行代表一个主题，与CombinedTopicsByLDATopic.txt中的整数相对应，即主题topic指的是LDAtopic_list01.txt中第(topic+1)行的内容。

CombinedBlocksWithLDATopic.html：
	街区主题展示在平面地图上的结果。

注：
由于需要对街区按照主题进行合并，故已默认每个街区选取其概率最大的主题作为最终的主题，所以，现在≠≠已经不具备每个街区的主题概率分布；
为了保证街区之间不相交，将原来相互有重叠的街区做了差运算，故会出现带孔的多边形。