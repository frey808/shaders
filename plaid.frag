#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float stripe(vec2 st, vec2 b, float o){
  return (step(b.s,st.x)-step(b.t,st.x))*o+
    (step(1.0-b.t,st.x)-step(1.0-b.s,st.x))*o+
    (step(b.s,st.y)-step(b.t,st.y))*o+
    (step(1.0-b.t,st.y)-step(1.0-b.s,st.y))*o;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  st = fract(3.0*st);
  color.rb += stripe(st, vec2(0.43,0.5),0.3);
  color.b += stripe(st, vec2(0.28,0.3),0.4);
  color.b += stripe(st, vec2(0.18,0.2),0.4);
  color.bg += stripe(st, vec2(0.0,0.03),0.2);
  color.g += stripe(st, vec2(0.05,0.06),0.3);
  color.g += stripe(st, vec2(0.4,0.41),0.3);

  gl_FragColor = vec4(color, 1.0);
}