#include <WiFi.h>
#include <HTTPClient.h>
#include <SoftwareSerial.h>

const char* ssid = "bchae";
const char* password = "byeorichae";

#include "FS.h"
#include "SPIFFS.h"

#define RECORDING_TIME 5 // 녹음 시간
#define RECORDING_DATA_SIZE RECORDING_TIME * 4000 // 8000 = 1초간 레코딩 데이타

SoftwareSerial BlueToothSerial(17, 16);

HTTPClient http;

int flag = 0;
const int headerSize = 44;
char filename[20] = "/sound1.wav";
int mode = 0; // 0  재생 모드 , 1 : 녹음 모드
byte header[headerSize];
int write_data_count = 0;
File file;
unsigned long start_millis;
uint8_t *buffer;
int vib_mode = 0;
int rgb_mode = 0;
int pre_sound_code = 0;

void CreateWavHeader(byte* header, int waveDataSize);

void record_process()
{
    uint16_t val = analogRead(33);
    val = val >> 4;
    buffer[write_data_count] = val;
    write_data_count++;
    if ( write_data_count >= RECORDING_DATA_SIZE )
    {
      Serial.println("RECORDING COMPLETED");
      Serial.println("START SAVING");
      Serial.println(millis() - start_millis);
      SPIFFS.remove(filename);
      file = SPIFFS.open(filename, FILE_WRITE);
      CreateWavHeader(header, RECORDING_DATA_SIZE);
      file.write(header, headerSize);
      file.write(buffer, RECORDING_DATA_SIZE);
      file.flush();
      file.close();
      mode = 0;
      Serial.println("SAVING COMPLETED");

	File file = SPIFFS.open("/sound1.wav");
	http.addHeader("Content-Type", "audio/wav");
	http.setTimeout(20000); //timeout 10초
	int httpResponseCode = http.sendRequest("POST", &file, file.size());
	if(httpResponseCode > 0){
	  String response = http.getString();
	  Serial.println(httpResponseCode);
	  Serial.println(response);
	  if(httpResponseCode == 203){
      if(pre_sound_code == 203){
        vib_mode = 0;
        rgb_mode = 0;  
      }
      else{
        pre_sound_code = 203;
      }
	  }
	  else if(httpResponseCode == 202){
		  if(pre_sound_code == 202){
			  vib_mode = 1;
			  rgb_mode = 1;
		  }
		  else{
			  pre_sound_code = 202;
		  }
	  }
	  else if(httpResponseCode == 201){
		  if(pre_sound_code == 201){
			vib_mode = 1;
			rgb_mode = 2;
		  }
		  else{
			  pre_sound_code = 201;
		  }
	  }
	}
	else{
		String response = http.getString();
		Serial.println("Error");
		Serial.println(httpResponseCode);
		Serial.println(response);
		vib_mode = 0;
		rgb_mode = 0;
	}
  }
}

//format bytes
String formatBytes(size_t bytes)
{
  if (bytes < 1024) {
    return String(bytes) + "B";
  } else if (bytes < (1024 * 1024)) {
    return String(bytes / 1024.0) + "KB";
  } else if (bytes < (1024 * 1024 * 1024)) {
    return String(bytes / 1024.0 / 1024.0) + "MB";
  } else {
    return String(bytes / 1024.0 / 1024.0 / 1024.0) + "GB";
  }
}

void setup()
{	
  BlueToothSerial.begin(9600);
  Serial.begin(115200);
  SPIFFS.begin();
  {
    File root = SPIFFS.open("/");
    File file = root.openNextFile();
    while (file)
    {
      String fileName = file.name();
      size_t fileSize = file.size();
      Serial.printf("FS File: % s, size: % s\n", fileName.c_str(), formatBytes(fileSize).c_str());
      file = root.openNextFile();
    }
    Serial.printf("\n");
    file.close();
  }

  if (!SPIFFS.begin())
  {
    Serial.println("SPIFFS Mount Failed");
    //while (1);
  }
  buffer = (uint8_t*) malloc(RECORDING_DATA_SIZE);
  memset(buffer, 0, RECORDING_DATA_SIZE);

  if (String(WiFi.SSID()) != String(ssid))
  {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
  }
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
 
	//http.begin("http://ec2-3-87-72-38.compute-1.amazonaws.com:8085/");
  http.begin("http://34.71.119.170:4000/");

  mode = 1;

}

