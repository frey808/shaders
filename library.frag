#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;

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
  vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(
    vec4(c.bg, k.wz),
    vec4(c.gb, k.st),
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

//yuv to rgb matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
  1.0, -0.39465, -0.58060,
  1.0, 2.03211, 0.0
);

//rgb to yuv matrix
mat3 rgb2yuv = mat3(
  0.2126, 0.7152, 0.0722,
  -0.09991, -0.33609, 0.43600,
  0.615, -0.5586, -0.05639
);

//convert cartesian to polar coords
vec2 car2pol(in vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/(2.0*PI);
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

//polygon shaped distance from center
float place_polygon(in vec2 st, vec2 c, float n){
  st = (st-c);
  float a = atan(st.x,st.y)+PI;
  float r = 2.0*PI/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

float polygon(in vec2 st, float n){
  float a = atan(st.x,st.y)+PI;
  float r = 2.0*PI/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

//draw boxes
float place_box(vec2 st, vec2 bl, vec2 tr){
  vec2 uv = step(bl,st)*step(st,tr);
  return uv.x*uv.y;
}

float box(vec2 st, vec2 wh){
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
}

//dot product circle
float circle(in vec2 st, vec2 c, float r){
  vec2 dist = st-c;
	return 1.0-smoothstep(
    r-(r*0.01),
    r+(r*0.01),
    dot(dist,dist)*4.0
  );
}

//rotating matrices
mat2 rotate_mat(float a){
  return mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  );
}

vec2 rotate2d(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

//scaling matrices
mat2 scale_mat(vec2 scale){
  return mat2(
    scale.x,0.0,
    0.0,scale.y
  );
}

vec2 scale(vec2 st, vec2 scale){
  st -= 0.5;
  st = mat2(
    scale.x,0.0,
    0.0,scale.y
  ) * st;
  st += 0.5;
  return st;
}

//multiply space into a grid
vec2 tile(vec2 st, float dim){
    st *= dim;
    return fract(st);
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
