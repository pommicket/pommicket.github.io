var WIDTH = 600;
var HEIGHT = 600;
var CIRCLE_SIZE = 20;
var SECOND_CIRCLE = 100;
var MINUTE_CIRCLE = 200;
var HOUR_CIRCLE = 300;
var DAY_CIRCLE = 500;
function setup()
{
createCanvas(600, 600);
  ellipseMode(CENTER);
}

function leapYear()
{
  return year() % 4 == 0 && (!(year() % 100 == 0) || year() % 400 == 0) ? 1 : 0;
}


function day365()
{
  var m = month()-1;
  var currday = 0;
  if (m == 0)
    return day();
  currday += 31;
  if (m == 1)
    return day()+currday;
  currday += 28 + leapYear();
  if (m == 2)
    return day()+currday;
  currday += 31;
  if (m == 3)
    return day()+currday;
  currday += 30;
  if (m == 4)
    return day()+currday;
  currday += 31;
  if (m == 5)
    return day()+currday;
  currday += 30;
  if (m == 6)
    return day()+currday;
  currday += 31;
  if (m == 7)
    return day()+currday;
  currday += 31;
  if (m == 8)
    return day()+currday;
  currday += 30;
  if (m == 9)
    return day()+currday;
  currday += 31;
  if (m == 10)
    return day()+currday;
  currday += 30;
  if (m == 11)
    return day()+currday;
  currday += 31;
  if (m == 12)
    return day()+currday;
  return -1;
}

function draw()
{
  background(255, 255, 255);
  var date = new Date();
  var ms = date.getTime() % 1000;
  var s = second();
  var h = hour();
  var m = minute();
  var secs = s + ms/1000;
  var mins = m + secs / 60;
  var hrs = h + mins / 60;
  var dy =  day365() + hrs / 24;
  
  hours = TWO_PI * (hrs / 24) - HALF_PI;
  minutes = TWO_PI * (mins / 60) - HALF_PI;
  seconds = TWO_PI * (secs / 60) - HALF_PI;
  date = TWO_PI * (dy / (365 + leapYear())) - HALF_PI;
  noFill();
  
  stroke(secs*4, 0, 0);
  ellipse(WIDTH / 2, HEIGHT / 2, SECOND_CIRCLE, SECOND_CIRCLE);
  stroke(0, mins*4, 0);
  ellipse(WIDTH / 2, HEIGHT / 2, MINUTE_CIRCLE, MINUTE_CIRCLE);
  stroke(0, 0, hrs*4);
  ellipse(WIDTH / 2, HEIGHT / 2, HOUR_CIRCLE, HOUR_CIRCLE);
  stroke(0, 0, 0);
  ellipse(WIDTH / 2, HEIGHT / 2, DAY_CIRCLE, DAY_CIRCLE);
  
  noStroke();
  
  var dayX = (cos(date) * DAY_CIRCLE / 2) + WIDTH / 2;
  var dayY = (sin(date) * DAY_CIRCLE / 2) + HEIGHT / 2;
  
  var hourX = (cos(hours) * HOUR_CIRCLE / 2) + WIDTH / 2;
  var hourY = (sin(hours) * HOUR_CIRCLE / 2) + HEIGHT / 2;
  
  var minuteX = (cos(minutes) * MINUTE_CIRCLE / 2) + WIDTH / 2;
  var minuteY = (sin(minutes) * MINUTE_CIRCLE / 2) + HEIGHT / 2;
 
  var secondX = (cos(seconds) * SECOND_CIRCLE / 2) + WIDTH / 2;
  var secondY = (sin(seconds) * SECOND_CIRCLE / 2) + HEIGHT / 2;
  
  fill(secs*4, 0, 0);
  ellipse(secondX, secondY, CIRCLE_SIZE, CIRCLE_SIZE);
  fill(0, mins*4, 0);
  ellipse(minuteX, minuteY, CIRCLE_SIZE, CIRCLE_SIZE);
  fill(0, 0, hrs*4);
  ellipse(hourX, hourY, CIRCLE_SIZE, CIRCLE_SIZE);
  fill(0, 0, 0);
  ellipse(dayX, dayY, CIRCLE_SIZE, CIRCLE_SIZE);
  textSize(30);
}