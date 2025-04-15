#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Rachels iPhone";
const char* password = "roachhhh";

const int dirPin = 14;
const int stepPin = 32;

int direction = 1;
int latestAQI = 0;

unsigned long lastStepTime = 0;
float stepDelay = 8;
const int stepsPerCycle = 1000;
int currentStep = 0;

WebServer server(80);

void handleAQIPost() {
  if (server.hasArg("aqi")) {
    latestAQI = server.arg("aqi").toInt();
    Serial.print("Received AQI: ");
    Serial.println(latestAQI);


    stepDelay = 15.0 * pow(0.985, latestAQI);
    Serial.print("Updated step delay (ms): ");
    Serial.println(stepDelay);

    server.send(200, "text/plain", "AQI received!");
  } else {
    server.send(400, "text/plain", "Missing 'aqi' parameter.");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  digitalWrite(dirPin, direction);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/aqi", HTTP_POST, handleAQIPost);
  server.begin();
  Serial.println("Server started.");
}

void loop() {
  server.handleClient();

  unsigned long now = millis();

  if (now - lastStepTime >= stepDelay) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(100);
    digitalWrite(stepPin, LOW);
    lastStepTime = now;

    currentStep++;

    if (currentStep >= stepsPerCycle) {
      direction = !direction;
      digitalWrite(dirPin, direction);
      currentStep = 0;
    }
  }
}

