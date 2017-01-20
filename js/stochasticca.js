var params;

function mod(a, b)
{
    var c = a % b;
    while (a < 0)
    {
        c += b;
    }
    return c;
}

function sigmoid(z)
{
    return 1 / (1 + Math.exp(-z))
}

function drawCA()
{
    try
    {
        params = $.parseJSON("[" + $("#params").val() + "]");
        var width = parseInt($("#width").val());
        var time  = parseInt($("#time").val());
    }
    catch(e)
    {
        $("#error").text("Error - Invalid parameters: " + $("#params").val() + ".");
        return;
    }
    createCanvas(width, time);
    var C = Math.floor(params.length / 2);
    var values = [[]];
    for (var i = 0; i < width; i++)
    {
        values[0][i] = 1;
    }
    for (var t = 1; t < time; t++)
    {
        values.push([]);
        for (var i = 0; i < width; i++)
        {
            var total = 0;
            for (var c = -C; c <= C; c++)
            {
                total += params[c+C] * values[t-1][i+c];
            }
            values[t].push(Math.random() < sigmoid(total) ? 1 : 0)
        }
    }

    for (var t = 0; t < time; t++)
    {
        for (var i = 0; i < width; i++)
        {
            stroke(values[t][i] === 1 ? 0 : 255);
            point(i, t);
        }
    }
}

function setup()
{
}

$(function()
{
    $("#params").keydown(function (e)
    {
        if (e.which == 13)
        {
            drawCA();
        }
    });
    $("#display").click(function()
    {
        drawCA();
    });
});
