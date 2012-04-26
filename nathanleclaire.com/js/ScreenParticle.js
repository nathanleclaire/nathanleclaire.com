// screen size variables

var SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight,
HALF_WIDTH = window.innerWidth / 2,
HALF_HEIGHT = window.innerHeight / 2,

// canvas element and 2D context
// canvas = $("#particles").append(createElement( 'canvas' )),
context = canvas.getContext( '2d' ),


mouseX = 0, mouseY = 0, mouseDown = false,

particles = [],
MAX_PARTICLES = 100,
particleImage = new Image(), 

stats;

init();
setInterval(loop, 1000 / 30);

function init() {

	// CANVAS SET UP

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	container.appendChild(canvas); 
	canvas.width = 500; 
	canvas.height = 800;
	
	canvas.style = "margin: 0px auto;" 

	particleImage.src = 'img/ParticleBlue.png'; 
	
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );

	
}

//

function onMouseMove( event ) {

	event.preventDefault();

	mouseX = event.clientX;
	mouseY = event.clientY;

}

function onMouseDown(event) 
{
	mouseDown = true; 

}
function onMouseUp(event) 
{
	mouseDown = false; 

}


//

function loop() 
{

	// make a particle
	makeParticle(1);		
	
	// clear the canvas
	context.fillStyle="rgb(0,0,0)";
	//context.fillStyle="rgba(0,0,0,0.2)";
  	context.fillRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
  	
  	// iteratate through each particle
	for (i=0; i<particles.length; i++)
	{
		var particle = particles[i]; 
		
		// render it
		particle.render(context); 
		
		// and then update. We always render first so particle
		// appears in the starting point.
		particle.update();
		
		
		
							

	}
	
	// Keep taking the oldest particles away until we have 
	// fewer than the maximum allowed. 
	 
	while(particles.length>MAX_PARTICLES)
		particles.shift(); 
	

	stats.update();
}

function makeParticle(particleCount)
{

	for(var i=0; i<particleCount;i++)
	{
		
		// create a new particle in the middle of the stage
		var particle = new ImageParticle(particleImage, HALF_WIDTH, HALF_HEIGHT); 
		//var particle = new ImageParticle(particleImage, mouseX, mouseY); 
		
		// give it a random x and y velocity
		particle.velX = randomRange(-6,6);
		particle.velY = randomRange(-6,6);
		particle.size = randomRange(1,5);
		particle.gravity = 0; 
		particle.drag = 0.98;
		particle.shrink = 0.97; 
		
		// sets the blend mode so particles are drawn with an additive blend
		particle.compositeOperation = 'lighter';
		
		// add it to the array
		particles.push(particle); 
		
	}

}