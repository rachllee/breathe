#include <WiFi.h>
#include <WebServer.h>
#include "BasicStepperDriver.h"

// --------- WiFi Credentials ---------
const char* ssid = "Rachels iPhone";
const char* password = "roachhhh";
int state = 0;
//const char* ssid = "AAKNOTE20";
//const char* password = "iwantWifi!";

// --------- stepper1 Motor Settings ---------
#define MOTOR_STEPS 200 // Don't change. Values determined by hardware
#define MICROSTEPS 8 // Don't change. Values determined by hardware
#define STEP_PIN 32
#define DIR_PIN 14
#define EN_PIN 33

BasicStepperDriver stepper1(MOTOR_STEPS, DIR_PIN, STEP_PIN);
BasicStepperDriver stepper2(MOTOR_STEPS, 15, 33);
BasicStepperDriver stepper3(MOTOR_STEPS, 27, 12);

#define GREEN 26
#define BLUE 4
#define RED 25
#define WHITE 13

// --------- AQI Variables ---------
int latestAQI = 50;
float currentRPM = 30.0;  // Starting RPM

int direction = 1;
float totalStepsTaken = 0;

WebServer server(80);

// --------- AQI Endpoint ---------
void setLight(int aqi) {
  if (aqi < 50) {
    analogWrite(26, 168);
    analogWrite(25, 230);
    analogWrite(4, 207);
  } else if (aqi < 80) {
    analogWrite(26, 255);
    analogWrite(25, 218);
    analogWrite(4, 3);
  } else if (aqi < 140) {
    analogWrite(26, 255);
    analogWrite(25, 165);
    analogWrite(4, 0);
  } else {
    analogWrite(26, 139);
    analogWrite(25, 0);
    analogWrite(4, 0);
  }
}

void handleAQIPost() {
  if (server.hasArg("aqi")) {
    latestAQI = server.arg("aqi").toInt();
    Serial.print("Received AQI: ");
    Serial.println(latestAQI);

    // Change RPM formula below if needed
    float rpm = 10.0 + 90.0 * (1 - pow(0.985, latestAQI));

    if(latestAQI >= 150) {
      state = 1;
    } else {
      state = 0;
    }

    currentRPM = constrain(rpm, 2.0, 100.0);
    stepper1.setRPM(currentRPM);
    stepper2.setRPM(currentRPM);
    stepper3.setRPM(currentRPM);

    Serial.print("Updated RPM: ");
    Serial.println(currentRPM);

    server.send(200, "text/plain", "AQI received!");
  } else {
    server.send(400, "text/plain", "Missing 'aqi' parameter.");
  }
}

const int freq = 5000;      // PWM frequency in Hz
const int ledChannel = 0;   // PWM channel (0-15)
const int resolution = 8;   // 8-bit resolution (0-255)


void setup() {
  Serial.begin(115200);

  while(!Serial.available());
  Serial.read();

  pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW);
  stepper1.begin(currentRPM, MICROSTEPS);
  stepper2.begin(currentRPM, MICROSTEPS);
  stepper3.begin(currentRPM, MICROSTEPS);

  // LED pins
  pinMode(RED, OUTPUT); // R
  pinMode(GREEN, OUTPUT); // G
  pinMode(BLUE, OUTPUT);  // B
  pinMode(WHITE, OUTPUT); // W

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());


  server.on("/aqi", HTTP_POST, handleAQIPost);
  server.begin();
  Serial.println("Server started.");

}
// Ideally multiples of 1.8 / 8 because there are 8 microsteps per step
const double stepSize1 = 1.8; 
const double stepSize2 = 1.8;
const double stepSize3 = 1.8;

int fade = 2;

void loop() {
  server.handleClient();

  if (totalStepsTaken == 100) {
    direction *= -1;
    totalStepsTaken = 0;
  }
  totalStepsTaken += 1;

  fade += direction;
  switch(state) {
    case 0:
      analogWrite(BLUE, fade);
      analogWrite(RED, 0);
      break;
    case 1:
      analogWrite(RED, fade);
      analogWrite(BLUE, 0);
  } 

  stepper1.rotate(direction * stepSize1);
  stepper2.rotate(direction * stepSize2);
  stepper3.rotate(direction * stepSize3);
}

