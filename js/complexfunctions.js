var domainPoints;
var rangePoints;
var animating = false;
var t = 0;
var SCALE = 5;

function drawPoints(points)
{
    background(255);
    for (var i = 0; i < points.length; i++)
    {
        point((points[i][0]/SCALE+0.5)*width, (points[i][1]/SCALE+0.5)*height);
    }
}


function mapFunc(func)
{
    var f = complex.rpn(func);
    rangePoints = [];
    for (var i = 0; i < domainPoints.length; i++)
    {
        rangePoints.push(f(domainPoints[i]));
    }
}

function drawFunc(func)
{
    mapFunc(func);
    animating = true;
}

function draw()
{

    if (animating)
    {
        var midpoints = [];
        for (var i = 0; i < domainPoints.length; i++)
            midpoints.push(complex.add(complex.mult(domainPoints[i], complex.reToC(1-t)), complex.mult(rangePoints[i], complex.reToC(t))));

        drawPoints(midpoints);

        t += 0.01;
        if (t >= 1)
        {
            animating = false;
            drawPoints(rangePoints);
        }


    }
}

function setup()
{
    var canvas = createCanvas(750, 750);
    canvas.parent("canvas");
    stroke(0,0,100);
    domainPoints = [];
    for (var i = 10; i < width; i += 50)
    {
        for (var j = 0; j < height; j++)
        {
            domainPoints.push([(j/width-0.5)*SCALE, (i/height-0.5)*SCALE]);
            domainPoints.push([(i/width-0.5)*SCALE, (j/height-0.5)*SCALE]);
        }
    }
    drawPoints(domainPoints);
}

$(function()
{
    $("#animate").click(function()
    {
        t = 0;
        animating = false;
        var func = $("#function").val();
        drawFunc(func);
    });
    $("#function").keydown(function(e)
    {
        if (e.keyCode == 13)
            $("#animate").click();
    });
});
