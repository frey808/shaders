#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.st/u_resolution;
  float x;
  float y;

//sine curve
  // x = st.x;
  // y = sin(x*PI);

//cubic hermite curve
  // x = st.x;
  // y = x*x*(3.0-2.0*x);

//quintic interpolation curve
  x = st.x;
  y = x*x*x*(x*(x*6.-15.)+10.);

//coiling lines
  // x = st.x*10.0;
  // y = fract(x);

//impulse
  // x = st.x*10.0;
  // y = x*exp(1.0-x);

//random
  // x = st.x;
  // y = fract(sin(floor(x))*10000.0);

//artifact noise
  // x = st.x*10.0;
  // y = fract(sin(floor(x))*10000.0);

//jagged noise
  // x = st.x*10.0;
  // y = mix(fract(sin(floor(x))*10000.0), fract(sin(floor(x) + 1.0)*10000.0), fract(x));

//smoothstep noise
  // x = st.x*10.0;
  // y = mix(fract(sin(floor(floor(x)))*10000.0), fract(sin(floor((floor(x) + 1.0)))*10000.0), smoothstep(0.,1.,fract(x)));

  float line = smoothstep(y-0.02,y,st.y)-smoothstep(y,y+0.02,st.y);
  vec3 color = line*vec3(0.0,1.0,1.0);

	gl_FragColor = vec4(color,1.0);
}
