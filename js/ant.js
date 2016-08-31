var cells = [];
var direction = 'u';
var antPos;
var running = false;

function turnright(d)
{
	switch(d)
	{
	case 'u':
		return 'r';
	case 'd':
		return 'l';
	case 'r':
		return 'd';
	case 'l':
		return 'u';
	}
}

function turnleft(d)
{
	switch(d)
	{
	case 'u':
		return 'l';
	case 'd':
		return 'r';
	case 'r':
		return 'u';
	case 'l':
		return 'd';
	}
}


function setup()
{
	frameRate(100);
	createCanvas(500, 500);
	antPos = [width/2, height/2];

	for (var i = 0; i < height; i++)
	{
		cells.push([]);
		for (var j = 0; j < width; j++)
		{
			cells[i].push(1);
		}
	}
	stroke(255, 0, 0);
	point(antPos[0], antPos[1]);
}



function start()
{
	running = true;
}

function stop()
{
	running = false;
}



function resetPos()
{
	drawCell(antPos[0], antPos[1]);
	antPos[0] = width/2;
	antPos[1] = height/2;
	stroke(255, 0, 0);
	point(antPos[0], antPos[1]);
}

function drawCell(x, y)
{
	stroke(cells[y][x]*255);
	point(x, y);
}

function draw()
{
	if (!running)
		return;

	var speed = parseInt($("#speed").val());

	if (isNaN(speed))
		speed = 0;

	for (var i = 0; i < speed; i++)
	{

		if (antPos[0] < 0 || antPos[0] >= width || antPos[1] < 0 || antPos[1] >= height)
		{
			running = false;
		}

		if (!running)
			return;

		if (cells[antPos[1]][antPos[0]] == 1)
			direction = turnright(direction);
		else
			direction = turnleft(direction);


		cells[antPos[1]][antPos[0]] = 1-cells[antPos[1]][antPos[0]];
		drawCell(antPos[0], antPos[1]);

		if (direction == 'u')
			antPos[1]--;
		else if (direction == 'l')
			antPos[0]--;
		else if (direction == 'd')
			antPos[1]++;
		else if (direction == 'r')
			antPos[0]++;

		stroke(255, 0, 0);
		point(antPos[0], antPos[1]);
	}
}

function mouseDragged()
{
	if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
		return;
	cells[mouseY][mouseX] = 1-cells[mouseY][mouseX];
	drawCell(mouseX, mouseY);
}

function clearCells()
{
	cells = [];
	for (var i = 0; i < height; i++)
	{
		cells.push([]);
		for (var j = 0; j < width; j++)
		{
			cells[i].push(1);
		}
	}
	background(255);
	stroke(255, 0, 0);
	point(antPos[0], antPos[1]);
}
