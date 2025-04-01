#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Rachels iPhone";
const char* password = "roachhhh";

// Create web server on port 80
WebServer server(80);

int latestAQI = 0;

void handleAQIPost() {
  if (server.hasArg("aqi")) {
    latestAQI = server.arg("aqi").toInt();
    Serial.print("Received AQI: ");
    Serial.println(latestAQI);
    server.send(200, "text/plain", "AQI received!");
  } else {
    server.send(400, "text/plain", "Missing 'aqi' parameter.");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Route to handle incoming AQI
  server.on("/aqi", HTTP_POST, handleAQIPost);

  server.begin();
  Serial.println("Server started.");
}

void loop() {
  server.handleClient();
}
