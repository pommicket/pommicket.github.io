
function getX()
{
	return $("#mod").val();
}



function updateTriangle()
{
	var triangle = [];
	var colors = [];
	var currentX;
	var x = getX();
	triangle = [];
	currentX = x;
	for (var i = 0; i < height/2; i++)
	{
		triangle.push([]);
		triangle[i].push(1);
		for (var j = 1; j < i; j++)
			triangle[i].push((triangle[i-1][j-1]+triangle[i-1][j])%x);
		triangle[i].push(1);
	}
	colors = [];
	for (var i = 0; i < x; i++)
		colors.push([random(255), random(255), random(255)]);
	background(255);
	noStroke();
	for (var i = 0; i < height/2; i++)
	{
		for (var j = 0; j <= i; j++)
		{
			fill(colors[triangle[i][j]][0], colors[triangle[i][j]][1], colors[triangle[i][j]][2]);
			rect(getPos(i, j)[0], getPos(i, j)[1], 2, 2);

		}
	}

}

function setup()
{
	createCanvas(512, 512);
	updateTriangle();
}

function getPos(row, column)
{
	return [width/2 - row + 2 * column, row*2];
}

function draw()
{

}
