
var trigrams = {};
var trigramKeyList;
var sumStartsWith = {};

function loadTrigrams(responseText)
{
	var lines = responseText.split('\n');
	for (var i = 0; i < lines.length; i++)
	{
		var trigram = lines[i].substring(0, 3);
		var value = parseInt(lines[i].substring(4, lines[i].length));
		if (trigram == '' || isNaN(value))
			continue;
		trigrams[trigram] = value;
	}

	trigramKeyList = Object.keys(trigrams);

	document.getElementById("loading").innerHTML = "";
}

function start()
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{
		if (xhttp.readyState == 4 && xhttp.status == 200)
		{
		  loadTrigrams(xhttp.responseText);
		}
	};
	xhttp.open("GET", "https://raw.githubusercontent.com/pommicket/NameGenerator/master/trigrams.txt", true);
	xhttp.send();
}

function pickFirst2()
{

	var count = 0;
	var sum = 0;

	for (var i = 0; i < trigramKeyList.length; i++)
	{
		if (trigramKeyList[i][0] == ' ')
		{
			sum += trigrams[trigramKeyList[i]];
		}
	}

	var selected = Math.random() * sum;


	for (var i = 0; i < trigramKeyList.length; i++)
	{
		if (trigramKeyList[i][0] == ' ')
		{
			count += trigrams[trigramKeyList[i]];
			if (selected < count)
				return trigramKeyList[i].substring(1);
		}
	}

	return "ERROR";
}

function nextChar(name)
{
	var last2 = name.substring(name.length-2);
	var total = 0;
	if (sumStartsWith[last2] == NaN || sumStartsWith[last2] == undefined)
	{
		for (var i = 0; i < trigramKeyList.length; i++)
		{
			if (trigramKeyList[i].substring(0, 2) == last2)
				total += trigrams[trigramKeyList[i]];
		}
		sumStartsWith[last2] = total;
	}
	else
	{
		total = sumStartsWith[last2];
	}
	var selected = Math.random() * total;
	var count = 0;

	for (var i = 0; i < trigramKeyList.length; i++)
	{
		if (trigramKeyList[i].substring(0, 2) == last2)
		{
			count += trigrams[trigramKeyList[i]];
			if (selected < count)
				return trigramKeyList[i][2];
		}
	}

	return "ERROR";
}


function generateName()
{
	var first = pickFirst2();
	var name = first;
	var next = '';
	var length = 0;
	do
	{
		name += next;
		next = nextChar(name);
	}
	while (next != ' ');

	name = name[0].toUpperCase() + name.substring(1);


	return name;
}


function createNames()
{
	var nameStr = '';
	var numNames = document.getElementById("numNames").value;
	var nameDiv = document.getElementById("names");

	window.setTimeout(50, function() {document.getElementById("loading").innerHTML = "Loading...";});

	nameDiv.innerHTML = "";

	for (var i = 0; i < numNames; i++)
		nameStr += generateName() + "<br>";

	if (document.getElementById("outputNames").checked)
		nameDiv.innerHTML = nameStr;

	document.getElementById("loading").innerHTML = "";

	var dload;
	dload = document.getElementById("download");
	dload.innerHTML = "Download names (.txt)";
	var txt = nameStr.replace(/<br>/g, "\n");
	dload.href = "data:text/plain;charset=utf-8," + encodeURI(txt);

	stopLoading();
}

function startLoading()
{
	$('#button').prop('disabled', true);
	$('#button').html('Loading...');
}

function stopLoading()
{
	$('#button').prop('disabled', false);
	$('#button').html('Create Names!');
}


function create()
{
	startLoading();
	window.setTimeout(createNames, 1);
}

start();
