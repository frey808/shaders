#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359
#define PI2 6.283158530718

uniform sampler2D u_tex0;

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);

  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
      dot(random2d(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),
      u.x
    ),
    u.y
  )*0.5+0.5;
}


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

vec3 sun(vec2 st){
  float glow = smoothstep(0.5,1.5,st.y);
  st.x *= 25.0;
  float rays = noise(vec2(st.x,u_time))*(max(0.0,st.y-0.2));
  float sun = min(1.0,glow+rays);
  return vec3(1.0,1.0,0.5)*sun;
}

vec3 ripples(vec2 st, vec3 color){
  return (vec3(0.8,0.9,0.8)-color)*smoothstep(0.1,-0.0,abs(simple_noise(st*-vec2(3.0,18.0))-0.5))*0.3 +
    (vec3(0.9,1.0,0.9)-color)*smoothstep(0.5,-0.5,abs(simple_noise(st*vec2(3.0,18.0))-0.5))*0.6;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(1.0);
  vec4 image = texture2D(u_tex0, st);

  image.rgb += step(abs(image.r-0.4),0.05)*step(abs(image.g-0.6),0.05)*(1.0-st.y)*ripples(st,image.rgb);
  // image.rgb += sun(st)*0.5;
  // image.rgb += (1.0-st.y*step(image.b,max(image.r,image.g)))*sun(st);

  gl_FragColor = vec4(0.95*image);
}
