import json
from os import walk

def getJsonData(filepath):
    data = None
    with open(filepath) as f:
        data = json.load(f)
    return data
# 获取文件列表
def list_files(filepath):
    phone_raw_files = []
    for (dirpath, dirnames, filenames) in walk(filepath):
        phone_raw_files.extend(filenames)
    return phone_raw_files