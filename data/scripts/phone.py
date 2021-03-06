FILES_DIR = {
    # 基站
    "base_station" : "E:/MSE/VAG/VIS2021/温州数据/手机基站数据/basestation.json",
    # 手机记录文件夹
    "phone_dir": "E:/MSE/VAG/VIS2021/温州数据/手机基站数据/trajs2000/"
    # "phone": "/Volumes/Age's SSD 1/SSD/数据/手机基站/phonetraj14-15/phonetraj0114/mpt2014114 1140010sortbyid.txt"
}
import pandas as pd
import json
df_station = pd.read_json(FILES_DIR["base_station"])

import config as C
# b = C.bounds
# 全部研究区域
b={
    "lat":[27.896002,28.028822],
    "lng":[120.602985,120.785633]
}
# 120.602985,28.028822
# 120.785633,27.896002
# b = {
#   "lng": [120.65511703491211, 120.66254138946533],
#   "lat": [28.012285879891284, 28.01736270918544]
# }
print("基站数目",len(df_station))
df_station_filter_in_loca = df_station
df_station_filter_in_loca = df_station_filter_in_loca[ df_station_filter_in_loca['longitude'] > b['lng'][0] ]
df_station_filter_in_loca = df_station_filter_in_loca[ df_station_filter_in_loca['longitude'] < b['lng'][1] ]
df_station_filter_in_loca = df_station_filter_in_loca[ df_station_filter_in_loca['latitude'] > b['lat'][0] ]
df_station_filter_in_loca = df_station_filter_in_loca[ df_station_filter_in_loca['latitude'] < b['lat'][1] ]
df_station = df_station_filter_in_loca
print(len(df_station))
# 读取手机基站轨迹原始文件
def read_phone_raw_file(filename):
    phone_trajs = []
    with open(filename) as f:
        lines = f.readlines()
        for line in lines:
            phone_trajs.append(
                split_line_to_trajectory(line)
            )
    return phone_trajs

def split_line_to_trajectory(line):
    arr = line.split(";")
    trajectory = {
        "IMEI": arr[0],
        "POINT": []
    }
    for point in arr[1:-1]:
        parr = point.split(",")
        trajectory["POINT"].append({
            "time": parr[0],
            "sid": parr[1]
        })
    return trajectory
# sample_line = "202091150448482;2014-01-13 23:52:58.37,22492 24185;2014-01-13 23:53:00.25,22492 24185;"
# print(split_line_to_trajectory(sample_line))
from os import walk

# 获取文件列表
def list_files():
    phone_raw_files = []
    for (dirpath, dirnames, filenames) in walk(FILES_DIR["phone_dir"]):
        phone_raw_files.extend(filenames)
    return phone_raw_files

# 读取所有文件中的数据
def read_files():
    files = list_files()
    BASE_PATH = FILES_DIR["phone_dir"]
    print("files: " + str(len(files)))
    print(files[0])
    f = BASE_PATH + files[0]
    return read_phone_raw_file(f)
## 手机用户轨迹
phones = read_files()
len(phones)
#  策略
#  1. 如果找不到对应基站，该点 筛去
def add_lnglat_to_phone_trajectory(phone):
    points = phone['POINT']
    new_points = []
    for p in points:
        try:
            lac_cell = p['sid'].split(' ')
            lac = int(lac_cell[0])
            cell = int(lac_cell[1])
            df_find = find_in_station_df(lac, cell)
        except:
            continue
        else:
            p['longitude'] = df_find[0]
            p['latitude'] = df_find[1]
            del p['sid']
    phone['points'] = phone.pop('POINT')
    
    for p in phone['points']:
        if('sid' not in p):
            new_points.append(p)
    phone['points'] = new_points
            


def find_in_station_df(lac, cell):
    df = df_station
    df_find = df.loc[(df['lac'] == lac) & (df['cell'] == cell)]
    # print(df_find['longitude'])
    if(len(df_find) != 1):
        raise Exception("Cant Find Station!")
    return df_find[['longitude','latitude']].values[0]

def write_json_to_file(json_obj, filename='phone.json'):
    path = '../data_in_use/'
    filename = path + filename
    with open(filename, 'w') as outfile:
        json.dump(json_obj, outfile)
   # 将程序得到的轨迹转化成矢量场所需的轨迹形式

def write_vectorJson_to_file(trajs,filename="trajectories.json"):
    trajectories = []
    for traj in trajs:
        item = []
        last = ['','']
        for i in range(len(traj["points"])-2,-1,-1):
            p = traj["points"][i]
#             print(last,p)
            if last[0]==p['latitude'] and last[1] == p['longitude']:
                continue
            else:
                item.append([p["latitude"],p["longitude"]])
                last = [p['latitude'],p['longitude']]
        if len(item)>1:
            trajectories.append(item)
    result = {
        "bbx":[b['lat'][0],b['lat'][1],b['lng'][0],b['lng'][1]],
        "trajectories":trajectories
    }
    filename = '../data_in_bishe/'+filename
    with open(filename, 'w') as outfile:
        json.dump(result, outfile)
import functools
def compare(x, y):
    if x["time"] > y["time"]:
        return 1
    if x["time"] < y["time"]:
        return -1
    return 0
# 连续两个相同基站时删除重复基站记录,保留最后一个元素来确保知道最后的时间点
def filterRepeatedPoints(points):
    last = ''
    for i in range(len(points)-2,-1,-1):
        p = points[i]
        if last == p['sid']:
            points.pop(i)
        else:
            last = p['sid']
def pack_data(num = 10000):
    c = 0
    new_phones = []
    empty_count = 0
    for phone in phones[1:num]:
        #先给points按照时间排序===========================================
        phone["POINT"] = sorted(phone["POINT"], key=functools.cmp_to_key(compare))
        filterRepeatedPoints(phone["POINT"])
#         ==========================================================
        add_lnglat_to_phone_trajectory(phone)
        c = c + 1
        if(len(phone['points']) > 0):
            new_phones.append(phone)
        else:
            empty_count+=1
#             print(phone)
        if(c % 1000 == 0):
            print('doing ' + str(c) + ' ...')

    write_json_to_file(new_phones,"trajs2000.json")
    print("轨迹数据写入完成")
    write_vectorJson_to_file(new_phones,"trajs2000.json")
    print('done!,轨迹点为空的个数为',empty_count,empty_count/num)

pack_data(10000 * 2)
    