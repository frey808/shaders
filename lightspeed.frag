#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform float u_time;
uniform vec2 u_resolution;

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

vec2 rotate2d(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

vec2 car2pol(in vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

vec3 star(vec2 st, vec2 c, float a, int n, vec3 color){
  st -= c-0.5;
  st = (st-0.5)/0.05+0.5;
  st = rotate2d(st,a);
  st = car2pol(st);
  
  float y = 0.1+pow(fract(st.x*float(n))-0.5,2.9);
  return smoothstep(y+0.15,y,st.y)*color+smoothstep(y+0.05,y-0.05,st.y)*(1.0-color);
}

vec3 layer(vec2 st, float z, float a){
  st = (st-0.5)/z+0.5;
  st = rotate2d(st,a);

  float q = PI2-a;
  vec3 color = vec3(0.0);
  color += star(st,vec2(0.2,0.4),q,5,white);
  color += star(st,vec2(0.5,0.2),q,4,grey);
  color += star(st,vec2(0.9,0.6),q,6,green);
  color += star(st,vec2(0.6,0.5),q,4,turquoise);
  color += star(st,vec2(0.1,0.1),q,5,blue);
  color += star(st,vec2(0.7,0.8),q,4,purple);
  color += star(st,vec2(0.9,0.1),q,5,pink);
  color += star(st,vec2(0.4,0.7),q,12,red);
  color += star(st,vec2(0.1,0.6),q,4,orange);
  color += star(st,vec2(0.3,0.9),q,5,yellow);
  return color;
}

float zoom(float i){
  return pow(2.0, fract((u_time+i)/5.0)*3.0)-1.0;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  // color += layer(st, 1.0, 0.0*PI2);

  for(float i = 0.0;i < 10.0;i++){
    color += layer(st, zoom(i*0.5), fract(i*0.7)*PI2);
  }

  color.b = abs(color.b+0.15);
  gl_FragColor = vec4(color, 1.0);
}