let tracks = [];
let num1 = 10;
let rose = [];
let num2 = 10;
let h1 = 50;
let partColor = 175;
//Arduino stuff
let pulse = 0;
let serial; // the Serial object
let serialOptions = { baudRate: 9600 };

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < num1; i++) {
    tracks.push(new Particle());
  }
  background(30);
    // Setup Web Serial using serial.js
    serial = new Serial();
    serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
    serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
    serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
  
    // If we have previously approved ports, attempt to connect with them
    serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
  
    // Add in a lil <p> element to provide messages. This is optional
    pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
}

function draw() {
  background(30, 1);
  for (i = 0; i < tracks.length; i++) { 
    tracks[i].run();
  }
  rose.push(new Petals(createVector(0, 0)))
  for(let i = rose.length - 1; i >= 0; i--){
    let p = rose[i];
    p.run();
    if (p.ghost()){
      rose.splice(i, 1);
    }
  }

  if (pulse <= 0){
    partColor = 175;
} else if (pulse >= 0){
  partColor = 0;
}
}


class Particle{
  constructor(){
    this.loc = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.ts = random(5);
  }
  run(){
    this.update();
    this.edges();
    this.display();
  }
  update(){
    this.a = p5.Vector.random2D();
    this.a.mult(random(3));
    this.vel.add(this.a);
    this.vel.limit(this.ts);
    this.loc.add(this.vel);
  }
  edges(){
    if (this.loc.x <= 0){
        this.loc.x = width;
    }
    if (this.loc.x >= width){
        this.loc.x = 0
    }
    if (this.loc.y <= 0){
        this.loc.y = height
    }
    if (this.loc.y >= height){
      this.loc.y = 0
      }
  }
  
  display(){
    noStroke();
    //fill(175, 100, 100);
    fill(partColor, 100, 100);
    ellipse(this.loc.x, this.loc.y, random(10));
  }
  
  
}

class Petals{
  constructor(){
  this.loc = createVector(width/2, height/2);
  this.accel = createVector(random(-0.05, 0.05), random(-0.06, 0.06));
    this.vel = createVector(random(-1,1), random(-1,1));
    this.lifespan = 70.0;
    this.hue = 0;
  }
  run(){
    this.update();
    this.display();
  }

  update(){
    this.vel.add(this.accel);
    this.loc.add(this.vel);
    this.lifespan -= random(1,2);
    this.hue += random(1.5);
  }

  display(){
    noStroke();
    fill(360, 100, this.hue, this.lifespan);
    rectMode(CENTER);
    circle(this.loc.x, this.loc.y, random(this.hue+10));
}
  ghost(){
    if (this.lifespan < 0.0){
      return true;
    } else {
      return false;
    }
  }
}

function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
}

function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
}

function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
}

function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  //pHtmlMsg.html("onSerialDataReceived: " + newData);

  pulse = parseFloat(newData);
}

function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}