#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "iptime";
const char* password = "44167104";

#include "FS.h"
#include "SPIFFS.h"

#define RECORDING_TIME 3 // 녹음 시간
#define RECORDING_DATA_SIZE RECORDING_TIME * 8000 // 8000 = 1초간 레코딩 데이타
#define VIB_PIN 32
#define R_PIN 14
#define G_PIN 27
#define B_PIN 26

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
void record_process(void);
String formatBytes(size_t);
void LED_RED(void);
void LED_BLUE(void);
void LED_OFF(void);
void setup();
bool exists(String);
void loop(void);