#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0;

void main(){
    vec2 st = gl_FragCoord.st/u_resolution;
    vec3 color = vec3(1.0);
    vec4 image = texture2D(u_tex0, st);
    
    if(image.a < 0.6){
        image = vec4(0.0, 1.0, 0.5, 1.0);
    }

    gl_FragColor = vec4(image);
}
