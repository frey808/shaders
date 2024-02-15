#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

vec3 hsb2rgb(in vec3 c){
  vec3 rgb = clamp(
    abs(
      mod(
        c.x*6.0+vec3(0.0,4.0,2.0),
        6.0
      )-3.0
    )-1.0,
    0.0,
    1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

vec2 car2pol(in vec2 st){
  vec2 toCenter = vec2(0.5)-st;
  float angle = (atan(toCenter.y,toCenter.x)+PI)/(2.0*PI);
  float radius = length(toCenter)*2.0;
  return vec2(angle, radius);
}

float plot(float axis, float pct){
  if(axis-pct > 0.93 || axis-pct < -0.93){
    axis = 1.0-axis;
  }
  return smoothstep(pct-0.1, pct, axis) - smoothstep(pct, pct+0.1, axis);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;

  st = car2pol(st);

  float x = fract(5.0*st.y-u_time);
  float pct = plot(st.x, x);

  vec3 rainbow = hsb2rgb(vec3(fract(u_time-st.y*3.0), 1.0, 1.0));
  vec3 color = vec3(pct * rainbow);
  
  gl_FragColor = vec4(color,1.0);
}
