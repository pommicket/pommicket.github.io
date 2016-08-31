var single = ["Math.sqrt", "Math.cos", "Math.sin"]; //Operations on a single number
var binary = ["*", "+", "-", "/"]; //Operations for 2 numbers
var varlist = ["x"];
var numlist = ["Constant"];
numlist = numlist.concat(varlist);
var numberweight = 1;
var singleweight = 1;
var flength;

function randItem(l)
{
	return l[Math.floor(Math.random() * l.length)];
}

function countChar(string, letter)
{
	var amount = 0;
	for (var i = 0; i < string.length; i++)
	{
		if (string[i] == letter)
		{
			amount++;
		}
	}
	return amount;
}

function rmvmath(str)
{
	//A function that removes all the Math.'s in a string
	var newstr = '';
	for(var i = 0; i < str.length - 5; i++)
	{
		if(str[i] + str[i+1] + str[i+2] + str[i+3] + str[i+4] !== 'Math.')
		{
			newstr += str[i]
		}
		else
		{
			i += 4;
		}
	}
	return newstr;
}

function randFunction()
{
	var hasx = false;
	var func;
	var lasttype;
	var thistype;
	var chanceend;
	var length;
	var what;
	var number;


    while (!hasx)
	{
        //Types: b for binary, s for single, f for first, n for number
        func = '';
        lasttype = 'f';
        thistype = 0;
        hasx = false;
        chanceend = 0;
        length = 1; //Number of operations done so far

        while (true)
		{
            chanceend = Math.pow((1.0 - (1.0 / length)), flength);
            if (lasttype == 'n')
			{
                number = Math.random();
                if (number < chanceend)
				{
                    break;
				}
                func = '(' + func + ')' + randItem(binary);
                lasttype = 'b';
			}
            else if (lasttype == 's' || lasttype == 'b' || lasttype == 'f')
			{
                func += '(';
                thistype = Math.random();
                if (thistype < singleweight / (singleweight + numberweight))
				{
                    func += randItem(single);
                    lasttype = 's';
				}
                else
				{
                    what = randItem(numlist);
                    if (what == 'Constant')
					{
                        func += (Math.random()*100+100).toString();
					}
                    else
					{
                        func += what;
                        if (what == 'x')
						{
                            hasx = true;
						}
					}
                    lasttype = 'n';
                    func += ')';
				}
			}
            length++;
		}
	}
    while (countChar(func, '(') > countChar(func, ')'))
	{
        func += ')';
	}
    return func;
}


function create()
{
	var notify;
	var length;
	var date = new Date();
	var start = date.getTime();

	$("#Error").html("");

	length = parseInt($("#length").val());
	notify = $("#notify").prop("checked");

	singleweight = parseFloat($("#single").val());
	numberweight = parseFloat($("#number").val());
	flength = parseFloat($("#flength").val());

	if (isNaN(length) || isNaN(singleweight) || isNaN(numberweight) || isNaN(flength))
	{
		$("#Error").html("Please enter a valid number.");
		stopLoading();
		return;
	}

	var data = [];
	var func = randFunction();

	eval(
	"for (var x=0; x<length * 10000; x++)"
	+ "{"
	+ "var value = (" + func + ") % 1;"
	+ "data[x] = Math.abs(255 * value);"
	+ "}");

	var wave = new RIFFWAVE(data);
	var audio = document.getElementById('Audio');
	audio.src = wave.dataURI;
	date = new Date();
	var end = date.getTime();
	var timetaken = Math.round((end-start)/1000);
	if (timetaken == 1)
	{
		$("#Time").html("The time it took was 1 second.");
	}
	else
	{
		$("#Time").html("The time it took was " + timetaken + " seconds.");
	}

	$("#Function").html("$Function: $" + rmvmath(func));
	LatexIT.render('*',false);

	stopLoading();

	$("#Audio").show();

	if(notify)
	{
		alert('Your audio has finished.');
	}

	audio.play();



}

function startLoading()
{
	$('#Create').prop('disabled', true);
	$('#Create').html('Loading...');
}

function stopLoading()
{
	$('#Create').prop('disabled', false);
	$('#Create').html('Create');
}

function start()
{
	startLoading();
	window.setTimeout(create, 1);
}

$(function()
{
	$("#Audio").hide();
});
