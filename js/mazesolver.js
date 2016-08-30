
var canvas = document.getElementById('Canvas');
var form = document.getElementById('Form');


var X;
var Y;
var TILEWIDTH;

var started = false;

var tiles = [];
for (var i = 0; i < Y; i++)
{
	tiles.push([]);
	for (var j = 0; j < X; j++)
		tiles[i].push(false);
}

var tilesToGoal = [];
for (var i = 0; i < Y; i++)
{
	tilesToGoal.push([]);
	for (var j = 0; j < X; j++)
		tilesToGoal[i].push(false);
}


var ctx = canvas.getContext('2d');

var mouseDown = false;

var startPlaced = false;
var endPlaced = false;
var begun = false;

var start; //(location)
var end; //(location)

var doesItWorkParagraph = document.getElementById('DoesItWork');

function reset()
{
	TILEWIDTH = Math.ceil(canvas.width / X);
	if (canvas.width !== TILEWIDTH * X)
		canvas.width = TILEWIDTH * X;
	if (canvas.height !== TILEWIDTH * X)
		canvas.height = TILEWIDTH * X;
	startPlaced = false;
	endPlaced = false;
	begun = false;
	start = [];
	end = [];
	tiles = [];
	for (var i = 0; i < Y; i++)
	{
		tiles.push([]);
		for (var j = 0; j < X; j++)
			tiles[i].push(false);
	}

	tilesToGoal = [];
	for (var i = 0; i < Y; i++)
	{
		tilesToGoal.push([]);
		for (var j = 0; j < X; j++)
			tilesToGoal[i].push(false);
	}
}

function maxIndex(l)
{
	if (l === [])
		return -1;

	var highest = l[0];
	var highestindex = 0;

	for (var i = 1; i < l.length; i++)
		if (l[i] > highest)
		{
			highest = l[i];
			highestindex = i;
		}
	return highestindex;
}

function to1d(l)
{
	//Turns a 2d array into a 1d array
	var newl = [];
	for (var y = 0; y < l.length; y++)
		for (var x = 0; x < l[y].length; x++)
			newl.push(l[y][x]);
	return newl;
}

function equals2d(array1, array2)
{
	return equals(to1d(array1), to1d(array2));
}
function maxValue(l)
{
	if (l === [])
		return -1;

	var highest = l[0];

	for (var i = 1; i < l.length; i++)
		if (l[i] > highest)
			highest = l[i];

	return highest;
}



function copy2d(array)
{
	var newarray = [];
	for (var i = 0; i < array.length; i++)
		newarray.push(array[i].slice())

	return newarray;
}

function equals(array1, array2)
{
	for (var i = 0; i < array1.length; i++)
		if (array1[i] !== array2[i])
			return false;
	return true;
}

function index2d(array, x)
{
	for (var i = 0; i < array.length; i++)
		if (equals(array[i], x))
			return i;
	return -1;
}

function rmvArray(array2d, array)
{
	var newarray = [];
	for (var i = 0; i < array2d.length; i++)
		if (!(equals(array2d[i], array)))
			newarray.push(array2d[i]);

	return newarray;
}

function getTilesToGoal()
{

	for (var y = 0; y < tiles.length; y++)
		for (var x = 0; x < tiles[y].length; x++)
			tilesToGoal[y][x] = tiles[y][x] ? -1 : -2



	var oldTTG;
	var highestValue;
	var surroundingTiles;

	tilesToGoal[end[1]][end[0]] = 0;
	var list = [[1, 2], [0, 0], [4, 5]];
	var n = 0;

	do
	{
		n++;
		oldTTG = copy2d(tilesToGoal);
		highestValue = maxValue(to1d(tilesToGoal));

		for (var y = 0; y < tilesToGoal.length; y++)

			for (var x = 0; x < tilesToGoal[y].length; x++)

				if (tilesToGoal[y][x] === highestValue)
				{

					surroundingTiles = [[x+1, y], [x, y+1], [x-1, y], [x, y-1]];
					if (y === tilesToGoal.length - 1) surroundingTiles = rmvArray(surroundingTiles, [x, y+1]);
					if (y === 0) surroundingTiles = rmvArray(surroundingTiles, [x, y-1]);
					if (x === tilesToGoal[y].length - 1) surroundingTiles = rmvArray(surroundingTiles, [x+1, y]);
					if (x === 0) surroundingTiles = rmvArray(surroundingTiles, [x-1, y]);

					for (var i = 0; i < surroundingTiles.length; i++)
					{
						if ((!tiles[surroundingTiles[i][1]][surroundingTiles[i][0]]) && (tilesToGoal[surroundingTiles[i][1]][surroundingTiles[i][0]] < 0))
							tilesToGoal[surroundingTiles[i][1]][surroundingTiles[i][0]] = highestValue + 1
					}
				}
		if (tilesToGoal[start[1]][start[0]] > 0)
			break;
	}
	while (!(equals2d(tilesToGoal, oldTTG)));



	/*for (var y = 0; y < tilesToGoal.length; y++)
	{
		for (var x = 0; x < tilesToGoal[y].length; x++)
			document.write(tilesToGoal[y][x] + ' ');

		document.write('<br>');
	}*/


	if (tilesToGoal[start[1]][start[0]] < 0)
		return false;

	return true;
}

function remove(element)
{
	element.parentNode.removeChild(element);
}

function startCreation()
{
	var size = form.elements[0].value;
	X = size;
	Y = size;
	var button = document.getElementById('StartButton');
	button.innerHTML = 'Solve Maze';
	button.onclick = function(){try{begin();}catch(err){document.write(err)}};
	remove(form);
	canvas.width = 500;
	canvas.height = 500;
	reset();
	clear();

}

