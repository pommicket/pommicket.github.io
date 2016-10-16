var domainPoints;
var rangePoints;
var animating = false;
var t = 0;
var SCALE = 5;
var nFunctions;
var colors;

function drawPoints(points)
{
    background(255);
    for (var i = 0; i < points.length; i++)
    {
        point((points[i][0]/(SCALE*width/750)+0.5)*width, (points[i][1]/(SCALE*height/750)+0.5)*height);
    }
}

function drawManyPoints(points)
{
    background(255);
    for (var f = 0; f < nFunctions; f++)
    {
        stroke(colors[f][0], colors[f][1], colors[f][2]);
        for (var i = 0; i < points[f].length; i++)
        {
            point((points[f][i][0]/SCALE+0.5)*width, (points[f][i][1]/SCALE+0.5)*height);
        }
    }
}


function mapFuncs(funcs)
{
    var fs = funcs.map(complex.rpn);
    rangePoints = [];
    var f;
    for (var i = 0; i < funcs.length; i++)
    {
        rangePoints.push([]);
        f = fs[i];
        for (var j = 0; j < domainPoints.length; j++)
        {
            rangePoints[i].push(f(domainPoints[j]));
        }
    }
    nFunctions = fs.length;
}

function drawFuncs(funcs)
{
    mapFuncs(funcs);
    animating = true;
}

function draw()
{

    if (animating)
    {
        var midpoints = [];
        for (var f = 0; f < nFunctions; f++)
        {
            midpoints.push([]);
            for (var i = 0; i < domainPoints.length; i++)
                midpoints[f].push(complex.add(complex.mult(domainPoints[i], complex.reToC(1-t)), complex.mult(rangePoints[f][i], complex.reToC(t))));
        }
        drawManyPoints(midpoints);

        t += 0.01;
        if (t >= 1)
        {
            animating = false;
            drawManyPoints(rangePoints);
        }


    }
}

function makeCanvas(w, h)
{
    $("#canvas").html("");
    var canvas = createCanvas(w, h);
    canvas.parent("canvas");
    domainPoints = [];
    for (var i = 10; i < width; i += 50)
    {
        for (var j = 0; j < height; j++)
        {
            domainPoints.push([(j/width-0.5)*SCALE*width/750, (i/height-0.5)*SCALE*height/750]);
            domainPoints.push([(i/width-0.5)*SCALE*width/750, (j/height-0.5)*SCALE*height/750]);
        }
    }
    drawPoints(domainPoints);
}

function randColor()
{
    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    return (r + g + b) / 3 > 150 ? randColor() : [r, g, b];
}

$(function()
{
    $("#animate").click(function()
    {
        makeCanvas(parseInt($("#width").val()), parseInt($("#height").val()));
        t = $("#display").prop("checked") ? 1 : 0;
        animating = false;
        var funcs = $("#function").val().split(",");
        colors = [];
        $("#legend").html("");
        for (var i = 0; i < funcs.length; i++)
        {
            colors.push(randColor());
            $("#legend").append("<div><span style='display: inline-block; background: rgb("
                                + Math.floor(colors[i][0])  + ", " + Math.floor(colors[i][1]) + ", " + Math.floor(colors[i][2])
                                + "); width: 10px; height: 10px;'></span> " + funcs[i] + "</div>");
        }
        drawFuncs(funcs);
    });
    $(".form-control").keydown(function(e)
    {
        if (e.keyCode == 13)
            $("#animate").click();
    });
    $("#display").click(function()
    {
        $("#animate").html($("#display").prop("checked") ? "Display" : "Animate");
    });
});
