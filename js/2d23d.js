var angle = 0;
var state = 0;
var rotations = 0;
var waiting = false;
var iterations = 0;
var radius = 200;

function checkRotations()
{
	if (rotations > 0)
	{
		rotations = 0;
		angle = 0;
		waiting = true;
	}
}

function setup()
{
	createCanvas(2 * radius + 100, 2 * radius + 100);
	ellipseMode(CENTER);
	rectMode(CENTER);
	noFill();
	frameRate(100);
}

function draw()
{
	if (waiting)
	{
		iterations++;

		if (iterations > 150)
		{
			iterations = 0;
			waiting = false;
			background(255, 255, 255);
			state++;
		}
		return;
	}
	var x  = cos(angle) * radius + radius + 50;
	var y  = sin(angle) * radius + radius + 50;

	angle += 0.1/6;

	if (angle > TWO_PI)
		rotations++;

	checkRotations();

	angle %= TWO_PI;

	if (state == 0)
		ellipse(x, y, 50, 50);

	else if (state == 1)
		rect(x, y, 50, 50);

	else if (state == 2)
		triangle(x, y, x+50, y, x, y+50);


	else if (state == 3)
		triangle(x, y, x+25, y+25, x, y+50);


	else if (state == 4)
		ellipse(x, y, 100, 50);


	else if (state == 5)
		line(x, y, x+50, y);


	else if (state == 6)
		line(x, y, x, y+50);

	else if (state >= 7)
		arc(x, y, 50, 50, 0, (HALF_PI + state) % TWO_PI);


}
