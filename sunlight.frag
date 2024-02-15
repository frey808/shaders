#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359
#define PI2 6.283158530718

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st, float loop){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);

  float next = 1.0-loop*step(loop-1.0,st.x);

  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(next,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
      dot(random2d(i+vec2(next,1.0)),f-vec2(1.0,1.0)),
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

vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

vec3 sun(vec2 st){
  st += vec2(fract(u_time/100.0)*1.8-0.9,fract(u_time/100.0)*0.6-0.3);
  st = (st-0.5)/0.7+0.5;
  st = car2pol(st);
  float orb = smoothstep(0.1,0.05,st.y);
  float glow = smoothstep(1.0,0.0,st.y)*0.25;
  st.x *= 50.0;
  float rays = noise(vec2(st.x,u_time),50.0)/st.y;
  float sun = min(1.0,orb+glow+rays/5.0);
  return vec3(1.0,1.0,0.5)*sun;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.4-st.x*0.2,0.5+st.y*0.2,1.0-st.x*0.2);

  color += (1.0-color)*sun(st);

  vec2 drift = vec2(-cos(u_time*PI*0.01),sin(u_time*PI*0.01))*300.0;
  st = rotate(st,u_time*PI*0.01-0.5);

  float clouds = 0.0;
  clouds += noise(st*4.0+drift/10.0,0.0)/2.0;
  clouds += noise(st*8.0+drift/20.0,0.0)/4.0;
  clouds += noise(st*16.0+drift/30.0,0.0)/8.0;
  clouds += noise(st*32.0+drift/40.0,0.0)/16.0;
  clouds += noise(st*64.0-drift/50.0,0.0)/32.0;

  clouds *= smoothstep(0.3,0.7,clouds);
  color = mix(color,vec3(1.0),clouds);

  gl_FragColor = vec4(color, 1.0);
}