#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform float u_time;
uniform vec2 u_resolution;

const float cycle = 5.0;
const float interval = 0.25;
const vec3 white = vec3(0.8,0.8,0.8);
const vec3 grey = vec3(0.6,0.6,0.6);
const vec3 green = vec3(0.7,0.9,0.8);
const vec3 turquoise = vec3(0.6,0.8,0.9);
const vec3 blue = vec3(0.6,0.6,0.9);
const vec3 purple = vec3(0.7,0.6,0.9);
const vec3 pink = vec3(0.9,0.6,0.8);
const vec3 yellow = vec3(0.9,0.8,0.6);
const vec3 orange = vec3(1.0,0.7,0.6);
const vec3 red = vec3(1.0,0.6,0.6);

vec2 car2pol(in vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return fract(sin(st)*43758.5453123);
}

float random_from2d(vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec3 star(vec2 st, vec2 c, int n, vec3 color){
  st -= c-0.5;
  st = (st-0.5)/0.05+0.5;
  st = car2pol(st);
  
  float y = 0.1+pow(fract(st.x*float(n))-0.5,2.9);
  // float y = 0.1+pow(fract(st.x*float(n))-0.5,2.0); //fix for if stars render poorly
  return smoothstep(y+0.15,y,st.y)*color+smoothstep(y+0.05,y-0.05,st.y)*(1.0-color);
}

vec2 pos(float i, float n){
  vec2 xy = random2d(vec2(i,n));
  if(distance(xy,vec2(0.5)) < 0.1){
    xy.x += i/(cycle/interval)-0.5;
    xy.y += fract(i/(cycle/interval)+0.5)-0.5;
  }
  return xy;
}

int points(float i, float n){
  return int(floor(3.0+pow(2.0,3.0*random_from2d(vec2(i,n)))));
}

vec3 layer(vec2 st, float i){
  float z = pow(2.0, fract((u_time+i*interval)/cycle)*3.0)-1.0;
  st = (st-0.5)/z+0.5;

  vec3 color = vec3(0.0);
  color += star(st,pos(i,0.0),points(i,0.0),white);
  color += star(st,pos(i,1.0),points(i,1.0),grey);
  color += star(st,pos(i,2.0),points(i,2.0),green);
  color += star(st,pos(i,3.0),points(i,3.0),turquoise);
  color += star(st,pos(i,4.0),points(i,4.0),blue);
  color += star(st,pos(i,5.0),points(i,5.0),purple);
  color += star(st,pos(i,6.0),points(i,6.0),pink);
  color += star(st,pos(i,7.0),points(i,7.0),red);
  color += star(st,pos(i,8.0),points(i,8.0),orange);
  color += star(st,pos(i,9.0),points(i,9.0),yellow);
  return color;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  // color += layer(st, 1.0, 0.0*PI2);

  for(float i = 0.0;i < cycle/interval;i++){
    color += layer(st,i);
  }

  color.b = abs(color.b+0.05);
  gl_FragColor = vec4(color,1.0);
}