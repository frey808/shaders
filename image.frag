#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0;

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(1.0);
  vec4 image = texture2D(u_tex0, st);

  gl_FragColor = vec4(image);
}
