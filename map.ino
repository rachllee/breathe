const int dirPin = 14;
const int stepPin = 32;

int direction = 1; // 1 is clockwise, vice versa
int latestAQI = 0;

unsigned long lastStepTime = 0;
unsigned long stepDelay = 1000 / 200;
unsigned long cycleStartTime = 0;
unsigned long cycleDuration = 3000; 
bool hiccupActive = false;

WebServer server(80);

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

  cycleStartTime = millis();
}

void loop() {
  server.handleClient();
  unsigned long now = millis();

  if (now - cycleStartTime >= cycleDuration) {
    direction = !direction;
    digitalWrite(dirPin, direction);
    cycleStartTime = now;
  }

  if (shouldHiccup(latestAQI)) {
    performHiccup();
    return;
  }

  if (now - lastStepTime >= stepDelay) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(100);
    digitalWrite(stepPin, LOW);
    lastStepTime = now;
  }
}

void performHiccup() {
  int hiccupSteps = random(1, 3);
  digitalWrite(dirPin, !direction);

  for (int i = 0; i < hiccupSteps; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(100);
    digitalWrite(stepPin, LOW);
    delay(stepDelay);
  }

  digitalWrite(dirPin, direction);
}

bool shouldHiccup(int aqi) {
  int hiccupChance = map(constrain(aqi, 0, 300), 0, 300, 0, 70);
  return random(0, 100) < hiccupChance;
}
