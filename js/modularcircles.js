function setup()
{
	createCanvas(600, 600);
}

function nPoints()
{
	return document.getElementById("npoints").value;
}

function shouldMul()
{
	return document.getElementById("should_mul").checked;
}

function amount()
{
	return parseFloat(document.getElementById("amount").value);
}

function getPos(number)
{
	angle = 2*PI * number/(nPoints()); 
	return [cos(angle)*250+300, sin(angle)*250+300];
}

function draw()
{
	if (shouldMul())
		document.getElementById("amount").step = 0.1;
	else
		document.getElementById("amount").step = 1;
	background(255);
	ellipseMode(CENTER);
	noStroke();
	fill(0);
	for (var i = 0; i < nPoints(); i++)
		ellipse(getPos(i)[0], getPos(i)[1], 3, 3);
	
	stroke(0);
	for (var i = 0; i < nPoints(); i++)
	{
		if (shouldMul())
		{
			stroke(map(map((amount()*i)%nPoints(), 0, nPoints(), 0, 256) - map(i, 0, nPoints(), 0, 256), -256, 256, 0, 256), map(i, 0, nPoints(), 0, 256), map((amount()*i)%nPoints(), 0, nPoints(), 0, 256));
			line(getPos(i)[0], getPos(i)[1], getPos((amount()*i)%nPoints())[0], getPos((amount()*i)%nPoints())[1]); 
		}
		else
		{
			stroke(0, map(i, 0, nPoints(), 0, 256), map((amount()+i)%nPoints(), 0, nPoints(), 0, 256));
			line(getPos(i)[0], getPos(i)[1], getPos((amount()+i)%nPoints())[0], getPos((amount()+i)%nPoints())[1]);
		}
	}
}