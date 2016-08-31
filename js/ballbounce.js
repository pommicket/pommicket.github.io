var WIDTH = 500;
var HEIGHT = 500;
var ball_radius = 25;
var ball_pos = [WIDTH/2, HEIGHT/4];
var ball_vel = [0, 0];
var score = 0;
var started = false;
function setup()
{
	createCanvas(WIDTH, HEIGHT);
	reset();
}

function reset()
{
	background(255, 255, 255);
	stroke(255, 0, 0);
	noFill();
	rect(0, 0, WIDTH-1, HEIGHT-1);
	noStroke();
}

function draw()
{

	fill(0,0,0);
	ellipse(ball_pos[0], ball_pos[1], ball_radius*2, ball_radius*2);
	fill(255, 0, 0);
	if (abs(ball_pos[0] - mouseX) < ball_radius && mouseY > ball_pos[1])
	{
		if (dist(ball_pos[0], ball_pos[1], mouseX, mouseY) < ball_radius)
		{
			ball_vel = [(ball_pos[0] - mouseX) / 10, -4];
			ball_pos[1] -= 10;
			score++;
			started = true;
		}
	}
	if (started)
		ball_vel[1] += 0.1;

	ball_pos[0] += ball_vel[0];
	ball_pos[1] += ball_vel[1];

	if (ball_pos[1] > HEIGHT)
	{
		alert("You lost. Score: " + score);
		reset();
		ball_pos = [WIDTH/2, HEIGHT/4];
		ball_vel = [0, 0];
		score = 0;
		started = false;
	}
}
