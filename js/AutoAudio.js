var length;
var single = ["Math.sqrt", "Math.cos", "Math.sin"]; //Operations on a single number
var singleweights = {};
var binary = ["*", "+", "-", "/"]; //Operations for 2 numbers
var binaryweights = {};
var varlist = ["x"];
var numlist = ["Constant"];
numlist = numlist.concat(varlist);
var numberweights = {"Constant":1};
var numberweight = 1;
var singleweight = 1;
var eqlength;
var notify;
var functionp = document.getElementById('Function');

for(var i = 0; i < single.length; i++)
{
	singleweights[single[i]] = 1;
}

for(var i = 0; i < binary.length; i++)
{
	binaryweights[binary[i]] = 1;
}

for(var i = 0; i < varlist.length; i++)
{
	numberweights[varlist[i]] = 1;
}

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

function randEquation()
{
	var hasx = false;
	var equation;
	var lasttype;
	var thistype;
	var chanceend;
	var length;
	var what;
	var number;


    while (!hasx)
	{
        //Types: b for binary, s for single, f for first, n for number
        equation = '';
        lasttype = 'f';
        thistype = 0;
        hasx = false;
        chanceend = 0;
        length = 1; //Number of operations done so far

        while (true)
		{
            chanceend = Math.pow((1.0 - (1.0 / length)), eqlength);
            if (lasttype == 'n')
			{
                number = Math.random();
                if (number < chanceend)
				{
                    break;
				}
                equation = '(' + equation + ')' + randItem(binary);
                lasttype = 'b';
			}
            else if (lasttype == 's' || lasttype == 'b' || lasttype == 'f')
			{
                equation += '(';
                thistype = Math.random();
                if (thistype < singleweight / (singleweight + numberweight))
				{
                    equation += randItem(single);
                    lasttype = 's';
				}
                else
				{
                    what = randItem(numlist);
                    if (what == 'Constant')
					{
                        equation += (Math.random()*100+100).toString();
					}
                    else
					{
                        equation += what;
                        if (what == 'x')
						{
                            hasx = true;
						}
					}
                    lasttype = 'n';
                    equation += ')';
				}
			}
            length++;
		}
	}
    while (countChar(equation, '(') > countChar(equation, ')'))
	{
        equation += ')';
	}
    return equation;
}

function evalEquation(eq, x)
{
	try
	{
		eval('var result = ' + eq);
		return result;
	}
	catch(err)
	{
		return 0;
	}
}

function create()
{
	var date = new Date();
	var start = date.getTime();
	var form = document.getElementById('Options');
	var errtag = document.getElementById('Error');


	errtag.innerHTML = '';
	for (var i = 0; i < form.elements.length; i++)
	{
		if (form.elements[i].value == '')
		{
			errtag.innerHTML = 'Please enter a valid number.';
			return;
		}
	}

	length = parseInt(form.elements[1].value);
	notify = form.elements[2].checked;

	singleweight = parseFloat(form.elements[4].value);
	numberweight = parseFloat(form.elements[5].value);
	eqlength = parseFloat(form.elements[6].value);

	var data = [];
	var equation = randEquation();

	for (var i=0; i<length * 10000; i++)
	{
		var value = evalEquation(equation, i);
		value %= 1;
		data[i] = Math.abs(255 * value);
	}
	var wave = new RIFFWAVE(data);
	audio = document.getElementById('Audio');
	audio.src = wave.dataURI;
	date = new Date();
	end = date.getTime();
	var timeparagraph = document.getElementById('Time');
	var timetaken = Math.round((end-start)/1000);
	if (timetaken == 1)
	{
		timeparagraph.innerHTML = 'The time it took was 1 second.';
	}
	else
	{
		timeparagraph.innerHTML = 'The time it took was ' + timetaken + ' seconds.';
	}

	functionp.innerHTML = '$Function: $' + rmvmath(equation);
	LatexIT.render('*',false);

	stopLoading();

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
