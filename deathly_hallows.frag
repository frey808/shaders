#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float brush = 0.015;
const float radius = 0.4;
const vec2 offset = vec2(0.0,-0.0625);

float polygon(in vec2 st, vec2 c, float n){
  st = (st-c);
  float a = atan(st.x,st.y)+PI;
  float r = 2.0*PI/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

float box(vec2 st, vec2 bl, vec2 tr){
  vec2 uv = step(bl,st)*step(st,tr);
  return uv.x*uv.y;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;

  st -= offset;
  float cloak = step(radius,polygon(st, vec2(0.5), 3.0))+step(polygon(st, vec2(0.5), 3.0),radius-brush*2.0);
  float stone = step(radius/2.0, distance(st,vec2(0.5)))+step(distance(st,vec2(0.5)),radius/2.0-brush);
  float wand = 1.0-box(st, vec2(0.5-brush*0.5,0.5-radius/2.0), vec2(0.5+brush*0.5,0.5+radius-brush));
  vec3 color = wand*stone*cloak == 1.0 ? vec3(1.0,0.8,0.4) : vec3(1.0,0.4,0.2);

  gl_FragColor = vec4(color, 1.0);
}