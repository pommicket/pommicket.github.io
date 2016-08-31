var words = [];
var word;
var anagram;
var alphabet = "qwertyuiopasdfghjklzxcvbnm";
var letters = alphabet + alphabet.toUpperCase();


Array.prototype.equals = function (array)
{
	if (this.length != array.length)
		return false;
	for (var i = 0; i < array.length; i++)
	{
		if (this[i] != array[i])
			return false;
	}
	return true;
}

function containsSymbols(w)
{
	for (var i = 0; i < w.length; i++)
	{
		if (!letters.includes(w[i]))
			return true;
	}
	return false;
}

function letterCounts(w)
{
	var lc = [];
	for (var i = 0; i < 26; i++)
	{
		lc.push(0);
	}
	var w = w.toLowerCase();
	for (var i = 0; i < w.length; i++)
	{
		lc[w.charCodeAt(i)-97]++;
	}
	return lc;
}

function isAnagram(w1, w2)
{
	return letterCounts(w1).equals(letterCounts(w2));
}

function findWord()
{
	var numWords = words.length;
	word = words[Math.floor(Math.random()*numWords)];
	if (containsSymbols(word))
		findWord();
	var lc = letterCounts(word);
	for (var i = 0; i < numWords; i++)
	{
		if (words[i] != word && letterCounts(words[i]).equals(lc))
		{
			anagram = words[i];
			return;
		}
	}
	findWord();
}

function play()
{
	$("#hidden").attr("style", "visibility: hidden;");
	$("#again").attr("style", "visibility: hidden;");
	$("#answer").attr("style", "visibility: hidden;");
	$("#guess").val("");
	$("#loading").html("Finding a word with an anagram...");
	findWord();
	$("#loading").html("");
	$("#word").html("Find an anagram of " + word + ".");
	$("#hidden").attr("style", "");

}

function isWord(x)
{
	return words.indexOf(x) > -1;
}

function loadWords()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (xhttp.readyState == 4 && xhttp.status == 200)
		{
			var allwords = xhttp.responseText.split('\n');
			words = [];
			for (var i = 0; i < allwords.length; i++)
			{
				if (allwords[i].length == 7)
					words.push(allwords[i].toLowerCase());
			}
			play();
		}
	};
	xhttp.open("GET", "https://raw.githubusercontent.com/sindresorhus/word-list/master/words.txt", true);
	xhttp.send();
}

function submit()
{
	var guess = $("#guess").val().toLowerCase();
	if (guess != word && letterCounts(guess).equals(letterCounts(word)) && isWord(guess))
	{
		$("#answer").attr("style", "");
		$("#answer").html("<span style='color: green'>Correct!</span>");

		$("#again").attr("style", "");
	}
	else
	{
		$("#answer").attr("style", "");
		$("#answer").html("<span style='color: red'>Incorrect!</span>");
	}
}

function giveUp()
{
	$("#answer").attr("style", "");
	$("#answer").html("<span style='color: red'>The answer was " + anagram + ".</span>");

	$("#again").attr("style", "");
}

loadWords();
