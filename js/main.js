var Render={
	canvas:null,
	context:null,
	iterationDelay:31
};
var ship;
var Game={
	exhaustRandomness:1.2,
	minExhaustVelocity:16,
	maxExhaustVelocity:20,
	shipBorderRebound:0.5,
	shipBorderFriction:0.8,
	ships:[],
	playerID:0,
	loop:function(){
		loop(); //temporary
		return; //temporary
		forEach(Game.ships,function(b){
			//apply Ship velocity
			b.x+=b.v.x;
			b.y+=b.v.y;
			//Ship to border collisions
			if (b.y > window.innerHeight-b.height/2) {
				b.y = window.innerHeight-b.height/2;
				b.v.y=-b.v.y*Game.shipBorderRebound;
				b.v.x*=Game.shipBorderFriction;
			} else if (b.y < b.height/2) {
				b.y = b.height/2;
				b.v.y=-b.v.y*Game.shipBorderRebound;
				b.v.x*=Game.shipBorderFriction;
			}
			if (b.x > window.innerWidth-b.width/2) {
				b.x = window.innerWidth-b.width/2;
				b.v.x=-b.v.x*Game.shipBorderRebound;
				b.v.y*=Game.shipBorderFriction;
			} else if (b.x < b.width/2) {
				b.x = b.width/2;
				b.v.x=-b.v.x*Game.shipBorderRebound;
				b.v.y*=Game.shipBorderFriction;
			}
			forEach(b.particles,function(a){
				//apply Particle velocity
				a.x+=a.v.x;
				a.y+=a.v.y;
			});
		});
	}
};

io.addEvent('keydown',io.keyDown);
io.addEvent('keyup',io.keyUp);
io.addEvent('load',function(){
	Render.canvas=document.getElementsByTagName('canvas')[0];
	Render.canvas.width=window.innerWidth;
	Render.canvas.height=window.innerHeight;
	Render.context=Render.canvas.getContext('2d');

	ship=new Ship(window.innerWidth/2,window.innerHeight/2); //delete this
	Game.ships.push(new Ship(window.innerWidth/2,window.innerHeight/2));
	Game.loop();
});
io.addEvent('resize',function(){
	Render.canvas.width=window.innerWidth;
	Render.canvas.height=window.innerHeight;
});

function clear(){
	Render.context.clearRect(0,0,window.innerWidth,window.innerHeight);
}
function loop(){
	//update ship pos
	ship.x+=ship.v.x;
	ship.y+=ship.v.y;
	//check ship border collisions
	if(ship.y>window.innerHeight-ship.height/2){
		ship.y=window.innerHeight-ship.height/2;
		ship.v.y=0-ship.v.y*0.5;
		ship.v.x*=0.8;
	}else if(ship.y<0+ship.height/2){
		ship.y=0+ship.height/2;
		ship.v.y=0-ship.v.y*0.5;
		ship.v.x*=0.8;
	}
	if(ship.x>window.innerWidth-ship.width/2){
		ship.x=window.innerWidth-ship.width/2;
		ship.v.x=0-ship.v.x*0.5;
		ship.v.y*=0.8;
	}else if(ship.x<0+ship.width/2){
		ship.x=0+ship.width/2;
		ship.v.x=0-ship.v.x*0.5;
		ship.v.y*=0.8;
	}
	//update particles pos
	forEach(ship.particles,function(b){
		b.x+=b.v.x;
		b.y+=b.v.y;
		//check particles border collision CONTINUE REFACTOR ABOVE HERE
		if(b.y>window.innerHeight-b.height/2){
			b.y=window.innerHeight-b.height/2;
			b.v.y=-b.v.y;
			b.v.y*=0.9;
		}else if(b.y<0+b.height/2){
			b.y=0+b.height/2;
			b.v.y=-b.v.y;
			b.v.y*=0.9;
		}
		if(b.x>window.innerWidth-b.width/2){
			b.x=window.innerWidth-b.width/2;
			b.v.x=-b.v.x;
			b.v.x*=0.9;
		}else if(b.x<0+b.width/2){
			b.x=0+b.width/2;
			b.v.x=-b.v.x;
			b.v.x*=0.9;
		}
		//SHIP COLLIDE
		if( b.x-b.width/2   < ship.x+ship.width/2 &&
			b.x+b.width/2  > ship.x-ship.width/2 &&
			b.y-b.height/2 < ship.y+ship.height/2 &&
			b.y+b.height/2 > ship.y-ship.width/2
		){
			//collision!
			//ship.particles.splice(ship.particles.indexOf(b),1);
			b.v.x+=ship.v.x;
			b.v.y+=ship.v.y;
			/*if(b.v.x>0 && ship.v.x>0 || b.v.x<0 && ship.v.x<0){
				b.v.x+=ship.v.x;
			}else{
				b.v.x-=ship.v.x;
			}
			if(b.v.y>0 && ship.v.y>0 || b.v.y<0 && ship.v.y<0){
				b.v.y+=ship.v.y;
			}else{
				b.v.y-=ship.v.y;
			}*/
		}
	});
	//update ship velocity
	ship.v.y+=0.5;
	ship.v.x*=0.99;
	ship.v.y*=0.99;
	//update particles velocity
	forEach(ship.particles,function(b){
		b.v.x*=0.9;
		b.v.y*=0.9;
		//slight random.number variations
		b.v.x+=random.number(-0.3*b.v.x,0.3*b.v.x);
		b.v.y+=random.number(-0.3*b.v.y,0.3*b.v.y);
	});
	//check input, new particles and +velocity if exists
	if (io.keysHeld[87]){	//W
		/*
			location,effect,size,speed,parent
		*/
		ship.v.y-=1;
		/*ship.particles.push(new Particle(
			{x:random.number(ship.x-20,ship.x+20),
				y:random.number(ship.y+15,ship.y+20)},false,
			{width:4,height:8},
			{x:random.number(ship.v.x-1,ship.v.x+1),
				y:random.number(ship.v.y+speeds.particlesMinVelocity,ship.v.y+speeds.particlesMaxVelocity)},
			ship.particles)
		);*/
		ship.exhaust('down');
	}
	if (io.keysHeld[65]){	//A
		ship.v.x-=1;
		ship.exhaust('right');
	}
	if (io.keysHeld[83]){	//S
		ship.v.y+=1;
		ship.exhaust('up');
	}
	if (io.keysHeld[68]){	//D
		ship.v.x+=1;
		ship.exhaust('left');
	}
	//draw
	Jenjens.render.clear(Render.context);
	forEach(ship.particles,function(b){
		b.draw(Render.context);
	});
	ship.draw(Render.context);
	//decrease visibility and remove black particles
	forEach(ship.particles,function(b){
		b.effect();
	});

	setTimeout(loop,Render.iterationDelay);
}
