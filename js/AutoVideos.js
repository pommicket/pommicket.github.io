
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
var flength;
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
	var newstr = "";
	for(var i = 0; i < str.length - 5; i++)
	{
		if(str[i] + str[i+1] + str[i+2] + str[i+3] + str[i+4] !== "Math.")
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


function randFunction()
{
	var hasx = false;
    var hasy = false;
	var hast = false;
	var func;
	var lasttype;
	var thistype;
	var chanceend;
	var length;
	var what;
	var number;


    while (!(hasx && hasy && hast))
	{
        //Types: b for binary, s for single, f for first, n for number
        func = "";
        lasttype = "f";
        thistype = 0;
        hasx = false;
        hasy = false;
		hast = false;
        chanceend = 0;
        length = 1; //Number of operations done so far

        while (true)
		{
            chanceend = Math.pow((1.0 - (1.0 / length)), flength);
            if (lasttype == "n")
			{
                number = Math.random();
                if (number < chanceend)
				{
                    break;
				}
                func = "(" + func + ")" + randItem(binary);
                lasttype = "b";
			}
            else if (lasttype == "s" || lasttype == "b" || lasttype == "f")
			{
                func += "(";
                thistype = Math.random();
                if (thistype < singleweight / (singleweight + numberweight))
				{
                    func += randItem(single);
                    lasttype = "s";
				}
                else
				{
                    what = randItem(numlist);
                    if (what == "Constant")
					{
                        func += (Math.random(100, 200)).toString();
					}
                    else
					{
                        func += what;
                        if (what == "x")
						{
                            hasx = true;
						}
                        else if (what == "y")
						{
                            hasy = true;
						}
						else if (what == "t")
						{
							hast = true;
						}
					}
                    lasttype = "n";
                    func += ")";
				}
			}
            length++;
		}
	}
    while (countChar(func, "(") > countChar(func, ")"))
	{
        func += ")";
	}
    return func;
}

function create()
{
	var d = new Date();
	var start = d.getTime();
	var width;
	var height;
	var length;
	var framerate;

	$("#Error").html("");

	width = parseInt($("#width").val());
	height = parseInt($("#height").val());
	length = parseFloat($("#length").val());
	framerate = parseInt($("#framerate").val());
	notify = $("#notify").prop("checked");

	singleweight = parseFloat($("#single").val());
	numberweight = parseFloat($("#number").val());
	flength = parseFloat($("#flength").val());

	if (isNaN(width) || isNaN(height) || isNaN(length) || isNaN(framerate) || isNaN(singleweight) || isNaN(numberweight) || isNaN(flength))
	{
		stopLoading();
		$("#Error").html("Please enter a valid number.");
		return;
	}

	var rfunction = randFunction();
	var gfunction = randFunction();
	var bfunction = randFunction();
	console.log("1Hi");
	var x;
	var y;
	var r;
	var g;
	var b;
	var encoder = new Whammy.Video(framerate);
	var video = document.getElementById("Video");
	var canvas = document.getElementById("Canvas");
	video.width = width;
	video.height = height;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	var apx = ctx.getImageData(0, 0, width, height);
	var data = apx.data;


	eval(
	"for(var t = 0; t < Math.round(framerate * length); t++)"+
	"{"+
	"	for(var i = 0; i < data.length; i+=4)"+
	"	{"+
	"		x = (i/4) % width;"+
	"		y = Math.floor((i/4) / width);"+
	"		r = Math.abs(Math.round((" + rfunction + ") % 255));"+
	"		g = Math.abs(Math.round((" + gfunction + ") % 255));"+
	"		b = Math.abs(Math.round((" + bfunction + ") % 255));"+
	"		data[i] = r;"+
	"		data[i+1] = g;"+
	"		data[i+2] = b;"+
	"		data[i+3] = 255;"+
	"	}"+
	"	apx.data = data;"+
	"	ctx.putImageData(apx, 0, 0);"+
	"	encoder.add(ctx);"+
	"}"
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
		$("#Time").html("The time it took was 1 second.");
	}
	else
	{
		$("#Time").html("The time it took was " + timetaken + " seconds.");
	}

	$("#Function").html("$Functions: \\newline\\newline Red: $" + rmvmath(rfunction) + "$\\newline\\newline Green: $" + rmvmath(gfunction) + "$\\newline\\newline Blue: $" + rmvmath(bfunction) + "$");
	LatexIT.render("*",false);

	stopLoading();

	if (notify)
	{
		alert("Your video has finished.");
	}

	stopLoading();

}

function startLoading()
{
	$("#Create").prop("disabled", true);
	$("#Create").html("Loading...");
}

function stopLoading()
{
	$("#Create").prop("disabled", false);
	$("#Create").html("Create");
}

function start()
{
	startLoading();
	window.setTimeout(create, 1);
}
