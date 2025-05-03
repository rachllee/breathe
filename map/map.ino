#include <WiFi.h>
#include <WebServer.h>
#include "BasicStepperDriver.h"

// --------- WiFi Credentials ---------
const char* ssid = "Rachels iPhone";
const char* password = "roachhhh";

// --------- stepper1 Motor Settings ---------
#define MOTOR_STEPS 200 // Don't change. Values determined by hardware
#define MICROSTEPS 8 // Don't change. Values determined by hardware
#define STEP_PIN 32
#define DIR_PIN 14
#define EN_PIN 33

BasicStepperDriver stepper1(MOTOR_STEPS, DIR_PIN, STEP_PIN);
BasicStepperDriver stepper2(MOTOR_STEPS, 15, 33);
BasicStepperDriver stepper3(MOTOR_STEPS, 27, 12);

// --------- AQI Variables ---------
int latestAQI = 50;
float currentRPM = 30.0;  // Starting RPM

int direction = 1;
float totalStepsTaken = 0;

WebServer server(80);

// --------- AQI Endpoint ---------
void handleAQIPost() {
  if (server.hasArg("aqi")) {
    latestAQI = server.arg("aqi").toInt();
    Serial.print("Received AQI: ");
    Serial.println(latestAQI);

    // Change RPM formula below if needed
    float rpm = 10.0 + 50.0 * (1 - pow(0.985, latestAQI));

    currentRPM = constrain(rpm, 2.0, 60.0);
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

bool usingWifi = false;

void setup() {
  Serial.begin(115200);


  pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW);
  stepper1.begin(currentRPM, MICROSTEPS);
  stepper2.begin(currentRPM, MICROSTEPS);
  stepper3.begin(currentRPM, MICROSTEPS);


  // WiFi.begin(ssid, password);
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

const double stepSize1 = 1.8; // Ideally multiples of 1.8 / 8 because there are 8 microsteps per step
const double stepSize2 = 2.7;
const double stepSize3 = 3.6;

void loop() {
  server.handleClient();

  if (totalStepsTaken == 100) {
    direction *= -1;
    totalStepsTaken = 0;
  }
  totalStepsTaken += 1;

  stepper1.rotate(direction * stepSize1);
  stepper2.rotate(direction * stepSize2);
  stepper3.rotate(direction * stepSize3);
}

