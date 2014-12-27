
//mass kilograms
//distance meters
//time seconds
//force Newtons
var AU=149597870700;
var AUD=AU/(24*60*60);
var secondsPerFrame = 24*60*60;

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split('&');
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
         return decodeURIComponent(pair[1]);
      }
   }
   console.log('Query variable %s not found', variable);
   return null;
}

var sun = { mass:1.989e30, name:"sun", radius : 695800000,
            position:{x:2.821077216283755E-03*AU, y:-8.812560963927427E-04*AU,z:-1.367319222648302E-04*AU},
            velocity:{x:4.006129074936341E-06*AUD,y:5.206019702028657E-06*AUD,z:-9.767312861198032E-08*AUD}};

var earth = { mass:5.972e24, name:"earth", radius: 6371000,
              position : {x:-8.169080016031242e-02*AU, y:9.789642498007118e-01*AU,  z:-1.701348267269417e-04*AU},
              velocity : {x:-1.741913145545285e-02*AUD, y:-1.544709454417245e-03*AUD, z:5.355488200427113e-07*AUD}};

var jupiter = { mass:1.898e27, name:"jupiter", radius: 69911000,
                position:{x:-3.699272789771378E+00*AU, y:3.817832117430814E+00*AU, z:6.684392539978537E-02*AU},
                velocity:{x:-5.509724185671973E-03*AUD,y:-4.896023689305917E-03*AUD,z:1.436000235561424E-04*AUD}};

var system = {};
system["sun"] = sun;
system["earth"] = earth;
system["jupiter"] = jupiter;

var bodies = [sun,earth,jupiter];
if (getQueryVariable('bodies')) {
   bodies = getQueryVariable('bodies').split(',');
   for (ii in bodies) {
      bodies[ii] = system[bodies[ii]];
   }
}
var forceFactor = 1.0;
if (getQueryVariable('force')) {
   forceFactor = parseFloat(getQueryVariable('force'));
}

//var bodies = [sun, earth];
//var bodies = [sun, jupiter];
var height = 778500000000*4;
var center = { x: 400, y: 400 };
var size = { x: 800, y: 800 };
var scale = Math.pow(Math.pow(size.x,2) + Math.pow(size.y,2),0.5);

function distanceSquared(p1, p2) {
   return Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2) + Math.pow((p1.z - p2.z),2);
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
function zfact(d, p1, p2) {
   return (p2.z - p1.z) / d;
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
         var gf = force(xx, yy)*forceFactor;
         var dist = distance(xx.position, yy.position);
         var xa = gf * xfact(dist, xx.position, yy.position) / xx.mass;
         var ya = gf * yfact(dist, xx.position, yy.position) / xx.mass;
         var za = gf * zfact(dist, xx.position, yy.position) / xx.mass;

         xx.velocity.x = xx.velocity.x + xa * secondsPerFrame;
         xx.velocity.y = xx.velocity.y + ya * secondsPerFrame;
         xx.velocity.z = xx.velocity.z + za * secondsPerFrame;

         xx.position.x = xx.position.x + xx.velocity.x*secondsPerFrame;
         xx.position.y = xx.position.y + xx.velocity.y*secondsPerFrame;
         xx.position.z = xx.position.z + xx.velocity.z*secondsPerFrame;

      }
   }
}

function draw() {
   var c = document.getElementById('canvas');
   var ctx = c.getContext('2d');
   var maxd = 0;
   ctx.save();
   ctx.clearRect(-size.x,-size.x,2*size.x,2*size.y);
   for (ii in bodies) {
      if (ii > 0) {
         var d = distance(bodies[ii].position, bodies[0].position);
         if (d > maxd) {
            maxd = d;
         }
      }
   }
   var scale = 1.0/(maxd*4) * distance({x:0,y:0,z:0}, {x:ctx.canvas.clientWidth, y:ctx.canvas.clientHeight, z:0});
   ctx.translate(ctx.canvas.clientWidth/2 - bodies[0].position.x*scale, ctx.canvas.clientHeight/2 - bodies[0].position.y*scale);
   //ctx.scale(0.5, 0.5);
   for (ii in bodies) {
      var xx = bodies[ii];
      ctx.fillStyle = 'red';
      var xp = xx.position.x * scale;
      var yp = xx.position.y * scale;
      var rr = xx.radius * scale;
      ctx.beginPath();
      ctx.arc(xp,yp,rr + 0.5,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.font="10px Georgia";
      ctx.fillText(xx.name + " " + distance(xx.position, bodies[0].position) / AU, xp, yp);
      ctx.closePath();
   }
   ctx.restore();
}

function drawloop() {
   update();
   draw();
}

setInterval(drawloop, 1000/60);
