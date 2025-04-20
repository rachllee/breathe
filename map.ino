#include <WiFi.h>
#include <WebServer.h>
#include "BasicStepperDriver.h"

// --------- WiFi Credentials ---------
const char* ssid = "Rachels iPhone";
const char* password = "roachhhh";

// --------- Stepper Motor Settings ---------
#define MOTOR_STEPS 200          
#define MICROSTEPS 16            
#define STEP_PIN 32
#define DIR_PIN 14
#define EN_PIN 33

BasicStepperDriver stepper(MOTOR_STEPS, DIR_PIN, STEP_PIN);

// --------- AQI Variables ---------
int latestAQI = 50;
float currentRPM = 30.0;  // Starting RPM
unsigned long lastStepTime = 0;
unsigned long stepIntervalMicros = 0;

bool direction = true;
const unsigned long cycleDuration = 3000; // Reverse every 3 seconds
unsigned long lastDirectionChange = 0;

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
    stepper.setRPM(currentRPM);

    Serial.print("Updated RPM: ");
    Serial.println(currentRPM);

    server.send(200, "text/plain", "AQI received!");
  } else {
    server.send(400, "text/plain", "Missing 'aqi' parameter.");
  }
}

void setup() {
  Serial.begin(115200);


  pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW);
  stepper.begin(currentRPM, MICROSTEPS);


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

  lastDirectionChange = millis();
}

void loop() {
  server.handleClient();

  unsigned long now = millis();
  if (now - lastDirectionChange > cycleDuration) {
    direction = !direction;
    lastDirectionChange = now;
  }


  stepper.rotate(direction ? 1 : -1);
}

