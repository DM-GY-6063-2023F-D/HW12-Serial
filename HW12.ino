#include <ArduinoJson.h>

#include "config.h"

// project variables
int B0PIN = 2;
int B1PIN = 3;
int POTPIN = A0;
int LEDPIN = 4;

int b0Val = 0;
int b1Val = 0;

int currA0Val = 0;
int prevA0Val = 0;
int deltA0Val = 0;

long turnOffLed = 0;

void writeData() {
  StaticJsonDocument<128> resJson;
  JsonObject data = resJson.createNestedObject("data");
  JsonObject jA0 = data.createNestedObject("A0");
  JsonObject jB0 = data.createNestedObject("B0");
  JsonObject jB1 = data.createNestedObject("B1");

  jA0["value"] = currA0Val;
  jA0["delta"] = 0;  //deltA0Val;

  jB0["isPressed"] = b0Val;
  jB1["isPressed"] = b1Val;

  String resTxt = "";
  serializeJson(resJson, resTxt);

  Serial.println(resTxt);
}

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  // project setup
  pinMode(B0PIN, INPUT);
  pinMode(B1PIN, INPUT);
  pinMode(LEDPIN, OUTPUT);
}

void loop() {
  // read pins
  currA0Val = analogRead(POTPIN);
  b0Val = digitalRead(B0PIN);
  b1Val = digitalRead(B1PIN);

  deltA0Val = 0;
  if (currA0Val - prevA0Val > 5) {
    deltA0Val = 1;
  } else if (currA0Val - prevA0Val < -5) {
    deltA0Val = -1;
  }

  prevA0Val = currA0Val;

  if (Serial.available() > 0) {
    int byteIn = Serial.read();
    if (byteIn == 'T') {
      Serial.flush();
      writeData();
    } else if (byteIn == 'E') {
      Serial.flush();
      digitalWrite(LEDPIN, HIGH);
      turnOffLed = millis() + 1000;
    }
  }

  if (millis() > turnOffLed) {
    digitalWrite(LEDPIN, LOW);
  }

  delay(1);
}
