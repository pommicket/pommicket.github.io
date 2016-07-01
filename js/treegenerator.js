
var size;
var start_angle;
var angle_decay;
function draw_branch(x, y, t)
{
  if (t > 8)
    return;
  var sz = size * pow(0.5, t);
  var angle = start_angle + angle_decay * t;
  line(x, y, x+cos(angle)*sz, y-sin(angle)*sz);
  line(x, y, x-cos(angle)*sz, y-sin(angle)*sz);
  draw_branch(x+cos(angle)*sz, y-sin(angle)*sz, t+1);
  draw_branch(x-cos(angle)*sz, y-sin(angle)*sz, t+1);
  
}
function setup()
{
	
  createCanvas(700, 700);
  stroke(0);
}

function draw()
{
  size = parseFloat(document.getElementById("size").value);
  start_angle = parseFloat(document.getElementById("angle").value);
  angle_decay = parseFloat(document.getElementById("angledecay").value);
  background(255);
  draw_branch(width/2, height, 0);
}

function saveTree()
{	
	save("tree.png");
	
}