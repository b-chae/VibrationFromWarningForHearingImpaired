#%%
# https://research.google.com/audioset/에서 데이터 얻기(class_label_indices)
### 데이터 위에 주석 두줄 삭제해야 돌아감
# Segments csv created Sun Mar  5 10:54:31 2017
# num_ytids=22160, num_segs=22160, num_unique_labels=527, num_positive_labels=52882
# YTID 있는 부분도 # 삭제
import os 

current_dir = os.getcwd() + '/' # 현재 디렉토리 얻기
a_class = 'Baby cry, infant cry'
b_class = 'Siren'

#%%
# 폴더 만들기
if not os.path.exists(os.path.join(current_dir,'data')):
    os.mkdir(os.path.join(current_dir,'data')) 

if not os.path.exists(os.path.join(current_dir,'data',a_class)):
    os.mkdir(os.path.join(current_dir,'data',a_class))

if not os.path.exists(os.path.join(current_dir,'data',a_class,'audio')):
    os.mkdir(os.path.join(current_dir,'data',a_class))
    os.mkdir(os.path.join(current_dir,'data',a_class,'audio'))

# %%
### 데이터 위에 주석 두줄 삭제해야 잘 됨 
import pandas as pd
################ parent dir 바꾸기

class_df = pd.read_csv(f'{current_dir}class_labels_indices.csv')
# 데이터에 ,로 구분되는게 있어서 ", "로 구분되기 해야한다.
# # https://research.google.com/audioset/ 에서 얻음
balanced_df = pd.read_csv(f'{current_dir}balanced_train_segments.csv',sep=", ")



# %%
################ flute, cello 부분을 원하는 data로 바꾸기(replace Flute, Cello를 원하는 변수로 바꾸세용)
a_class_mid = class_df[class_df['display_name']==a_class]['mid']
b_class_mid = class_df[class_df['display_name']==b_class]['mid']
# a_class_mid = '"'+str(a_class_mid)+ '"'
# to_string 하면 index(mid)까지 같이 나옴 startwith, endwith도 있다.
a_class_df = balanced_df[(balanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)]

#%%
#### Additional
# 이것만 있는 sound 찾기
# a_class_df = balanced_df[balanced_df["positive_labels"]=='"/m/05zppz"']
# a_class_df = balanced_df[balanced_df["positive_labels"].eq('"'+a_class_mid.values[0]+'"')]
# a_class_df = balanced_df[balanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1]

# 두개 다 겹치는경우 있느닞 확인
print(len(balanced_df[(balanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)&(balanced_df["positive_labels"].str.find(b_class_mid.values[0])!=-1)]))
b_class_df = balanced_df[(balanced_df["positive_labels"].str.find(b_class_mid.values[0])!=-1)]
print(len(b_class_df[(b_class_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)]))


# %%
### a_class 크롤링하기
from pytube import YouTube
import subprocess
import os
## iter_rows 해줘야 함
from_check = True # True면 처음부터, False면 원하는 url부터
start_idx = 0
error_list = []
for index, sr in a_class_df.iterrows():    
    ## 해당번호까지 크롤 했으면 다음거 부터 크롤 해야 하니까 일단 임시로 만들기
    if(from_check==False):
        if (index==start_idx):
            from_check = True
        continue
    print(sr)
    print(f'https://www.youtube.com/watch?v={sr["YTID"]}')
    try:
        yt = YouTube(f'https://www.youtube.com/watch?v={sr["YTID"]}')
        vids = yt.streams.filter(file_extension='mp4').all() 
        # print(vids)
        # [<Stream: itag="140" mime_type="audio/mp4" abr="128kbps" acodec="mp4a.40.2">, <Stream: itag="249" mime_type="audio/webm" abr="50kbps" acodec="opus">, <Stream: itag="250" mime_type="audio/webm" abr="70kbps" acodec="opus">, <Stream: itag="251" mime_type="audio/webm" abr="160kbps" acodec="opus">]
        vids[0].download(f'{current_dir}data/{a_class}/')
        print(vids[0].default_filename)
        # ffmpeg -ss (start time) -i (direct video link) -t (duration needed) -c:v copy -c:a copy (destination file)
        k = os.path.join(f'{current_dir}data/{a_class}/',"a.mp3")
        ### Overwrite 안됨.
        print('0000',vids[0].default_filename)
        print(f'{current_dir}data/{a_class}/audio/')
        subprocess.call(['mv',
            os.path.join(f'{current_dir}data/{a_class}/' ,vids[0].default_filename),
            os.path.join(f'{current_dir}data/{a_class}/',f'{index}.mp4')
        ])

        subprocess.call(['ffmpeg','-ss',str(int(sr["start_seconds"])),'-i',
            os.path.join(f'{current_dir}data/{a_class}/' ,f'{index}.mp4'),
            '-t',str(int(sr["end_seconds"]-sr["start_seconds"])),
            os.path.join(f'{current_dir}data/{a_class}/audio/',f'{index}.mp3')
        ])
        
    except Exception as ex:
        print('에러가 발생 했습니다', ex)
        error_list.append(index)
    # ffmpeg -ss 10 -i kk.mp4 -t 30 a.mp3



# %%
