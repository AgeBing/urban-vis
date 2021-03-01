FILES_DIR = {
    # 基站
    "base_station" : "E:/MSE/VAG/VIS2021/温州数据/手机基站数据/basestation.json",
    # 手机记录文件夹
    "phone_dir": "C:/Users/vag/Desktop/ykj/phonetraj0114/"
    # "phone": "/Volumes/Age's SSD 1/SSD/数据/手机基站/phonetraj14-15/phonetraj0114/mpt2014114 1140010sortbyid.txt"
}
import json
from os import walk

def writeFile(data,filename):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile)
def getTrajPoints(trajsIDs,trajs,filename):
    trajs = []
    BASE_PATH = FILES_DIR["phone_dir"]
    with open(BASE_PATH+filename) as f:
        lines = f.readlines()
        for line in lines:
            TrajID = line.split(";")[0]
            if TrajID in trajsIDs:
                trajs.append(line)
    f.close()
    return trajs
# 读取手机基站轨迹原始文件
def getTrajID(filename,trajsIDs):
    with open(filename) as f:
        lines = f.readlines()
        for line in lines:
            TrajID = line.split(";")[0]
            # print("TrajID",TrajID)
            if TrajID not in trajsIDs:
                trajsIDs[TrajID]=0
            trajsIDs[TrajID]+=1
    f.close()
    print("filename",filename)
# 获取文件列表
def list_files():
    phone_raw_files = []
    for (dirpath, dirnames, filenames) in walk(FILES_DIR["phone_dir"]):
        phone_raw_files.extend(filenames)
    return phone_raw_files
# 读取所有文件中的数据
def getIDs():
    IDs = {}
    files = list_files()
    BASE_PATH = FILES_DIR["phone_dir"]
    for filename in files:
        f = BASE_PATH + filename
        getTrajID(f,IDs)
    return [files,IDs]
inf = getIDs()
files = inf[0]
trajsIDs = inf[1]
res = []
K = 10000
writeFilename="./phoneID.json"
for i in range(K):
	key = max(trajsIDs,key=trajsIDs.get)
	trajsIDs.pop(key)
	res.append(key)
# 筛选出的长度较长的轨迹id集合
print(res)
writeFile(res, writeFilename)

for filename in files:
    trajs = getTrajPoints(trajsIDs,trajs,filename)
    writeFile(trajs, "./TOP"+K+filename)





