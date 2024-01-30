#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float pulse(float x, float k){
  return x*k*exp(1.0-x*k);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(0.0);

  vec3 display = vec3(0.0,0.7,0.3);
  float t = fract(u_time*0.75);
  float p = pulse(t,12.0);
  color += smoothstep(0.1+p*0.1,0.0,distance(st,vec2(0.7,0.2)))*display;
  
  float x = st.x > 0.3 ? 0.6+pulse(st.x-0.3,12.0)*0.1*p : 0.6-pulse(0.3-st.x,12.0)*0.1*p;
  color += (smoothstep(x-0.02,x,st.y)-smoothstep(x,x+0.02,st.y))*display;

  gl_FragColor = vec4(color, 1.0);
}