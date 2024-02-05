#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

const float n_bars = 25.0; //will only work with odd numbers
const float space_between = 0.01;
const float max_h = 0.6;
const float min_h = 0.2;
const float u_in = 0.5;
const float u_ex = 0.5;

float box(vec2 st, vec2 wh){
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  float mid = floor(n_bars/2.0);
  float u_wave = fract(u_time/3.0);
  float u_flag = step(mod(u_time/3.0,2.0),1.0);
  float cycle = u_flag*u_wave*u_in+(1.0-u_flag)*u_wave*u_ex;
  
  float spacing = 1.0/(n_bars+1.0);
    st.x += spacing*mid;
    for(float i = 0.0;i < n_bars;i++){
      float order = i-mid+n_bars*step(i,mid);
      float phase = fract(cycle+i/n_bars);
      float w = u_flag*u_in+(1.0-u_flag)*u_ex;
      float skew = ((0.5+phase/w)*step(phase,w)+(1.5+(phase-w)/(1.0-w))*step(w,phase))*(1.0-u_flag*2.0);
      float h = ((sin(skew*PI)+1.0)/2.0)*(max_h-min_h)+min_h;
      color += box(st,vec2(1.0/n_bars-space_between,mix(min_h,max_h,h)));
      st.x -= spacing;
    }

  gl_FragColor = vec4(color, 1.0);
}