var CIRCLE = 0;
var SQUARE_SHAPE = 1;
var points = [];
var currentAngle = 0;
var drawing = false;
var shapes = [CIRCLE, CIRCLE];
var radii = [107, 17];
var shapeNameList = ['circle', 'square'];
var speed = 0.5;

function removeElementById(id)
{
	(function(x){x.parentNode.removeChild(x);})(document.getElementById(id));
}

function getNumShapes()
{
	var i = 0;
	do
	{
		var x = document.getElementById("rt"+i);
		i++;
	}
	while (x != null);
	return i-1;
}

function deleteShape(num)
{
	removeElementById("rt"+num);
	removeElementById("st"+num);
	removeElementById("shape"+num);
	removeElementById("radius"+num);
	removeElementById("del"+num);
	removeElementById("br"+num);
	
}

function updateShapes()
{
	shapes = [];
	radii = [];
	var nShapes = getNumShapes();
	for (var i = 0; i < nShapes; i++)
	{
		var sel = document.getElementById("shape" + i);
		var val = sel.options[sel.selectedIndex].value;
		shapes.push(shapeNameList.indexOf(val));
		radii.push(document.getElementById("radius" + i).value);
	}
	speed = parseFloat(document.getElementById("speed").value);
	
}

function loadShapes()
{
	var nShapes = getNumShapes();
	for (var i = 0; i < nShapes; i++)
	{
		var sel = document.getElementById("shape" + i);
		sel.selectedIndex = shapes[i];
		document.getElementById("radius" + i).value = radii[i];
	}
	document.getElementById("speed").value = speed;
}

function addShape()
{
	updateShapes();
	var nShapes = getNumShapes();
	var shapesDiv = document.getElementById("shapes");
	shapesDiv.innerHTML += '<span id="rt' + nShapes + '">Radius:</span> <input type="number" value="50" id="radius' + nShapes + '"> <span id="st' + nShapes + '">Shape:</span> ' + 
	'<select id="shape' + nShapes + '"><option value="circle">Circle</option><option value="square">Square</option></select> <button id="del' + nShapes + '" onclick="deleteShape(' + nShapes + ');">Delete</button><br id="br' + nShapes + '">';
	shapes.push(0);
	radii.push(50);
	loadShapes();
}

function startDrawing()
{
	drawing = true;
	points = [];
	updateShapes();
}

function squine(angle)
{
	angle %= TWO_PI;
	if (angle >= QUARTER_PI && angle <= 3*QUARTER_PI)
		return 1;
	if (angle >= 5*QUARTER_PI && angle <= 7*QUARTER_PI)
		return -1;
	if (angle > 7*QUARTER_PI || angle < QUARTER_PI)
		return map((angle+QUARTER_PI)%TWO_PI-QUARTER_PI, -QUARTER_PI, QUARTER_PI, -1, 1);
	return -map(angle, 3*QUARTER_PI, 5*QUARTER_PI, -1, 1);
}

function squos(angle)
{
	if (angle >= 7*QUARTER_PI || angle <= QUARTER_PI)
		return 1;
	if (angle >= 3*QUARTER_PI && angle <= 5*QUARTER_PI)
		return -1;
	if (angle > QUARTER_PI && angle < 3*QUARTER_PI)
		return -map(angle, QUARTER_PI, 3*QUARTER_PI, -1, 1);
	return map(angle, 5*QUARTER_PI, 7*QUARTER_PI, -1, 1);
	
}

function getPointOnShape(shape, radius, centerX, centerY, angle)
{
	if (shape == SQUARE_SHAPE)
		return [radius*squos(angle)+centerX, radius*squine(angle)+centerY];
	else if (shape == CIRCLE)
		return [radius*cos(angle)+centerX, radius*sin(angle)+centerY];
}


function setup()
{
	createCanvas(700, 700).parent("canvasSpot");
	ellipseMode(CENTER);
}

function draw()
{	
	updateShapes();
	try{
	if (drawing)
	{
		background(255);
		stroke(0);
		noFill();
		
		var centerX = width/2;
		var centerY = height/2;
		var nextPoint;
		
		for (var i = 0; i < shapes.length; i++)
		{
			
			var angle = map(currentAngle%radii[i], 0, radii[i], 0, TWO_PI);
			nextPoint = getPointOnShape(shapes[i], radii[i], centerX, centerY, angle);
			centerX = nextPoint[0];
			centerY = nextPoint[1];
			
		}
		
		
		points.push([centerX, centerY]);
		
		
		
		if (points.length != 1 && dist(points[0][0], points[0][1], points[points.length-1][0], points[points.length-1][1]) < speed)
			drawing = false;
		
		
		for (var i = 1; i < points.length; i++)
		{
			line(points[i-1][0], points[i-1][1], points[i][0], points[i][1]);
		}
		
		
		currentAngle += speed;
		if (drawing)
		{
			noStroke();
			fill(255, 0, 0);
			ellipse(centerX, centerY, 7, 7);
		}
	}}catch(e){document.write(e + "<br>");}
}