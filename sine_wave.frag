#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

const float n_bars = 25.0; //will only work with odd numbers
const float space_between = 0.01;
const float max_h = 0.7;
const float min_h = 0.1;

float bar(vec2 st, vec2 wh){
  float radius = wh.x*0.5;
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  float top = 1.0-(step(1.0-(wh.y+radius),st.y)*step(radius,distance(st,vec2(0.5,1.0-(wh.y+radius)))));
  float bottom = 1.0-(step(st.y,wh.y+radius)*step(radius,distance(st,vec2(0.5,wh.y+radius))));
  return uv.x*uv.y*top*bottom;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(st,1.0);

  float cycle = fract(u_time/3.0);
  float flag = step(mod(u_time/3.0,2.0),1.0);
  float mid = floor(n_bars/2.0);

  st.x += (1.0/n_bars)*mid;
  for(float i = 0.0;i < n_bars;i++){
    float offset = 0.5+fract(cycle+i/n_bars)*2.0;
    float opacity = 0.5+0.5*(1.0+floor(-abs(mid-i)/n_bars));
    color += (1.0-color)*opacity*bar(st,vec2(1.0/n_bars-space_between,mix(min_h,max_h,((sin(offset*PI)+1.0)/2.0)*(max_h-min_h)+min_h)));
    st.x -= (1.0/n_bars);
  }

  gl_FragColor = vec4(color, 1.0);
}