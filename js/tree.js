
function draw_branch(x, y, t)
{
  if (t > 8)
    return;
  var sz = (400 * pow(0.5, t)) * map(255-frameCount%256, 0, 255, 0, 1);
  var angle = map(mouseX, 0, width, 0, HALF_PI) + t * map(mouseY, 0, height, -HALF_PI, HALF_PI);
  line(x, y, x+cos(angle)*sz, y-sin(angle)*sz);
  line(x, y, x-cos(angle)*sz, y-sin(angle)*sz);
  draw_branch((x+cos(angle)*sz), (y-sin(angle)*sz), t+1);
  draw_branch((x-cos(angle)*sz), (y-sin(angle)*sz), t+1);
}
function setup()
{
  
  createCanvas(700, 700);
  background(255);
  draw_branch(width/2, height, 0);
}
function draw()
{
  background(255);
  draw_branch(width/2, height, 0);
}
