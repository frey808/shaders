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

vec3 sun(vec2 st){
  float glow = smoothstep(0.8,1.5,st.y);
  st.x *= 25.0;
  float rays = noise(vec2(st.x,u_time))*(st.y-0.5);
  float sun = min(1.0,glow+rays);
  return vec3(1.0,1.0,0.5)*sun;
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(1.0);
  vec4 image = texture2D(u_tex0, st);

  image.rgb += sun(st);
  // image.rgb += (1.0-st.y*step(image.b,max(image.r,image.g)))*sun(st);

  gl_FragColor = vec4(1.2*image);
}
