var k = 5;
function repeatString(string, nTimes)
{
    /*
    Repeats a string n times
    E.g. repeatString("hi", 10) -> "hihihihihihihihihihi"
    */
    return Array(nTimes+1).join(string);
}

function pad(x, nDigits)
{
    /* pad("33", 10) -> "0000000033" */

    for (var s = x; s.length < nDigits; s = "0" + s);
    return s;
}

function bin(x, nDigits)
{
    /*
    Returns an n-digit binary representation of x, adding zeros to the start if necessary.
    E.g. bin(3, 11) -> "00000000011"
    */
    for (var s = x.toString(2) /* Convert to binary */; s.length < nDigits; s = "0" + s /* Add zero to start */);
    return s;
}

function check(b, msg)
{
    /*
    If b is false, it shows the error message to the user.
    Returns b.
    */
    if (!b)
    {
        $("#error").html(msg);
    }
    return b;
}


function startingConfigValid(sc)
{
    /*
    Returns true if sc is a valid starting configuration; if all of the characters in sc are 0 or 1.
    */

    for (var i = 0; i < sc.length; i++)
    {
        if (sc[i] != '0' && sc[i] != '1')
            return false;
    }
    return true;
}

function padConfiguration(config, size)
{
    /* Place zeros before and after config so that config.length = size. */
    for (; config.length < size-1; config = '0' + config + '0');
    if (config.length < size)
        config += '0'; /* Add zero at end if the number of zeros must be odd (e.g. padConfiguration("1101", 9) -> 001101000) */
    return config;
}


function drawState(state, t)
{
    /* Draws the states */


    var w = $("#canvas").width();
    var h = $("#canvas").height();

    for (var i = 0; i < w; i++)
    {
        if (state[i] === '1')
            ctx.fillRect(i*2, t*2, 2, 2);
    }
}

function getNewValue(rule, above, c, binStrings)
{
    /* Get new value of a cell given the cells above it. */
    return rule[binStrings.indexOf(above)];
}


$(document).ready(function() {
    $("#run").click(function()
    {
        $("#error").html("");
        /* An elementary cellular automaton (e.g. Rule 110 (https://en.wikipedia.org/wiki/Rule_110)) */
        var time = parseInt($("#time").val()); /* Amount of time to run the automaton for. */
        var size = parseInt($("#size").val()); /* Size of the starting automaton (bits). */
        var c = parseInt($("#c").val());
        var startingConfig = $("#start").val(); /* Starting configuration for the automaton. */
        var ruleNumber = parseInt($("#rule").val()); /* Rule number (e.g. 110). (0 <= x < 256) This must be converted to a binary number before use. */

        if (!check(time > 0, "Error - The value " + time + " is an invalid time. Time &gt; 0."))
        {
            /* Check for invalid time argument. */
            return;
        }

        if (!check(ruleNumber >= 0 && ruleNumber < Math.pow(2, Math.pow(2, 2*c+1)),
                    "Error - Rule number " + ruleNumber +  " does not exist. 0 &le; Rule number &le; 2<sup>2<sup>2c+1</sup></sup>"))
        {
            /* Check for an out-of-bounds rule number. */
            return;
        }
        if (!check(startingConfigValid(startingConfig), "Error - Starting configuration invalid: " + startingConfig))
        {
            /* Check for an invalid starting configuration. e.g. 024930283848 */
            return;
        }

        if (!check(startingConfig.length <= size, "Error - Starting configuration length is greater than size!"))
        {
            return;
        }

        if (!check(size > 0, "Error - Invalid size: " + size + ". Size > 0"))
        {
            /* Check for invalid size argument. */
            return;
        }

        var rule = bin(ruleNumber, Math.pow(2, 2*c+1));

        document.getElementById("canvas").width = size*2;
        document.getElementById("canvas").height = time*2;


        ctx = document.getElementById("canvas").getContext("2d");

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, time);
        ctx.fillStyle = "#000000"

        startingConfig = padConfiguration(startingConfig, size);
        /* Run the automaton. */

        drawState(startingConfig, 0);
        var binStrings = Array.from(Array(Math.pow(2, 2*c+1)).keys()).map(function(x) { return bin(x, 2*c+1); }).reverse();
        var lastState = startingConfig;
        
        for (var t = 1; t < time; t++)
        {
            var nextState = "";
            for (var i = 0; i < c; i++)
            {
                nextState += getNewValue(rule, pad(lastState.substring(0, i+c+1), 2*c+1), c, binStrings)
            }

            for (var i = c; i < size-c; i++)
            {
                nextState += getNewValue(rule, lastState.substring(i-c, i+c+1), c, binStrings);
            }

            for (var i = size-c; i < size; i++)
            {
                nextState += getNewValue(rule, pad(lastState.substring(i-c, size), 2*c+1), c, binStrings);
            }

            drawState(nextState, t);
            lastState = nextState;
        }




    });


});
