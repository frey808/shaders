#ifdef GL_ES
precision mediump float;
#endif

// uniform float u_time;
const float u_time = 1.25;
uniform vec2 u_resolution;

#define PI 3.14159265359
#define PI2 6.283158530718

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st, float loop){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);

  float next = 1.0-loop*step(loop-1.0,st.x);

  return mix(
    mix(
      dot(random2d(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
      dot(random2d(i+vec2(next,0.0)),f-vec2(1.0,0.0)),
      u.x
    ),
    mix(
      dot(random2d(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
      dot(random2d(i+vec2(next,1.0)),f-vec2(1.0,1.0)),
      u.x
    ),
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

vec2 car2pol(vec2 st){
  vec2 tc = vec2(0.5)-st;
  float a = (atan(tc.y,tc.x)+PI)/PI2;
  float radius = length(tc)*2.0;
  return vec2(a, radius);
}

float polygon(in vec2 st, float n){
  st -= 0.5;
  float a = atan(st.x,st.y)+PI;
  float r = 2.0*PI/float(n);
  return fract((cos(floor(0.5+a/r)*r-a)*length(st)*2.0)-u_time*0.5);
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

float band(vec2 st, vec3 b){
  return (smoothstep(b.x,b.y,polygon(st,4.0))-smoothstep(b.y,b.z,polygon(st,4.0)));
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

vec3 sun(vec2 st){
  st = car2pol(st);
  float orb = smoothstep(0.1,0.05,st.y);
  float glow = smoothstep(1.0,0.0,st.y)*0.25;
  st.x *= 50.0;
  float rays = noise(vec2(st.x,u_time),50.0)/st.y;
  float sun = min(1.0,orb+glow+rays/5.0);
  return vec3(1.0,1.0,0.5)*sun;
}

vec3 lavalamp(vec2 st){
  float pct = 0.0;
  float speed = u_time/10.0+10.0;
  for(float i = 0.0;i < 6.0;i++){
    pct += smoothstep(0.55-0.02*i,0.8,gradient_noise((25.0-i)*vec2(st.x,st.y*0.5-speed/(i+1.0))));
  }
  return vec3(1.2, 0.3, 0.15)*step(0.5,pct)+vec3(1.0,0.9,0.0)*smoothstep(0.4,0.5,pct)-step(0.5,pct);
}

float smoke(vec2 st){
  vec2 drift = vec2(-cos(u_time*PI*0.01),sin(u_time*PI*0.01))*300.0;
  st = rotate2d(st,u_time*PI*0.01-0.5);
  float clouds = 0.0;
  clouds += noise(st*8.0+drift/10.0)/2.0;
  clouds += noise(st*16.0+drift/20.0)/4.0;
  clouds += noise(st*32.0+drift/30.0)/8.0;
  clouds += noise(st*64.0+drift/40.0)/16.0;
  clouds += noise(st*128.0-drift/50.0)/32.0;
  clouds *= smoothstep(0.45,0.6,clouds);
  return clouds;
}

vec3 kaleidoscope(vec2 st){
  st = fract(15.0*st);
  st = rotate2d(st,PI*0.25);
  return band(st,vec3(0.45,0.5,0.7))*vec3(0.3,0.5,0.2) +
    band(st,vec3(0.6,0.85,0.85))*vec3(0.5,0.3,0.2) +
    band(st,vec3(0.7,0.9,0.95))*vec3(0.5,0.5,0.1) +
    band(st,vec3(0.9,1.0,1.0))*vec3(0.3,0.5,0.7);
}

vec3 ripples(vec2 st){
  return vec3(0.8,0.9,0.8)*smoothstep(0.1,-0.0,abs(simple_noise(st*-vec2(3.0,18.0)-vec2(u_time*0.1,0.0))-0.5))*0.3 +
    vec3(0.9,1.0,0.9)*smoothstep(0.5,-0.5,abs(simple_noise(st*vec2(3.0,18.0)+vec2(u_time*0.11,0.0))-0.5))*0.6;
}

float box(vec2 st, vec2 wh, vec2 xy){
  st += vec2(0.5)-xy;
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);

  //background
  color += vec3(0.4,0.2,0.4)*(1.0-box(st,vec2(1.6/3.0,0.2),vec2(0.5)));
  color += sun(st)*(1.0-box(st,vec2(1.6/3.0,0.2),vec2(0.5)))*0.75;
  st = st*1.5-0.25;

  //outline
  color += (1.0-color)*box(st,vec2(0.81,0.31),vec2(0.5))*(1.0-box(st,vec2(0.79,0.29),vec2(0.5)));
  color += (1.0-color)*box(st,vec2(0.01,0.31),vec2(0.5));
  color += (1.0-color)*box(st,vec2(0.01,0.31),vec2(0.3,0.5));
  color += (1.0-color)*box(st,vec2(0.01,0.31),vec2(0.7,0.5));
  
  //letter n
  color += vec3(0.4, 0.0, 0.0)*box(st,vec2(0.2,0.3),vec2(0.2,0.5));
  color += (1.0-color)*lavalamp(st)*box(st,vec2(0.19,0.29),vec2(0.2,0.5))*0.5;
  color += (1.0-color)*box(st,vec2(0.01,0.11),vec2(0.1+1.0/15,0.4));
  color += (1.0-color)*box(st,vec2(0.01,0.11),vec2(0.1+2.0/15.0,0.6));
  
  //letter o
  color += vec3(0.5,0.3,0.1)*box(st,vec2(0.2,0.3),vec2(0.4,0.5));
  color += (vec3(2.0,1.8,1.4)-color)*smoke(st)*box(st,vec2(0.2,0.3),vec2(0.4,0.5))*0.75;
  color += (1.0-color)*box(st,vec2(0.01,0.11),vec2(0.4,0.5));
  
  //letter a
  color += vec3(0.0, 0.4, 0.2)*box(st,vec2(0.2,0.3),vec2(0.6,0.5));
  color += kaleidoscope(st)*box(st,vec2(0.2,0.3),vec2(0.6,0.5))*0.25;
  color += (1.0-color)*box(st,vec2(0.01,0.11),vec2(0.6,0.4));
  color += (1.0-color)*box(st,vec2(0.01,0.06),vec2(0.6,0.55));
  
  //letter h
  color += vec3(0.0,0.2,0.5)*box(st,vec2(0.2,0.3),vec2(0.8,0.5));
  color += ripples(st)*0.5*box(st,vec2(0.2,0.3),vec2(0.8,0.5));
  color += (1.0-color)*box(st,vec2(0.01,0.31),vec2(0.8,0.5))*(1.0-box(st,vec2(0.01,0.09),vec2(0.8,0.5)));

  //center
  color += (1.0-color)*box(st,vec2(0.0,1.0),vec2(0.5));

  gl_FragColor = vec4(color, 1.0);
}