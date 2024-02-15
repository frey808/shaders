#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

const float n_rings = 5.0;
const float brush = 0.005;
const float delay = 0.05;
const float interval = 2.0;

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);

  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
      dot(random2d(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),
      u.x
    ),
    u.y
  )*0.5+0.5;
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

float ring(vec2 st, float wave, float s){
  st.y = st.y*3.0-1.0+wave*0.5;
  st = (st-0.5)/s+0.5;
  float d = distance(st,vec2(0.5));
  float scale_brush = brush*(1.0-cos((st.x/0.6+0.2)*PI));
  return smoothstep(0.3-0.005/s,0.3,d)-smoothstep(0.3+scale_brush/s,(0.3+0.005/s)+scale_brush/s,d);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.4-st.x*0.2,0.5+st.y*0.2,1.0-st.x*0.2);
  
  float cycle = fract(u_time/interval);
  float flag = step(fract(u_time/(interval*2.0)),0.5);

  for(float i = 0.0;i < n_rings;i++){
    float offset = abs(cycle-delay*i);
    float wave = flag*offset+(1.0-flag)*(1.0-offset);
    float easing = smoothstep(0.975,0.025,wave);
    color += (1.0-color)*ring(st,easing*1.5-0.75,(i+1.0)*0.15);
  }

  vec2 drift = vec2(-cos(u_time*PI*0.01),sin(u_time*PI*0.01))*300.0;
  st = rotate(st,u_time*PI*0.01-0.5);

  float clouds = 0.0;
  clouds += noise(st*4.0+drift/10.0)/2.0;
  clouds += noise(st*8.0+drift/20.0)/4.0;
  clouds += noise(st*16.0+drift/30.0)/8.0;
  clouds += noise(st*32.0+drift/40.0)/16.0;
  clouds += noise(st*64.0-drift/50.0)/32.0;

  clouds *= smoothstep(0.4,0.6,clouds);
  color = mix(color,vec3(1.0),clouds);

  gl_FragColor = vec4(color, 1.0);
}