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
	var ca = cos(angle) * radius + radius + 50;
	var sa = sin(angle) * radius + radius + 50;
	
	angle += 0.1/6;
	
	if (angle > TWO_PI)
		rotations++;
			
	checkRotations();
	
	angle %= TWO_PI;
	
	if (state == 0)
		ellipse(ca, sa, 50, 50);
	
	else if (state == 1)
		rect(ca, sa, 50, 50);

	else if (state == 2)
		triangle(ca, sa, ca+50, sa, ca, sa+50);

	
	else if (state == 3)
		triangle(ca, sa, ca+25, sa+25, ca, sa+50);

	
	else if (state == 4)
		ellipse(ca, sa, 100, 50);

	
	else if (state == 5)
		line(ca, sa, ca+50, sa);

	
	else if (state == 6)
		line(ca, sa, ca, sa+50);

	else if (state >= 7)
		arc(ca, sa, 50, 50, 0, (HALF_PI + state) % TWO_PI);

	
}