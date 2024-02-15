#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

const float rows = 5.0;

vec2 rotate2d(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;

  st *= rows;
  float odd_y = (step(1.0, mod(st.y,2.0))-0.5)*2.0;
  float odd_x = (step(1.0, mod(st.x,2.0))-0.5)*2.0;
  st.x += odd_y*smoothstep(0.0,0.5,fract(u_time*0.5));
  st.y += odd_x*smoothstep(0.5,1.0,fract(u_time*0.5));

  st = fract(st);
  st = rotate2d(st,odd_y*smoothstep(0.0,0.5,fract(u_time*0.5))*2.0*PI);
  st = rotate2d(st,odd_x*smoothstep(0.5,1.0,fract(u_time*0.5))*2.0*PI);

  vec3 color = vec3(0.0,step(distance(st,vec2(0.5)),0.3)*st);
  color.bg = abs(color.bg-0.15);

  gl_FragColor = vec4(color,1.0);
}