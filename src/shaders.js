// Parche de materiales: texturas procedurales por tipo de material (sin UVs) y viento en follaje.
import * as THREE from 'three';

export const TIME = { value: 0 };

const NOISE = /* glsl */ `
float fh13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fh13(i), fh13(i + vec3(1,0,0)), f.x), mix(fh13(i + vec3(0,1,0)), fh13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(fh13(i + vec3(0,0,1)), fh13(i + vec3(1,0,1)), f.x), mix(fh13(i + vec3(0,1,1)), fh13(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm3(vec3 p){ return vnoise(p) * 0.55 + vnoise(p * 2.03) * 0.3 + vnoise(p * 4.1) * 0.15; }
`;

export function patchMaterial(mat, { sway = 0, detail = true } = {}) {
  const uSway = { value: sway };
  mat.userData.sway = uSway;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = TIME;
    sh.uniforms.uSway = uSway;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float matId;
        varying float vMat; varying vec3 vWP; varying vec3 vON;
        uniform float uTime; uniform float uSway;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vMat = matId; vON = normal;
        #ifdef USE_INSTANCING
          vec3 ip = instanceMatrix[3].xyz;
        #else
          vec3 ip = modelMatrix[3].xyz;
        #endif
        if (uSway > 0.0) {
          float hh = max(0.0, position.y);
          float w = sin(uTime * 1.6 + ip.x * 0.8 + ip.z * 0.6) + 0.45 * sin(uTime * 2.9 + ip.x * 1.7 + ip.z * 0.3);
          transformed.x += w * uSway * hh * hh;
          transformed.z += w * uSway * 0.55 * hh * hh;
        }`)
      .replace('#include <project_vertex>', `#include <project_vertex>
        vec4 wp4 = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wp4 = instanceMatrix * wp4;
        #endif
        vWP = (modelMatrix * wp4).xyz;`);
    if (!detail) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vMat; varying vec3 vWP; varying vec3 vON;');
      return;
    }
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying float vMat; varying vec3 vWP; varying vec3 vON;
        ${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          float m = floor(vMat + 0.5);
          vec3 P = vWP;
          float n1 = fbm3(P * 3.0);
          if (m < 0.5) {
            diffuseColor.rgb *= 0.9 + 0.2 * n1;
          } else if (m < 1.5) { // madera gastada
            vec3 a = abs(vON);
            float along = a.y > 0.7 ? (P.x + P.z) : P.y;
            float across = a.y > 0.7 ? (P.x - P.z) : (a.x > a.z ? P.z : P.x);
            float grain = vnoise(vec3(across * 38.0, along * 2.2, 0.5));
            float weather = smoothstep(0.35, 0.85, fbm3(P * 1.7));
            diffuseColor.rgb *= 0.74 + 0.36 * grain;
            float g = dot(diffuseColor.rgb, vec3(0.3, 0.5, 0.2));
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(g) * vec3(1.04, 1.0, 0.95), weather * 0.5);
          } else if (m < 2.5) { // guano / paja
            float str = vnoise(vec3(P.x * 60.0 + P.z * 20.0, P.y * 9.0, P.z * 60.0 - P.x * 20.0));
            diffuseColor.rgb *= (0.68 + 0.5 * str) * (0.85 + 0.3 * n1);
          } else if (m < 3.5) { // metal pintado con óxido
            float rr = smoothstep(0.7, 0.8, fbm3(P * 3.4) + 0.2 * vnoise(P * 18.0)) * 0.9;
            vec3 rust = vec3(0.36, 0.15, 0.06) * (0.7 + 0.6 * vnoise(P * 22.0));
            diffuseColor.rgb = mix(diffuseColor.rgb * (0.9 + 0.14 * n1), rust, rr);
          } else if (m < 4.5) { // zinc ondulado
            float c = 0.84 + 0.16 * sin((P.x + P.z) * 48.0);
            float rr = smoothstep(0.48, 0.74, fbm3(P * 3.0));
            diffuseColor.rgb = mix(diffuseColor.rgb * c, vec3(0.38, 0.17, 0.07), rr * 0.85);
          } else if (m < 5.5) { // follaje
            diffuseColor.rgb *= 0.8 + 0.32 * vnoise(P * 5.0);
          } else if (m < 6.5) { // piedra, barro, tronco
            diffuseColor.rgb *= 0.74 + 0.4 * fbm3(P * 7.0);
          } else { // tierra colorada con terrones
            float clods = vnoise(P * 16.0);
            diffuseColor.rgb *= (0.7 + 0.42 * clods) * (0.86 + 0.28 * n1);
          }
        }`);
  };
  mat.customProgramCacheKey = () => `finca-${sway > 0 ? 's' : 'n'}-${detail ? 'd' : 'f'}`;
  return mat;
}
