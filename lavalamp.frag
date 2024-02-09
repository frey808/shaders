#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float gradient_noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0) ),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),
      f-vec2(0.0,1.0)),dot(random2d(i+vec2(1.0,1.0)),
      f-vec2(1.0,1.0)),
      u.x
    ),
    u.y
  )*0.5+0.5;
}

float lavalamp(vec2 st){
  float pct = 0.0;
  float speed = u_time/10.0+10.0;
  for(float i = 0.0;i < 6;i++){
    pct += smoothstep(0.6-0.02*i,0.8,gradient_noise((10.0-i)*vec2(st.x,st.y*0.5-speed/(i+1.0))));
  }
  return smoothstep(0.5,0.55,pct);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec2 um = u_mouse/u_resolution;
  vec3 color = vec3(max(st.x,st.y)+(1.0-max(st.x,st.y))*0.15,(st.x*st.y+st.y)*0.5,st.y*st.x*0.5);
  color += (vec3(1.0,min(st.x*st.y+st.y,1.0),st.x*st.y)-color)*lavalamp(st);

  gl_FragColor = vec4(vec3(color), 1.0);
}