function begin()
{

	if (!(startPlaced && endPlaced))
	{
		doesItWorkParagraph.innerHTML = 'You must choose a start and end location (right-click).';
		reset();
		clear();
		return;
	}


	var mazeWorks = getTilesToGoal();
	if (mazeWorks === false)
	{
		doesItWorkParagraph.innerHTML = 'Maze cannot be solved.';
		reset();
		clear();
		return;
	}

	started = true;

	var location = start;
	var x;
	var y;
	var surroundingTiles;

	while (!(equals(location, end)))
	{
		x = location[0];
		y = location[1];

		circle(x * TILEWIDTH + TILEWIDTH / 2, y * TILEWIDTH + TILEWIDTH / 2, parseInt(TILEWIDTH / 2.5), '#ffaaaa');
		surroundingTiles = [[x+1, y], [x, y+1], [x-1, y], [x, y-1]];
		if (y === tilesToGoal.length - 1) surroundingTiles = rmvArray(surroundingTiles, [x, y+1]);
		if (y === 0) surroundingTiles = rmvArray(surroundingTiles, [x, y-1]);
		if (x === tilesToGoal[y].length - 1) surroundingTiles = rmvArray(surroundingTiles, [x+1, y]);
		if (x === 0) surroundingTiles = rmvArray(surroundingTiles, [x-1, y]);

		for (var i = 0; i < surroundingTiles.length; i++)
			if ((tilesToGoal[surroundingTiles[i][1]][surroundingTiles[i][0]] < tilesToGoal[y][x]) && tilesToGoal[surroundingTiles[i][1]][surroundingTiles[i][0]] >= 0)
			{
				location = [surroundingTiles[i][0], surroundingTiles[i][1]];
				break; //(inner for loop)
			}

	}

	x = location[0];
	y = location[1];

	circle(x * TILEWIDTH + TILEWIDTH / 2, y * TILEWIDTH + TILEWIDTH / 2, parseInt(TILEWIDTH / 2.5), '#ffaaaa');

	reset();

}




function mouseMoved(event)
{

	if ((!mouseDown) || started)
		return;

	var button = -1;

	if ("which" in event)
        if (event.which == 2) button = 1; else if (event.which == 3) button = 2; else button = 0;
    else if ("button" in event)
        button = event.button;
	else
		button = 0;


	var x = event.offsetX;
	var y = event.offsetY;

	var tilex = Math.floor(x / TILEWIDTH);
	var tiley = Math.floor(y / TILEWIDTH);

	if (button === 1)
	{
		rect(tilex * TILEWIDTH, tiley * TILEWIDTH, TILEWIDTH, TILEWIDTH, '#dddddd');
		tiles[tiley][tilex] = false;
		if (equals([tilex, tiley], start))
		{
			start = [];
			startPlaced = false;
		}
		if (equals([tilex, tiley], end))
		{
			end = [];
			endPlaced = false;
		}
		return;
	}
	else if (button === 2)
		return;

	var notClickedOnStart = (!startPlaced) || (!((tilex === start[0]) && (tiley === start[1])));

	var notClickedOnEnd = (!endPlaced) || (!((tilex === end[0]) && (tiley === end[1])));

	if (notClickedOnStart && notClickedOnEnd)
	{
		rect(tilex * TILEWIDTH, tiley * TILEWIDTH, TILEWIDTH, TILEWIDTH, '#aaaaaa');
		tiles[tiley][tilex] = true;
	}

}

function clear()
{
	rect(0, 0, canvas.width, canvas.height, '#dddddd');
	started = false;
}

function mousePressed(event)
{

	if (started)
	{
		clear();
		return;
	}

	var button = -1;

	if ("which" in event)
        if (event.which == 2) button = 1; else if (event.which == 3) button = 2; else button = 0;
    else if ("button" in event)
        button = event.button;
	else
		button = 0;

	if (button !== 2)
	{
		mouseDown = true;
		mouseMoved(event);
	}
	else
	{
		var x = event.offsetX;
		var y = event.offsetY;

		var tilex = Math.floor(x / TILEWIDTH);
		var tiley = Math.floor(y / TILEWIDTH);
		if ((!startPlaced) && (!tiles[tiley][tilex]))
		{
			start = [tilex, tiley];
			rect(tilex * TILEWIDTH, tiley * TILEWIDTH, TILEWIDTH, TILEWIDTH, '#00ff00');
			startPlaced = true;
		}
		else if ((!endPlaced) && (!tiles[tiley][tilex]))
		{
			end = [tilex, tiley];
			rect(tilex * TILEWIDTH, tiley * TILEWIDTH, TILEWIDTH, TILEWIDTH, '#ffff00');
			endPlaced = true;
			return;
		}
	}
}

function mouseReleased(event)
{
	mouseDown = false;
}



canvas.addEventListener('mousemove', mouseMoved, false);
canvas.addEventListener('mousedown', mousePressed, false);
canvas.addEventListener('mouseup', mouseReleased, false);

function circle(x, y, r, colour)
{
	ctx.fillStyle = colour;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.fill();
};


function rect(x, y, w, h, colour)
{
	ctx.fillStyle = colour;
	ctx.fillRect(x, y, w, h);
};


function text(str, x, y)
{
	ctx.font = "20px Helvetica";
	ctx.fillStyle = '#000000';
	ctx.fillText(str, x, y);
}

function line(x1, y1, x2, y2)
{
	ctx.strokeStyle = '#000000';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
};

function line(x1, y1, x2, y2, color)
{
	ctx.strokeStyle = color
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
};

rect(0, 0, canvas.width, canvas.height, '#dddddd');
