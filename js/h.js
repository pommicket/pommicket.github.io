var lineLength = 5;
var canvas;
var ctx;
var w;
var h;
var endpoints;
var allendpoints;
var delay;
var iterateTimeout;
var stopped = false;
var running = false;
var chance;

function line(x1, y1, x2, y2)
{
	ctx.beginPath();
	ctx.moveTo(x1+0.5, y1);
	ctx.lineTo(x2+0.5, y2);
	ctx.stroke();
}

function Endpoint(x, y, direction)
{
	this.x = x;
	this.y = y;
	this.direction = direction;
}

function equals(other)
{
	return this.x == other.x && this.y == other.y;
}

function nequals(other)
{
	return !this.equals(other);
}

function multiple(e)
{
	var count = 0;
	for (var i = 0; i < allendpoints.length; i++)
	{
		if (allendpoints[i].equals(e))
		{
			count++;

			if (count > 1)
				return true;
		}
	}

	return false;

}

function rmvAll(e)
{
	var newArray = [];
	for (var i = 0; i < endpoints.length; i++)
		if (endpoints[i].nequals(e))
			newArray.push(endpoints[i]);
	endpoints = newArray;
}


function iterate()
{
	var indexOfThis = endpoints.indexOf(this);
	endpoints.splice(indexOfThis, 1);

	if (this.direction == "h")
	{
		line(this.x-lineLength, this.y, this.x+lineLength, this.y);
		var e1 = new Endpoint(this.x-lineLength, this.y, "v");
		var e2 = new Endpoint(this.x+lineLength, this.y, "v");


	}
	else
	{
		line(this.x, this.y-lineLength, this.x, this.y+lineLength);
		var e1 = new Endpoint(this.x, this.y-lineLength, "h");
		var e2 = new Endpoint(this.x, this.y+lineLength, "h");

	}

	if (Math.random() < chance)
		endpoints.push(e1);
	if (Math.random() < chance)
		endpoints.push(e2);
	allendpoints.push(e1);
	allendpoints.push(e2);

}

Endpoint.prototype.equals=equals;
Endpoint.prototype.nequals=nequals;
Endpoint.prototype.iterate=iterate;

function iterateAll()
{

	var cpy = endpoints.slice();

	for (var i = 0; i < cpy.length; i++)
		if (multiple(cpy[i]))
			rmvAll(cpy[i]);

	cpy = endpoints.slice();
	for (var i = 0; i < cpy.length; i++)
		cpy[i].iterate();

	iterateTimeout = setTimeout(iterateAll, delay);
}

function stop()
{
	$("#stop").hide();
	running = false;

	if (!stopped)
	{
		clearTimeout(iterateTimeout);
		$("#download").show();
		$("#link").prop("href", canvas.toDataURL());
		stopped = true;
	}

}

function start()
{
	if (!running)
	{
		running = true;


		w = canvas.width;
		h = canvas.height;
		endpoints = [];
		allendpoints = [];
		var a = new Endpoint(w/2, h/2, "h");
		endpoints.push(a);
		a.iterate();
		iterateAll();
	}
}


function beginH()
{
	$("#begin").hide();
	if (!stopped)
	{
		canvas = document.getElementById("canvas");

		var w = parseInt($("#w").val());
		var h = parseInt($("#h").val());
		canvas.width = w;
		canvas.height = h;

		ctx = canvas.getContext("2d");
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff";

		ctx.fillRect(0, 0, w, h);

		lineLength = parseInt($("#lineLength").val());

		delay = parseInt($("#delay").val());

		chance = parseFloat($("#chance").val());


		start();
	}
	else
	{
		iterateAll();
		stopped = false;
	}
}

$(function()
{
	$("#download").hide();
});
