#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec2 car2pol(in vec2 st){
  vec2 toCenter = vec2(0.5)-st;
  float angle = (atan(toCenter.y,toCenter.x)+PI)/(2.0*PI);
  float radius = length(toCenter)*2.0;
  return vec2(angle, radius);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st = car2pol(st);

  float y = 0.1+pow(fract(st.x*5.0)-0.5,2.9);
  float line = smoothstep(y-0.02,y,st.y)-smoothstep(y,y+0.02,st.y);
  vec3 color = vec3(line);

  gl_FragColor = vec4(color, 1.0);
}