//
//  2d Layered Landscape generator
//  using 1d perlin noise, 3 layers of landscape
//
let rng = function (min, max) {
    return Math.random() * max + min;
}

let Layer = function (offAmount, r, g, b) {
    this.start = rng(-5000, 5000);
    this.xoff = this.start;
    this.offAmount = offAmount;
    this.r = r;
    this.g = g;
    this.b = b;
    this.keys = function () {
        if (keyCode === ENTER) {
            this.start += this.offAmount * 8;
        } else if (keyIsDown(LEFT_ARROW)) {
            this.start -= this.offAmount * 5;
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.start += this.offAmount * 5;
        } else this.start;
    }
    this.draw = function (yhlow, yhhigh, res) {
        beginShape();
        vertex(0, height);
        // stroke(160);
        noStroke();
        fill(this.r, this.g, this.b, this.a);
        // noFill()
        for (let x = 0; x < width; x += res) {
            let y = map(noise(this.xoff), 0, 1, yhlow, yhhigh);
            vertex(x, y);
            this.xoff += this.offAmount;
        }
        vertex(width, height);
        vertex(0, height);
        endShape();
        // this.start += this.offAmount;
        this.keys();
        this.xoff = this.start;
    }
}
let clouds = {
    start: 0,
    xoff: 0,
    yoff: 0,
    inc: 0.002,
    draw: function () {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let index = (x + y * width) * 4;
                let r = noise(this.xoff, this.yoff) * 200;
                pixels[index + 0] = r;
                pixels[index + 1] = r;
                pixels[index + 2] = r;
                pixels[index + 3] = 200;
                this.xoff += this.inc;
            }
            this.xoff = this.start;
            this.yoff += this.inc;
        }
        updatePixels();
        this.start -= 0.005;
        this.yoff = this.start;
    }
}

//create new layers at specific offset amount, and r,g,b,a.
let layer1;
let layer2;
let layer3;
let layer4;
let backred;

//refresh sketch functions.
let createNewLandscape = function () {
    layer1 = new Layer(0.003, rng(0, 100), rng(50, 100), 50);
    layer2 = new Layer(0.003, rng(0, 100), rng(50, 100), 50);
    layer3 = new Layer(0.003, rng(0, 100), rng(50, 100), 50);
    layer4 = new Layer(0.001, rng(0, 100), rng(50, 100), 50);
    backred = rng(0, 150);
}

//function to do all draw() functions at once, used for refresh button

let landscapeLayersDraw = function () {
    background(backred, 20, 240); // sky
    layer4.draw(300, 150, 0.2); //distant mountains
    fill(255, 100); // fog
    rect(0, 0, width, height);
    layer3.draw(280, 190, 0.25); //distant mountains
    fill(255, 80); // fog
    rect(0, 0, width, height);
    layer2.draw(300, 190, 0.3); //mid range mountains
    fill(255, 50); //fog
    rect(0, 0, width, height);
    layer1.draw(300, 220, 0.35
); //close hills
}

//background red init
function setup() {
    angleMode(DEGREES);
    let canvas = createCanvas(windowWidth - 20, 300);
    canvas.parent("sketch"); //places sketch inside div in html
    createNewLandscape();
    noiseDetail(7, 0.55); // roughens the hills a bit
};

function draw() {
    landscapeLayersDraw();
    frameRate(30);
}
//GUI setup
let refreshSketchButton = document.getElementById("refreshSketch");

refreshSketchButton.addEventListener('click', createNewLandscape);