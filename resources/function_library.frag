#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//convert hsb to rgb color
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

//convert rgb to hsb color
vec3 rgb2hsb(in vec3 c){
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(
    vec4(c.bg, K.wz),
    vec4(c.gb, K.st),
    step(c.b, c.g));
  vec4 q = mix(
    vec4(p.xyw, c.r),
    vec4(c.r, p.yzx),
    step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(
    abs(q.z + (q.w - q.y) / (6.0 * d + e)),
    d / (q.x + e),
    q.x
  );
}

//convert cartesian to polar coords
vec2 car2pol(in vec2 st){
  vec2 toCenter = vec2(0.5)-st;
  float angle = (atan(toCenter.y,toCenter.x)+PI)/(2.0*PI);
  float radius = length(toCenter)*2.0;
  return vec2(angle, radius);
}

void main() {
	vec2 st = gl_FragCoord.st/u_resolution;
  //map functions:
  // st = car2pol(st);

  vec3 color = hsb2rgb(vec3(st, 1.0));
  //color functions:
  // color = rgb2hsb(color);

	gl_FragColor = vec4(color,1.0);
}
