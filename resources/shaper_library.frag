#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//display shaper functions
float plot(vec2 st, float pct){
  return smoothstep(pct-0.02, pct, st.y) - smoothstep(pct, pct+0.02, st.y);
}

void main() {
	vec2 st = gl_FragCoord.st/u_resolution;

  //shaper function on st.x
  float y = sin(st.x*PI);

  vec3 color = vec3(y);
  float pct = plot(st, y);
  color = (1.0-pct)*color+pct*vec3(0.0,1.0,1.0);

	gl_FragColor = vec4(color,1.0);
}
