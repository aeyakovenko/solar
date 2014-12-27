
//mass kg
//distance m
//time seconds
var sun = {mass:1.989e30, name:"sun", velocity : {x: 0, y: 0}, position : { x: 0, y: 0}, radius : 695800000 };
var earth =   {mass:5.972e24, name:"earth",   velocity : {x: 0, y: 29806.0795}, position : { x: 149600000000, y: 0}, radius: 6371000};
var jupiter = {mass:1.898e27, name:"jupiter", velocity : {x: 0, y: 12917.0264 }, position : { x: 778500000000, y: 0}, radius: 69911000};
var bodies = [sun, earth, jupiter];
var time = 0;
var height = 778500000000*4;
var center = { x: 400, y: 400 };
var size = { x: 800, y: 800 };
var scale = Math.pow(Math.pow(size.x,2) + Math.pow(size.y,2),0.5);
var secondsPerFrame = 60*60;

function distanceSquared(p1, p2) {
   return Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2);
}

function distance(p1, p2) {
   return Math.pow(distanceSquared(p1,p2),0.5);
}

function xfact(d, p1, p2) {
   return (p2.x - p1.x) / d;
}

function yfact(d, p1, p2) {
   return (p2.y - p1.y) / d;
}

function force(b1, b2) {
   var g = parseFloat('6.673e-11');
   var d = distanceSquared(b1.position, b2.position);
   return b1.mass * b2.mass * g / d;
}

function update() {
   for (xi in bodies) {
      for (yi in bodies) {
         if (xi == yi) {
            continue;
         }
         var xx = bodies[xi];
         var yy = bodies[yi];
         var gf = force(xx, yy);
         var dist = distance(xx.position, yy.position);
         var xa = gf * xfact(dist, xx.position, yy.position) / xx.mass;
         var ya = gf * yfact(dist, xx.position, yy.position) / xx.mass;
         var xstart = { x: xx.position.x, y: xx.position.y };
         var xchange = Math.pow(secondsPerFrame,2)* xa/2 + xx.velocity.x*secondsPerFrame;
         xx.position.x = xx.position.x + xchange;
         var ychange = Math.pow(secondsPerFrame,2)* ya/2 + xx.velocity.y*secondsPerFrame;
         xx.position.y = xx.position.y + ychange;
         xx.velocity = { x : (xx.position.x - xstart.x)/secondsPerFrame, y : (xx.position.y - xstart.y)/secondsPerFrame};
      }
   }
}

function draw() {
   update();
   var c = document.getElementById('canvas');
   var ctx = c.getContext('2d');
   ctx.clearRect(-size.x,-size.x,2*size.x,2*size.y);
   for (ii in bodies) {
      var xx = bodies[ii];
      ctx.fillStyle = 'red';
      var xscale = size.x / height;
      var xp = xx.position.x / height * scale;
      var yp = xx.position.y / height * scale;
      var rr = xx.radius / height * scale;
      ctx.beginPath();
      ctx.arc(xp,yp,rr + 0.5,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.font="10px Georgia";
      ctx.fillText(xx.name + " " + JSON.stringify(xx.velocity),xp,yp);
      ctx.closePath();
   }

}

var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.translate(center.x, center.y);
setInterval(draw, 1000/60);
