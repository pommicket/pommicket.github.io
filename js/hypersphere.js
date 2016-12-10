var WIDTH = 500;
var HEIGHT = 500;

var z_angle = 4*Math.PI/9;
var w_angle = 2*Math.PI/3;
var matrix = [[Math.cos(0), Math.sin(0)], [Math.cos(2*Math.PI/9), Math.sin(2*Math.PI/9)], [Math.cos(z_angle), Math.sin(z_angle)], [Math.cos(w_angle), Math.sin(w_angle)]];


var quality = 5;
var speed = 0.2;

var coordinatesSize = 4; 
var topLeft     = [-coordinatesSize/2, +coordinatesSize/2];
var topRight    = [+coordinatesSize/2, +coordinatesSize/2];
var bottomLeft  = [-coordinatesSize/2, -coordinatesSize/2];
var bottomRight = [+coordinatesSize/2, -coordinatesSize/2];

var origin;

$(function()
{
    $("#chq").click(function()
    {
        quality = $("#quality").val();    
    })
})

function convertCoordinates(coords)
{
    var x = map(coords[0], topLeft[0], topRight[0], 0, width);
    var y = map(coords[1], topLeft[1], bottomLeft[1], 0, width);
    
    return [x, y];
}

function transform(vector)
{
    var ans = [];
    for (var i = 0; i < matrix[0].length; i++)
    {
        ans.push(0);
    }
    for (var i = 0; i < matrix.length; i++)
    {
        for (var j = 0; j < matrix[i].length; j++)
        {
            ans[j] += vector[i] * matrix[i][j];
        }
    }
    return convertCoordinates(ans);
}

function pointOnSphere(r,s,t)
{
    var x = r * Math.cos(s) * Math.sin(t);
    var y = r * Math.sin(s) * Math.sin(t);
    var z = r * Math.cos(t);
    return [x,y,z];
}

function pointOnHyperSphere(r,s,t,u)
{
    var x = r * Math.cos(s);
    var y = r * Math.sin(s) * Math.cos(t);
    var z = r * Math.sin(s) * Math.sin(t) * Math.cos(u);
    var w = r * Math.sin(s) * Math.sin(t) * Math.sin(u);
    return [x,y,z,w];
}

function setup()
{
    createCanvas(500, 500);
    origin = [width/2, height/2];
}

function draw()
{
    background(255);
    ellipseMode(CENTER);
    var xVal = map(mouseX, 0, width, 0, 2*Math.PI);
    matrix[0] = [Math.cos(xVal), Math.sin(xVal)];
    var yVal = map(mouseY, 0, height, 0, 2*Math.PI);
    matrix[1] = [Math.cos(yVal), Math.sin(yVal)];
    if (keyIsDown(LEFT_ARROW))
    {
        z_angle -= speed;
    }
    if (keyIsDown(RIGHT_ARROW))
    {
        z_angle += speed;
    }
    if (keyIsDown(DOWN_ARROW))
    {
        w_angle -= speed;
    }
    if (keyIsDown(UP_ARROW))
    {
        w_angle += speed;
    }
    
    matrix[2] = [Math.cos(z_angle), Math.sin(z_angle)];
    matrix[3] = [Math.cos(w_angle), Math.sin(w_angle)];
    var i_hat = convertCoordinates(matrix[0]);
    var j_hat = convertCoordinates(matrix[1]);
    var k_hat = convertCoordinates(matrix[2]);
    var l_hat = convertCoordinates(matrix[3]);
    strokeWeight(2);
    stroke(255, 0, 0);
    line(origin[0], origin[1], i_hat[0], i_hat[1]);
    stroke(0, 255, 0);
    line(origin[0], origin[1], j_hat[0], j_hat[1]);
    stroke(0, 0, 255);
    line(origin[0], origin[1], k_hat[0], k_hat[1]);
    stroke(0, 255, 255);
    line(origin[0], origin[1], l_hat[0], l_hat[1]);
    fill(157, 0, 255);
    noStroke();
    for (var s = 0; s < 2*Math.PI; s += 1/quality)
    {
        for (var t = 0; t < 2*Math.PI; t += 1/quality)
        {
            for (var u = 0; u < 2*Math.PI; u += 1/quality)
            {
                var transformed = transform(pointOnHyperSphere(1, s, t, u));
                ellipse(transformed[0], transformed[1], 1, 1);
            }
        }
    }
    
    
}
