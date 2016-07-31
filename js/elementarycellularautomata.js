function repeatString(string, nTimes)
{
    /*
    Repeats a string n times
    E.g. repeatString("hi", 10) -> "hihihihihihihihihihi"
    */
    return Array(nTimes+1).join(string);
}

function bin8(x)
{
    /*
    Returns an 8-digit binary representation of x, adding zeros to the start if necessary.
    E.g. bin8(42) -> "00101010"
    */
    var s;
    for (s = x.toString(2) /* Convert to binary */; s.length < 8; s = "0" + s /* Add zero to start */);
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

function getNewValue(rule, a, b, c)
{
    /* Get new value of a cell given the three cells above it. */
    var above = a+b+c;
    var binUpTo7 = ["111", "110", "101", "100", "011", "010", "001", "000"];
    return rule[binUpTo7.indexOf(above)];
}


$(document).ready(function() {
    $("#run").click(function()
    {
        $("#error").html("");
        /* An elementary cellular automaton (e.g. Rule 110 (https://en.wikipedia.org/wiki/Rule_110)) */
        var time = parseInt($("#time").val()); /* Amount of time to run the automaton for. */
        var size = parseInt($("#size").val()); /* Size of the starting automaton (bits). */
        var startingConfig = $("#start").val(); /* Starting configuration for the automaton. */
        var ruleNumber = parseInt($("#rule").val()); /* Rule number (e.g. 110). (0 <= x < 256) This must be converted to a binary number before use. */

        if (!check(time > 0, "Error - The value " + time + " is an invalid time. Time &gt; 0."))
        {
            /* Check for invalid time argument. */
            return;
        }

        if (!check(ruleNumber >= 0 && ruleNumber < 256, "Error - Rule number " + ruleNumber +  " does not exist. 0 &le; Rule number &le; 255"))
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

        var rule = bin8(ruleNumber);

        document.getElementById("canvas").width = size*2;
        document.getElementById("canvas").height = time*2;


        ctx = document.getElementById("canvas").getContext("2d");

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, time);
        ctx.fillStyle = "#000000"

        startingConfig = padConfiguration(startingConfig, size);
        /* Run the automaton. */

        drawState(startingConfig, 0);

        var lastState = startingConfig;

        for (var t = 1; t < time; t++)
        {
            var nextState = [getNewValue(rule, "0", lastState[0], lastState[1])];

            for (var i = 1; i < size-1; i++)
            {
                nextState.push(getNewValue(rule, lastState[i-1], lastState[i], lastState[i+1]));
            }
            nextState.push(getNewValue(rule, lastState[size-2], lastState[size-1], "0"));
            drawState(nextState, t);
            lastState = nextState;
        }




    });


});
