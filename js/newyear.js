var WIDTH = 650;
var HEIGHT = 650;
var CIRCLE_SIZE = 20;
var SECOND_CIRCLE = 200;
var MINUTE_CIRCLE = 300;
var HOUR_CIRCLE = 400;
var DAY_CIRCLE = 600;
var FIREWORK_RADIUS = 10;

var fireworks = [];
var state = 0;
var startingYear;
var startingDy = -1;

function setup()
{
    createCanvas(650, 650);
    ellipseMode(CENTER);
    $("#title").html("Countdown to " + (year() + 1));
    document.title = "Countdown to " + (year() + 1);
	startingYear = year();

}

function leapYear()
{
   return year() % 4 == 0 && (!(year() % 100 == 0) || year() % 400 == 0) ? 1 : 0;
}


function day365()
{
    var m = month()-1;
    var d = day()-1;
    var currday = 0;
    if (m == 0)
      return d;
    currday += 31;
    if (m == 1)
      return d+currday;
    currday += 28 + leapYear();
    if (m == 2)
      return d+currday;
    currday += 31;
    if (m == 3)
      return d+currday;
    currday += 30;
    if (m == 4)
      return d+currday;
    currday += 31;
    if (m == 5)
      return d+currday;
    currday += 30;
    if (m == 6)
      return d+currday;
    currday += 31;
    if (m == 7)
      return d+currday;
    currday += 31;
    if (m == 8)
      return d+currday;
    currday += 30;
    if (m == 9)
      return d+currday;
    currday += 31;
    if (m == 10)
      return d+currday;
    currday += 30;
    if (m == 11)
      return d+currday;
    return -1;
}

function sigmoid(x)
{
	return 1/(1+Math.exp(-x))
}

function Firework(x, y)
{
	this.x = x;
	this.y = y;
	this.r = Math.random()*255;
	this.g = Math.random()*255;
	this.b = Math.random()*255;
	this.vel = [Math.random()*10-5, Math.random()*10-5];
	this.t = 0;
	this.index = fireworks.length;
	fireworks.push(this);
}

Firework.prototype.draw = function()
{
	noStroke();
	fill(this.r,this.g,this.b,2*255-2*255*sigmoid(this.t/2));
	//ellipse(this.x, this.y, FIREWORK_RADIUS, FIREWORK_RADIUS);
	text((startingYear+1) + "!", this.x, this.y)
	this.t += 0.1;
	this.x += this.vel[0];
	this.y += this.vel[1];
	if (this.x > width-FIREWORK_RADIUS || this.x < -FIREWORK_RADIUS || this.y > height-FIREWORK_RADIUS || this.y < -FIREWORK_RADIUS)
		fireworks[this.index] = null;
}

function numDigits(x)
{
    return x.toString().length;
}

function draw()
{
    background(255, 255, 255);

    if (state == 1)
    {
        //Happy new year!
		fill(0);
        textSize(60);
        textAlign(LEFT, BASELINE);
        text("HAPPY NEW YEAR!", 25, 250);
        new Firework(300, 300);
		for (var i = 0; i < fireworks.length; i++)
		{
			var firework = fireworks[i];
			if (firework != null)
				firework.draw();
		}
		return;
    }

    var date = new Date();
    var ms = date.getTime() % 1000;
    var s = second();
    var h = hour();
    var m = minute();
    var secs = s + ms/1000;
    var mins = m + secs / 60;
    var hrs = h + mins / 60;
    var dy =  day365() + hrs / 24;
	if (startingDy == -1)
		startingDy = dy;
	if (dy < startingDy)
	{
		state = 1;
	}
    var percent_ny = dy/(365+leapYear());
    var hours = TWO_PI * (hrs / 24) - HALF_PI;
    var minutes = TWO_PI * (mins / 60) - HALF_PI;
    var seconds = TWO_PI * (secs / 60) - HALF_PI;
    var date = TWO_PI * percent_ny - HALF_PI;
    var seconds_until_ny = Math.floor(86400*(365+leapYear()-dy));
	if (seconds_until_ny == 0)
	{
		state = 1;
	}
    noFill();

    stroke(secs*4, 0, 0);
    ellipse(WIDTH / 2, HEIGHT / 2, SECOND_CIRCLE, SECOND_CIRCLE);
    stroke(0, mins*4, 0);
    ellipse(WIDTH / 2, HEIGHT / 2, MINUTE_CIRCLE, MINUTE_CIRCLE);
    stroke(0, 0, hrs*4);
    ellipse(WIDTH / 2, HEIGHT / 2, HOUR_CIRCLE, HOUR_CIRCLE);
    stroke(0, 0, 0);
    ellipse(WIDTH / 2, HEIGHT / 2, DAY_CIRCLE, DAY_CIRCLE);

    noStroke();

    var dayX = (cos(date) * DAY_CIRCLE / 2) + WIDTH / 2;
    var dayY = (sin(date) * DAY_CIRCLE / 2) + HEIGHT / 2;

    var hourX = (cos(hours) * HOUR_CIRCLE / 2) + WIDTH / 2;
    var hourY = (sin(hours) * HOUR_CIRCLE / 2) + HEIGHT / 2;

    var minuteX = (cos(minutes) * MINUTE_CIRCLE / 2) + WIDTH / 2;
    var minuteY = (sin(minutes) * MINUTE_CIRCLE / 2) + HEIGHT / 2;

    var secondX = (cos(seconds) * SECOND_CIRCLE / 2) + WIDTH / 2;
    var secondY = (sin(seconds) * SECOND_CIRCLE / 2) + HEIGHT / 2;

    fill(secs*4, 0, 0);
    ellipse(secondX, secondY, CIRCLE_SIZE, CIRCLE_SIZE);
    fill(0, mins*4, 0);
    ellipse(minuteX, minuteY, CIRCLE_SIZE, CIRCLE_SIZE);
    fill(0, 0, hrs*4);
    ellipse(hourX, hourY, CIRCLE_SIZE, CIRCLE_SIZE);
    fill(0, 0, 0);
    ellipse(dayX, dayY, CIRCLE_SIZE, CIRCLE_SIZE);
    textSize(56/(numDigits(seconds_until_ny)/5.0));
    textAlign(CENTER, CENTER);
    text(seconds_until_ny, width/2, height/2);
}
