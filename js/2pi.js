var vertices = [];

function mouseDragged()
{
	if (document.getElementById("info").innerHTML != "")
		return;
	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > width)
		return;
	stroke(0);
	vertices.push([mouseX, mouseY]);
	if (vertices.length > 1)
		line(mouseX, mouseY, vertices[vertices.length-2][0], vertices[vertices.length-2][1]);
}

function circumference()
{
	var total = 0;
	for (var i = 1; i < vertices.length; i++)
	{
		total += dist(vertices[i-1][0], vertices[i-1][1], vertices[i][0], vertices[i][1]);
	}
	return total;
}

function center()
{
	var centerX = 0;
	var centerY = 0;
	for (var i = 0; i < vertices.length; i++)
	{
		centerX += vertices[i][0] / vertices.length;
		centerY += vertices[i][1] / vertices.length;
	}
	return [centerX, centerY];
}

function twoPiApprox()
{
	var o = center();
	var c = circumference();

	ellipseMode(CENTER);
	fill(0, 0, 200);
	noStroke();
	ellipse(o[0], o[1], 5, 5);

	var avgR = 0;
	var minLocation;
	var maxLocation;
	for (var i = 0; i < vertices.length; i++)
	{
		var d = dist(vertices[i][0], vertices[i][1], o[0], o[1]);
		avgR += d / vertices.length;

	}

	stroke(0, 255, 0);
	noFill();
	line(o[0], o[1], o[0]+avgR, o[1]);
	stroke(255, 0, 0);
	ellipse(o[0], o[1], 2*avgR, 2*avgR);
	stroke(255, 200, 0);
	ellipse(o[0], o[1], c/PI, c/PI);


	return c/(2*avgR);

}

function setup()
{
	createCanvas(500, 500);
	stroke(255, 0, 0);
	line(0, 0, width-1, 0);
	line(width-1, 0, width-1, height-1);
	line(0, height-1, width-1, height-1);
	line(0, 0, 0, height-1);
}

function calculate()
{
	var approx = twoPiApprox();
	var avgPi = approx;
	var percentError;
	if (avgPi > PI)
	{
		percentError = 100*(avgPi/PI - 1);
	}
	else
	{
		percentError = 100*(PI/avgPi - 1);
	}
	$("#info").html("<div class='col-xs-12 col-sm-8 col-md-6 col-lg-4'>"
	+ "<table class='table table-bordered table-hover'> <tr><th></th><th>Your approximation</th><th>True value</th></tr><tr><td>2π</td><td>" + 2 * avgPi
	+ "</td><td>" + TWO_PI + "</td></tr><tr><td>π</td><td>" +
	+ avgPi + "</td><td>" + PI + "</table>" + percentError + "% error.<br>"
	+ "The blue dot is the center of your shape. The green line is the average radius of the shape.<br>"
	+ "The red circle is a circle with the same radius as your shape, and the orange circle is a<br>"
	+ "circle with the same circumference as your shape. The closer they are, the better your<br>"
	+ "approximation of π</div>");
}
