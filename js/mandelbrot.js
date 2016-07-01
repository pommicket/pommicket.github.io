var increment = 0.01;
var iterations = 30;
var startI = -2.5;
var startJ = -2.5;
var power = 2;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
function reciprocal(re, im)
{
	return [re/(re*re+im*im), -im/(im*im+re*re)];
}

function add(re1, im1, re2, im2)
{
	return [re1+re2, im1+im2];
}

function multiply(re1, im1, re2, im2)
{
	return [re1*re2-im1*im2, re1*im2+re2*im1];
}

function cpower(re, im, power)
{
	if (power < 0)
	{
		var r = reciprocal(re, im);
		return cpower(r[0], r[1], -power);
	}
	var x = [re, im];
	var i = 1;
	while (i < power)
	{
		x = multiply(x[0], x[1], re, im);
		i++;
	}
	return x;
	
}

function iterate(z, power, c)
{
	var x = cpower(z[0], z[1], power);
	return add(x[0], x[1], c[0], c[1]);
}

function cabs(z)
{
	return Math.sqrt(z[0]*z[0]+z[1]*z[1]);
}

function num_iterations(power, c, max_iterations)
{
	var iterations = 0;
	var z = [0, 0];
	while (iterations < max_iterations && cabs(z) < 2)
	{
		z = iterate(z, power, c);
		iterations++;
	}
	return iterations;
}

function draw_mandelbrot()
{
	var size = width*increment;
	
	
	
	var endI = startI+size;
	var endJ = startJ+size;
	
	var imgData = ctx.createImageData(width, height);
	
	for (var i = startI; i < endI; i+=increment)
	{
		for (var j = startJ; j < endJ; j+=increment)
		{
			var ipos = i*(1.0/increment)-startI*(1.0/increment);
			var jpos = j*(1.0/increment)-startJ*(1.0/increment);
			jpos = Math.floor(Math.round(jpos));
			ipos = Math.floor(Math.round(ipos));
			
			var x = num_iterations(power, [i, j], iterations)/iterations * 255
			imgData.data[4*(jpos*width+ipos)] = x;
			imgData.data[1+4*(jpos*width+ipos)] = x;
			imgData.data[2+4*(jpos*width+ipos)] = x;
			imgData.data[3+4*(jpos*width+ipos)] = 255;
			
			
		}
	}
	ctx.putImageData(imgData, 0, 0);
}

function draw()
{

}

function map(val, startA, endA, startB, endB)
{
	return (endB-startB)*((val-startA)/(endA-startA))+startB;
}

function mousePressed(e)
{
	var x;
	var y;
	if (e.pageX || e.pageY) { 
	  x = e.pageX;
	  y = e.pageY;
	}
	else { 
	  x = e.clientX; 
	  y = e.clientY; 
	} 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	if (x < 0 || x > width || y < 0 || y > height)
		return;
		
	if (e.button == 0)
	{
		increment /= 2;
		startI = map(x, 0, width, startI, startI+width*increment);
		startJ = map(y, 0, height, startJ, startJ+width*increment);
	 
		draw_mandelbrot();
	}
}

function keyPressed(e)
{

	var key = String.fromCharCode(e.keyCode);
	if (key == "A")
	{
		increment /= 2;
		startI = startI+width*increment/2;
		startJ = startJ+height*increment/2;
		
		draw_mandelbrot();
	}
	if (key == "Q")
	{
		increment *= 2;
		startI = startI-width*increment/2;
		startJ = startJ-height*increment/2;
		draw_mandelbrot();
	}
	if (key == "P")
	{
		power++;
		draw_mandelbrot();
	}
	if (key == "L")
	{
		power--;
		draw_mandelbrot();
	}
	if (key == "I")
	{
		iterations = Math.floor(iterations*1.5);
		draw_mandelbrot();
	}
	if (key == "K")
	{
		iterations = Math.floor(iterations/1.5);
		draw_mandelbrot();
	}
}
canvas.addEventListener("mousedown", mousePressed);
document.body.addEventListener("keydown", keyPressed);

draw_mandelbrot();
	