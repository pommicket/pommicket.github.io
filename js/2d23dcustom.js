var RETURN = 13;
var SHIFT = 16;
var ret_pressed = false;
var drawing;
var radius = 200;
var angle = 0;
var done = false;
var straightLine = false;
var slFirstPos = [];

function setup()
{
	createCanvas(100, 100);
	drawing = createGraphics(100, 100);
	stroke(255, 0, 0);
	line(0, 0, 99, 0);
	line(0, 0, 0, 99);
	line(0, 99, 99, 99);
	line(99, 0, 99, 99);
	stroke(0);
}

function outOfBounds(x)
{
	return constrain(x, 0, 100) != x;
}

function mouseDragged()
{
	if (outOfBounds(pmouseX) || outOfBounds(mouseX) || 
		outOfBounds(pmouseY) || outOfBounds(mouseY))
		return;
	stroke(0, 0, 0);
	drawing.line(pmouseX, pmouseY, mouseX, mouseY);
	line(pmouseX, pmouseY, mouseX, mouseY);
}

function mouseClicked()
{
	
	if (straightLine)
	{
		line(slFirstPos[0], slFirstPos[1], mouseX, mouseY);
		drawing.line(slFirstPos[0], slFirstPos[1], mouseX, mouseY);
		straightLine = false;
		return;	
	}
	slFirstPos = [mouseX, mouseY];
}

function keyPressed()
{
	if (keyCode == RETURN)
	{
		if (straightLine)
			return;
		if (ret_pressed)
			return;
		ret_pressed = true;
		createCanvas(600, 600);
	}
	else if (keyCode == SHIFT)
	{
		straightLine = true;
	}
}

function draw()
{
	cursor(ARROW);
	if (!ret_pressed)
		return;
	
	if (done)
		return;
		
	if (angle > TWO_PI)
		return;
	
	stroke(255, 0, 0);
	tint(255, 0, 0);
	var ca = cos(angle) * radius + radius + 50;
	var sa = sin(angle) * radius + radius + 50;
	
	
	image(drawing, ca, sa);

	angle += 0.1/6;
	
}