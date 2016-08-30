
var single = ["Math.sqrt", "Math.cos", "Math.sin"]; //Operations on a single number
var singleweights = {};
var binary = ["*", "+", "-", "/"]; //Operations for 2 numbers
var binaryweights = {};
var varlist = ["x", "y", "t"];
var numlist = ["Constant"];
numlist = numlist.concat(varlist);
var numberweights = {"Constant":1};
var numberweight;
var singleweight;
var eqlength;
var notify;

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


function randEquation()
{
	var hasx = false;
    var hasy = false;
	var hast = false;
	var equation;
	var lasttype;
	var thistype;
	var chanceend;
	var length;
	var what;
	var number;


    while (!(hasx && hasy && hast))
	{
        //Types: b for binary, s for single, f for first, n for number
        equation = '';
        lasttype = 'f';
        thistype = 0;
        hasx = false;
        hasy = false;
		hast = false;
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
                        equation += (Math.random(100, 200)).toString();
					}
                    else
					{
                        equation += what;
                        if (what == 'x')
						{
                            hasx = true;
						}
                        else if (what == 'y')
						{
                            hasy = true;
						}
						else if (what == 't')
						{
							hast = true;
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

function evalEquation(eq, x, y, t)
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
	var d = new Date();
	var start = d.getTime();
	var xsize;
	var ysize;
	var length;
	var framerate;

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

	xsize = parseInt(form.elements[1].value);
	ysize = parseInt(form.elements[2].value);
	length = parseFloat(form.elements[3].value);
	framerate = parseInt(form.elements[4].value);
	notify = form.elements[5].checked;

	singleweight = parseFloat(form.elements[7].value);
	numberweight = parseFloat(form.elements[8].value);
	eqlength = parseFloat(form.elements[9].value);

	var requation = randEquation();
	var gequation = randEquation();
	var bequation = randEquation();
	var x;
	var y;
	var r;
	var g;
	var b;
	var encoder = new Whammy.Video(framerate);
	var video = document.getElementById('Video');
	var canvas = document.getElementById('Canvas');
	video.width = xsize;
	video.height = ysize;
	canvas.width = xsize;
	canvas.height = ysize;
	var ctx = canvas.getContext('2d');
	var apx = ctx.getImageData(0, 0, xsize, ysize);
	var data = apx.data;


	eval(
	'for(var t = 0; t < Math.round(framerate * length); t++)'+
	'{'+
	'	for(var i = 0; i < data.length; i+=4)'+
	'	{'+
	'		x = (i/4) % xsize;'+
	'		y = Math.floor((i/4) / xsize);'+
	'		r = Math.abs(Math.round((' + requation + ') % 255));'+
	'		g = Math.abs(Math.round((' + gequation + ') % 255));'+
	'		b = Math.abs(Math.round((' + bequation + ') % 255));'+
	'		data[i] = r;'+
	'		data[i+1] = g;'+
	'		data[i+2] = b;'+
	'		data[i+3] = 255;'+
	'	}'+
	'	apx.data = data;'+
	'	ctx.putImageData(apx, 0, 0);'+
	'	encoder.add(ctx);'+
	'}'
	);
	var output = encoder.compile();
	var url = webkitURL.createObjectURL(output);
	video.src = url;

	$("#Canvas").hide();

	d = new Date();
	var end = d.getTime();
	var timetaken = Math.round((end-start)/1000);
	if (timetaken == 1)
	{
		$("#Time").html('The time it took was 1 second.');
	}
	else
	{
		$("#Time").html('The time it took was ' + timetaken + ' seconds.');
	}

	$("#Function").html('$Functions: \\newline\\newline Red: $' + rmvmath(requation) + '$\\newline\\newline Green: $' + rmvmath(gequation) + '$\\newline\\newline Blue: $' + rmvmath(bequation) + '$');
	LatexIT.render('*',false);

	stopLoading();

	if(notify)
	{
		alert('Your video has finished.');
	}


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
