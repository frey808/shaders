#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 6.283158530718

uniform vec2 u_resolution;

//convert color schemes
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

vec3 yuv2rgb(vec3 c){
  return c * mat3(
    1.0, 0.0, 1.13983,
    1.0, -0.39465, -0.58060,
    1.0, 2.03211, 0.0
  );
}

vec3 rgb2yuv(vec3 c){
  return c * mat3(
    0.2126, 0.7152, 0.0722,
    -0.09991, -0.33609, 0.43600,
    0.615, -0.5586, -0.05639
  );
}

//rotate coordinates
vec2 rotate(vec2 st, float a){
  st -= 0.5;
  st = mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  ) * st;
  st += 0.5;
  return st;
}

//scale coordinates
vec2 scale(vec2 st, vec2 s){
  return (st-0.5)/s+0.5;
}

vec2 scale_mat(vec2 st, vec2 s){
  return st*mat2(
    s.x,0.0,
    0.0,s.y
  );
}

//skew coordinates
vec2 equilateral_skew(vec2 st){
  return vec2(1.1547*st.x,st.y+0.5*1.1547*st.x);
}

//convert coordinates
vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

vec3 simplex_grid(vec2 st){
  vec3 xyz = vec3(0.0);
  vec2 p = fract(equilateral_skew(st));
  if(p.x > p.y) {
    xyz.xy = 1.0-vec2(p.x,p.y-p.x);
    xyz.z = p.y;
  }else{
    xyz.yz = 1.0-vec2(p.x-p.y,p.y);
    xyz.x = p.x;
  }
  return fract(xyz);
}

//draw polygon
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

//random number generation
float random(float x){
  return fract(sin(floor(x))*10000.0);
}

float random_from2d(vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

//noise generation
float noise1d(float x){
  return mix(fract(sin(floor(floor(x)))*10000.0), fract(sin(floor((floor(x) + 1.0)))*10000.0), smoothstep(0.,1.,fract(x)));
}

float value_noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
	vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(random2d(i+vec2(0.0,0.0)),random2d(i+vec2(1.0,0.0)),u.x),
    mix(random2d(i+vec2(0.0,1.0)),random2d(i+vec2(1.0,1.0)),u.x),
    u.y
  )*0.5+0.5;
}

float gradient_noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0) ),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),
      f-vec2(0.0,1.0)),dot(random2d(i+vec2(1.0,1.0)),
      f-vec2(1.0,1.0)),
      u.x
    ),
    u.y
  )*0.5+0.5;
}

//idek man
vec3 mod289(vec3 x){
  return x-floor(x*(1.0/289.0))*289.0;
}
vec2 mod289(vec2 x){
  return x-floor(x*(1.0/289.0))*289.0;
}
vec3 permute(vec3 x){
  return mod289(((x*34.0)+1.0)*x);
}

float simple_noise(vec2 v){
  const vec4 C = vec4(
    0.211324865405187,
    // (3.0-sqrt(3.0))/6.0,
    0.366025403784439,
    // 0.5*(sqrt(3.0)-1.0),
    -0.577350269189626,
    // -1.0 + 2.0 * C.x,
    0.024390243902439
    // 1.0 / 41.0
  );

  // First corner (x0)
  vec2 i  = floor(v+dot(v,C.yy));
  vec2 x0 = v-i+dot(i,C.xx);

  // Other two corners (x1, x2)
  vec2 i1 = vec2(0.0);
  i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec2 x1 = x0.xy+C.xx-i1;
  vec2 x2 = x0.xy+C.zz;

  // Do some permutations to avoid truncation effects in permutation
  i = mod289(i);
  vec3 p = permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5-vec3(
    dot(x0,x0),
    dot(x1,x1),
    dot(x2,x2)
  ),0.0);
  m = m*m ;
  m = m*m ;

  // Gradients: 41 pts uniformly over a line, mapped onto a diamond
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
  vec3 x = 2.0*fract(p*C.www)-1.0;
  vec3 h = abs(x)-0.5;
  vec3 ox = floor(x+0.5);
  vec3 a0 = x-ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt(a0*a0 + h*h);
  m *= 1.79284291400159-0.85373472095314*(a0*a0+h*h);

  // Compute final noise value at P
  vec3 g = vec3(0.0);
  g.x = a0.x*x0.x+h.x*x0.y;
  g.yz = a0.yz*vec2(x1.x,x2.x)+h.yz*vec2(x1.y,x2.y);
  return 130.0*dot(m, g)*0.5+0.5;
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
