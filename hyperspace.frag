#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float random_from2d(vec2 st){
  return fract(sin(st.x*124.0+st.y*215.0)*21412.0);
}

vec2 random2d(vec2 st){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return fract(sin(st)*43758.5453123);
}
  
float loop_noise(vec2 st, float loop) {
  st *= loop;
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  float nx = 1.0 - loop * step(loop - 1.0, st.x);
  float ny = 1.0 - loop * step(loop - 1.0, st.y);
  
  return mix(
    mix(random_from2d(i + vec2(0.0, 0.0)), random_from2d(i + vec2(nx, 0.0)), u.x),
    mix(random_from2d(i + vec2(0.0, ny)), random_from2d(i + vec2(nx, ny)), u.x),
    u.y
  );
}

float box(vec2 st, vec2 wh, vec2 c){
  st -= c;
  wh = vec2(0.5)-wh*0.5;
  vec2 uv = step(wh,st)*step(wh,vec2(1.0)-st);
  return uv.x*uv.y;
}

float clouds(vec2 st, vec2 v){
  st *= 0.5;
  float clouds = 0.0;
  clouds += loop_noise(fract(st + u_time*v), 8.0) / 2.0;
  clouds += loop_noise(fract(st + u_time*v*0.5), 16.0) / 4.0;
  clouds += loop_noise(fract(st + u_time*v*0.2), 32.0) / 8.0;
  clouds += loop_noise(fract(st + u_time*v*0.01), 64.0) / 16.0;
  clouds += loop_noise(fract(st - u_time*v*0.01), 128.0) / 32.0;
  
  return clouds * smoothstep(0.3, 0.9, clouds);
}

vec3 stars(vec2 st, float m, float n, float z){
  st = (st-0.5)/z+0.5;
  st *= m;
  vec2 i = floor(st);
  vec2 f = fract(st);
  float d = 1.0;
  for (int x = -1;x <= 1;x++){
    for (int y = -1;y <= 1;y++){
      vec2 cell = vec2(x,y);
      if(box(i+cell+vec2(0.5),vec2(2.0),vec2(floor(m/2.0))) != 1.0){
        float s = distance(random2d(i+cell)+cell,f);
        d = min(s,d);
      }
    }
  }
  return (vec3(0.6, 0.8, 0.9)*smoothstep(0.005*m,-0.0025*m,d)+smoothstep(0.0015*m,0.0005*m,d))*loop_noise(1.0-st,n);
}

void main(){
  vec2 st = gl_FragCoord.st/u_resolution;
  st.y = st.y*(u_resolution.y/u_resolution.x)-(u_resolution.y/u_resolution.x-1.0)*0.5;
  vec3 color = vec3((st.x*st.y+st.y)*0.15,(st.x*st.y+st.x)*0.05,0.2*max(st.x,st.y)+(1.0-max(st.x,st.y))*0.15);

  vec3 space_gas = vec3((st.x*st.y+st.x)*0.25,(st.x*st.y+st.y)*0.2,0.1*max(st.x,st.y)+(1.0-max(st.x,st.y))*0.5);
  color = mix(color,space_gas,clouds(st,vec2(0.05,0.025)));
  color = mix(color,space_gas,clouds(st,vec2(-0.025,-0.05)));
  
  // for(float i = 0.0;i < 3.0;i += 0.25){
  //   color += (1.0-color)*stars(st,25.0-i*3.0,2.0+i,pow(mod(i+u_time,3.0)+0.5,2.0));
  // }

  for(float t = 0.0;t < 1.0;t += 0.02){
    float trail = u_time-t;
    for(float i = 0.0;i < 3.0;i += 0.25){
      color += (1.0-color)*stars(st,25.0-i*3.0,2.0+i,pow(mod(i+trail,3.0)+0.5,2.0))*pow((1.0-t),10.0);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}