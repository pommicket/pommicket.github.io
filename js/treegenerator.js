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
    createCanvas(750, 750);
    stroke(0);
}

function draw()
{
    size = parseFloat($("#size").val());
    start_angle = parseFloat($("#angle").val());
    angle_decay = parseFloat($("#angledecay").val());
    background(255);
    draw_branch(width/2, height, 0);
}

function saveTree()
{
	save("tree.png");
}
