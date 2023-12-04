#include <ArduinoJson.h>

// project variables
int B0PIN = 2;
int B1PIN = 3;
int LEDPIN = 4;

int b0Val = 0;
int b1Val = 0;

long turnLedOffTime = 0;
int LED_DURATION = 1000;

void writeData() {
  StaticJsonDocument<128> resJson;
  JsonObject data = resJson.createNestedObject("data");
  JsonObject jB0 = data.createNestedObject("B0");
  JsonObject jB1 = data.createNestedObject("B1");

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
  b0Val = digitalRead(B0PIN);
  b1Val = digitalRead(B1PIN);

  if (Serial.available() > 0) {
    int byteIn = Serial.read();
    if (byteIn == 'D') {
      Serial.flush();
      writeData();
    } else if (byteIn == 'S') {
      Serial.flush();
      digitalWrite(LEDPIN, HIGH);
      turnLedOffTime = millis() + LED_DURATION;
    }
  }

  if (millis() > turnLedOffTime) {
    digitalWrite(LEDPIN, LOW);
  }

  delay(1);
}
