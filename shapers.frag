#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//sine arc
  // float x = st.x;
  // float y = sin(x*PI);

//coiling lines
  // float x = st.x*10.0;
  // float y = fract(x);

//impulse
  // float x = st.x*10.0;
  // float y = x*exp(1.0-x);

//random
  // float x = st.x;
  // float y = fract(sin(floor(x))*10000.0);

//jagged noise
  // float x = st.x*10.0;
  // float y = mix(fract(sin(floor(x))*10000.0), fract(sin(floor(x) + 1.0)*10000.0), fract(x));

//random
  // float x = st.x*10.0;
  // float y = mix(fract(sin(floor(floor(x)))*10000.0), fract(sin(floor((floor(x) + 1.0)))*10000.0), smoothstep(0.,1.,fract(x)));

void main() {
	vec2 st = gl_FragCoord.st/u_resolution;

  //shaper function on st.x
  float x = st.x*10.0;
  float y = mix(fract(sin(floor(floor(x)))*10000.0), fract(sin(floor((floor(x) + 1.0)))*10000.0), smoothstep(0.,1.,fract(x)));

  float line = smoothstep(y-0.02,y,st.y)-smoothstep(y,y+0.02,st.y);
  vec3 color = line*vec3(0.0,1.0,1.0);

	gl_FragColor = vec4(color,1.0);
}
