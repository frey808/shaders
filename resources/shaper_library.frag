#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//sine arc
  // sin(st.x*PI);

//coiling lines
  // mod(9.0*st.x, 1.0);

void main() {
	vec2 st = gl_FragCoord.st/u_resolution;

  //shaper function on st.x
  float y = mod(9.0*st.x, 1.0);

  vec3 color = vec3(y);
  float pct = smoothstep(y-0.02, y, st.y) - smoothstep(y, y+0.02, st.y);
  color = (1.0-pct)*color+pct*vec3(0.0,1.0,1.0);

	gl_FragColor = vec4(color,1.0);
}
