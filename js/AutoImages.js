
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');

var single = ["Math.sqrt", "Math.cos", "Math.sin"]; //Operations on a single number
var singleweights = {};
var binary = ["*", "+", "-", "/"]; //Operations for 2 numbers
var binaryweights = {};
var varlist = ["x", "y"];
var numlist = ["Constant"];
numlist = numlist.concat(varlist);
var numberweights = {"Constant":1}
var numberweight;
var singleweight;
var eqlength;
var xsize;
var ysize;
var functionp = document.getElementById('Function');
var notify;
var latex;
var mathjax;

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
};

function randItem(l)
{
	return l[Math.floor(Math.random() * l.length)];
};

function countChar(string, letter)
{
	var amount = 0;
	for (var i = 0; i < string.length; i++)
	{
		if (string[i] === letter)
		{
			amount++;
		}
	}
	return amount;
};



function randEquation()
{
	var hasx = false;
    var hasy = false;
	var equation;
	var lasttype;
	var thistype;
	var chanceend;
	var length;
	var what;
	var number;

    while (!(hasx && hasy))
	{
        //Types: b for binary, s for single, f for first, n for number
        equation = '';
        lasttype = 'f';
        thistype = 0;
        hasx = false;
        hasy = false;
        chanceend = 0;
        length = 1; //Number of operations done so far

        while (true)
		{
            chanceend = Math.pow((1.0 - (1.0 / length)), eqlength);
            if (lasttype === 'n')
			{
                number = Math.random();
                if (number < chanceend)
				{
                    break;
				}
                equation = '(' + equation + ')' + randItem(binary);
                lasttype = 'b';
			}
            else if (lasttype === 's' || lasttype === 'b' || lasttype === 'f')
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
                    if (what === 'Constant')
					{
                        equation += (Math.random(100, 200)).toString();
					}
                    else
					{
                        equation += what;
                        if (what === 'x')
						{
                            hasx = true;
						}
                        else if (what === 'y')
						{
                            hasy = true;
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
};


function create()
{
	var date = new Date();
	var start = date.getTime();

	form = document.getElementById('Options');

	var errtag = document.getElementById('Error');
	errtag.innerHTML = '';

	for (var i = 0; i < form.elements.length; i++)
	{
		if (form.elements[i].value === '')
		{
			errtag.innerHTML = 'Please enter a valid number.';
			return;
		}
	}

	xsize = parseInt(form.elements[1].value);
	ysize = parseInt(form.elements[2].value);
	notify = form.elements[3].checked;

	singleweight = parseFloat(form.elements[5].value);
	numberweight = parseFloat(form.elements[6].value);
	eqlength = parseFloat(form.elements[7].value);

	canvas.width = xsize;
	canvas.height = ysize;
	var imgData = ctx.createImageData(xsize, ysize);
	var requation = randEquation();
	var gequation = randEquation();
	var bequation = randEquation();
	var x;
	var y;
	var r;
	var g;
	var b;
	eval(
	'for (var i=0;i<imgData.data.length;i+=4)'+
	'{'+
	'	x = (i/4) % xsize;'+
	'	y = Math.floor((i/4) / xsize);'+
	'	r = (' + requation + ') % 255;'+
	'	g = (' + gequation + ') % 255;'+
	'	b = (' + bequation + ') % 255;'+
	'	r = Math.abs(Math.round(r));' +
	'	g = Math.abs(Math.round(g));' +
	'	b = Math.abs(Math.round(b));' +

	'	imgData.data[i] = r;' +
	'	imgData.data[i+1] = g;' +
	'	imgData.data[i+2] = b;' +
	'	imgData.data[i+3] = 255;' +
	'}');
	ctx.putImageData(imgData,0,0);
	var date = new Date();
	var end = date.getTime();
	var timeparagraph = document.getElementById('Time');
	var timetaken = Math.round((end-start)/1000);
	if (timetaken === 1)
	{
		timeparagraph.innerHTML = 'The time it took was 1 second.';
	}
	else
	{
		timeparagraph.innerHTML = 'The time it took was ' + timetaken + ' seconds.';
	}


	functionp.innerHTML = '$Functions: \\newline\\newline Red: $' + rmvmath(requation) + '$\\newline\\newline Green: $' + rmvmath(gequation) + '$\\newline\\newline Blue: $' + rmvmath(bequation) + '$';
	LatexIT.render('*',false);
	if(notify)
	{
		alert('Your image has finished.');
	}
	document.getElementById('Download').innerHTML = "Download";
};


function download() {
    var dt = canvas.toDataURL('image/png');
    this.href = dt;
};
var downloadLink = document.getElementById('Download');
downloadLink.addEventListener('click', download, false);
