var t = 0;
var pp;
var AMAX = 1000;
var DMIN = 0.0001;
var DMAX = 0.0003;
var FMAX = 0.1;
var PMAX = 6.28;
var ADIF = AMAX / 10;
var DDIF = DMAX / 10;
var FDIF = FMAX / 10;
var PDIF = PMAX / 10;
var npendulums = 0;
var started = false;

function sinExp(A, t, f, p, d)
{


	return A*sin(t*f + p) * exp(-d*t);
}

var Pendulum = function(a, d, f, p, xy)
{
	this.a = a;
	this.d = d;
	this.f = f;
	this.p = p;
	this.xy = xy;
	pendulums.push(this);
}

Pendulum.prototype.swing = function()
{
	//document.write(this.a + " " + t + " " + this.f + " " + this.p + " " + this.d + " " + this.xy + "<br>");
	if (this.xy == 0)
	{
		var x = sinExp(this.a, t, this.f, this.p, this.d);
		var y = 0;
	}
	else
	{
		var x = 0;
		var y = sinExp(this.a, t, this.f, this.p, this.d);
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
		//document.write(sw + "<br>");
		xsum += sw[0];
		ysum += sw[1];
	}
	return [xsum/pendulums.length, ysum/pendulums.length];
}

function addPendulum()
{
	var txt = document.createElement("p");
	txt.innerHTML = "Phase:";
	var p = document.createElement("input");
	p.type = "number";
	p.value = PI;
	p.id = "p" + npendulums;
	txt.id = "pt" + npendulums;
	document.body.appendChild(txt);
	document.body.appendChild(p);

	txt = document.createElement("p");
	txt.innerHTML = "Amplitude:";
	txt.id = "at" + npendulums;
	var a = document.createElement("input");
	a.type = "number";
	a.value = 500;
	a.id = "A" + npendulums;
	document.body.appendChild(txt);
	document.body.appendChild(a);

	txt = document.createElement("p");
	txt.innerHTML = "Damping:";
	txt.id = "dt" + npendulums;
	var d = document.createElement("input");
	d.type = "number";
	d.value = 0.0003;
	d.id = "d" + npendulums;
	document.body.appendChild(txt);
	document.body.appendChild(d);


	txt = document.createElement("p");
	txt.innerHTML = "Frequency:";
	var f = document.createElement("input");
	f.type = "number";
	f.value = 0.1;
	f.id = "f" + npendulums;
	txt.id = "ft" + npendulums;
	document.body.appendChild(txt);
	document.body.appendChild(f);

	txt = document.createElement("p");
	txt.innerHTML = "Is it a Y pendulum? (you should have at least one X and Y pendulum) ";
	var xy = document.createElement("input");
	xy.type = "checkbox";
	xy.value = 1;
	xy.id = "xy" + npendulums;
	txt.id = "xyt" + npendulums;
	document.body.appendChild(txt);
	document.body.appendChild(xy);
	var br = document.createElement("br");
	br.id = "br" + npendulums;
	document.body.appendChild(br);


	txt = document.createTextNode("Delete this pendulum");
	var delBtn = document.createElement("button");
	delBtn.setAttribute("onclick", "deletePendulum(" + npendulums + ");");
	delBtn.appendChild(txt);
	delBtn.id = "db" + npendulums;
	document.body.appendChild(delBtn);
	npendulums++;
}

function deletePendulum(x)
{
	pendulums.splice(x, 1);
	document.body.removeChild(document.getElementById("p" +x));
	document.body.removeChild(document.getElementById("d" +x));
	document.body.removeChild(document.getElementById("f" +x));
	document.body.removeChild(document.getElementById("A" +x));
	document.body.removeChild(document.getElementById("xy" +x));

	document.body.removeChild(document.getElementById("pt" +x));
	document.body.removeChild(document.getElementById("dt" +x));
	document.body.removeChild(document.getElementById("ft" +x));
	document.body.removeChild(document.getElementById("at" +x));
	document.body.removeChild(document.getElementById("xyt" +x));

	document.body.removeChild(document.getElementById("db" +x));
	document.body.removeChild(document.getElementById("br" +x));

	for (var i = x+1; i < npendulums; i++)
	{
		document.getElementById("p"+i).id = "p"+(i-1);
		document.getElementById("d"+i).id = "d"+(i-1);
		document.getElementById("f"+i).id = "f"+(i-1);
		document.getElementById("A"+i).id = "A"+(i-1);
		document.getElementById("pt"+i).id = "pt"+(i-1);
		document.getElementById("dt"+i).id = "dt"+(i-1);
		document.getElementById("ft"+i).id = "ft"+(i-1);
		document.getElementById("at"+i).id = "at"+(i-1);
		document.getElementById("xy"+i).id = "xy"+(i-1);
		document.getElementById("xyt"+i).id = "xyt"+(i-1);
		document.getElementById("db"+i).id = "db"+(i-1);
		document.getElementById("db"+(i-1)).setAttribute("onclick", "deletePendulum(" + (i-1) + ");");
		document.getElementById("br"+i).id = "br"+(i-1);
	}
	npendulums--;
}


function start()
{
	started = true;
	createCanvas(800, 800);
	frameRate(1000);
	for (var i = 0; i < npendulums; i++)
	{
		var a = $("#A" + i).value;
		var f = $("#f" + i).value;
		var p = $("#p" + i).value;
		var d = $("#d" + i).value;
		var xy = $("#xy"+i).checked;
		new Pendulum(parseFloat(a), parseFloat(d), parseFloat(f), parseFloat(p), xy);
	}

}

function saveCanvas()
{
	save("AutoHarmonograph.png");
}

function draw()
{
	if(!started)
		return;
	translate(width/2, height/2);
	curr = calculate();
	if (t !== 0)
		line(pp[0], pp[1], curr[0], curr[1]);


	t++;
	pp = curr;
}
