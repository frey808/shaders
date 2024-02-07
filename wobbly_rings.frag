#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform float u_time;
uniform vec2 u_resolution;

const float n_rings = 25;
const float min_r = 0.3;
const float max_r = 0.6;
const float brush = 0.005;
const float delay = 0.01; //must be less than 1.0/n_rings
const float randomness = 20.0;
const float distortion = 0.25;

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
  st = rotate(st,-wave);
  st = car2pol(st);
  // float warp = sin(st.x*5.0*PI2); //uniform warping
  float x = st.x*randomness;
  float warp = mix(fract(sin(floor(x))*1000.0), fract(sin(floor(step(x,randomness-1.0)*(x+1.0)))*1000.0), smoothstep(0.0,1.0,fract(x)))-0.5;
  float y = min_r+(max_r-min_r)*wave+warp*(0.5-abs(wave-0.5))*distortion;
  return step(st.y,y)*step(y-brush,st.y);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(st.x*st.y,st.y,1.0);
  
  float cycle = fract(u_time/3.0);
  float flag = step(fract(u_time/6.0),0.5);

  for(float i = 0.0;i < n_rings;i++){
    float offset = abs(cycle-delay*i);
    float wave = flag*offset+(1.0-flag)*(1.0-offset);
    float easing = smoothstep(0.2,0.8,wave);
    color += (1.0-color)*ring(st,easing);
  }

  gl_FragColor = vec4(color, 1.0);
}
