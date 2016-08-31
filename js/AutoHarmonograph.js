var t = 0;
var pp;
var Ax, Ay, fx, fy, dx, dy, basepx, basepy;
var AMAX = 1000;
var DMIN = 0.0001;
var DMAX = 0.0003;
var FMAX = 0.1;
var PMAX = 6.28;
var ADIF = AMAX / 10;
var DDIF = DMAX / 10;
var FDIF = FMAX / 10;
var PDIF = PMAX / 10;


function sinExp(A, t, f, p, d)
{
	return A*sin(t*f + p) * exp(-d*t);
}

var Pendulum = function()
{
	this.xy = floor(random(2));
	if (this.xy === 0)
		this.p = random(-PDIF, PDIF)+basepx;
	else
		this.p = random(-PDIF, PDIF)+basepy;

	pendulums.push(this);
}

Pendulum.prototype.swing = function()
{
	if (this.xy === 0)
	{
		var x = sinExp(Ay, t, fx, this.p, dx);
		var y = 0;
	}
	else
	{
		var x = 0;
		var y = sinExp(Ax, t, fy, this.p, dy);
	}
	return [x, y];
}

var pendulums = [];


function calculate()
{
	var xsum = 0;
	var ysum = 0;
	var sw;
	for (var i = 0; i < pendulums.length; i++)
	{
		sw = pendulums[i].swing();
		xsum += sw[0];
		ysum += sw[1];
	}
	return [xsum/pendulums.length, ysum/pendulums.length];
}


function setup()
{
	createCanvas(600, 600);
}

function start()
{
	$("#start").prop("disabled", true);
	createCanvas(800, 800);
	frameRate(1000);
	DMAX = parseFloat($("#DMAX").val());
	var npendulums = parseInt($("#npendulums").val());

	if (isNaN(DMAX) || isNaN(npendulums))
	{
		$("#Error").html("Please enter a valid number.");
	}

	basepx = random(PMAX);
	basepy = random(PMAX);
	Ax = random(AMAX);
	Ay = random(AMAX);
	fx = random(FMAX);
	fy = random(FMAX);
	dx = random(DMIN, DMAX);
	dy = random(DMIN, DMAX);

	pendulums = [];

	for (var i = 0; i < npendulums; i++)
		new Pendulum();

}

function saveCanvas()
{
	save("AutoHarmonograph.png");
}

function draw()
{
	translate(width/2, height/2);
	curr = calculate();
	if (t !== 0)
		line(pp[0], pp[1], curr[0], curr[1]);


	t++;
	pp = curr;
}
