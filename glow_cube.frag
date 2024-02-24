#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform float u_time;
uniform vec2 u_resolution;

float polygon(vec2 st, float n){
  st -= 0.5;
  float a = atan(st.x,st.y)+PI;
  float r = PI2/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

float box(vec2 st, vec2 wh){
  st.x -= 0.086;
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
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

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  st = rotate((st-0.5)/(sin(u_time)/8.0+1.0)+0.5,u_time/3.0);

  color += 1.0-smoothstep(-0.2,0.5,distance(st,vec2(0.5)));
  float d = polygon(st,6.0);
  color += step(d,0.3);
  color *= 1.0-box(st,vec2(0.172,0.005));
  color *= 1.0-box(rotate(st,2.0*PI/3.0),vec2(0.172,0.005));
  color *= 1.0-box(rotate(st,4.0*PI/3.0),vec2(0.172,0.005));

  gl_FragColor = vec4(color, 1.0);
}