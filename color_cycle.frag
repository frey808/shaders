#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0;

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

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  vec3 color = vec3(1.0);
  vec4 image = texture2D(u_tex0, st);

  vec3 hsb_image = rgb2hsb(image.rgb);
  hsb_image.r = mod(hsb_image.r+u_time, 1.0);
  image.rgb = hsb2rgb(hsb_image);

  gl_FragColor = vec4(image);
}
