#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(1.0);

  //moveble camera
  // vec2 m = u_mouse/u_resolution*0.5-0.25;
  // st = st*0.5+0.25+m;

  vec2 x1 = step(vec2(0.06,0.65),st)*step(st,vec2(0.08,1.0));
  float x2 = step(0.2,st.x)*step(st.x,0.22);
  float x3 = step(0.74,st.x)*step(st.x,0.76);
  float x4 = step(0.94,st.x)*step(st.x,0.96);
  float y1 = step(0.82,st.y)*step(st.y,0.85);
  float y2 = step(0.62,st.y)*step(st.y,0.65);
  vec2 y3 = step(vec2(0.2,0.08),st)*step(st,vec2(1.0,0.1));
  color = vec3(1.0-(x1.x*x1.y+x2+x3+x4+y1+y2+y3.x*y3.y));

  vec2 red = step(vec2(0.0,0.65),st)*step(st,vec2(0.2,1.0));
  color *= 1.0-(red.x*red.y)*(1.0-vec3(0.5,0.1,0.1));
  vec2 blue = step(vec2(0.74,0.0),st)*step(st,vec2(1.0,0.1));
  color *= 1.0-(blue.x*blue.y)*(1.0-vec3(0.2,0.3,0.6));
  vec2 yellow = step(vec2(0.95,0.65),st)*step(st,vec2(1.0));
  color *= 1.0-(yellow.x*yellow.y)*(1.0-vec3(0.9, 0.7, 0.2));
  color *= 1.0-floor(color.r*color.g*color.b)*(1.0-vec3(0.99,0.97,0.92));

  gl_FragColor = vec4(color,1.0);
}
