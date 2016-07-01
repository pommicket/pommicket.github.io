var magnets = [];
var MAGNET_SIZE = 10;
var gameOver = false;
var safe_zone_radius = 300;
var Magnet = function()
{
    do
    {
        this.x = Math.floor(Math.random() * width);
        this.y = Math.floor(Math.random() * height);
    }
    while(dist(this.x, this.y, mouseX, mouseY) < safe_zone_radius);
    magnets.push(this);
}

Magnet.prototype.drawIt = function()
{
    noStroke();
    fill(150, 0, 0);
    ellipse(this.x, this.y, MAGNET_SIZE, MAGNET_SIZE);


    if (abs(this.x - mouseX) < MAGNET_SIZE / 2 && abs(this.y - mouseY) < MAGNET_SIZE / 2)
    {
        gameOver = true;
        alert("Score: " + magnets.length);
        magnets = [];
        gameOver = false;
        safe_zone_radius = 300;
    }



    this.x -= 50 * cos(atan2(this.y-mouseY, this.x-mouseX)) / dist(this.x, this.y, mouseX, mouseY);
    this.y -= 50 * sin(atan2(this.y-mouseY, this.x-mouseX)) / dist(this.x, this.y, mouseX, mouseY);



}

function setup()
{
    createCanvas(500, 500);
    ellipseMode(CENTER);
}

function draw()
{
    if (gameOver)
        return;

    background(255);

    stroke(255, 0, 0);
    noFill();
    rect(0, 0, width-1, height-1);
    fill(0);
    noStroke();
    textSize(20);
    text("Score: " + magnets.length, 5, 20);
    fill(0, 0, 150);
    ellipse(mouseX, mouseY,  MAGNET_SIZE, MAGNET_SIZE);
    noFill();
    stroke(0, 255, 0);
    safe_zone_radius *= 0.9995;
    ellipse(mouseX, mouseY, safe_zone_radius, safe_zone_radius);

    if ((mouseX > width || mouseY > height) && magnets.length > 0)
    {
        gameOver = true;
        alert("You went out of bounds. Score: " + magnets.length);
        magnets = [];
        gameOver = false;
        safe_zone_radius = 300;
    }

    if (frameCount % 100 === 0 && mouseX < width && mouseY < height)
        new Magnet();
    for (var i = 0; i < magnets.length; i++)
    {
        magnets[i].drawIt();
    }
}