bool exists(String path) {
  bool yes = false;
  File file = SPIFFS.open(path, "r");
  if (!file.isDirectory()) {
    yes = true;
  }
  file.close();
  return yes;
}

void loop()
{	
  if ( mode == 0 )
  {
	if(vib_mode == 1){
		//digitalWrite(VIB_PIN, 255);
		BlueToothSerial.print("3");
	}
	else{
		//digitalWrite(VIB_PIN, 0);
		BlueToothSerial.print("4");
	}
	if(rgb_mode == 0){
	  BlueToothSerial.print("9");
	}
	else if(rgb_mode == 1){//사이렌 소리
	  BlueToothSerial.print("8");
	}
	else{//아기 울음소리
	  BlueToothSerial.print("7");
	}
	  //delayMicroseconds(3000000); //3초 딜레이
    //delay(100000000);
	  Serial.println("LISTENING");
	  mode = 2;
	  write_data_count = 0;
	  start_millis = millis();
  }
  if ( mode == 1 )
  {
    record_process();
    delayMicroseconds(1000000 / 4200);
	//1000000/8000으로 했을 경우 소리가 조금 빠르게 감기는 경향이 있다. 딜레이를 감안해서 1000000/9000으로 했다!
  }
  if(mode == 2){
	uint16_t val = analogRead(33);
	val = val >> 4;
	if(val > 100) {
		mode = 1;
		Serial.println(val);
		Serial.println("SOUND DETECTED, START RECORDING");
	}
  }
}

void CreateWavHeader(byte* header, int waveDataSize)
{
  header[0] = 'R';
  header[1] = 'I';
  header[2] = 'F';
  header[3] = 'F';
  unsigned int fileSizeMinus8 = waveDataSize + 44 - 8;
  header[4] = (byte)(fileSizeMinus8 & 0xFF);
  header[5] = (byte)((fileSizeMinus8 >> 8) & 0xFF);
  header[6] = (byte)((fileSizeMinus8 >> 16) & 0xFF);
  header[7] = (byte)((fileSizeMinus8 >> 24) & 0xFF);
  header[8] = 'W';
  header[9] = 'A';
  header[10] = 'V';
  header[11] = 'E';
  header[12] = 'f';
  header[13] = 'm';
  header[14] = 't';
  header[15] = ' ';
  header[16] = 0x10;  // linear PCM
  header[17] = 0x00;
  header[18] = 0x00;
  header[19] = 0x00;
  header[20] = 0x01;  // linear PCM
  header[21] = 0x00;
  header[22] = 0x01;  // monoral
  header[23] = 0x00;
  header[24] = 0xA0;  // sampling rate 8000
  header[25] = 0x0F;
  header[26] = 0x00;
  header[27] = 0x00;
  header[28] = 0xA0;  // Byte/sec = 8000x1x1 = 16000
  header[29] = 0x0F;
  header[30] = 0x00;
  header[31] = 0x00;
  header[32] = 0x01;  // 8bit monoral
  header[33] = 0x00;
  header[34] = 0x08;  // 8bit
  header[35] = 0x00;
  header[36] = 'd';
  header[37] = 'a';
  header[38] = 't';
  header[39] = 'a';
  header[40] = (byte)(waveDataSize & 0xFF);
  header[41] = (byte)((waveDataSize >> 8) & 0xFF);
  header[42] = (byte)((waveDataSize >> 16) & 0xFF);
  header[43] = (byte)((waveDataSize >> 24) & 0xFF);
}
