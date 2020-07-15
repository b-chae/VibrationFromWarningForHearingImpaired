#include <SoftwareSerial.h>

SoftwareSerial mySerial(16, 17);

#define R_PIN 14
#define G_PIN 27
#define B_PIN 26
#define VIB_PIN 32

void LED_RED(){
	digitalWrite(R_PIN, 0);
	digitalWrite(G_PIN, 255);
	digitalWrite(B_PIN, 255);
}

void LED_BLUE(){
	digitalWrite(R_PIN, 255);
	digitalWrite(G_PIN, 255);
	digitalWrite(B_PIN, 0);
}

void LED_OFF(){
  LED_RED();
	digitalWrite(R_PIN, 0);
	digitalWrite(G_PIN, 0);
	digitalWrite(G_PIN, 0);
	
	digitalWrite(R_PIN, 255);
	digitalWrite(G_PIN, 255);
	digitalWrite(G_PIN, 255);
}

void VIB_ON(){
	digitalWrite(VIB_PIN, 255);
}

void VIB_OFF(){
	digitalWrite(VIB_PIN, 0);
}

void setup(){
  mySerial.begin(9600);
  Serial.begin(115200);
  pinMode(R_PIN, OUTPUT);
  pinMode(G_PIN, OUTPUT);
  pinMode(B_PIN, OUTPUT);
  pinMode(VIB_PIN, OUTPUT);
  LED_OFF();
  VIB_OFF();
}

void loop(){
  if(mySerial.available()){
   char c = (char)mySerial.read();
   Serial.println(c);
    if(c == '7') {
		LED_BLUE();
    } else if(c == '8'){
		LED_RED();
    } else if(c == '9'){
		LED_OFF();
	} else if(c == '4'){
		VIB_OFF();
	} else if(c == '3'){
		VIB_ON();
	}
  }  
}
