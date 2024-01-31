#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

float polygon(in vec2 st, float n){
  st -= 0.5;
  float a = atan(st.x,st.y)+PI;
  float r = 2.0*PI/float(n);
  return fract((cos(floor(0.5+a/r)*r-a)*length(st)*2.0)-u_time*0.5);
}

vec2 rotate2d(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

float band(vec2 st, vec3 b){
  return (smoothstep(b.x,b.y,polygon(st,4.0))-smoothstep(b.y,b.z,polygon(st,4.0)));
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  st = fract(10.0*st);
  st = rotate2d(st,PI*0.25);
  color += band(st,vec3(0.0,0.1,0.2))*vec3(0.6,0.4,0.9);
  color += band(st,vec3(0.1,0.3,0.4))*vec3(0.1,0.3,0.4);
  color += band(st,vec3(0.35,0.45,0.45))*vec3(0.5,0.1,0.6);
  color += band(st,vec3(0.45,0.5,0.7))*vec3(0.3,0.5,0.2);
  color += band(st,vec3(0.6,0.85,0.85))*vec3(0.5,0.3,0.2);
  color += band(st,vec3(0.7,0.9,0.95))*vec3(0.5,0.5,0.1);
  color += band(st,vec3(0.9,1.0,1.0))*vec3(0.3,0.5,0.7);

  gl_FragColor = vec4(color, 1.0);
}