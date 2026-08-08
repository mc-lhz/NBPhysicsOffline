(function(m,a){typeof exports=="object"&&typeof module=="object"?module.exports=a():typeof define=="function"&&define.amd?define("NB3DDemo",[],a):typeof exports=="object"?exports.NB3DDemo=a():m.NB3DDemo=a()})(typeof self!="undefined"?self:this,function(){return function(m){function a(l){if(h[l])return h[l].exports;var c=h[l]={i:l,l:!1,exports:{}};return m[l].call(c.exports,c,c.exports,a),c.l=!0,c.exports}var h={};return a.m=m,a.c=h,a.d=function(l,c,d){a.o(l,c)||Object.defineProperty(l,c,{configurable:!1,enumerable:!0,get:d})},a.n=function(l){var c=l&&l.__esModule?function(){return l.default}:function(){return l};return a.d(c,"a",c),c},a.o=function(l,c){return Object.prototype.hasOwnProperty.call(l,c)},a.p="",a(a.s=44)}({44:function(m,a,h){m.exports=h(45)},45:function(m,a,h){"use strict";var l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},c=function(){var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(u,s){u.__proto__=s}||function(u,s){for(var f in s)s.hasOwnProperty(f)&&(u[f]=s[f])};return function(u,s){function f(){this.constructor=u}n(u,s),u.prototype=s===null?Object.create(s):(f.prototype=s.prototype,new f)}}(),d=function(n,u,s,f){var t,e=arguments.length,o=e<3?u:f===null?f=Object.getOwnPropertyDescriptor(u,s):f;if((typeof Reflect=="undefined"?"undefined":l(Reflect))==="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,u,s,f);else for(var r=n.length-1;r>=0;r--)(t=n[r])&&(o=(e<3?t(o):e>3?t(u,s,o):t(u,s))||o);return e>3&&o&&Object.defineProperty(u,s,o),o},S=window.BABYLON||{};(function(n){var u=function(f){function t(){var e=f.call(this)||this;return e.DIFFUSE=!1,e.CLIPPLANE=!1,e.ALPHATEST=!1,e.DEPTHPREPASS=!1,e.POINTSIZE=!1,e.FOG=!1,e.LIGHT0=!1,e.LIGHT1=!1,e.LIGHT2=!1,e.LIGHT3=!1,e.SPOTLIGHT0=!1,e.SPOTLIGHT1=!1,e.SPOTLIGHT2=!1,e.SPOTLIGHT3=!1,e.HEMILIGHT0=!1,e.HEMILIGHT1=!1,e.HEMILIGHT2=!1,e.HEMILIGHT3=!1,e.DIRLIGHT0=!1,e.DIRLIGHT1=!1,e.DIRLIGHT2=!1,e.DIRLIGHT3=!1,e.POINTLIGHT0=!1,e.POINTLIGHT1=!1,e.POINTLIGHT2=!1,e.POINTLIGHT3=!1,e.SHADOW0=!1,e.SHADOW1=!1,e.SHADOW2=!1,e.SHADOW3=!1,e.SHADOWS=!1,e.SHADOWESM0=!1,e.SHADOWESM1=!1,e.SHADOWESM2=!1,e.SHADOWESM3=!1,e.SHADOWPCF0=!1,e.SHADOWPCF1=!1,e.SHADOWPCF2=!1,e.SHADOWPCF3=!1,e.NORMAL=!1,e.UV1=!1,e.UV2=!1,e.VERTEXCOLOR=!1,e.VERTEXALPHA=!1,e.NUM_BONE_INFLUENCERS=0,e.BonesPerMesh=0,e.INSTANCES=!1,e.rebuild(),e}return c(t,f),t}(n.MaterialDefines),s=function(f){function t(e,o){var r=f.call(this,e,o)||this;return r._maxSimultaneousLights=4,r.topColor=new n.Color3(1,0,0),r.topColorAlpha=1,r.bottomColor=new n.Color3(0,0,1),r.bottomColorAlpha=1,r.offset=0,r.smoothness=1,r.disableLighting=!1,r._scaledDiffuse=new n.Color3,r}return c(t,f),t.prototype.needAlphaBlending=function(){return this.alpha<1||this.topColorAlpha<1||this.bottomColorAlpha<1},t.prototype.needAlphaTesting=function(){return!0},t.prototype.getAlphaTestTexture=function(){return null},t.prototype.isReadyForSubMesh=function(e,o,r){if(this.isFrozen&&this._wasPreviouslyReady&&o.effect)return!0;o._materialDefines||(o._materialDefines=new u);var i=o._materialDefines,p=this.getScene();if(!this.checkReadyOnEveryCall&&o.effect&&this._renderId===p.getRenderId())return!0;var v=p.getEngine();if(n.MaterialHelper.PrepareDefinesForFrameBoundValues(p,v,i,!!r),n.MaterialHelper.PrepareDefinesForMisc(e,p,!1,this.pointsCloud,this.fogEnabled,i.ALPHATEST,i),i._needNormals=n.MaterialHelper.PrepareDefinesForLights(p,e,i,!1,this._maxSimultaneousLights),n.MaterialHelper.PrepareDefinesForAttributes(e,i,!1,!0),i.isDirty){i.markAsProcessed(),p.resetCachedMaterial();var y=new n.EffectFallbacks;i.FOG&&y.addFallback(1,"FOG"),n.MaterialHelper.HandleFallbacksForShadows(i,y),i.NUM_BONE_INFLUENCERS>0&&y.addCPUSkinningFallback(0,e);var g=[n.VertexBuffer.PositionKind];i.NORMAL&&g.push(n.VertexBuffer.NormalKind),i.UV1&&g.push(n.VertexBuffer.UVKind),i.UV2&&g.push(n.VertexBuffer.UV2Kind),i.VERTEXCOLOR&&g.push(n.VertexBuffer.ColorKind),n.MaterialHelper.PrepareAttributesForBones(g,e,i,y),n.MaterialHelper.PrepareAttributesForInstances(g,i);var b=i.toString(),E=["world","view","viewProjection","vEyePosition","vLightsType","vDiffuseColor","vFogInfos","vFogColor","pointSize","vDiffuseInfos","mBones","vClipPlane","diffuseMatrix","topColor","bottomColor","offset","smoothness"],P=["diffuseSampler"],C=new Array;n.MaterialHelper.PrepareUniformsAndSamplersList({uniformsNames:E,uniformBuffersNames:C,samplers:P,defines:i,maxSimultaneousLights:4}),o.setEffect(p.getEngine().createEffect("gradient",{attributes:g,uniformsNames:E,uniformBuffersNames:C,samplers:P,defines:b,fallbacks:y,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},v),i)}return!(!o.effect||!o.effect.isReady())&&(this._renderId=p.getRenderId(),this._wasPreviouslyReady=!0,!0)},t.prototype.bindForSubMesh=function(e,o,r){var i=this.getScene(),p=r._materialDefines;if(p){var v=r.effect;v&&(this._activeEffect=v,this.bindOnlyWorldMatrix(e),this._activeEffect.setMatrix("viewProjection",i.getTransformMatrix()),n.MaterialHelper.BindBonesParameters(o,v),this._mustRebind(i,v)&&(n.MaterialHelper.BindClipPlane(v,i),this.pointsCloud&&this._activeEffect.setFloat("pointSize",this.pointSize),n.MaterialHelper.BindEyePosition(v,i)),this._activeEffect.setColor4("vDiffuseColor",this._scaledDiffuse,this.alpha*o.visibility),i.lightsEnabled&&!this.disableLighting&&n.MaterialHelper.BindLights(i,o,this._activeEffect,p),i.fogEnabled&&o.applyFog&&i.fogMode!==n.Scene.FOGMODE_NONE&&this._activeEffect.setMatrix("view",i.getViewMatrix()),n.MaterialHelper.BindFogParameters(i,o,this._activeEffect),this._activeEffect.setColor4("topColor",this.topColor,this.topColorAlpha),this._activeEffect.setColor4("bottomColor",this.bottomColor,this.bottomColorAlpha),this._activeEffect.setFloat("offset",this.offset),this._activeEffect.setFloat("smoothness",this.smoothness),this._afterBind(o,this._activeEffect))}},t.prototype.getAnimatables=function(){return[]},t.prototype.dispose=function(e){f.prototype.dispose.call(this,e)},t.prototype.clone=function(e){var o=this;return n.SerializationHelper.Clone(function(){return new t(e,o.getScene())},this)},t.prototype.serialize=function(){var e=n.SerializationHelper.Serialize(this);return e.customType="BABYLON.GradientMaterial",e},t.prototype.getClassName=function(){return"GradientMaterial"},t.Parse=function(e,o,r){return n.SerializationHelper.Parse(function(){return new t(e.name,o)},e,o,r)},d([n.serialize("maxSimultaneousLights")],t.prototype,"_maxSimultaneousLights",void 0),d([n.expandToProperty("_markAllSubMeshesAsLightsDirty")],t.prototype,"maxSimultaneousLights",void 0),d([n.serializeAsColor3()],t.prototype,"topColor",void 0),d([n.serialize()],t.prototype,"topColorAlpha",void 0),d([n.serializeAsColor3()],t.prototype,"bottomColor",void 0),d([n.serialize()],t.prototype,"bottomColorAlpha",void 0),d([n.serialize()],t.prototype,"offset",void 0),d([n.serialize()],t.prototype,"smoothness",void 0),d([n.serialize()],t.prototype,"disableLighting",void 0),t}(n.PushMaterial);n.GradientMaterial=s})(S||(S={})),S.Effect.ShadersStore.gradientVertexShader=`precision highp float;

attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>

#include<instancesDeclaration>
uniform mat4 view;
uniform mat4 viewProjection;
#ifdef DIFFUSE
varying vec2 vDiffuseUV;
uniform mat4 diffuseMatrix;
uniform vec2 vDiffuseInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif

varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
void main(void) {
#include<instancesVertex>
#include<bonesVertex> 
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
vec4 worldPos=finalWorld*vec4(position,1.0);
vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif

#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vDiffuseInfos.x == 0.)
{
vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));
}
else
{
vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
}
#endif

#include<clipPlaneVertex>

#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]

#ifdef VERTEXCOLOR
vColor=color;
#endif

#ifdef POINTSIZE
gl_PointSize=pointSize;
#endif
}
`,S.Effect.ShadersStore.gradientPixelShader=`precision highp float;

uniform vec3 vEyePosition;
uniform vec4 vDiffuseColor;

uniform vec4 topColor;
uniform vec4 bottomColor;
uniform float offset;
uniform float smoothness;

varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

#include<helperFunctions>

#include<__decl__lightFragment>[0]
#include<__decl__lightFragment>[1]
#include<__decl__lightFragment>[2]
#include<__decl__lightFragment>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>

#ifdef DIFFUSE
varying vec2 vDiffuseUV;
uniform sampler2D diffuseSampler;
uniform vec2 vDiffuseInfos;
#endif
#include<clipPlaneFragmentDeclaration>

#include<fogFragmentDeclaration>
void main(void) {
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition-vPositionW);
float h=normalize(vPositionW).y+offset;
float mysmoothness=clamp(smoothness,0.01,max(smoothness,10.));
vec4 baseColor=mix(bottomColor,topColor,max(pow(max(h,0.0),mysmoothness),0.0));

vec3 diffuseColor=baseColor.rgb;

float alpha=baseColor.a;
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
#ifdef VERTEXCOLOR
baseColor.rgb*=vColor.rgb;
#endif

#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif

vec3 diffuseBase=vec3(0.,0.,0.);
lightingInfo info;
float shadow=1.;
float glossiness=0.;
#include<lightFragment>[0]
#include<lightFragment>[1]
#include<lightFragment>[2]
#include<lightFragment>[3]
#ifdef VERTEXALPHA
alpha*=vColor.a;
#endif
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;

vec4 color=vec4(finalDiffuse,alpha);
#include<fogFragment>
gl_FragColor=color;
}
`}})});
