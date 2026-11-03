import * as THREE from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/rounded-box.mjs';

// Cyber city chase. Scenery, threats and the character are generated locally.
export function createPacketCity(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(52,1,.1,160);
 scene.fog=new THREE.Fog('#10172e',43,140);
 const materials=[],geometries=[],textures=[],geoCache=new Map(),artCache=new Map(),chunks=[],entityMeshes=new Map();
 const boxGeo=new THREE.BoxGeometry(1,1,1),sphereGeo=new THREE.SphereGeometry(1,16,12),cylinderGeo=new THREE.CylinderGeometry(1,1,1,16),planeGeo=new THREE.PlaneGeometry(1,1);
 geometries.push(boxGeo,sphereGeo,cylinderGeo,planeGeo);
 function material(color,glow=0){const v=new THREE.MeshStandardMaterial({color,roughness:.78,metalness:.06,emissive:color,emissiveIntensity:glow});materials.push(v);return v}
 const m={ground:material('#101b31'),sleeper:material('#1d2a40'),tie:material('#28394c'),rail:material('#607a92'),curb:material('#283750'),dark:material('#121d32'),glass:material('#101e33'),glassLight:material('#315a76'),cream:material('#d9e8ef'),teal:material('#13636c'),coral:material('#ed557a'),violet:material('#8269bf'),blue:material('#173751'),purple:material('#28253f'),pink:material('#ff3db7',1.25),cyan:material('#41e8ff',1.25),gold:material('#ffca42',.3),mint:material('#7dffc5',.7),warm:material('#ffc580',.25),skin:material('#c58b6d'),hair:material('#221a38'),jacket:material('#202b43'),hood:material('#1e7284'),denim:material('#19283e'),sole:material('#b9d6e1'),shoe:material('#28354e'),armor:material('#7895af'),hairAccent:material('#b73b96',.15)};
 m.ground.roughness=.34;m.ground.metalness=.45;m.armor.metalness=.65;m.armor.roughness=.35;
 const sky=document.createElement('canvas');sky.width=16;sky.height=512;const skyCtx=sky.getContext('2d'),gradient=skyCtx.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#030716');gradient.addColorStop(.45,'#0d1732');gradient.addColorStop(.76,'#252344');gradient.addColorStop(1,'#153f52');skyCtx.fillStyle=gradient;skyCtx.fillRect(0,0,16,512);const skyTexture=new THREE.CanvasTexture(sky);skyTexture.colorSpace=THREE.SRGBColorSpace;textures.push(skyTexture);scene.background=skyTexture;
 scene.add(new THREE.HemisphereLight('#b7eaff','#14203d',1.8));
 const key=new THREE.DirectionalLight('#def4ff',2.5);key.position.set(-10,18,12);scene.add(key);
 const rim=new THREE.DirectionalLight('#ef68d7',1.7);rim.position.set(10,7,-12);scene.add(rim);
 function group(parent,x=0,y=0,z=0){const v=new THREE.Group();v.position.set(x,y,z);parent.add(v);return v}
 function mesh(parent,geo,mat,x,y,z,sx=1,sy=1,sz=1){const v=new THREE.Mesh(geo,mat);v.position.set(x,y,z);v.scale.set(sx,sy,sz);parent.add(v);return v}
 function box(p,x,y,z,w,h,d,mat){return mesh(p,boxGeo,mat,x,y,z,w,h,d)}
 function round(p,x,y,z,w,h,d,mat,r=.1){const k=[w,h,d,r].join(':');let geo=geoCache.get(k);if(!geo){geo=new RoundedBoxGeometry(w,h,d,2,r);geoCache.set(k,geo);geometries.push(geo)}return mesh(p,geo,mat,x,y,z)}
 function ball(p,x,y,z,w,h,d,mat){return mesh(p,sphereGeo,mat,x,y,z,w,h,d)}
 function cylinder(p,x,y,z,r,h,mat){return mesh(p,cylinderGeo,mat,x,y,z,r,h,r)}
 function batch(root){
  root.updateMatrixWorld(true);const batches=new Map(),inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
  root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh){const k=o.geometry.uuid+o.material.uuid;if(!batches.has(k))batches.set(k,[]);batches.get(k).push(o)}});
  for(const list of batches.values()){if(list.length<2)continue;const v=new THREE.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>{v.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));o.removeFromParent()});v.instanceMatrix.needsUpdate=true;v.computeBoundingSphere();root.add(v)}
 }
 function artwork(copy,fg='#eafaff',bg='#1d2a4c',graffiti=false){
  const k=copy+fg+bg+graffiti;if(artCache.has(k))return artCache.get(k);
  const c=document.createElement('canvas');c.width=512;c.height=192;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,512,192);
  if(graffiti){g.fillStyle='#131c4040';for(let i=0;i<18;i++)g.fillRect((i*97)%512,(i*43)%192,50,10);g.translate(256,98);g.rotate(-.08);g.font='italic 900 86px Arial';g.textAlign='center';g.textBaseline='middle';g.lineWidth=12;g.strokeStyle='#1b244d';g.strokeText(copy,0,0,465);g.fillStyle=fg;g.fillText(copy,0,0,465);g.font='700 18px Arial';g.fillText('KEEP YOUR DATA MOVING',0,63)}
  else{g.strokeStyle=fg;g.lineWidth=7;g.strokeRect(7,7,498,178);g.font='900 58px Arial';g.textAlign='center';g.textBaseline='middle';g.fillStyle=fg;g.fillText(copy,256,98,470)}
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide});materials.push(mat);artCache.set(k,mat);return mat;
 }
 function sign(p,copy,x,y,z,w,h,fg,bg,graffiti=false){return mesh(p,planeGeo,artwork(copy,fg,bg,graffiti),x,y,z,w,h,1)}
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;const sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(32,32,4,32,32,32);sg.addColorStop(0,'#0b123daa');sg.addColorStop(1,'#0b123d00');sc.fillStyle=sg;sc.fillRect(0,0,64,64);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowTexture);const shadowMat=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});materials.push(shadowMat);
 function shadow(p,x,z,w,d){const v=mesh(p,planeGeo,shadowMat,x,.27,z,w,d,1);v.rotation.x=-Math.PI/2;return v}

 function cyberAttack(parent,o){
  const threat=group(parent),depth=o.length||2.6,mid=.32-depth/2;
  shadow(threat,0,mid,2.8,depth+.5);
  if(o.label==='VIRUS'||o.label==='RANSOMWARE'){
   const ransomware=o.label==='RANSOMWARE',color=ransomware?m.violet:m.coral;
   ball(threat,0,1.65,mid,.91,1.08,depth/2,color);
   // Spikes and an angry face identify malware without relying on colour.
   for(let i=0;i<10;i++){const a=i*Math.PI/5,x=Math.cos(a),y=Math.sin(a);const stem=round(threat,x*.94,1.65+y*1.08,mid,.13,.4,.16,color,.04);stem.rotation.z=a-Math.PI/2;ball(threat,x*1.08,1.65+y*1.25,mid,.15,.15,.15,ransomware?m.pink:m.warm)}
   round(threat,0,1.76,.29,1.33,.69,.12,m.dark,.16);
   for(const side of [-1,1]){const eye=box(threat,side*.32,1.86,.38,.36,.11,.06,m.gold);eye.rotation.z=side*.3}
   sign(threat,'× × ×',0,1.19,.35,.78,.3,'#fff0cb','#67264b');
   if(ransomware){const lock=mesh(threat,ringGeo,m.gold,0,2.3,.1,.3,.4,1);round(threat,0,2.07,.33,.64,.5,.17,m.gold,.07);sign(threat,'!',0,2.08,.43,.23,.29,'#242342','#ffca42')}
  }else if(o.label==='PHISHING MAIL'){
   // Oversized email stack: full-height threats must be dodged, not jumped.
   round(threat,0,1.55,mid,2.13,2.9,depth,m.coral,.18);
   round(threat,0,1.55,.36,1.98,2.65,.13,m.cream,.1);
   for(const side of [-1,1]){const fold=box(threat,side*.44,1.9,.45,1.19,.09,.04,m.coral);fold.rotation.z=side*.72;const lower=box(threat,side*.5,1.03,.45,1.15,.06,.04,m.coral);lower.rotation.z=-side*.65}
   round(threat,0,1.49,.49,.66,.67,.1,m.coral,.13);sign(threat,'!',0,1.49,.56,.4,.49,'#fff0cb','#bd305c');
   sign(threat,'UNKNOWN SENDER',0,2.65,.45,1.7,.25,'#922340','#e0e9e7');
   for(const side of [-1,1])for(let j=0;j<3;j++)box(threat,side*1.075,1.55,-.25-j*.7,.025,2.55,.07,m.cream);
  }else{
   round(threat,0,1.55,mid,2.13,3.0,depth,m.violet,.18);round(threat,0,1.62,.36,1.94,2.65,.12,m.dark,.1);
   sign(threat,'FAKE LOGIN',0,2.65,.44,1.7,.35,'#ffcfdf','#202c48');
   for(let i=0;i<2;i++){round(threat,0,1.97-i*.57,.45,1.53,.38,.07,m.glassLight,.05);sign(threat,i?'••••••':'PASSWORD?',0,1.97-i*.57,.5,1.32,.23,'#e0e9e7','#46789c')}
   round(threat,0,.77,.45,1.52,.43,.08,m.coral,.06);sign(threat,'STEAL DATA',0,.77,.5,1.31,.26,'#fff0cb','#bd305c');
  }
  rootCue(threat,o.label);batch(threat);return threat;
 }
 function rootCue(threat,label){
  sign(threat,label,0,3.63,.38,2.65,.5,'#fff1cb','#592a48');
  sign(threat,'← DODGE →',0,3.13,.4,2.15,.36,'#fff1cb','#592a48');
 }

 const skyline=group(scene);
 for(let side of [-1,1])for(let i=0;i<14;i++){
  const x=side*(12+i%4*4.6),z=-25-i*6,h=11+i*7%24,col=[m.purple,m.violet,m.blue][i%3];round(skyline,x,h/2,z,3+i%3,h,4,col,.12);box(skyline,x+.5,h+.8,z,.12,1.8,.12,m.cyan);
  box(skyline,x-1.3,h/2,z+2.08,.055,h,.05,i%2?m.cyan:m.pink);box(skyline,x+1.3,h/2,z+2.08,.055,h,.05,i%2?m.cyan:m.pink);
  round(skyline,x,h+1,z,2.1,2,3,m.dark,.1);box(skyline,x,h+3,z,.09,4,.09,i%3?m.cyan:m.pink);
  for(let y=2;y<h;y+=2.3)for(let q=-1;q<=1;q++)box(skyline,x+q*.8,y,z+2.03,.32,.7,.04,(i+q)%3?m.warm:m.cyan);
 }
 const haloGeo=new THREE.TorusGeometry(9,.12,6,64);geometries.push(haloGeo);mesh(skyline,haloGeo,m.cyan,0,23,-108);mesh(skyline,haloGeo,m.pink,0,23,-109,.78,.78,1);
 round(skyline,0,13,-117,4,26,4,m.dark,.15);box(skyline,0,15,-114.9,.12,30,.12,m.cyan);sign(skyline,'CYBER CITY',0,10,-101,14,2.1,'#8ef4ff','#0b1930');batch(skyline);
 const blockLength=14,totalLength=168;
 for(let i=0;i<12;i++){
  const block=group(scene);block.userData.offset=i*blockLength;chunks.push(block);box(block,0,-.23,0,9,.45,blockLength,m.ground);
  for(let lane=-1;lane<=1;lane++){
   box(block,lane*2.6,.11,0,2.55,.22,blockLength,m.sleeper);
   for(let z=-6;z<7;z+=3.5){box(block,lane*2.6,.225,z,2.4,.012,.045,m.tie);box(block,lane*2.6+.9,.235,z,.04,.015,1.7,m.teal);box(block,lane*2.6+.62,.235,z+.8,.58,.015,.04,m.teal)}
   box(block,lane*2.6-1.28,.235,0,.035,.018,blockLength,m.cyan);
  }
  box(block,3.88,.235,0,.035,.018,blockLength,m.cyan);
  for(let side of [-1,1]){
   box(block,side*4.8,.08,0,1.4,.7,blockLength,m.curb);box(block,side*4.16,.46,0,.09,.04,blockLength,i%3?m.cyan:m.pink);box(block,side*5.45,.95,0,.3,1.6,blockLength,m.purple);
   for(let z of [-5,0,5]){box(block,side*5.4,2.05,z,.13,1.5,.13,m.rail);box(block,side*5.4,2.7,z,.16,.13,5,m.rail)}
   const h=9+(i*3+(side+1))%9,facade=group(block,side*(i%4===1?10.5:8.3+i%2),0,-1);
   round(facade,0,h/2,0,4.7,h,10,[m.blue,m.purple,m.teal,m.violet][(i+(side===1?2:0))%4],.12);box(facade,0,h+.13,0,5.05,.26,10.4,m.cream);box(facade,-side*2.4,h*.5,4.9,.045,h,.08,i%2?m.cyan:m.pink);box(facade,-side*2.44,1.9,0,.055,.065,9.8,i%2?m.pink:m.cyan);
   for(let row=0;row<3;row++)for(let col=0;col<4;col++){const z=-3.7+col*2.35,y=2+row*1.7;round(facade,-side*2.39,y,z,.08,1.12,1.4,m.dark,.04);box(facade,-side*2.45,y+.1,z,.03,.85,1.1,(row+col+i)%5===0?m.glass:(row+col+i)%3?m.warm:m.cyan);box(facade,-side*2.47,y,z,.04,1.1,.045,m.dark)}
   const board=sign(facade,['NEURAL NET','VERIFY','MFA ON','NO PHISH'][i%4],-side*2.5,6.4,-2.1,3.5,1.1,i%2?'#6df3ff':'#ff8fdb','#101c34');board.rotation.y=-side*Math.PI/2;
   for(let y=7;y<h;y+=2){box(facade,-side*2.46,y,0,.035,.06,9.6,i%2?m.cyan:m.pink)}
   const holo=group(block,side*5.4,4.4,-2);round(holo,0,0,0,.9,3.8,.18,m.dark,.08);for(let q=0;q<3;q++)sign(holo,['C','Q','07'][q],0,1.15-q*1.1,.12,.65,.7,side>0?'#ff7bcb':'#5eeaff','#101c34');
   const canopy=box(facade,-side*3,1.55,2,1.5,.13,4.5,i%2?m.coral:m.teal);canopy.rotation.z=side*.15;round(facade,-side*2.5,1.1,-3.4,.4,1.4,.85,m.rail,.05);
   box(block,side*4.8,3.1,4,.12,5.4,.12,m.dark);round(block,side*4.5,5.8,4,1,.22,.48,m.cream,.1);box(block,side*4.5,5.65,4,.75,.03,.33,m.warm);
   if(i%4===1){const rack=group(block,side*7.1,0,5);round(rack,0,1.8,0,2.4,3.6,2,m.dark,.16);for(let j=0;j<5;j++){round(rack,0,.55+j*.6,1.03,2.05,.4,.08,m.glassLight,.05);box(rack,.75,.55+j*.6,1.09,.12,.1,.03,m.cyan)}}
   if(i%3===0){const post=group(block,side*4.85,0,-3);round(post,0,1.1,0,.7,2.2,.65,m.dark,.12);sign(post,'MFA',0,1.4,.34,.55,.7,'#83fff0','#253d65')}
  }
  if(i%3===0){for(let side of [-1,1])round(block,side*4.95,4.25,-5,.45,8.5,.6,m.blue,.12);round(block,0,8.5,-5,10.4,.6,.9,m.dark,.16);box(block,0,8.16,-4.52,9.5,.09,.04,m.cyan);sign(block,['BYTE CENTRAL','TRUST DISTRICT','NEON JUNCTION','SAFE ROUTE'][i/3],0,8.1,-4.45,3.6,.66,'#84efff','#10233b')}
  batch(block);
 }

 // Human cyber courier: undercut, visor, technical jacket and one augmented arm.
 const courier=group(scene,0,0,4),body=group(courier),hips=group(courier,0,1.25,0),legs=[],arms=[];
 courier.name='packet-courier';body.name='runner-torso';hips.name='runner-hips';
 round(body,0,1.52,0,.87,.91,.52,m.jacket,.2);round(body,0,1.09,0,.75,.2,.5,m.hood,.07);ball(body,0,1.98,-.04,.47,.26,.36,m.hood);ball(body,0,2.34,-.07,.36,.4,.33,m.skin);ball(body,0,2.52,-.03,.4,.27,.36,m.hair);
 for(let i=0;i<4;i++){const tuft=round(body,-.17+i*.12,2.65,-.06,.16,.33,.42,i<2?m.hairAccent:m.hair,.055);tuft.rotation.x=-.4;tuft.rotation.z=-.28}
 round(body,0,2.34,-.36,.67,.16,.09,m.dark,.04);round(body,0,2.35,-.415,.58,.065,.025,m.cyan,.015);
 for(let side of [-1,1]){const ear=cylinder(body,side*.365,2.32,0,.105,.07,m.armor);ear.rotation.z=Math.PI/2;box(body,side*.4,2.35,-.16,.035,.055,.38,m.cyan);box(body,side*.29,2.41,.28,.07,.045,.035,m.pink)}
 round(body,0,1.99,.1,.71,.28,.56,m.dark,.08);box(body,0,2.11,.4,.57,.035,.035,m.cyan);
 round(body,0,1.51,.39,.65,.72,.27,m.dark,.12);round(body,0,1.5,.55,.48,.5,.075,m.hood,.07);sign(body,'CQ',0,1.5,.6,.3,.25,'#8ffaff','#11293a');
 for(const side of [-1,1]){box(body,side*.24,1.51,.6,.025,.48,.026,m.cyan);round(body,side*.43,1.85,0,.29,.25,.55,side<0?m.jacket:m.armor,.08);box(body,side*.43,1.98,.08,.24,.025,.34,side<0?m.pink:m.cyan)}
 const coatTails=[-1,1].map(side=>{const panel=group(body,side*.25,1.07,.28);round(panel,0,-.16,0,.39,.4,.08,m.jacket,.035);box(panel,side*.14,-.16,.05,.028,.34,.015,side<0?m.pink:m.cyan);return panel});
 for(let side of [-1,1]){
  round(body,side*.3,1.55,.27,.08,.68,.09,m.armor,.025);
  const leg=group(hips,side*.22,0,0);leg.name=side<0?'runner-left-leg':'runner-right-leg';legs.push(leg);round(leg,0,-.25,0,.31,.6,.34,m.denim,.11);const shin=group(leg,0,-.48,0);leg.userData.shin=shin;round(shin,0,-.2,0,.28,.44,.32,m.denim,.09);
  round(leg,side*.17,-.2,.04,.07,.32,.25,m.jacket,.025);box(leg,side*.21,-.2,.14,.025,.25,.035,side<0?m.pink:m.cyan);round(shin,0,-.04,-.18,.25,.22,.09,m.armor,.035);
  const foot=group(shin,0,-.45,0);leg.userData.foot=foot;foot.name=side<0?'runner-left-foot':'runner-right-foot';
  round(foot,0,0,-.15,.43,.25,.69,m.shoe,.11);round(foot,0,-.1,-.14,.46,.12,.72,m.sole,.055);round(foot,0,.05,-.39,.34,.12,.22,m.sole,.05);for(let j=0;j<3;j++)box(foot,0,.1,-.12-j*.08,.29,.025,.028,m.cream);
  box(foot,0,-.07,.22,.35,.035,.035,m.cyan);box(foot,side*.22,-.07,-.14,.025,.035,.55,m.cyan);
  const arm=group(body,side*.52,1.8,0);arms.push(arm);round(arm,0,-.2,0,.29,.51,.31,side<0?m.jacket:m.armor,.1);const forearm=group(arm,0,-.38,0);arm.userData.forearm=forearm;round(forearm,0,-.16,0,.23,.37,.26,side<0?m.jacket:m.armor,.07);ball(forearm,0,-.36,0,.13,.16,.14,m.dark);box(forearm,0,-.16,.14,.055,.28,.025,m.cyan);if(side>0)for(let j=0;j<3;j++)box(forearm,0,-.04-j*.1,.15,.21,.025,.025,m.dark);forearm.rotation.x=-.55;
 }
 const scarf=round(body,-.35,1.93,.35,.14,.48,.045,m.pink,.02);scarf.rotation.x=.7;const playerShadow=shadow(scene,0,4,1.8,1.6);const ringGeo=new THREE.TorusGeometry(.8,.035,8,32);geometries.push(ringGeo);const aura=mesh(courier,ringGeo,m.mint,0,1.3,0,1,1.5,1);
 const coinGeo=new THREE.CylinderGeometry(.27,.27,.095,20);geometries.push(coinGeo);
 function entity(o){
  const root=group(scene);root.userData.entity=o;
  if(o.kind==='wall'){cyberAttack(root,o)}
  else if(o.kind==='byte'){
   const coin=group(root,0,o.high?2.7:1.08,0);const disk=mesh(coin,coinGeo,m.gold,0,0,0);disk.rotation.x=Math.PI/2;const rim=mesh(coin,coinGeo,m.warm,0,0,.048,.79,.25,.79);rim.rotation.x=Math.PI/2;round(coin,0,0,.072,.085,.3,.03,m.gold,.02);root.userData.spin=coin;
  }else if(o.kind==='check'){
   const pickup=group(root,0,1.6,0);root.userData.hover=pickup;round(pickup,0,0,0,.83,.98,.22,m.gold,.17);round(pickup,0,0,.13,.61,.73,.035,m.dark,.1);const a=round(pickup,-.12,-.09,.18,.11,.31,.04,m.mint,.025);a.rotation.z=.7;const b=round(pickup,.08,0,.18,.11,.5,.04,m.mint,.025);b.rotation.z=-.6;root.userData.cue=sign(root,o.label,0,2.52,.05,2.25,.42,'#ffe5a6','#3b3457');
  }else if(o.kind==='barrier'){
   // A real envelope silhouette makes the cyber hazard visible before its label.
   round(root,0,.69,0,2.02,1.04,.32,m.coral,.1);round(root,0,.69,.18,1.86,.89,.07,m.cream,.05);
   for(let side of [-1,1]){const flap=box(root,side*.43,.79,.235,.99,.055,.025,m.coral);flap.rotation.z=side*.55;const fold=box(root,side*.53,.49,.235,.75,.035,.025,m.coral);fold.rotation.z=-side*.45}
   const seal=round(root,0,.61,.27,.35,.35,.06,m.coral,.06);seal.rotation.z=Math.PI/4;sign(root,'!',0,.61,.31,.22,.26,'#fff0cb','#bd305c');
   root.userData.cue=sign(root,'↑ JUMP · '+o.label,0,1.63,0,2.65,.44,'#fff0b0','#7b405e');shadow(root,0,0,2.6,1.2);
  }else if(o.kind==='overhead'){
   for(let side of [-1,1])round(root,side*1.04,1.62,0,.2,3.24,.35,m.cream,.07);round(root,0,2.58,0,2.23,1.4,.55,m.violet,.12);box(root,0,1.9,.3,2.18,.12,.04,m.pink);sign(root,'MFA CODE THEFT',0,2.94,.32,1.95,.36,'#ffc5df','#493064');root.userData.cue=sign(root,'↓ SLIDE',0,2.4,.32,1.6,.4,'#f8e8ff','#493064');shadow(root,0,0,2.5,1.2);
  }else if(o.kind==='bot'){
   const bot=group(root,0,.72,0);root.userData.hover=bot;round(bot,0,0,0,1.1,.75,.7,m.violet,.2);round(bot,0,.02,.36,.85,.44,.08,m.dark,.12);for(let side of [-1,1]){const brow=box(bot,side*.23,.07,.43,.25,.07,.04,m.pink);brow.rotation.z=side*.34;round(bot,side*.66,0,0,.3,.25,.43,m.dark,.1);ball(bot,side*.64,-.08,0,.17,.09,.2,m.cyan)}root.userData.cue=sign(root,o.label,0,1.6,0,1.5,.32,'#ffc8de','#493064');shadow(root,0,0,1.8,1.2);
  }else if(o.kind==='gate'){
   for(let side of [-1,1]){round(root,side*4.1,3,0,.5,6,.6,m.cream,.12);box(root,side*3.82,3,.33,.07,5.7,.04,m.mint)}round(root,0,6,0,8.8,.5,.6,m.teal,.1);sign(root,'DELIVERY COMPLETE',0,5,0,5,.8,'#b4ffdb','#1d4f68');
  }else{
   const bait=round(root,0,1.12,0,.85,.85,.25,m.pink,.12);bait.rotation.z=Math.PI/4;root.userData.hover=bait;root.userData.cue=sign(root,'BAIT · DODGE',0,2,0,1.8,.37,'#ffe2ec','#7b405e');shadow(root,0,0,1.4,1);
  }
  if(root.userData.hover)root.userData.hover.userData.baseY=root.userData.hover.position.y;
  return root;
 }
 const sparks=[];for(let i=0;i<12;i++)sparks.push(ball(scene,0,-10,0,.045,.045,.045,i%2?m.gold:m.cyan));
 const footfalls=Array.from({length:6},()=>{const mat=new THREE.MeshBasicMaterial({color:'#d9c5aa',transparent:true,opacity:0,depthWrite:false});materials.push(mat);const puff=ball(scene,0,-10,0,.1,.06,.1,mat);puff.userData.born=-10;return puff});
 let disposed=false,lastSize='',previousScore=0,burstUntil=0,lastStep=-1;
 function resize(width,height){if(disposed)return;const k=width+':'+height;if(k===lastSize)return;lastSize=k;renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=width<height?68:52;camera.updateProjectionMatrix()}
 function releaseInstances(root){root.traverse(o=>{if(o.isInstancedMesh)o.dispose()})}
 function render(run){
  if(disposed)return;const t=run.elapsed,portrait=camera.aspect<1;chunks.forEach(block=>block.position.z=((block.userData.offset+(run.distance||0))%totalLength)-144);
  const live=new Set(run.entities.filter(o=>!o.collected&&o.y>-.5&&(o.kind==='wall'?o.y<.83+(o.length||10)/52+.23:o.y<1.16)));
  for(const [o,v] of entityMeshes)if(!live.has(o)){scene.remove(v);releaseInstances(v);entityMeshes.delete(o)}
  for(const o of live){let v=entityMeshes.get(o);if(!v){v=entity(o);entityMeshes.set(o,v)}v.position.set(o.kind==='gate'?0:(o.lane-1)*2.6,0,4+52*(o.y-.83));if(v.userData.spin)v.userData.spin.rotation.y=t*3.5;if(v.userData.hover)v.userData.hover.position.y=v.userData.hover.userData.baseY+Math.sin(t*4+(o.index||0))*.09;if(v.userData.cue)v.userData.cue.visible=o.y>.12&&o.y<.93}
  courier.position.set((run.visualLane-1)*2.6,run.jumpHeight*2.65,4);playerShadow.position.x=courier.position.x;playerShadow.scale.set(1.8-run.jumpHeight*.4,1.6-run.jumpHeight*.4,1);
  const slide=run.slideTime>0,air=run.jumpTime>0,phase=t*11,grounded=!slide&&!air;
  // Keep planted feet on the track. The recovery foot lifts behind the body,
  // then reaches forward; this avoids the old forward-bending, floating gait.
  body.position.y=slide?-.58:air?.23:.23+Math.abs(Math.sin(phase))*.05;
  body.position.x=grounded?Math.cos(phase)*.045:0;
  body.rotation.x=slide?-.65:air?-.12:-.18;
  body.rotation.z=(run.lane-run.visualLane)*-.24+(grounded?Math.cos(phase)*.045:0);
  body.rotation.y=grounded?Math.sin(phase)*.11:0;
  hips.position.y=1.02+body.position.y;
  legs.forEach((leg,i)=>{
   const q=(phase+i*Math.PI)%(Math.PI*2),stance=q<Math.PI;
   if(!grounded){leg.rotation.x=slide?1.15:(i===0?.85:-.25);leg.userData.shin.rotation.x=slide?-.55:(i===0?-1.3:-1.8);leg.userData.foot.rotation.x=.15;return}
   const progress=stance?q/Math.PI:(q-Math.PI)/Math.PI;
   const footZ=stance?-.36+.72*progress:.36-.72*progress;
   const footY=.4+(stance?0:Math.sin(progress*Math.PI)*.48);
   const down=hips.position.y-footY,upper=.48,lower=.45;
   const bend=-Math.acos(THREE.MathUtils.clamp((down*down+footZ*footZ-upper*upper-lower*lower)/(2*upper*lower),-1,1));
   const thigh=Math.atan2(-footZ,down)-Math.atan2(lower*Math.sin(bend),upper+lower*Math.cos(bend));
   leg.rotation.x=thigh;leg.userData.shin.rotation.x=bend;
   leg.userData.foot.rotation.x=-(thigh+bend)+(stance?0:-.3*Math.sin(progress*Math.PI));
  });
  arms.forEach((arm,i)=>{const swing=Math.sin(phase+i*Math.PI);arm.rotation.x=slide?.6:air?-1.1:-.25-swing*.95;arm.rotation.z=(i===0?-.18:.18);arm.userData.forearm.rotation.x=slide?.7:air?1.35:1.05+Math.max(0,swing)*.35});
  scarf.rotation.x=.95+Math.sin(phase*2)*.22;
  coatTails.forEach((panel,i)=>{panel.rotation.x=air?.6:.2+Math.sin(phase+i*Math.PI)*.18;panel.rotation.z=Math.sin(phase+i)*.07});
  const step=Math.floor(phase/Math.PI);if(grounded&&t>0&&step!==lastStep){const puff=footfalls[step%footfalls.length];puff.userData.born=t;puff.position.set(courier.position.x+(step%2?.22:-.22),.27,3.64)}lastStep=step;
  footfalls.forEach(puff=>{const age=t-puff.userData.born;puff.visible=age>=0&&age<.32;if(puff.visible){puff.material.opacity=.32*(1-age/.32);puff.position.z+=Math.max(0,t-(puff.userData.lastTime??t))*8.84;puff.scale.set(.1+age*.5,.045+age*.17,.13+age*.7)}puff.userData.lastTime=t});
  aura.visible=!!run.guard||run.pulse>0;courier.visible=run.invulnerable<=0||Math.sin(t*26)>-.35;
  if(run.score>previousScore)burstUntil=t+.45;previousScore=run.score;sparks.forEach((v,i)=>{v.visible=t<burstUntil;const age=.45-(burstUntil-t),a=i*Math.PI/6;v.position.set(courier.position.x+Math.cos(a)*(age*2+.4),1.1+Math.sin(a)*age*2,4+Math.cos(a*2)*age*1.8)});
  camera.position.set((run.visualLane-1)*.16,portrait?5.15:4.85,portrait?13.1:12.1);camera.lookAt((run.visualLane-1)*.07,1.15,-12);renderer.render(scene,camera);
 }
 function dispose(){if(disposed)return;disposed=true;releaseInstances(scene);entityMeshes.clear();geometries.forEach(v=>v.dispose());materials.forEach(v=>v.dispose());textures.forEach(v=>v.dispose());renderer.dispose();renderer.forceContextLoss()}
 return {canvas,render,resize,dispose};
}
