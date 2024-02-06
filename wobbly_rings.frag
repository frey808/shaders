#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform float u_time;
uniform vec2 u_resolution;

const float brush = 0.01;

vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

vec2 rotate(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

float ring(vec2 st, float wave){
  st = rotate(st,sin((wave-0.5)*PI)*2.0);
  st = car2pol(st);
  float y = 0.5+sin(st.x*7.0*PI2)*0.05*(wave*2.0-1.0);
  return step(st.y,y)*step(y-brush,st.y);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(st.x*1.3,1.0,st.y*1.3);
  
  float u_wave = 1.0-abs(fract(u_time/6.0)-0.5)*2.0;
  float u_flag = step(fract(u_time/6.0),0.5);

  color += (vec3(st,1.0)-color)*ring(st,u_wave);

  gl_FragColor = vec4(color, 1.0);
}
