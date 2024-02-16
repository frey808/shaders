#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

const float n_bubbles = 12.0;
const vec3 bg = vec3(0.2,0.4,0.4);
const float interval = 3.0;

vec3 bubble(vec2 st, vec2 c, float r, vec3 color, float wave){
  float d = distance(st,c);
  r += wave*0.025;
  vec3 b = (1.0-bg)*(smoothstep(0.0,r,d)-step(r,d))*(0.25*(d/r));
  return step(r,d)*color+step(d,r)*(bg+b);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = bg;
  
  float cycle = fract(u_time/interval);
  float flag = step(fract(u_time/(interval*2.0)),0.5);
  float wave = flag*cycle+(1.0-flag)*(1.0-cycle);

  for(float i = 0.0;i < n_bubbles;i++){
    color = bubble(st,vec2(0.15,0.65),0.125,color,wave);
    color = bubble(st,vec2(0.8,0.95),0.1,color,wave);
    color = bubble(st,vec2(0.95,0.5),0.025,color,wave);
    color = bubble(st,vec2(0.5,0.6),0.025,color,wave);
    color = bubble(st,vec2(0.1,0.55),0.075,color,wave);
    color = bubble(st,vec2(0.25,0.85),0.05,color,wave);
    color = bubble(st,vec2(0.35,0.2),0.05,color,wave);
    color = bubble(st,vec2(0.7,0.15),0.05,color,wave);
    color = bubble(st,vec2(0.5,0.4),0.15,color,wave);
    color = bubble(st,vec2(0.45,0.0),0.1,color,wave);
    color = bubble(st,vec2(1.05,0.25),0.025,color,wave);
    color = bubble(st,vec2(0.05,0.05),0.125,color,wave);
    color = bubble(st,vec2(0.6,0.7),0.075,color,wave);
    color = bubble(st,vec2(0.1,1.0),0.075,color,wave);
    color = bubble(st,vec2(0.25,0.35),0.05,color,wave);
    color = bubble(st,vec2(0.3,0.15),0.025,color,wave);
    color = bubble(st,vec2(0.4,0.7),0.025,color,wave);
    color = bubble(st,vec2(0.55,0.95),0.1,color,wave);
    color = bubble(st,vec2(0.6,0.45),0.05,color,wave);
    color = bubble(st,vec2(0.7,1.0),0.025,color,wave);
    color = bubble(st,vec2(0.85,0.35),0.125,color,wave);
    color = bubble(st,vec2(0.9,0.8),0.075,color,wave);
    color = bubble(st,vec2(1.0,0.65),0.1,color,wave);
    color = bubble(st,vec2(0.95,0.1),0.1,color,wave);
  }

  gl_FragColor = vec4(color, 1.0);
}