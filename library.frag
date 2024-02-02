#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform vec2 u_resolution;

//convert hsb to rgb color
vec3 hsb2rgb(vec3 c){
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
vec3 rgb2hsb(vec3 c){
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
vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

//polygon shaped distance from center
float place_polygon(vec2 st, vec2 c, float n){
  st = (st-c);
  float a = atan(st.x,st.y)+PI;
  float r = PI2/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

float polygon(vec2 st, float n){
  st -= 0.5;
  float a = atan(st.x,st.y)+PI;
  float r = PI2/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(st)*2.0;
}

//draw boxes
float box(vec2 st, vec2 wh){
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
}

float place_box(vec2 st, vec2 bl, vec2 tr){
  vec2 uv = step(bl,st)*step(st,tr);
  return uv.x*uv.y;
}

//draw polygram
float polygram(vec2 st, int n){
  st = car2pol(st);
  float y = 0.1+pow(fract(st.x*float(n))-0.5,2.9);
  return step(st.y,y);
}

float place_polygram(vec2 st, vec2 c, int n){
  st -= c-0.5;
  st = car2pol(st);
  float y = 0.1+pow(fract(st.x*float(n))-0.5,2.9);
  return step(st.y,y);
}

//draw circle
float cirlce(vec2 st){
  return distance(st,vec2(0.5));
}

float place_cirlce(vec2 st, vec2 c){
  return distance(st,c);
}

float circle_dot(vec2 st, vec2 c, float r){
  vec2 dist = st-c;
	return 1.0-smoothstep(
    r-(r*0.01),
    r+(r*0.01),
    dot(dist,dist)*4.0
  );
}

//rotating coordinates
mat2 rotate_mat(float a){
  return mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  );
}

vec2 rotate(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

//scaling coordinates
vec2 scale(vec2 st, vec2 s){
  return (st-0.5)/s+0.5;
}

mat2 scale_mat(vec2 scale){
  return mat2(
    scale.x,0.0,
    0.0,scale.y
  );
}

//random number generation
float random(float x){
  return fract(sin(floor(x))*10000.0);
}

float random1_2d(vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

//noise generation
float noise_jagged(float x){
  return mix(fract(sin(floor(x))*10000.0), fract(sin(floor(x) + 1.0)*10000.0), fract(x));
}

float noise_wavy(float x){
  return mix(fract(sin(floor(floor(x)))*10000.0), fract(sin(floor((floor(x) + 1.0)))*10000.0), smoothstep(0.,1.,fract(x)));
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
