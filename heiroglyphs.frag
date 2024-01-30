#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(1.0,0.5,0.3);

  gl_FragColor = vec4(color,1.0);
}