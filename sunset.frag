#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359
#define PI2 6.283158530718

vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

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

float sun(vec2 st){
  st.y += 0.1;
  st = (st-0.5)/0.7+0.5;
  st = car2pol(st);
  float orb = smoothstep(0.1,0.05,st.y);
  float glow = smoothstep(1.0,0.0,st.y)*0.25;
  float rays = noise(vec2(st.x*50.0,u_time),50.0)/st.y;
  return min(1.0,orb+glow+rays/5.0);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;

  vec3 color = vec3((1.5-st.y), 0.5, st.y);
  float ripples = noise(vec2(st.x*25.0,u_time),25.0)/30.0;
  color += step(st.y,0.35+ripples)*(-color+vec3(0.0,0.1,0.3));
  color += (1.0-color)*sun(st);

  gl_FragColor = vec4(color, 1.0);
}