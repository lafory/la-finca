var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=navigator.userAgent||``,r=/iPhone|iPad|iPod/.test(n)||/Macintosh/.test(n)&&navigator.maxTouchPoints>1,i=navigator.standalone===!0||matchMedia(`(display-mode: standalone)`).matches||matchMedia(`(display-mode: fullscreen)`).matches,a=!r&&!i&&!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);function o(){let e=window.visualViewport,t=document.documentElement,n=window.innerWidth||t.clientWidth,r=window.innerHeight||t.clientHeight;return e&&e.scale<=1.01&&(n=e.width,r=e.height),{w:Math.max(1,Math.round(n)),h:Math.max(1,Math.round(r))}}var s=``;function c(){let{w:e,h:t}=o(),n=`${e}x${t}`;if(n!==s){s=n;let r=document.documentElement.style;r.setProperty(`--app-w`,`${e}px`),r.setProperty(`--app-h`,`${t}px`)}return(window.scrollX||window.scrollY)&&window.scrollTo(0,0),{w:e,h:t}}function l(e){let t=()=>{let t=c();e?.(t)};window.addEventListener(`resize`,t),window.addEventListener(`orientationchange`,()=>{t(),setTimeout(t,250),setTimeout(t,700)}),window.visualViewport?.addEventListener(`resize`,t),window.visualViewport?.addEventListener(`scroll`,t);for(let e of[`gesturestart`,`gesturechange`])document.addEventListener(e,e=>e.preventDefault(),{passive:!1});document.addEventListener(`dblclick`,e=>e.preventDefault(),{passive:!1}),c()}i&&document.documentElement.classList.add(`standalone`),r&&document.documentElement.classList.add(`ios`),c();var u,d,f,p,m,h,g,_,v,y=1e3,b=1001,x=1002,S=1003,C=1004,w=1005,T=1006,E=1007,D=1008,O=1009,k=1010,A=1011,ee=1012,te=1013,ne=1014,re=1015,ie=1016,ae=1017,oe=1018,se=1020,ce=35902,le=35899,ue=1021,de=1022,fe=1023,pe=1026,me=1027,he=1028,ge=1029,_e=1030,ve=1031,ye=1033,be=33776,xe=33777,Se=33778,Ce=33779,we=35840,Te=35841,Ee=35842,De=35843,Oe=36196,ke=37492,Ae=37496,je=37488,Me=37489,Ne=37490,Pe=37491,Fe=37808,Ie=37809,Le=37810,j=37811,Re=37812,ze=37813,Be=37814,M=37815,Ve=37816,N=37817,He=37818,Ue=37819,We=37820,Ge=37821,Ke=36492,qe=36494,Je=36495,Ye=36283,Xe=36284,Ze=36285,Qe=36286,$e=2300,et=2301,tt=2302,nt=2303,rt=2400,it=2401,at=2402,ot=3200,st=`srgb`,ct=`srgb-linear`,lt=`linear`,ut=`srgb`,dt=7680,ft=35044,pt=2e3;function mt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ht(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function gt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function _t(){let e=gt(`canvas`);return e.style.display=`block`,e}var vt={};function yt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function bt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function P(...e){e=bt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function F(...e){e=bt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function xt(...e){let t=e.join(` `);t in vt||(vt[t]=!0,P(...e))}function St(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Ct={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},wt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Tt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Et=1234567,Dt=Math.PI/180,Ot=180/Math.PI;function kt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Tt[e&255]+Tt[e>>8&255]+Tt[e>>16&255]+Tt[e>>24&255]+`-`+Tt[t&255]+Tt[t>>8&255]+`-`+Tt[t>>16&15|64]+Tt[t>>24&255]+`-`+Tt[n&63|128]+Tt[n>>8&255]+`-`+Tt[n>>16&255]+Tt[n>>24&255]+Tt[r&255]+Tt[r>>8&255]+Tt[r>>16&255]+Tt[r>>24&255]).toLowerCase()}function I(e,t,n){return Math.max(t,Math.min(n,e))}function At(e,t){return(e%t+t)%t}function jt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Mt(e,t,n){return e===t?0:(n-e)/(t-e)}function Nt(e,t,n){return(1-n)*e+n*t}function Pt(e,t,n,r){return Nt(e,t,1-Math.exp(-n*r))}function Ft(e,t=1){return t-Math.abs(At(e,t*2)-t)}function It(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Lt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Rt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function zt(e,t){return e+Math.random()*(t-e)}function Bt(e){return e*(.5-Math.random())}function Vt(e){e!==void 0&&(Et=e);let t=Et+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ht(e){return e*Dt}function Ut(e){return e*Ot}function Wt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Gt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Kt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function qt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:P(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Jt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Yt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Xt={DEG2RAD:Dt,RAD2DEG:Ot,generateUUID:kt,clamp:I,euclideanModulo:At,mapLinear:jt,inverseLerp:Mt,lerp:Nt,damp:Pt,pingpong:Ft,smoothstep:It,smootherstep:Lt,randInt:Rt,randFloat:zt,randFloatSpread:Bt,seededRandom:Vt,degToRad:Ht,radToDeg:Ut,isPowerOfTwo:Wt,ceilPowerOfTwo:Gt,floorPowerOfTwo:Kt,setQuaternionFromProperEuler:qt,normalize:Yt,denormalize:Jt};g=Symbol.iterator;var L=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(I(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[g](){yield this.x,yield this.y}};u=L,u.prototype.isVector2=!0;var Zt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:P(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(I(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};_=Symbol.iterator;var R=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($t.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($t.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this.z=I(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this.z=I(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Qt.copy(this).projectOnVector(e),this.sub(Qt)}reflect(e){return this.sub(Qt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(I(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[_](){yield this.x,yield this.y,yield this.z}};d=R,d.prototype.isVector3=!0;var Qt=new R,$t=new Zt,z=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return xt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(en.makeScale(e,t)),this}rotate(e){return xt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(en.makeRotation(-e)),this}translate(e,t){return xt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(en.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};f=z,f.prototype.isMatrix3=!0;var en=new z,tn=new z().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nn=new z().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function rn(){let e={enabled:!0,workingColorSpace:ct,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=on(e.r),e.g=on(e.g),e.b=on(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=sn(e.r),e.g=sn(e.g),e.b=sn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?lt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return xt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return xt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ct]:{primaries:t,whitePoint:r,transfer:lt,toXYZ:tn,fromXYZ:nn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:st},outputColorSpaceConfig:{drawingBufferColorSpace:st}},[st]:{primaries:t,whitePoint:r,transfer:ut,toXYZ:tn,fromXYZ:nn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:st}}}),e}var an=rn();function on(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function sn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var cn,ln=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{cn===void 0&&(cn=gt(`canvas`)),cn.width=e.width,cn.height=e.height;let t=cn.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=cn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=gt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=on(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(on(t[e]/255)*255):t[e]=on(t[e]);return{data:t,width:e.width,height:e.height}}return P(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},un=0,dn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:un++}),this.uuid=kt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(fn(r[t].image)):e.push(fn(r[t]))}else e=fn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function fn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?ln.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(P(`Texture: Unable to serialize Texture.`),{})}var pn=0,mn=new R,hn=class e extends wt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=b,i=b,a=T,o=D,s=fe,c=O,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pn++}),this.uuid=kt(),this.name=``,this.source=new dn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new L(0,0),this.repeat=new L(1,1),this.center=new L(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new z,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(mn).x}get height(){return this.source.getSize(mn).y}get depth(){return this.source.getSize(mn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){P(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?P(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case y:e.x-=Math.floor(e.x);break;case b:e.x=e.x<0?0:1;break;case x:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case y:e.y-=Math.floor(e.y);break;case b:e.y=e.y<0?0:1;break;case x:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};hn.DEFAULT_IMAGE=null,hn.DEFAULT_MAPPING=300,hn.DEFAULT_ANISOTROPY=1,v=Symbol.iterator;var gn=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this.z=I(this.z,e.z,t.z),this.w=I(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this.z=I(this.z,e,t),this.w=I(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[v](){yield this.x,yield this.y,yield this.z,yield this.w}};p=gn,p.prototype.isVector4=!0;var _n=class extends wt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:T,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gn(0,0,e,t),this.scissorTest=!1,this.viewport=new gn(0,0,e,t),this.textures=[];let r=new hn({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:T,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new dn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},vn=class extends _n{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},yn=class extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=S,this.minFilter=S,this.wrapR=b,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},bn=class extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=S,this.minFilter=S,this.wrapR=b,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},xn=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Sn.setFromMatrixColumn(e,0).length(),i=1/Sn.setFromMatrixColumn(e,1).length(),a=1/Sn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wn,e,Tn)}lookAt(e,t,n){let r=this.elements;return On.subVectors(e,t),On.lengthSq()===0&&(On.z=1),On.normalize(),En.crossVectors(n,On),En.lengthSq()===0&&(Math.abs(n.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),En.crossVectors(n,On)),En.normalize(),Dn.crossVectors(On,En),r[0]=En.x,r[4]=Dn.x,r[8]=On.x,r[1]=En.y,r[5]=Dn.y,r[9]=On.y,r[2]=En.z,r[6]=Dn.z,r[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],te=r[14],ne=r[3],re=r[7],ie=r[11],ae=r[15];return i[0]=a*x+o*T+s*k+c*ne,i[4]=a*S+o*E+s*A+c*re,i[8]=a*C+o*D+s*ee+c*ie,i[12]=a*w+o*O+s*te+c*ae,i[1]=l*x+u*T+d*k+f*ne,i[5]=l*S+u*E+d*A+f*re,i[9]=l*C+u*D+d*ee+f*ie,i[13]=l*w+u*O+d*te+f*ae,i[2]=p*x+m*T+h*k+g*ne,i[6]=p*S+m*E+h*A+g*re,i[10]=p*C+m*D+h*ee+g*ie,i[14]=p*w+m*O+h*te+g*ae,i[3]=_*x+v*T+y*k+b*ne,i[7]=_*S+v*E+y*A+b*re,i[11]=_*C+v*D+y*ee+b*ie,i[15]=_*w+v*O+y*te+b*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Sn.set(r[0],r[1],r[2]).length(),o=Sn.set(r[4],r[5],r[6]).length(),s=Sn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Cn.copy(this);let c=1/a,l=1/o,u=1/s;return Cn.elements[0]*=c,Cn.elements[1]*=c,Cn.elements[2]*=c,Cn.elements[4]*=l,Cn.elements[5]*=l,Cn.elements[6]*=l,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,t.setFromRotationMatrix(Cn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=pt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=pt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};m=xn,m.prototype.isMatrix4=!0;var Sn=new R,Cn=new xn,wn=new R(0,0,0),Tn=new R(1,1,1),En=new R,Dn=new R,On=new R,kn=new xn,An=new Zt,jn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(I(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-I(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(I(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-I(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(I(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-I(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:P(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return kn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return An.setFromEuler(this),this.setFromQuaternion(An,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};jn.DEFAULT_ORDER=`XYZ`;var Mn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Nn=0,Pn=new R,Fn=new Zt,In=new xn,Ln=new R,Rn=new R,zn=new R,Bn=new Zt,Vn=new R(1,0,0),Hn=new R(0,1,0),Un=new R(0,0,1),Wn={type:`added`},Gn={type:`removed`},Kn={type:`childadded`,child:null},qn={type:`childremoved`,child:null},Jn=class e extends wt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nn++}),this.uuid=kt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new R,n=new jn,r=new Zt,i=new R(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new xn},normalMatrix:{value:new z}}),this.matrix=new xn,this.matrixWorld=new xn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fn.setFromAxisAngle(e,t),this.quaternion.multiply(Fn),this}rotateOnWorldAxis(e,t){return Fn.setFromAxisAngle(e,t),this.quaternion.premultiply(Fn),this}rotateX(e){return this.rotateOnAxis(Vn,e)}rotateY(e){return this.rotateOnAxis(Hn,e)}rotateZ(e){return this.rotateOnAxis(Un,e)}translateOnAxis(e,t){return Pn.copy(e).applyQuaternion(this.quaternion),this.position.add(Pn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vn,e)}translateY(e){return this.translateOnAxis(Hn,e)}translateZ(e){return this.translateOnAxis(Un,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ln.copy(e):Ln.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Rn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Rn,Ln,this.up):In.lookAt(Ln,Rn,this.up),this.quaternion.setFromRotationMatrix(In),r&&(In.extractRotation(r.matrixWorld),Fn.setFromRotationMatrix(In),this.quaternion.premultiply(Fn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(F(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wn),Kn.child=e,this.dispatchEvent(Kn),Kn.child=null):F(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gn),qn.child=e,this.dispatchEvent(qn),qn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wn),Kn.child=e,this.dispatchEvent(Kn),Kn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rn,e,zn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rn,Bn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Jn.DEFAULT_UP=new R(0,1,0),Jn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Jn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Yn=class extends Jn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Xn={type:`move`},Zn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Xn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Yn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Qn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},er={h:0,s:0,l:0};function tr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var B=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=st){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,an.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=an.workingColorSpace){return this.r=e,this.g=t,this.b=n,an.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=an.workingColorSpace){if(e=At(e,1),t=I(t,0,1),n=I(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=tr(i,r,e+1/3),this.g=tr(i,r,e),this.b=tr(i,r,e-1/3)}return an.colorSpaceToWorking(this,r),this}setStyle(e,t=st){function n(t){t!==void 0&&parseFloat(t)<1&&P(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:P(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);P(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=st){let n=Qn[e.toLowerCase()];return n===void 0?P(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=on(e.r),this.g=on(e.g),this.b=on(e.b),this}copyLinearToSRGB(e){return this.r=sn(e.r),this.g=sn(e.g),this.b=sn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=st){return an.workingToColorSpace(nr.copy(this),e),Math.round(I(nr.r*255,0,255))*65536+Math.round(I(nr.g*255,0,255))*256+Math.round(I(nr.b*255,0,255))}getHexString(e=st){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=an.workingColorSpace){an.workingToColorSpace(nr.copy(this),t);let n=nr.r,r=nr.g,i=nr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=an.workingColorSpace){return an.workingToColorSpace(nr.copy(this),t),e.r=nr.r,e.g=nr.g,e.b=nr.b,e}getStyle(e=st){an.workingToColorSpace(nr.copy(this),e);let t=nr.r,n=nr.g,r=nr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(er);let n=Nt($n.h,er.h,t),r=Nt($n.s,er.s,t),i=Nt($n.l,er.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nr=new B;B.NAMES=Qn;var rr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new B(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ir=class extends Jn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new jn,this.environmentIntensity=1,this.environmentRotation=new jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ar=new R,or=new R,sr=new R,cr=new R,lr=new R,ur=new R,dr=new R,fr=new R,pr=new R,mr=new R,hr=new gn,gr=new gn,_r=new gn,vr=class e{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ar.subVectors(e,t),r.cross(ar);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){ar.subVectors(r,t),or.subVectors(n,t),sr.subVectors(e,t);let a=ar.dot(ar),o=ar.dot(or),s=ar.dot(sr),c=or.dot(or),l=or.dot(sr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,cr)!==null&&cr.x>=0&&cr.y>=0&&cr.x+cr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,cr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,cr.x),s.addScaledVector(a,cr.y),s.addScaledVector(o,cr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return hr.setScalar(0),gr.setScalar(0),_r.setScalar(0),hr.fromBufferAttribute(e,t),gr.fromBufferAttribute(e,n),_r.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(hr,i.x),a.addScaledVector(gr,i.y),a.addScaledVector(_r,i.z),a}static isFrontFacing(e,t,n,r){return ar.subVectors(n,t),or.subVectors(e,t),ar.cross(or).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ar.subVectors(this.c,this.b),or.subVectors(this.a,this.b),ar.cross(or).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;lr.subVectors(r,n),ur.subVectors(i,n),fr.subVectors(e,n);let s=lr.dot(fr),c=ur.dot(fr);if(s<=0&&c<=0)return t.copy(n);pr.subVectors(e,r);let l=lr.dot(pr),u=ur.dot(pr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(lr,a);mr.subVectors(e,i);let f=lr.dot(mr),p=ur.dot(mr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ur,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return dr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(dr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(lr,a).addScaledVector(ur,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},yr=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=xr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,xr):xr.fromBufferAttribute(r,t),xr.applyMatrix4(e.matrixWorld),this.expandByPoint(xr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Sr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Sr.copy(e.boundingBox)),Sr.applyMatrix4(e.matrixWorld),this.union(Sr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xr),xr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(kr),Ar.subVectors(this.max,kr),Cr.subVectors(e.a,kr),wr.subVectors(e.b,kr),Tr.subVectors(e.c,kr),Er.subVectors(wr,Cr),Dr.subVectors(Tr,wr),Or.subVectors(Cr,Tr);let t=[0,-Er.z,Er.y,0,-Dr.z,Dr.y,0,-Or.z,Or.y,Er.z,0,-Er.x,Dr.z,0,-Dr.x,Or.z,0,-Or.x,-Er.y,Er.x,0,-Dr.y,Dr.x,0,-Or.y,Or.x,0];return!Nr(t,Cr,wr,Tr,Ar)||(t=[1,0,0,0,1,0,0,0,1],!Nr(t,Cr,wr,Tr,Ar))?!1:(jr.crossVectors(Er,Dr),t=[jr.x,jr.y,jr.z],Nr(t,Cr,wr,Tr,Ar))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(br[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),br[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),br[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),br[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),br[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),br[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),br[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),br[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(br)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},br=[new R,new R,new R,new R,new R,new R,new R,new R],xr=new R,Sr=new yr,Cr=new R,wr=new R,Tr=new R,Er=new R,Dr=new R,Or=new R,kr=new R,Ar=new R,jr=new R,Mr=new R;function Nr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Mr.fromArray(e,a);let o=i.x*Math.abs(Mr.x)+i.y*Math.abs(Mr.y)+i.z*Math.abs(Mr.z),s=t.dot(Mr),c=n.dot(Mr),l=r.dot(Mr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Pr=new R,Fr=new L,Ir=0,Lr=class extends wt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ir++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=ft,this.updateRanges=[],this.gpuType=re,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix3(e),this.setXY(t,Fr.x,Fr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix3(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix4(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyNormalMatrix(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.transformDirection(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),r=Yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),r=Yt(r,this.array),i=Yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Rr=class extends Lr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},zr=class extends Lr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Br=class extends Lr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Vr=new yr,Hr=new R,Ur=new R,Wr=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Vr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hr.subVectors(e,this.center);let t=Hr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Hr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ur.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hr.copy(e.center).add(Ur)),this.expandByPoint(Hr.copy(e.center).sub(Ur))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Gr=0,Kr=new xn,qr=new Jn,Jr=new R,Yr=new yr,Xr=new yr,Zr=new R,Qr=class e extends wt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gr++}),this.uuid=kt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(mt(e)?zr:Rr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new z().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Kr.makeRotationFromQuaternion(e),this.applyMatrix4(Kr),this}rotateX(e){return Kr.makeRotationX(e),this.applyMatrix4(Kr),this}rotateY(e){return Kr.makeRotationY(e),this.applyMatrix4(Kr),this}rotateZ(e){return Kr.makeRotationZ(e),this.applyMatrix4(Kr),this}translate(e,t,n){return Kr.makeTranslation(e,t,n),this.applyMatrix4(Kr),this}scale(e,t,n){return Kr.makeScale(e,t,n),this.applyMatrix4(Kr),this}lookAt(e){return qr.lookAt(e),qr.updateMatrix(),this.applyMatrix4(qr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Jr).negate(),this.translate(Jr.x,Jr.y,Jr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Br(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&P(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)F(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Yr.setFromBufferAttribute(n),this.morphTargetsRelative?(Zr.addVectors(this.boundingBox.min,Yr.min),this.boundingBox.expandByPoint(Zr),Zr.addVectors(this.boundingBox.max,Yr.max),this.boundingBox.expandByPoint(Zr)):(this.boundingBox.expandByPoint(Yr.min),this.boundingBox.expandByPoint(Yr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&F(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)F(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new R,1/0);else if(e){let n=this.boundingSphere.center;if(Yr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Xr.setFromBufferAttribute(n),this.morphTargetsRelative?(Zr.addVectors(Yr.min,Xr.min),Yr.expandByPoint(Zr),Zr.addVectors(Yr.max,Xr.max),Yr.expandByPoint(Zr)):(Yr.expandByPoint(Xr.min),Yr.expandByPoint(Xr.max))}Yr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Zr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Zr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Zr.fromBufferAttribute(a,t),o&&(Jr.fromBufferAttribute(e,t),Zr.add(Jr)),r=Math.max(r,n.distanceToSquared(Zr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&F(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){F(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Lr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new R,s[e]=new R;let c=new R,l=new R,u=new R,d=new L,f=new L,p=new L,m=new R,h=new R;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new R,y=new R,b=new R,x=new R;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Lr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new R,i=new R,a=new R,o=new R,s=new R,c=new R,l=new R,u=new R;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Zr.fromBufferAttribute(e,t),Zr.normalize(),e.setXYZ(t,Zr.x,Zr.y,Zr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Lr(a,r,i)}if(this.index===null)return P(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},$r=new R,ei=new R,ti=new z,ni=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=$r.subVectors(n,t).cross(ei.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta($r),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ti.getNormalMatrix(e),r=this.coplanarPoint($r).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ri=0,ii=class extends wt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ri++}),this.uuid=kt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new B(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=dt,this.stencilZFail=dt,this.stencilZPass=dt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){P(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?P(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new B().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new ni().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new L().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new L().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},ai=new R,oi=new R,si=new R,ci=new R,li=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){oi.copy(e).add(t).multiplyScalar(.5),si.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(oi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(si),o=ci.dot(this.direction),s=-ci.dot(si),c=ci.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(oi).addScaledVector(si,d),f}intersectSphere(e,t){if(e.radius<0)return null;ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),r=ai.dot(ai)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,ee,te,ne;if(y>=b&&y>=x?(w=s,D=u,A=p,ne=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,ee=_,te=v):(S=l,C=c,T=f,E=d,O=h,k=m,ee=v,te=_)):b>=x?(w=c,D=d,A=m,ne=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,ee=v,te=g):(S=s,C=l,T=u,E=f,O=p,k=h,ee=g,te=v)):(w=l,D=f,A=h,ne=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,ee=g,te=_):(S=c,C=s,T=d,E=u,O=m,k=p,ee=_,te=g)),w===0)return null;let re=S/w,ie=C/w,ae=1/w,oe=T-re*D,se=E-ie*D,ce=O-re*A,le=k-ie*A,ue=ee-re*ne,de=te-ie*ne,fe=ue*le-de*ce,pe=oe*de-se*ue,me=ce*se-le*oe;if(r){if(fe<0||pe<0||me<0)return null}else if((fe<0||pe<0||me<0)&&(fe>0||pe>0||me>0))return null;let he=fe+pe+me;if(he===0)return null;let ge=ae*(fe*D+pe*A+me*ne);return(he>0?ge<0:ge>0)?null:this.at(ge/he,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ui=class extends ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new B(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},di=new xn,fi=new li,pi=new Wr,mi=new R,hi=new R,gi=new R,_i=new R,vi=new R,yi=new R,bi=new R,xi=new R,V=class extends Jn{constructor(e=new Qr,t=new ui){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){yi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(vi.fromBufferAttribute(s,e),a?yi.addScaledVector(vi,r):yi.addScaledVector(vi.sub(t),r))}t.add(yi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pi.copy(n.boundingSphere),pi.applyMatrix4(i),fi.copy(e.ray).recast(e.near),!(pi.containsPoint(fi.origin)===!1&&(fi.intersectSphere(pi,mi)===null||fi.origin.distanceToSquared(mi)>(e.far-e.near)**2))&&(di.copy(i).invert(),fi.copy(e.ray).applyMatrix4(di),(n.boundingBox===null||fi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,fi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ci(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ci(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ci(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ci(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Si(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;xi.copy(s),xi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(xi);return l<n.near||l>n.far?null:{distance:l,point:xi.clone(),object:e}}function Ci(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,hi),e.getVertexPosition(c,gi),e.getVertexPosition(l,_i);let u=Si(e,t,n,r,hi,gi,_i,bi);if(u){let e=new R;vr.getBarycoord(bi,hi,gi,_i,e),i&&(u.uv=vr.getInterpolatedAttribute(i,s,c,l,e,new L)),a&&(u.uv1=vr.getInterpolatedAttribute(a,s,c,l,e,new L)),o&&(u.normal=vr.getInterpolatedAttribute(o,s,c,l,e,new R),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new R,materialIndex:0};vr.getNormal(hi,gi,_i,t.normal),u.face=t,u.barycoord=e}return u}var wi=class extends hn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=S,l=S,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ti=class extends Lr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ei=new xn,Di=new xn,Oi=[],ki=new yr,Ai=new xn,ji=new V,Mi=new Wr,Ni=class extends V{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ti(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Ai)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new yr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),ki.copy(e.boundingBox).applyMatrix4(Ei),this.boundingBox.union(ki)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),Mi.copy(e.boundingSphere).applyMatrix4(Ei),this.boundingSphere.union(Mi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ji.geometry=this.geometry,ji.material=this.material,ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Mi.copy(this.boundingSphere),Mi.applyMatrix4(n),e.ray.intersectsSphere(Mi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ei),Di.multiplyMatrices(n,Ei),ji.matrixWorld=Di,ji.raycast(e,Oi);for(let e=0,n=Oi.length;e<n;e++){let n=Oi[e];n.instanceId=i,n.object=this,t.push(n)}Oi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ti(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new wi(new Float32Array(r*this.count),r,this.count,he,re));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Pi=new Wr,Fi=new L(.5,.5),Ii=new R,Li=class{constructor(e=new ni,t=new ni,n=new ni,r=new ni,i=new ni,a=new ni){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=pt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){return Pi.center.set(0,0,0),Pi.radius=.7071067811865476+Fi.distanceTo(e.center),Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ii.x=r.normal.x>0?e.max.x:e.min.x,Ii.y=r.normal.y>0?e.max.y:e.min.y,Ii.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ii)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ri=class extends ii{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new B(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},zi=new xn,Bi=new li,Vi=new Wr,Hi=new R,Ui=class extends Jn{constructor(e=new Qr,t=new Ri){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vi.copy(n.boundingSphere),Vi.applyMatrix4(r),Vi.radius+=i,e.ray.intersectsSphere(Vi)===!1)return;zi.copy(r).invert(),Bi.copy(e.ray).applyMatrix4(zi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Hi.fromBufferAttribute(l,n),Wi(Hi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Hi.fromBufferAttribute(l,a),Wi(Hi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Wi(e,t,n,r,i,a,o){let s=Bi.distanceSqToPoint(e);if(s<n){let n=new R;Bi.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Gi=class extends hn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ki=class extends hn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},qi=class extends hn{constructor(e,t,n=ne,r,i,a,o=S,s=S,c,l=pe,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new dn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ji=class extends qi{constructor(e,t=ne,n=301,r,i,a=S,o=S,s,c=pe){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Yi=class extends hn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Xi=class e extends Qr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Br(c,3)),this.setAttribute(`normal`,new Br(l,3)),this.setAttribute(`uv`,new Br(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new R;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Zi=class e extends Qr{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new R,g=new R;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new Br(o,3)),this.setAttribute(`normal`,new Br(s,3)),this.setAttribute(`uv`,new Br(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Qi=class e extends Qr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Br(u,3)),this.setAttribute(`normal`,new Br(d,3)),this.setAttribute(`uv`,new Br(f,2));function _(){let a=new R,_=new R,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new L,m=new R,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},$i=class e extends Qi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ea=class e extends Qr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Br(i,3)),this.setAttribute(`normal`,new Br(i.slice(),3)),this.setAttribute(`uv`,new Br(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new R,r=new R,i=new R;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new R;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new R;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new R,t=new R,n=new R,r=new R,o=new L,s=new L,c=new L;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ta=class e extends ea{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},na=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){P(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new L:new R);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new R,r=[],i=[],a=[],o=new R,s=new xn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new R)}i[0]=new R,a[0]=new R;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(I(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(I(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ra=class extends na{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new L){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ia=class extends ra{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function aa(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var oa=new R,sa=new R,ca=new aa,la=new aa,ua=new aa,da=class extends na{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new R){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(sa.subVectors(r[0],r[1]).add(r[0]),c=sa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(oa.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=oa),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),ca.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),la.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),ua.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(ca.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),la.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),ua.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(ca.calc(s),la.calc(s),ua.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new R().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function fa(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function pa(e,t){let n=1-e;return n*n*t}function ma(e,t){return 2*(1-e)*e*t}function ha(e,t){return e*e*t}function ga(e,t,n,r){return pa(e,t)+ma(e,n)+ha(e,r)}function _a(e,t){let n=1-e;return n*n*n*t}function va(e,t){let n=1-e;return 3*n*n*e*t}function ya(e,t){return 3*(1-e)*e*e*t}function ba(e,t){return e*e*e*t}function xa(e,t,n,r,i){return _a(e,t)+va(e,n)+ya(e,r)+ba(e,i)}var Sa=class extends na{constructor(e=new L,t=new L,n=new L,r=new L){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new L){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(xa(e,r.x,i.x,a.x,o.x),xa(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ca=class extends na{constructor(e=new R,t=new R,n=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(xa(e,r.x,i.x,a.x,o.x),xa(e,r.y,i.y,a.y,o.y),xa(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},wa=class extends na{constructor(e=new L,t=new L){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ta=class extends na{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ea=class extends na{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ga(e,r.x,i.x,a.x),ga(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Da=class extends na{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ga(e,r.x,i.x,a.x),ga(e,r.y,i.y,a.y),ga(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oa=class extends na{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new L){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(fa(o,s.x,c.x,l.x,u.x),fa(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new L().fromArray(n))}return this}},ka=Object.freeze({__proto__:null,ArcCurve:ia,CatmullRomCurve3:da,CubicBezierCurve:Sa,CubicBezierCurve3:Ca,EllipseCurve:ra,LineCurve:wa,LineCurve3:Ta,QuadraticBezierCurve:Ea,QuadraticBezierCurve3:Da,SplineCurve:Oa}),Aa=class extends na{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ka[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ka[n.type]().fromJSON(n))}return this}},ja=class extends Aa{constructor(e){super(),this.type=`Path`,this.currentPoint=new L,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new wa(this.currentPoint.clone(),new L(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Ea(this.currentPoint.clone(),new L(e,t),new L(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Sa(this.currentPoint.clone(),new L(e,t),new L(n,r),new L(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new Oa([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ra(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ma=class extends ja{constructor(e){super(e),this.uuid=kt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ja().fromJSON(n))}return this}};function Na(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Pa(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Va(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Ia(a,o,n,s,c,l,0),o}function Pa(e,t,n,r,i){let a;if(i===fo(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=co(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=co(i/r|0,e[i],e[i+1],a);return a&&eo(a,a.next)&&(lo(a),a=a.next),a}function Fa(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(eo(n,n.next)||$a(n.prev,n,n.next)===0)){if(lo(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Ia(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ka(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Ra(e,r,i,a):La(e))t.push(c.i,e.i,l.i),lo(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=za(Fa(e),t),Ia(e,t,n,r,i,a,2)):o===2&&Ba(e,t,n,r,i,a):Ia(Fa(e),t,n,r,i,a,1);break}}}function La(e){let t=e.prev,n=e,r=e.next;if($a(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Za(i,s,a,c,o,l,m.x,m.y)&&$a(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ra(e,t,n,r){let i=e.prev,a=e,o=e.next;if($a(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Ja(p,m,t,n,r),v=Ja(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Za(s,u,c,d,l,f,y.x,y.y)&&$a(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Za(s,u,c,d,l,f,b.x,b.y)&&$a(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Za(s,u,c,d,l,f,y.x,y.y)&&$a(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Za(s,u,c,d,l,f,b.x,b.y)&&$a(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function za(e,t){let n=e;do{let r=n.prev,i=n.next.next;!eo(r,i)&&to(r,n,n.next,i)&&ao(r,i)&&ao(i,r)&&(t.push(r.i,n.i,i.i),lo(n),lo(n.next),n=e=i),n=n.next}while(n!==e);return Fa(n)}function Ba(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Qa(o,e)){let s=so(o,e);o=Fa(o,o.next),s=Fa(s,s.next),Ia(o,t,n,r,i,a,0),Ia(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Va(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Pa(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Ya(o))}i.sort(Ha);for(let e=0;e<i.length;e++)n=Ua(i[e],n);return n}function Ha(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Ua(e,t){let n=Wa(e,t);if(!n)return t;let r=so(n,e);return Fa(r,r.next),Fa(n,n.next)}function Wa(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(eo(e,n))return n;do{if(eo(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Xa(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);ao(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Ga(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Ga(e,t){return $a(e.prev,e,t.prev)<0&&$a(t.next,e,e.next)<0}function Ka(e,t,n,r){let i=e;do i.z===0&&(i.z=Ja(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,qa(i)}function qa(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Ja(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Ya(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Xa(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Za(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Xa(e,t,n,r,i,a,o,s)}function Qa(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!io(e,t)&&(ao(e,t)&&ao(t,e)&&oo(e,t)&&($a(e.prev,e,t.prev)||$a(e,t.prev,t))||eo(e,t)&&$a(e.prev,e,e.next)>0&&$a(t.prev,t,t.next)>0)}function $a(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function eo(e,t){return e.x===t.x&&e.y===t.y}function to(e,t,n,r){let i=ro($a(e,t,n)),a=ro($a(e,t,r)),o=ro($a(n,r,e)),s=ro($a(n,r,t));return!!(i!==a&&o!==s||i===0&&no(e,n,t)||a===0&&no(e,r,t)||o===0&&no(n,e,r)||s===0&&no(n,t,r))}function no(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ro(e){return e>0?1:e<0?-1:0}function io(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&to(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function ao(e,t){return $a(e.prev,e,e.next)<0?$a(e,t,e.next)>=0&&$a(e,e.prev,t)>=0:$a(e,t,e.prev)<0||$a(e,e.next,t)<0}function oo(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function so(e,t){let n=uo(e.i,e.x,e.y),r=uo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function co(e,t,n,r){let i=uo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function lo(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function uo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function fo(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var po=class{static triangulate(e,t,n=2){return Na(e,t,n)}},mo=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];ho(e),go(n,e);let a=e.length;t.forEach(ho);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,go(n,t[e]);let o=po.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function ho(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function go(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var _o=class e extends ea{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},vo=class e extends ea{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},yo=class e extends Qr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Br(p,3)),this.setAttribute(`normal`,new Br(m,3)),this.setAttribute(`uv`,new Br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},bo=class e extends Qr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new R,p=new L;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Br(s,3)),this.setAttribute(`normal`,new Br(c,3)),this.setAttribute(`uv`,new Br(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},xo=class e extends Qr{constructor(e=new Ma([new L(0,.5),new L(-.5,-.5),new L(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new Br(r,3)),this.setAttribute(`normal`,new Br(i,3)),this.setAttribute(`uv`,new Br(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;mo.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];mo.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=mo.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return So(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function So(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var Co=class e extends Qr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new R,d=new R,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Br(p,3)),this.setAttribute(`normal`,new Br(m,3)),this.setAttribute(`uv`,new Br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function wo(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Eo(i))i.isRenderTargetTexture?(P(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Eo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function To(e){let t={};for(let n=0;n<e.length;n++){let r=wo(e[n]);for(let e in r)t[e]=r[e]}return t}function Eo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Do(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Oo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:an.workingColorSpace}var ko={clone:wo,merge:To},Ao=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jo=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mo=class extends ii{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ao,this.fragmentShader=jo,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wo(e.uniforms),this.uniformsGroups=Do(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new B().setHex(r.value);break;case`v2`:this.uniforms[n].value=new L().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new R().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new gn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new z().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new xn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},No=class extends Mo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Po=class extends ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new B(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new B(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new L(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Fo=class extends ii{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new B(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new B(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new L(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Io=class extends ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ot,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Lo=class extends ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ro(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function zo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Bo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Vo=class extends Bo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rt,endingEnd:rt}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case it:i=e,o=2*t-n;break;case at:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case it:a=e,s=2*n-t;break;case at:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Ho=class extends Bo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Uo=class extends Bo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Wo=class extends Bo{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=qo(n,t,g,y,r);i[p]=Go(x,o,_,b,m)}return i}};function Go(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Ko(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function qo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Go(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Ko(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Jo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ro(t,this.TimeBufferType),this.values=Ro(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ro(e.times,Array),values:Ro(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),zo(e.settings)&&(n.settings={inTangents:Ro(e.settings.inTangents,Array),outTangents:Ro(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ho(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Vo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Wo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case $e:t=this.InterpolantFactoryMethodDiscrete;break;case et:t=this.InterpolantFactoryMethodLinear;break;case tt:t=this.InterpolantFactoryMethodSmooth;break;case nt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return P(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return $e;case this.InterpolantFactoryMethodLinear:return et;case this.InterpolantFactoryMethodSmooth:return tt;case this.InterpolantFactoryMethodBezier:return nt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;zo(this.settings)&&(Yo(this.settings.inTangents,e),Yo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(F(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(F(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){F(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){F(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ht(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){F(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===tt,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,zo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Yo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Jo.prototype.ValueTypeName=``,Jo.prototype.TimeBufferType=Float32Array,Jo.prototype.ValueBufferType=Float32Array,Jo.prototype.DefaultInterpolation=et;var Xo=class extends Jo{constructor(e,t,n){super(e,t,n)}};Xo.prototype.ValueTypeName=`bool`,Xo.prototype.ValueBufferType=Array,Xo.prototype.DefaultInterpolation=$e,Xo.prototype.InterpolantFactoryMethodLinear=void 0,Xo.prototype.InterpolantFactoryMethodSmooth=void 0;var Zo=class extends Jo{constructor(e,t,n,r){super(e,t,n,r)}};Zo.prototype.ValueTypeName=`color`;var Qo=class extends Jo{constructor(e,t,n,r){super(e,t,n,r)}};Qo.prototype.ValueTypeName=`number`;var $o=class extends Bo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Zt.slerpFlat(i,0,a,c-o,a,c,s);return i}},es=class extends Jo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new $o(this.times,this.values,this.getValueSize(),e)}};es.prototype.ValueTypeName=`quaternion`,es.prototype.InterpolantFactoryMethodSmooth=void 0;var ts=class extends Jo{constructor(e,t,n){super(e,t,n)}};ts.prototype.ValueTypeName=`string`,ts.prototype.ValueBufferType=Array,ts.prototype.DefaultInterpolation=$e,ts.prototype.InterpolantFactoryMethodLinear=void 0,ts.prototype.InterpolantFactoryMethodSmooth=void 0;var ns=class extends Jo{constructor(e,t,n,r){super(e,t,n,r)}};ns.prototype.ValueTypeName=`vector`;var rs=class extends Jn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new B(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},is=class extends rs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Jn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new B(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},as=new xn,os=new R,ss=new R,cs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new L(512,512),this.mapType=O,this.map=null,this.mapPass=null,this.matrix=new xn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Li,this._frameExtents=new L(1,1),this._viewportCount=1,this._viewports=[new gn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;os.setFromMatrixPosition(e.matrixWorld),t.position.copy(os),ss.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ss),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){as.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(as,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(as)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ls=new R,us=new Zt,ds=new R,fs=class extends Jn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new xn,this.projectionMatrix=new xn,this.projectionMatrixInverse=new xn,this.coordinateSystem=pt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ls,us,ds),ds.x===1&&ds.y===1&&ds.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ls,us,ds.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ls,us,ds),ds.x===1&&ds.y===1&&ds.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ls,us,ds.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ps=new R,ms=new L,hs=new L,gs=class extends fs{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ot*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Dt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ot*2*Math.atan(Math.tan(Dt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ps.x,ps.y).multiplyScalar(-e/ps.z),ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ps.x,ps.y).multiplyScalar(-e/ps.z)}getViewSize(e,t){return this.getViewBounds(e,ms,hs),t.subVectors(hs,ms)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Dt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},_s=class extends cs{constructor(){super(new gs(90,1,.5,500)),this.isPointLightShadow=!0}},vs=class extends rs{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new _s}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ys=class extends fs{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},bs=class extends cs{constructor(){super(new ys(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},xs=class extends rs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Jn.DEFAULT_UP),this.updateMatrix(),this.target=new Jn,this.shadow=new bs}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ss=-90,Cs=1,ws=class extends Jn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new gs(Ss,Cs,e,t);r.layers=this.layers,this.add(r);let i=new gs(Ss,Cs,e,t);i.layers=this.layers,this.add(i);let a=new gs(Ss,Cs,e,t);a.layers=this.layers,this.add(a);let o=new gs(Ss,Cs,e,t);o.layers=this.layers,this.add(o);let s=new gs(Ss,Cs,e,t);s.layers=this.layers,this.add(s);let c=new gs(Ss,Cs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ts=class extends gs{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Es=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Ds.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Ds(){this._document.hidden===!1&&this.reset()}var Os=`\\[\\]\\.:\\/`,ks=RegExp(`[\\[\\]\\.:\\/]`,`g`),As=`[^\\[\\]\\.:\\/]`,js=`[^`+Os.replace(`\\.`,``)+`]`,Ms=`((?:WC+[\\/:])*)`.replace(`WC`,As),Ns=`(WCOD+)?`.replace(`WCOD`,js),Ps=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,As),Fs=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,As),Is=RegExp(`^`+Ms+Ns+Ps+Fs+`$`),Ls=[`material`,`materials`,`bones`,`map`],Rs=class{constructor(e,t,n){let r=n||zs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},zs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ks,``)}static parseTrackName(e){let t=Is.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ls.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){P(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){F(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){F(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){F(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){F(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){F(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){F(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){F(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;F(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){F(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){F(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};zs.Composite=Rs,zs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},zs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},zs.prototype.GetterByBindingType=[zs.prototype._getValue_direct,zs.prototype._getValue_array,zs.prototype._getValue_arrayElement,zs.prototype._getValue_toArray],zs.prototype.SetterByBindingTypeAndVersioning=[[zs.prototype._setValue_direct,zs.prototype._setValue_direct_setNeedsUpdate,zs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[zs.prototype._setValue_array,zs.prototype._setValue_array_setNeedsUpdate,zs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[zs.prototype._setValue_arrayElement,zs.prototype._setValue_arrayElement_setNeedsUpdate,zs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[zs.prototype._setValue_fromArray,zs.prototype._setValue_fromArray_setNeedsUpdate,zs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Bs=new xn,Vs=class{constructor(e,t,n=0,r=1/0){this.ray=new li(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Mn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):F(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Bs.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bs),this}intersectObject(e,t=!0,n=[]){return Us(e,this,n,t),n.sort(Hs),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Us(e[r],this,n,t);return n.sort(Hs),n}};function Hs(e,t){return e.distance-t.distance}function Us(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Us(r[e],t,n,!0)}}h=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},h.prototype.isMatrix2=!0;function Ws(e,t,n,r){let i=Gs(r);switch(n){case ue:return e*t;case he:return e*t/i.components*i.byteLength;case ge:return e*t/i.components*i.byteLength;case _e:return e*t*2/i.components*i.byteLength;case ve:return e*t*2/i.components*i.byteLength;case de:return e*t*3/i.components*i.byteLength;case fe:return e*t*4/i.components*i.byteLength;case ye:return e*t*4/i.components*i.byteLength;case be:case xe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Se:case Ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Te:case De:return Math.max(e,16)*Math.max(t,8)/4;case we:case Ee:return Math.max(e,8)*Math.max(t,8)/2;case Oe:case ke:case je:case Me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ae:case Ne:case Pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ie:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Le:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case j:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Re:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ze:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case M:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ve:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case N:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case He:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ue:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case We:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ge:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ke:case qe:case Je:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ye:case Xe:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ze:case Qe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Gs(e){switch(e){case O:case k:return{byteLength:1,components:1};case ee:case A:case ie:return{byteLength:2,components:1};case ae:case oe:return{byteLength:2,components:4};case ne:case te:case re:return{byteLength:4,components:1};case ce:case le:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?P(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ks(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function qs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var H={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},U={common:{diffuse:{value:new B(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new z}},envmap:{envMap:{value:null},envMapRotation:{value:new z},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new z}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new z}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new z},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new z},normalScale:{value:new L(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new z},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new z}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new z}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new z}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new B(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new B(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0},uvTransform:{value:new z}},sprite:{diffuse:{value:new B(16777215)},opacity:{value:1},center:{value:new L(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}}},Js={basic:{uniforms:To([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.fog]),vertexShader:H.meshbasic_vert,fragmentShader:H.meshbasic_frag},lambert:{uniforms:To([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new B(0)},envMapIntensity:{value:1}}]),vertexShader:H.meshlambert_vert,fragmentShader:H.meshlambert_frag},phong:{uniforms:To([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new B(0)},specular:{value:new B(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:H.meshphong_vert,fragmentShader:H.meshphong_frag},standard:{uniforms:To([U.common,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.roughnessmap,U.metalnessmap,U.fog,U.lights,{emissive:{value:new B(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:H.meshphysical_vert,fragmentShader:H.meshphysical_frag},toon:{uniforms:To([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.gradientmap,U.fog,U.lights,{emissive:{value:new B(0)}}]),vertexShader:H.meshtoon_vert,fragmentShader:H.meshtoon_frag},matcap:{uniforms:To([U.common,U.bumpmap,U.normalmap,U.displacementmap,U.fog,{matcap:{value:null}}]),vertexShader:H.meshmatcap_vert,fragmentShader:H.meshmatcap_frag},points:{uniforms:To([U.points,U.fog]),vertexShader:H.points_vert,fragmentShader:H.points_frag},dashed:{uniforms:To([U.common,U.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:H.linedashed_vert,fragmentShader:H.linedashed_frag},depth:{uniforms:To([U.common,U.displacementmap]),vertexShader:H.depth_vert,fragmentShader:H.depth_frag},normal:{uniforms:To([U.common,U.bumpmap,U.normalmap,U.displacementmap,{opacity:{value:1}}]),vertexShader:H.meshnormal_vert,fragmentShader:H.meshnormal_frag},sprite:{uniforms:To([U.sprite,U.fog]),vertexShader:H.sprite_vert,fragmentShader:H.sprite_frag},background:{uniforms:{uvTransform:{value:new z},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:H.background_vert,fragmentShader:H.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new z}},vertexShader:H.backgroundCube_vert,fragmentShader:H.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:H.cube_vert,fragmentShader:H.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:H.equirect_vert,fragmentShader:H.equirect_frag},distance:{uniforms:To([U.common,U.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:H.distance_vert,fragmentShader:H.distance_frag},shadow:{uniforms:To([U.lights,U.fog,{color:{value:new B(0)},opacity:{value:1}}]),vertexShader:H.shadow_vert,fragmentShader:H.shadow_frag}};Js.physical={uniforms:To([Js.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new z},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new z},clearcoatNormalScale:{value:new L(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new z},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new z},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new z},sheen:{value:0},sheenColor:{value:new B(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new z},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new z},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new z},transmissionSamplerSize:{value:new L},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new z},attenuationDistance:{value:0},attenuationColor:{value:new B(0)},specularColor:{value:new B(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new z},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new z},anisotropyVector:{value:new L},anisotropyMap:{value:null},anisotropyMapTransform:{value:new z}}]),vertexShader:H.meshphysical_vert,fragmentShader:H.meshphysical_frag};var Ys={r:0,b:0,g:0},Xs=new xn,Zs=new z;Zs.set(-1,0,0,0,1,0,0,0,1);function Qs(e,t,n,r,i,a){let o=new B(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new V(new Xi(1,1,1),new Mo({name:`BackgroundCubeMaterial`,uniforms:wo(Js.backgroundCube.uniforms),vertexShader:Js.backgroundCube.vertexShader,fragmentShader:Js.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Xs.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Zs),l.material.toneMapped=an.getTransfer(i.colorSpace)!==ut,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new V(new yo(2,2),new Mo({name:`BackgroundMaterial`,uniforms:wo(Js.background.uniforms),vertexShader:Js.background.vertexShader,fragmentShader:Js.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=an.getTransfer(i.colorSpace)!==ut,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ys,Oo(e)),n.buffers.color.setClear(Ys.r,Ys.g,Ys.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function $s(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function ec(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function tc(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(P(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&P(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function nc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ni,s=new z,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var rc=4,ic=6,ac=20,oc=256,sc=new ys,cc=new B,lc=null,uc=0,dc=0,fc=!1,pc=new R,mc=new R,hc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=pc}=i;lc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),fc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(lc,uc,dc),this._renderer.xr.enabled=fc,e.scissorTest=!1,vc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),lc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),fc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:T,minFilter:T,generateMipmaps:!1,type:ie,format:fe,colorSpace:ct,depthBuffer:!1},r=_c(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_c(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=gc(r)),this._blurMaterial=bc(r,e,t),this._ggxMaterial=yc(r,e,t)}return r}_compileMaterial(e){let t=new V(new Qr,e);this._renderer.compile(t,sc)}_sceneToCubeUV(e,t,n,r,i){let a=new gs(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(cc),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new V(new Xi,new ui({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(cc),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;vc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;vc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,sc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-rc?n-d+rc:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,vc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,sc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,vc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,sc)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];vc(t,3*l*(r>this._lodMax-rc?r-this._lodMax+rc:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,sc)}};function gc(e){let t=[],n=[],r=e,i=e-rc+1+ic;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?mc.set(1,r,n):e===1?mc.set(-n,1,-r):e===2?mc.set(-n,r,1):e===3?mc.set(-1,r,-n):e===4?mc.set(-n,-1,r):mc.set(n,r,-1),mc.toArray(l,(e*6+t)*3)}}let u=new Qr;u.setAttribute(`position`,new Lr(c,3)),u.setAttribute(`outputDirection`,new Lr(l,3)),n.push(new V(u,null)),r>rc&&r--}return{lodMeshes:n,sizeLods:t}}function _c(e,t,n){let r=new vn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function vc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function yc(e,t,n){return new Mo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:oc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Cc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function bc(e,t,n){return new Mo({name:`SphericalGaussianBlur`,defines:{SAMPLES:ac,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Cc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xc(){return new Mo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Sc(){return new Mo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var wc=class extends vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Gi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Xi(5,5,5),i=new Mo({name:`CubemapFromEquirect`,uniforms:wo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new V(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=T),new ws(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Tc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new wc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new hc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new hc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ec(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&xt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Dc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?zr:Rr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Oc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function kc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:F(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ac(e,t,n){let r=new WeakMap,i=new gn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new yn(h,p,m,u);g.type=re,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new L(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function jc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Mc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Nc(e,t,n,r,i,a){let o=new vn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Qr;l.setAttribute(`position`,new Br([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Br([0,2,0,0,2,0],2));let u=new No({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new V(l,u),f=new ys(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new vn(t,n,{type:ie,depthBuffer:!1,stencilBuffer:!1}),c=new vn(t,n,{type:ie,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},an.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Mc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Pc=new hn,Fc=new qi(1,1),Ic=new yn,Lc=new bn,Rc=new Gi,zc=[],Bc=[],Vc=new Float32Array(16),Hc=new Float32Array(9),Uc=new Float32Array(4);function Wc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=zc[i];if(a===void 0&&(a=new Float32Array(i),zc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Gc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Kc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function qc(e,t){let n=Bc[t];n===void 0&&(n=new Int32Array(t),Bc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Jc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Yc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2fv(this.addr,t),Kc(n,t)}}function Xc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Gc(n,t))return;e.uniform3fv(this.addr,t),Kc(n,t)}}function Zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4fv(this.addr,t),Kc(n,t)}}function Qc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Uc.set(r),e.uniformMatrix2fv(this.addr,!1,Uc),Kc(n,r)}}function $c(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Hc.set(r),e.uniformMatrix3fv(this.addr,!1,Hc),Kc(n,r)}}function el(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Vc.set(r),e.uniformMatrix4fv(this.addr,!1,Vc),Kc(n,r)}}function tl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function nl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2iv(this.addr,t),Kc(n,t)}}function rl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gc(n,t))return;e.uniform3iv(this.addr,t),Kc(n,t)}}function il(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4iv(this.addr,t),Kc(n,t)}}function al(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ol(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2uiv(this.addr,t),Kc(n,t)}}function sl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gc(n,t))return;e.uniform3uiv(this.addr,t),Kc(n,t)}}function cl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4uiv(this.addr,t),Kc(n,t)}}function ll(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Fc.compareFunction=n.isReversedDepthBuffer()?518:515,a=Fc):a=Pc,n.setTexture2D(t||a,i)}function ul(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Lc,i)}function dl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Rc,i)}function fl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ic,i)}function pl(e){switch(e){case 5126:return Jc;case 35664:return Yc;case 35665:return Xc;case 35666:return Zc;case 35674:return Qc;case 35675:return $c;case 35676:return el;case 5124:case 35670:return tl;case 35667:case 35671:return nl;case 35668:case 35672:return rl;case 35669:case 35673:return il;case 5125:return al;case 36294:return ol;case 36295:return sl;case 36296:return cl;case 35678:case 36198:case 36298:case 36306:case 35682:return ll;case 35679:case 36299:case 36307:return ul;case 35680:case 36300:case 36308:case 36293:return dl;case 36289:case 36303:case 36311:case 36292:return fl}}function ml(e,t){e.uniform1fv(this.addr,t)}function hl(e,t){let n=Wc(t,this.size,2);e.uniform2fv(this.addr,n)}function gl(e,t){let n=Wc(t,this.size,3);e.uniform3fv(this.addr,n)}function _l(e,t){let n=Wc(t,this.size,4);e.uniform4fv(this.addr,n)}function vl(e,t){let n=Wc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yl(e,t){let n=Wc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function bl(e,t){let n=Wc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xl(e,t){e.uniform1iv(this.addr,t)}function Sl(e,t){e.uniform2iv(this.addr,t)}function Cl(e,t){e.uniform3iv(this.addr,t)}function wl(e,t){e.uniform4iv(this.addr,t)}function Tl(e,t){e.uniform1uiv(this.addr,t)}function El(e,t){e.uniform2uiv(this.addr,t)}function Dl(e,t){e.uniform3uiv(this.addr,t)}function Ol(e,t){e.uniform4uiv(this.addr,t)}function kl(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Fc:Pc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Al(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Lc,a[e])}function jl(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Rc,a[e])}function Ml(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ic,a[e])}function Nl(e){switch(e){case 5126:return ml;case 35664:return hl;case 35665:return gl;case 35666:return _l;case 35674:return vl;case 35675:return yl;case 35676:return bl;case 5124:case 35670:return xl;case 35667:case 35671:return Sl;case 35668:case 35672:return Cl;case 35669:case 35673:return wl;case 5125:return Tl;case 36294:return El;case 36295:return Dl;case 36296:return Ol;case 35678:case 36198:case 36298:case 36306:case 35682:return kl;case 35679:case 36299:case 36307:return Al;case 35680:case 36300:case 36308:case 36293:return jl;case 36289:case 36303:case 36311:case 36292:return Ml}}var Pl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pl(t.type)}},Fl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nl(t.type)}},Il=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ll=/(\w+)(\])?(\[|\.)?/g;function Rl(e,t){e.seq.push(t),e.map[t.id]=t}function zl(e,t,n){let r=e.name,i=r.length;for(Ll.lastIndex=0;;){let a=Ll.exec(r),o=Ll.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Rl(n,l===void 0?new Pl(s,e,t):new Fl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Il(s),Rl(n,e)),n=e}}}var Bl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);zl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Vl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Hl=37297,Ul=0;function Wl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Gl=new z;function Kl(e){an._getMatrix(Gl,an.workingColorSpace,e);let t=`mat3( ${Gl.elements.map(e=>e.toFixed(4))} )`;switch(an.getTransfer(e)){case lt:return[t,`LinearTransferOETF`];case ut:return[t,`sRGBTransferOETF`];default:return P(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function ql(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Wl(e.getShaderSource(t),r)}return i}function Jl(e,t){let n=Kl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Yl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Xl(e,t){let n=Yl[t];return n===void 0?(P(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Zl=new R;function Ql(){return an.getLuminanceCoefficients(Zl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Zl.x.toFixed(4)}, ${Zl.y.toFixed(4)}, ${Zl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function $l(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(nu).join(`
`)}function eu(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function tu(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function nu(e){return e!==``}function ru(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function iu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var au=/^[ \t]*#include +<([\w\d./]+)>/gm;function ou(e){return e.replace(au,cu)}var su=new Map;function cu(e,t){let n=H[t];if(n===void 0){let e=su.get(t);if(e!==void 0)n=H[e],P(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ou(n)}var lu=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uu(e){return e.replace(lu,du)}function du(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function fu(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var pu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function mu(e){return pu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var hu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function gu(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:hu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var _u={302:`ENVMAP_MODE_REFRACTION`};function vu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:_u[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var yu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function bu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:yu[e.combine]||`ENVMAP_BLENDING_NONE`}function xu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Su(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=mu(n),l=gu(n),u=vu(n),d=bu(n),f=xu(n),p=$l(n),m=eu(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nu).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nu).join(`
`),_.length>0&&(_+=`
`)):(g=[fu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(nu).join(`
`),_=[fu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:H.tonemapping_pars_fragment,n.toneMapping===0?``:Xl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,H.colorspace_pars_fragment,Jl(`linearToOutputTexel`,n.outputColorSpace),Ql(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(nu).join(`
`)),o=ou(o),o=ru(o,n),o=iu(o,n),s=ou(s),s=ru(s,n),s=iu(s,n),o=uu(o),s=uu(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Vl(i,i.VERTEX_SHADER,y),S=Vl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=ql(i,x,`vertex`),n=ql(i,S,`fragment`);F(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):P(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Bl(i,h),T=tu(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Hl)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Ul++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Cu=0,wu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Tu(e),t.set(e,n)),n}},Tu=class{constructor(e){this.id=Cu++,this.code=e,this.usedTimes=0}};function Eu(e){return e===1030||e===37490||e===36285}function Du(e,t,n,r,i,a){let o=new Mn,s=new wu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&P(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Js[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let ee=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),ne=h.isInstancedMesh===!0,re=h.isBatchedMesh===!0,ie=!!i.map,ae=!!i.matcap,oe=!!x,se=!!i.aoMap,ce=!!i.lightMap,le=!!i.bumpMap&&i.wireframe===!1,ue=!!i.normalMap,de=!!i.displacementMap,fe=!!i.emissiveMap,pe=!!i.metalnessMap,me=!!i.roughnessMap,he=i.anisotropy>0,ge=i.clearcoat>0,_e=i.dispersion>0,ve=i.retroreflectivity>0,ye=i.iridescence>0,be=i.sheen>0,xe=i.transmission>0,Se=he&&!!i.anisotropyMap,Ce=ge&&!!i.clearcoatMap,we=ge&&!!i.clearcoatNormalMap,Te=ge&&!!i.clearcoatRoughnessMap,Ee=ye&&!!i.iridescenceMap,De=ye&&!!i.iridescenceThicknessMap,Oe=be&&!!i.sheenColorMap,ke=be&&!!i.sheenRoughnessMap,Ae=!!i.specularMap,je=!!i.specularColorMap,Me=!!i.specularIntensityMap,Ne=xe&&!!i.transmissionMap,Pe=xe&&!!i.thicknessMap,Fe=!!i.gradientMap,Ie=!!i.alphaMap,Le=i.alphaTest>0,j=!!i.alphaHash,Re=!!i.extensions,ze=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(ze=e.toneMapping);let Be={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:re,batchingColor:re&&h._colorsTexture!==null,instancing:ne,instancingColor:ne&&h.instanceColor!==null,instancingMorph:ne&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:an.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ie,matcap:ae,envMap:oe,envMapMode:oe&&x.mapping,envMapCubeUVHeight:S,aoMap:se,lightMap:ce,bumpMap:le,normalMap:ue,displacementMap:de,emissiveMap:fe,normalMapObjectSpace:ue&&i.normalMapType===1,normalMapTangentSpace:ue&&i.normalMapType===0,packedNormalMap:ue&&i.normalMapType===0&&Eu(i.normalMap.format),metalnessMap:pe,roughnessMap:me,anisotropy:he,anisotropyMap:Se,clearcoat:ge,clearcoatMap:Ce,clearcoatNormalMap:we,clearcoatRoughnessMap:Te,dispersion:_e,retroreflection:ve,iridescence:ye,iridescenceMap:Ee,iridescenceThicknessMap:De,sheen:be,sheenColorMap:Oe,sheenRoughnessMap:ke,specularMap:Ae,specularColorMap:je,specularIntensityMap:Me,transmission:xe,transmissionMap:Ne,thicknessMap:Pe,gradientMap:Fe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ie,alphaTest:Le,alphaHash:j,combine:i.combine,mapUv:ie&&m(i.map.channel),aoMapUv:se&&m(i.aoMap.channel),lightMapUv:ce&&m(i.lightMap.channel),bumpMapUv:le&&m(i.bumpMap.channel),normalMapUv:ue&&m(i.normalMap.channel),displacementMapUv:de&&m(i.displacementMap.channel),emissiveMapUv:fe&&m(i.emissiveMap.channel),metalnessMapUv:pe&&m(i.metalnessMap.channel),roughnessMapUv:me&&m(i.roughnessMap.channel),anisotropyMapUv:Se&&m(i.anisotropyMap.channel),clearcoatMapUv:Ce&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:we&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ee&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:De&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:ke&&m(i.sheenRoughnessMap.channel),specularMapUv:Ae&&m(i.specularMap.channel),specularColorMapUv:je&&m(i.specularColorMap.channel),specularIntensityMapUv:Me&&m(i.specularIntensityMap.channel),transmissionMapUv:Ne&&m(i.transmissionMap.channel),thicknessMapUv:Pe&&m(i.thicknessMap.channel),alphaMapUv:Ie&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ue||he),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ie||Ie),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ue===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:ze,decodeVideoTexture:ie&&i.map.isVideoTexture===!0&&an.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:fe&&i.emissiveMap.isVideoTexture===!0&&an.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Re&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Re&&i.extensions.multiDraw===!0||re)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Be.vertexUv1s=c.has(1),Be.vertexUv2s=c.has(2),Be.vertexUv3s=c.has(3),c.clear(),Be}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Js[t];n=ko.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Su(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Ou(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function ku(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Au(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ju(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||ku),r.length>1&&r.sort(t||Au),i.length>1&&i.sort(t||Au)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Mu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new ju,e.set(t,[i])):n>=r.length?(i=new ju,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Nu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new R,color:new B};break;case`SpotLight`:n={position:new R,direction:new R,color:new B,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new R,color:new B,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new R,skyColor:new B,groundColor:new B};break;case`RectAreaLight`:n={color:new B,position:new R,halfWidth:new R,halfHeight:new R}}return e[t.id]=n,n}}}function Pu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Fu=0;function Iu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Lu(e){let t=new Nu,n=Pu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new R);let i=new R,a=new xn,o=new xn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Iu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=U.LTC_FLOAT_1,r.rectAreaLTC2=U.LTC_FLOAT_2):(r.rectAreaLTC1=U.LTC_HALF_1,r.rectAreaLTC2=U.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Fu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Ru(e){let t=new Lu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function zu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ru(e),t.set(n,[a])):r>=i.length?(a=new Ru(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Hu=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],Uu=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Wu=new xn,Gu=new R,Ku=new R;function qu(e,t,n){let r=new Li,i=new L,a=new L,o=new gn,s=new Io,c=new Lo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Mo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new L},radius:{value:4}},vertexShader:Bu,fragmentShader:Vu}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Qr;m.setAttribute(`position`,new Lr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new V(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(P(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){P(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){P(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new vn(i.x,i.y,{format:_e,type:ie,minFilter:T,magFilter:T,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new qi(i.x,i.y,re),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=pe,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=S,d.map.depthTexture.magFilter=S}else l.isPointLight?(d.map=new wc(i.x),d.map.depthTexture=new Ji(i.x,ne)):(d.map=new vn(i.x,i.y),d.map.depthTexture=new qi(i.x,i.y,ne)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=pe,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=T,d.map.depthTexture.magFilter=T):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=S,d.map.depthTexture.magFilter=S);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Gu.setFromMatrixPosition(l.matrixWorld),e.position.copy(Gu),Ku.copy(e.position),Ku.add(Hu[t]),e.up.copy(Uu[t]),e.lookAt(Ku),e.updateMatrixWorld(),n.makeTranslation(-Gu.x,-Gu.y,-Gu.z),Wu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Wu,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new vn(i.x,i.y,{format:_e,type:ie}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ju(e,t){function n(){let t=!1,n=new gn,r=null,i=new gn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?pe(e.DEPTH_TEST):me(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Ct[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?pe(e.STENCIL_TEST):me(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new B(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),ne=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),ne=re>=1);let ae=null,oe={},se=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new gn().fromArray(se),ue=new gn().fromArray(ce);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),pe(e.DEPTH_TEST),o.setFunc(3),Se(!1),Ce(1),pe(e.CULL_FACE),be(0);function pe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function me(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function he(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ge(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function _e(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ve={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ve[103]=e.MIN,ve[104]=e.MAX;let ye={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function be(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(me(e.BLEND),g=!1);else if(g===!1&&(pe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:F(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:F(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:F(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:F(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(ve[n],ve[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ye[r],ye[i],ye[o],ye[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function xe(t,n){t.side===2?me(e.CULL_FACE):pe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),Se(r),t.blending===1&&t.transparent===!1?be(0):be(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Te(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?pe(e.SAMPLE_ALPHA_TO_COVERAGE):me(e.SAMPLE_ALPHA_TO_COVERAGE)}function Se(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Ce(t){t===0?me(e.CULL_FACE):(pe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function we(t){t!==k&&(ne&&e.lineWidth(t),k=t)}function Te(t,n,r){t?(pe(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):me(e.POLYGON_OFFSET_FILL)}function Ee(t){t?pe(e.SCISSOR_TEST):me(e.SCISSOR_TEST)}function De(t){t===void 0&&(t=e.TEXTURE0+te-1),ae!==t&&(e.activeTexture(t),ae=t)}function Oe(t,n,r){r===void 0&&(r=ae===null?e.TEXTURE0+te-1:ae);let i=oe[r];i===void 0&&(i={type:void 0,texture:void 0},oe[r]=i),(i.type!==t||i.texture!==n)&&(ae!==r&&(e.activeTexture(r),ae=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function ke(){let t=oe[ae];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ae(){try{e.compressedTexImage2D(...arguments)}catch(e){F(`WebGLState:`,e)}}function je(){try{e.compressedTexImage3D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Me(){try{e.texSubImage2D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Ne(){try{e.texSubImage3D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Pe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Fe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Ie(){try{e.texStorage2D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Le(){try{e.texStorage3D(...arguments)}catch(e){F(`WebGLState:`,e)}}function j(){try{e.texImage2D(...arguments)}catch(e){F(`WebGLState:`,e)}}function Re(){try{e.texImage3D(...arguments)}catch(e){F(`WebGLState:`,e)}}function ze(t){return d[t]===void 0?e.getParameter(t):d[t]}function Be(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function M(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function Ve(t){ue.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ue.copy(t))}function N(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function He(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ue(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ae=null,oe={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new B(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,le.set(0,0,e.canvas.width,e.canvas.height),ue.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:pe,disable:me,bindFramebuffer:he,drawBuffers:ge,useProgram:_e,setBlending:be,setMaterial:xe,setFlipSided:Se,setCullFace:Ce,setLineWidth:we,setPolygonOffset:Te,setScissorTest:Ee,activeTexture:De,bindTexture:Oe,unbindTexture:ke,compressedTexImage2D:Ae,compressedTexImage3D:je,texImage2D:j,texImage3D:Re,pixelStorei:Be,getParameter:ze,updateUBOMapping:N,uniformBlockBinding:He,texStorage2D:Ie,texStorage3D:Le,texSubImage2D:Me,texSubImage3D:Ne,compressedTexSubImage2D:Pe,compressedTexSubImage3D:Fe,scissor:M,viewport:Ve,reset:Ue}}function Yu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new L,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):gt(`canvas`)}function g(e,t,n){let r=1,i=ze(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),P(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&P(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];P(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||P(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?lt:an.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function A(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,P(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ee(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),re(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function ne(e){let t=e.target;t.removeEventListener(`dispose`,ne),ae(t)}function re(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&ie(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function ie(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ae(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let oe=0;function se(){oe=0}function ce(){return oe}function le(e){oe=e}function ue(){let e=oe;return e>=i.maxTextures&&P(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),oe+=1,e}function de(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function fe(t,i){let a=r.get(t);if(t.isVideoTexture&&j(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)P(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)P(`WebGLRenderer: Texture marked for update but image is incomplete`);else{we(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?we(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function he(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?we(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ge(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?Te(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let _e={[y]:e.REPEAT,[b]:e.CLAMP_TO_EDGE,[x]:e.MIRRORED_REPEAT},ve={[S]:e.NEAREST,[C]:e.NEAREST_MIPMAP_NEAREST,[w]:e.NEAREST_MIPMAP_LINEAR,[T]:e.LINEAR,[E]:e.LINEAR_MIPMAP_NEAREST,[D]:e.LINEAR_MIPMAP_LINEAR},ye={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function be(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&P(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,_e[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,_e[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,_e[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ve[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ve[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ye[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function xe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,te));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=de(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ie(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function Se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=Se(n.start,r.width,4),c=Se(t.start,r.width,4);n.start<=i+1&&a===c&&Se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function we(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=xe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=an.getPrimaries(an.workingColorSpace),r=o.colorSpace===``?null:an.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Re(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=k(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);be(c,o);let h,y=o.mipmaps,b=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,S=u.dataReady,C=ee(o,t);if(o.isDepthTexture)m=A(o.format===me,o.type),x&&(b?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){b&&x&&n.texStorage2D(e.TEXTURE_2D,C,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],b?S&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else b?(x&&n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height),S&&Ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){b&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,C,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(b){if(S){if(o.layerUpdates.size>0){let t=Ws(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else P(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else b?S&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{b&&x&&n.texStorage2D(e.TEXTURE_2D,C,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?b?S&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?P(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):b?S&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(b){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,C,m,t.width,t.height,t.depth),S){if(o.layerUpdates.size>0){let i=Ws(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)b?(x&&n.texStorage3D(e.TEXTURE_3D,C,m,t.width,t.height,t.depth),S&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(b)n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<C;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(b&&x){let t=ze(y[0]);n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],b?S&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(b){if(x){let r=ze(t);n.texStorage2D(e.TEXTURE_2D,C,m,r.width,r.height)}S&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Te(t,o,s){if(o.image.length!==6)return;let c=xe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=an.getPrimaries(an.workingColorSpace),r=o.colorSpace===``?null:an.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Re(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),b=a.convert(o.type),x=k(o.internalFormat,y,b,o.normalized,o.colorSpace),S=o.isVideoTexture!==!0,C=u.__version===void 0||c===!0,w=l.dataReady,T=ee(o,h);be(e.TEXTURE_CUBE_MAP,o);let E;if(f){S&&C&&n.texStorage2D(e.TEXTURE_CUBE_MAP,T,x,h.width,h.height);for(let t=0;t<6;t++){E=m[t].mipmaps;for(let r=0;r<E.length;r++){let i=E[r];o.format===1023?S?w&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,b,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,y,b,i.data):y===null?P(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):S?w&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(E=o.mipmaps,S&&C){E.length>0&&T++;let t=ze(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,T,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){S?w&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,b,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,y,b,m[t].data);for(let r=0;r<E.length;r++){let i=E[r].image[t].image;S?w&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,b,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,y,b,i.data)}}else{S?w&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,b,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,y,b,m[t]);for(let r=0;r<E.length;r++){let i=E[r];S?w&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,b,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,y,b,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Ee(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=k(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ie(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=A(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=k(o.internalFormat,c,l,o.normalized,o.colorSpace);Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Oe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,te)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),be(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else fe(i.depthTexture,0);let u=l.__webglTexture,d=Ie(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ke(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Oe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Oe(i.__webglFramebuffer[0],t,0):Oe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),De(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),De(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ae(t,n,i){let a=r.get(t);n!==void 0&&Ee(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ke(t)}function je(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,ne);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Le(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=k(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ie(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),De(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),be(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Ee(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),be(c,a),Ee(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),be(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Ee(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ke(t)}function Me(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=O(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let Ne=[],Pe=[];function Fe(t){if(t.samples>0){if(Le(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ne.length=0,Pe.length=0,Ne.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ne.push(l),Pe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Pe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ne))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ie(e){return Math.min(i.maxSamples,e.samples)}function Le(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function j(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Re(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(an.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&P(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):F(`WebGLTextures: Unsupported texture color space:`,n)),t}function ze(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ue,this.resetTextureUnits=se,this.getTextureUnits=ce,this.setTextureUnits=le,this.setTexture2D=fe,this.setTexture2DArray=pe,this.setTexture3D=he,this.setTextureCube=ge,this.rebindTextures=Ae,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Le,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Xu(e,t){function n(n,r=``){let i,a=an.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Zu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$u=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Yi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Mo({vertexShader:Zu,fragmentShader:Qu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new V(new yo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ed=class extends wt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new $u,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new L,C=null,w=null,T=new gs;T.viewport=new gn;let E=new gs;E.viewport=new gn;let D=[T,E],k=new Ts,A=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Zn,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Zn,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Zn,b[e]=t),t.getHandSpace()};function te(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,te),r.removeEventListener(`selectstart`,te),r.removeEventListener(`selectend`,te),r.removeEventListener(`squeeze`,te),r.removeEventListener(`squeezestart`,te),r.removeEventListener(`squeezeend`,te),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}A=null,ee=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ge.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&P(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&P(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,te),r.addEventListener(`selectstart`,te),r.addEventListener(`selectend`,te),r.addEventListener(`squeeze`,te),r.addEventListener(`squeezestart`,te),r.addEventListener(`squeezeend`,te),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?me:pe,a=_.stencil?se:ne);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new vn(d.textureWidth,d.textureHeight,{format:fe,type:O,depthTexture:new qi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new vn(f.framebufferWidth,f.framebufferHeight,{format:fe,type:O,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ge.setContext(r),ge.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let ae=new R,oe=new R;function ce(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),oe.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(oe),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),k.near=E.near=T.near=t,k.far=E.far=T.far=n,(A!==k.near||ee!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),A=k.near,ee=k.far),k.layers.mask=e.layers.mask|6,T.layers.mask=k.layers.mask&-5,E.layers.mask=k.layers.mask&-3;let i=e.parent,a=k.cameras;le(k,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(k,T,E):k.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ue(e,k,i)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ot*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(k)},this.getCameraTexture=function(e){return g[e]};let de=null;function he(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==k.cameras.length&&(k.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new gs,o.layers.enable(n),o.viewport=new gn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(k.matrix.copy(o.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),i===!0&&k.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Yi,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}de&&de(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ge=new Ks;ge.setAnimationLoop(he),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},td=new xn,nd=new z;nd.set(-1,0,0,0,1,0,0,0,1);function rd(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Oo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(td.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(nd),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function id(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return F(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?P(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):P(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var ad=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),od=null;function sd(){return od===null&&(od=new wi(ad,16,16,_e,ie),od.name=`DFG_LUT`,od.minFilter=T,od.magFilter=T,od.wrapS=b,od.wrapT=b,od.generateMipmaps=!1,od.needsUpdate=!0),od}var cd=class{constructor(e={}){let{canvas:t=_t(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=O}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ye,ve,ge]),g=new Set([O,ne,ee,se,ae,oe]),_=new Uint32Array(4),v=new Int32Array(4),y=new R,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,k=null,A=null,te=null,re=null;this._outputColorSpace=st;let ce=0,le=0,ue=null,de=-1,fe=null,pe=new gn,me=new gn,he=null,_e=new B(0),be=0,xe=t.width,Se=t.height,Ce=1,we=null,Te=null,Ee=new gn(0,0,xe,Se),De=new gn(0,0,xe,Se),Oe=!1,ke=new Li,Ae=!1,je=!1,Me=new xn,Ne=new R,Pe=new gn,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Le(){return ue===null?Ce:1}let j=n;function Re(e,n){return t.getContext(e,n)}let ze,Be,M,Ve,N,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,lt,!1),t.addEventListener(`webglcontextrestored`,ut,!1),t.addEventListener(`webglcontextcreationerror`,dt,!1),j===null){let t=`webgl2`;if(j=Re(t,e),j===null)throw Re(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ot()}catch(e){throw t.removeEventListener(`webglcontextlost`,lt,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),F(`WebGLRenderer: `+e.message),e}function ot(){ze=new Ec(j),ze.init(),rt=new Xu(j,ze),Be=new tc(j,ze,e,rt),M=new Ju(j,ze),Be.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),A=j.createFramebuffer(),te=j.createFramebuffer(),re=j.createFramebuffer(),Ve=new kc(j),N=new Ou,He=new Yu(j,ze,M,N,Be,rt,Ve),Ue=new Tc(T),We=new qs(j),it=new $s(j,We),Ge=new Dc(j,We,Ve,it),Ke=new jc(j,Ge,We,it,Ve),et=new Ac(j,Be,He),Ze=new nc(N),qe=new Du(T,Ue,ze,Be,it,Ze),Je=new rd(T,N),Ye=new Mu,Xe=new zu(ze),$e=new Qs(T,Ue,M,Ke,p,s),Qe=new qu(T,Ke,Be),at=new id(j,Ve,Be,M),tt=new ec(j,ze,Ve),nt=new Oc(j,ze,Ve),Ve.programs=qe.programs,T.capabilities=Be,T.extensions=ze,T.properties=N,T.renderLists=Ye,T.shadowMap=Qe,T.state=M,T.info=Ve}m!==1009&&(w=new Nc(m,t.width,t.height,o,r,i));let ct=new ed(T,j);this.xr=ct,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return Ce},this.setPixelRatio=function(e){e!==void 0&&(Ce=e,this.setSize(xe,Se,!1))},this.getSize=function(e){return e.set(xe,Se)},this.setSize=function(e,n,r=!0){ct.isPresenting?P(`WebGLRenderer: Can't change size while VR device is presenting.`):(xe=e,Se=n,t.width=Math.floor(e*Ce),t.height=Math.floor(n*Ce),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(xe*Ce,Se*Ce).floor()},this.setDrawingBufferSize=function(e,n,r){xe=e,Se=n,Ce=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)F(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){P(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Ee)},this.setViewport=function(e,t,n,r){e.isVector4?Ee.set(e.x,e.y,e.z,e.w):Ee.set(e,t,n,r),M.viewport(pe.copy(Ee).multiplyScalar(Ce).round())},this.getScissor=function(e){return e.copy(De)},this.setScissor=function(e,t,n,r){e.isVector4?De.set(e.x,e.y,e.z,e.w):De.set(e,t,n,r),M.scissor(me.copy(De).multiplyScalar(Ce).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(e){M.setScissorTest(Oe=e)},this.setOpaqueSort=function(e){we=e},this.setTransparentSort=function(e){Te=e},this.getClearColor=function(e){return e.copy($e.getClearColor())},this.setClearColor=function(){$e.setClearColor(...arguments)},this.getClearAlpha=function(){return $e.getClearAlpha()},this.setClearAlpha=function(){$e.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(ue!==null){let t=ue.texture.format;e=h.has(t)}if(e){let e=ue.texture.type,t=g.has(e),n=$e.getClearColor(),r=$e.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,j.clearBufferuiv(j.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,j.clearBufferiv(j.COLOR,0,v))}else r|=j.COLOR_BUFFER_BIT}t&&(r|=j.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&j.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),k=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,lt,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),$e.dispose(),Ye.dispose(),Xe.dispose(),N.dispose(),Ue.dispose(),Ke.dispose(),it.dispose(),at.dispose(),qe.dispose(),ct.dispose(),ct.removeEventListener(`sessionstart`,xt),ct.removeEventListener(`sessionend`,Ct),wt.stop()};function lt(e){e.preventDefault(),yt(`WebGLRenderer: Context Lost.`),E=!0}function ut(){yt(`WebGLRenderer: Context Restored.`),E=!1;let e=Ve.autoReset,t=Qe.enabled,n=Qe.autoUpdate,r=Qe.needsUpdate,i=Qe.type;ot(),Ve.autoReset=e,Qe.enabled=t,Qe.autoUpdate=n,Qe.needsUpdate=r,Qe.type=i}function dt(e){F(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ft(e){let t=e.target;t.removeEventListener(`dispose`,ft),mt(t)}function mt(e){ht(e),N.remove(e)}function ht(e){let t=N.get(e).programs;t!==void 0&&(t.forEach(function(e){qe.releaseProgram(e)}),e.isShaderMaterial&&qe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Fe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Nt(e,t,n,r,i);M.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ge.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;it.setup(i,r,s,n,c);let h,g=tt;if(c!==null&&(h=We.get(c),g=nt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(M.setLineWidth(r.wireframeLinewidth*Le()),g.setMode(j.LINES)):g.setMode(j.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),M.setLineWidth(e*Le()),i.isLineSegments?g.setMode(j.LINES):i.isLineLoop?g.setMode(j.LINE_LOOP):g.setMode(j.LINE_STRIP)}else i.isPoints?g.setMode(j.POINTS):i.isSprite&&g.setMode(j.TRIANGLES);if(i.isBatchedMesh){if(ze.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?We.get(c).bytesPerElement:1,o=N.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(j,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function gt(e,t,n,r){k!==null&&e.isNodeMaterial&&k.setObject(r,e),Ae===!0&&Ze.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,I(e,t,r),e.side=0,e.needsUpdate=!0,I(e,t,r),e.side=2):I(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),k!==null&&k.renderStart(e,t,n),x=Xe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),k!==null&&k.updateLights(x.state.lightsArray),je=this.localClippingEnabled,Ae=Ze.init(this.clippingPlanes,je),Ae===!0&&Ze.setGlobalState(this.clippingPlanes,t),k!==null&&Qe.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];gt(o,n,t,e),r.add(o)}else gt(i,n,t,e),r.add(i)}}),x=C.pop(),k!==null&&k.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=N.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}ze.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let vt=null;function bt(e){vt&&vt(e)}function xt(){wt.stop()}function Ct(){wt.start()}let wt=new Ks;wt.setAnimationLoop(bt),typeof self<`u`&&wt.setContext(self),this.setAnimationLoop=function(e){vt=e,ct.setAnimationLoop(e),e===null?wt.stop():wt.start()},ct.addEventListener(`sessionstart`,xt),ct.addEventListener(`sessionend`,Ct),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){F(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;k!==null&&k.renderStart(e,t);let n=ct.enabled===!0&&ct.isPresenting===!0,r=w!==null&&(ue===null||n)&&w.begin(T,ue);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(t),t=ct.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,ue),x=Xe.get(e,C.length),x.init(t),x.state.textureUnits=He.getTextureUnits(),C.push(x),Me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ke.setFromProjectionMatrix(Me,pt,t.reversedDepth),je=this.localClippingEnabled,Ae=Ze.init(this.clippingPlanes,je),b=Ye.get(e,S.length),b.init(),S.push(b),ct.enabled===!0&&ct.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&Tt(e,t,-1/0,T.sortObjects)}Tt(e,t,0,T.sortObjects),b.finish(),k!==null&&k.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(we,Te),Ie=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,Ie&&$e.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ae===!0&&Ze.beginShadows();let i=x.state.shadowsArray;if(Qe.render(i,e,t),Ae===!0&&Ze.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Dt(n,r,e,a)}Ie&&$e.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Et(b,e,n,n.viewport)}}else r.length>0&&Dt(n,r,e,t),Ie&&$e.render(e),Et(b,e,t)}ue!==null&&le===0&&(He.updateMultisampleRenderTarget(ue),He.updateRenderTargetMipmap(ue)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),it.resetDefaultState(),de=-1,fe=null,C.pop(),C.length>0?(x=C[C.length-1],He.setTextureUnits(x.state.textureUnits),Ae===!0&&Ze.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,k!==null&&k.renderEnd()};function Tt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ke)){r&&Pe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Me);let i=Ke.update(e),a=e.material;a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ke))){let i=Ke.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Pe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Pe.copy(e.boundingSphere.center)),Pe.applyMatrix4(e.matrixWorld).applyMatrix4(Me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,Pe.z,s,t)}}else a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Tt(i[e],t,n,r)}function Et(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Ae===!0&&Ze.setGlobalState(T.clippingPlanes,n),r&&M.viewport(pe.copy(r)),i.length>0&&Ot(i,t,n),a.length>0&&Ot(a,t,n),o.length>0&&Ot(o,t,n),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Dt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ze.has(`EXT_color_buffer_half_float`)||ze.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new vn(1,1,{generateMipmaps:!0,type:e?ie:O,minFilter:D,samples:Math.max(4,Be.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:an.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(_e),be=T.getClearAlpha(),be<1&&T.setClearColor(16777215,.5),T.clear(),Ie&&$e.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Ae===!0&&Ze.setGlobalState(T.clippingPlanes,r),Ot(e,n,r),He.updateMultisampleRenderTarget(a),He.updateRenderTargetMipmap(a),ze.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,kt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(He.updateMultisampleRenderTarget(a),He.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(_e,be),d!==void 0&&(r.viewport=d),T.toneMapping=u}function Ot(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&kt(o,t,n,s,l,c)}}function kt(e,t,n,r,i,a){k!==null&&i.isNodeMaterial&&k.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function I(e,t,n){t.isScene!==!0&&(t=Fe);let r=N.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=qe.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=qe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ue.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ft),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return jt(e,s),d}else s.uniforms=qe.getUniforms(e),k!==null&&e.isNodeMaterial&&k.build(e,n,s),e.onBeforeCompile(s,T),d=qe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ze.uniform),jt(e,s),r.needsLights=Ft(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function At(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Bl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function jt(e,t){let n=N.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Mt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function Nt(e,t,n,r,i){t.isScene!==!0&&(t=Fe),He.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=ue===null?T.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:an.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ue.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=N.get(r),y=x.state.lights;if(Ae===!0&&(je===!0||e!==fe)){let t=e===fe&&r.id===de;Ze.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ze.numPlanes||v.numIntersection!==Ze.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=I(r,t,i),k&&r.isNodeMaterial&&k.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,D=S.getUniforms(),O=v.uniforms;if(M.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==de&&(de=r.id,w=!0),v.needsLights){let e=Mt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||fe!==e){M.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),D.setValue(j,`projectionMatrix`,e.projectionMatrix),D.setValue(j,`viewMatrix`,e.matrixWorldInverse);let t=D.map.cameraPosition;t!==void 0&&t.setValue(j,Ne.setFromMatrixPosition(e.matrixWorld)),Be.logarithmicDepthBuffer&&D.setValue(j,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&D.setValue(j,`isOrthographic`,e.isOrthographicCamera===!0),fe!==e&&(fe=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&D.setValue(j,`sunShadowMap`,y.state.sunShadowMap,He),y.state.directionalShadowMap.length>0&&D.setValue(j,`directionalShadowMap`,y.state.directionalShadowMap,He),y.state.spotShadowMap.length>0&&D.setValue(j,`spotShadowMap`,y.state.spotShadowMap,He),y.state.pointShadowMap.length>0&&D.setValue(j,`pointShadowMap`,y.state.pointShadowMap,He)),i.isSkinnedMesh){D.setOptional(j,i,`bindMatrix`),D.setOptional(j,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),D.setValue(j,`boneTexture`,e.boneTexture,He))}i.isBatchedMesh&&(D.setOptional(j,i,`batchingTexture`),D.setValue(j,`batchingTexture`,i._matricesTexture,He),D.setOptional(j,i,`batchingIdTexture`),D.setValue(j,`batchingIdTexture`,i._indirectTexture,He),D.setOptional(j,i,`batchingColorTexture`),i._colorsTexture!==null&&D.setValue(j,`batchingColorTexture`,i._colorsTexture,He));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&et.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,D.setValue(j,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(O.envMapIntensity.value=t.environmentIntensity),O.dfgLUT!==void 0&&(O.dfgLUT.value=sd()),w){if(D.setValue(j,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Pt(O,E),a&&r.fog===!0&&Je.refreshFogUniforms(O,a),Je.refreshMaterialUniforms(O,r,Ce,Se,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;O.probesSH.value=e.texture,O.probesMin.value.copy(e.boundingBox.min),O.probesMax.value.copy(e.boundingBox.max),O.probesResolution.value.copy(e.resolution)}Bl.upload(j,At(v),O,He)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Bl.upload(j,At(v),O,He),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&D.setValue(j,`center`,i.center),D.setValue(j,`modelViewMatrix`,i.modelViewMatrix),D.setValue(j,`normalMatrix`,i.normalMatrix),D.setValue(j,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];at.update(n,S),at.bind(n,S)}}return S}function Pt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Ft(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return ue},this.setRenderTargetTextures=function(e,t,n){let r=N.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),N.get(e.texture).__webglTexture=t,N.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=N.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){ue=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=N.get(e);if(o.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(j.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest,M.viewport(pe),M.scissor(me),M.setScissorTest(he),de=-1;return}if(o.__webglFramebuffer===void 0)He.setupRenderTarget(e);else if(o.__hasExternalTextures)He.rebindTextures(e,N.get(e.texture).__webglTexture,N.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&N.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);He.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=N.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&He.useMultisampledRTT(e)===!1?N.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest}else pe.copy(Ee).multiplyScalar(Ce).floor(),me.copy(De).multiplyScalar(Ce).floor(),he=Oe;if(n!==0&&(r=A),M.bindFramebuffer(j.FRAMEBUFFER,r)&&M.drawBuffers(e,r),M.viewport(pe),M.scissor(me),M.setScissorTest(he),i){let r=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=N.get(e.textures[t]);j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,t.__webglTexture,n)}de=-1};function It(e){let t=N.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Be.textureFormatReadable(e.format),t.__typeReadable=Be.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){F(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){M.bindFramebuffer(j.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let u=It(o);if(u.__formatReadable===!1){F(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){F(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&j.readPixels(t,n,r,i,rt.convert(c),rt.convert(l),a)}finally{let e=ue===null?null:N.get(ue).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){M.bindFramebuffer(j.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let d=It(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.bufferData(j.PIXEL_PACK_BUFFER,a.byteLength,j.STREAM_READ),j.readPixels(t,n,r,i,rt.convert(l),rt.convert(u),0),j.bindBuffer(j.PIXEL_PACK_BUFFER,null);let p=ue===null?null:N.get(ue).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,p);let m=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await St(j,m,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,a),j.bindBuffer(j.PIXEL_PACK_BUFFER,null),j.deleteBuffer(f),j.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;He.setTexture2D(e,0),j.copyTexSubImage2D(j.TEXTURE_2D,n,0,0,o,s,i,a),M.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=rt.convert(t.format),_=rt.convert(t.type),v;t.isData3DTexture?(He.setTexture3D(t,0),v=j.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(He.setTexture2DArray(t,0),v=j.TEXTURE_2D_ARRAY):(He.setTexture2D(t,0),v=j.TEXTURE_2D),M.activeTexture(j.TEXTURE0),M.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(j.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(j.UNPACK_ROW_LENGTH),b=M.getParameter(j.UNPACK_IMAGE_HEIGHT),x=M.getParameter(j.UNPACK_SKIP_PIXELS),S=M.getParameter(j.UNPACK_SKIP_ROWS),C=M.getParameter(j.UNPACK_SKIP_IMAGES);M.pixelStorei(j.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(j.UNPACK_SKIP_PIXELS,l),M.pixelStorei(j.UNPACK_SKIP_ROWS,u),M.pixelStorei(j.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=N.get(e),r=N.get(t),h=N.get(n.__renderTarget),g=N.get(r.__renderTarget);M.bindFramebuffer(j.READ_FRAMEBUFFER,h.__webglFramebuffer),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(e).__webglTexture,i,d+n),j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(t).__webglTexture,a,m+n)),j.blitFramebuffer(l,u,o,s,f,p,o,s,j.DEPTH_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||N.has(e)){let n=N.get(e),r=N.get(t);M.bindFramebuffer(j.READ_FRAMEBUFFER,te),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,re);for(let e=0;e<c;e++)w?j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):j.framebufferTexture2D(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,n.__webglTexture,i),T?j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):j.framebufferTexture2D(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,r.__webglTexture,a),i===0?T?j.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):j.copyTexSubImage2D(v,a,f,p,l,u,o,s):j.blitFramebuffer(l,u,o,s,f,p,o,s,j.COLOR_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?j.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?j.compressedTexSubImage2D(j.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(j.UNPACK_ROW_LENGTH,y),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(j.UNPACK_SKIP_PIXELS,x),M.pixelStorei(j.UNPACK_SKIP_ROWS,S),M.pixelStorei(j.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&j.generateMipmap(v),M.unbindTexture()},this.initRenderTarget=function(e){N.get(e).__webglFramebuffer===void 0&&He.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?He.setTextureCube(e,0):e.isData3DTexture?He.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?He.setTexture2DArray(e,0):He.setTexture2D(e,0),M.unbindTexture()},this.resetState=function(){ce=0,le=0,ue=null,M.reset(),it.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return pt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=an._getDrawingBufferColorSpace(e),t.unpackColorSpace=an._getUnpackColorSpace()}},ld=`lafinca-v2`,ud=[0,0,20,55,110,190,300,450,650,900,1200];function dd(e){if(e<ud.length)return ud[e];let t=e-ud.length+1;return ud[ud.length-1]+t*300+t*t*45}var fd={egg:{name:`Huevo`,plural:`Huevos`,sell:5,xp:1},tomato:{name:`Tomate`,plural:`Tomates`,sell:12,xp:3},cane:{name:`Caña`,plural:`Cañas`,sell:32,xp:6},tobacco:{name:`Tabaco`,plural:`Hojas de tabaco`,sell:70,xp:10},ketchup:{name:`Kétchup`,plural:`Pomos de kétchup`,sell:48,xp:6},guarapo:{name:`Guarapo`,plural:`Jarras de guarapo`,sell:85,xp:8},leche:{name:`Leche`,plural:`Cantinas de leche`,sell:30,xp:3},queso:{name:`Queso de cabra`,plural:`Quesos de cabra`,sell:55,xp:5},carne:{name:`Carne de puerco`,plural:`Piezas de puerco`,sell:95,xp:8},melao:{name:`Melao de caña`,plural:`Botellas de melao`,sell:80,xp:7},azucar:{name:`Azúcar`,plural:`Sacos de azúcar`,sell:125,xp:10},puros:{name:`Tabacos`,plural:`Cajas de tabacos`,sell:260,xp:18},mango:{name:`Mango`,plural:`Mangos`,sell:8,xp:1},guayaba:{name:`Guayaba`,plural:`Guayabas`,sell:10,xp:1},coco:{name:`Coco`,plural:`Cocos`,sell:14,xp:2},jutia:{name:`Jutía`,plural:`Jutías`,sell:40,xp:4},jibaro:{name:`Puerco jíbaro`,plural:`Puercos jíbaros`,sell:70,xp:6}},pd=[`egg`,`tomato`,`cane`,`tobacco`,`ketchup`,`guarapo`,`leche`,`queso`,`carne`,`melao`,`azucar`,`puros`,`mango`,`guayaba`,`coco`,`jutia`,`jibaro`],md={tomato:{name:`Tomate`,seedName:`Semilla de tomate`,seed:5,grow:60,level:1,item:`tomato`,xpPlant:1},cane:{name:`Caña de azúcar`,seedName:`Esqueje de caña`,seed:10,grow:180,level:3,item:`cane`,xpPlant:1},tobacco:{name:`Tabaco`,seedName:`Semilla de tabaco`,seed:20,grow:300,level:4,item:`tobacco`,xpPlant:2}},hd=[`tomato`,`cane`,`tobacco`],gd={ketchup:{name:`Kétchup`,needs:{tomato:3},time:30,level:2,out:`ketchup`,where:[`kitchen`,`fogon2`]},guarapo:{name:`Guarapo`,needs:{cane:2},time:45,level:5,out:`guarapo`,where:[`kitchen`,`fogon2`]},melao:{name:`Melao de caña`,needs:{cane:2},time:60,level:12,out:`melao`,where:[`trapiche`]},azucar:{name:`Azúcar`,needs:{cane:3},time:90,level:12,out:`azucar`,where:[`trapiche`]},puros:{name:`Tabacos torcidos`,needs:{tobacco:3},time:120,level:15,out:`puros`,where:[`casaTabaco`]}},_d={chicken:28,chickenStep:1.25,coop:90,abono:120,storage:[60,220,600,1500]},vd=[20,40,80,150,250],yd=[2,5,9,14],bd=[0,0,15,30],xd=.3,Sd=.8,Cd=1.45,wd=[9.5,13.8,18.1,22.4],Td=6.5,Ed=[9417635,8361904,11884874,14272928,9214558,7311242,13209162],Dd={recolector:{who:`Pancho`,name:`Recolector de huevos`,detail:`Junta los huevos del corral y los guarda en la canasta.`,price:30,level:1,icon:`egg`,look:{shirt:7311272,hat:14270602,scarf:12073518,skin:12946524}},regador:{who:`Yoel`,name:`Regador`,detail:`Riega las matas que están creciendo (crecen un 30 % más rápido).`,price:55,level:2,icon:`water`,look:{shirt:15262416,hat:8018486,scarf:4157350,skin:9067066}},sembrador:{who:`María`,name:`Sembradora`,detail:`Siembra en canteros vacíos con tus semillas. Puede comprarlas sola si quieres.`,price:70,level:2,icon:`seed`,look:{shirt:14133578,hat:14731414,scarf:null,skin:14264186,skirt:6057866}},cosechador:{who:`Cachita`,name:`Cosechadora`,detail:`Cosecha lo que está maduro y lo guarda.`,price:90,level:3,icon:`tomato`,look:{shirt:13194858,hat:14270602,scarf:15918788,skin:8014382,skirt:15260864}},cocinera:{who:`Caridad`,name:`Cocinera`,detail:`Prende el fogón, hace kétchup y guarapo y recoge lo que sale.`,price:180,level:4,icon:`ketchup`,look:{shirt:15789280,hat:null,scarf:14240314,skin:11565136,skirt:12080970}},camionero:{who:`Chucho`,name:`Camionero`,tag:`Vende a los camiones por ti`,detail:`Espera en el andén, trae del bohío lo que pide el camión, lo carga y cobra. Si piden lo que no hay, espera un poco y lo despide. Puede vender lo que sobra.`,price:45,level:2,icon:`truck`,look:{shirt:6258511,hat:3813416,scarf:14727242,skin:14725258}},lenador:{who:`Tato`,name:`Leñador`,detail:`Va a la manigua con su machete, tumba guásimas y marabú y trae la madera al bohío.`,price:120,level:4,icon:`wood`,zone:`manigua`,look:{shirt:9067066,hat:13215850,scarf:3104058,skin:10118208}}},Od=[5,10,20,40],kd=[`recolector`,`regador`,`sembrador`,`cosechador`,`cocinera`,`camionero`,`lenador`],Ad=[null,{walk:2.6,work:1.4,rest:1.6},{walk:3.3,work:.9,rest:.9},{walk:4.1,work:.55,rest:.4}],jd=(e,t)=>Math.round(Dd[e].price*(t===1?.8:1.6)+20),Md=[1,5,20],Nd=.1,Pd={x0:4,z0:4,x1:14,z1:12},Fd={x0:15,x1:16},Id=[{id:`este`,name:`El cantero del este`,blurb:`Tierra roja al otro lado del camino.`,price:40,level:1,rect:{x0:17,z0:3,x1:20,z1:13},plots:Gd(18,5,19,9),palms:[[20,4],[20,12],[17,12]]},{id:`norte`,name:`La vega de tabaco`,blurb:`Canteros grandes y la casa de tabaco.`,price:150,level:3,rect:{x0:4,z0:0,x1:14,z1:3},plots:Gd(9,1,13,2),palms:[[4,0],[14,0],[7,3]],decor:[{kind:`tobaccoHouse`,x:4,z:1,w:3,h:2}]},{id:`oeste`,name:`El patio de atrás`,blurb:`Más canteros detrás del bohío.`,price:320,level:5,rect:{x0:0,z0:3,x1:3,z1:13},plots:Gd(1,6,2,11),palms:[[0,3],[3,4],[0,13]]},{id:`sur`,name:`El cañaveral`,blurb:`El pedazo grande, para cuando la finca crezca.`,price:600,level:7,rect:{x0:4,z0:13,x1:14,z1:17},plots:Gd(5,14,12,15),palms:[[4,16],[14,17],[9,17],[4,13]]}],W={anden:{name:`Segundo andén`,detail:`Se cargan dos camiones a la vez.`,price:450,level:6,kind:`dock`,parcel:`esquinita`,x:17,z:14,w:2,h:2},vacas:{madera:6,name:`Corral de vacas`,detail:`Dos vacas dan 2 cantinas de leche cada 2 min.`,price:700,level:8,kind:`animal`,parcel:`potrero`,x:23,z:2,w:4,h:3,animal:`cow`,n:2,produce:{item:`leche`,qty:2,time:120}},chivos:{madera:6,name:`Corral de chivos`,detail:`Las chivas dan queso cada 2 min y medio.`,price:820,level:9,kind:`animal`,parcel:`loma`,x:23,z:13,w:3,h:3,animal:`goat`,n:3,produce:{item:`queso`,qty:1,time:150}},pozo:{madera:8,name:`Pozo con molino`,detail:`Regar quita 45 % del tiempo restante (antes 30 %).`,price:600,level:10,kind:`boost`,parcel:`platanal`,x:2,z:20,w:2,h:2},cerdos:{madera:12,name:`Chiquero`,detail:`Los puercos dan una pieza de carne cada 4 min.`,price:1e3,level:11,kind:`animal`,parcel:`arrozal`,x:11,z:19,w:3,h:3,animal:`pig`,n:3,produce:{item:`carne`,qty:1,time:240}},trapiche:{madera:20,name:`Trapiche`,detail:`Muele caña: melao y azúcar.`,price:1300,level:12,kind:`proc`,parcel:`trapiche`,x:19,z:20,w:3,h:2},gallinero2:{madera:12,name:`Gallinero grande`,detail:`Más gallinas: 4 huevos cada minuto y medio, en su cesta.`,price:900,level:13,kind:`animal`,parcel:`monte`,x:30,z:4,w:3,h:3,animal:`hen`,n:4,produce:{item:`egg`,qty:4,time:90}},fogon2:{madera:10,name:`Segundo fogón`,detail:`Otro fogón para kétchup y guarapo.`,price:1100,level:14,kind:`proc`,parcel:`sabana`,x:30,z:16,w:2,h:2},casaTabaco:{madera:20,name:`Casa de curar tabaco`,detail:`Tuerce las hojas en tabacos.`,price:1800,level:15,kind:`proc`,parcel:`vega_sur`,x:3,z:28,w:3,h:2}};[[1,43,5,120,8],[5,43,5,150,10],[9,43,6,190,12],[18,43,7,240,14],[22,43,8,300,16],[26,43,10,380,18],[18,53,12,480,20],[22,53,14,600,22]].forEach(([e,t,n,r,i],a)=>{W[`casa${a+1}`]={name:`Casa ${a+1} del batey`,detail:`Un bohío para los trabajadores: +1 al tope. Se mejora a casa de zinc (+2).`,price:r,madera:i,level:n,kind:`house`,zone:`batey`,x:e,z:t,w:3,h:3,cap:1,upgrade:{level:Math.max(9,n+2),price:Math.round(r*2.2),madera:i+10,cap:2,name:`Casa de zinc`}}}),Object.assign(W,{bodega:{name:`La bodega`,detail:`La tiendita del batey: semillas y gallinas 15 % más baratas.`,price:250,madera:12,level:6,kind:`civic`,zone:`batey`,x:18,z:48,w:4,h:3,effect:{discount:.15}},escuela:{name:`La escuelita`,detail:`Los niños del batey aprenden y tú también: +10 % de XP.`,price:900,madera:30,level:12,kind:`civic`,zone:`batey`,x:24,z:48,w:4,h:3,effect:{xp:.1}},iglesia:{name:`La iglesita`,detail:`Campanas los domingos: +5 % en los pedidos de los camiones.`,price:1200,madera:40,level:14,kind:`civic`,zone:`batey`,x:1,z:53,w:4,h:4,effect:{pay:.05}}});var Ld=[`anden`,`vacas`,`chivos`,`pozo`,`cerdos`,`trapiche`,`gallinero2`,`fogon2`,`casaTabaco`],Rd=[`casa1`,`casa2`,`casa3`,`bodega`,`casa4`,`casa5`,`casa6`,`escuela`,`casa7`,`iglesia`,`casa8`],zd={rock:{name:`Piedras`,verb:`Quitar las piedras`,base:6,xp:2},marabu:{name:`Marabú`,verb:`Chapear el marabú`,base:10,xp:3},stump:{name:`Tocón viejo`,verb:`Sacar el tocón`,base:8,xp:2}};function Bd(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Vd(e,t){let n=Bd(t),{x0:r,z0:i,x1:a,z1:o}=e.rect,s=Object.entries(W).find(([,t])=>t.parcel===e.id),c=s?{id:s[0],x:s[1].x,z:s[1].z,w:s[1].w,h:s[1].h}:null,l=(e,t)=>c&&e>=c.x-1&&e<=c.x+c.w&&t>=c.z-1&&t<=c.z+c.h,u=[[r,i],[a,o],[a,i]].filter(([e,t])=>!(e>=15&&e<=16)&&!l(e,t)).slice(0,2+t%2),d=new Set(u.map(([e,t])=>`${e},${t}`)),f=[];for(let t=i+1,n=0;t<=o-1;t++,n++)if(n%3!=2)for(let n=r+1;n<=a-1;n++)n>=15&&n<=16||l(n,t)||d.has(`${n},${t}`)||f.length<e.plots&&f.push([n,t]);f.forEach(([e,t])=>d.add(`${e},${t}`));let p=e.obstacles||[`rock`,`marabu`,`stump`],m=[],h=0;for(let[t,r]of f)n()<(e.covered??.3)&&m.push({id:`${e.id}-${h++}`,kind:p[Math.floor(n()*p.length)],x:t,z:r});for(let t=i;t<=o;t++)for(let i=r;i<=a;i++)i>=15&&i<=16||d.has(`${i},${t}`)||l(i,t)||n()<(e.wild??.07)&&m.push({id:`${e.id}-${h++}`,kind:p[Math.floor(n()*p.length)],x:i,z:t});for(let t of m)t.cost=zd[t.kind].base+Math.round(e.level*(t.kind===`marabu`?3:2));return{...e,plots:f,palms:u,obstacles:m,site:c}}var Hd=[{id:`cuarton`,name:`El cuartón`,blurb:`Un pedacito con piedras al norte del camino.`,price:90,level:2,rect:{x0:17,z0:0,x1:20,z1:2},plots:4,obstacles:[`rock`],covered:.5},{id:`rinconada`,name:`La rinconada`,blurb:`Rincón de marabú detrás del bohío.`,price:220,level:4,rect:{x0:0,z0:14,x1:3,z1:17},plots:4,obstacles:[`marabu`]},{id:`esquinita`,name:`La esquinita`,blurb:`Junto al camino: solar para un segundo andén.`,price:380,level:6,rect:{x0:17,z0:14,x1:20,z1:17},plots:4,obstacles:[`stump`,`rock`]},{id:`potrero`,name:`El potrero`,blurb:`Pasto para un corral de vacas.`,price:650,level:8,rect:{x0:21,z0:0,x1:27,z1:8},plots:10},{id:`loma`,name:`La loma`,blurb:`Lomita con espacio para chivos.`,price:800,level:9,rect:{x0:21,z0:9,x1:27,z1:17},plots:10},{id:`platanal`,name:`El platanal`,blurb:`Tierra húmeda: aquí va el pozo.`,price:950,level:10,rect:{x0:0,z0:18,x1:6,z1:25},plots:12,obstacles:[`marabu`,`stump`]},{id:`arrozal`,name:`El arrozal`,blurb:`Llano grande con solar para el chiquero.`,price:1100,level:11,rect:{x0:7,z0:18,x1:14,z1:25},plots:14},{id:`trapiche`,name:`El batey del trapiche`,blurb:`Al otro lado del camino: muele tu caña.`,price:1300,level:12,rect:{x0:17,z0:18,x1:27,z1:25},plots:16},{id:`monte`,name:`El monte`,blurb:`Mucho marabú, pero tierra buena.`,price:1500,level:13,rect:{x0:28,z0:0,x1:35,z1:12},plots:18,obstacles:[`marabu`],covered:.45,wild:.12},{id:`sabana`,name:`La sabana`,blurb:`Abierta y llana, con solar para otro fogón.`,price:1750,level:14,rect:{x0:28,z0:13,x1:35,z1:25},plots:18},{id:`vega_sur`,name:`La vega del sur`,blurb:`Para tabaco del bueno y su casa de curar.`,price:2e3,level:15,rect:{x0:0,z0:26,x1:14,z1:32},plots:22},{id:`lagunita`,name:`La lagunita`,blurb:`Tierra fresca junto al camino.`,price:2300,level:16,rect:{x0:17,z0:26,x1:27,z1:32},plots:16,obstacles:[`stump`,`rock`]},{id:`canada`,name:`La cañada`,blurb:`Al fondo del monte, tierra negra.`,price:2600,level:17,rect:{x0:36,z0:0,x1:45,z1:12},plots:22,obstacles:[`marabu`,`stump`],covered:.4},{id:`mangos`,name:`Los mangos`,blurb:`Sombra de mangos viejos y buena tierra.`,price:2900,level:18,rect:{x0:36,z0:13,x1:45,z1:25},plots:22},{id:`fondo`,name:`El fondo`,blurb:`La parte más baja de la finca.`,price:3300,level:19,rect:{x0:0,z0:33,x1:14,z1:39},plots:24},{id:`caminoreal`,name:`El camino real`,blurb:`A los dos lados de la entrada de los camiones.`,price:3700,level:20,rect:{x0:17,z0:33,x1:27,z1:39},plots:18},{id:`ojodeagua`,name:`El ojo de agua`,blurb:`Manantial y monte cerrado.`,price:4200,level:21,rect:{x0:28,z0:26,x1:35,z1:39},plots:20,obstacles:[`marabu`,`rock`],covered:.4},{id:`lavuelta`,name:`La vuelta de abajo`,blurb:`La última esquina: ¡la finca completa!`,price:5e3,level:22,rect:{x0:36,z0:26,x1:45,z1:39},plots:26}],Ud=[...Id.map(e=>({...e,obstacles:[],site:null})),...Hd.map((e,t)=>Vd(e,1e3+t*37))],Wd=Ud.flatMap(e=>e.obstacles.map(t=>({...t,parcel:e.id})));function Gd(e,t,n,r){let i=[];for(let a=t;a<=r;a++)for(let t=e;t<=n;t++)i.push([t,a]);return i}var Kd={house:{x:5,z:4,w:3,h:3,name:`El bohío`},coop:{x:9,z:4,w:2,h:2,name:`El gallinero`},kitchen:{x:12,z:4,w:2,h:2,name:`La cocina`},ceiba:{x:1,z:0,w:2,h:2,name:`La ceiba`},tank:{x:4,z:7,w:1,h:1,name:`El tanque`}},G={x0:8,z0:6,x1:11,z1:8,gate:[[9,9],[10,9]]},qd=Gd(5,9,8,10),Jd=[[4,12],[10,12],[14,4],[8,4]],Yd=[14,7],Xd={x:15.5,z:9.5},Zd=Gd(15,8,16,11),Qd={recolector:[`Pancho`,`Lázaro`,`Ramón`,`Nené`,`Felo`,`Cuco`],regador:[`Yoel`,`Osmany`,`Yordanis`,`Rafa`,`Pepe`,`Tony`],sembrador:[`María`,`Yamilé`,`Odalys`,`Mirta`,`Lourdes`,`Tania`],cosechador:[`Cachita`,`Iraida`,`Marisol`,`Yusimí`,`Dayana`,`Elena`],cocinera:[`Caridad`,`Fefa`,`Nilda`,`Clara`,`Zoila`,`Gladys`],camionero:[`Chucho`,`Reinaldo`,`Papo`,`Alexis`,`Manolo`,`Berto`],lenador:[`Tato`,`Cheo`,`Nando`,`Kiko`,`Lalo`,`Mingo`]},$d=[7311272,15262416,14133578,13194858,6258511,9067066,4876938,12080970,8030810,14272928],ef=[12946524,9067066,14264186,8014382,11565136,14725258,10118208,6175268],tf=[14270602,8018486,14731414,3813416,13215850];function nf(e,t=0){let n=Qd[e]||[Dd[e]?.who||`Trabajador`];return t<n.length?n[t]:`${n[t%n.length]} ${Math.floor(t/n.length)+1}`}function rf(e,t=0){let n=Dd[e].look;if(!t)return n;let r=t*3+e.length;return{...n,shirt:$d[r%$d.length],skin:ef[r*5%ef.length],hat:n.hat==null?null:tf[r%tf.length]}}var af=(e,t=0)=>Math.round(Dd[e].price*(1+.75*t)/5)*5,of={camino:{name:`Camino del sur`,blurb:`Une la finca con el batey y la manigua.`,level:1,rect:{x0:0,z0:40,x1:87,z1:41},road:!0},manigua:{name:`La manigua`,blurb:`El monte salvaje: madera, frutas y animales.`,level:3,rect:{x0:46,z0:0,x1:87,z1:39},sign:[47.5,39]},batey:{name:`El batey`,blurb:`El pueblito de los trabajadores.`,level:5,rect:{x0:0,z0:42,x1:30,z1:57},sign:[13,43]}},sf=[`camino`,`manigua`,`batey`],cf=(e,t,n)=>t>=e.x0&&t<=e.x1&&n>=e.z0&&n<=e.z1,lf=(e,t)=>e>=0&&t>=0&&e<46&&t<40;function uf(e,t){if(lf(e,t))return null;for(let n of sf)if(cf(of[n].rect,e,t))return n;return null}function df(e,t){let n=of[t];return!!n&&!n.soon&&e.level>=n.level}var ff=(e,t)=>e===15||e===16||t===40||t===41;function pf(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var mf={arbol:{name:`Guásima`,madera:3,regrow:300,chop:!0},marabu:{name:`Marabú`,madera:1,regrow:200,chop:!0},ceiba:{name:`Ceiba`,sacred:!0},palma:{name:`Palma real`,royal:!0},coco:{name:`Cocotero`,fruit:`coco`,qty:2,regrow:240},mango:{name:`Mango`,fruit:`mango`,qty:3,regrow:200},guayaba:{name:`Guayabo`,fruit:`guayaba`,qty:3,regrow:160}},hf={jutia:{name:`Jutía`,max:3,chance:.7,speed:.9},jibaro:{name:`Puerco jíbaro`,max:2,chance:.55,speed:1.1},guinea:{name:`Guinea`,max:3,chance:.6,speed:1.3},gallina:{name:`Gallina perdida`,max:2,chance:.9,speed:.8},caballo:{name:`Caballo cimarrón`,max:1,chance:.34,speed:1.4,tame:3}};function gf(){let e=pf(4242),t=of.manigua.rect,n=new Set,r=new Set,i=new Set,a=(e,t)=>t*88+e,o=[];for(let e=t.z0;e<=t.z1;e++){let t=66+Math.round(Math.sin(e*.22)*3+Math.sin(e*.07+1)*2);o.push([t,e]);let i=e===7||e===19||e===31||e>=38;for(let o of[t,t+1])(i?r:n).add(a(o,e))}let s=[[52,6,2.2],[81,9,3.1],[77,30,2.6],[57,27,2]];for(let[e,t,n]of s)for(let r=Math.floor(t-n);r<=t+n;r++)for(let o=Math.floor(e-n);o<=e+n;o++)Math.hypot(o+.5-e,r+.5-t)<=n&&i.add(a(o,r));let c=[],l=new Set([...n,...r,...i]),u=(e,t)=>o.some(([n,r])=>Math.abs(r-t)<2&&Math.abs(n-e)<5),d=0;for(let n=t.z0;n<=t.z1;n++)for(let r=t.x0;r<=t.x1;r++){let i=a(r,n);if(l.has(i)||n>=t.z1-2&&r<t.x0+6||r===t.x0)continue;let o=e(),s=null;if(o<.075?s=`arbol`:o<.115?s=`marabu`:o<.121?s=`ceiba`:o<.139?s=`palma`:o<.149?s=u(r,n)?`coco`:`guayaba`:o<.157?s=`mango`:o<.166&&(s=`guayaba`),s){if(s===`ceiba`){let e=!0;for(let t=-1;t<=1;t++)for(let i=-1;i<=1;i++)l.has(a(r+i,n+t))&&(e=!1);e||(s=`arbol`)}c.push({id:`m${d++}`,kind:s,x:r,z:n}),l.add(i)}}return{water:n,fords:r,hills:i,river:o,mogotes:s,plants:c}}var _f=gf(),vf=new Map(_f.plants.map(e=>[e.id,e])),yf=new Map(_f.plants.map(e=>[e.z*88+e.x,e])),bf={plaza:{x:5,z:47,w:7,h:6},ceiba:{x:7,z:49,w:2,h:2},benches:[[6,48],[10,48],[6,51],[10,51]],lamps:[[5,47],[11,47],[5,52],[11,52]]},xf={madera:{name:`Madera`,icon:`wood`,cap:500,start:0,hud:!0,detail:`Se saca de la manigua. Sirve para construir.`}};function Sf(){return Object.fromEntries(Object.entries(xf).map(([e,t])=>[e,t.start||0]))}var Cf={},wf={},Tf=[],Ef={},Df={land:[]},Of={},kf={},Af=[],jf=[];function Mf(e,t){for(let n of jf)n(e,t)}var Nf={offset:0},Pf=()=>Date.now()/1e3+Nf.offset;function Ff(){let e=Pf(),t={v:2,money:10,xp:0,level:1,inv:Object.fromEntries(Object.keys(fd).map(e=>[e,0])),seeds:{tomato:2,cane:0,tobacco:0},selectedSeed:`tomato`,parcels:[],plots:qd.map(([e,t])=>({x:e,z:t,crop:null,at:0})),chickens:[],eggs:[],workers:[],built:{},cleared:[],upgrades:{coop:!1,abono:!1,storage:0},trucks:null,truckTrips:0,nextTruckAt:0,kitchen:{recipe:null,at:0,ready:null},player:{x:13.5,z:8.5},tutorial:0,tutorialDone:!1,settings:{music:!0,sfx:!0,joystick:!1,quality:`auto`},tod:.4,ffUsed:!1,hireHint:!1,stats:{eggs:0,harvests:0,sold:0,earned:0,madera:0,caught:0,fruit:0},res:Sf(),ext:{},chopped:{},fruit:{},wild:[],carry:[],horse:!1,tame:{},hints:{},nextId:1,savedAt:e};for(let n=0;n<3;n++)If(t,e-n*7);return[[8.6,7.4],[10.3,6.8],[9.5,8.3]].forEach(([e,n])=>t.eggs.push({id:t.nextId++,x:e,z:n})),t}function If(e,t=Pf()){let n=G.x0+.5+Math.random()*(G.x1-G.x0),r=G.z0+.5+Math.random()*(G.z1-G.z0);e.chickens.push({id:e.nextId++,x:n,z:r,nextLay:t+30*(.5+Math.random()*.7),hue:Math.random()})}function Lf(e){return vd[Math.min(e.upgrades.storage,vd.length-1)]}function Rf(e){return Object.values(e.inv).reduce((e,t)=>e+t,0)}function zf(e){return(e.upgrades.coop?8:4)+(e.extraHens||0)}function Bf(e,t){return t.zone?df(e,t.zone):e.parcels.includes(t.parcel)}function Vf(e){let t=4+Math.floor((e.level||1)/4);for(let[n,r]of Object.entries(W))r.kind===`house`&&e.built?.[n]&&(t+=e.built[n].tier===2?r.upgrade.cap:r.cap);return t}var Hf=(e,t)=>e>=0&&t>=0&&e<88&&t<80;function Uf(e,t){return e>=0&&t>=0&&e<46&&t<40}function Wf(e){return e>=Fd.x0&&e<=Fd.x1}function Gf(e,t){for(let n of Ud){let r=n.rect;if(e>=r.x0&&e<=r.x1&&t>=r.z0&&t<=r.z1)return n}return null}function Kf(e,t,n){if(!Uf(t,n))return!1;if(Wf(t))return!0;let r=Pd;if(t>=r.x0&&t<=r.x1&&n>=r.z0&&n<=r.z1)return!0;let i=Gf(t,n);return!!(i&&e.parcels.includes(i.id))}function qf(e,t){let n=t.rect;if(n.x1===Fd.x0-1||n.x0===Fd.x1+1)return!0;for(let t=n.z0-1;t<=n.z1+1;t++)for(let r=n.x0-1;r<=n.x1+1;r++)if(!(r>=n.x0&&r<=n.x1&&t>=n.z0&&t<=n.z1)&&Uf(r,t)&&!Wf(r)&&Kf(e,r,t))return!0;return!1}function Jf(e){let t=new Uint8Array(7040),n=(e,n)=>{Hf(e,n)&&(t[n*88+e]=1)};for(let e of _f.water)t[e]=1;for(let e of _f.hills)t[e]=1;for(let t of _f.plants)e.chopped&&e.chopped[t.id]||n(t.x,t.z);for(let e=bf.ceiba.z;e<bf.ceiba.z+bf.ceiba.h;e++)for(let t=bf.ceiba.x;t<bf.ceiba.x+bf.ceiba.w;t++)n(t,e);for(let[e,t]of bf.lamps)n(e,t);for(let e of Object.values(Kd))for(let t=e.z;t<e.z+e.h;t++)for(let r=e.x;r<e.x+e.w;r++)n(r,t);for(let[e,t]of Jd)n(e,t);n(Yd[0],Yd[1]);let r=new Set(e.cleared||[]);for(let t of Wd)e.parcels.includes(t.parcel)&&!r.has(t.id)&&n(t.x,t.z);for(let[t,r]of Object.entries(W))if(e.built?.[t])for(let e=r.z;e<r.z+r.h;e++)for(let t=r.x;t<r.x+r.w;t++)n(t,e);for(let t of Ud)if(e.parcels.includes(t.id)){for(let[e,r]of t.palms)n(e,r);for(let e of t.decor||[])for(let t=e.z;t<e.z+e.h;t++)for(let r=e.x;r<e.x+e.w;r++)n(r,t)}let i=new Set,a=(e,t,n,r)=>e<n||e===n&&t<r?`${e},${t}|${n},${r}`:`${n},${r}|${e},${t}`;for(let e=G.x0;e<=G.x1;e++)G.gate.some(([t])=>t===e)||i.add(a(e,G.z1,e,G.z1+1));for(let e=G.z0;e<=G.z1;e++)i.add(a(G.x0-1,e,G.x0,e)),i.add(a(G.x1,e,G.x1+1,e));for(let e=G.x0;e<=G.x1;e++)i.add(a(e,G.z0-1,e,G.z0));return{blocked:t,edges:i,ek:a}}function Yf(e,t,n,r){if(!Hf(n,r)||t.blocked[r*88+n])return!1;if(lf(n,r))return Kf(e,n,r);if(ff(n,r))return!0;let i=uf(n,r);return!!i&&df(e,i)}function Xf(e){try{return e.savedAt=Pf(),e.clockOffset=Nf.offset,localStorage.setItem(ld,JSON.stringify(e)),!0}catch{return!1}}function Zf(){try{let e=localStorage.getItem(ld);if(!e)return null;let t=JSON.parse(e);if(!t||t.v!==2)return null;Nf.offset=+t.clockOffset||0;let n=Ff(),r={...n,...t};r.inv={...n.inv,...t.inv},r.seeds={...n.seeds,...t.seeds},r.upgrades={...n.upgrades,...t.upgrades},r.settings={...n.settings,...t.settings},r.stats={...n.stats,...t.stats},r.kitchen={...n.kitchen,...t.kitchen},r.built={...t.built||{}},r.cleared=Array.isArray(t.cleared)?t.cleared:[],r.res={...Sf(),...t.res||{}},t.wood&&!t.res&&(r.res.madera=t.wood);for(let e of Object.keys(r.res))r.res[e]=Math.max(0,Math.floor(+r.res[e]||0));r.ext=t.ext&&typeof t.ext==`object`?t.ext:{},Mf(r,t),r.chopped=t.chopped&&typeof t.chopped==`object`?t.chopped:{},r.fruit=t.fruit&&typeof t.fruit==`object`?t.fruit:{},r.wild=Array.isArray(t.wild)?t.wild:[],r.carry=Array.isArray(t.carry)?t.carry:[],r.tame=t.tame||{},r.hints=t.hints||{},Array.isArray(t.trucks)||(r.trucks=null,r.truck=t.truck);for(let e of Object.keys(fd))r.inv[e]=Math.max(0,Math.floor(+r.inv[e]||0));r.money=Math.max(0,Math.floor(+r.money||0)),r.workers=(t.workers||[]).map(e=>({...e,role:e.role===`cocinero`?`cocinera`:e.role,lvl:e.lvl||1}));for(let e of r.workers)e.id||(e.id=e.role),e.n??(e.n=0);return r}catch{return null}}function Qf(){try{localStorage.removeItem(ld)}catch{}}var $f={jutia:[`la`,`a`],jibaro:[`el`,`o`],guinea:[`la`,`a`],gallina:[`la`,`a`],caballo:[`el`,`o`]},ep=(e,t)=>(t===1?fd[e].name:fd[e].plural).toLowerCase();function tp(e){let t=e.prototype;t.v4init=function(){this.wildRT=new Map,this.regrowTick=0,this.wildTick=0,this.reach=null},t.civic=function(e){let t=0;for(let[n,r]of Object.entries(W))r.kind===`civic`&&this.s.built[n]&&r.effect[e]&&(t+=r.effect[e]);return t},t.discount=function(){return 1-this.civic(`discount`)},t.workerCap=function(){return Vf(this.s)},t.addRes=function(e,t,n,r){let i=this.s,a=xf[e];if(!a)return!1;let o=Math.min(t,(a.cap??9999)-(i.res[e]||0));return o<=0?(this.h.toast(`No cabe más ${a.name.toLowerCase()} (tope ${a.cap}).`),!1):(i.res[e]=(i.res[e]||0)+o,i.stats[e]=(i.stats[e]||0)+o,n!==void 0&&this.h.float(n,r,`+${o} ${a.name.toLowerCase()}`,`item`),this.h.changed(`res`),!0)},t.hasRes=function(e,t){return(this.s.res[e]||0)>=(t||0)},t.spendRes=function(e,t){if(!t)return!0;let n=xf[e];return this.hasRes(e,t)?(this.s.res[e]-=t,this.h.changed(`res`),!0):(this.h.toast(`Hace falta ${t} de ${n.name.toLowerCase()} (tienes ${this.s.res[e]||0}).${e===`madera`?` Búscala en la manigua.`:``}`),this.h.sfx(`error`),!1)},t.costParts=function(e){let t={...e.res||{}};return e.madera&&(t.madera=(t.madera||0)+e.madera),{pesos:e.pesos||e.price||0,res:t,items:e.items||{}}},t.canPay=function(e,t){let{pesos:n,res:r,items:i}=this.costParts(e),a=this.s,o=e=>(t||(this.h.toast(e),this.h.sfx(`error`)),!1);for(let[e,t]of Object.entries(r))if((a.res[e]||0)<t)return o(`Hace falta ${t} de ${xf[e].name.toLowerCase()} (tienes ${a.res[e]||0}).${e===`madera`?` Búscala en la manigua.`:``}`);for(let[e,t]of Object.entries(i))if((a.inv[e]||0)<t)return o(`Hacen falta ${t} ${fd[e].plural.toLowerCase()} (tienes ${a.inv[e]||0}).`);return a.money<n?o(`Todavía no alcanzan los pesos.`):!0},t.pay=function(e){if(!this.canPay(e))return!1;let{pesos:t,res:n,items:r}=this.costParts(e),i=this.s;if(t&&!this.spend(t))return!1;for(let[e,t]of Object.entries(n))i.res[e]-=t;for(let[e,t]of Object.entries(r))i.inv[e]-=t;return this.h.changed(`res`),this.h.changed(`inv`),!0},t.addWood=function(e,t,n){return this.addRes(`madera`,e,t,n)},t.spendWood=function(e){return this.spendRes(`madera`,e)},t.storageWood=function(){return bd[this.s.upgrades.storage]||0},t.plantStanding=function(e){return!this.s.chopped[e]},t.fruitReady=function(e,t=Pf()){let n=mf[e.kind];if(!n.fruit)return!1;let r=this.s.fruit[e.id];return!r||t-r>=n.regrow},t.plantAtTile=function(e,t){let n=yf.get(t*88+e);return n&&this.plantStanding(n.id)?n:null},t.chopPlant=function(e,t){let n=this.s,r=vf.get(e);if(!r||n.chopped[e])return!1;let i=mf[r.kind];return!i.chop||!df(n,`manigua`)?!1:(n.chopped[e]=Pf(),this.rebuildGrid(),this.addXp(r.kind===`arbol`?3:1),t?i.madera:(this.addWood(i.madera,r.x+.5,r.z+.5),this.h.sfx(`harvest`),this.h.burst?.(r.x+.5,r.z+.5,`tobacco`),this.h.changed(`manigua`),!0))},t.pickFruit=function(e){let t=this.s,n=vf.get(e);if(!n||!this.fruitReady(n))return this.h.toast(`Todavía no hay frutas. Vuelve más tarde.`),!1;let r=mf[n.kind];return this.addItem(r.fruit,r.qty,n.x+.5,n.z+.5)?(t.fruit[n.id]=Pf(),t.stats.fruit=(t.stats.fruit||0)+r.qty,this.addXp(fd[r.fruit].xp*r.qty),this.h.sfx(`harvest`),this.h.changed(`manigua`),!0):!1},t.usePlantTarget=function(e){let t=vf.get(e);if(!t)return!1;let n=mf[t.kind];return n.sacred?(this.h.toast(`La ceiba no se tumba, compay: es sagrada. Descansa un rato a su sombra.`),!0):n.royal?(this.h.toast(`La palma real no se corta: es el árbol nacional. Busca guásimas o marabú.`),!0):n.fruit?this.pickFruit(e):this.chopPlant(e)},t.reachable=function(){if(this.reach&&this.reach.gen===this.gridGen)return this.reach.set;let e=of.manigua.rect,t=new Set,n=[];for(let r=e.x0;r<=e.x1;r++){let i=e.z1*88+r;this.grid.blocked[i]||(t.add(i),n.push(i))}for(;n.length;){let r=n.pop(),i=r%88,a=r/88|0;for(let[r,o]of[[1,0],[-1,0],[0,1],[0,-1]]){let s=i+r,c=a+o;if(!cf(e,s,c))continue;let l=c*88+s;t.has(l)||this.grid.blocked[l]||(t.add(l),n.push(l))}}return this.reach={gen:this.gridGen,set:t,list:[...t]},t},t.randomWildTile=function(e=6){this.reachable();let t=this.reach.list,n=this.player;for(let r=0;r<30;r++){let r=t[Math.floor(Math.random()*t.length)],i=r%88,a=r/88|0;if(!(a>of.manigua.rect.z1-3)&&Math.hypot(i-n.x,a-n.z)>=e)return[i,a]}return null},t.spawnWild=function(){let e=this.s;for(let[t,n]of Object.entries(hf)){if(t===`caballo`&&e.horse||e.wild.filter(e=>e.kind===t).length>=n.max)continue;let r=this.randomWildTile();if(!r)return;e.wild.push({id:e.nextId++,kind:t,x:r[0]+.5,z:r[1]+.5});return}},t.updateWild=function(e){let t=this.s;if(!df(t,`manigua`))return;this.wildTick-=e,this.wildTick<=0&&(this.wildTick=t.wild.length<4?3:25,this.spawnWild());let n=this.reachable();for(let r of t.wild){let t=this.wildRT.get(r.id);t||(t={tx:r.x,tz:r.z,wait:Math.random()*3,face:Math.random()*6,moving:!1},this.wildRT.set(r.id,t));let i=hf[r.kind];if(this.player.task?.kind===`wild`&&this.player.task.id===r.id){t.moving=!1;continue}if(t.wait-=e,t.wait<=0){t.wait=1.5+Math.random()*4;let e=Math.floor(r.x),i=Math.floor(r.z);for(let r=0;r<6;r++){let r=e+Math.round((Math.random()-.5)*6),a=i+Math.round((Math.random()-.5)*6);if(n.has(a*88+r)&&this.lineFree(e,i,r,a)){t.tx=r+.5,t.tz=a+.5;break}}}let a=t.tx-r.x,o=t.tz-r.z,s=Math.hypot(a,o);if(t.moving=s>.05,t.moving){let n=Math.min(s,e*i.speed);r.x+=a/s*n,r.z+=o/s*n,t.face=Math.atan2(a,o)}}},t.lineFree=function(e,t,n,r){let i=Math.max(Math.abs(n-e),Math.abs(r-t));for(let a=1;a<=i;a++){let o=Math.round(e+(n-e)*a/i),s=Math.round(t+(r-t)*a/i);if(this.grid.blocked[s*88+o])return!1}return!0},t.wildById=function(e){return this.s.wild.find(t=>t.id===e)||null},t.catchWild=function(e){let t=this.s,n=this.wildById(e);if(!n)return!1;let r=hf[n.kind],i=this.player;if(Math.hypot(n.x-i.x,n.z-i.z)>1.9)return this.h.toast(`${r.name}: se movió. Tócalo otra vez.`),!1;if(t.carry.length>=3)return this.h.toast(`Ya llevas 3 animales. Llévalos a la finca primero.`),this.h.sfx(`error`),!1;let a=Math.random()<r.chance;if(r.tame&&(t.tame[e]=(t.tame[e]||0)+1,t.tame[e]>=r.tame&&(a=!0)),!a){let i=this.wildRT.get(e);i&&(i.wait=0);let a=r.tame?` (${t.tame[e]}/${r.tame} para domarlo)`:``;this.h.toast(`¡Se escapó ${$f[n.kind][0]} ${r.name.toLowerCase()}! Inténtalo otra vez${a}.`),this.h.float(n.x,n.z,`¡Se escapó!`,`xp`);let o=this.reachable(),s=Math.floor(n.x),c=Math.floor(n.z);for(let e=0;e<12&&i;e++){let e=s+Math.round((Math.random()-.5)*9),t=c+Math.round((Math.random()-.5)*9);if(Math.hypot(e-s,t-c)>2.5&&o.has(t*88+e)){i.tx=e+.5,i.tz=t+.5,i.wait=4;break}}return!1}return t.wild=t.wild.filter(t=>t.id!==e),this.wildRT.delete(e),t.carry.push({kind:n.kind}),t.stats.caught=(t.stats.caught||0)+1,this.addXp(n.kind===`caballo`?25:6),this.h.sfx(`level`),this.h.float(n.x,n.z,n.kind===`caballo`?`¡Domado!`:`¡Atrapado!`,`xp`),this.h.toast(n.kind===`caballo`?`¡Domaste al caballo! Llévalo a la finca.`:`¡${r.name} atrapad${$f[n.kind][1]}! Llév${$f[n.kind][1]===`a`?`ala`:`alo`} a la finca (${t.carry.length}/3).`),this.h.changed(`carry`),!0},t.deliverCarry=function(){let e=this.s;if(!e.carry.length)return;let t=[];for(let n of e.carry){if(n.kind===`caballo`){e.horse=!0,t.push(`el caballo ya está en el bohío (caminas más rápido)`);continue}if(n.kind===`gallina`||n.kind===`guinea`){e.chickens.length<zf(e)?(If(e),n.kind===`guinea`&&(e.chickens[e.chickens.length-1].guinea=!0),t.push(n.kind===`guinea`?`una guinea al corral`:`una gallina al corral`)):(this.addMoney(15),t.push(`el corral está lleno: la vendiste a un vecino (+15)`));continue}if(n.kind===`jibaro`&&e.built.cerdos&&(e.built.cerdos.extra||0)<3){e.built.cerdos.extra=(e.built.cerdos.extra||0)+1,t.push(`un jíbaro al chiquero (+1 pieza de carne)`);continue}let r=n.kind===`jibaro`?`jibaro`:`jutia`;this.space()>0?(e.inv[r]++,t.push(`${ep(r,1)} a la canasta`)):(this.addMoney(Math.round(fd[r].sell*.6)),t.push(`no cabía: lo vendiste (+${Math.round(fd[r].sell*.6)})`))}e.carry=[],this.player.speed=this.playerSpeed(),this.h.sfx(`coins`),this.h.toast(`De vuelta en la finca: ${t.join(`, `)}.`),this.h.changed(`carry`),this.h.changed(`chickens`),this.h.changed(`inv`)},t.teleport=function(e,t){let n=this.player;n.x=e,n.z=t,n.path=null,n.task=null,n.moving=!1,this.h.changed(`travel`)},t.goManigua=function(){return df(this.s,`manigua`)?(this.teleport(48.5,38.5),this.h.toast(`La manigua: tumba árboles con el machete, recoge frutas y atrapa animales.`),!0):(this.h.toast(`La manigua se abre en el nivel ${of.manigua.level}.`),!1)},t.goBatey=function(){return df(this.s,`batey`)?(this.teleport(13.5,47.5),!0):(this.h.toast(`El batey se abre en el nivel ${of.batey.level}.`),!1)},t.goFarm=function(){return this.teleport(13.5,10.5),this.s.carry.length&&this.deliverCarry(),!0},t.outside=function(){let e=this.player;return!lf(Math.floor(e.x),Math.floor(e.z))},t.playerSpeed=function(){return this.s.horse?6.9:4.6},t.upgradeHouse=function(e){let t=this.s,n=W[e],r=t.built[e];if(!n||n.kind!==`house`||!r||r.tier===2)return!1;let i=n.upgrade;return t.level<i.level?(this.h.toast(`La casa de zinc se hace en el nivel ${i.level}.`),!1):t.res.madera<i.madera?this.spendWood(i.madera):this.spend(i.price)?(this.spendWood(i.madera),r.tier=2,this.addXp(20),this.h.sfx(`level`),this.h.toast(`¡Casa de zinc lista! Tope de trabajadores: ${this.workerCap()}.`),this.h.changed(`land`),!0):!1},t.homeOf=function(e){let t=Object.keys(W).filter(e=>W[e].kind===`house`&&this.s.built[e]);if(!t.length)return null;let n=this.workers.indexOf(e);return W[t[Math.floor(n/2)%t.length]]},t.updateV4=function(e){let t=this.s,n=Pf();if(this.regrowTick-=e,this.regrowTick<=0){this.regrowTick=1;let e=!1;for(let[r,i]of Object.entries(t.chopped)){let a=vf.get(r);a?n-i<mf[a.kind].regrow||[this.player,...this.workers].some(e=>Math.floor(e.x)===a.x&&Math.floor(e.z)===a.z)||t.wild.some(e=>Math.floor(e.x)===a.x&&Math.floor(e.z)===a.z)||(delete t.chopped[r],e=!0):delete t.chopped[r]}e&&(this.rebuildGrid(),this.h.changed(`manigua`))}this.updateWild(e);let r=this.player;t.carry.length&&lf(Math.floor(r.x),Math.floor(r.z))&&this.deliverCarry()},t.lenadorPick=function(e,t){let n=this.s;if(!df(n,`manigua`))return e.status=`La manigua se abre en el nivel 3`,null;if((e.trees||0)>=3||e.load&&!this.nearestChop(e,t)){let t=Kd.house;return{x:t.x+t.w/2,z:t.z+t.h,t:{kind:`woodhome`},key:`woodhome-${e.rec.id}`,verb:`llevar ${e.load} de madera al bohío`}}if(n.res.madera>=500)return e.status=`El bohío está lleno de madera`,null;let r=this.nearestChop(e,t);return r?{x:r.x+.5,z:r.z+.5,t:{kind:`wplant`,id:r.id},key:`pl${r.id}`,verb:`tumbar ${mf[r.kind].name===`Marabú`?`marabú`:`una guásima`}`}:(e.status=`Esperando que vuelvan a crecer los árboles`,null)},t.nearestChop=function(e,t){let n=null,r=1e9,i=this.reachable(),a=cf(of.manigua.rect,Math.floor(e.x),Math.floor(e.z))?e.x:48.5,o=a===e.x?e.z:38.5;for(let e of _f.plants){if(!mf[e.kind].chop||this.s.chopped[e.id]||!t(`pl${e.id}`))continue;let s=e.z*88+e.x;if(!i.has(s+1)&&!i.has(s-1)&&!i.has(s+88)&&!i.has(s-88))continue;let c=Math.hypot(e.x-a,e.z-o)+(e.kind===`marabu`?6:0);c<r&&(r=c,n=e)}return n},t.lenadorDo=function(e,t){if(t.kind===`wplant`){let n=this.chopPlant(t.id,!0);n&&(e.load=(e.load||0)+n,e.trees=(e.trees||0)+1,this.h.float(e.x,e.z,`+${n} madera`,`item`),this.h.changed(`manigua`))}else t.kind===`woodhome`&&(e.load&&(this.addWood(e.load,e.x,e.z),e.load=0),e.trees=0)}}var np=7040,rp=new Float32Array(np),ip=new Int32Array(np),ap=new Uint32Array(np),op=new Uint32Array(np),sp=0,cp=new Int32Array(np*4),lp=new Float32Array(np*4),up=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];function dp(e,t,n,r,i){sp++;let a=new Set;for(let[e,t]of n)e>=0&&t>=0&&e<88&&t<80&&a.add(t*88+e);if(!a.size)return null;let o=t*88+e;if(a.has(o))return[[e,t]];let s=0,c=(e,t)=>{let n=s++;for(;n>0;){let e=n-1>>1;if(lp[e]<=t)break;cp[n]=cp[e],lp[n]=lp[e],n=e}cp[n]=e,lp[n]=t},l=()=>{let e=cp[0],t=cp[--s],n=lp[s],r=0;for(;;){let e=2*r+1;if(e>=s||(e+1<s&&lp[e+1]<lp[e]&&e++,lp[e]>=n))break;cp[r]=cp[e],lp[r]=lp[e],r=e}return cp[r]=t,lp[r]=n,e};for(rp[o]=0,ip[o]=-1,ap[o]=sp,c(o,0);s;){let e=l();if(op[e]===sp)continue;if(op[e]=sp,a.has(e)){let t=[];for(let n=e;n!==-1;n=ip[n])t.push([n%88,n/88|0]);return t.reverse()}let t=e%88,n=e/88|0,o=rp[e];for(let[a,l,u]of up){let d=t+a,f=n+l;if(d<0||f<0||d>=88||f>=80)continue;let p=f*88+d;if(op[p]===sp||!r(d,f))continue;if(a&&l){if(!r(t+a,n)||!r(t,n+l)||i(t,n,t+a,n)||i(t,n,t,n+l)||i(t+a,n,d,f)||i(t,n+l,d,f))continue}else if(i(t,n,d,f))continue;let m=o+u;(ap[p]!==sp||m<rp[p])&&(ap[p]=sp,rp[p]=m,ip[p]=e,s<cp.length&&c(p,m))}}return null}var fp=e=>{if(e=Math.max(0,Math.ceil(e)),e<60)return`${e} s`;let t=Math.floor(e/60),n=e%60;return n?`${t} min ${n} s`:`${t} min`},pp=e=>(e=Math.max(0,Math.ceil(e)),`${Math.floor(e/60)}:${String(e%60).padStart(2,`0`)}`),mp=class{constructor(e,t){this.s=e,this.h=t,this.grid=Jf(e),this.gridGen=0,this.xpFrac=0,this.v4init(),this.player={x:e.player.x,z:e.player.z,path:null,task:null,moving:!1,face:0,walk:0,speed:4.6},this.player.speed=this.playerSpeed(),this.workers=e.workers.map(e=>this.makeWorker(e)),this.chickRT=new Map,this.reserved=new Set,this.eggFullWarned=!1,this.lastUseTarget=null,this.leaving=[],this.initTrucks();for(let e of Tf)e.init?.(this)}can(e,t){return Yf(this.s,this.grid,e,t)&&!this.truckBlocks(e,t)}edge(e,t,n,r){return this.grid.edges.has(this.grid.ek(e,t,n,r))}front(){return this.s.trucks[0]||null}truckParked(){let e=this.front();return!!e&&Math.abs(e.z-wd[0])<.05}docks(){return this.s.built.anden?2:1}isParked(e){let t=this.s.trucks[e];return!!t&&e<this.docks()&&Math.abs(t.z-wd[e])<.05}truckIndex(e){return this.s.trucks.indexOf(e)}truckBlocks(e,t){if(e!==15&&e!==16)return!1;for(let e of this.s.trucks)if(!(Math.abs(e.z-(e.slotZ??e.z))>.05)&&t>=Math.floor(e.z-1.6)&&t<=Math.floor(e.z+1.6))return!0;return!1}rebuildGrid(){this.grid=Jf(this.s),this.gridGen++}addXp(e){let t=this.s,n=this.civic?this.civic(`xp`):0;if(n){this.xpFrac+=e*n;let t=Math.floor(this.xpFrac);this.xpFrac-=t,e+=t}for(t.xp+=e;t.xp>=dd(t.level+1);)t.level++,this.h.levelUp(t.level);this.h.changed(`xp`)}addMoney(e,t,n){this.s.money+=e,e>0&&(this.s.stats.earned+=e,t!==void 0&&this.h.float(t,n,`+${e}`,`money`)),this.h.changed(`money`)}spend(e){return this.s.money<e?(this.h.toast(`Todavía no alcanzan los pesos.`),this.h.sfx(`error`),!1):(this.s.money-=e,this.h.changed(`money`),!0)}space(){return Lf(this.s)-Rf(this.s)}addItem(e,t=1,n,r){return this.space()<t?(this.h.toast(`La canasta está llena. Vende en el camión o amplía el almacén.`),this.h.sfx(`error`),!1):(this.s.inv[e]+=t,n!==void 0&&this.h.float(n,r,`+${t} ${t>1?fd[e].plural.toLowerCase():fd[e].name.toLowerCase()}`,`item`),this.h.changed(`inv`),!0)}plotDur(e){return md[e].grow*(this.s.upgrades.abono?Sd:1)}plotState(e,t=Pf()){return e.crop?t>=e.at+e.dur?`ripe`:`growing`:`empty`}plotProgress(e,t=Pf()){return e.crop?Math.min(1,(t-e.at)/e.dur):0}queueSize(){return this.s.level>=4?4:3}initTrucks(){let e=this.s;if(!Array.isArray(e.trucks)){e.trucks=[],e.truckTrips=e.truck?.trips||0,delete e.truck;for(let e=0;e<this.queueSize();e++)this.spawnTruck(wd[e])}e.nextTruckAt||(e.nextTruckAt=0)}spawnTruck(e){let t=this.s,n={id:t.nextId++,model:Math.floor(Math.random()*3),color:Ed[Math.floor(Math.random()*Ed.length)],order:this.makeOrder(t.trucks.length),loaded:{},z:e??46,arrivedAt:Pf()};return t.trucks.push(n),t.truckTrips=(t.truckTrips||0)+1,n}makeOrder(e=0){let t=this.s;if(Pf(),(t.truckTrips||0)===0&&e===0)return{items:{egg:3},reward:25,xp:6};let n=e=>t.plots.some(t=>t.crop===e),r=new Set(t.trucks.flatMap(e=>Object.keys(e.order.items))),i={};i.egg=6+Math.min(4,t.chickens.length-3)+(t.inv.egg>2?3:0);let a=(e,r,a)=>{if(t.level<a)return;let o=.4;t.inv[e]>0&&(o+=4),n(r)&&(o+=3),t.seeds[r]>0&&(o+=1),i[e]=o};a(`tomato`,`tomato`,1),a(`cane`,`cane`,3),a(`tobacco`,`tobacco`,4);let o=(e,n)=>{let r=gd[n];if(t.level<r.level)return;let[a,o]=Object.entries(r.needs)[0],s=.3;t.inv[e]>0&&(s+=4),(t.kitchen.recipe===n||t.kitchen.ready===e)&&(s+=3),t.inv[a]>=o&&(s+=2),i[e]=s};o(`ketchup`,`ketchup`),o(`guarapo`,`guarapo`);for(let[e,n]of Object.entries(W))if(t.built[e]&&(n.kind===`animal`&&n.produce.item!==`egg`&&(i[n.produce.item]=2+(t.inv[n.produce.item]>0?4:0)),n.kind===`proc`))for(let[n,r]of Object.entries(gd))r.where.includes(e)&&n!==`ketchup`&&n!==`guarapo`&&t.level>=r.level&&(i[r.out]=1.5+(t.inv[r.out]>0?4:0)+(this.proc(e)?.recipe===n?2:0));for(let e of[`mango`,`guayaba`,`coco`,`jutia`,`jibaro`])t.inv[e]>0&&(i[e]=3);for(let e of r)i[e]&&(i[e]*=.6);let s=e=>{let t=Object.entries(i).filter(([t])=>!e.has(t)),n=t.reduce((e,[,t])=>e+t,0),r=Math.random()*n;for(let[e,n]of t)if(r-=n,r<=0)return e;return t[0]?.[0]},c=Math.min(Object.keys(i).length,t.level>=3&&Math.random()<.45?2:1),l={},u=new Set;for(let e=0;e<c;e++){let e=s(u);if(!e)break;u.add(e);let n=({egg:3,tomato:2,ketchup:1,cane:2,tobacco:1,guarapo:1,leche:2,queso:1,carne:1,melao:1,azucar:1,puros:1,mango:3,guayaba:3,coco:2}[e]||1)+Math.floor(Math.random()*(1+Math.min(4,t.level*.5)));t.inv[e]>0&&Math.random()<.6&&(n=Math.max(1,Math.min(n,t.inv[e]+1))),l[e]=n}let d=0,f=0;for(let[e,t]of Object.entries(l))d+=fd[e].sell*t,f+=fd[e].xp*t;return{items:l,reward:Math.round((d*Cd+3+t.level)*(1+(this.civic?this.civic(`pay`):0))),xp:Math.round(f*1.5+2)}}missing(e=this.front()){if(!e)return{};let t={};for(let[n,r]of Object.entries(e.order.items)){let i=r-(e.loaded[n]||0);i>0&&(t[n]=i)}return t}canLoadSome(e=this.front()){return Object.keys(this.missing(e)).some(e=>this.s.inv[e]>0)}canDeliver(e=this.front()){return!e||!this.isParked(this.truckIndex(e))?!1:Object.entries(this.missing(e)).every(([e,t])=>this.s.inv[e]>=t)}loadTruck(e=0,t=!1){let n=this.s,r=n.trucks[e];if(!r||!this.isParked(e))return!1;let i=wd[e],a=0;for(let[e,t]of Object.entries(this.missing(r))){let i=Math.min(t,n.inv[e]);i>0&&(n.inv[e]-=i,r.loaded[e]=(r.loaded[e]||0)+i,a+=i)}if(!a)return t||(this.h.toast(`No tienes nada de lo que pide. Pulsa “No tenemos, siguiente”.`),this.h.sfx(`error`)),!1;if(r.lastLoadAt=Pf(),t||this.h.sfx(`load`),this.h.changed(`inv`),Object.keys(this.missing(r)).length===0){let a=r.order;n.stats.sold++,this.addMoney(a.reward,Xd.x,i),this.addXp(a.xp),this.h.float(Xd.x,i-1,`+${a.xp} XP`,`xp`),this.h.sfx(`coins`),t||this.h.toast(`¡Pedido completo! +${a.reward} pesos`),this.departTruck(e)}else t?this.h.float(Xd.x,i-1,`Chucho cargó ${a}`,`xp`):this.h.toast(`Cargaste ${a}. Faltan cosas, pero el camión espera.`);return!0}deliverOrder(){return this.loadTruck()}skipTruck(e=0,t=!1){let n=this.s,r=n.trucks[e];if(!r||!this.isParked(e))return!1;let i=0;for(let[e,t]of Object.entries(r.loaded))i+=fd[e].sell*t;return i&&(this.addMoney(i,Xd.x,wd[e]),n.stats.sold++),t?this.h.float(Xd.x,wd[e]-1,`No tenemos, ¡siguiente!`,`xp`):(this.h.toast(i?`Se fue con lo cargado: +${i} pesos. Ya viene el próximo.`:`Sin problema, compay. Ya viene el próximo camión.`),this.h.sfx(`horn`)),this.departTruck(e),!0}departFront(){this.departTruck(0)}departTruck(e=0){let t=this.s,n=t.trucks.splice(e,1)[0];n&&(this.leaving.push({...n,lane:+(e>0),lx:0}),t.skippedAt=Pf(),(!t.nextTruckAt||t.nextTruckAt<Pf())&&(t.nextTruckAt=Pf()+4),this.h.changed(`truck`))}sellLoose(e,t,n=!1){let r=this.s;if(!this.truckParked()&&!this.isParked(1))return n||this.h.toast(`Espera a que el camión se parquee.`),!1;if(t=Math.min(t,r.inv[e]),t<=0)return n||(this.h.toast(`No tienes de eso.`),this.h.sfx(`error`)),!1;r.inv[e]-=t;let i=fd[e].sell*t;return this.addMoney(i,Xd.x,Xd.z),this.addXp(Math.max(1,Math.round(fd[e].xp*t*.5))),r.stats.sold++,n||this.h.sfx(`coins`),this.h.changed(`inv`),!0}surplus(e){let t=this.s,n=e.keep??10,r={};for(let e of t.trucks)for(let[t,n]of Object.entries(this.missing(e)))r[t]=(r[t]||0)+n;let i={};for(let e of pd){let a=(t.inv[e]||0)-n-(r[e]||0);a>0&&(i[e]=a)}return i}loadable(e){let t={};for(let[n,r]of Object.entries(this.missing(e))){let e=Math.min(r,this.s.inv[n]||0);e>0&&(t[n]=e)}return t}camHome(e){let t=e?this.workers.filter(e=>e.role===`camionero`).indexOf(e):0;return[[[14,9],[14,10]],[[14,12],[14,13]],[[13,9],[13,10]],[[13,12],[13,13]]][Math.max(0,t)%4].find(([e,t])=>this.can(e,t))||null}updateTrucks(e){let t=this.s,n=Pf();t.trucks.forEach((t,n)=>{t.slotZ=wd[n];let r=t.z-t.slotZ;if(Math.abs(r)<.02){t.z!==t.slotZ&&n<this.docks()&&this.h.sfx(`horn`),t.z=t.slotZ,n<this.docks()&&!t.parkedSince&&(t.parkedSince=Pf());return}let i=Math.min(Td,1.2+Math.abs(r)*2.2)*e;t.z-=Math.sign(r)*Math.min(Math.abs(r),i),t.moving=!0,t.parkedSince=0});for(let e of t.trucks)e.z===e.slotZ&&(e.moving=!1);for(let t=this.leaving.length-1;t>=0;t--){let n=this.leaving[t];n.lane&&n.lx<1.7?n.lx=Math.min(1.7,n.lx+e*1.4):(n.v=Math.min(Td*1.3,(n.v||0)+e*4),n.z-=n.v*e),n.moving=!0,n.z<-40&&this.leaving.splice(t,1)}if(t.trucks.length<this.queueSize()&&n>=(t.nextTruckAt||0)){let e=t.trucks[t.trucks.length-1];this.spawnTruck(Math.max(46,(e?.z||0)+6)),t.nextTruckAt=n+4,this.h.changed(`truck`)}let r=this.player;this.truckBlocks(Math.floor(r.x),Math.floor(r.z))&&(r.x=14.5,r.path=null)}kitchenOpen(){return this.s.level>=2}proc(e=`kitchen`){return e===`kitchen`?this.s.kitchen:this.s.built[e]||null}procKeys(){return[`kitchen`,...Object.keys(W).filter(e=>W[e].kind===`proc`&&this.s.built[e])]}procPos(e=`kitchen`){let t=e===`kitchen`?Kd.kitchen:W[e];return{x:t.x+t.w/2,z:t.z+t.h/2}}canStart(e,t=`kitchen`){let n=this.s,r=gd[e];return r.where.includes(t)&&n.level>=r.level&&Object.entries(r.needs).every(([e,t])=>n.inv[e]>=t)}startRecipe(e,t=`kitchen`){let n=this.s,r=gd[e],i=this.proc(t);if(!i)return!1;if(n.level<r.level)return this.h.toast(`Se desbloquea en el nivel ${r.level}.`),!1;if(!r.where.includes(t))return!1;if(i.recipe||i.ready)return this.h.toast(`Está ocupado.`),!1;for(let[e,t]of Object.entries(r.needs))if(n.inv[e]<t)return this.h.toast(`Hacen falta ${t} ${fd[e].plural.toLowerCase()}.`),this.h.sfx(`error`),!1;for(let[e,t]of Object.entries(r.needs))n.inv[e]-=t;return i.recipe=e,i.at=Pf(),this.h.sfx(`cook`),this.h.changed(`kitchen`),!0}collectKitchen(e,t=`kitchen`){let n=this.proc(t);if(!n||!n.ready)return!1;let r=this.procPos(t);return this.addItem(n.ready,1,r.x,r.z)?(this.addXp(fd[n.ready].xp),n.ready=null,e||this.h.sfx(`harvest`),this.h.changed(`kitchen`),!0):!1}plant(e,t,n){let r=this.s;return e.crop?!1:(r.seeds[t]||0)<=0?(n||(this.h.toast(`No tienes ${md[t].seedName.toLowerCase()}s. Cómpralas en la Tienda.`),this.h.sfx(`error`),this.h.openShop?.()),!1):(r.seeds[t]--,e.crop=t,e.at=Pf(),e.dur=this.plotDur(t),e.watered=!1,this.addXp(md[t].xpPlant),n||this.h.sfx(`plant`),this.h.changed(`plots`),!0)}water(e,t){if(this.plotState(e)!==`growing`||e.watered)return!1;let n=e.at+e.dur-Pf();return e.at-=n*(this.s.built.pozo?.45:xd),e.watered=!0,t||this.h.sfx(`water`),this.h.float(e.x+.5,e.z+.5,`¡Regado!`,`item`),this.h.changed(`plots`),!0}harvest(e,t){if(this.plotState(e)!==`ripe`)return!1;let n=md[e.crop].item;return this.addItem(n,1,e.x+.5,e.z+.5)?(this.addXp(fd[n].xp),e.crop=null,e.watered=!1,this.s.stats.harvests++,t||this.h.sfx(`harvest`),this.h.burst?.(e.x+.5,e.z+.5,n),this.h.changed(`plots`),!0):!1}firstSeed(){let e=this.s;return e.seeds[e.selectedSeed]>0?e.selectedSeed:hd.find(t=>e.seeds[t]>0)||e.selectedSeed}usePlot(e){let t=this.plotState(e);return t===`ripe`?this.harvest(e):t===`empty`?this.plant(e,this.firstSeed()):e.watered?(this.h.toast(`${md[e.crop].name}: listo en ${fp(e.at+e.dur-Pf())}.`),!1):this.water(e)}collectEgg(e,t){let n=this.s,r=n.eggs[e];return!r||!this.addItem(`egg`,1)?!1:(n.eggs.splice(e,1),n.stats.eggs++,this.addXp(fd.egg.xp),this.h.float(r.x,r.z,`+1 huevo`,`item`),t||this.h.sfx(`egg`),this.eggFullWarned=!1,!0)}chickenPrice(){return Math.round(_d.chicken*_d.chickenStep**+Math.max(0,this.s.chickens.length-3)*this.discount())}seedPrice(e){return Math.max(1,Math.round(md[e].seed*this.discount()))}buy(e,t=1){let n=this.s;if(md[e]){let r=md[e];return n.level<r.level||!this.spend(this.seedPrice(e)*t)?!1:(n.seeds[e]+=t,n.selectedSeed=e,this.h.sfx(`buy`),this.h.changed(`inv`),!0)}if(e===`chicken`)return n.chickens.length>=zf(n)?(this.h.toast(`El gallinero está lleno. Amplíalo.`),!1):this.spend(this.chickenPrice())?(If(n),this.h.sfx(`cluck`),this.h.changed(`chickens`),!0):!1;if(e===`coop`)return n.upgrades.coop||n.level<3||!this.spend(_d.coop)?!1:(n.upgrades.coop=!0,this.h.sfx(`buy`),!0);if(e===`abono`)return n.upgrades.abono||n.level<4||!this.spend(_d.abono)?!1:(n.upgrades.abono=!0,this.h.sfx(`buy`),!0);if(e===`storage`){let e=n.upgrades.storage,t=yd[e];return e>=_d.storage.length||n.level<t?!1:this.storageWood()>n.res.madera?this.spendWood(this.storageWood()):this.spend(_d.storage[e])?(this.spendWood(this.storageWood()),n.upgrades.storage++,this.h.sfx(`buy`),this.h.changed(`inv`),!0):!1}return Dd[e]?this.hire(e):!1}roleCount(e){return this.s.workers.filter(t=>t.role===e).length}hirePrice(e){return af(e,this.roleCount(e))}workerById(e){return this.workers.find(t=>t.rec.id===e)||this.workers.find(t=>t.role===e)||null}hire(e){let t=this.s,n=Dd[e];if(!n||t.level<n.level)return!1;if(t.workers.length>=this.workerCap())return this.h.toast(`No hay dónde vivan más trabajadores (${t.workers.length}/${this.workerCap()}). Construye casas en el batey o sube de nivel.`),this.h.sfx(`error`),!1;if(!this.spend(this.hirePrice(e)))return!1;let r=new Set(t.workers.filter(t=>t.role===e).map(e=>e.n||0)),i=0;for(;r.has(i);)i++;let a={id:i===0&&!t.workers.some(t=>t.id===e)?e:`${e}-${t.nextWorker=(t.nextWorker||1)+1}`,n:i,role:e,x:13.5,z:11.5,lvl:1,autobuy:e===`sembrador`,...e===`camionero`?{sell:!1,keep:10}:{}};t.workers.push(a),this.workers.push(this.makeWorker(a));let o=nf(e,i);return this.h.sfx(`level`),this.h.toast(`¡${o} ya trabaja en la finca! ${n.name}.`),this.h.float(a.x,a.z,`¡${o} contratado${n.look.skirt?`a`:``}!`,`xp`),this.h.changed(`workers`),!0}upgradeWorker(e){let t=this.workerById(e);return!t||t.rec.lvl>=3||!this.spend(jd(t.role,t.rec.lvl))?!1:(t.rec.lvl++,t.speed=Ad[t.rec.lvl].walk,this.h.sfx(`buy`),this.h.float(t.x,t.z,`¡Más rápido!`,`xp`),this.h.changed(`workers`),!0)}fireWorker(e){let t=this.workerById(e);return t?(t.task&&this.reserved.delete(t.task.key),this.workers.splice(this.workers.indexOf(t),1),this.s.workers=this.s.workers.filter(e=>e!==t.rec),this.h.toast(`${nf(t.role,t.rec.n||0)} se despidió. Puedes volver a contratar cuando quieras.`),this.h.changed(`workers`),!0):!1}toggleSell(e){let t=e?this.workerById(e):this.workers.find(e=>e.role===`camionero`);t&&(t.rec.sell=!t.rec.sell)}cycleKeep(e){let t=e?this.workerById(e):this.workers.find(e=>e.role===`camionero`);if(t){let e=Od.indexOf(t.rec.keep??10);t.rec.keep=Od[(e+1)%Od.length]}}toggleAutobuy(e){let t=this.workerById(e);t&&(t.rec.autobuy=!t.rec.autobuy)}buyParcel(e){let t=this.s,n=Ud.find(t=>t.id===e);if(!n||t.parcels.includes(e))return!1;if(t.level<n.level)return this.h.toast(`Se desbloquea en el nivel ${n.level}.`),!1;if(!qf(t,n))return this.h.toast(`Primero compra la tierra de al lado: no hay camino hasta allí.`),!1;if(!this.spend(n.price))return!1;t.parcels.push(e);let r=new Set(n.obstacles.filter(e=>!t.cleared.includes(e.id)).map(e=>`${e.x},${e.z}`));for(let[e,i]of n.plots)r.has(`${e},${i}`)||t.plots.push({x:e,z:i,crop:null,at:0});return this.rebuildGrid(),this.addXp(10+n.level*2),this.h.sfx(`level`),this.h.toast(`¡${n.name} ya es tuyo!`),this.h.changed(`parcel`),!0}obstacle(e){return Wd.find(t=>t.id===e)}obstacleAt(e,t){let n=this.s;return Wd.find(r=>r.x===e&&r.z===t&&n.parcels.includes(r.parcel)&&!n.cleared.includes(r.id))||null}clearObstacle(e){let t=this.s,n=this.obstacle(e);if(!n||t.cleared.includes(e)||!t.parcels.includes(n.parcel)||!this.spend(n.cost))return!1;t.cleared.push(e);let r=Ud.find(e=>e.id===n.parcel),i=!1;return r.plots.some(([e,t])=>e===n.x&&t===n.z)&&!t.plots.some(e=>e.x===n.x&&e.z===n.z)&&(t.plots.push({x:n.x,z:n.z,crop:null,at:0}),i=!0),this.rebuildGrid(),this.addXp(zd[n.kind].xp),this.h.sfx(`harvest`),this.h.burst?.(n.x+.5,n.z+.5,n.kind===`marabu`?`cane`:`tobacco`),this.h.float(n.x+.5,n.z+.5,i?`¡Cantero nuevo!`:`¡Limpio!`,`xp`),this.h.changed(i?`land`:`obstacles`),!0}build(e){let t=this.s,n=W[e];if(!n||t.built[e])return!1;if(!Bf(t,n))return this.h.toast(n.zone?`${of[n.zone].name} se abre en el nivel ${of[n.zone].level}.`:`Primero compra “${Ud.find(e=>e.id===n.parcel).name}”.`),!1;if(t.level<n.level)return this.h.toast(`Se construye en el nivel ${n.level}.`),!1;if(!this.canPay(n.cost?{...n.cost,pesos:n.price}:{pesos:0,madera:n.madera}))return!1;for(let e=n.z;e<n.z+n.h;e++)for(let t=n.x;t<n.x+n.w;t++)if(this.obstacleAt(t,e))return this.h.toast(`Limpia el solar primero.`),!1;if(!this.pay(n.cost?{...n.cost,pesos:n.price}:{pesos:n.price,madera:n.madera}))return!1;t.built[e]={at:Pf(),ready:n.kind===`proc`&&null,recipe:null,...n.kind===`house`?{tier:1}:{}},this.rebuildGrid();for(let e of[this.player,...this.workers])this.can(Math.floor(e.x),Math.floor(e.z))||(e.x=n.x+n.w+.5,e.z=n.z+n.h+.5,e.path=null);return this.addXp(15+n.level),this.h.sfx(`level`),this.h.toast(n.kind===`house`?`¡Bohío listo en el batey! Tope de trabajadores: ${this.workerCap()}.`:`¡${n.name} construid${/^La /.test(n.name)?`a`:`o`}!`),this.h.changed(`land`),!0}animalLeft(e){let t=W[e],n=this.s.built[e];return n?Math.max(0,n.at+t.produce.time-Pf()):0}collectAnimal(e,t){let n=W[e],r=this.s.built[e];if(!r||!r.ready)return!1;let i=n.produce.qty+(r.extra||0);return this.addItem(n.produce.item,i,n.x+n.w/2,n.z+n.h/2)?(this.addXp(fd[n.produce.item].xp*i),r.ready=!1,r.at=Pf(),t||this.h.sfx(`harvest`),this.h.changed(`built`),!0):!1}useStructure(e){let t=W[e],n=this.s.built[e];return n?t.kind===`animal`?n.ready?this.collectAnimal(e):(this.h.toast(`${t.name}: listo en ${fp(this.animalLeft(e))}.`),!0):t.kind===`proc`?n.ready?this.collectKitchen(!1,e):(this.h.openKitchen(e),!0):t.kind===`boost`?(this.h.toast(`El pozo con molino: regar rinde más (45 %).`),!0):t.kind===`dock`&&(this.h.toast(`Segundo andén: el segundo camión de la fila también se puede cargar.`),!0):(this.h.openBuild?.(e),!0)}footprintGoals(e,t,n,r,i=1){let a=[];for(let o=t-i;o<t+r+i;o++)for(let t=e-i;t<e+n+i;t++)t>=0&&o>=0&&t<88&&o<80&&this.can(t,o)&&a.push([t,o]);return a}goalsFor(e){let t=Kd;switch(e.kind){case`egg`:{let t=this.s.eggs.find(t=>t.id===e.id);return t?[[Math.floor(t.x),Math.floor(t.z)]]:[]}case`plot`:return this.footprintGoals(e.p.x,e.p.z,1,1);case`truck`:if(e.i){let e=Math.floor(wd[1]-1.5),t=[];for(let n=e;n<=e+3;n++)for(let e of[14,17])this.can(e,n)&&t.push([e,n]);return t}return Zd.map(([e,t])=>[e-1,t]).filter(([e,t])=>this.can(e,t)).concat([[15,7],[16,7]].filter(([e,t])=>this.can(e,t)));case`obstacle`:{let t=this.obstacle(e.id);return t?this.footprintGoals(t.x,t.z,1,1):[]}case`struct`:{let t=W[e.id];return this.footprintGoals(t.x,t.z,t.w,t.h)}case`proc`:{let t=W[e.key];return this.footprintGoals(t.x,t.z,t.w,t.h)}case`kitchen`:return this.footprintGoals(t.kitchen.x,t.kitchen.z,t.kitchen.w,t.kitchen.h);case`coop`:return this.footprintGoals(t.coop.x,t.coop.z,t.coop.w,t.coop.h);case`house`:case`fetch`:return this.footprintGoals(t.house.x,t.house.z,t.house.w,t.house.h);case`tank`:return this.footprintGoals(t.tank.x,t.tank.z,1,1);case`wplant`:{let t=vf.get(e.id);return t?this.footprintGoals(t.x,t.z,1,1):[]}case`wild`:{let t=this.wildById(e.id);if(!t)return[];let n=this.footprintGoals(Math.floor(t.x),Math.floor(t.z),1,1);return n.length?n:this.footprintGoals(Math.floor(t.x)-1,Math.floor(t.z)-1,3,3)}case`woodhome`:return this.footprintGoals(t.house.x,t.house.z,t.house.w,t.house.h);case`ground`:return this.can(e.x,e.z)?[[e.x,e.z]]:this.footprintGoals(e.x,e.z,1,1);default:for(let t of Tf){let n=t.goals?.(this,e);if(n)return n}return[]}}pathTo(e,t){let n=Math.floor(e.x),r=Math.floor(e.z);if(!t.length)return null;let i=!lf(n,r)||t.some(([e,t])=>!lf(e,t))?(e,t)=>Yf(this.s,this.grid,e,t):(e,t)=>this.can(e,t);return dp(n,r,t,(e,t)=>i(e,t)||e===n&&t===r,(e,t,n,r)=>this.edge(e,t,n,r))}command(e){let t=this.player,n=this.goalsFor(e),r=this.pathTo(t,n);return r?(t.path=r.map(([t,n],i)=>i===r.length-1&&e.kind===`egg`?this.eggPos(e.id):{x:t+.5,z:n+.5}),r.length>1&&t.path.shift(),t.task=e.kind===`ground`?null:e,this.h.marker?.(e),!0):(this.h.toast(`No se puede llegar allí.`),this.h.sfx(`error`),!1)}eggPos(e){let t=this.s.eggs.find(t=>t.id===e);return t?{x:t.x,z:t.z}:{x:this.player.x,z:this.player.z}}perform(e){switch(e.kind){case`plot`:return this.usePlot(e.p);case`egg`:{let t=this.s.eggs.findIndex(t=>t.id===e.id);return t>=0&&this.collectEgg(t)}case`truck`:return this.h.openTruck(e.i||0),!0;case`obstacle`:return this.clearObstacle(e.id);case`wplant`:return this.usePlantTarget(e.id);case`wild`:return this.catchWild(e.id);case`struct`:return this.useStructure(e.id);case`kitchen`:return this.kitchenOpen()?this.s.kitchen.ready?this.collectKitchen():(this.h.openKitchen(),!0):(this.h.toast(`El fogón se arregla en el nivel 2.`),!1);case`coop`:return this.h.toast(`Gallinas: ${this.s.chickens.length}/${zf(this.s)}. Ponen un huevo cada 30 s.`),!0;case`house`:return this.h.toast(`El bohío de la familia. Aquí se guarda todo lo que recoges.`),!0;case`tank`:return this.h.toast(`El tanque de agua. Toca una mata que esté creciendo para regarla.`),!0;default:for(let t of Tf){let n=t.perform?.(this,e);if(n!==void 0)return n}return!1}}nearestUse(){let e=this.player,t=Pf(),n=null,r=1e9,i=(t,i,a,o,s)=>{let c=Math.hypot(i-e.x,a-e.z)+o;Math.hypot(i-e.x,a-e.z)<=1.75&&c<r&&(r=c,n={target:t,label:s})};for(let e of this.s.eggs)i({kind:`egg`,id:e.id},e.x,e.z,0,`Recoger`);for(let e of this.s.plots){let n=this.plotState(e,t);n===`ripe`?i({kind:`plot`,p:e},e.x+.5,e.z+.5,-.3,`Cosechar`):n===`empty`?i({kind:`plot`,p:e},e.x+.5,e.z+.5,.4,`Sembrar`):e.watered||i({kind:`plot`,p:e},e.x+.5,e.z+.5,.6,`Regar`)}if(this.truckParked())for(let[e,t]of Zd)i({kind:`truck`},e+.5,t+.5,.2,`Camión`);let a=Kd.kitchen;for(let e=a.z;e<a.z+a.h;e++)for(let t=a.x;t<a.x+a.w;t++)i({kind:`kitchen`},t+.5,e+.5,.2,this.s.kitchen.ready?`Recoger`:`Fogón`);return n}use(){let e=this.nearestUse();return e?this.perform(e.target):(this.h.toast(`No hay nada cerca. Camina hasta los huevos, un cantero o el camión.`),!1)}makeWorker(e){return e.lvl=e.lvl||1,{rec:e,role:e.role,x:e.x,z:e.z,path:null,task:null,wait:1+Math.random(),face:0,walk:0,moving:!1,speed:Ad[e.lvl].walk,work:0,workDur:1,status:`Llegando a la finca`,busy:!1}}seedFor(e){let t=this.s,n=t.seeds[t.selectedSeed]>0?t.selectedSeed:hd.find(e=>t.seeds[e]>0);if(n)return{crop:n,buy:!1};if(e.rec.autobuy){let e=md[t.selectedSeed]&&t.level>=md[t.selectedSeed].level?t.selectedSeed:`tomato`;if(t.money>=this.seedPrice(e))return{crop:e,buy:!0}}return null}workerPick(e){let t=this.s,n=Pf(),r=e=>!this.reserved.has(e),i=t=>t.sort((t,n)=>Math.hypot(t.x-e.x,t.z-e.z)-Math.hypot(n.x-e.x,n.z-e.z))[0]||null,a=(e,n)=>i(t.plots.filter(t=>e(t)&&r(`p${t.x},${t.z}`)).map(e=>({x:e.x+.5,z:e.z+.5,t:{kind:`plot`,p:e},key:`p${e.x},${e.z}`,verb:n(e)}))),o=e=>e.crop?md[e.crop].name.toLowerCase():``;switch(e.role){case`recolector`:{if(this.space()<=0)return e.status=`La canasta está llena: vende algo`,null;e.status=`Esperando que pongan las gallinas`;let n=Object.entries(W).filter(([e,n])=>n.kind===`animal`&&t.built[e]?.ready&&r(`a${e}`)&&this.space()>=n.produce.qty).map(([e,t])=>({x:t.x+t.w/2,z:t.z+t.h/2,t:{kind:`struct`,id:e},key:`a${e}`,verb:`recoger en el ${t.name.toLowerCase()}`}));return i([...t.eggs.filter(e=>r(`e${e.id}`)).map(e=>({x:e.x,z:e.z,t:{kind:`egg`,id:e.id},key:`e${e.id}`,verb:`recoger un huevo`})),...n])}case`regador`:return e.status=`Nada que regar ahora`,a(e=>this.plotState(e,n)===`growing`&&!e.watered,e=>`regar el ${o(e)}`);case`sembrador`:return this.seedFor(e)?(e.status=`No hay canteros vacíos`,a(e=>!e.crop,()=>`sembrar`)):(e.status=e.rec.autobuy?`No alcanza el dinero para semillas`:`Sin semillas: cómpralas o activa “Comprar semillas”`,null);case`cosechador`:return this.space()<=0?(e.status=`La canasta está llena: vende algo`,null):(e.status=`Esperando que madure algo`,a(e=>this.plotState(e,n)===`ripe`,e=>`cosechar el ${o(e)}`));case`cocinera`:{if(!this.kitchenOpen())return e.status=`El fogón se arregla en el nivel 2`,null;e.status=`Le faltan tomates, caña o tabaco`;let t=[];for(let n of this.procKeys()){let i=this.proc(n);if(i.recipe){e.status=`Cuidando el fogón`;continue}let a=!i.ready&&Object.keys(gd).some(e=>this.canStart(e,n));if(r(`k${n}`)&&(i.ready||a)){let e=this.procPos(n);t.push({x:e.x,z:e.z,t:n===`kitchen`?{kind:`kitchen`}:{kind:`proc`,key:n},key:`k${n}`,verb:i.ready?`recoger lo que salió`:n===`trapiche`?`moler caña`:n===`casaTabaco`?`torcer tabacos`:`prender el fogón`})}}return i(t)}case`lenador`:return this.lenadorPick(e,r);case`camionero`:{let i=(e,t)=>({x:14.5,z:wd[e],t:{kind:`truck`,i:e},key:`truck${e}`,verb:t});if(e.carry){let t=e.carry.i,n=Object.entries(e.carry.items).map(([e,t])=>`${t} ${(t===1?fd[e].name:fd[e].plural||fd[e].name).toLowerCase()}`).join(`, `);if(this.isParked(t))return i(t,`${e.carry.sell?`vender`:`cargar`} ${n}`);e.carry=null}let a=Kd.house,o=(e,t)=>({x:a.x+a.w/2,z:a.z+a.h,t:{kind:`fetch`,i:e,sell:t},key:`truck${e}`,verb:t?`buscar lo que sobra en el bohío`:`buscar en el bohío lo que pide el camión`});e.status=`En el andén, esperando un camión`;let s=null,c=t=>this.workers.some(n=>n!==e&&n.role===`camionero`&&n.carry&&n.carry.i===t);for(let e=0;e<this.docks();e++){if(!r(`truck${e}`)||!this.isParked(e)||c(e))continue;let a=t.trucks[e];if(Object.keys(this.loadable(a)).length)return o(e,!1);let l=20-(n-Math.max(a.parkedSince||n,a.lastLoadAt||0));if(l<=0)return i(e,`despedir al camión (no tenemos)`);(!s||l<s)&&(s=l)}if(e.rec.sell){for(let t=0;t<this.docks();t++)if(r(`truck${t}`)&&!c(t)&&this.isParked(t)&&Object.keys(this.surplus(e.rec)).length)return o(t,!0)}return s&&(e.status=`Esperando mercancía: despide al camión en ${Math.ceil(s)} s`),null}default:if(wf[e.role]?.pick)return wf[e.role].pick(this,e,r)}return null}workerDo(e,t){let n=this.s;if(t.kind===`egg`){let e=n.eggs.findIndex(e=>e.id===t.id);e>=0&&this.collectEgg(e,!0)}else if(t.kind===`plot`){if(e.role===`cosechador`)this.harvest(t.p,!0);else if(e.role===`regador`)this.water(t.p,!0);else if(e.role===`sembrador`&&!t.p.crop){let r=this.seedFor(e);if(r){if(r.buy){let t=this.seedPrice(r.crop);if(!this.spend(t))return;n.seeds[r.crop]++,this.h.float(e.x,e.z,`−${t} semilla`,`coin`)}this.plant(t.p,r.crop,!0)}}}else if(t.kind===`kitchen`||t.kind===`proc`){let e=t.key||`kitchen`,n=this.proc(e);if(n.ready&&this.collectKitchen(!0,e),!n.recipe&&!n.ready){let t=[`puros`,`azucar`,`melao`,`guarapo`,`ketchup`].find(t=>this.canStart(t,e));t&&this.startRecipe(t,e)}}else if(t.kind===`struct`)this.collectAnimal(t.id,!0);else if(t.kind===`wplant`||t.kind===`woodhome`)this.lenadorDo(e,t);else if(wf[e.role]?.do)wf[e.role].do(this,e,t);else if(t.kind===`fetch`){let r=n.trucks[t.i],i=t.sell?this.surplus(e.rec):r?this.loadable(r):{};Object.keys(i).length&&(e.carry={i:t.i,sell:!!t.sell,items:i})}else if(t.kind===`truck`){let r=t.i||0,i=n.trucks[r],a=e.carry;if(e.carry=null,!i||!this.isParked(r))return;if(a&&a.sell){let t=this.surplus(e.rec),n=0;for(let e of Object.keys(a.items)){let r=Math.min(a.items[e],t[e]||0);r>0&&this.sellLoose(e,r,!0)&&(n+=fd[e].sell*r)}n&&this.h.float(Xd.x,wd[r]-1,`Venta suelta +${n}`,`coin`)}else this.canLoadSome(i)?this.loadTruck(r,!0):20-(Pf()-Math.max(i.parkedSince||0,i.lastLoadAt||0))<=0&&this.skipTruck(r,!0)}}updateWorker(e,t){let n=Ad[e.rec.lvl];if(e.path&&(this.stepAlong(e,t),e.path))return;if(e.task){if(e.work<=0&&(e.work=n.work,e.workDur=n.work,e.status=e.task.doing,e.busy=!0,Math.hypot(e.task.x-e.x,e.task.z-e.z)>.05&&(e.face=Math.atan2(e.task.x-e.x,e.task.z-e.z))),e.work-=t,e.work>0)return;e.work=0,this.workerDo(e,e.task.t),e.rec.jobs=(e.rec.jobs||0)+1,this.reserved.delete(e.task.key),e.task=null,e.wait=n.rest,e.busy=!1;return}if(e.wait-=t,e.wait>0)return;let r=this.workerPick(e);if(!r&&e.role===`camionero`){e.wait=.8;let t=this.camHome(e);if(t&&(Math.floor(e.x)!==t[0]||Math.floor(e.z)!==t[1])){let n=this.pathTo(e,[t]);n&&n.length>1&&(n.shift(),e.path=n.map(([e,t])=>({x:e+.5,z:t+.5})))}else e.face=Math.PI/2;return}if(!r){e.wait=(2.5+Math.random()*3)*(n.rest/1.6+.5),e.idleFor=(e.idleFor||0)+e.wait;let t=e.idleFor>12?this.homeOf(e):null;if(t){let n=[t.x+1,t.z+t.h];if(Math.floor(e.x)!==n[0]||Math.floor(e.z)!==n[1]){let r=this.pathTo(e,this.footprintGoals(n[0],n[1],1,1,0).length?[n]:this.footprintGoals(t.x,t.z,t.w,t.h));r&&r.length>1&&(r.shift(),e.path=r.map(([e,t])=>({x:e+.5,z:t+.5})),e.status=`Va a descansar a su casa del batey`)}else e.status=`Descansando en el batey`;return}if(Math.random()<.5)return;let r=5+Math.floor(Math.random()*9),i=7+Math.floor(Math.random()*5),a=this.pathTo(e,this.can(r,i)?[[r,i]]:[]);a&&a.length>1&&(a.shift(),e.path=a.map(([e,t])=>({x:e+.5,z:t+.5})));return}e.idleFor=0;let i=this.goalsFor(r.t),a=this.pathTo(e,i);a?(this.reserved.add(r.key),r.doing={recolector:r.t.kind===`struct`?`Recogiendo`:`Recogiendo huevos`,regador:`Regando`,sembrador:`Sembrando`,cosechador:`Cosechando`,cocinera:`En el fogón`,lenador:r.t.kind===`woodhome`?`Apilando la madera`:`Tumbando con el machete`,camionero:r.t.kind===`fetch`?`Juntando la mercancía`:e.carry?e.carry.sell?`Vendiendo lo que sobra`:`Cargando el camión`:`Despidiendo el camión`}[e.role],e.task=r,e.status=`Va a ${r.verb}`,e.busy=!0,e.path=a.map(([e,t])=>({x:e+.5,z:t+.5})),r.t.kind===`egg`&&(e.path[e.path.length-1]=this.eggPos(r.t.id)),e.path.length>1?e.path.shift():Math.hypot(e.path[0].x-e.x,e.path[0].z-e.z)<.05&&(e.path=null)):e.wait=2}stepAlong(e,t){let n=e.path[0],r=n.x-e.x,i=n.z-e.z,a=Math.hypot(r,i),o=e.speed*t;e.moving=!0,a>1e-4&&(e.face=Math.atan2(r,i)),a<=o?(e.x=n.x,e.z=n.z,e.path.shift(),e.path.length||(e.path=null,e.moving=!1)):(e.x+=r/a*o,e.z+=i/a*o),e.walk+=t*e.speed*2.2}moveFree(e,t){let n=this.player;n.path=null,n.task=null;let r=n.speed*t,i=(e,t)=>{let r=.22,i=Math.floor(n.x),a=Math.floor(n.z);for(let[n,o]of[[-.22,-.22],[r,-.22],[-.22,r],[r,r]]){let r=Math.floor(e+n),s=Math.floor(t+o);if((r!==i||s!==a)&&(!this.can(r,s)||r!==i!=(s!==a)&&this.edge(i,a,r,s)||r!==i&&s!==a&&(this.edge(i,a,r,a)||this.edge(i,a,i,s))))return!1}return n.x=e,n.z=t,!0},a=i(n.x+e.x*r,n.z),o=i(n.x,n.z+e.z*r);n.moving=a||o,n.face=Math.atan2(e.x,e.z),n.walk+=t*n.speed*2.2}update(e,t=e){let n=this.s,r=Pf(),i=this.player;if(i.path){if(this.stepAlong(i,t),!i.path&&i.task){let e=i.task;i.task=null,this.perform(e)}}else this.freeMoving||(i.moving=!1);n.player.x=i.x,n.player.z=i.z;for(let e=n.eggs.length-1;e>=0;e--){let t=n.eggs[e];Math.hypot(t.x-i.x,t.z-i.z)<.55&&this.collectEgg(e)}let a=Math.floor(i.x),o=Math.floor(i.z),s=n.plots.find(e=>e.x===a&&e.z===o);s&&this.plotState(s,r)===`ripe`&&Math.hypot(a+.5-i.x,o+.5-i.z)<.45&&this.space()>0&&this.harvest(s);for(let e of n.chickens){let t=0;for(;r>=e.nextLay&&t++<50;){if(n.eggs.length<10){let t=Math.min(G.x1+.8,Math.max(G.x0+.2,e.x+(Math.random()-.5)*.4)),r=Math.min(G.z1+.8,Math.max(G.z0+.2,e.z+(Math.random()-.5)*.4));n.eggs.push({id:n.nextId++,x:t,z:r}),this.h.layed?.(e)}else this.eggFullWarned||(this.eggFullWarned=!0,this.h.toast(`El corral está lleno de huevos. ¡Recógelos!`));e.nextLay+=30*(.85+Math.random()*.3),r-e.nextLay>300&&(e.nextLay=r+15)}}this.updateTrucks(e);for(let e of this.procKeys()){let t=this.proc(e);t.recipe&&r-t.at>=gd[t.recipe].time&&(t.ready=gd[t.recipe].out,t.recipe=null,this.h.changed(`kitchen`))}for(let[e,t]of Object.entries(W)){let i=n.built[e];i&&t.kind===`animal`&&!i.ready&&r-i.at>=t.produce.time&&(i.ready=!0,this.h.changed(`built`))}for(let t of this.workers)this.updateWorker(t,e),t.rec.x=t.x,t.rec.z=t.z;this.updateV4(e);for(let t of Tf)t.update?.(this,e);for(let t of n.chickens){let r=this.chickRT.get(t.id);r||(r={tx:t.x,tz:t.z,wait:Math.random()*2,peck:0,face:Math.random()*6,moving:!1},this.chickRT.set(t.id,r)),r.wait-=e,r.wait<=0&&(r.tx=G.x0+.35+Math.random()*(G.x1-G.x0+.3),r.tz=G.z0+.35+Math.random()*(G.z1-G.z0+.3),r.wait=1.5+Math.random()*3);let i=r.tx-t.x,a=r.tz-t.z,o=Math.hypot(i,a);if(r.moving=o>.05,r.moving){let n=Math.min(o,e*.9);t.x+=i/o*n,t.z+=a/o*n,r.face=Math.atan2(i,a)}for(let e of n.chickens){if(e===t)continue;let n=t.x-e.x,r=t.z-e.z,i=Math.hypot(n,r);i<.45&&i>1e-4&&(t.x+=n/i*(.45-i)*.5,t.z+=r/i*(.45-i)*.5)}t.x=Math.min(G.x1+.75,Math.max(G.x0+.25,t.x)),t.z=Math.min(G.z1+.75,Math.max(G.z0+.25,t.z))}}};tp(mp);var hp=class extends ir{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Xi;e.deleteAttribute(`uv`);let t=new Po({side:1}),n=new Po,r=new vs(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new V(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Ni(e,n,6),o=new Jn;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new V(e,gp(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new V(e,gp(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new V(e,gp(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new V(e,gp(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new V(e,gp(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new V(e,gp(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function gp(e){return new Fo({color:0,emissive:16777215,emissiveIntensity:e})}function _p(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Qr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=vp(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=vp(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function vp(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Lr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var yp=t({Builder:()=>Y,P:()=>X,andenGeo:()=>Tm,basketGeo:()=>nm,benchGeo:()=>Um,bladesGeo:()=>wm,bodegaGeo:()=>Bm,bohioGeo:()=>Fp,bridgeGeo:()=>Gm,caneLowGeo:()=>dm,ceibaGeo:()=>Pp,chickenGeo:()=>Zp,churchGeo:()=>Hm,cocoteroGeo:()=>Am,coopGeo:()=>Ip,cowGeo:()=>vm,crateGeo:()=>Jp,cropGeo:()=>im,eggGeo:()=>$p,fencePost:()=>Hp,flagGeo:()=>Up,flagPoleGeo:()=>Wp,fordStoneGeo:()=>Mm,fruitGeo:()=>jm,goatGeo:()=>ym,grassClumpGeo:()=>om,guayabaGeo:()=>km,guineaGeo:()=>Fm,horseGeo:()=>Im,jutiaGeo:()=>Nm,kitchenGeo:()=>Lp,lampGeo:()=>Wm,logPileGeo:()=>Lm,machetGeo:()=>Km,mangoTreeGeo:()=>Om,marabuGeo:()=>hm,mogoteGeo:()=>pm,palmGeo:()=>Np,palmLowGeo:()=>fm,part:()=>J,penGeo:()=>xm,personParts:()=>em,pigGeo:()=>bm,place:()=>jp,plankFenceGeo:()=>Bp,plotGeo:()=>rm,rng:()=>K,rockGeo:()=>lm,rockPileGeo:()=>mm,roosterGeo:()=>Qp,schoolGeo:()=>Vm,setMat:()=>Op,signGeo:()=>cm,siteGeo:()=>Em,smallBohioGeo:()=>zm,sparkleGeo:()=>am,stumpGeo:()=>gm,tankGeo:()=>Rp,tobaccoHouseGeo:()=>zp,toolGeo:()=>tm,trapicheGeo:()=>Sm,treeGeo:()=>Dm,truckGeo:()=>qp,tuftGeo:()=>sm,wellGeo:()=>Cm,wheelDecorGeo:()=>um,wildPigGeo:()=>Pm,wireFenceGeo:()=>Vp,worn:()=>q,zincHouseGeo:()=>Rm});function K(e=1){let t=e>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var bp=new xn,xp=new Zt,Sp=new jn,Cp=new R,wp=new R,Tp=new B,Ep=new Map,Dp=new Map;function Op(e,...t){for(let n of t)Dp.set(n,e)}function q(e,t,n=.08){let r=kp(e,t,n);return Ep.set(r,Ep.get(e)??e),r}function kp(e,t,n){Tp.set(e);let r={};Tp.getHSL(r);let i=(t()-.5)*2*n;return Tp.setHSL(r.h+i*.08,Math.max(0,Math.min(1,r.s*(1-Math.abs(i)))),Math.max(0,Math.min(1,r.l*(1+i)))),Tp.getHex()}function J(e,t,n={}){let r=e.index?e.toNonIndexed():e.clone();for(let e of Object.keys(r.attributes))e!==`position`&&e!==`normal`&&r.deleteAttribute(e);r.morphAttributes&&(r.morphAttributes={}),r.attributes.normal||r.computeVertexNormals(),Sp.set(n.rx||0,n.ry||0,n.rz||0,n.order||`XYZ`),xp.setFromEuler(Sp),bp.compose(Cp.set(n.x||0,n.y||0,n.z||0),xp,wp.set(n.sx??1,n.sy??1,n.sz??1)),r.applyMatrix4(bp);let i=r.attributes.position.count,a=new Float32Array(i*3);Tp.set(t);for(let e=0;e<i;e++)a[e*3]=Tp.r,a[e*3+1]=Tp.g,a[e*3+2]=Tp.b;r.setAttribute(`color`,new Lr(a,3));let o=Ep.get(t)??t,s=n.m??Dp.get(o)??0;return r.setAttribute(`matId`,new Lr(new Float32Array(i).fill(s),1)),r}function Ap(e,t,n){let r=e/2,i=t/2,a=[-r,0,-i],o=[-r,0,i],s=[-r,n,0],c=[r,0,-i],l=[r,0,i],u=[r,n,0],d=[a,s,o,c,l,u,a,c,u,a,u,s,o,s,u,o,u,l,a,o,l,a,l,c],f=new Qr;return f.setAttribute(`position`,new Br(d.flat(),3)),f.computeVertexNormals(),f}var Y=class{constructor(){this.parts=[]}add(e){return this.parts.push(e),this}box(e,t,n,r,i={}){return this.add(J(new Xi(e,t,n),r,{...i,y:(i.y||0)+(i.center?0:t/2)}))}cyl(e,t,n,r,i,a={}){return this.add(J(new Qi(e,t,n,r),i,{...a,y:(a.y||0)+(a.center?0:n/2)}))}cone(e,t,n,r,i={}){return this.add(J(new $i(e,t,n),r,{...i,y:(i.y||0)+(i.center?0:t/2)}))}ico(e,t,n={},r=0){return this.add(J(new _o(e,r),t,n))}gable(e,t,n,r,i={}){return this.add(J(Ap(e,t,n),r,i))}merge(e){return e&&this.parts.push(e),this}build(){if(!this.parts.length)return new Qr;let e=_p(this.parts,!1);return this.parts.forEach(e=>e.dispose()),this.parts=[],e}};function jp(e,t,n,r=0,i=0,a=1){let o=e.clone();return xp.setFromEuler(Sp.set(0,r,0)),bp.compose(Cp.set(t,i,n),xp,wp.set(a,a,a)),o.applyMatrix4(bp),o}var X={earth:11030574,earthDark:9060132,furrow:7221792,earthWet:7023642,grass:8228677,grassB:9674832,grassC:6978106,wild:6255670,dust:13214839,thatch:11831882,thatchDark:9267768,wood:9136709,woodLite:10914402,woodGrey:9340279,paintBlue:7311272,cream:15260085,mint:9417635,rust:9063210,chrome:12169890,tire:2827810,glass:4017751,palmTrunk:12432806,palmShaft:8362570,leaf:5208628,leafDark:3957032,leafLite:7115841,brick:10246716,skin:11565136,white:15788248,pants:4938350,hat:14204803,red:12597547,blue:1916806,flagWhite:15985884,tin:9080719,coopRed:10111546,stone:10129796,clay:11887933};Op(1,X.wood,X.woodLite,X.woodGrey,X.coopRed,8151625,7231040,10189392,8219736,7296310,10254924,11569752,11770480,7232066,4864554,3811870,7031338,9406328,10130050),Op(2,X.thatch,X.thatchDark,10119726,X.hat,15259304,11569232,9071162),Op(3,X.mint,X.rust,8361904,11884874,14272928,9214558,7311242,13209162,7306112,3090982),Op(4,X.tin),Op(5,X.leaf,X.leafDark,X.leafLite,X.palmShaft,5602612,4878384,6523452,7312452,8363068,7313978,8231493,7311156,8823876,6126149,7309882,X.grassC),Op(6,X.stone,X.brick,X.clay,11561544,10245170,X.palmTrunk),Op(7,X.earth,X.earthDark,X.furrow);function Mp(e,t,n,r){let i=[],a=[],o=new B(X.leafDark),s=new B(X.leafLite),c=new B,l=0,u=0,d=0,f=n,p=[];for(let n=0;n<=8;n++){p.push([l,u,d]);let n=e/8;l+=Math.cos(f)*Math.cos(t)*n,u+=Math.sin(f)*n,d+=-Math.cos(f)*Math.sin(t)*n,f-=1.15/8*(1+r()*.3)}let m=Math.sin(t),h=Math.cos(t);for(let e=0;e<8;e++){let[t,n,l]=p[e],[u,d,f]=p[e+1],g=e/8,_=(e+1)/8,v=Math.sin(Math.PI*Math.min(1,g*1.2+.08))*.42,y=Math.sin(Math.PI*Math.min(1,_*1.2+.08))*.42,b=.12+g*.18,x=.12+_*.18;for(let e of[-1,1]){let p=[t,n,l],S=[u,d,f],C=[u+e*m*y,d-x,f+e*h*y],w=[t+e*m*v,n-b,l+e*h*v];i.push(...p,...S,...C,...p,...C,...w);for(let e=0;e<6;e++){let t=+(e===2||e===4||e===5);c.copy(o).lerp(s,(g+_)*.35+t*.3+r()*.05),a.push(c.r,c.g,c.b)}}}let g=new Qr;return g.setAttribute(`position`,new Br(i,3)),g.setAttribute(`color`,new Br(a,3)),g.setAttribute(`matId`,new Br(new Float32Array(i.length/3).fill(5),1)),g.computeVertexNormals(),g}function Np(e=1,t=4.2){let n=K(e),r=new Y,i=(n()-.5)*.25,a=0;for(let e=0;e<6;e++){let o=t/6,s=.12*(1+Math.sin(e/6*Math.PI*.9)*.28)+(e===0?.04:0);r.cyl(s*.96,s,o,10,q(X.palmTrunk,n,.05),{y:a,x:a/t*i*.6}),a+=o}let o=i*.6;r.cyl(.1,.125,.8,10,X.palmShaft,{y:a,x:o}),a+=.8,r.add(J(new Co(.1,8,6),X.palmShaft,{y:a,x:o}));for(let e=0;e<13;e++){let t=e/13*Math.PI*2+n()*.3,i=e%3==0?.9:.35+n()*.35,s=Mp(1.9+n()*.4,t,i,n);s.translate(o,a,0),r.add(s)}return r.build()}function Pp(e=7){let t=K(e),n=new Y;n.cyl(.38,.55,2.3,9,10130050);for(let e=0;e<6;e++){let t=e/6*Math.PI*2;n.box(.7,.55,.1,9406328,{x:Math.cos(t)*.45,z:-Math.sin(t)*.45,ry:t})}for(let e=0;e<4;e++){let t=e/4*Math.PI*2+.4;n.cyl(.08,.14,1.4,5,9406328,{x:Math.cos(t)*.45,z:-Math.sin(t)*.45,y:1.9,rz:Math.cos(t)*.8,rx:Math.sin(t)*.8})}let r=[5602612,4878384,6523452,7312452];for(let e=0;e<9;e++){let i=t()*Math.PI*2,a=.4+t()*1.2;n.ico(.75+t()*.45,r[e%r.length],{x:Math.cos(i)*a,z:Math.sin(i)*a,y:2.8+t()*.5,sy:.55},0)}return n.build()}function Fp(){let e=K(11),t=new Y;t.box(2.5,.15,2,X.stone,{z:-.25}),t.box(2.3,1.35,1.8,X.wood,{y:.15,z:-.25});for(let n=0;n<9;n++){let r=-1.02+n*2.04/8;t.box(.2,1.3,.03,q(X.woodLite,e,.18),{x:r,y:.17,z:.665})}for(let n=0;n<7;n++){let r=-1.02+n*1.54/6;t.box(.03,1.3,.2,q(X.woodLite,e,.18),{x:1.1649999999999998,y:.17,z:r})}t.box(.5,.95,.05,3811870,{x:-.35,y:.15,z:.65+.04}),t.box(.08,.95,.06,X.paintBlue,{x:-.62,y:.15,z:.65+.05}),t.box(.08,.95,.06,q(X.paintBlue,e,.2),{x:-.08,y:.15,z:.65+.05}),t.box(.5,.42,.05,2892832,{x:.55,y:.65,z:.65+.04}),t.box(.26,.46,.04,q(X.paintBlue,e,.25),{x:.92,y:.63,z:.75,ry:-.6}),t.box(.05,.42,.5,2892832,{x:1.19,y:.65,z:-.3}),t.box(.04,.46,.26,q(X.paintBlue,e,.25),{x:1.27,y:.63,z:.04,ry:.5}),t.gable(2.9,3,1.25,X.thatch,{y:1.5,z:-.05}),t.gable(3,3.15,.3,X.thatchDark,{y:1.4500000000000002,z:-.05}),t.box(3,.08,.12,X.thatchDark,{y:2.7,z:-.05});for(let n of[-1.15,0,1.15])t.box(.1,1.45,.1,q(X.wood,e,.15),{x:n,z:1.2});for(let e of[.25,.75]){t.box(.32,.05,.32,X.woodLite,{x:e,y:.4,z:.95}),t.box(.3,.4,.04,10189392,{x:e,y:.42,z:.8,rx:-.2});for(let[n,r]of[[-.12,-.12],[.12,-.12],[-.12,.12],[.12,.12]])t.box(.04,.4,.04,X.wood,{x:e+n,z:.95+r})}return t.ico(.28,X.clay,{x:1.25,y:.3,z:.75,sy:1.15},1),t.cyl(.14,.18,.12,8,10245170,{x:1.25,y:.58,z:.75}),t.build()}function Ip(){let e=K(21),t=new Y;for(let[e,n]of[[-.7,-.5],[.7,-.5],[-.7,.5],[.7,.5]])t.box(.1,.35,.1,X.wood,{x:e,z:n});t.box(1.6,.95,1.2,X.coopRed,{y:.35});for(let n=0;n<7;n++)t.box(.21,.9,.03,q(X.coopRed,e,.22),{x:-.68+n*.227,y:.37,z:.615});for(let n=0;n<5;n++)t.box(.03,.9,.22,q(X.coopRed,e,.22),{x:.815,y:.37,z:-.46+n*.23});for(let n=0;n<4;n++)t.box(.18+e()*.2,.12+e()*.2,.02,X.woodGrey,{x:-.6+e()*1.2,y:.45+e()*.5,z:.635});t.box(.32,.36,.04,2300436,{x:.15,y:.4,z:.64}),t.box(.3,.04,.75,X.woodLite,{x:.15,y:.18,z:.95,rx:.5});for(let n=0;n<8;n++){let r=e()<.35;t.box(.24,.04,1.6,r?q(X.rust,e,.2):q(X.tin,e,.1),{x:-.84+n*.24,y:1.38,z:0,rx:0,rz:0,sy:1,center:!1})}return t.box(1.95,.06,.1,X.rust,{y:1.42}),t.box(.06,.5,.06,X.wood,{x:-.8,y:1.3,z:-.6}),t.build()}function Lp(){let e=K(31),t=new Y;t.box(1.7,.08,1.7,X.stone);for(let[n,r]of[[-.75,-.75],[.75,-.75],[-.75,.75],[.75,.75]])t.box(.1,1.5,.1,q(X.wood,e,.15),{x:n,z:r});t.gable(2,2,.85,X.thatch,{y:1.45}),t.gable(2.1,2.12,.2,X.thatchDark,{y:1.42}),t.box(1.1,.6,.65,X.brick,{z:-.35});for(let n=0;n<6;n++)t.box(.25,.1,.02,q(11561544,e,.2),{x:-.4+n%3*.38,y:.15+Math.floor(n/3)*.22,z:-.02});t.box(.18,.2,.02,2037266,{x:.05,y:.12,z:-.015}),t.box(.2,.9,.2,X.brick,{x:-.42,y:.6,z:-.55}),t.cyl(.22,.18,.3,9,2959912,{x:.15,y:.6,z:-.35}),t.box(.6,.05,.4,X.woodLite,{x:.45,y:.55,z:.45});for(let[e,n]of[[.2,.3],[.7,.3],[.2,.6],[.7,.6]])t.box(.05,.55,.05,X.wood,{x:e,z:n});for(let e=0;e<3;e++)t.ico(.07,X.red,{x:.3+e*.12,y:.66,z:.45});return t.cyl(.05,.05,.16,6,11745830,{x:.65,y:.6,z:.5}),t.build()}function Rp(){let e=K(41),t=new Y;for(let[e,n]of[[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3]])t.box(.07,1.2,.07,X.wood,{x:e,z:n,rz:e*.08,rx:-n*.08});return t.box(.7,.05,.7,X.woodGrey,{y:1.2}),t.cyl(.36,.36,.7,10,7306112,{y:1.25}),t.cyl(.37,.37,.12,10,X.rust,{y:1.55}),t.cyl(.38,.38,.04,10,q(X.rust,e),{y:1.95}),t.build()}function zp(){let e=K(51),t=new Y;t.box(2.6,1.3,1.5,7231040);for(let n=0;n<11;n++)t.box(.22,1.25,.03,q(8151625,e,.2),{x:-1.2+n*.24,z:.765});t.box(.5,.9,.04,2365970,{x:.4,z:.78}),t.gable(2.8,1.9,1.7,X.thatch,{y:1.3}),t.gable(2.9,2,.25,X.thatchDark,{y:1.27}),t.box(1.6,.04,.04,X.wood,{x:-.3,y:1.15,z:.95});for(let n=0;n<7;n++)t.box(.12,.4,.03,10119726,{x:-1+n*.22,y:.75,z:.95,rz:(e()-.5)*.2});for(let e of[-1.05,.45])t.box(.06,1.2,.06,X.wood,{x:e,z:.95});return t.build()}function Bp(e){let t=K(e),n=new Y;n.box(.09,.62,.09,q(X.woodGrey,t,.15),{x:-.5,rz:(t()-.5)*.08});for(let e of[.18,.42])t()<.12||n.box(1,.09,.04,q(t()<.2?X.woodLite:X.woodGrey,t,.18),{y:e,rz:(t()-.5)*.08});return n.build()}function Vp(e){let t=K(e),n=new Y;n.box(.07,.55+t()*.12,.07,q(8219736,t,.2),{x:-.5,rz:(t()-.5)*.12,rx:(t()-.5)*.1});for(let e of[.22,.4])n.box(1,.015,.015,9210502,{y:e+(t()-.5)*.04});return n.build()}function Hp(){let e=new Y;return e.box(.09,.62,.09,X.woodGrey),e.build()}function Up(){let e=.9,t=.45,n=new yo(e,t,12,6).toNonIndexed();n.translate(e/2,0,0);let r=n.attributes.position,i=new Float32Array(r.count*3),a=new B(X.blue),o=new B(X.flagWhite),s=new B(X.red);for(let n=0;n<r.count;n+=3){let c=0,l=0;for(let e=0;e<3;e++)c+=r.getX(n+e),l+=r.getY(n+e);c/=3,l/=3;let u=c/e,d=(l+t/2)/t,f;f=u*2<.866*(1-2*Math.abs(d-.5))*1?s:Math.floor(d*5)%2==0?a:o;for(let e=0;e<3;e++)i[(n+e)*3]=f.r,i[(n+e)*3+1]=f.g,i[(n+e)*3+2]=f.b}n.setAttribute(`color`,new Lr(i,3)),n.deleteAttribute(`uv`);let c=new Ma;for(let e=0;e<10;e++){let t=Math.PI/2+e/10*Math.PI*2,n=e%2==0?.055:.022,r=Math.cos(t)*n,i=Math.sin(t)*n;e===0?c.moveTo(r,i):c.lineTo(r,i)}let l=new xo(c),u=J(l,X.flagWhite,{x:.13,z:.004}),d=J(l,X.flagWhite,{x:.13,z:-.004,ry:Math.PI}),f=J(n,16777215);f.setAttribute(`color`,n.attributes.color);let p=_p([f,u,d]);return p.userData.length=e,p}function Wp(e=2.6){let t=new Y;return t.cyl(.035,.045,e,6,10130570),t.ico(.06,13218426,{y:e+.02}),t.box(.3,.12,.3,X.stone),t.build()}function Gp(e,t,n,r=.31){for(let i of t)for(let t of n)e.cyl(r,r,.24,16,X.tire,{x:i,y:r,z:t,rz:Math.PI/2,center:!0}),e.cyl(r*.5,r*.5,.26,12,14209212,{x:i,y:r,z:t,rz:Math.PI/2,center:!0,m:3}),e.cyl(r*.18,r*.18,.28,8,9079428,{x:i,y:r,z:t,rz:Math.PI/2,center:!0})}function Kp(e,t,n,r,i){e.add(J(new Qi(.42,.42,.3,16,1,!1,0,Math.PI),q(r,i,.08),{x:t,y:.42,z:n,rz:Math.PI/2,ry:0,m:3,sz:1.2}))}function qp(e=0,t=X.mint){let n=K(61+e*7+(t&255)),r=new Y,i=(e,t=.1)=>q(e,n,t);r.box(1.25,.16,e===1?4:3.4,3090982,{y:.3,z:e===1?.3:0}),r.add(J(new Zi(.07,1.25,4,8),X.chrome,{y:.32,z:-1.74,rz:Math.PI/2,m:0}));let a=e===2?1:1.15;r.box(.95,.42,a,i(t),{y:.42,z:-1.08,m:3}),r.add(J(new Qi(.48,.48,a,18,1,!1,-Math.PI/2,Math.PI),i(t),{y:.82,z:-1.08,rx:Math.PI/2,sx:1,sz:.32,m:3})),Kp(r,-.6,-1.15,t,n),Kp(r,.6,-1.15,t,n);for(let e=0;e<6;e++){let e=n()<.5?-1:1;r.box(.02,.1+n()*.12,.18+n()*.25,i(X.rust,.2),{x:e*.76,y:.35+n()*.15,z:-1.5+n()*2.6,m:3})}r.box(.78,.34,.05,X.chrome,{y:.4,z:-1.68});for(let e=0;e<6;e++)r.box(.025,.28,.02,6249042,{x:-.3+e*.12,y:.43,z:-1.71});for(let e of[-.6,.6])r.add(J(Xp(.1,10,8),15918776,{x:e,y:.74,z:-1.5})),r.add(J(new Qi(.11,.11,.06,12),X.chrome,{x:e,y:.74,z:-1.45,rx:Math.PI/2}));let o=-.08;r.box(1.2,.7,.95,i(t),{y:.55,z:o,m:3}),r.add(J(new Zi(.3,.6,4,12),i(t),{y:1.22,z:o,rz:Math.PI/2,sy:1,sz:1.55,sx:.55,m:3})),r.box(.98,.32,.03,X.glass,{y:.92,z:-.57});for(let e of[-.61,.61])r.box(.03,.3,.5,X.glass,{x:e,y:.95,z:-.16});for(let e of[-.7,.7])r.box(.04,.1,.08,X.chrome,{x:e,y:1,z:-.53});for(let e of[-.68,.68])r.box(.16,.04,1.2,3814704,{x:e,y:.26,z:-.03});if(e===0){Kp(r,-.6,.95,t,n),Kp(r,.6,.95,t,n),r.box(1.25,.06,1.75,X.woodGrey,{y:.42,z:.85});for(let e of[-.62,.62])for(let t of[.5,.72])r.box(.05,.16,1.75,i(X.woodLite,.2),{x:e,y:t,z:.85});for(let e of[.5,.72])r.box(1.25,.16,.05,i(X.woodLite,.2),{y:e,z:1.71});Gp(r,[-.6,.6],[-1.15,.95])}else if(e===1){r.box(1.45,.08,2.4,X.woodGrey,{y:.48,z:1.3});for(let e of[-.7,.7]){for(let t=0;t<6;t++)r.box(.06,.8,.06,i(X.wood,.2),{x:e,y:.5,z:.2+t*.44});for(let t of[.75,1.1])r.box(.04,.12,2.4,i(X.woodLite,.25),{x:e,y:t,z:1.3})}for(let e of[.75,1.1])r.box(1.45,.12,.04,i(X.woodLite,.25),{y:e,z:2.48});Gp(r,[-.62,.62],[-1.15,1.75,2.1],.33)}else{Kp(r,-.6,.9,t,n),Kp(r,.6,.9,t,n),r.box(1.2,.45,1.6,i(t),{y:.42,z:.85,m:3}),r.add(J(new Qi(.62,.62,1.5,14,1,!1,-Math.PI/2,Math.PI),11049586,{y:.88,z:.85,rx:Math.PI/2,sz:.5,m:2}));for(let e=0;e<3;e++)r.box(1.26,.04,.05,7035450,{y:1.18,z:.25+e*.6});Gp(r,[-.6,.6],[-1.15,.9])}return r.build()}function Jp(e=0){let t=new Y;return t.box(.45,.3,.4,e?11569752:10254924),t.box(.47,.04,.42,7296310,{y:.28}),t.ico(.08,e?X.red:16050898,{y:.34,x:-.1}),t.ico(.08,e?X.red:16050898,{y:.34,x:.1,z:.05}),t.build()}var Yp=[9062950,15326660,5911588,12022842],Xp=(e,t=12,n=9)=>new Co(e,t,n);function Zp(e=0){let t=new Y,n=Yp[e%Yp.length],r=new B(n).multiplyScalar(.7).getHex();t.add(J(Xp(.2),n,{y:.27,sx:.85,sz:1.15})),t.add(J(Xp(.13,10,7),r,{y:.28,x:.15,sx:.35,sz:.9})),t.add(J(Xp(.13,10,7),r,{y:.28,x:-.15,sx:.35,sz:.9})),t.add(J(Xp(.105,10,8),n,{y:.47,z:-.17}));for(let e=0;e<3;e++)t.add(J(Xp(.03,6,4),X.red,{y:.575-e*.012,z:-.21+e*.04}));t.cone(.03,.08,6,14721072,{y:.46,z:-.29,rx:-Math.PI/2,center:!0}),t.add(J(Xp(.025,6,4),X.red,{y:.4,z:-.25,sy:1.6})),t.add(J(Xp(.012,5,4),1118481,{y:.49,z:-.25,x:.06})),t.add(J(Xp(.012,5,4),1118481,{y:.49,z:-.25,x:-.06})),t.add(J(Xp(.12,8,6),e===1?14208176:3810328,{y:.38,z:.22,sx:.5,sz:.6,rx:-.6}));for(let e of[-.06,.06])t.cyl(.015,.015,.12,5,13998650,{x:e,y:.02});return t.build()}function Qp(){let e=new Y;e.add(J(Xp(.22),10764319,{y:.34,sx:.85,sz:1.1})),e.add(J(Xp(.13,10,8),13136938,{y:.6,z:-.17})),e.add(J(Xp(.1,8,6),14192682,{y:.48,z:-.12,sy:1.3}));for(let t=0;t<4;t++)e.add(J(Xp(.04,6,4),X.red,{y:.72-Math.abs(t-1.5)*.02,z:-.24+t*.045}));e.cone(.035,.1,6,14721072,{y:.58,z:-.31,rx:-Math.PI/2,center:!0}),e.add(J(Xp(.035,6,4),X.red,{y:.5,z:-.27,sy:1.6}));for(let t=0;t<5;t++)e.add(J(Xp(.16,8,6),t%2?2046508:1319708,{y:.5+t*.03,z:.26+t*.02,x:(t-2)*.03,sx:.18,sy:1.2,sz:.45,rx:-.5+t*.15}));for(let t of[-.07,.07])e.cyl(.018,.018,.16,5,13998650,{x:t,y:.02});return e.build()}function $p(){return J(new Co(.09,10,8),16050898,{y:.11,sy:1.3})}function em(e=X.white,t=X.hat,n=1,r={}){let i=K(n),a=r.skin??X.skin,o=(e,t)=>new Zi(e,t,4,10),s=new Y;s.add(J(o(.15,.24),e,{y:.72,sz:.72})),s.add(J(new Qi(.16,.15,.08,12),X.pants,{y:.52,sz:.75})),s.add(J(new Qi(.155,.155,.03,12),3811870,{y:.565,sz:.75}));for(let e=0;e<4;e++)s.add(J(Xp(.012,5,4),15261904,{y:.84-e*.07,z:-.115}));s.add(J(new $i(.07,.1,4),X.red,{y:.9,z:-.1,rx:Math.PI,sz:.4})),s.add(J(Xp(.115,12,10),a,{y:1})),s.add(J(Xp(.03,6,5),new B(a).multiplyScalar(.9).getHex(),{y:.99,z:-.11})),s.add(J(new Xi(.12,.025,.02),3811872,{y:.955,z:-.1})),t==null?(s.add(J(Xp(.125,12,8),r.scarf??X.red,{y:1.04,z:.01,sy:.85})),s.add(J(Xp(.05,8,6),r.scarf??X.red,{y:1.02,z:.13}))):(s.add(J(new Qi(.33,.34,.025,20),t,{y:1.1,m:2})),s.add(J(new Qi(.12,.15,.15,14),q(t,i,.08),{y:1.18,m:2})),s.add(J(new Qi(.152,.152,.035,14),7031338,{y:1.13}))),r.scarf!=null&&t!=null&&s.add(J(new $i(.11,.14,4),r.scarf,{y:.84,z:-.06,rx:Math.PI,sz:.5})),r.skirt!=null&&(s.add(J(new Qi(.15,.24,.36,14),r.skirt,{y:.4,sz:.85})),s.add(J(Xp(.07,8,6),3022872,{y:1.02,z:.12})));let c=new Y;c.add(J(o(.062,.34),X.pants,{y:-.24})),c.add(J(Xp(.07,8,6),3811870,{y:-.47,z:-.03,sy:.6,sz:1.4}));let l=new Y;return l.add(J(o(.052,.26),e,{y:-.17})),l.add(J(Xp(.045,8,6),X.skin,{y:-.36})),{body:s.build(),leg:c.build(),arm:l.build()}}function tm(e){let t=new Y;switch(e){case`recolector`:case`cosechador`:t.cyl(.11,.08,.1,10,11569232,{m:1}),t.box(.2,.015,.015,9071162,{y:.12}),e===`recolector`?(t.ico(.04,16050898,{y:.07,x:-.03}),t.ico(.04,16050898,{y:.07,x:.03})):t.ico(.045,13778988,{y:.07});break;case`regador`:t.cyl(.07,.08,.14,12,9083552,{m:4}),t.add(J(new Qi(.012,.02,.18,6),9083552,{y:.05,z:-.1,rx:-.9,m:4}));break;case`sembrador`:t.box(.12,.14,.08,14271642,{m:2}),t.box(.13,.03,.09,9071162,{y:.07});break;case`cocinera`:t.add(J(new Qi(.012,.012,.3,6),9071162,{y:.05,m:1})),t.add(J(Xp(.035,8,6),9071162,{y:-.1,sy:.5}));break;default:t.box(.18,.12,.14,10516552,{m:1})}return t.build()}function nm(){let e=new Y;return e.cyl(.16,.12,.14,8,11569232),e.ico(.06,16050898,{y:.15,x:-.05}),e.ico(.06,16050898,{y:.15,x:.05,z:.03}),e.box(.26,.02,.02,9071162,{y:.26}),e.build()}function rm(){let e=new Y;e.box(.94,.08,.94,X.earth);for(let t=0;t<3;t++)e.box(.84,.07,.16,X.earthDark,{y:.06,z:-.3+t*.3});return e.build()}function im(e,t){let n=K(e.length*10+t),r=new Y,i=[[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]];if(t===0){for(let[e,t]of i)r.box(.12,.02,.05,X.leafLite,{x:e-.04,y:.13,z:t,rz:.4}),r.box(.12,.02,.05,X.leafLite,{x:e+.04,y:.13,z:t,rz:-.4}),r.box(.02,.06,.02,X.leaf,{x:e,y:.09,z:t});return r.build()}if(e===`tomato`){let e=t===2;for(let[t,a]of i)if(r.box(.03,e?.62:.42,.03,11770480,{x:t+.1,y:.08,z:a}),r.ico(e?.17:.12,q(X.leaf,n,.12),{x:t,y:e?.34:.24,z:a,sy:1.1}),r.ico(e?.13:.09,q(X.leafLite,n,.12),{x:t+.03,y:e?.5:.36,z:a-.02}),e)for(let e=0;e<3;e++)r.ico(.065,e===2?13785134:X.red,{x:t+(n()-.5)*.25,y:.25+n()*.25,z:a+.12+n()*.05},1);else r.ico(.04,9087050,{x:t+.08,y:.28,z:a+.1})}else if(e===`cane`){let e=t===2?1.25:.7;for(let[i,a]of[[-.25,-.2],[0,-.25],[.25,-.2],[-.22,.2],[.05,.22],[.27,.18]]){for(let t=0;t<4;t++)r.cyl(.035,.04,e/4-.01,5,t%2?12169306:10461770,{x:i,y:.08+e/4*t,z:a});for(let o=0;o<3;o++){let s=n()*Math.PI*2;r.box(.5,.02,.06,q(t===2?8363068:X.leafLite,n,.12),{x:i+Math.cos(s)*.18,y:.08+e*(.55+o*.17),z:a-Math.sin(s)*.18,ry:s,rz:-.5})}}}else if(e===`tobacco`){let e=t===2;for(let[t,a]of i){let i=e?.75:.4;r.cyl(.025,.035,i,5,8231493,{x:t,y:.08,z:a});let o=e?6:4;for(let s=0;s<o;s++){let c=s/o*Math.PI*2+n(),l=.12+s/o*i*.85,u=e?.32-s*.025:.2;r.ico(1,q(e?7313978:X.leafLite,n,.1),{x:t+Math.cos(c)*u*.5,y:l,z:a-Math.sin(c)*u*.5,sx:u*.55,sy:.02,sz:u*.28,ry:c})}e&&r.ico(.05,15180726,{x:t,y:.08+i+.04,z:a})}}return r.build()}function am(){return J(new vo(.09,0),16769162,{sy:1.4})}function om(e=1,t=.32){let n=K(e),r=[],i=[],a=new B(5204522),o=new B(11121242);for(let e=0;e<7;e++){let e=n()*Math.PI,s=(n()-.5)*.22,c=(n()-.5)*.22,l=.035,u=t*(.6+n()*.6),d=(n()-.5)*.25,f=Math.cos(e)*l,p=Math.sin(e)*l;r.push(s-f,0,c-p,s+f,0,c+p,s+d,u,c+d*.5),i.push(a.r,a.g,a.b,a.r,a.g,a.b,o.r,o.g,o.b)}let s=new Qr;s.setAttribute(`position`,new Br(r,3)),s.setAttribute(`color`,new Br(i,3)),s.setAttribute(`matId`,new Br(new Float32Array(r.length/3).fill(5),1)),s.computeVertexNormals();let c=s.attributes.normal;for(let e=0;e<c.count;e++)c.setXYZ(e,0,1,0);return s}function sm(e=3,t=X.grassC,n=.22){let r=K(e),i=new Y;for(let e=0;e<4;e++)i.cone(.035,n*(.7+r()*.6),3,q(t,r,.15),{x:(r()-.5)*.18,z:(r()-.5)*.18,rz:(r()-.5)*.4});return i.build()}function cm(){let e=new Y;return e.box(.07,.8,.07,X.wood),e.box(.6,.32,.04,X.cream,{y:.55,z:.04}),e.box(.5,.06,.01,X.red,{y:.68,z:.065}),e.build()}function lm(e){let t=K(e);return J(new ta(.18+t()*.1,0),q(X.stone,t,.15),{y:.06,sy:.6,ry:t()*3})}function um(){let e=new Y;return e.cyl(.38,.38,.06,12,7232066,{y:.03}),e.cyl(.08,.08,.1,6,4864554,{y:.03}),e.build()}function dm(){let e=new Y;for(let[t,n,r]of[[-.2,-.1,1.3],[.15,-.2,1.15],[.05,.2,1.4],[-.25,.25,1.05]])e.box(.07,r,.07,11118160,{x:t,z:n});return e.box(1,.03,.12,8363068,{y:.95,ry:.4,rz:.25}),e.box(.9,.03,.12,7311156,{y:1.1,ry:-.9,rz:-.25}),e.box(.9,.03,.12,8823876,{y:.8,ry:1.9,rz:.2}),e.build()}function fm(e=2,t=4){let n=K(e),r=new Y;r.cyl(.1,.15,t,5,X.palmTrunk),r.cyl(.09,.1,.6,5,X.palmShaft,{y:t});for(let e=0;e<7;e++){let i=e/7*Math.PI*2;r.add(J(new Xi(1.5,.03,.4),q(X.leaf,n,.1),{x:Math.cos(i)*.65,y:t+.45,z:-Math.sin(i)*.65,ry:i,rz:-.45,order:`YXZ`}))}return r.build()}function pm(e){let t=K(e),n=new Y;for(let e=0;e<3;e++)n.ico(3+t()*2,q(6126149,t,.12),{x:e*3.2-3,y:.5,z:t()*2,sy:1.1+t()*.5},1);return n.build()}function mm(e){let t=K(e),n=new Y;for(let e=0;e<3+Math.floor(t()*2);e++)n.add(J(new ta(.16+t()*.14,0),q(X.stone,t,.2),{x:(t()-.5)*.5,z:(t()-.5)*.5,y:.08,sy:.65,ry:t()*3,m:6}));return n.build()}function hm(e){let t=K(e),n=new Y;for(let e=0;e<5;e++)n.add(J(new _o(.22+t()*.14,0),q(5597230,t,.2),{x:(t()-.5)*.5,z:(t()-.5)*.5,y:.25+t()*.3,sy:.75,m:5}));for(let e=0;e<6;e++)n.add(J(new Qi(.012,.02,.6,4),7033398,{x:(t()-.5)*.6,z:(t()-.5)*.6,y:.3,rx:(t()-.5)*1.2,rz:(t()-.5)*1.2,m:1}));return n.build()}function gm(e){let t=K(e),n=new Y;n.add(J(new Qi(.22,.3,.32,9),q(7230008,t,.15),{y:.16,m:6})),n.add(J(new Qi(.2,.2,.02,9),13215864,{y:.33}));for(let e=0;e<3;e++){let e=t()*6.28;n.add(J(new Qi(.04,.07,.45,5),6178352,{x:Math.cos(e)*.3,z:Math.sin(e)*.3,y:.05,rz:Math.cos(e)*1.3,rx:-Math.sin(e)*1.3,m:6}))}return n.build()}var _m=(e,t=10,n=8)=>new Co(e,t,n);function vm(e=0){let t=new Y,n=[15261904,9067066,14272424][e%3];if(t.add(J(new Zi(.26,.55,4,10),n,{y:.62,rx:Math.PI/2})),e%3==0)for(let e=0;e<4;e++)t.add(J(_m(.12),3024416,{x:e%2?.2:-.2,y:.7+e%3*.05,z:-.25+e*.16,sx:.5}));t.add(J(new Xi(.26,.26,.34),n,{y:.78,z:-.6})),t.add(J(new Xi(.2,.14,.12),14264474,{y:.7,z:-.8}));for(let e of[-.12,.12])t.add(J(new $i(.03,.14,5),15260864,{x:e,y:.97,z:-.58,rz:e*3}));for(let[e,r]of[[-.16,-.3],[.16,-.3],[-.16,.3],[.16,.3]])t.add(J(new Qi(.05,.045,.42,6),n,{x:e,y:.21,z:r}));return t.add(J(new Qi(.015,.015,.4,4),n,{y:.55,z:.55,rx:.3})),t.build()}function ym(e=0){let t=new Y,n=[15525076,5915700,11569754][e%3];t.add(J(new Zi(.14,.32,4,8),n,{y:.4,rx:Math.PI/2})),t.add(J(new Xi(.13,.15,.22),n,{y:.58,z:-.32,rx:.3}));for(let e of[-.04,.04])t.add(J(new $i(.02,.15,5),9075300,{x:e,y:.72,z:-.28,rx:.6}));t.add(J(new $i(.025,.08,4),14209216,{y:.47,z:-.42,rx:Math.PI}));for(let[e,r]of[[-.08,-.16],[.08,-.16],[-.08,.16],[.08,.16]])t.add(J(new Qi(.025,.022,.28,5),n,{x:e,y:.14,z:r}));return t.build()}function bm(e=0){let t=new Y,n=[14723224,3813420,14260874][e%3];t.add(J(new Zi(.2,.36,4,10),n,{y:.3,rx:Math.PI/2,sy:1})),t.add(J(new Qi(.08,.08,.06,10),new B(n).multiplyScalar(.85).getHex(),{y:.3,z:-.48,rx:Math.PI/2}));for(let e of[-.1,.1])t.add(J(new $i(.05,.08,4),n,{x:e,y:.47,z:-.3,rx:-.4}));for(let[e,r]of[[-.11,-.18],[.11,-.18],[-.11,.18],[.11,.18]])t.add(J(new Qi(.04,.035,.14,5),n,{x:e,y:.07,z:r}));return t.build()}function xm(e,t,n){let r=K(n),i=new Y,a=e/2,o=t/2,s=(e,t)=>i.box(.08,.7,.08,q(X.woodGrey,r,.15),{x:e,z:t,rz:(r()-.5)*.06,m:1});for(let e=-a;e<=a+1e-6;e+=1)s(e,-o),s(e,o);for(let e=-o+1;e<=o-1+1e-6;e+=1)s(-a,e),s(a,e);for(let n of[.25,.5]){i.box(e,.06,.04,q(X.woodGrey,r,.12),{y:n,z:-o,m:1}),i.box(e*.4,.06,.04,q(X.woodGrey,r,.12),{y:n,z:o,x:-e*.3,m:1}),i.box(e*.4,.06,.04,q(X.woodGrey,r,.12),{y:n,z:o,x:e*.3,m:1});for(let e of[-a,a])i.box(.04,.06,t,q(X.woodGrey,r,.12),{x:e,y:n,m:1})}i.box(.9,.18,.3,8024168,{x:a-.7,z:o-.4,m:6}),i.box(.8,.02,.22,6260896,{x:a-.7,z:o-.4,y:.17});for(let[e,t]of[[-a+.2,-o+.2],[-a+1.4,-o+.2],[-a+.2,-o+1.2],[-a+1.4,-o+1.2]])i.box(.07,.95,.07,X.wood,{x:e,z:t,m:1});return i.gable(1.6,1.4,.55,X.thatch,{x:-a+.8,z:-o+.7,y:.95,m:2}),i.build()}function Sm(){let e=K(71),t=new Y;t.box(2.6,.12,1.6,X.stone,{m:6});for(let e=0;e<3;e++)t.cyl(.18,.18,.7,12,7300700,{x:-.25+e*.25,y:.12,m:3});t.box(.9,.08,.5,X.wood,{y:.82,m:1}),t.add(J(new Qi(.04,.04,2.4,6),X.wood,{y:.95,rz:Math.PI/2,ry:.4,m:1})),t.cyl(.35,.3,.3,12,5913120,{x:.95,z:.4,m:1}),t.cyl(.3,.3,.02,12,6961684,{x:.95,z:.4,y:.29});for(let[n,r]of[[-1.2,-.7],[1.2,-.7],[-1.2,.7],[1.2,.7]])t.box(.09,1.6,.09,q(X.wood,e),{x:n,z:r,m:1});t.gable(2.8,1.9,.8,X.thatch,{y:1.6,m:2});for(let e=0;e<6;e++)t.add(J(new Qi(.03,.03,1.1,5),12169306,{x:-.9,z:.45+e%3*.07,y:.15+Math.floor(e/3)*.06,rz:Math.PI/2,m:0}));return t.build()}function Cm(){let e=K(81),t=new Y;t.cyl(.42,.45,.5,14,X.stone,{x:-.4,z:.3,m:6}),t.cyl(.34,.34,.02,14,2771546,{x:-.4,z:.3,y:.46});for(let[e,n]of[[.15,-.55],[.75,-.55],[.15,.05],[.75,.05]])t.add(J(new Qi(.025,.03,3,5),9079428,{x:.45+(e-.45)*.6,z:-.25+(n+.25)*.6,y:1.5,rz:(.45-e)*.18,rx:(n+.25)*.18,m:4}));return t.box(.3,.2,.3,q(X.rust,e),{x:.45,z:-.25,y:2.95,m:3}),t.box(.04,.3,.6,10111546,{x:.45,z:.15,y:2.95,m:3}),t.build()}function wm(){let e=new Y;for(let t=0;t<8;t++)e.add(J(new Xi(.08,.6,.015),14209216,{y:0,rz:t/8*Math.PI*2,x:0,center:!0,m:4}));return e.build()}function Tm(){let e=K(91),t=new Y;t.box(1.8,.45,1.8,q(X.woodGrey,e,.1),{m:1});for(let n=0;n<8;n++)t.box(1.8,.02,.2,q(X.wood,e,.15),{y:.45,z:-.8+n*.23,m:1});for(let[e,n]of[[-.5,-.4],[.2,.3],[-.4,.5]])t.box(.36,.3,.36,10516552,{x:e,z:n,y:.47,m:1});return t.box(.06,1.6,.06,X.wood,{x:.8,z:-.8,m:1}),t.box(.7,.3,.04,X.cream,{x:.8,z:-.78,y:1.25}),t.build()}function Em(e,t){let n=new Y,r=e/2-.1,i=t/2-.1;for(let[e,t]of[[-r,-i],[r,-i],[-r,i],[r,i]])n.box(.05,.35,.05,13215864,{x:e,z:t});for(let t of[-i,i])n.box(e-.2,.012,.012,15918788,{z:t,y:.28});for(let e of[-r,r])n.box(.012,.012,t-.2,15918788,{x:e,y:.28});return n.box(.07,.9,.07,X.wood,{x:r-.2,z:i-.1}),n.box(.7,.36,.04,15983551,{x:r-.2,z:i-.06,y:.55}),n.build()}function Dm(e=1,t=!1){let n=K(e),r=new Y,i=1.5+n()*.5;if(r.cyl(.12,.2,i,t?5:8,q(7231040,n,.12),{m:1}),!t)for(let e=0;e<3;e++){let e=n()*6.28;r.add(J(new Qi(.04,.07,.9,5),7231040,{x:Math.cos(e)*.25,z:Math.sin(e)*.25,y:i-.1,rz:Math.cos(e)*.9,rx:-Math.sin(e)*.9,m:1}))}let a=[5208628,6130236,4616238,6786880],o=t?1:6;for(let e=0;e<o;e++){let o=n()*6.28,s=t?0:.3+n()*.5;r.ico(t?1.05:.55+n()*.3,a[e%4],{x:Math.cos(o)*s,z:Math.sin(o)*s,y:i+.35+n()*.3,sy:.7},0)}return r.build()}function Om(e=3,t=!1){let n=K(e),r=new Y;r.cyl(.14,.22,1.2,t?5:8,6178352,{m:1});let i=t?1:7;for(let e=0;e<i;e++){let i=n()*6.28,a=t?0:.2+n()*.55;r.ico(t?1.15:.6+n()*.25,[3497768,3102244,4024876][e%3],{x:Math.cos(i)*a,z:Math.sin(i)*a,y:1.7+n()*.35,sy:.8},+!t)}return r.build()}function km(e=5,t=!1){let n=K(e),r=new Y;r.cyl(.06,.1,.7,5,10123866,{m:1});let i=t?1:5;for(let e=0;e<i;e++){let i=n()*6.28,a=t?0:.15+n()*.3;r.ico(t?.6:.32+n()*.12,[7312452,8231493,6523452][e%3],{x:Math.cos(i)*a,z:Math.sin(i)*a,y:.85+n()*.2,sy:.8},0)}return r.build()}function Am(e=9){let t=Np(e,3.2);return t.applyMatrix4(new xn().makeRotationZ(.18)),t}function jm(e){let t=new Y,n=e===`coco`?[[.55,3.25,.1],[.75,3.2,-.12],[.62,3.1,.15]]:e===`mango`?[[.5,1.55,.3],[-.45,1.6,.2],[.1,1.45,-.55],[-.2,1.5,.5]]:[[.3,.82,.15],[-.25,.9,.2],[.05,.78,-.32]],r=e===`coco`?8018474:e===`mango`?15245354:14213232;for(let[i,a,o]of n)t.add(J(new Co(e===`coco`?.12:.09,8,6),r,{x:i,y:a,z:o,sy:e===`mango`?1.25:1}));return t.build()}function Mm(e){let t=K(e),n=new Y;for(let e=0;e<3;e++)n.add(J(new ta(.2+t()*.08,0),q(9406330,t,.15),{x:(t()-.5)*.5,z:(t()-.5)*.5,y:0,sy:.45,m:6}));return n.build()}function Nm(){let e=new Y;e.add(J(new Zi(.11,.2,4,8),6967872,{y:.15,rx:Math.PI/2})),e.add(J(new Co(.09,8,6),6178872,{y:.2,z:-.22})),e.add(J(new Qi(.02,.035,.32,5),4864556,{y:.12,z:.3,rx:1.3}));for(let t of[-.05,.05])e.add(J(new Co(.025,5,4),3811872,{x:t,y:.3,z:-.22}));return e.build()}function Pm(){let e=new Y,t=4864560;e.add(J(new Zi(.19,.34,4,10),t,{y:.31,rx:Math.PI/2})),e.box(.06,.16,.55,3023904,{y:.45,z:-.05}),e.add(J(new Qi(.07,.08,.12,8),3812902,{y:.29,z:-.5,rx:Math.PI/2}));for(let t of[-.06,.06])e.add(J(new $i(.015,.09,4),15525072,{x:t,y:.3,z:-.53,rx:-.6}));for(let[n,r]of[[-.1,-.17],[.1,-.17],[-.1,.17],[.1,.17]])e.add(J(new Qi(.035,.03,.16,5),t,{x:n,y:.08,z:r}));return e.build()}function Fm(){let e=new Y;e.add(J(new Co(.17,10,8),4869720,{y:.27,sz:1.25}));for(let t=0;t<10;t++)e.add(J(new Co(.02,4,3),15263984,{x:Math.cos(t)*.15,y:.3+Math.sin(t*2)*.06,z:Math.sin(t)*.18}));e.add(J(new Co(.07,8,6),13162728,{y:.44,z:-.15})),e.add(J(new $i(.025,.06,4),12597547,{y:.52,z:-.15}));for(let t of[-.05,.05])e.add(J(new Qi(.012,.012,.14,4),9071178,{x:t,y:.07}));return e.build()}function Im(e=0){let t=new Y,n=[8014378,3811874,13152394][e%3];t.add(J(new Zi(.24,.65,4,10),n,{y:.95,rx:Math.PI/2})),t.add(J(new Qi(.11,.16,.55,8),n,{y:1.25,z:-.5,rx:-.7})),t.box(.16,.18,.42,n,{y:1.42,z:-.78,rx:.5}),t.box(.05,.4,.4,1972244,{y:1.3,z:-.48,rx:-.7}),t.add(J(new Qi(.02,.05,.5,5),1972244,{y:.85,z:.55,rx:.5}));for(let[e,r]of[[-.14,-.35],[.14,-.35],[-.14,.35],[.14,.35]])t.add(J(new Qi(.05,.045,.72,6),n,{x:e,y:.36,z:r}));return t.build()}function Lm(){let e=new Y;for(let t=0;t<6;t++)e.add(J(new Qi(.09,.09,.8,7),9071173,{x:-.2+t%3*.2,y:.09+Math.floor(t/3)*.16,rz:Math.PI/2,ry:Math.PI/2,m:1}));return e.build()}function Rm(e=1){let t=K(e),n=new Y,r=[7317680,14727258,14256746,10139770,15260085],i=r[e%r.length];n.box(2.4,.18,2,X.stone,{z:-.2,m:6}),n.box(2.2,1.3,1.7,q(i,t,.1),{y:.18,z:-.2,m:1});for(let e=0;e<10;e++)n.box(.03,1.25,.02,q(i,t,.25),{x:-1.05+e*.233,y:.2,z:.66,m:1});n.box(.48,.95,.05,5913124,{x:-.4,y:.18,z:.67}),n.box(.45,.42,.05,2892832,{x:.5,y:.68,z:.67}),n.box(.48,.46,.04,q(15789280,t,.1),{x:.5,y:.66,z:.71}),n.gable(2.7,2.6,.7,q(X.tin,t,.2),{y:1.48,z:-.2,m:4});for(let e=0;e<3;e++)n.box(.5,.02,.3,q(X.rust,t,.2),{x:-.8+e*.7,y:1.72+e%2*.05,z:.2+e%2*.2,rx:.48,m:3});n.box(2.4,.05,.6,q(X.tin,t,.15),{y:1.25,z:.95,rx:.12,m:4});for(let e of[-1.1,1.1])n.box(.07,1.25,.07,X.wood,{x:e,z:1.2,m:1});return n.box(.3,.45,.3,X.woodLite,{x:.8,y:0,z:.95,m:1}),n.build()}function zm(e=1){let t=K(e+40),n=new Y;n.box(2.2,.12,1.8,X.stone,{z:-.2,m:6}),n.box(2,1.15,1.5,q(X.wood,t,.1),{y:.12,z:-.2,m:1});for(let e=0;e<8;e++)n.box(.2,1.1,.03,q(X.woodLite,t,.2),{x:-.88+e*.25,y:.14,z:.56,m:1});n.box(.45,.85,.05,3811870,{x:-.3,y:.12,z:.58}),n.box(.4,.36,.05,2892832,{x:.5,y:.55,z:.58}),n.gable(2.6,2.6,1.05,q(X.thatch,t,.08),{y:1.27,z:-.2,m:2});for(let e of[-1,1])n.box(.08,1.25,.08,X.wood,{x:e,z:1,m:1});return n.build()}function Bm(){let e=K(201),t=new Y;t.box(3.6,.2,2.6,X.stone,{m:6}),t.box(3.4,1.6,2.2,q(14272928,e,.08),{y:.2,z:-.1,m:0}),t.box(3.6,.08,.9,q(X.tin,e,.15),{y:1.55,z:1.25,rx:.15,m:4});for(let e of[-1.6,0,1.6])t.box(.08,1.4,.08,X.wood,{x:e,z:1.6,y:.2,m:1});t.box(1.2,1.1,.05,3811870,{x:-.6,y:.2,z:1}),t.box(.8,.6,.05,2892832,{x:.9,y:.8,z:1}),t.box(2.2,.38,.05,9058858,{y:1.85,z:1.01}),t.box(1.9,.08,.06,15918788,{y:1.98,z:1.04}),t.box(3.6,.1,2.5,q(11884874,e,.1),{y:1.8,z:-.1,m:3});for(let[e,n]of[[1.3,1.25],[1.55,1.15]])t.box(.4,.4,.3,10516552,{x:e,z:n,y:.2,m:1});return t.build()}function Vm(){let e=K(211),t=new Y;t.box(3.6,.2,2.6,X.stone,{m:6}),t.box(3.4,1.5,2,q(15260085,e,.05),{y:.2,z:-.2,m:0}),t.box(3.42,.3,2.02,7311272,{y:.2,z:-.2});for(let e=0;e<3;e++)t.box(.55,.55,.05,2898500,{x:-1.1+e*1.1,y:.75,z:.82});return t.box(.6,1,.05,5913124,{x:1.35,y:.2,z:.82}),t.gable(3.7,2.5,.75,q(11884874,e,.1),{y:1.7,z:-.2,m:3}),t.box(.06,2.6,.06,14209216,{x:-1.5,z:1.1}),t.box(.35,.6,.35,15261904,{x:.3,z:1,m:6}),t.add(J(new Co(.14,8,6),15789284,{x:.3,y:.75,z:1})),t.build()}function Hm(){let e=K(221),t=new Y;return t.box(3.8,.2,3.8,X.stone,{m:6}),t.box(2.6,2,3,q(15788244,e,.05),{y:.2,z:-.2,m:0}),t.gable(3.2,3,1.1,q(11884874,e,.1),{y:2.2,z:-.2,ry:Math.PI/2,m:3}),t.box(1,3.6,1,q(15788244,e,.05),{y:.2,z:1.2,m:0}),t.box(.5,.6,1.02,3813416,{y:3,z:1.2}),t.cone(.75,.9,4,10111546,{y:3.8,z:1.2,ry:Math.PI/4,m:3}),t.box(.06,.5,.06,4864554,{y:4.7,z:1.2}),t.box(.3,.06,.06,4864554,{y:4.95,z:1.2}),t.box(.7,1.3,.05,5913124,{y:.2,z:1.72}),t.add(J(new Qi(.2,.2,.05,12),9071178,{y:2.3,z:1.72,rx:Math.PI/2})),t.build()}function Um(){let e=new Y;e.box(.9,.06,.3,X.woodLite,{y:.38,m:1}),e.box(.9,.3,.05,X.woodLite,{y:.45,z:-.14,m:1});for(let t of[-.38,.38])e.box(.06,.38,.28,3815994,{x:t,m:3});return e.build()}function Wm(){let e=new Y;return e.cyl(.04,.06,2.2,6,3090982,{m:3}),e.box(.22,.28,.22,3090982,{y:2.2,m:3}),e.box(.16,.2,.16,15914122,{y:2.24}),e.build()}function Gm(e=4){let t=K(231),n=new Y;for(let r=0;r<e*4;r++)n.box(.24,.06,2.2,q(X.woodGrey,t,.15),{x:-e/2+.12+r*.25,y:.08,m:1});for(let t of[-1.1,1.1]){n.box(e,.06,.06,X.wood,{y:.6,z:t,m:1});for(let r=-e/2;r<=e/2+1e-6;r+=1)n.box(.07,.6,.07,X.wood,{x:r,z:t,m:1})}return n.build()}function Km(){let e=new Y;return e.box(.04,.12,.05,3811870,{y:-.06}),e.box(.015,.5,.07,13158592,{y:-.55,m:4}),e.build()}var qm={value:0},Jm=`
float fh13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fh13(i), fh13(i + vec3(1,0,0)), f.x), mix(fh13(i + vec3(0,1,0)), fh13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(fh13(i + vec3(0,0,1)), fh13(i + vec3(1,0,1)), f.x), mix(fh13(i + vec3(0,1,1)), fh13(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm3(vec3 p){ return vnoise(p) * 0.55 + vnoise(p * 2.03) * 0.3 + vnoise(p * 4.1) * 0.15; }
`;function Ym(e,{sway:t=0,detail:n=!0}={}){let r={value:t};return e.userData.sway=r,e.onBeforeCompile=e=>{e.uniforms.uTime=qm,e.uniforms.uSway=r,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
        attribute float matId;
        varying float vMat; varying vec3 vWP; varying vec3 vON;
        uniform float uTime; uniform float uSway;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
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
        }`).replace(`#include <project_vertex>`,`#include <project_vertex>
        vec4 wp4 = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wp4 = instanceMatrix * wp4;
        #endif
        vWP = (modelMatrix * wp4).xyz;`),e.fragmentShader=n?e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying float vMat; varying vec3 vWP; varying vec3 vON;
        ${Jm}`).replace(`#include <color_fragment>`,`#include <color_fragment>
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
        }`):e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vMat; varying vec3 vWP; varying vec3 vON;`)},e.customProgramCacheKey=()=>`finca-${t>0?`s`:`n`}-${n?`d`:`f`}`,e}var Xm=new xn,Zm=new Zt,Qm=new R,$m=new R,eh=new jn,th=(e,t,n,r,i,a=i)=>(Zm.setFromEuler(eh.set(0,r,0)),Xm.compose(Qm.set(e,t,n),Zm,$m.set(i,a,i)).clone()),nh=new xn().makeScale(0,0,0),rh=14,ih=46;function ah(e,t,n,r){let i=document.createElement(`canvas`);i.width=e*n,i.height=t*n,r(i.getContext(`2d`),n);let a=new Ki(i);return a.colorSpace=st,a.anisotropy=4,a}function oh(e,t,n,r,i,a,o,s){for(let c=0;c<r;c++)e.fillStyle=i[Math.floor(s()*i.length)],e.beginPath(),e.arc(s()*t,s()*n,a+s()*(o-a),0,6.283),e.fill()}var sh=class{constructor(e){this.w=e,this.s=e.s,this.sim=e.sim,this.views={},this.grass=[],this.chunks=[],this.plantRef=new Map,this.pickMeshes=[],this.wildViews=new Map,this.ext={},this.dirty=!0,this.isSmall=e.isSmall,this.buildDynamic()}near(e,t){let n=t.target,r=t.dist,i=Math.max(e.x0-n.x,0,n.x-e.x1-1),a=Math.max(e.z0-n.z,0,n.z-e.z1-1);return Math.hypot(i,a)<r*.9+18}update(e,t,n){for(let e of[`camino`,`manigua`,`batey`])this.views[e]||(e===`camino`||df(this.s,e)||n&&this.near(of[e].rect,n))&&this.build(e);if(this.views.manigua){this.dirty&&this.refreshPlants(),this.fruitTick=(this.fruitTick||0)-e,this.fruitTick<=0&&(this.fruitTick=1.5,this.refreshFruit());let r=n?.camera.position;if(r)for(let e of this.chunks){let t=Math.hypot(e.x-r.x,e.z-r.z,r.y*.5)>ih;if(e.far!==t){e.far=t;for(let n of e.hi)n.visible=!t;for(let n of e.lo)n.visible=t}}this.water.material.map&&(this.water.material.map.offset.y=-t*.05)}this.updateWild(e,t),this.updateHome(t);for(let[r,i]of Object.entries(Ef))!this.ext[r]&&of[r]&&(df(this.s,r)||n&&this.near(of[r].rect,n))&&(this.ext[r]=i(this.w)||{},this.w.applyGrassCounts()),this.ext[r]?.update?.(e,t,n)}pickExt(e){for(let t of Object.values(this.ext)){let n=t.pick?.(e);if(n)return n}return null}build(e){e===`camino`&&this.buildCamino(),e===`manigua`&&this.buildManigua(),e===`batey`&&this.buildBatey(),this.w.applyGrassCounts()}addGrass(e,t,n,r){let i=this.w,a=K(r);i.grassGeo||(i.grassGeo=om(3,.3));for(let r=e.z0;r<=e.z1;r+=8)for(let o=e.x0;o<=e.x1;o+=8){let s=[];for(let i=r;i<Math.min(e.z1+1,r+8);i++)for(let r=o;r<Math.min(e.x1+1,o+8);r++)if(!n(r,i))for(let e=0;e<t;e++)s.push([r+a(),i+a()]);if(!s.length)continue;for(let e=s.length-1;e>0;e--){let t=Math.floor(a()*(e+1));[s[e],s[t]]=[s[t],s[e]]}let c=new Ni(i.grassGeo,i.matGrass,s.length);s.forEach(([e,t],n)=>c.setMatrixAt(n,th(e,0,t,a()*6,.8+a()*.7))),c.receiveShadow=!0,c.computeBoundingSphere(),i.scene.add(c),this.grass.push({mesh:c,total:s.length})}}groundMesh(e,t,n=.002){let r=e.x1-e.x0+1,i=e.z1-e.z0+1,a=new yo(r,i);a.rotateX(-Math.PI/2),a.translate(e.x0+r/2,n,e.z0+i/2);let o=new V(a,Ym(new Po({map:t,roughness:.95})));return o.receiveShadow=!0,this.w.scene.add(o),o}staticMesh(e){let t=new Y;e.forEach(e=>t.add(e));let n=new V(t.build(),this.w.mat);return n.castShadow=!0,n.receiveShadow=!0,this.w.scene.add(n),n}buildCamino(){let e=K(77),t=ah(8,2,24,(t,n)=>{t.fillStyle=`#b8936a`,t.fillRect(0,0,8*n,2*n),oh(t,8*n,2*n,240,[`#a8835c`,`#c4a072`,`#9c7a54`,`#cfae80`],1,4,e),t.fillStyle=`rgba(110,80,50,.35)`,t.fillRect(0,n*.45,8*n,n*.18),t.fillRect(0,n*1.35,8*n,n*.18)});t.wrapS=t.wrapT=y;let n=(e,n,r,i,a)=>{let o=t.clone();o.needsUpdate=!0,o.wrapS=o.wrapT=y,o.repeat.set(a?i/8:r/8,1),a&&(o.rotation=Math.PI/2);let s=new yo(r,i);s.rotateX(-Math.PI/2),s.translate(e+r/2,.004,n+i/2);let c=new V(s,Ym(new Po({map:o,roughness:1})));c.receiveShadow=!0,this.w.scene.add(c)};n(0,40,88,2,!1),n(15,42,2,38,!0);let r=[];for(let t=0;t<40;t++)r.push(jp(lm(500+t),e()*88,40+e()*2));let i=_f.river[_f.river.length-1][0];r.push(jp(Gm(4),i+1,41)),r.push(jp(cm(),14.5,41.8,Math.PI/4)),r.push(jp(cm(),46.5,39.6,Math.PI/4)),this.views.camino={mesh:this.staticMesh(r)},this.addGrass({x0:0,z0:42,x1:14,z1:42},2,()=>!1,3)}buildManigua(){let e=of.manigua.rect,t=e.x1-e.x0+1,n=e.z1-e.z0+1,r=K(61),i=this.isSmall?8:12,a=ah(t,n,i,a=>{a.fillStyle=`#5f7436`,a.fillRect(0,0,t*i,n*i),oh(a,t*i,n*i,t*n*3,[`#566c30`,`#6a7e3c`,`#4e6229`,`#73843f`,`#7a6a3a`],i*.3,i*1.2,r),a.strokeStyle=`rgba(150,110,70,.55)`,a.lineWidth=i*.7,a.lineCap=`round`;for(let e of[7,19,31]){a.beginPath(),a.moveTo(0,(e+.5)*i);for(let n=0;n<=t;n+=3)a.lineTo(n*i,(e+.5+Math.sin(n*.4)*.8)*i);a.stroke()}a.beginPath(),a.moveTo(2*i,n*i),a.quadraticCurveTo(8*i,28*i,18*i,19.5*i),a.stroke();for(let t of _f.water){let n=t%88-e.x0,r=Math.floor(t/88)-e.z0;a.fillStyle=`#4a5a2a`,a.fillRect((n-.5)*i,(r-.2)*i,i*2,i*1.4)}for(let t of _f.fords){let n=t%88-e.x0,r=Math.floor(t/88)-e.z0;a.fillStyle=`#8f7a5a`,a.fillRect(n*i,r*i,i,i)}for(let t of _f.hills){let n=t%88-e.x0,r=Math.floor(t/88)-e.z0;a.fillStyle=`#4b5f30`,a.fillRect(n*i,r*i,i,i)}}),o=this.groundMesh(e,a),s=new Y;for(let e of _f.water){let t=e%88,n=Math.floor(e/88);s.add(J(new Xi(1.02,.04,1.02),4161423,{x:t+.5,y:0,z:n+.5}))}let c=ah(2,2,32,e=>{e.fillStyle=`#4f8f9c`,e.fillRect(0,0,64,64);for(let t=0;t<40;t++)e.fillStyle=`rgba(220,240,240,${.08+Math.random()*.12})`,e.fillRect(Math.random()*64,Math.random()*64,10+Math.random()*14,2)});c.wrapS=c.wrapT=y;let l=s.build(),u=l.attributes.position,d=new Float32Array(u.count*2);for(let e=0;e<u.count;e++)d[e*2]=u.getX(e)*.5,d[e*2+1]=u.getZ(e)*.5;l.setAttribute(`uv`,new Lr(d,2)),this.water=new V(l,new Po({color:16777215,map:c,roughness:.15,metalness:.1,transparent:!0,opacity:.9})),this.water.receiveShadow=!0,this.w.scene.add(this.water);let f=[];_f.mogotes.forEach(([e,t,n],r)=>f.push(jp(pm(30+r),e,t,r*1.3,-.4,n/3.6)));let p=0;for(let e of _f.fords)f.push(jp(Mm(p++),e%88+.5,Math.floor(e/88)+.5));this.views.manigua={ground:o,mesh:this.staticMesh(f)};let m={arbol:[[Dm(1),Dm(2),Dm(3)],Dm(1,!0)],marabu:[[hm(11),hm(12)],hm(11)],ceiba:[[Pp(21)],Pp(21)],palma:[[this.w.palmGeo||Np(3,3.6)],fm(4,4)],coco:[[Am(9)],fm(9,3.4)],mango:[[Om(3)],Om(3,!0)],guayaba:[[km(5)],km(5,!0)]},h={arbol:this.w.matFoliage,marabu:this.w.matFoliage,ceiba:this.w.mat,palma:this.w.matFoliage,coco:this.w.matFoliage,mango:this.w.mat,guayaba:this.w.matFoliage},g=new Map;for(let t of _f.plants){let n=`${Math.floor((t.x-e.x0)/rh)},${Math.floor(t.z/rh)}`;g.has(n)||g.set(n,[]),g.get(n).push(t)}let _=K(9);for(let e of g.values()){let t={x:0,z:0,hi:[],lo:[],far:null};for(let n of e)t.x+=n.x,t.z+=n.z;t.x/=e.length,t.z/=e.length;for(let n of Object.keys(m)){let r=e.filter(e=>e.kind===n);if(!r.length)continue;let[i,a]=m[n],o=r.map(e=>th(e.x+.5,0,e.z+.5,_()*6.28,n===`ceiba`?1.15:n===`palma`?.75+_()*.15:.85+_()*.3));i.forEach((e,s)=>{let c=r.map((e,t)=>[e,o[t]]).filter((e,t)=>t%i.length===s);if(!c.length)return;let l=new Ni(e,h[n],c.length),u=new Ni(a,h[n],c.length);u.instanceMatrix=l.instanceMatrix,c.forEach(([e,t],n)=>{var r;l.setMatrixAt(n,t),this.plantRef.set(e.id,{hm:l,i:n,m:t}),(r=l.userData).ids||(r.ids=[]),l.userData.ids[n]=e.id});for(let e of[l,u])e.castShadow=!0,e.receiveShadow=!0,e.computeBoundingSphere(),this.w.scene.add(e);u.visible=!1,t.hi.push(l),t.lo.push(u),this.pickMeshes.push(l)})}this.chunks.push(t)}this.stumps=new Ni(gm(3),this.w.mat,_f.plants.length),this.stumps.count=0,this.stumps.castShadow=!0,this.w.scene.add(this.stumps),this.fruitMeshes={};for(let e of[`coco`,`mango`,`guayaba`]){let t=_f.plants.filter(t=>t.kind===e).length,n=new Ni(jm(e),this.w.mat,Math.max(1,t));n.count=0,this.w.scene.add(n),this.fruitMeshes[e]=n}this.addGrass(e,this.isSmall?2:3,(e,t)=>_f.water.has(t*88+e)||_f.hills.has(t*88+e),71),this.dirty=!0}refreshPlants(){this.dirty=!1;let e=this.s,t=new Set,n=0;for(let r of _f.plants){let i=this.plantRef.get(r.id);if(!i)continue;let a=!!e.chopped[r.id];i.down!==a&&(i.down=a,i.hm.setMatrixAt(i.i,a?nh:i.m),t.add(i.hm)),a&&this.stumps.setMatrixAt(n++,th(r.x+.5,0,r.z+.5,r.x,r.kind===`marabu`?.6:.9))}for(let e of t)e.instanceMatrix.needsUpdate=!0;this.stumps.count=n,this.stumps.instanceMatrix.needsUpdate=!0,this.refreshFruit()}refreshFruit(){if(!this.fruitMeshes)return;let e=Pf(),t={coco:0,mango:0,guayaba:0};for(let n of _f.plants){if(!mf[n.kind].fruit||!this.sim.fruitReady(n,e))continue;let r=this.plantRef.get(n.id);this.fruitMeshes[n.kind].setMatrixAt(t[n.kind]++,r?r.m:th(n.x+.5,0,n.z+.5,0,1))}for(let[e,n]of Object.entries(this.fruitMeshes))n.count=t[e],n.instanceMatrix.needsUpdate=!0}pickPlant(e){let t=this.pickMeshes.filter(e=>e.visible);if(!t.length)return null;let n=e.intersectObjects(t,!1);for(let e of n){let t=e.object.userData.ids?.[e.instanceId];if(t&&!this.s.chopped[t])return t}return null}buildBatey(){let e=of.batey.rect,t=e.x1-e.x0+1,n=e.z1-e.z0+1,r=K(81),i=this.isSmall?10:16,a=bf.plaza,o=ah(t,n,i,o=>{o.fillStyle=`#7d8f45`,o.fillRect(0,0,t*i,n*i),oh(o,t*i,n*i,t*n*2,[`#74863f`,`#8a9a4c`,`#6a7a3a`],i*.3,i,r),o.fillStyle=`#c2a074`,o.fillRect((a.x-e.x0)*i,(a.z-e.z0)*i,a.w*i,a.h*i),o.fillRect(0,(46-e.z0)*i,t*i,i*1.2),o.fillRect(0,(52-e.z0+.2)*i,t*i,i*.9),o.fillRect((12-e.x0)*i,0,i*1.2,n*i),oh(o,t*i,n*i,t*n,[`rgba(160,120,80,.35)`,`rgba(210,180,140,.3)`],1,i*.3,r),o.strokeStyle=`rgba(120,90,60,.35)`,o.lineWidth=1;for(let t=a.x;t<=a.x+a.w;t++)o.beginPath(),o.moveTo((t-e.x0)*i,(a.z-e.z0)*i),o.lineTo((t-e.x0)*i,(a.z+a.h-e.z0)*i),o.stroke()}),s=this.groundMesh(e,o),c=[];c.push(jp(Pp(31),bf.ceiba.x+1,bf.ceiba.z+1,.7,0,1.2)),bf.benches.forEach(([e,t],n)=>c.push(jp(Um(),e+.5,t+.5,n<2?0:Math.PI))),bf.lamps.forEach(([e,t])=>c.push(jp(Wm(),e+.5,t+.5)));for(let e=0;e<10;e++)c.push(jp(lm(700+e),r()*t,42+r()*n));this.views.batey={ground:s,mesh:this.staticMesh(c)},this.addGrass(e,1,(e,t)=>e>=a.x&&e<a.x+a.w&&t>=a.z&&t<a.z+a.h||e===15||e===16||t===46||e===12,91)}buildDynamic(){let e=this.w;this.wildGeos={jutia:Nm(),jibaro:Pm(),guinea:Fm(),gallina:Zp(2),caballo:Im(0)},this.horse=new V(Im(1),e.mat),this.horse.castShadow=!0,this.horse.position.set(4.3,0,9.6),this.horse.rotation.y=1.2,e.scene.add(this.horse),this.logs=new V(Lm(),e.mat),this.logs.castShadow=!0,this.logs.position.set(8.6,0,6.3),e.scene.add(this.logs),this.carryMesh=new Yn,e.player.root.add(this.carryMesh),this.machete=new V(Km(),e.mat),this.machete.position.set(0,-.42,-.02),e.player.armR.add(this.machete)}updateHome(e){let t=this.s;this.horse.visible=!!t.horse,t.horse&&(this.horse.rotation.x=Math.max(0,Math.sin(e*.9))*.06),this.logs.visible=t.res.madera>0;let n=Math.min(1.6,.6+t.res.madera/120);this.logs.scale.set(n,n,n);let r=this.sim.player;this.machete.visible=df(t,`manigua`)&&r.x>=of.manigua.rect.x0-2,this.w.basket.visible=this.w.basket.visible&&!this.machete.visible;let i=t.carry.length;if(this.carryN!==i||this.carryK!==t.carry.map(e=>e.kind).join()){for(this.carryN=i,this.carryK=t.carry.map(e=>e.kind).join();this.carryMesh.children.length;)this.carryMesh.remove(this.carryMesh.children[0]);t.carry.forEach((e,t)=>{if(e.kind===`caballo`)return;let n=new V(this.wildGeos[e.kind],this.w.mat);n.scale.setScalar(e.kind===`jibaro`?.55:.75),n.position.set((t-(i-1)/2)*.28,.75,-.3),this.carryMesh.add(n)})}if(t.carry.some(e=>e.kind===`caballo`)){this.ledHorse||(this.ledHorse=(()=>{let e=new V(this.wildGeos.caballo,this.w.mat);return e.castShadow=!0,this.w.scene.add(e),e})());let e=this.ledHorse,t=r.x-e.position.x,n=r.z-e.position.z,i=Math.hypot(t,n);i>6?e.position.set(r.x-1,0,r.z+1):i>1.4&&(e.position.x+=t*.05,e.position.z+=n*.05,e.rotation.y=Math.atan2(t,n)+Math.PI),e.visible=!0}else this.ledHorse&&(this.ledHorse.visible=!1)}updateWild(e,t){let n=this.s,r=new Set;for(let e of n.wild){r.add(e.id);let n=this.wildViews.get(e.id);if(!n){let t=new V(this.wildGeos[e.kind],this.w.mat);t.castShadow=!0,t.userData.wild=e.id,this.w.scene.add(t),n={m:t},this.wildViews.set(e.id,n)}let i=this.sim.wildRT.get(e.id);n.m.position.set(e.x,i&&i.moving?Math.abs(Math.sin(t*12+e.id))*.04:0,e.z),i&&(n.m.rotation.y=i.face+Math.PI),n.m.rotation.x=i&&!i.moving?Math.max(0,Math.sin(t*1.5+e.id))*.2:0}for(let[e,t]of this.wildViews)r.has(e)||(this.w.scene.remove(t.m),this.wildViews.delete(e))}pickWild(e){let t=[...this.wildViews.values()].map(e=>e.m);if(!t.length)return null;let n=e.intersectObjects(t,!1);return n.length?n[0].object.userData.wild:null}blobs(e){for(let t of Object.values(this.ext))t.blobs?.(e);for(let t of this.s.wild)e(t.x,t.z,t.kind===`caballo`?.9:.5,t.kind===`caballo`?1.6:.7);this.s.horse&&e(this.horse.position.x,this.horse.position.z,.9,1.6,this.horse.rotation.y)}grassCounts(e){for(let t of this.grass)t.mesh.count=Math.floor(t.total*e);for(let t of Object.values(this.ext))t.grassCounts?.(e)}},ch=(e,t=1)=>`rgb(${Math.min(255,(e>>16&255)*t)|0},${Math.min(255,(e>>8&255)*t)|0},${Math.min(255,(e&255)*t)|0})`;function lh(e,t,n=64){let r=K(77),i=46*n,a=40*n,o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`),c=(n,r)=>Wf(n)?`road`:Kf(e,n,r)?n>=G.x0&&n<=G.x1&&r>=G.z0&&r<=G.z1?`pen`:t.has(`${n},${r}`)?`earth`:n>=4&&n<=8&&r>=4&&r<=8||n>=9&&n<=14&&r>=4&&r<=5?`batey`:`grass`:`wild`,l={road:12886130,wild:6190132,pen:11044698,earth:10373676,batey:12096618,grass:8163138};for(let e=0;e<40;e++)for(let t=0;t<46;t++)s.fillStyle=ch(l[c(t,e)],.94+r()*.12),s.fillRect(t*n-2,e*n-2,n+4,n+4);let u=document.createElement(`canvas`);u.width=i,u.height=a;let d=u.getContext(`2d`);d.filter=`blur(${Math.round(n*.18)}px)`,d.drawImage(o,0,0),d.filter=`none`;for(let e=0;e<1472;e++){let e=r()*i,t=r()*a,o=n*(.3+r()*1.1),s=c(Math.floor(e/n),Math.floor(t/n)),l=d.createRadialGradient(e,t,0,e,t,o),u=s===`grass`||s===`wild`?r()<.5?`rgba(160,150,70,`:`rgba(40,70,20,`:r()<.5?`rgba(120,60,30,`:`rgba(230,200,150,`;l.addColorStop(0,u+(.12+r()*.12)+`)`),l.addColorStop(1,u+`0)`),d.fillStyle=l,d.fillRect(e-o,t-o,o*2,o*2)}for(let e=0;e<40;e++)for(let t=0;t<46;t++){let i=c(t,e),a=t*n,o=e*n;if(i===`grass`||i===`wild`){let e=i===`wild`?70:45;for(let t=0;t<e;t++){let e=a+r()*n,t=o+r()*n,i=n*(.05+r()*.09);d.strokeStyle=r()<.5?`rgba(${60+r()*40},${85+r()*50},${25+r()*20},0.8)`:`rgba(${150+r()*40},${150+r()*30},${70+r()*20},0.55)`,d.lineWidth=Math.max(1,n/48),d.beginPath(),d.moveTo(e,t),d.lineTo(e+(r()-.5)*i*.6,t-i),d.stroke()}}else if(i===`road`||i===`batey`||i===`pen`){for(let e=0;e<26;e++){d.fillStyle=r()<.5?`rgba(90,60,35,0.25)`:`rgba(240,215,170,0.3)`;let e=n*(.02+r()*.04);d.beginPath(),d.ellipse(a+r()*n,o+r()*n,e,e*.7,r()*3,0,7),d.fill()}if(i===`pen`)for(let e=0;e<18;e++){d.strokeStyle=`rgba(225,195,110,0.7)`,d.lineWidth=Math.max(1,n/64);let e=a+r()*n,t=o+r()*n,i=r()*6.28,s=n*.12;d.beginPath(),d.moveTo(e,t),d.lineTo(e+Math.cos(i)*s,t+Math.sin(i)*s),d.stroke()}}else if(i===`earth`)for(let e=0;e<30;e++){d.fillStyle=r()<.5?`rgba(90,30,15,0.35)`:`rgba(200,110,70,0.3)`;let e=n*(.02+r()*.05);d.beginPath(),d.ellipse(a+r()*n,o+r()*n,e,e*.7,0,0,7),d.fill()}}d.filter=`blur(${Math.max(1,Math.round(n*.05))}px)`;for(let e of[Fd.x0+.42,Fd.x0+1.58]){d.strokeStyle=`rgba(110,72,40,0.45)`,d.lineWidth=n*.16,d.beginPath();for(let t=0;t<=a;t+=n/4)d.lineTo(e*n+Math.sin(t*.01)*n*.05,t);d.stroke(),d.strokeStyle=`rgba(80,50,25,0.3)`,d.lineWidth=n*.05,d.stroke()}d.filter=`none`;let f=new Ki(u);return f.colorSpace=st,f.anisotropy=4,f}function uh(e=256){let t=K(5),n=document.createElement(`canvas`);n.width=n.height=e;let r=n.getContext(`2d`);r.fillStyle=`#b8b8b0`,r.fillRect(0,0,e,e);for(let n=0;n<1400;n++){let n=t()*e,i=t()*e,a=3+t()*7,o=140+t()*110;r.strokeStyle=`rgba(${o},${o},${o*.9},0.6)`,r.lineWidth=1,r.beginPath(),r.moveTo(n,i),r.lineTo(n+(t()-.5)*3,i-a),r.stroke()}let i=new Ki(n);return i.wrapS=i.wrapT=y,i.colorSpace=st,i.anisotropy=4,i}function dh(){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(0,0,0,0.75)`),n.addColorStop(.5,`rgba(0,0,0,0.4)`),n.addColorStop(1,`rgba(0,0,0,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new Ki(e)}function fh(){let e=document.createElement(`canvas`);e.width=4,e.height=256;let t=e.getContext(`2d`),n=t.createLinearGradient(0,0,0,256);n.addColorStop(0,`#8fb2c9`),n.addColorStop(.45,`#e9c79a`),n.addColorStop(1,`#e8b47e`),t.fillStyle=n,t.fillRect(0,0,4,256);let r=new Ki(e);return r.colorSpace=st,r}var ph=(e,t)=>[`manigua`,`camino`,`batey`].some(n=>{let r=of[n].rect;return e>=r.x0-.5&&e<=r.x1+1.5&&t>=r.z0-.5&&t<=r.z1+1.5}),mh=[`tomato`,`cane`,`tobacco`],hh=new xn,gh=new Zt,_h=new R,vh=new R,yh=new jn,bh=(e,t,n,r,i,a=0,o=1,s=o,c=o)=>{gh.setFromEuler(yh.set(0,a,0)),hh.compose(_h.set(n,r,i),gh,vh.set(o,s,c)),e.setMatrixAt(t,hh)},xh={alta:{dpr:2,shadow:2048,grass:1,env:!0},media:{dpr:1.5,shadow:1024,grass:.45,env:!0},baja:{dpr:1,shadow:512,grass:.2,env:!1}},Sh=class{constructor(e,t,n=`alta`){this.sim=t,this.s=t.s,this.isSmall=Math.min(o().w,o().h)<600,this.renderer=new cd({canvas:e,antialias:!0,powerPreference:`high-performance`}),this.renderer.outputColorSpace=st,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1,this.scene=new ir,this.scene.background=fh(),this.scene.fog=new rr(15122322,38,95);let r=(e={})=>new Po({vertexColors:!0,roughness:.86,metalness:0,...e});this.mat=Ym(r()),this.matFoliage=Ym(r({side:2,roughness:.75}),{sway:.012}),this.matCrop=Ym(r({roughness:.75}),{sway:.05}),this.matGrass=Ym(r({side:2,roughness:1}),{sway:.35,detail:!1}),this.matDS=r({side:2,roughness:.9}),this.hemi=new is(16770756,5914662,1.15),this.scene.add(this.hemi);let i=new xs(16765600,3);i.position.set(2,14,20),i.target.position.set(11,0,9),i.castShadow=!0,Object.assign(i.shadow.camera,{left:-19,right:19,top:19,bottom:-19,near:1,far:60}),i.shadow.bias=-5e-4,i.shadow.normalBias=.035,i.shadow.radius=4,this.scene.add(i,i.target),this.sun=i;let a=new hc(this.renderer);this.envTex=a.fromScene(new hp,.04).texture,a.dispose(),this.blobTex=dh(),this.buildOutside(),this.staticMesh=null,this.buildStatic(),this.buildDynamic(),this.zones=new sh(this),this.buildSkyFx(),this.setQuality(n)}buildSkyFx(){this.tod=.6,this.lightTarget=this.sun.target.position.clone();let e=Kd.house;this.lantern=new vs(16754768,0,9,1.6),this.lantern.position.set(e.x+1.5,1.35,e.z+e.h+.15),this.scene.add(this.lantern);let t=new ui({color:3811866});this.bulbs=[];let n=new Co(.07,10,8),r=(e,r,i)=>{let a=new V(n,t);a.position.set(e,r,i),this.scene.add(a),this.bulbs.push(a)};r(e.x+1.5,1.32,e.z+e.h+.12);let i=Kd.kitchen;r(i.x+1,1.25,i.z+i.h+.05),this.bulbMat=t;let a=new ui({map:this.blobTex,color:0,transparent:!0,opacity:.16,depthWrite:!1});this.cloudMat=a,this.clouds=[];let o=new yo(1,1);o.rotateX(-Math.PI/2);for(let e=0;e<5;e++){let t=new V(o,a);t.scale.set(9+e*2.5,1,6+e*1.5),t.position.set(-20+e*13,.09,-10+e*37%40),t.renderOrder=2,this.scene.add(t),this.clouds.push(t)}this.cDay={sky:new B(16770756),ground:new B(5914662),fog:new B(15122322)},this.cNight={sky:new B(4874134),ground:new B(1974832),fog:new B(2568266)},this.cSet=new B(16747082),this.cNoon=new B(16765600),this.cMoon=new B(11058431),this.applyTod(.6)}applyTod(e){this.tod=e;let t=Math.PI*2,n=Math.sin((e-.25)*t),r=Xt.smoothstep(n,-.12,.22),i=1-r,a=n<0,o=a?e+.5:e,s=.94*Math.max(.28,Math.abs(Math.sin((o-.25)*t))),c=Xt.degToRad(129)+(o-.6)*t;this.sun.position.set(this.lightTarget.x+Math.cos(c)*Math.cos(s)*20,Math.sin(s)*20,this.lightTarget.z+Math.sin(c)*Math.cos(s)*20);let l=1-Xt.smoothstep(n,.05,.6);a?(this.sun.color.copy(this.cMoon),this.sun.intensity=.55*Xt.smoothstep(-n,0,.25)):(this.sun.color.copy(this.cNoon).lerp(this.cSet,l*.85),this.sun.intensity=3*Xt.smoothstep(n,-.02,.18)),this.hemi.color.copy(this.cDay.sky).lerp(this.cNight.sky,i),this.hemi.groundColor.copy(this.cDay.ground).lerp(this.cNight.ground,i),this.hemi.intensity=.42+.73*r,this.scene.fog.color.copy(this.cDay.fog).lerp(this.cSet,l*r*.35).lerp(this.cNight.fog,i),this.scene.backgroundIntensity=.22+.78*r,this.renderer.toneMappingExposure=1+i*.15,this.lantern.intensity=i*5.5,this.bulbMat.color.setRGB(.23+i*.77,.16+i*.62,.1+i*.25),this.cloudMat.opacity=.16*r,this.nightness=i}updateSky(e,t,n){let r=this.s.tod??.6;n>1?r+=t/240:r>=.3&&r<.6?r=Math.min(.6,r+e/40):(r<.3||r>.6001)&&(r+=e/14),r>=1&&--r,this.s.tod=r,Math.abs(r-this.tod)>1e-5&&this.applyTod(r);for(let t of this.clouds)t.position.x+=e*(n>1?n*.6:1)*.35,t.position.z+=e*(n>1?n*.6:1)*.25,t.position.x>76&&(t.position.x=-30,t.position.z=-12+Math.random()*30),t.position.z>65&&(t.position.z=-20)}setQuality(e){let t=xh[e]||xh.alta;this.quality=e,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.dpr));let n=this.isSmall?Math.min(t.shadow,1024):t.shadow;this.sun.shadow.mapSize.x!==n&&(this.sun.shadow.mapSize.set(n,n),this.sun.shadow.map?.dispose(),this.sun.shadow.map=null),this.scene.environment=t.env?this.envTex:null,this.scene.environmentIntensity=.35,this.grassFactor=t.grass,this.applyGrassCounts(),this.farGrass&&(this.farGrass.count=Math.floor(this.farGrassTotal*t.grass))}buildOutside(){let e=K(99),t=new yo(360,360,120,120);t.rotateX(-Math.PI/2),t.translate(44,-.03,40);let n=t.attributes.position,r=new Float32Array(n.count*3),i=new B,a=new B(6650170),o=new B(9737818),s=new B(12886130),c=new B(10177066);for(let t=0;t<n.count;t++){let l=n.getX(t),u=n.getZ(t),d=Math.sin(l*.21)*Math.cos(u*.17)*.6+Math.sin((l+u)*.09)*.5+Math.sin(l*.53-u*.41)*.2+(e()-.5)*.15;if(i.copy(a).lerp(o,Math.min(1,Math.max(0,d*.5+.5))),Math.hypot(l-23,u-20)>18){let e=Math.sin(l*.23+1)*Math.cos(u*.19);e>.7&&i.lerp(c,Math.min(1,(e-.7)*4)*.85)}if(u<0||u>40){let e=Math.abs(l-16);e<1.6&&i.lerp(s,Math.min(1,(1.6-e)*1.4))}r.set([i.r,i.g,i.b],t*3)}t.setAttribute(`color`,new Lr(r,3));let l=t.attributes.uv;for(let e=0;e<l.count;e++)l.setXY(e,n.getX(e)/3,n.getZ(e)/3);let u=new V(t,Ym(new Po({vertexColors:!0,map:uh(),roughness:1})));u.receiveShadow=!0,this.scene.add(u);let d=dm(),f=[],p=(t,n,r,i)=>{for(let a=n;a<i;a+=1.1)for(let n=t;n<r;n+=1.1)f.push([n+.5+(e()-.5)*.3,a+.5+(e()-.5)*.3])};p(-14,3,-4,15),p(-10,-16,3,-6),p(23,-12,34,-3),p(-14,44,-2,54);let m=new Ni(d,this.matCrop,f.length);f.forEach(([t,n],r)=>bh(m,r,t,0,n,e()*6,.95+e()*.2,.9+e()*.35)),m.receiveShadow=!0,this.scene.add(m);let h=[];for(let t=0;t<70;t++){let t=e()*Math.PI*2,n=28+e()*34,r=23+Math.cos(t)*n,i=20+Math.sin(t)*n;r>14&&r<18||r>-2&&r<47&&i>-2&&i<41||h.push([r,i])}for(let t=0;t<6;t++)h.push([-2-e()*3,e()*40],[47+e()*3,e()*40],[e()*46,-2-e()*3],[e()*46,41+e()*3]);this.outsidePalms=h.filter(([e,t])=>!(e>14.5&&e<17.5)&&!ph(e,t));for(let[e,t,n]of[[-30,-20,1],[-14,-38,2],[6,-42,3],[-42,0,4],[30,-36,5],[72,70,7],[4,78,8],[-40,50,9]]){let r=new V(pm(n),this.mat);r.position.set(e,0,t),r.scale.setScalar(1.6),this.scene.add(r)}let g=[];for(let t=0;t<3400;t++){let t=-10+e()*66,n=-10+e()*60;t>=0&&t<46&&n>=0&&n<40||t>14.8&&t<17.2||ph(t,n)||g.push([t,n])}this.farGrass=new Ni(om(9,.42),this.matGrass,g.length),g.forEach(([t,n],r)=>bh(this.farGrass,r,t,0,n,e()*6,.9+e()*.8)),this.farGrass.receiveShadow=!0,this.farGrassTotal=g.length,this.scene.add(this.farGrass);let _=new Qr,v=new Float32Array(270);for(let t=0;t<90;t++)v.set([e()*22,.3+e()*3,e()*18],t*3);_.setAttribute(`position`,new Lr(v,3)),this.motes=new Ui(_,new Ri({color:16769696,size:.06,transparent:!0,opacity:.7,depthWrite:!1})),this.scene.add(this.motes)}buildStatic(){let e=this.s,t=K(5);this.staticMesh&&(this.scene.remove(this.staticMesh),this.staticMesh.geometry.dispose());let n=[],r=new Set(e.plots.map(e=>`${e.x},${e.z}`));this.groundMesh&&(this.scene.remove(this.groundMesh),this.groundMesh.material.map.dispose());let i=lh(e,r,this.isSmall?22:34),a=new yo(46,40);a.rotateX(-Math.PI/2),a.translate(23,0,20),this.groundMesh=new V(a,Ym(new Po({map:i,roughness:.95}))),this.groundMesh.receiveShadow=!0,this.scene.add(this.groundMesh);for(let e=0;e<40;e++)for(let r=15;r<=16;r++)t()<.12&&n.push(jp(lm(r*3+e),r+t(),e+t()));let o=Kd,s=e=>[e.x+e.w/2,e.z+e.h/2];n.push(jp(Fp(),...s(o.house))),n.push(jp(Ip(),...s(o.coop))),n.push(jp(Lp(),...s(o.kitchen))),n.push(jp(Pp(),...s(o.ceiba))),n.push(jp(Rp(),...s(o.tank))),n.push(jp(Wp(2.6),Yd[0]+.5,Yd[1]+.5)),n.push(jp(Wp(1.2),o.house.x+2.75,o.house.z+2.3,0,.02)),n.push(jp(um(),4.5,8.5,.3,0,1));for(let e=0;e<6;e++)n.push(jp(lm(100+e),4.2+t()*.6+e%2*9.5,12.5+t()*.4));let c=(e,t,r,i,a,o)=>{let s=a===`plank`?Bp(o):Vp(o);e===r?n.push(jp(s,Math.min(e,r)+.5,Math.max(t,i))):n.push(jp(s,Math.max(e,r),Math.min(t,i)+.5,Math.PI/2))};for(let e=G.x0;e<=G.x1;e++)G.gate.some(([t])=>t===e)||c(e,G.z1,e,G.z1+1,`plank`,e),(e<o.coop.x||e>=o.coop.x+o.coop.w)&&c(e,G.z0-1,e,G.z0,`plank`,e+50);for(let e=G.z0;e<=G.z1;e++)c(G.x0-1,e,G.x0,e,`plank`,e+20),c(G.x1,e,G.x1+1,e,`plank`,e+30);n.push(jp(Hp(),G.x1+1,G.z1+1)),n.push(jp(Hp(),G.x0+2,G.z1+1));for(let t=0;t<40;t++)for(let n=0;n<46;n++)if(Kf(e,n,t)&&!Wf(n))for(let[r,i]of[[1,0],[-1,0],[0,1],[0,-1]]){let a=n+r,o=t+i;(a<0||o<0||a>=46||o>=40||!Kf(e,a,o)&&!Wf(a))&&c(n,t,a,o,`wire`,n*13+t*7+r)}let l=this.frontierParcels();for(let t of Ud){let r=e.parcels.includes(t.id);if(r)for(let e of t.decor||[])e.kind===`tobaccoHouse`&&n.push(jp(zp(),e.x+e.w/2,e.z+e.h/2));if(!r&&l.has(t.id)){let[e,r]=this.parcelCenter(t);n.push(jp(cm(),e,r,Math.PI/4))}}this.windmill=null;for(let[t,r]of Object.entries(W)){if(!Bf(e,r))continue;let i=r.x+r.w/2,a=r.z+r.h/2;if(!e.built[t])n.push(jp(Em(r.w,r.h),i,a));else if(Cf[t]){let r=Cf[t](yp,e.built[t]);r&&n.push(jp(r,i,a))}else r.kind===`house`?n.push(jp(e.built[t].tier===2?Rm(r.x):zm(r.x),i,a,r.z>50?Math.PI:0)):t===`bodega`?n.push(jp(Bm(),i,a)):t===`escuela`?n.push(jp(Vm(),i,a)):t===`iglesia`?n.push(jp(Hm(),i,a,Math.PI)):r.kind===`animal`?(n.push(jp(xm(r.w,r.h,300+r.x),i,a)),t===`gallinero2`&&n.push(jp(Ip(),r.x+r.w-.9,r.z+.9,Math.PI))):t===`trapiche`?n.push(jp(Sm(),i,a)):t===`fogon2`?n.push(jp(Lp(),i,a)):t===`casaTabaco`?n.push(jp(zp(),i,a)):t===`anden`?n.push(jp(Tm(),i,a)):t===`pozo`&&(n.push(jp(Cm(),i,a)),this.windmill=[i+.45,2.95,a+.17])}let u=new Y;n.forEach(e=>u.add(e)),this.staticMesh=new V(u.build(),this.mat),this.staticMesh.castShadow=!0,this.staticMesh.receiveShadow=!0,this.scene.add(this.staticMesh),this.palms&&(this.scene.remove(this.palms),this.palms.dispose());let d=[...Jd,...Ud.filter(t=>e.parcels.includes(t.id)).flatMap(e=>e.palms)].map(([e,t])=>[e+.5,t+.5]);this.palmGeo=this.palmGeo||Np(3,3.6),this.palms=new Ni(this.palmGeo,this.matFoliage,d.length);let f=K(17);if(d.forEach(([e,t],n)=>bh(this.palms,n,e,0,t,f()*6.28,.72+f()*.18)),this.palms.castShadow=!0,this.palms.receiveShadow=!0,this.scene.add(this.palms),this.palmSpots=d,this.farPalms||(this.farPalms=new Ni(this.palmGeo,this.matFoliage,this.outsidePalms.length),this.outsidePalms.forEach(([e,t],n)=>bh(this.farPalms,n,e,0,t,f()*6.28,.7+f()*.3)),this.scene.add(this.farPalms)),this.grassChunks)for(let e of this.grassChunks)this.scene.remove(e.mesh),e.mesh.dispose();this.grassChunks=[];let p=K(31),m=new Set;for(let e of Object.values(o))for(let t=e.z;t<e.z+e.h;t++)for(let n=e.x;n<e.x+e.w;n++)m.add(`${n},${t}`);for(let[t,n]of Object.entries(W))if(e.built[t])for(let e=n.z;e<n.z+n.h;e++)for(let t=n.x;t<n.x+n.w;t++)m.add(`${t},${e}`);let h=new Set(e.cleared);for(let t of Wd)e.parcels.includes(t.parcel)&&!h.has(t.id)&&m.add(`${t.x},${t.z}`);this.grassGeo||(this.grassGeo=om(3,.3));for(let t=0;t<40;t+=8)for(let n=0;n<46;n+=8){let i=[];for(let a=t;a<Math.min(40,t+8);a++)for(let t=n;t<Math.min(46,n+8);t++){if(Wf(t)||r.has(`${t},${a}`)||m.has(`${t},${a}`)||t>=G.x0&&t<=G.x1&&a>=G.z0&&a<=G.z1||t>=4&&t<=8&&a>=4&&a<=8)continue;let n=Kf(e,t,a),o=n?3:6;for(let e=0;e<o;e++)i.push([t+p(),a+p(),n?.75:1.2])}if(!i.length)continue;for(let e=i.length-1;e>0;e--){let t=Math.floor(p()*(e+1));[i[e],i[t]]=[i[t],i[e]]}let a=new Ni(this.grassGeo,this.matGrass,i.length);i.forEach(([e,t,n],r)=>bh(a,r,e,0,t,p()*6,n*(.7+p()*.6))),a.receiveShadow=!0,a.computeBoundingSphere(),this.scene.add(a),this.grassChunks.push({mesh:a,total:i.length})}this.applyGrassCounts(),this.buildObstacles(),this.buildAnimals(),this.blades&&(this.scene.remove(this.blades),this.blades=null),this.windmill&&(this.blades=new V(wm(),this.mat),this.blades.position.set(...this.windmill),this.blades.rotation.y=-Math.PI/4,this.blades.castShadow=!0,this.scene.add(this.blades)),this.buildPlots(),this.buildBlobs(),this.buildPickers()}frontierParcels(){let e=this.s;return new Set(Ud.filter(t=>!e.parcels.includes(t.id)&&qf(e,t)&&t.level<=e.level+4).map(e=>e.id))}applyGrassCounts(){let e=(this.grassFactor??1)*(this.grassLod??1);for(let t of this.grassChunks||[])t.mesh.count=Math.floor(t.total*e);this.zones?.grassCounts(e)}buildObstacles(){let e=this.s;if(this.obstacleMeshes)for(let e of this.obstacleMeshes)this.scene.remove(e),e.dispose();this.obstacleMeshes=[];let t=new Set(e.cleared),n=Wd.filter(n=>e.parcels.includes(n.parcel)&&!t.has(n.id));this.obstacleGeos||(this.obstacleGeos={rock:mm(5),marabu:hm(6),stump:gm(7)});let r=K(55);for(let e of[`rock`,`marabu`,`stump`]){let t=n.filter(t=>t.kind===e);if(!t.length)continue;let i=new Ni(this.obstacleGeos[e],e===`marabu`?this.matFoliage:this.mat,t.length);t.forEach((e,t)=>bh(i,t,e.x+.5,0,e.z+.5,r()*6.28,.9+r()*.3)),i.castShadow=!0,i.receiveShadow=!0,i.computeBoundingSphere(),this.scene.add(i),this.obstacleMeshes.push(i)}}buildAnimals(){let e=this.s;this.animals||(this.animals=[]);let t=new Set(this.animals.map(e=>e.id));for(let[n,r]of Object.entries(W)){if(r.kind!==`animal`||!e.built[n]||t.has(n))continue;let i=[0,1,2].map(e=>r.animal===`cow`?vm(e):r.animal===`goat`?ym(e):r.animal===`pig`?bm(e):Zp(e));for(let e=0;e<r.n;e++){let t=new V(i[e%3],this.mat);t.castShadow=!0;let a={id:n,st:r,m:t,x:r.x+.8+Math.random()*(r.w-1.6),z:r.z+1.2+Math.random()*(r.h-1.8),tx:0,tz:0,wait:Math.random()*3,face:Math.random()*6,speed:r.animal===`cow`?.35:r.animal===`hen`?.8:.5};a.tx=a.x,a.tz=a.z,this.scene.add(t),this.animals.push(a)}}}updateAnimals(e,t){let n=this.ffSpeed||1;for(let r of this.animals||[]){let i=r.st;r.wait-=e*n,r.wait<=0&&(r.tx=i.x+.6+Math.random()*(i.w-1.2),r.tz=i.z+1.3+Math.random()*(i.h-1.8),r.wait=2+Math.random()*5);let a=r.tx-r.x,o=r.tz-r.z,s=Math.hypot(a,o),c=s>.05;if(c){let t=Math.min(s,e*r.speed*Math.min(n,6));r.x+=a/s*t,r.z+=o/s*t,r.face=Math.atan2(a,o)}r.m.position.set(r.x,c?Math.abs(Math.sin(t*8+r.x))*.02:0,r.z),r.m.rotation.y=r.face+Math.PI,r.m.rotation.x=c?0:Math.max(0,Math.sin(t*1.3+r.z*3))*.25}this.blades&&(this.blades.rotation.z+=e*(1.5+n*.5))}parcelCenter(e){let t=e.rect,n=Math.floor((t.x0+t.x1)/2),r=Math.floor((t.z0+t.z1)/2);return new Set([...e.plots,...e.palms,...(e.decor||[]).flatMap(e=>[[e.x,e.z]])].map(([e,t])=>`${e},${t}`)).has(`${n},${r}`)&&(r=t.z0===0?t.z1:t.z0),[n+.5,r+.5]}buildBlobs(){if(!this.blobs){let e=new yo(1,1);e.rotateX(-Math.PI/2),this.blobs=new Ni(e,new ui({map:this.blobTex,transparent:!0,depthWrite:!1,opacity:.55,color:2759180,polygonOffset:!0,polygonOffsetFactor:-2}),200),this.blobs.renderOrder=1,this.scene.add(this.blobs)}let e=Kd;this.staticBlobs=[[e.house.x+1.5,e.house.z+1.3,3.6,3.2],[e.coop.x+1,e.coop.z+1,2.4,2],[e.kitchen.x+1,e.kitchen.z+1,2.4,2.4],[e.ceiba.x+1,e.ceiba.z+1,2.2,2.2],[e.tank.x+.5,e.tank.z+.5,1.2,1.2],...this.palmSpots.map(([e,t])=>[e,t,.8,.8]),...Object.entries(W).filter(([e,t])=>this.s.built[e]&&t.kind!==`animal`).map(([,e])=>[e.x+e.w/2,e.z+e.h/2,e.w+.4,e.h+.4])]}updateBlobs(){let e=0,t=(t,n,r,i,a=0)=>{e<200&&bh(this.blobs,e++,t,.012,n,a,r,1,i)};for(let[e,n,r,i]of this.staticBlobs)t(e,n,r,i);let n=this.sim;t(n.player.x,n.player.z,.7,.7);for(let e of n.workers)t(e.x,e.z,.7,.7);for(let e of this.s.chickens)t(e.x,e.z,.5,.55);for(let e of this.animals||[])t(e.x,e.z,e.st.animal===`cow`?.9:.6,e.st.animal===`cow`?1.6:.9,e.face);for(let e of this.truckViews.values())e.g.visible&&t(e.g.position.x,e.g.position.z+.2,1.9,4.2);this.zones?.blobs(t),this.blobs.count=e,this.blobs.instanceMatrix.needsUpdate=!0}buildPlots(){let e=qd.length+Ud.reduce((e,t)=>e+t.plots.length,0);if(!this.plotMesh){this.plotMesh=new Ni(rm(),this.mat,e),this.plotMesh.receiveShadow=!0,this.plotMesh.instanceColor=new Ti(new Float32Array(e*3).fill(1),3),this.scene.add(this.plotMesh),this.cropMeshes={};for(let t of mh)this.cropMeshes[t]=[0,1,2].map(n=>{let r=new Ni(n===0?this.sproutGeo||(this.sproutGeo=im(`tomato`,0)):im(t,n),this.matCrop,e);return r.castShadow=n>0,r.receiveShadow=!0,r.count=0,this.scene.add(r),r});this.sparkles=new Ni(am(),new ui({color:16765802,fog:!1}),e),this.sparkles.count=0,this.scene.add(this.sparkles)}this.plotsDirty=!0}updatePlots(e){let t=this.s,n=Pf();this.plotMesh.count=t.plots.length;let r={};for(let e of mh)r[e]=[0,0,0];let i=0,a=new B(.62,.55,.52),o=new B(1,1,1);t.plots.forEach((t,s)=>{if(this.plotsDirty&&bh(this.plotMesh,s,t.x+.5,0,t.z+.5),this.plotMesh.setColorAt(s,t.crop&&t.watered?a:o),!t.crop)return;let c=this.sim.plotProgress(t,n),l=c>=1?2:c<.33?0:1,u=this.cropMeshes[t.crop][l],d=l===1?.75+(c-.33)*.4:1;bh(u,r[t.crop][l]++,t.x+.5,0,t.z+.5,0,1,d),l===2&&bh(this.sparkles,i++,t.x+.5,(t.crop===`cane`?1.7:1.15)+Math.sin(e*3+s)*.08,t.z+.5,e*2+s)}),this.plotsDirty=!1,this.plotMesh.instanceMatrix.needsUpdate=!0,this.plotMesh.instanceColor.needsUpdate=!0;for(let e of mh)for(let t=0;t<3;t++){let n=this.cropMeshes[e][t];n.count=r[e][t],n.instanceMatrix.needsUpdate=!0}this.sparkles.count=i,this.sparkles.instanceMatrix.needsUpdate=!0}buildDynamic(){let e=Kd;this.eggMesh=new Ni($p(),this.mat,16),this.eggMesh.castShadow=!0,this.eggMesh.count=0,this.scene.add(this.eggMesh),this.henGeos=[0,1,2,3].map(e=>Zp(e)),this.henMeshes=new Map,this.rooster=new V(Qp(),this.mat),this.rooster.position.set(G.x1+1,.62,G.z0+.7),this.rooster.rotation.y=.9,this.rooster.castShadow=!0,this.scene.add(this.rooster),this.truckGeos=new Map,this.truckViews=new Map,this.crateGeos=[Jp(0),Jp(1)],this.flagGeoBase=Up(),this.flags=[];let t=(e,t,n,r=1,i=0)=>{let a=new V(this.flagGeoBase.clone(),this.matDS);a.position.set(e,t,n),a.scale.setScalar(r),a.rotation.y=i,a.castShadow=!0,this.scene.add(a),this.flags.push({m:a,base:this.flagGeoBase.attributes.position.array.slice(),ph:Math.random()*6})};t(Yd[0]+.5,2.3,Yd[1]+.5,1,.5),t(e.house.x+2.75,1,e.house.z+2.3,.6,.5),this.player=this.makePerson(X.white,X.hat,1),this.basket=new V(nm(),this.mat),this.basket.position.set(.22,.5,-.12),this.player.root.add(this.basket),this.workerViewMap=new Map,this.smoke=[];let n=new Co(.12,8,6),r=new Fo({color:14209220,transparent:!0,opacity:.5,depthWrite:!1});for(let e=0;e<7;e++){let t=new V(n,r);t.visible=!1,this.scene.add(t),this.smoke.push({m:t,t:e/7})}this.puffs=[];let i=new Co(.15,8,6);for(let e=0;e<18;e++){let e=new V(i,new Fo({color:13610624,transparent:!0,opacity:.6,depthWrite:!1}));e.visible=!1,this.scene.add(e),this.puffs.push({m:e,life:0,vx:0,vy:0,vz:0})}let a=new bo(.36,.46,32);a.rotateX(-Math.PI/2),this.marker=new V(a,new ui({color:16773577,transparent:!0,opacity:0,depthWrite:!1})),this.marker.position.y=.03,this.scene.add(this.marker),this.markerT=0}truckGeo(e,t){let n=`${e}-${t}`;return this.truckGeos.has(n)||this.truckGeos.set(n,qp(e,t)),this.truckGeos.get(n)}truckView(e){let t=this.truckViews.get(e.id);if(!t){let n=new Yn,r=new V(this.truckGeo(e.model,e.color),this.mat);r.castShadow=!0,r.receiveShadow=!0,r.userData.truckId=e.id,n.add(r);let i=[],a=e.model===1?1.3:.85;[[-.3,-.35],[.3,-.35],[-.3,.2],[.3,.2],[0,.7],[-.3,.7]].forEach(([e,t],n)=>{let o=new V(this.crateGeos[n%2],this.mat);o.position.set(e,.46,a+t),o.castShadow=!0,o.visible=!1,r.add(o),i.push(o)}),this.scene.add(n),t={g:n,body:r,crates:i,seen:!0},this.truckViews.set(e.id,t)}return t}makePerson(e,t,n,r){let i=em(e,t,n,r||{}),a=new Yn;a.rotation.order=`YXZ`;let o=new V(i.body,this.mat),s=new V(i.leg,this.mat),c=new V(i.leg,this.mat),l=new V(i.arm,this.mat),u=new V(i.arm,this.mat);s.position.set(-.075,.5,0),c.position.set(.075,.5,0),l.position.set(-.2,.9,0),u.position.set(.2,.9,0);for(let e of[o,s,c,l,u])e.castShadow=!0,a.add(e);return this.scene.add(a),{root:a,legL:s,legR:c,armL:l,armR:u,body:o}}posePerson(e,t,n){e.root.position.set(t.x,0,t.z);let r=t.face+Math.PI-e.root.rotation.y;r=Math.atan2(Math.sin(r),Math.cos(r)),e.root.rotation.y+=r*.25;let i=t.moving?Math.sin(t.walk)*.6:0;e.legL.rotation.x=i,e.legR.rotation.x=-i,e.armL.rotation.x=-i*.8,e.armR.rotation.x=i*.8,e.armL.rotation.z=.08,e.armR.rotation.z=-.08,e.body.position.y=t.moving?Math.abs(Math.sin(t.walk))*.04:Math.sin(n*2)*.008;let a=0;if(t.work>0&&!t.moving){let r=Math.sin(n*9);switch(t.role){case`recolector`:case`cosechador`:case`sembrador`:a=.35,e.armR.rotation.x=-.9+r*.5,e.armL.rotation.x=-.6-r*.4;break;case`regador`:a=.1,e.armR.rotation.x=-1.1+r*.12,e.armR.rotation.z=-.15;break;case`cocinera`:a=.12,e.armR.rotation.x=-.9,e.armR.rotation.z=-.25+Math.sin(n*6)*.35;break;case`camionero`:a=.05,e.armR.rotation.x=e.armL.rotation.x=-1.2+Math.abs(r)*.9,e.body.position.y=Math.abs(r)*.05}}e.crate&&(e.crate.visible=!!t.carry,t.carry&&(e.armL.rotation.x=e.armR.rotation.x=-1.15+i*.08,e.armL.rotation.z=.25,e.armR.rotation.z=-.25,a=Math.min(a,-.06),e.crate.position.y=.78+e.body.position.y)),e.root.rotation.x+=(a-e.root.rotation.x)*.25}syncWorkers(){let e=this.sim.workers,t=new Set(e.map(e=>e.rec.id));for(let[e,n]of this.workerViewMap)t.has(e)||(this.scene.remove(n.root),this.workerViewMap.delete(e));for(let t of e){if(this.workerViewMap.has(t.rec.id))continue;let e=rf(t.role,t.rec.n||0),n=this.makePerson(e.shirt,e.hat,5+kd.indexOf(t.role)+(t.rec.n||0)*7,e),r=new V(tm(t.role),this.mat);r.position.set(0,-.42,-.02),r.castShadow=!0,n.armR.add(r),t.role===`camionero`&&(n.crate=new V(this.crateGeos?this.crateGeos[0]:Jp(0),this.mat),n.crate.scale.setScalar(.62),n.crate.position.set(0,.78,-.3),n.crate.castShadow=!0,n.crate.visible=!1,n.root.add(n.crate),r.visible=!1);for(let e of[n.body,n.legL,n.legR,n.armL,n.armR])e.userData.worker=t.rec.id;n.role=t.role,this.workerViewMap.set(t.rec.id,n),this.puff(t.x,.5,t.z,15909198,6,1.4)}}workerView(e){return this.workerViewMap.get(e)||[...this.workerViewMap.values()].find(t=>t.role===e)}puff(e,t,n,r,i=3,a=1){for(let o=0;o<i;o++){let i=this.puffs.find(e=>e.life<=0);if(!i)return;i.life=.7+Math.random()*.4,i.m.material.color.set(r),i.m.position.set(e+(Math.random()-.5)*.3,t,n+(Math.random()-.5)*.3),i.vx=(Math.random()-.5)*a,i.vy=.6+Math.random()*a,i.vz=(Math.random()-.5)*a,i.m.visible=!0}}showMarker(e,t){this.marker.position.x=e,this.marker.position.z=t,this.markerT=1}updateTrucks(e,t){for(let e of this.truckViews.values())e.seen=!1;let n=[...this.s.trucks.map(e=>[e,!1]),...this.sim.leaving.map(e=>[e,!0])];for(let[r,i]of n){let n=this.truckView(r);n.seen=!0,n.g.position.set(Xd.x+(r.lx||0),0,r.z),n.body.position.y=r.moving?Math.sin(t*22+r.id)*.02:0;let a=i?-1:this.s.trucks.indexOf(r);n.body.userData.front=a===0,n.body.userData.dock=a>=0&&this.sim.isParked(a)?a:-1;let o=Object.values(r.loaded||{}).reduce((e,t)=>e+t,0);n.crates.forEach((e,t)=>{e.visible=o>t*2}),r.moving&&Math.random()<e*10&&r.z<30&&this.puff(Xd.x+(Math.random()-.5),.15,r.z+2,13610624,1,.6)}for(let[e,t]of this.truckViews)t.seen||(this.scene.remove(t.g),this.truckViews.delete(e))}update(e,t){qm.value=t;let n=this.s,r=this.sim;this.posePerson(this.player,r.player,t),this.basket.visible=Object.values(n.inv).some(e=>e>0),this.syncWorkers();for(let e of r.workers)this.posePerson(this.workerViewMap.get(e.rec.id),e,t);this.eggMesh.count=Math.min(16,n.eggs.length);for(let e=0;e<this.eggMesh.count;e++){let t=n.eggs[e];bh(this.eggMesh,e,t.x,0,t.z,t.id)}this.eggMesh.instanceMatrix.needsUpdate=!0;let i=new Set;for(let e of n.chickens){i.add(e.id);let n=this.henMeshes.get(e.id);n||(n=new V(this.henGeos[e.id%4],this.mat),n.castShadow=!0,this.scene.add(n),this.henMeshes.set(e.id,n));let a=r.chickRT.get(e.id);n.position.set(e.x,a&&a.moving?Math.abs(Math.sin(t*14+e.id))*.04:0,e.z),a&&(n.rotation.y=a.face+Math.PI),n.rotation.x=a&&!a.moving?Math.max(0,Math.sin(t*3+e.id*1.7))*.5:0}for(let[e,t]of this.henMeshes)i.has(e)||(this.scene.remove(t),this.henMeshes.delete(e));this.rooster.rotation.z=Math.sin(t*.7)>.97?-.3:0,this.updateTrucks(e,t),this.updateAnimals(e,t);for(let e of this.flags){let n=e.m.geometry.attributes.position,r=e.base;for(let i=0;i<n.count;i++){let a=r[i*3];n.array[i*3+2]=r[i*3+2]+Math.sin(t*4+e.ph-a*5)*.07*a,n.array[i*3+1]=r[i*3+1]-a*a*.04}n.needsUpdate=!0}let a=!!n.kitchen.recipe,o=Kd.kitchen;for(let t of this.smoke)t.t+=e*.35,t.t>1&&--t.t,t.m.visible=a,t.m.position.set(o.x+.58+Math.sin(t.t*6)*.1,1.55+t.t*2.2,o.z+.45-t.t*.4),t.m.scale.setScalar(.6+t.t*1.8),t.m.material.opacity=.45*(1-t.t);for(let t of this.puffs)t.life<=0||(t.life-=e,t.m.position.x+=t.vx*e,t.m.position.y+=t.vy*e,t.m.position.z+=t.vz*e,t.vy-=e*1.2,t.m.scale.setScalar(Math.max(.05,t.life*1.4)),t.m.material.opacity=Math.max(0,t.life),t.life<=0&&(t.m.visible=!1));this.motes.position.y=Math.sin(t*.4)*.2,this.markerT>0&&(this.markerT=Math.max(0,this.markerT-e*1.4),this.marker.material.opacity=this.markerT*.9,this.marker.scale.setScalar(1+(1-this.markerT)*.4)),this.updatePlots(t),this.zones?.update(e,t,this.rig),this.updateBlobs()}buildPickers(){this.pickers&&this.pickers.forEach(e=>this.scene.remove(e));let e=new ui({visible:!1}),t=(t,n,r,i,a,o)=>{let s=new V(new Xi(i,o,a),e);return s.position.set(n,o/2,r),s.userData.kind=t,this.scene.add(s),s},n=Kd;this.pickers=[t(`house`,n.house.x+1.5,n.house.z+1.4,2.6,2.4,2.8),t(`coop`,n.coop.x+1,n.coop.z+1,1.8,1.4,1.6),t(`kitchen`,n.kitchen.x+1,n.kitchen.z+1,1.8,1.8,2.2),t(`tank`,n.tank.x+.5,n.tank.z+.5,.8,.8,2)];for(let[e,n]of Object.entries(W))Bf(this.s,n)&&this.pickers.push(t(`struct:${e}`,n.x+n.w/2,n.z+n.h/2,n.w-.2,n.h-.2,this.s.built[e]?1.6:.5))}pick(e){let t=[...this.truckViews.values()].map(e=>e.body),n=[];for(let e of this.workerViewMap.values())n.push(e.body,e.legL,e.legR,e.armL,e.armR);let r=e.intersectObjects([...n,...this.pickers,...t],!1);if(this.zones&&(!r.length||r[0].distance>0)){let t=this.zones.pickWild(e);if(t!=null)return`wild:${t}`}let i=this.zones?.pickExt(e);if(i&&!r.length)return i;if(!r.length){let t=this.zones?.pickPlant(e);return t?`wplant:${t}`:null}let a=r[0].object;return a.userData.worker?`worker:${a.userData.worker}`:a.userData.truckId===void 0?a.userData.kind:a.userData.dock===0||a.userData.front?`truck`:a.userData.dock===1?`truck:1`:`truckq`}resize(e,t){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,(xh[this.quality]||xh.alta).dpr)),this.renderer.setSize(e,t,!1)}render(e,t){if(t){this.rig=t;let n=t.dist;this.scene.fog.near=n+14,this.scene.fog.far=n*1.6+70,e.far=Math.max(220,n*3+60),e.updateProjectionMatrix();let r=Math.round(t.target.x/2)*2,i=Math.round(t.target.z/2)*2,a=Xt.clamp(n*.75,19,48),o=this.sun.shadow.camera;(r!==this.lightTarget.x||i!==this.lightTarget.z||o.right!==a)&&(this.lightTarget.set(r,0,i),this.sun.target.position.copy(this.lightTarget),this.sun.target.updateMatrixWorld(),Object.assign(o,{left:-a,right:a,top:a,bottom:-a,far:60+a}),o.updateProjectionMatrix(),this.applyTod(this.tod));let s=n>52?.35:n>36?.6:1;s!==this.grassLod&&(this.grassLod=s,this.applyGrassCounts())}this.renderer.render(this.scene,e)}},Ch=class{constructor(e){this.camera=new gs(30,e,.5,220),this.yaw=Math.PI/4,this.pitch=Xt.degToRad(52),this.minDist=9,this.maxDist=46,this.dist=26,this.goalDist=26,this.target=new R(10,0,9),this.goal=new R(10,0,9),this.bounds={x0:-1,z0:-1,x1:23,z1:19},this.follow=null,this.manualUntil=0,this.update(1)}setAspect(e){this.camera.aspect=e,this.camera.updateProjectionMatrix()}setBounds(e,t=!1){this.boundsGoal={...e},(t||!this.bounds)&&(this.bounds={...e})}setMaxDist(e,t=!1){this.maxGoal=e,t&&(this.maxDist=e)}fitDist(e,t,n,r){let i=Math.max(n-e,1),a=Math.max(r-t,1),o=(i+a)*Math.SQRT1_2,s=(i+a)*Math.SQRT1_2*Math.sin(this.pitch),c=Xt.degToRad(this.camera.fov),l=2*Math.atan(Math.tan(c/2)*this.camera.aspect);return Math.max(o/2/Math.tan(l/2),s/2/Math.tan(c/2))*1.05}fit(e,t,n,r,i=!1){let a=(e+n)/2,o=(t+r)/2;this.goalDist=Xt.clamp(this.fitDist(e,t,n,r),this.minDist,Math.max(this.maxDist,this.maxGoal||0)),this.goal.set(a,0,o),i&&(this.dist=this.goalDist,this.target.copy(this.goal))}zoomBy(e){this.goalDist=Xt.clamp(this.goalDist*e,this.minDist,this.maxDist)}panBy(e,t){this.goal.x+=e,this.goal.z+=t,this.clampGoal(),this.manualUntil=performance.now()+4e3}clampGoal(){let e=this.bounds;this.goal.x=Xt.clamp(this.goal.x,e.x0,e.x1),this.goal.z=Xt.clamp(this.goal.z,e.z0,e.z1)}recenter(){this.manualUntil=0}update(e){let t=1-Math.exp(-e*2.5);if(this.boundsGoal)for(let e of[`x0`,`z0`,`x1`,`z1`])this.bounds[e]+=(this.boundsGoal[e]-this.bounds[e])*t;this.maxGoal&&(this.maxDist+=(this.maxGoal-this.maxDist)*t),this.follow&&this.follow.moving&&performance.now()>this.manualUntil&&(this.goal.x+=(this.follow.x-this.goal.x)*Math.min(1,e*2.5),this.goal.z+=(this.follow.z-this.goal.z)*Math.min(1,e*2.5),this.clampGoal());let n=1-Math.exp(-e*10);this.target.lerp(this.goal,n),this.dist+=(this.goalDist-this.dist)*n;let r=Math.cos(this.pitch),i=Math.sin(this.pitch),a=this.camera;a.position.set(this.target.x+Math.sin(this.yaw)*r*this.dist,this.target.y+i*this.dist,this.target.z+Math.cos(this.yaw)*r*this.dist),a.lookAt(this.target)}},wh=class{constructor(e,t,{onTap:n,onUse:r}){this.canvas=e,this.rig=t,this.onTap=n,this.onUse=r,this.pointers=new Map,this.ray=new Vs,this.plane=new ni(new R(0,1,0),0),this.keys=new Set,this.moved=!1,this.lastPinch=0,this.lastMid=null,this.joy={x:0,z:0},e.addEventListener(`pointerdown`,e=>this.down(e)),document.addEventListener(`pointerdown`,t=>{t.target!==e&&t.target.closest?.(`#labels .wlabel`)&&this.down(t,!0)}),window.addEventListener(`click`,e=>{performance.now()<this.noClickUntil&&e.target.closest?.(`#labels`)&&(e.stopPropagation(),e.preventDefault())},!0),this.noClickUntil=0,window.addEventListener(`pointermove`,e=>this.move(e)),window.addEventListener(`pointerup`,e=>this.up(e)),window.addEventListener(`pointercancel`,e=>this.up(e,!0)),e.addEventListener(`wheel`,e=>this.wheel(e),{passive:!1}),document.addEventListener(`wheel`,e=>{e.target.closest?.(`#labels`)&&this.wheel(e)},{passive:!1}),e.addEventListener(`gesturestart`,e=>e.preventDefault()),e.addEventListener(`gesturechange`,e=>{e.preventDefault(),e.scale&&this.rig.zoomBy(1/e.scale**.15)}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),window.addEventListener(`keydown`,e=>this.keydown(e)),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>this.keys.clear())}ndc(e,t){let n=this.canvas.getBoundingClientRect();return new L((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1)}ground(e,t){this.ray.setFromCamera(this.ndc(e,t),this.rig.camera);let n=new R;return this.ray.ray.intersectPlane(this.plane,n)?n:null}down(e,t=!1){t||this.canvas.setPointerCapture?.(e.pointerId),this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now(),label:t}),this.pointers.size===1&&(this.moved=!1),this.pointers.size===2&&(this.moved=!0,this.lastPinch=this.pinchDist(),this.lastMid=this.mid())}pinchDist(){let[e,t]=[...this.pointers.values()];return Math.hypot(e.x-t.x,e.y-t.y)}mid(){let[e,t]=[...this.pointers.values()];return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}move(e){let t=this.pointers.get(e.pointerId);if(!t)return;let n=t.x,r=t.y;if(t.x=e.clientX,t.y=e.clientY,this.pointers.size===1)!this.moved&&Math.hypot(t.x-t.sx,t.y-t.sy)>9&&(this.moved=!0),this.moved&&this.panScreen(n,r,t.x,t.y);else if(this.pointers.size===2){let e=this.pinchDist();this.lastPinch>0&&e>0&&this.rig.zoomBy(this.lastPinch/e),this.lastPinch=e;let t=this.mid();this.lastMid&&this.panScreen(this.lastMid.x,this.lastMid.y,t.x,t.y),this.lastMid=t}}panScreen(e,t,n,r){let i=this.ground(e,t),a=this.ground(n,r);i&&a&&this.rig.panBy(i.x-a.x,i.z-a.z)}up(e,t){let n=this.pointers.get(e.pointerId);n&&(this.pointers.delete(e.pointerId),this.pointers.size<2&&(this.lastPinch=0,this.lastMid=null),this.moved&&(this.noClickUntil=performance.now()+350),!t&&!n.label&&!this.moved&&this.pointers.size===0&&performance.now()-n.t<600&&this.onTap(e.clientX,e.clientY),this.pointers.size===0&&(this.moved=!1))}wheel(e){e.preventDefault();let t=e.deltaMode===1?e.deltaY*16:e.deltaY,n=e.ctrlKey?.01:.0015;this.rig.zoomBy(Math.exp(t*n))}keydown(e){(!e.target||e.target.tagName!==`INPUT`&&e.target.tagName!==`TEXTAREA`)&&(this.keys.add(e.code),e.code!==`KeyE`&&e.code!==`Space`&&e.code!==`Enter`||e.repeat||(e.code===`Space`&&e.preventDefault(),this.onUse()),(e.code===`Equal`||e.code===`NumpadAdd`)&&this.rig.zoomBy(.85),(e.code===`Minus`||e.code===`NumpadSubtract`)&&this.rig.zoomBy(1.18))}moveDir(){let e=0,t=0,n=this.keys;(n.has(`KeyW`)||n.has(`ArrowUp`))&&(t+=1),(n.has(`KeyS`)||n.has(`ArrowDown`))&&--t,(n.has(`KeyA`)||n.has(`ArrowLeft`))&&--e,(n.has(`KeyD`)||n.has(`ArrowRight`))&&(e+=1),e+=this.joy.x,t+=this.joy.z;let r=Math.hypot(e,t);if(r<.15)return null;let i=Math.min(1,r);e/=r,t/=r;let a=this.rig.yaw,o=-Math.sin(a)*t+Math.cos(a)*e,s=-Math.cos(a)*t-Math.sin(a)*e;return{x:o*i,z:s*i}}};function Th(e){"@babel/helpers - typeof";return Th=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Th(e)}function Eh(e,t){if(Th(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Th(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Dh(e){var t=Eh(e,`string`);return Th(t)==`symbol`?t:t+``}function Oh(e,t,n){return(t=Dh(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var kh=class{constructor(){Oh(this,`schedule`,()=>{if(!this.ctx)return;if(!this.musicOn&&this.musicBus.gain.value<.01){this.timer=null;return}let e=[[196,247,294],[262,330,392],[294,370,440],[196,247,294],[262,330,392],[196,247,294],[294,370,440],[196,247,294]],t=[[4,2,1,2,4,5],[6,5,4,2,4,2],[5,4,2,1,2,4],[2,1,0,-1,0,2],[4,5,6,5,4,2],[4,2,1,0,1,2],[1,2,4,2,1,0],[0,-1,0,-1,0,-1]],n=[392,440,494,523,587,659,740,784];for(;this.nextTime<this.ctx.currentTime+.25;){let r=this.step%48,i=Math.floor(r/6),a=r%6,o=e[i],s=this.nextTime-this.ctx.currentTime,c=this.musicBus;a===0&&this.tone(o[0]/2,.5,`triangle`,.09,s,c),a===3&&this.tone(o[2]/2,.4,`triangle`,.07,s,c),(a===2||a===5)&&o.forEach((e,t)=>this.tone(e,.22,`triangle`,.018,s+t*.012,c));let l=t[i][a];if(l>=0&&!(i===7&&a>0)){let e=n[l];this.tone(e,.18,`square`,.012,s,c),this.tone(e*2,.12,`triangle`,.02,s,c),this.tone(e*1.003,.16,`triangle`,.016,s+.008,c)}a%3==0&&this.noiseHit(.12,3500,.025,s,c,4),a%3==2&&this.noiseHit(.05,4200,.02,s,c,4),(i%2==0&&(a===0||a===4)||i%2==1&&a===2)&&this.tone(1800,.04,`sine`,.025,s,c),this.nextTime+=.26785714285714285,this.step++}this.timer=setTimeout(this.schedule,90)}),this.ctx=null,this.sfxOn=!0,this.musicOn=!0,this.nextTime=0,this.step=0,this.timer=null}unlock(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e({latencyHint:`interactive`}),this.master=this.ctx.createGain(),this.master.gain.value=.9,this.master.connect(this.ctx.destination),this.sfxBus=this.ctx.createGain(),this.sfxBus.gain.value=.8,this.sfxBus.connect(this.master),this.musicBus=this.ctx.createGain(),this.musicBus.gain.value=0,this.musicBus.connect(this.master);let t=this.ctx.sampleRate*.5;this.noise=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noise.getChannelData(0);for(let e=0;e<t;e++)n[e]=Math.random()*2-1}this.ctx.state===`suspended`&&this.ctx.resume(),this.setMusic(this.musicOn)}tone(e,t,n=`triangle`,r=.08,i=0,a=this.sfxBus,o=0){if(!this.ctx)return;let s=this.ctx.currentTime+i,c=this.ctx.createOscillator(),l=this.ctx.createGain();c.type=n,c.frequency.setValueAtTime(e,s),o&&c.frequency.exponentialRampToValueAtTime(e*o,s+t),l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(r,s+.01),l.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(l),l.connect(a),c.start(s),c.stop(s+t+.02)}noiseHit(e,t,n,r=0,i=this.sfxBus,a=1.2){if(!this.ctx)return;let o=this.ctx.currentTime+r,s=this.ctx.createBufferSource();s.buffer=this.noise;let c=this.ctx.createBiquadFilter();c.type=`bandpass`,c.frequency.value=t,c.Q.value=a;let l=this.ctx.createGain();l.gain.setValueAtTime(n,o),l.gain.exponentialRampToValueAtTime(1e-4,o+e),s.connect(c),c.connect(l),l.connect(i),s.start(o,Math.random()*.3),s.stop(o+e+.02)}play(e){if(!this.ctx||!this.sfxOn)return;let t=(...e)=>this.tone(...e);switch(e){case`egg`:t(660,.08,`triangle`,.08),t(990,.1,`triangle`,.06,.06);break;case`plant`:this.noiseHit(.12,600,.15),t(330,.1,`sine`,.06,.04);break;case`harvest`:t(520,.08,`triangle`,.08),t(780,.12,`triangle`,.07,.07),this.noiseHit(.08,2e3,.06);break;case`water`:for(let e=0;e<4;e++)this.noiseHit(.09,3e3+e*300,.05,e*.05,this.sfxBus,3);break;case`coins`:t(1046,.08,`square`,.03),t(1318,.12,`square`,.03,.07),t(1568,.16,`triangle`,.05,.14);break;case`load`:t(220,.1,`triangle`,.08),this.noiseHit(.1,400,.12);break;case`horn`:t(370,.32,`sawtooth`,.04),t(466,.32,`sawtooth`,.03),t(370,.25,`sawtooth`,.04,.38),t(466,.25,`sawtooth`,.03,.38);break;case`buy`:t(523,.1,`triangle`,.07),t(659,.12,`triangle`,.07,.08);break;case`level`:[523,659,784,1046].forEach((e,n)=>t(e,.2,`triangle`,.07,n*.1));break;case`cluck`:t(700,.06,`square`,.025,0,this.sfxBus,.7),t(620,.08,`square`,.02,.09,this.sfxBus,.7);break;case`tap`:t(880,.04,`sine`,.03);break;case`error`:t(180,.15,`square`,.03);break;case`cook`:this.noiseHit(.4,900,.06),t(392,.15,`triangle`,.05)}}setSfx(e){this.sfxOn=e}setMusic(e){if(this.musicOn=e,!this.ctx)return;let t=this.ctx.currentTime;this.musicBus.gain.cancelScheduledValues(t),this.musicBus.gain.setTargetAtTime(e?.55:0,t,.4),e&&!this.timer&&(this.nextTime=this.ctx.currentTime+.1,this.schedule())}},Z=(e,t=`0 0 32 32`)=>`<svg viewBox="${t}" aria-hidden="true" class="ico">${e}</svg>`,Q={egg:Z(`<ellipse cx="16" cy="17.5" rx="9" ry="11.5" fill="#f6ecd6" stroke="#8a6a3a" stroke-width="2"/><ellipse cx="13" cy="13" rx="2.5" ry="3.5" fill="#fff" opacity=".7"/>`),tomato:Z(`<circle cx="16" cy="18" r="10.5" fill="#d2402c" stroke="#7a2416" stroke-width="2"/><path d="M10 9l6 3 6-3-3 5h-6z" fill="#4f7a34"/><ellipse cx="12" cy="15" rx="2.5" ry="3" fill="#fff" opacity=".35"/>`),cane:Z(`<rect x="9" y="3" width="4.5" height="26" rx="2" fill="#b9b05a" stroke="#6d6a2a" stroke-width="1.5"/><rect x="18" y="5" width="4.5" height="24" rx="2" fill="#a4a24a" stroke="#6d6a2a" stroke-width="1.5"/><path d="M9 11h4.5M9 19h4.5M18 13h4.5M18 21h4.5" stroke="#6d6a2a" stroke-width="1.5"/><path d="M13 7q8-6 14-2" stroke="#5b8a34" stroke-width="2.5" fill="none"/>`),tobacco:Z(`<path d="M16 3C7 9 6 20 16 29 26 20 25 9 16 3z" fill="#9a6a2e" stroke="#5a3a16" stroke-width="2"/><path d="M16 6v21M16 13l-5-3M16 13l5-3M16 20l-6-3M16 20l6-3" stroke="#5a3a16" stroke-width="1.5" fill="none"/>`),ketchup:Z(`<path d="M12 4h8v4l3 5v14a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V13l3-5z" fill="#c0392b" stroke="#6e1e14" stroke-width="2"/><rect x="11" y="15" width="10" height="7" rx="1" fill="#f3e6c8"/><rect x="12" y="2" width="8" height="3" rx="1" fill="#e8d9b5"/>`),guarapo:Z(`<path d="M8 7h16l-2 21H10z" fill="#d6c56a" stroke="#6d6a2a" stroke-width="2"/><path d="M9 11h14" stroke="#fff" stroke-width="1.5" opacity=".6"/><path d="M20 3l-3 10" stroke="#5b8a34" stroke-width="2.5"/>`),coin:Z(`<circle cx="16" cy="16" r="12" fill="#f2c14e" stroke="#8a5a14" stroke-width="2.5"/><circle cx="16" cy="16" r="8" fill="none" stroke="#c48a22" stroke-width="1.5"/><text x="16" y="21" text-anchor="middle" font-size="13" font-weight="800" fill="#8a5a14" font-family="sans-serif">$</text>`),seed:Z(`<path d="M16 28c0-8 0-12 0-14" stroke="#5b8a34" stroke-width="2.5"/><path d="M16 16c-7 0-10-4-10-9 6 0 10 3 10 9zM16 13c0-5 4-8 10-8 0 6-4 8-10 8z" fill="#7aa648" stroke="#3c6128" stroke-width="1.5"/>`),basket:Z(`<path d="M4 13h24l-3 14H7z" fill="#c69a5a" stroke="#6b4a24" stroke-width="2"/><path d="M9 13q7-11 14 0" stroke="#6b4a24" stroke-width="2.5" fill="none"/><path d="M8 18h16M9 22h14" stroke="#6b4a24" stroke-width="1.5"/>`),shop:Z(`<path d="M4 12l3-7h18l3 7z" fill="#c0392b" stroke="#6e1e14" stroke-width="2"/><path d="M6 12v15h20V12" fill="#f3e6c8" stroke="#6b4a24" stroke-width="2"/><rect x="13" y="17" width="6" height="10" fill="#8b6a45"/><path d="M4 12q3 4 6 0 3 4 6 0 3 4 6 0 3 4 6 0" fill="#e8d9b5" stroke="#6e1e14" stroke-width="1.5"/>`),land:Z(`<path d="M3 20l13-7 13 7-13 7z" fill="#a8502e" stroke="#6e3220" stroke-width="2"/><path d="M8 20l8-4M12 22l8-4M16 24l8-4" stroke="#6e3220" stroke-width="1.5"/><path d="M22 4v11" stroke="#6b4a24" stroke-width="2"/><rect x="18" y="5" width="10" height="5" fill="#f3e6c8" stroke="#6b4a24" stroke-width="1.5"/>`),gear:Z(`<path d="M16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`),full:Z(`<path d="M5 12V5h7M27 12V5h-7M5 20v7h7M27 20v7h-7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>`),center:Z(`<circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5" stroke="currentColor" stroke-width="2.5"/>`),truck:Z(`<rect x="2" y="10" width="17" height="11" rx="1" fill="#8fb3a3" stroke="#3a4a44" stroke-width="2"/><path d="M19 13h6l4 5v3H19z" fill="#8fb3a3" stroke="#3a4a44" stroke-width="2"/><circle cx="8" cy="23" r="3" fill="#2b2622"/><circle cx="23" cy="23" r="3" fill="#2b2622"/>`),hen:Z(`<ellipse cx="15" cy="19" rx="10" ry="8" fill="#b7743a" stroke="#5a3424" stroke-width="2"/><circle cx="22" cy="10" r="5" fill="#b7743a" stroke="#5a3424" stroke-width="2"/><path d="M21 4l2 2 2-2" fill="#c0392b" stroke="#c0392b" stroke-width="2"/><path d="M27 10l3 1-3 1z" fill="#e0a030"/>`),worker:Z(`<circle cx="16" cy="11" r="5" fill="#b07850"/><ellipse cx="16" cy="7" rx="10" ry="2.5" fill="#d8bf83" stroke="#6b4a24" stroke-width="1.5"/><path d="M9 29v-8a7 7 0 0 1 14 0v8z" fill="#f0e8d8" stroke="#6b4a24" stroke-width="1.5"/>`),up:Z(`<path d="M16 4l10 12h-6v12h-8V16H6z" fill="#6f9a3a" stroke="#3c6128" stroke-width="2"/>`),xp:Z(`<path d="M16 3l3.8 8 8.7 1-6.4 6 1.7 8.6L16 22.4 8.2 26.6 9.9 18 3.5 12l8.7-1z" fill="#f2c14e" stroke="#8a5a14" stroke-width="2"/>`),water:Z(`<path d="M16 3C11 11 8 15 8 20a8 8 0 0 0 16 0c0-5-3-9-8-17z" fill="#6fa8d8" stroke="#2c5a86" stroke-width="2"/>`),close:Z(`<path d="M8 8l16 16M24 8L8 24" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>`),music:Z(`<path d="M12 24V7l14-3v17" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="9" cy="24" r="3.5" fill="currentColor"/><circle cx="23" cy="21" r="3.5" fill="currentColor"/>`),sound:Z(`<path d="M5 12h5l7-6v20l-7-6H5z" fill="currentColor"/><path d="M21 11q4 5 0 10M24 8q7 8 0 16" stroke="currentColor" stroke-width="2.5" fill="none"/>`),flag:Z(`<rect width="32" height="16" fill="#1d3f86"/><rect y="3.2" width="32" height="3.2" fill="#f3ecdc"/><rect y="9.6" width="32" height="3.2" fill="#f3ecdc"/><path d="M0 0 L13.86 8 L0 16 Z" fill="#c0392b"/><polygon points="4.80,5.50 6.27,10.02 2.42,7.23 7.18,7.23 3.33,10.02" fill="#f3ecdc"/>`,`0 0 32 16`),leche:Z(`<path d="M11 3h10v4l3 4v16a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V11l3-4z" fill="#eef0ec" stroke="#5a6a70" stroke-width="2"/><rect x="8" y="15" width="16" height="6" fill="#6f8fa8"/><rect x="11" y="2" width="10" height="3" rx="1" fill="#8a9aa0"/>`),queso:Z(`<path d="M3 21l20-11 6 4v9H3z" fill="#f2d27a" stroke="#8a6a24" stroke-width="2"/><path d="M3 21h26" stroke="#8a6a24" stroke-width="2"/><circle cx="12" cy="24" r="1.8" fill="#d9b04a"/><circle cx="21" cy="19" r="1.5" fill="#d9b04a"/><circle cx="24" cy="25" r="1.3" fill="#d9b04a"/>`),carne:Z(`<path d="M6 12c3-7 15-8 20-2 4 5 1 13-7 14-5 1-6 4-9 5-3 1-5-2-3-5 1-2-4-6-1-12z" fill="#c8615a" stroke="#6e2a20" stroke-width="2"/><path d="M12 14c3-2 8-2 10 1" stroke="#f3d6c8" stroke-width="2.5" fill="none"/><circle cx="7" cy="27" r="2.5" fill="#f3ead8" stroke="#8a7a64" stroke-width="1.5"/>`),melao:Z(`<path d="M13 3h6v5l4 4v15a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V12l4-4z" fill="#8a4a1a" stroke="#4a2408" stroke-width="2"/><rect x="11" y="15" width="10" height="7" rx="1" fill="#f3e6c8"/><rect x="13" y="1.5" width="6" height="3" rx="1" fill="#6b4a2a"/>`),azucar:Z(`<path d="M7 9q9-6 18 0l2 18H5z" fill="#efe6d2" stroke="#7a6a50" stroke-width="2"/><path d="M9 9q7 4 14 0" stroke="#7a6a50" stroke-width="2" fill="none"/><text x="16" y="23" text-anchor="middle" font-size="7" font-weight="700" fill="#7a6a50">AZÚCAR</text>`),puros:Z(`<rect x="3" y="12" width="26" height="14" rx="1.5" fill="#b0743a" stroke="#5a3414" stroke-width="2"/><rect x="5" y="14" width="22" height="5" fill="#f3e6c8"/><path d="M7 7h18" stroke="#6b4a24" stroke-width="3.5" stroke-linecap="round"/><path d="M22 7h3" stroke="#c0392b" stroke-width="3.5"/>`),ff:Z(`<path d="M3 7l12 9-12 9zM16 7l12 9-12 9z" fill="currentColor"/>`),play:Z(`<path d="M9 6l17 10-17 10z" fill="currentColor"/>`),clock:Z(`<circle cx="16" cy="16" r="12" fill="#f6ecd6" stroke="#6b4a24" stroke-width="2.5"/><path d="M16 9v7l5 3" stroke="#6b4a24" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),moon:Z(`<path d="M20 4a12 12 0 1 0 8 19A10 10 0 0 1 20 4z" fill="#e8e2c8" stroke="#6b6a5a" stroke-width="1.5"/>`),sun:Z(`<circle cx="16" cy="16" r="7" fill="#f2c14e" stroke="#8a5a14" stroke-width="2"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3 3M23 23l3 3M6 26l3-3M23 9l3-3" stroke="#d99a2a" stroke-width="2.5" stroke-linecap="round"/>`),fire:Z(`<path d="M16 3c2 6 9 9 9 17a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 2 4 3 4 0-4 0-7 2-10z" fill="#e0703a" stroke="#8a3214" stroke-width="2"/>`),wood:Z(`<rect x="3" y="17" width="22" height="8" rx="4" fill="#9a6a3a" stroke="#4a2e14" stroke-width="2"/><rect x="7" y="9" width="22" height="8" rx="4" fill="#b07a44" stroke="#4a2e14" stroke-width="2"/><circle cx="25" cy="13" r="2.5" fill="#e0b880" stroke="#4a2e14" stroke-width="1.5"/><circle cx="7" cy="21" r="2.5" fill="#e0b880" stroke="#4a2e14" stroke-width="1.5"/>`),mango:Z(`<path d="M9 13c3-8 15-8 18 1 2 8-4 15-12 15-6 0-9-8-6-16z" fill="#f0a030" stroke="#8a4a14" stroke-width="2"/><path d="M12 14c2-4 7-5 10-3" stroke="#e05030" stroke-width="3" fill="none" opacity=".7"/><path d="M17 6q4-4 8-2-3 4-8 2z" fill="#5b8a34" stroke="#3c6128" stroke-width="1.5"/>`),guayaba:Z(`<circle cx="16" cy="18" r="10" fill="#a8c860" stroke="#4e6a24" stroke-width="2"/><circle cx="16" cy="18" r="5.5" fill="#f08a8a" opacity=".85"/><path d="M15 8l1-4 3 3" stroke="#5a3a16" stroke-width="2" fill="none"/>`),coco:Z(`<circle cx="16" cy="17" r="11" fill="#7a5230" stroke="#3a2410" stroke-width="2"/><circle cx="12" cy="13" r="1.8" fill="#3a2410"/><circle cx="17" cy="11" r="1.8" fill="#3a2410"/><circle cx="15" cy="16" r="1.8" fill="#3a2410"/><path d="M8 22q8 4 16 0" stroke="#a87a50" stroke-width="2" fill="none"/>`),jutia:Z(`<ellipse cx="15" cy="19" rx="11" ry="7" fill="#7a5a3e" stroke="#3a2618" stroke-width="2"/><circle cx="25" cy="15" r="4.5" fill="#86664a" stroke="#3a2618" stroke-width="2"/><circle cx="26.5" cy="14" r="1" fill="#1a120c"/><path d="M4 20q-3 3 0 6" stroke="#3a2618" stroke-width="2.5" fill="none"/><path d="M10 26v3M19 26v3" stroke="#3a2618" stroke-width="2.5"/>`),jibaro:Z(`<ellipse cx="15" cy="18" rx="11" ry="7.5" fill="#4a3a30" stroke="#1e1610" stroke-width="2"/><path d="M24 14l5 3-5 3z" fill="#6a5040" stroke="#1e1610" stroke-width="2"/><path d="M27 19l2 2" stroke="#efe6d2" stroke-width="2"/><path d="M9 25v4M20 25v4" stroke="#1e1610" stroke-width="2.5"/><path d="M8 11l2-3 2 3" fill="#4a3a30" stroke="#1e1610" stroke-width="1.5"/>`),house:Z(`<path d="M3 15L16 5l13 10" fill="#9aa4a8" stroke="#4a5458" stroke-width="2"/><path d="M6 14v13h20V14" fill="#e8d4b0" stroke="#6b4a24" stroke-width="2"/><rect x="13" y="18" width="6" height="9" fill="#5a8ab0" stroke="#2c4a66" stroke-width="1.5"/><path d="M3 15L16 5l13 10" fill="none" stroke="#4a5458" stroke-width="3"/>`),machete:Z(`<path d="M5 25L23 5q5 2 3 7L10 28z" fill="#c8ccd0" stroke="#4a5058" stroke-width="2"/><path d="M5 25l-2 2 3 3 4-2" fill="#7a4a24" stroke="#3a2010" stroke-width="2"/>`),horse:Z(`<path d="M6 22q0-8 8-9l6-5 4-3 2 2-1 4 3 4-2 2-4-2-2 6 1 8h-3l-2-6h-5l-1 6H7z" fill="#8a5a30" stroke="#3a2010" stroke-width="2" stroke-linejoin="round"/>`),tree:Z(`<rect x="14" y="18" width="4" height="11" fill="#7a4a24" stroke="#3a2010" stroke-width="1.5"/><circle cx="16" cy="13" r="9" fill="#5b8a34" stroke="#2c4a18" stroke-width="2"/><circle cx="11" cy="16" r="5" fill="#6f9a3a" stroke="#2c4a18" stroke-width="1.5"/><circle cx="21" cy="16" r="5" fill="#6f9a3a" stroke="#2c4a18" stroke-width="1.5"/>`),home:Z(`<path d="M4 16L16 6l12 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 14v13h16V14" fill="none" stroke="currentColor" stroke-width="3"/>`)},Ah=e=>`#`+e.toString(16).padStart(6,`0`);function jh(e,t=0){let n=Ah(e.skin),r=Ah(e.shirt),i=e.hat==null?`<path d="M18 26q0-16 14-16t14 16q-4-6-14-6t-14 6z" fill="${e.scarf==null?`#3a2a1e`:Ah(e.scarf)}" stroke="#5a2a1a" stroke-width="2"/>`:`<ellipse cx="32" cy="22" rx="24" ry="6" fill="${Ah(e.hat)}" stroke="#5a4020" stroke-width="2"/><path d="M20 21q1-12 12-12t12 12z" fill="${Ah(e.hat)}" stroke="#5a4020" stroke-width="2"/><path d="M20.5 18h23" stroke="#6b4a2a" stroke-width="3"/>`,a=e.scarf!=null&&e.hat!=null?`<path d="M23 43l9 6 9-6-3 6h-12z" fill="${Ah(e.scarf)}" stroke="#5a2a1a" stroke-width="1.5"/>`:``;return`<svg viewBox="0 0 64 64" class="portrait" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#f3e3bf"/>
    <path d="M10 64v-6q0-12 22-14 22 2 22 14v6z" fill="${r}" stroke="#4a3424" stroke-width="2"/><path d="M26 47v17M38 47v17" stroke="#00000022" stroke-width="2"/>
    ${e.skirt?`<path d="M19 30q-3 10 2 14M45 30q3 10-2 14" stroke="#2e2018" stroke-width="5" fill="none" stroke-linecap="round"/>`:``}<circle cx="32" cy="31" r="12" fill="${n}" stroke="#4a3424" stroke-width="2"/>
    <circle cx="27.5" cy="30" r="1.6" fill="#2a1e16"/><circle cx="36.5" cy="30" r="1.6" fill="#2a1e16"/><path d="M28 37q4 3 8 0" stroke="#5a2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    ${!e.skirt&&t%2?`<path d="M27 36q5-3 10 0" stroke="#3a2a1e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`:``}${a}${i}</svg>`}var $=(e,t=document)=>t.querySelector(e),Mh=e=>{let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content.firstElementChild},Nh=e=>String(e).replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]);function Ph(e){let t=[];for(let n of hd)md[n].level===e&&t.push(md[n].seedName);for(let n of Object.values(gd))n.level===e&&t.push(`Receta: ${n.name}`);for(let n of kd)Dd[n].level===e&&t.push(`Contratar: ${Dd[n].name}`);for(let n of Ud)n.level===e&&t.push(`Terreno: ${n.name}`);for(let n of Ld)W[n].level===e&&t.push(`Construir: ${W[n].name}`);for(let n of Af)n.level===e&&t.push(n.text);for(let n of sf)of[n].level===e&&!of[n].road&&t.push(`${of[n].soon?`Muy pronto`:`Se abre`}: ${of[n].name} (${of[n].blurb.toLowerCase().replace(/\.$/,``)})`);let n=Rd.filter(t=>W[t].level===e&&W[t].kind===`house`).length;n&&t.push(`Batey: ${n} solar${n>1?`es`:``} para casas`);for(let n of Rd)W[n].level===e&&W[n].kind!==`house`&&t.push(`Batey: ${W[n].name}`);return e===2&&t.push(`El fogón (cocina)`,`Almacén más grande`),e===3&&t.push(`Ampliar gallinero`),e===4&&t.push(`Abono`),yd.forEach((n,r)=>{n===e&&r>=1&&t.push(`Almacén de ${vd[r+1]}`)}),t}var Fh={bodega:`shop`,escuela:`xp`,iglesia:`house`,anden:`truck`,vacas:`leche`,chivos:`queso`,pozo:`water`,cerdos:`carne`,trapiche:`azucar`,gallinero2:`hen`,fogon2:`fire`,casaTabaco:`puros`},Ih=class{constructor(e){this.g=e,this.root=$(`#ui`),this.labels=new Map,this.floaters=[],this.toasts=[],this.sheet=null,this.isTouch=matchMedia(`(pointer: coarse)`).matches||`ontouchstart`in window,this.build()}get s(){return this.g.sim.s}get sim(){return this.g.sim}build(){this.root.innerHTML=`
      <div class="labels" id="labels"></div>
      <div class="floaters" id="floaters"></div>
      <div class="tut-arrow hidden" id="tut-arrow"><svg viewBox="0 0 32 40"><path d="M16 38L2 20h8V2h12v18h8z" fill="#f2c14e" stroke="#5a3a16" stroke-width="2.5" stroke-linejoin="round"/></svg></div>
      <div class="hud-top">
        <button class="chip level" data-act="levelinfo" aria-label="Nivel y experiencia">
          <span class="lvl-badge">${Q.xp}<b id="lvl">1</b></span>
          <span class="xpbar"><i id="xpfill"></i></span>
        </button>
        <div class="chip money" aria-label="Pesos">${Q.coin}<b id="money">0</b><small>pesos</small></div>
        <button class="chip inv" data-act="inventory" aria-label="Canasta">${Q.basket}<b id="invc">0/20</b></button>
        <div class="chip wood hidden" id="woodchip" aria-label="Madera">${Q.wood}<b id="wood">0</b><small>madera</small></div>
        <span class="grow"></span>
        <button class="round ffbtn" id="btn-ff" data-act="ff" aria-label="Adelantar el tiempo">${Q.ff}<b id="ffx">x1</b></button>
        <button class="round" id="btn-full" data-act="fullscreen" aria-label="Pantalla completa">${Q.full}</button>
        <button class="round" data-act="settings" aria-label="Ajustes">${Q.gear}</button>
      </div>
      <div class="ffbanner hidden" id="ffbanner"><span class="ffspin">${Q.clock}</span><b>Adelantando…</b><span id="ffinfo">x5</span><button class="btn" data-act="ffstop">${Q.play}Normal</button></div>
      <div class="toasts" id="toasts" aria-live="polite"></div>
      <div class="plotpill hidden" id="plotpill"></div>
      <div class="guide hidden" id="guide">
        <div class="guide-step" id="guide-step">1/6</div>
        <div class="guide-text" id="guide-text"></div>
        <button class="guide-skip" data-act="skiptut">Saltar</button>
      </div>
      <div class="bottom">
        <button class="big" data-act="shop">${Q.shop}<span>Tienda</span></button>
        <button class="big" data-act="land">${Q.land}<span>Terreno</span></button>
        <button class="big" data-act="workers" id="btn-workers">${Q.worker}<span>Trabajadores</span><em id="wcount" class="hidden">0</em></button>
        <button class="big seedsel" data-act="seed" id="seedsel">${Q.seed}<span id="seedname">Tomate</span><em id="seedcount">2</em></button>
      </div>
      <div class="camgroup">
        <button class="round cam" data-act="viewfarm" id="btn-viewfarm" aria-label="Ver toda la finca">${Q.land}<span>Ver finca</span></button>
        <button class="round cam" data-act="center" aria-label="Centrar en el guajiro">${Q.center}<span>Centrar</span></button>
      </div>
      <div class="explore" id="explore">
        <button class="btn primary gohome hidden" data-act="gofarm" id="btn-home">${Q.home}<span>Volver a la finca</span></button>
        <button class="round cam hidden" data-act="gomanigua" id="btn-manigua" aria-label="Ir a la manigua">${Q.tree}<span>Manigua</span></button>
        <button class="round cam hidden" data-act="gobatey" id="btn-batey" aria-label="Ir al batey">${Q.house}<span>Batey</span></button>
      </div>
      <div class="hint" id="hint">Toca para caminar · WASD/flechas · E/Espacio usar · rueda o pellizco = zoom</div>
      <div class="joy hidden" id="joy"><div class="joy-knob" id="knob"></div></div>
      <button class="use hidden" id="use" data-act="use">Usar</button>
      <div class="sheet-wrap hidden" id="sheet-wrap">
        <div class="sheet" role="dialog" aria-modal="true">
          <header><h2 id="sheet-title"></h2><button class="round ghost" data-act="close" aria-label="Cerrar">${Q.close}</button></header>
          <div class="sheet-body" id="sheet-body"></div>
        </div>
      </div>
      <div class="modal-wrap hidden" id="modal-wrap"><div class="modal" id="modal"></div></div>
    `,this.root.addEventListener(`click`,e=>{let t=e.target.closest(`[data-act]`);t&&!t.disabled&&(this.g.sound.unlock(),this.act(t.dataset.act,t.dataset))}),$(`#sheet-wrap`).addEventListener(`click`,e=>{e.target.id===`sheet-wrap`&&this.closeSheet()}),this.fsSupported()||$(`#btn-full`).classList.add(`hidden`),document.addEventListener(`fullscreenchange`,()=>this.refreshSettingsIfOpen()),this.setupJoystick(),this.applySettings(),this.refreshHud()}fsSupported(){return a}isFullscreen(){return!!(document.fullscreenElement||document.webkitFullscreenElement)}toggleFullscreen(e){let t=document.documentElement;try{this.isFullscreen()&&e!==!0?(document.exitFullscreen||document.webkitExitFullscreen)?.call(document):this.isFullscreen()||((t.requestFullscreen||t.webkitRequestFullscreen)?.call(t,{navigationUI:`hide`}))?.catch?.(()=>{})}catch{}}applySettings(){let e=this.s.settings;this.g.sound.setMusic(e.music),this.g.sound.setSfx(e.sfx),$(`#joy`).classList.toggle(`hidden`,!e.joystick),$(`#hint`).classList.toggle(`hidden`,this.isTouch)}act(e,t){let n=this.sim;switch(e){case`shop`:return this.openShop();case`land`:return this.openLand();case`workers`:return this.openWorkers();case`worker`:return this.openWorker(t.id);case`hire`:if(n.hire(t.id)){let e=n.workers.filter(e=>e.role===t.id);this.openWorker(e[e.length-1].rec.id)}else this.refreshSheet();return;case`wup`:n.upgradeWorker(t.id),this.refreshSheet();return;case`wauto`:n.toggleAutobuy(t.id),this.refreshSheet();return;case`wsell`:n.toggleSell(t.id),this.refreshSheet();return;case`wkeep`:n.cycleKeep(t.id),this.refreshSheet();return;case`wfire`:return this.confirmFire(t.id);case`wfire-yes`:n.fireWorker(t.id),$(`#modal-wrap`).classList.add(`hidden`),this.openWorkers();return;case`ff`:this.g.cycleSpeed();return;case`ffstop`:this.g.setSpeed(1);return;case`ffplot`:this.g.fastForwardPlot(this.focusPlot);return;case`inventory`:return this.openInventory();case`settings`:return this.openSettings();case`levelinfo`:return this.openLevel();case`fullscreen`:return this.toggleFullscreen();case`center`:this.g.centerPlayer();return;case`viewfarm`:this.s.level>=of.manigua.level&&this.g.rig.goalDist>this.g.rig.fitDist(...Object.values(this.g.ownedRect()))*.95?this.g.viewWorld():this.g.viewFarm();return;case`gomanigua`:this.closeSheet(),this.g.goManigua();return;case`gobatey`:this.closeSheet(),this.g.goBatey();return;case`gofarm`:this.closeSheet(),this.g.goFarm();return;case`uphouse`:n.upgradeHouse(t.id)?this.closeSheet():this.refreshSheet();return;case`cheat`:this.g.cheat(t.id),this.refreshSheet();return;case`build`:n.build(t.id)?this.closeSheet():this.refreshSheet();return;case`opensite`:return this.openBuild(t.id);case`goBuild`:this.closeSheet();{let e=W[t.id];this.g.rig.goal.set(e.x+e.w/2,0,e.z+e.h/2),this.g.rig.goalDist=Math.min(this.g.rig.maxDist,24),this.g.rig.manualUntil=performance.now()+5e3}return;case`clearobs`:{let e=n.obstacle(t.id);this.closeSheet(),e&&this.s.money>=e.cost?this.g.commandTarget({kind:`obstacle`,id:e.id}):this.toast(`Todavía no alcanzan los pesos.`);return}case`seed`:return this.cycleSeed();case`use`:n.use();return;case`truckinfo`:this.g.commandTarget({kind:`truck`,i:+(t.i||0)});return;case`close`:return this.closeSheet();case`skiptut`:this.s.tutorialDone=!0,this.updateTutorial();return;case`buy`:n.buy(t.id,+(t.qty||1))&&this.g.tut(`buy`),this.refreshSheet();return;case`parcel`:n.buyParcel(t.id)&&(this.g.onLandChanged(),this.closeSheet());return;case`sell`:n.sellLoose(t.item,t.qty===`all`?999:+t.qty),this.refreshSheet();return;case`skiptruck`:n.skipTruck(+(t.i||0)),this.closeSheet();return;case`loadtruck`:{let e=+(t.i||0);n.loadTruck(e),this.refreshSheet(),n.isParked(e)&&this.truckSheetId===n.s.trucks[e]?.id||this.closeSheet();return}case`cook`:n.startRecipe(t.id,t.key||`kitchen`)?this.closeSheet():this.refreshSheet();return;case`collectk`:n.collectKitchen(!1,t.key||`kitchen`),this.closeSheet();return;case`quality`:this.g.setQuality(t.id),this.refreshSheet();return;case`toggle`:this.s.settings[t.key]=!this.s.settings[t.key],this.applySettings(),this.refreshSheet();return;case`reset`:return this.confirmReset();case`reset-yes`:this.g.resetGame();return;case`modal-close`:$(`#modal-wrap`).classList.add(`hidden`);return;case`selseed`:this.s.selectedSeed=t.id,this.refreshHud(),this.closeSheet();return;default:Of[e]&&Of[e](this,t)}}cycleSeed(){let e=this.s,t=hd.filter(t=>e.level>=md[t].level);if(t.length<=1&&e.seeds[e.selectedSeed]===0)return this.openShop();this.openSheet(`Semilla para sembrar`,()=>t.map(t=>`
      <div class="row ${e.selectedSeed===t?`sel`:``}">
        <div class="row-ico">${Q[t]}</div>
        <div class="row-main"><b>${md[t].name}</b><small>Tienes ${e.seeds[t]} · crece en ${fp(this.sim.plotDur(t))}</small></div>
        <button class="btn" data-act="selseed" data-id="${t}">${e.selectedSeed===t?`Elegida`:`Elegir`}</button>
      </div>`).join(``))}openSheet(e,t){this.sheet={title:e,render:t},$(`#sheet-title`).textContent=e,this.sheetHtml=t(),$(`#sheet-body`).innerHTML=this.sheetHtml,$(`#sheet-wrap`).classList.remove(`hidden`),this.g.sound.play(`tap`)}refreshSheet(){if(this.sheet){let e=this.sheet.render();e!==this.sheetHtml&&($(`#sheet-body`).innerHTML=e,this.sheetHtml=e)}this.refreshHud()}refreshSettingsIfOpen(){this.sheet?.title===`Ajustes`&&this.refreshSheet()}closeSheet(){this.sheet=null,$(`#sheet-wrap`).classList.add(`hidden`)}priceBtn(e,{act:t=`buy`,id:n,qty:r,disabled:i,lockLevel:a,label:o,wood:s}={}){if(a)return`<button class="btn locked" disabled>Nivel ${a}</button>`;let c=this.s.money<e||s&&this.s.res.madera<s;return`<button class="btn ${c?`poor`:``}" data-act="${t}" data-id="${n}" ${r?`data-qty="${r}"`:``} ${i||c?`disabled`:``}>${o||``}${Q.coin}${e}${s?`<span class="wd">${Q.wood}${s}</span>`:``}</button>`}openShop(){this.openSheet(`Tienda`,()=>{let e=this.s,t=this.sim,n=`<h3>Semillas</h3>`;for(let r of hd){let i=md[r],a=e.level<i.level?i.level:0,o=fd[i.item].sell-i.seed;n+=`<div class="row ${a?`dim`:``}"><div class="row-ico">${Q[r]}</div>
          <div class="row-main"><b>${i.seedName}</b><small>Crece en ${fp(t.plotDur(r))} · se vende a ${fd[i.item].sell} (+${o}) · tienes ${e.seeds[r]}</small></div>
          <div class="row-btns">${this.priceBtn(t.seedPrice(r),{id:r,qty:1,lockLevel:a,label:`1 · `})}${a?``:this.priceBtn(t.seedPrice(r)*5,{id:r,qty:5,label:`5 · `})}</div></div>`}n+=`<h3>Animales y mejoras</h3>`;let r=e.chickens.length>=zf(e);n+=`<div class="row"><div class="row-ico">${Q.hen}</div><div class="row-main"><b>Gallina</b><small>${e.chickens.length}/${zf(e)} en el corral · un huevo cada ~30 s</small></div>
        ${r?`<button class="btn locked" disabled>Lleno</button>`:this.priceBtn(t.chickenPrice(),{id:`chicken`})}</div>`;let i=(t,n,r,i,a,o)=>`<div class="row ${e.level<a?`dim`:``}"><div class="row-ico">${Q.up}</div><div class="row-main"><b>${n}</b><small>${r}</small></div>
        ${o?`<button class="btn locked" disabled>Listo</button>`:this.priceBtn(i,{id:t,lockLevel:e.level<a?a:0})}</div>`,a=e.upgrades.storage,o=a>=_d.storage.length;return n+=i(`storage`,`Almacén más grande`,o?`Ya caben ${Lf(e)} cosas.`:`Caben ${vd[a+1]} cosas (ahora ${Lf(e)}).`,_d.storage[Math.min(a,_d.storage.length-1)],yd[Math.min(a,yd.length-1)],o),n+=i(`coop`,`Ampliar gallinero`,`Caben 8 gallinas en vez de 4.`,_d.coop,3,e.upgrades.coop),n+=i(`abono`,`Abono`,`Todo crece un 20 % más rápido.`,_d.abono,4,e.upgrades.abono),n+=`<h3>Trabajadores</h3><div class="row"><div class="row-ico">${Q.worker}</div><div class="row-main"><b>Ayudantes para la finca</b><small>Recogen, riegan, siembran, cosechan, cocinan y cargan camiones.</small></div><button class="btn primary" data-act="workers">Ver</button></div>`,n})}workerCard(e){let t=this.s,n=Dd[e],r=this.sim,i=r.workers.filter(t=>t.role===e),a=t.level<n.level?n.level:0,o=r.hirePrice(e),s=t.workers.length>=r.workerCap(),c=a?`<button class="btn locked" disabled>Nivel ${a}</button>`:s?`<button class="btn locked" disabled>Sin vivienda</button>`:`<button class="btn primary ${t.money<o?`poor`:``}" data-act="hire" data-id="${e}" ${t.money<o?`disabled`:``}>${i.length?`Otro`:`Contratar`} ${Q.coin}${o}</button>`,l=i.length?i.map(t=>nf(e,t.rec.n||0)).join(`, `):nf(e,0),u=i.map(t=>`<button class="wchip" data-act="worker" data-id="${t.rec.id}">${jh(rf(e,t.rec.n||0),kd.indexOf(e)+(t.rec.n||0))}<span><b>${Nh(nf(e,t.rec.n||0))}</b> <i class="stars">${`★`.repeat(t.rec.lvl)}</i><small>${Nh(t.status)}</small></span></button>`).join(``);return`<div class="wcard ${a?`dim`:``} ${i.length?`hired`:``} ${n.tag?`feat`:``}" data-worker="${e}">
      ${jh(n.look,kd.indexOf(e))}
      <div class="wmain">${n.tag?`<span class="wtag">${Q.coin}${n.tag}</span>`:``}<b>${Nh(l)}${i.length>1?` <em class="cnt">×${i.length}</em>`:``}</b><span class="role">${Q[n.icon]||``}${n.name}</span>
        <small>${i.length===1?`Ahora: ${Nh(i[0].status)}`:n.detail}</small></div>
      <div class="wbtn">${c}</div>${u?`<div class="wcrew">${u}</div>`:``}</div>`}openWorkers(){this.openSheet(`Trabajadores`,()=>{let e=this.s,t=e.workers.length,n=Vf(e);return`<div class="capbar ${t>=n?`full`:``}">${Q.worker}<b>Trabajadores ${t}/${n}</b><small>${t>=n?e.level>=of.batey.level?`Para contratar más: construye o mejora casas en el batey, o sube de nivel.`:`Sube de nivel para más sitio; en el nivel ${of.batey.level} se abre el batey para hacer casas.`:`Puedes tener varios del mismo oficio: se reparten el trabajo sin estorbarse. El tope sube con el nivel y con las casas del batey.`}</small></div>
        <p class="note">Pago único, sin salario. Trabajan solos, también mientras adelantas el tiempo. ${t?``:`El primero cuesta poco: ¡vende huevos y contrata a Pancho!`}</p>`+[...kd].sort((e,t)=>+!!Dd[t].tag-!!Dd[e].tag).map(e=>this.workerCard(e)).join(``)})}openWorker(e){let t=this.sim.workerById(e);if(!t)return Dd[e]?this.openSheet(Dd[e].name,()=>this.workerCard(e)):void 0;let n=t.role,r=Dd[n],i=t.rec.id,a=nf(n,t.rec.n||0);this.openSheet(`${a} · ${r.name}`,()=>{let e=this.s,t=this.sim.workerById(i);if(!t)return this.workerCard(n);let o=t.rec.lvl,s=Ad[o],c=`<div class="wdetail">${jh(rf(n,t.rec.n||0),kd.indexOf(n)+(t.rec.n||0))}<div><p class="wstatus">${Q[r.icon]||``} <b>${Nh(t.status)}</b></p><small>${r.detail} Trabajos hechos: ${t.rec.jobs||0}.</small></div></div>`;if(c+=`<div class="row"><div class="row-ico">${Q.up}</div><div class="row-main"><b>Rapidez ${`★`.repeat(o)}${`☆`.repeat(3-o)}</b><small>Camina ${s.walk.toFixed(1)} · trabaja en ${s.work.toFixed(1)} s${o<3?` → nivel ${o+1}: ${Ad[o+1].walk.toFixed(1)} · ${Ad[o+1].work.toFixed(1)} s`:` · ¡al máximo!`}</small></div>
        ${o<3?this.priceBtn(jd(n,o),{act:`wup`,id:i,label:`Mejorar · `}):`<button class="btn locked" disabled>Máximo</button>`}</div>`,n===`sembrador`&&(c+=`<div class="row"><div class="row-ico">${Q.seed}</div><div class="row-main"><b>Comprar semillas sola</b><small>Si no quedan, compra ${md[e.selectedSeed]?.seedName.toLowerCase()||`semillas`} con tus pesos.</small></div>
          <button class="btn toggle ${t.rec.autobuy?`on`:``}" data-act="wauto" data-id="${i}">${t.rec.autobuy?`Sí`:`No`}</button></div>`),n===`camionero`){let e=t.rec.keep??10;c+=`<div class="row"><div class="row-ico">${Q.truck}</div><div class="row-main"><b>Atiende los camiones solo</b><small>Trae del bohío lo que piden, carga y cobra. Si piden lo que no hay, espera 20 s por si llega y luego lo despide. Con dos camioneros, cada uno atiende un camión.</small></div></div>`,c+=`<div class="row"><div class="row-ico">${Q.coin}</div><div class="row-main"><b>Vender lo que sobra</b><small>Venta suelta a precio normal de lo que pase de lo que guardas (nunca lo que piden los camiones).</small></div>
          <button class="btn toggle ${t.rec.sell?`on`:``}" data-act="wsell" data-id="${i}">${t.rec.sell?`Sí`:`No`}</button></div>`,c+=`<div class="row ${t.rec.sell?``:`dim`}"><div class="row-ico">${Q.basket||Q.egg}</div><div class="row-main"><b>Guardar ${e} de cada cosa</b><small>Lo demás lo vende ${Nh(a)}. Toca para cambiar (${Od.join(` / `)}).</small></div>
          <button class="btn" data-act="wkeep" data-id="${i}">${e}</button></div>`}return c+=`<div class="modal-btns"><button class="btn" data-act="workers">Todos los trabajadores</button><button class="btn danger" data-act="wfire" data-id="${i}">Despedir</button></div>`,c}),this.g.focusWorker?.(i)}confirmFire(e){let t=this.sim.workerById(e);if(!t)return;let n=nf(t.role,t.rec.n||0);this.modal(`<h2>¿Despedir a ${Nh(n)}?</h2><p>No se devuelve lo pagado. Puedes volver a contratar después.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn danger" data-act="wfire-yes" data-id="${t.rec.id}">Despedir</button></div>`)}openLand(){this.openSheet(`Terreno y obras`,()=>{let e=this.s,t=`<p class="note">Tienes ${e.parcels.length} de ${Ud.length} pedazos de tierra. Compra la tierra de al lado, quita piedras, marabú y tocones para abrir canteros, y construye en los solares.</p>`;t+=`<div class="capbar">${Q.wood}<b>Madera: ${e.res.madera}/500</b><small>${e.level>=of.manigua.level?`Tumba árboles en la manigua o contrata al leñador.`:`La madera sale de la manigua (nivel ${of.manigua.level}).`}</small></div>`,t+=this.bateySection();for(let e of Df.land||[])t+=e(this)||``;t+=`<h3>Construir en la finca</h3>`;for(let n of Ld){let r=W[n],i=!!e.built[n],a=Ud.find(e=>e.id===r.parcel),o=e.parcels.includes(r.parcel),s=e.level<r.level?r.level:0,c=i?`<button class="btn" data-act="goBuild" data-id="${n}">Ver</button>`:o?this.priceBtn(r.price,{act:`build`,id:n,lockLevel:s,wood:r.madera}):`<button class="btn locked" disabled>${s?`Nivel ${s}`:`Sin tierra`}</button>`;t+=`<div class="row ${s||!o?`dim`:``} ${i?`sel`:``}"><div class="row-ico">${Q[Fh[n]]||Q.up}</div><div class="row-main"><b>${r.name}</b><small>${r.detail}${i?` · ¡construido!`:o?``:` · en “${a.name}”`}</small></div>${c}</div>`}return t+=`<h3>Tierra</h3>`,t+=Ud.map(t=>{let n=e.parcels.includes(t.id),r=e.level<t.level?t.level:0,i=qf(e,t),a=`${t.plots.length} canteros${t.obstacles.length?` · ${t.obstacles.length} obstáculos`:``}${t.site?` · solar: ${W[t.site.id].name.toLowerCase()}`:``}`,o=n?`<button class="btn locked" disabled>Tuyo</button>`:r?`<button class="btn locked" disabled>Nivel ${r}</button>`:i?this.priceBtn(t.price,{act:`parcel`,id:t.id}):`<button class="btn locked" disabled>Lejos</button>`;return`<div class="row ${r||!n&&!i?`dim`:``}"><div class="row-ico">${Q.land}</div><div class="row-main"><b>${t.name}</b><small>${t.blurb} ${a}.${!n&&!i&&!r?` Primero compra la tierra de al lado.`:``}</small></div>${o}</div>`}).join(``),t})}bateySection(){let e=this.s,t=df(e,`batey`),n=`<h3>El batey <small>${t?`· viviendas para ${Vf(e)} trabajadores`:`· nivel ${of.batey.level}`}</small></h3>`;if(!t)return n+`<p class="note">${of.batey.blurb} Aquí harás bohíos y casas de zinc (más trabajadores), la bodega, la escuelita y la iglesita.</p>`;n+=`<div class="row"><div class="row-ico">${Q.house}</div><div class="row-main"><b>Ir al batey</b><small>Queda al sur, cruzando el camino.</small></div><button class="btn" data-act="gobatey">Ir</button></div>`;for(let e of Rd)n+=this.bateyRow(e);return n}bateyRow(e){let t=this.s,n=W[e],r=t.built[e],i=t.level<n.level?n.level:0,a=n.kind===`house`,o,s=n.name,c=n.detail||``;return a&&(s=r?.tier===2?n.upgrade.name:r?`Bohío`:`Solar: ${n.name}`,c=r?.tier===2?`Viven ${n.upgrade.cap} trabajadores más.`:r?`Vive ${n.cap} trabajador más. Mejóralo a casa de zinc: +${n.upgrade.cap-n.cap}.`:`Bohío de guano: +${n.cap} trabajador.`),o=r?a&&r.tier!==2?t.level<n.upgrade.level?`<button class="btn locked" disabled>Zinc · nivel ${n.upgrade.level}</button>`:this.priceBtn(n.upgrade.price,{act:`uphouse`,id:e,wood:n.upgrade.wood,label:`Zinc · `}):`<button class="btn" data-act="goBuild" data-id="${e}">Ver</button>`:this.priceBtn(n.price,{act:`build`,id:e,lockLevel:i,wood:n.madera}),`<div class="row ${i?`dim`:``} ${r?`sel`:``}"><div class="row-ico">${Q[Fh[e]]||Q.house}</div><div class="row-main"><b>${s}</b><small>${c}</small></div>${o}</div>`}openBuild(e){let t=W[e];if(t.zone===`batey`)return this.openSheet(t.kind===`house`?`Casa del batey`:t.name,()=>`<p class="note">${t.kind===`house`?`Cada casa da vivienda a trabajadores. Hacen falta pesos y madera.`:t.detail}</p>${this.bateyRow(e)}<p class="note">Madera: ${this.s.res.madera}. Viviendas: ${this.sim.workers.length}/${Vf(this.s)}.</p>`);this.openSheet(t.name,()=>{let n=this.s,r=n.level<t.level?t.level:0;if(n.built[e])return`<p class="note">Ya está construido. ${t.detail}</p>`;let i=!1;for(let e=t.z;e<t.z+t.h;e++)for(let n=t.x;n<t.x+t.w;n++)this.sim.obstacleAt(n,e)&&(i=!0);return`<div class="row"><div class="row-ico">${Q[Fh[e]]||Q.up}</div><div class="row-main"><b>Solar para: ${t.name}</b><small>${t.detail}</small></div>${this.priceBtn(t.price,{act:`build`,id:e,lockLevel:r,wood:t.madera})}</div>
        ${t.madera?`<p class="note">Lleva ${t.madera} de madera (tienes ${n.res.madera}).</p>`:``}
        ${i?`<p class="note">Hay que limpiar el solar primero (toca las piedras o el marabú).</p>`:``}`})}openObstacle(e){let t=zd[e.kind],n=Ud.find(t=>t.id===e.parcel).plots.some(([t,n])=>t===e.x&&n===e.z);this.openSheet(t.name,()=>`<div class="row"><div class="row-ico">${Q.land}</div><div class="row-main"><b>${t.verb}</b><small>${n?`Debajo hay un cantero nuevo. `:``}+${t.xp} XP. Tu guajiro va y lo limpia.</small></div>
      ${this.priceBtn(e.cost,{act:`clearobs`,id:e.id,label:`Quitar · `})}</div>`)}openInventory(){this.openSheet(`La canasta`,()=>{let e=this.s,t=`<p class="note">Llevas ${Rf(e)} de ${Lf(e)}. Vende en el camión.${e.res.madera?` Madera en el bohío: ${e.res.madera}.`:``}</p><div class="grid">`;for(let n of pd)(e.inv[n]||fd[n].level===void 0||e.level>=(fd[n].level||1))&&(t+=`<div class="cell">${Q[n]}<b>${e.inv[n]}</b><small>${fd[n].plural}</small></div>`);t+=`</div><h3>Semillas</h3><div class="grid">`;for(let n of hd)t+=`<div class="cell">${Q[n]}<b>${e.seeds[n]}</b><small>${md[n].name}</small></div>`;return t+`</div>`})}openTruck(e=0){this.truckSheetId=this.s.trucks[e]?.id,this.openSheet(e?`Camión de acopio · andén 2`:`Camión de acopio`,()=>{let t=this.s,n=this.sim,r=t.trucks[e];if(!r||!n.isParked(e)||r.id!==this.truckSheetId)return`<p class="note">El próximo camión está entrando. Un momentico…</p>`;let i=r.order,a=n.missing(r),o=`<div class="order"><h3>Este camión quiere</h3><div class="order-items">`;for(let[e,n]of Object.entries(i.items)){let i=r.loaded[e]||0,a=n-i,s=t.inv[e];o+=`<div class="oi ${a<=0||a<=0||s>=a?`ok`:s>0?`part`:``}">${Q[e]}<b>${i}/${n}</b><small>${fd[e].plural} · tienes ${s}</small></div>`}let s=n.canLoadSome(r),c=Object.keys(a).length>0&&n.canDeliver(r),l=n.workers.find(e=>e.role===`camionero`);o+=`</div><div class="order-foot"><span>Paga ${Q.coin}<b>${i.reward}</b> · ${Q.xp}<b>${i.xp}</b> XP</span></div>
        ${l?`<p class="note">${Q.truck} ${Dd.camionero.who} atiende este camión por ti: ${Nh(l.status)}.</p>`:t.level>=Dd.camionero.level?`<p class="note">¿Cansado de vender? Contrata a ${Dd.camionero.who} en “Trabajadores”: ${Dd.camionero.tag.toLowerCase()}.</p>`:``}
        <div class="order-btns">
          <button class="btn primary" data-act="loadtruck" data-i="${e}" ${s?``:`disabled`}>${c?`Cargar todo`:s?`Cargar lo que hay`:`Cargar`}</button>
          <button class="btn" data-act="skiptruck" data-i="${e}">No tenemos, siguiente</button>
        </div></div>`;let u=t.trucks.slice(n.docks());if(u.length){o+=`<h3>En la fila</h3><div class="queue">`;for(let e of u)o+=`<div class="qi">${Q.truck}${Object.entries(e.order.items).map(([e,t])=>`${Q[e]}${t}`).join(` `)}</div>`;o+=`</div>`}o+=`<h3>Venta suelta <small>(a precio normal)</small></h3>`;let d=!1;for(let e of pd)t.inv[e]&&(d=!0,o+=`<div class="row"><div class="row-ico">${Q[e]}</div><div class="row-main"><b>${fd[e].plural}: ${t.inv[e]}</b><small>${fd[e].sell} pesos cada uno</small></div>
          <div class="row-btns"><button class="btn" data-act="sell" data-item="${e}" data-qty="1">Vender 1</button><button class="btn" data-act="sell" data-item="${e}" data-qty="all">Todo</button></div></div>`);return d||(o+=`<p class="note">La canasta está vacía. Recoge huevos o cosecha.</p>`),o})}openKitchen(e=`kitchen`){let t=e===`kitchen`?`El fogón`:W[e].name;this.openSheet(t,()=>{let t=this.s,n=this.sim.proc(e);return n.ready?`<p class="note">¡Ya está! Recoge: ${fd[n.ready].name.toLowerCase()}.</p><button class="btn primary wide" data-act="collectk" data-key="${e}">Recoger</button>`:n.recipe?`<p class="note">Haciendo ${gd[n.recipe].name.toLowerCase()}… listo en ${pp(gd[n.recipe].time-(Pf()-n.at))}.</p>`:Object.entries(gd).filter(([,t])=>t.where.includes(e)).map(([n,r])=>{let i=t.level<r.level,a=Object.entries(r.needs).map(([e,n])=>`${n} ${fd[e].plural.toLowerCase()} (tienes ${t.inv[e]})`).join(`, `),o=!i&&Object.entries(r.needs).every(([e,n])=>t.inv[e]>=n);return`<div class="row ${i?`dim`:``}"><div class="row-ico">${Q[r.out]}</div><div class="row-main"><b>${r.name}</b><small>${a} · ${fp(r.time)} · se vende a ${fd[r.out].sell}</small></div>
          ${i?`<button class="btn locked" disabled>Nivel ${r.level}</button>`:`<button class="btn" data-act="cook" data-id="${n}" data-key="${e}" ${o?``:`disabled`}>${e===`trapiche`?`Moler`:e===`casaTabaco`?`Torcer`:`Cocinar`}</button>`}</div>`}).join(``)})}openSettings(){this.openSheet(`Ajustes`,()=>{let e=this.s.settings,t=(t,n,r)=>`<div class="row"><div class="row-ico">${r}</div><div class="row-main"><b>${n}</b></div>
        <button class="switch ${e[t]?`on`:``}" data-act="toggle" data-key="${t}" role="switch" aria-checked="${!!e[t]}"><i></i></button></div>`,n=t(`music`,`Música guajira`,Q.music)+t(`sfx`,`Efectos de sonido`,Q.sound)+t(`joystick`,`Joystick en pantalla`,Q.center),r=e.quality||`auto`;return n+=`<div class="row"><div class="row-ico">${Q.xp}</div><div class="row-main"><b>Calidad gráfica</b><small>Ahora: ${this.g.world.quality}${r===`auto`?` (automática)`:``}</small></div></div>
        <div class="seg">${[[`auto`,`Auto`],[`alta`,`Alta`],[`media`,`Media`],[`baja`,`Baja`]].map(([e,t])=>`<button class="btn ${r===e?`primary`:``}" data-act="quality" data-id="${e}">${t}</button>`).join(``)}</div>`,this.fsSupported()?n+=`<div class="row"><div class="row-ico">${Q.full}</div><div class="row-main"><b>Pantalla completa</b></div><button class="btn" data-act="fullscreen">${this.isFullscreen()?`Salir`:`Activar`}</button></div>`:n+=`<p class="note">En iPhone: Compartir → “Añadir a pantalla de inicio” para jugar a pantalla completa.</p>`,n+=`<p class="note">Controles: toca el suelo para caminar, toca huevos, canteros, el camión o el fogón para usarlos. Arrastra para mover la vista y pellizca (o usa la rueda) para acercar o alejar.</p>`,window.__fincaDev&&(n+=`<h3>Trucos (solo desarrollo)</h3><div class="seg"><button class="btn" data-act="cheat" data-id="level">+1 nivel</button><button class="btn" data-act="cheat" data-id="money">+1000 pesos</button><button class="btn" data-act="cheat" data-id="wood">+100 madera</button></div>`),n+=`<button class="btn danger wide" data-act="reset">Empezar de cero…</button>`,n})}openLevel(){let e=this.s,t=e.level+1;this.openSheet(`Nivel ${e.level}`,()=>`<p class="note">${e.xp-dd(e.level)} de ${dd(t)-dd(e.level)} XP para el nivel ${t}.</p>
      <h3>En el nivel ${t} se desbloquea</h3><ul class="unl">${Ph(t).map(e=>`<li>${Nh(e)}</li>`).join(``)||`<li>Más pedidos y mejores pagos</li>`}</ul>
      <p class="note">Ganas XP recogiendo, cosechando, cocinando y entregando pedidos.</p>`)}confirmReset(){this.closeSheet(),this.modal(`<h2>¿Empezar de cero?</h2><p>Se borra toda tu finca: pesos, tierra, gallinas y trabajadores. No se puede deshacer.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn danger" data-act="reset-yes">Sí, borrar</button></div>`)}modal(e){$(`#modal`).innerHTML=e,$(`#modal-wrap`).classList.remove(`hidden`)}levelUp(e){let t=Ph(e);this.modal(`<div class="lvlup">${Q.xp}<b>${e}</b></div><h2>¡Subiste al nivel ${e}!</h2>
      ${t.length?`<p>Ahora tienes:</p><ul class="unl">${t.map(e=>`<li>${Nh(e)}</li>`).join(``)}</ul>`:`<p>Los pedidos pagan mejor.</p>`}
      <div class="modal-btns"><button class="btn primary" data-act="modal-close">¡Dale!</button></div>`)}refreshHud(){let e=this.s;$(`#lvl`).textContent=e.level;let t=dd(e.level),n=dd(e.level+1);$(`#xpfill`).style.width=`${Math.min(100,(e.xp-t)/(n-t)*100)}%`,$(`#money`).textContent=e.money;let r=Rf(e),i=Lf(e);$(`#invc`).textContent=`${r}/${i}`,$(`.chip.inv`).classList.toggle(`full`,r>=i),$(`#woodchip`).classList.toggle(`hidden`,!(e.res.madera>0||e.level>=of.manigua.level)),$(`#wood`).textContent=e.res.madera,$(`#seedname`).textContent=md[e.selectedSeed].name.split(` `)[0],$(`#seedcount`).textContent=e.seeds[e.selectedSeed],$(`#seedsel .ico`).outerHTML=Q[e.selectedSeed]}toast(e){let t=$(`#toasts`);if(this.toasts.length&&this.toasts[this.toasts.length-1].text===e)return;let n=Mh(`<div class="toast">${Nh(e)}</div>`);t.appendChild(n);let r={el:n,text:e,life:3.2};for(this.toasts.push(r);this.toasts.length>2;)this.toasts.shift().el.remove()}float(e,t,n,r){let i=Mh(`<div class="floater ${r||``}">${r===`money`?Q.coin:``}${Nh(n)}</div>`);$(`#floaters`).appendChild(i),this.floaters.push({el:i,x:e,z:t,y:1.2,life:1.3}),this.floaters.length>12&&this.floaters.shift().el.remove()}label(e,t,n,r,i,a=``,o){let s=this.labels.get(e);s||(s={el:Mh(`<div class="wlabel ${a}" ${o?`data-act="${o}"`:``}></div>`),html:``},$(`#labels`).appendChild(s.el),this.labels.set(e,s)),s.html!==i&&(s.el.innerHTML=i,s.html=i,s.w=0),s.x=t,s.y=n,s.z=r,s.seen=!0}updateLabels(){let e=this.s,t=this.sim;for(let e of this.labels.values())e.seen=!1;e.trucks.forEach((e,n)=>{let r=Object.entries(e.order.items).map(([t,n])=>`${Q[t]}${Math.max(0,n-(e.loaded[t]||0))}`).join(` `);if(t.isParked(n)){let i=t.canDeliver(e),a=t.canLoadSome(e);this.label(n?`truck-1`:`truck`,Xd.x,2.3,e.z,`<span class="lt">${n?`Andén 2`:`Pedido`}</span>${r}<span class="pay">${Q.coin}${e.order.reward}</span>${i?`<span class="go">¡Listo!</span>`:a?``:`<span class="no">No hay</span>`}`,i?`ready`:``,`truckinfo" data-i="${n}`)}else Math.abs(e.z-(e.slotZ??e.z))<.05&&this.label(`truckq-${e.id}`,Xd.x,2,e.z,r,`mini`)});let n=Kd.kitchen;t.kitchenOpen()?e.kitchen.ready?this.label(`kitchen`,n.x+1,2.6,n.z+1,`${Q[e.kitchen.ready]} ¡Listo!`,`ready`):e.kitchen.recipe?this.label(`kitchen`,n.x+1,2.6,n.z+1,`${Q[gd[e.kitchen.recipe].out]} ${pp(gd[e.kitchen.recipe].time-(Pf()-e.kitchen.at))}`):this.label(`kitchen`,n.x+1,2.6,n.z+1,`Fogón libre`,`muted`):this.label(`kitchen`,n.x+1,2.6,n.z+1,`Fogón · nivel 2`,`muted`);let r=this.g.world.frontierParcels();for(let t of Ud){if(e.parcels.includes(t.id)||!r.has(t.id)||this.g.rig.dist>75)continue;let[n,i]=this.g.world.parcelCenter(t),a=e.level<t.level;this.label(`parcel-${t.id}`,n,1.2,i,a?`Se vende · nivel ${t.level}`:`Se vende ${Q.coin}${t.price}`,a?`muted`:`sale`,`land`)}for(let[n,r]of Object.entries(W)){if(!Bf(e,r))continue;let i=r.x+r.w/2,a=r.z+r.h/2,o=e.built[n];if(!o){if(r.zone&&(e.level<r.level-3||this.g.rig.dist>40))continue;this.label(`st-${n}`,i,1.1,a,`${r.kind===`house`?`Solar · casa`:`Solar · ${r.name}`}${e.level<r.level?` · nivel ${r.level}`:``}`,e.level<r.level?`muted`:`sale`,`opensite" data-id="${n}`)}else if(r.kind===`animal`)this.label(`st-${n}`,i,1.6,a,o.ready?`${Q[r.produce.item]} ¡Listo!`:`${Q[r.produce.item]} ${pp(t.animalLeft(n))}`,o.ready?`ready`:`mini`);else if(r.kind===`proc`){let e=o;this.label(`st-${n}`,i,2.4,a,e.ready?`${Q[e.ready]} ¡Listo!`:e.recipe?`${Q[gd[e.recipe].out]} ${pp(gd[e.recipe].time-(Pf()-e.at))}`:`${r.name} libre`,e.ready?`ready`:e.recipe?``:`muted`)}}for(let t of sf){let n=of[t];if(!n.sign||df(e,t))continue;let[r,i]=n.sign;n.soon&&e.level<n.level-10||this.label(`zone-${t}`,r,1.4,i,`${n.name} · ${n.soon?`muy pronto`:`nivel ${n.level}`}`,`muted`)}if(e.carry.length){let n=t.player;this.label(`carry`,n.x,2.2,n.z,`${e.carry.map(e=>e.kind===`caballo`?Q.horse:Q[e.kind]||Q.hen).join(``)}<span>${e.carry.length}/3 · a la finca</span>`,`mini ready`)}for(let e of t.workers){let t=Dd[e.role],n=e.work>0?`${Q[t.icon]||``}<span>${Nh(e.status)}</span>`:e.busy?`${Q[t.icon]||``}<span class="dots">…</span>`:`<span class="zz">z z</span>`;this.label(`w-${e.rec.id}`,e.x,1.75,e.z,n,`mini wk ${e.work>0?`working`:``}`,`worker" data-id="${e.rec.id}`)}if(this.focusPlot&&performance.now()<this.focusUntil&&this.focusPlot.crop){let e=this.focusPlot,t=e.at+e.dur-Pf();t>0&&this.label(`focus`,e.x+.5,1.1,e.z+.5,`${Q[e.crop]} ${pp(t)}${e.watered?` ${Q.water}`:``}`)}this.g.rig.camera;let{w:i,h:a}=o();for(let[e,t]of this.labels){if(!t.seen){t.el.remove(),this.labels.delete(e);continue}let n=this.g.project(t.x,t.y,t.z),r=n.x;if(e===`truck`){let e=(t.w||(t.w=t.el.offsetWidth))/2+6;r=Math.min(i-e,Math.max(e,r))}t.el.style.transform=`translate(${r}px, ${n.y}px) translate(-50%, -100%)`,t.el.style.visibility=n.ok&&n.x>-50&&n.x<i+50&&n.y>0&&n.y<a+50?`visible`:`hidden`}}updateFF(){let e=this.g,t=e.ffSpeed,n=this.s,r=$(`#btn-ff`);if(r.dataset.sp!==String(t)&&(r.dataset.sp=String(t),$(`#ffx`).textContent=`x${t}`,r.classList.toggle(`on`,t>1),$(`#ffbanner`).classList.toggle(`hidden`,t===1),document.getElementById(`vignette`)?.classList.toggle(`ff`,t>1)),t>1){let r=n.tod??.6,i=Math.floor(r*24),a=Math.floor((r*24-i)*60),o=`x${t} · ${r<.23||r>.79?Q.moon:Q.sun} ${String(i).padStart(2,`0`)}:${String(Math.floor(a/10)*10).padStart(2,`0`)}${e.ffPlot?` · ${Q[e.ffPlot.crop]||``} ${pp(e.ffPlot.at+e.ffPlot.dur-Pf())}`:``}`,s=$(`#ffinfo`);s.dataset.t!==o&&(s.dataset.t=o,s.innerHTML=o)}let i=$(`#plotpill`),a=this.focusPlot,o=a&&a.crop&&performance.now()<this.focusUntil&&this.sim.plotState(a)===`growing`&&t===1;if(i.classList.toggle(`hidden`,!o),o){i.dataset.crop!==a.crop&&(i.dataset.crop=a.crop,i.innerHTML=`${Q[a.crop]}<span><b>${md[a.crop].name}</b> · listo en <i id="pilltime"></i></span><button class="btn primary" data-act="ffplot">${Q.ff}Adelantar</button>`);let e=pp(a.at+a.dur-Pf()),t=$(`#pilltime`);t.textContent!==e&&(t.textContent=e)}let s=$(`#wcount`),c=n.workers.length;s.textContent!==String(c)&&(s.textContent=c,s.classList.toggle(`hidden`,!c)),!n.hireHint&&!c&&n.money>=Dd.recolector.price&&n.tutorial>=2&&(n.hireHint=!0,this.toast(`¡Ya te alcanza para contratar a ${Dd.recolector.who}! Toca “Trabajadores”.`),$(`#btn-workers`).classList.add(`pulse-once`)),!n.camHint&&n.level>=Dd.camionero.level&&!n.workers.some(e=>e.role===`camionero`)&&n.money>=Dd.camionero.price&&n.tutorialDone&&(n.camHint=!0,this.toast(`${Dd.camionero.who} el camionero ya se puede contratar: ${Dd.camionero.tag.toLowerCase()}.`),$(`#btn-workers`).classList.add(`pulse-once`))}focus(e){this.focusPlot=e,this.focusUntil=performance.now()+7e3}tutorialSteps(){let e=this.s,t=this.sim,n=Pf(),r=e.plots.find(e=>t.plotState(e,n)===`ripe`),i=e.plots.find(e=>t.plotState(e,n)===`growing`),a=e.plots.find(e=>!e.crop),o=hd.some(t=>e.seeds[t]>0),s=e.eggs[0];switch(e.tutorial){case 0:return{text:`¡Qué volá, guajiro! Toca los huevos del corral para recogerlos. Tu guajiro camina solo.`,at:s?[s.x,.6,s.z]:[9.5,.8,7]};case 1:return{text:`Los camiones hacen fila. El primero quiere 3 huevos: tócalo y pulsa “Cargar”. Si pide algo que no tienes, pulsa “No tenemos, siguiente”.`,at:[Xd.x,2.9,Xd.z]};case 2:return o?{text:`Toca un cantero de tierra colorada para sembrar tomates.`,at:a?[a.x+.5,.4,a.z+.5]:null}:{text:`Compra semillas de tomate en la Tienda.`,dom:`[data-act="shop"]`};case 3:return r?(e.tutorial=4,this.tutorialSteps()):{text:`Está creciendo (${i?pp(i.at+i.dur-n):`…`}). Toca ⏩ arriba para adelantar el tiempo y que crezca rápido (o riégala).`,dom:`#btn-ff`};case 4:return r?{text:`¡Tomates listos! Toca la mata (o camina encima) para cosecharlos.`,at:[r.x+.5,.9,r.z+.5]}:{text:`Espera a que brille: cuando la mata tiene una estrellita dorada, está lista.`,at:i?[i.x+.5,.6,i.z+.5]:null};case 5:return{text:`Contrata ayudantes en “Trabajadores” (Pancho recoge huevos), vende a los camiones y compra tierra en “Terreno”.`,dom:`#btn-workers`,done:!0};default:return null}}updateTutorial(){let e=this.s,t=$(`#guide`),n=$(`#tut-arrow`);if(document.querySelectorAll(`.pulse`).forEach(e=>e.classList.remove(`pulse`)),e.tutorialDone||!this.g.started||this.g.ffSpeed>1){t.classList.add(`hidden`),n.classList.add(`hidden`);return}let r=e.stats;e.tutorial===0&&(e.inv.egg>=3||r.eggs>=3||r.sold>0)&&(e.tutorial=1),e.tutorial===1&&r.sold>0&&(e.tutorial=2),e.tutorial===2&&e.plots.some(e=>e.crop)&&(e.tutorial=3),e.tutorial===4&&r.harvests>0&&(e.tutorial=5),e.tutorial>=5&&(e.parcels.length>0||e.level>=3||e.workers.length>0)&&(e.tutorialDone=!0);let i=this.tutorialSteps();if(!i)t.classList.add(`hidden`),n.classList.add(`hidden`);else if(t.classList.remove(`hidden`),$(`#guide-step`).textContent=`${Math.min(6,e.tutorial+1)}/6`,$(`#guide-text`).textContent!==i.text&&($(`#guide-text`).textContent=i.text),$(`.guide-skip`).textContent=i.done?`Entendido`:`Saltar`,i.dom)document.querySelector(i.dom)?.classList.add(`pulse`),n.classList.add(`hidden`);else if(i.at){let e=this.g.project(...i.at);n.classList.toggle(`hidden`,!e.ok),n.style.transform=`translate(${e.x}px, ${e.y}px) translate(-50%, -100%)`}else n.classList.add(`hidden`)}setupJoystick(){let e=$(`#joy`),t=$(`#knob`),n=null,r=0,i=0;e.addEventListener(`pointerdown`,t=>{n=t.pointerId,e.setPointerCapture(n);let o=e.getBoundingClientRect();r=o.left+o.width/2,i=o.top+o.height/2,a(t),this.g.sound.unlock()});let a=e=>{if(e.pointerId!==n)return;let a=e.clientX-r,o=e.clientY-i,s=Math.hypot(a,o);s>46&&(a*=46/s,o*=46/s),t.style.transform=`translate(${a}px, ${o}px)`,this.g.input.joy.x=a/46,this.g.input.joy.z=-o/46},o=e=>{e.pointerId===n&&(n=null,t.style.transform=``,this.g.input.joy.x=0,this.g.input.joy.z=0)};e.addEventListener(`pointermove`,a),e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}updateExplore(){let e=this.s,t=this.sim.player,n=!lf(Math.floor(t.x),Math.floor(t.z)),r=`${n}|${df(e,`manigua`)}|${df(e,`batey`)}`;if(r!==this.exploreState&&(this.exploreState=r,$(`#btn-home`).classList.toggle(`hidden`,!n),$(`#btn-manigua`).classList.toggle(`hidden`,n||!df(e,`manigua`)),$(`#btn-batey`).classList.toggle(`hidden`,n||!df(e,`batey`))),!e.started&&!this.g.started||!$(`#modal-wrap`).classList.contains(`hidden`)||this.sheet||performance.now()<(this.hintAt||0))return;let i=(t,n,r)=>!e.hints[t]&&n?(e.hints[t]=1,this.toast(r),this.hintAt=performance.now()+4500,!0):!1;i(`manigua`,df(e,`manigua`),`¡Se abrió la manigua! Toca «Manigua» para buscar madera, frutas y animales.`)||i(`wood`,e.res.madera>0&&e.level<12,`La madera se guarda en el bohío. Sirve para construir corrales y casas.`)||i(`carry`,e.carry.length>0,`Llévalo a la finca: toca «Volver a la finca» y se entrega solo.`)||i(`lenador`,e.level>=Dd.lenador.level,`${Dd.lenador.who}, el leñador, ya se puede contratar: tumba árboles por ti.`)||i(`batey`,df(e,`batey`),`¡Se abrió el batey! Construye casas para tener más trabajadores (Terreno y obras).`)}update(e){for(let t=this.toasts.length-1;t>=0;t--){let n=this.toasts[t];n.life-=e,n.life<.3&&(n.el.style.opacity=Math.max(0,n.life/.3)),n.life<=0&&(n.el.remove(),this.toasts.splice(t,1))}for(let t=this.floaters.length-1;t>=0;t--){let n=this.floaters[t];n.life-=e,n.y+=e*.9;let r=this.g.project(n.x,n.y,n.z);n.el.style.transform=`translate(${r.x}px, ${r.y}px) translate(-50%, -50%)`,n.el.style.opacity=Math.min(1,n.life*2),n.life<=0&&(n.el.remove(),this.floaters.splice(t,1))}this.updateLabels(),this.updateExplore(),this.updateTutorial(),this.updateFF();let t=$(`#use`),n=this.sim.nearestUse(),r=(this.isTouch||this.s.settings.joystick)&&!!n;t.classList.toggle(`hidden`,!r),n&&t.textContent!==n.label&&(t.textContent=n.label),this.sheet&&/camión|fogón|trabajador|·/i.test(this.sheet.title)&&(this.sheetTick=(this.sheetTick||0)+e,this.sheetTick>.5&&(this.sheetTick=0,this.refreshSheet()))}};new class{constructor(){this.canvas=document.getElementById(`game`);let e=Zf();this.hadSave=!!e;let t=e||Ff();this.sound=new kh,this.started=!1,this.ffSpeed=1,this.ffPlot=null,this.lastSfx={},this.offline=e?this.offlineBefore(t):null,this.sim=new mp(t,this.hooks()),this.sim.update(0),this.rig=new Ch(o().w/o().h),this.isPhone=Math.min(o().w,o().h)<600||matchMedia(`(pointer: coarse)`).matches;let n=t.settings.quality||`auto`;this.world=new Sh(this.canvas,this.sim,n===`auto`?this.isPhone?`media`:`alta`:n),this.perf={sum:0,n:0,checks:0},this.input=new wh(this.canvas,this.rig,{onTap:(e,t)=>this.tap(e,t),onUse:()=>{this.sound.unlock(),this.sim.use()}}),this.ui=new Ih(this),this.rig.follow=this.sim.player,this.resize(),this.fitFarm(!0),this.updateBounds(!0),l(()=>this.resize()),document.addEventListener(`visibilitychange`,()=>{document.hidden&&!this.resetting&&Xf(this.sim.s)}),window.addEventListener(`pagehide`,()=>{this.resetting||Xf(this.sim.s)}),this.saveTimer=0,this.clock=new Es,this.fps={frames:0,t:0,value:60},this.setupTitle(),window.__finca=this,this.renderer=this.world.renderer,this.renderer.setAnimationLoop(()=>this.frame())}hooks(){return{toast:e=>this.ui?.toast(e),float:(e,t,n,r)=>this.ui?.float(e,t,n,r),sfx:e=>{if(this.ffSpeed>1){let t=performance.now();if(t-(this.lastSfx[e]||0)<400)return;this.lastSfx[e]=t}this.sound.play(e)},levelUp:e=>{this.sound.play(`level`),this.ui?.levelUp(e),this.world&&this.rig&&(Object.values(of).some(t=>t.level===e)||Object.values(W).some(t=>t.zone&&t.level===e))&&(this.world.buildStatic(),this.updateBounds(),this.sim.reach=null,this.sim.rebuildGrid())},changed:e=>{this.ui?.refreshHud(),this.world&&(e===`plots`&&(this.world.plotsDirty=!0),e===`land`&&(this.world.buildStatic(),Xf(this.sim.s)),e===`obstacles`&&this.world.buildObstacles(),e===`manigua`&&this.world.zones&&(this.world.zones.dirty=!0),e===`travel`&&(this.updateBounds(!0),this.centerPlayer(),this.rig.target.copy(this.rig.goal),this.world.puff(this.sim.player.x,.3,this.sim.player.z,15260864,10,1.5)))},openTruck:e=>this.ui.openTruck(e),openKitchen:e=>this.ui.openKitchen(e),openBuild:e=>this.ui.openBuild(e),openShop:()=>this.ui.openShop(),marker:e=>{},burst:(e,t,n)=>this.world.puff(e,.4,t,n===`tomato`?13778988:n===`cane`?13222e3:10119726,5,1.2),layed:e=>{this.started&&Math.random()<.5&&this.sound.play(`cluck`)}}}offlineBefore(e){let t=Pf(),n=t-(e.savedAt||t);return n<30?null:{away:n,eggs:e.eggs.length,ripe:0}}offlineSummary(){let e=this.offline;if(!e)return;let t=this.sim.s,n=Math.max(0,t.eggs.length-e.eggs),r=t.plots.filter(e=>this.sim.plotState(e)===`ripe`).length,i=Math.round(e.away/60),a=[];n&&a.push(`${n} huevo${n>1?`s`:``} nuevos`),r&&a.push(`${r} cantero${r>1?`s`:``} listos`),a.length&&this.ui.toast(`Mientras no estabas (${i<1?`un rato`:`${i} min`}): ${a.join(`, `)}.`)}setupTitle(){let e=document.getElementById(`title`),t=document.getElementById(`start`);t.textContent=this.hadSave?`Continuar la finca`:`Entrar a la finca`,document.getElementById(`flag`).innerHTML=Q.flag,t.addEventListener(`click`,()=>{this.sound.unlock(),this.ui.isTouch&&a&&this.ui.toggleFullscreen(!0),e.classList.add(`gone`),setTimeout(()=>e.remove(),600),this.started=!0,this.sound.play(`horn`),this.offlineSummary(),setTimeout(()=>this.resize(),300)})}project(e,t,n){let r=new R(e,t,n).project(this.rig.camera);return{x:(r.x*.5+.5)*this.vw,y:(-r.y*.5+.5)*this.vh,ok:r.z<1}}ownedRect(){let e=this.sim.s,t=Pd.x0,n=Pd.z0,r=Pd.x1+3,i=Pd.z1+1;for(let a of Ud)e.parcels.includes(a.id)&&(t=Math.min(t,a.rect.x0),n=Math.min(n,a.rect.z0),r=Math.max(r,a.rect.x1+1),i=Math.max(i,a.rect.z1+1));return{x0:t,z0:n,x1:r,z1:i}}worldRect(){let e=this.ownedRect();for(let[t,n]of Object.entries(of))!n.road&&df(this.sim.s,t)&&(e.x0=Math.min(e.x0,n.rect.x0),e.z0=Math.min(e.z0,n.rect.z0),e.x1=Math.max(e.x1,n.rect.x1+1),e.z1=Math.max(e.z1,n.rect.z1+1));return e}updateBounds(e=!1){let t=this.worldRect();this.rig.setBounds({x0:t.x0-3,z0:t.z0-3,x1:t.x1+3,z1:t.z1+3},e),this.rig.setMaxDist(Math.max(46,this.rig.fitDist(t.x0,t.z0,t.x1,t.z1)*1.15),e)}fitFarm(e){let t={x0:Pd.x0,z0:Pd.z0,x1:Pd.x1+3,z1:Pd.z1+1};this.rig.fit(t.x0,t.z0,t.x1,t.z1,e),Math.min(o().w,o().h)<500&&(this.rig.goalDist=Math.max(this.rig.minDist,this.rig.goalDist*.8)),e&&(this.rig.dist=this.rig.goalDist),this.closeDist=this.rig.goalDist,this.rig.manualUntil=performance.now()+1500}viewFarm(){let e=this.ownedRect();this.updateBounds(),this.rig.maxDist=Math.max(this.rig.maxDist,this.rig.fitDist(e.x0,e.z0,e.x1,e.z1)),this.rig.fit(e.x0,e.z0,e.x1,e.z1),this.rig.manualUntil=performance.now()+6e3}viewWorld(){let e=this.worldRect();this.updateBounds(),this.rig.maxDist=Math.max(this.rig.maxDist,this.rig.fitDist(e.x0,e.z0,e.x1,e.z1)),this.rig.fit(e.x0,e.z0,e.x1,e.z1),this.rig.manualUntil=performance.now()+6e3}goManigua(){this.sound.unlock(),this.sim.goManigua()&&this.sound.play(`tap`)}goBatey(){this.sound.unlock(),this.sim.goBatey()&&this.sound.play(`tap`)}goFarm(){this.sound.unlock(),this.sim.goFarm(),this.sound.play(`tap`)}cheat(e){if(!window.__fincaDev)return;let t=this.sim.s;if(e===`level`){let e=dd(t.level+1)-t.xp;this.sim.addXp(Math.max(1,e))}e===`money`&&this.sim.addMoney(1e3),e===`wood`&&this.sim.addWood(100),this.ui.refreshHud()}centerPlayer(){this.rig.goal.set(this.sim.player.x,0,this.sim.player.z),this.rig.clampGoal(),this.rig.goalDist=Math.min(this.closeDist||20,22),this.rig.recenter()}onLandChanged(){this.world.buildStatic(),this.ui.refreshHud(),this.updateBounds(),this.viewFarm(),Xf(this.sim.s)}resize(){let{w:e,h:t}=o();this.vw=e,this.vh=t,this.world.resize(e,t),this.rig.setAspect(e/t),this.sim&&this.updateBounds(!0)}resetGame(){Qf(),this.resetting=!0,location.reload()}tut(e){}autoQuality(e){if(!this.started||(this.sim.s.settings.quality||`auto`)!==`auto`||document.hidden)return;let t=this.perf;if(t.sum+=e,t.n++,t.sum<3)return;let n=t.sum/t.n;if(t.sum=0,t.n=0,t.checks++,t.checks<2)return;let r=[`alta`,`media`,`baja`],i=r.indexOf(this.world.quality);n>.025&&i<2&&(this.world.setQuality(r[i+1]),this.resize())}setQuality(e){this.sim.s.settings.quality=e,this.perf={sum:0,n:0,checks:0},this.world.setQuality(e===`auto`?this.isPhone?`media`:`alta`:e),this.resize()}setSpeed(e){e!==this.ffSpeed&&(this.ffSpeed=e,e===1?this.ffPlot=null:(this.sim.s.ffUsed=!0,this.ui.focusPlot=null),this.sound.play(e>1?`level`:`tap`))}cycleSpeed(){let e=Md.indexOf(this.ffSpeed);this.setSpeed(Md[(e+1)%Md.length])}fastForwardPlot(e){e&&e.crop&&this.sim.plotState(e)===`growing`&&(this.setSpeed(20),this.ffPlot=e)}focusWorker(e){let t=this.sim.workerById(e);t&&(this.rig.goal.set(t.x,0,t.z),this.rig.manualUntil=performance.now()+5e3)}commandTarget(e){this.sim.command(e),this.ui.closeSheet()}debugPick(e,t){let n=new Vs;n.setFromCamera(this.input.ndc(e,t),this.rig.camera);let r=this.input.ground(e,t);return{kind:this.world.pick(n),ground:r&&[+r.x.toFixed(2),+r.z.toFixed(2)]}}tap(e,t){if(!this.started)return;this.sound.unlock();let n=new Vs;n.setFromCamera(this.input.ndc(e,t),this.rig.camera);let r=this.world.pick(n),i=this.sim.s,a=(e,t,n)=>{this.sim.command(e)&&(this.world.showMarker(t,n),this.sound.play(`tap`))};if(r&&r.includes(`:`)&&kf[r.split(`:`)[0]])return kf[r.split(`:`)[0]](this,r.slice(r.indexOf(`:`)+1));if(r&&r.startsWith(`worker:`))return this.ui.openWorker(r.slice(7));if(r&&r.startsWith(`wild:`)){let e=this.sim.wildById(+r.slice(5));if(e)return a({kind:`wild`,id:e.id},e.x,e.z)}if(r&&r.startsWith(`wplant:`))return this.tapPlant(r.slice(7));if(r&&r.startsWith(`struct:`)){let e=r.slice(7),t=W[e];return!i.built[e]||t.zone?this.ui.openBuild(e):a({kind:`struct`,id:e},t.x+t.w/2,t.z+t.h+.5)}if(r===`truck:1`)return a({kind:`truck`,i:1},14.5,wd[1]);if(r===`truck`||r&&r.startsWith(`truckq`))return r===`truck`?this.sim.truckParked()?a({kind:`truck`},14.5,9.5):this.ui.toast(`El camión está entrando. Un momentico.`):this.ui.toast(`Ese camión está esperando en la fila. Atiende primero al de adelante.`);if(r){let e=Kd[r];return a({kind:r},e.x+e.w/2,e.z+e.h+.5)}let o=this.input.ground(e,t);if(!o)return;let s=null,c=.6;for(let e of i.eggs){let t=Math.hypot(e.x-o.x,e.z-o.z);t<c&&(c=t,s=e)}if(s)return a({kind:`egg`,id:s.id},s.x,s.z);let l=Math.floor(o.x),u=Math.floor(o.z);if(l<0||u<0||l>=88||u>=80)return;if(!lf(l,u)){let e=this.sim.plantAtTile(l,u),t=1.3;if(!e)for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++){let i=this.sim.plantAtTile(l+r,u+n);if(!i)continue;let a=Math.hypot(i.x+.5-o.x,i.z+.5-o.z);a<t&&(t=a,e=i)}if(e)return this.tapPlant(e.id);let n=uf(l,u);return n&&!ff(l,u)&&!df(i,n)?this.ui.toast(`${of[n].name}: ${of[n].soon?`muy pronto`:`se abre en el nivel ${of[n].level}`}.`):a({kind:`ground`,x:l,z:u},l+.5,u+.5)}let d=this.sim.obstacleAt(l,u);if(!d){let e=.95;for(let t=-1;t<=1;t++)for(let n=-1;n<=1;n++){let r=this.sim.obstacleAt(l+n,u+t);if(!r)continue;let i=Math.hypot(r.x+.5-o.x,r.z+.5-o.z);i<e&&(e=i,d=r)}d&&i.plots.some(e=>e.x===l&&e.z===u)&&(d=null)}if(d)return this.ui.openObstacle(d);let f=i.plots.find(e=>e.x===l&&e.z===u);if(f)return f.crop&&this.sim.plotState(f)===`growing`&&this.ui.focus(f),a({kind:`plot`,p:f},l+.5,u+.5);if(!Kf(i,l,u))return Gf(l,u)?this.ui.openLand():void 0;if(Zd.some(([e,t])=>e===l&&t===u)&&this.sim.truckParked())return a({kind:`truck`},14.5,9.5);a({kind:`ground`,x:l,z:u},l+.5,u+.5)}tapPlant(e){let t=vf.get(e);t&&this.sim.command({kind:`wplant`,id:e})&&(this.world.showMarker(t.x+.5,t.z+.5),this.sound.play(`tap`))}frame(){this.clock.update();let e=Math.min(.1,this.clock.getDelta()),t=this.clock.getElapsed();if(this.started){let t=this.input.moveDir();this.sim.freeMoving=!!t,t&&this.sim.moveFree(t,e);let n=e*this.ffSpeed,r=Math.max(1,Math.ceil(n/Nd-1e-6));for(let t=0;t<r;t++)Nf.offset+=(n-e)/r,this.sim.update(n/r,e/r);if(this.gameDt=n,this.ffPlot&&(!this.ffPlot.crop||this.sim.plotState(this.ffPlot)!==`growing`)){let e=this.ffPlot.crop;this.setSpeed(1),e&&this.ui.toast(`¡${md[e].name} listo para cosechar!`)}this.saveTimer+=e,this.saveTimer>8&&!this.resetting&&(this.saveTimer=0,Xf(this.sim.s))}this.rig.update(e),this.world.update(e,t),this.world.updateSky(e,this.started?this.gameDt||e:0,this.started?this.ffSpeed:1),this.world.ffSpeed=this.ffSpeed,this.world.render(this.rig.camera,this.rig),this.ui.update(e),this.autoQuality(e),this.fps.frames++,this.fps.t+=e,this.fps.t>=1&&(this.fps.value=this.fps.frames/this.fps.t,this.fps.frames=0,this.fps.t=0)}};