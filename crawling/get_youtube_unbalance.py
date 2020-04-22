#%%
# https://research.google.com/audioset/에서 데이터 얻기(class_label_indices)
### 데이터 위에 주석 두줄 삭제해야 돌아감
# Segments csv created Sun Mar  5 10:54:31 2017
# num_ytids=22160, num_segs=22160, num_unique_labels=527, num_positive_labels=52882
# YTID 있는 부분도 # 삭제
import os 
current_dir = os.getcwd() + '/' # 현재 디렉토리 얻기 
a_class = 'Siren'
b_class = 'Baby cry, infant cry'

#%%
# 폴더 만들기
if not os.path.exists(os.path.join(current_dir,'data')):
    os.mkdir(os.path.join(current_dir,'data'))

if not os.path.exists(os.path.join(current_dir,'data',a_class)):
    os.mkdir(os.path.join(current_dir,'data',a_class))

if not os.path.exists(os.path.join(current_dir,'data',a_class,'unbalanced','audio')):
    os.mkdir(os.path.join(current_dir,'data',a_class,'unbalanced'))
    os.mkdir(os.path.join(current_dir,'data',a_class,'unbalanced','audio'))
# %%
### 데이터 위에 주석 두줄 삭제해야 잘 됨 
### YTID에도 #없앧기
import pandas as pd
################ parent dir 바꾸기

class_df = pd.read_csv(f'{current_dir}class_labels_indices.csv')
# 데이터에 ,로 구분되는게 있어서 ", "로 구분되기 해야한다.
# https://research.google.com/audioset/ 에서 얻음
unbalanced_df = pd.read_csv(f'{current_dir}unbalanced_train_segments.csv',sep=", ")


# %%
################ flute, cello 부분을 원하는 data로 바꾸기(replace Flute, Cello를 원하는 변수로 바꾸세용)
a_class_mid = class_df[class_df['display_name']==a_class]['mid']
# to_string 하면 index까지 같이 나옴
# unbalanced_df[unbalanced_df["positive_labels"].str.find(flute_mid.to_string())!=-1]
a_class_df = unbalanced_df[unbalanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1]

#%%
## Additional
# 두개 다 겹치는경우 있느닞 확인
b_class_mid = class_df[class_df['display_name']==b_class]['mid']
print(len(unbalanced_df[(unbalanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)&(unbalanced_df["positive_labels"].str.find(b_class_mid.values[0])!=-1)]))
unbalanced_df[(unbalanced_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)&(unbalanced_df["positive_labels"].str.find(b_class_mid.values[0])!=-1)]
# b_class_df = unbalanced_df[(unbalanced_df["positive_labels"].str.find(b_class_mid.values[0])!=-1)]
# print(len(b_class_df[(b_class_df["positive_labels"].str.find(a_class_mid.values[0])!=-1)]))

# %%
### a_class
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
            from_check = True # 찾으면 그 다음부터 돌리기
        continue
    print(sr)
    print(f'https://www.youtube.com/watch?v={sr["YTID"]}')
    try:
        yt = YouTube(f'https://www.youtube.com/watch?v={sr["YTID"]}')
        vids = yt.streams.filter(file_extension='mp4').all() 
        # print(vids)
        # [<Stream: itag="140" mime_type="audio/mp4" abr="128kbps" acodec="mp4a.40.2">, <Stream: itag="249" mime_type="audio/webm" abr="50kbps" acodec="opus">, <Stream: itag="250" mime_type="audio/webm" abr="70kbps" acodec="opus">, <Stream: itag="251" mime_type="audio/webm" abr="160kbps" acodec="opus">]
        vids[0].download(f'{current_dir}data/{a_class}/unbalanced/')
        print(vids[0].default_filename)
        # ffmpeg -ss (start time) -i (direct video link) -t (duration needed) -c:v copy -c:a copy (destination file)
        ### Overwrite 안됨.
        subprocess.call(['ffmpeg','-ss',str(int(sr["start_seconds"])),'-i',
            os.path.join(f'{current_dir}data/{a_class}/unbalanced/' ,vids[0].default_filename),
            '-t',str(int(sr["end_seconds"]-sr["start_seconds"])),
            os.path.join(f'{current_dir}data/{a_class}/unbalanced/audio/',f'u{index}.mp3')
        ])
        subprocess.call(['mv',
            os.path.join(f'{current_dir}data/{a_class}/unbalanced/' ,vids[0].default_filename),
            os.path.join(f'{current_dir}data/{a_class}/unbalanced/',f'{index}.mp4')
        ])
    except Exception as ex:
        print('에러가 발생 했습니다', ex)
        error_list.append(index)
    # ffmpeg -ss 10 -i kk.mp4 -t 30 a.mp3



# %%
