//---
(function () {
  planim.tripod=function(h) {
    //...
    //return {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(0,-1.8,0),health:5
    // ,anim:'idle',scale:2,animRun:'run',animAttack:'attack',animHit:'hit',animDead:'dead',v:0.003*1,roty:-2,collr:0.5,hitr:1.5,attackr:0.75,
    // randomWalk:true,_ap:0.1,distUnfocus:60,aFocus:0.5};
     
    var o={fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(0,-1.8,0),health:5
      ,anim:'idle',scale:2,animRun:'run',animAttack:'attack',animHit:'hit',animDead:'dead',v:0.003
      ,collr:0.5,hitr:1.5,attackr:0.75
      ,bb:0,bby:1.5,bbtransp:1,randomWalk:false,distUnfocus:60,aFocus:0.5};
    
    //if (h.scaler) o.scale*=h.scaler; 
    //return h?Conet.hcopy(h,o):o;
    return planim.objCopy(h,o);
    //...
  }
  ;
  planim.templar=function(h) {
    //...
    var o={fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,-1),health:5
      ,anim:'stand2',animIdle:'stand2',scale:2,animRun:'run',animAttack:'attack2',animHit:'hit',animDead:'lost',v:0.006//,ego:1
      ,vrot:0.02
      ,collr:0.5,hitr:1
      //,collr:0.5,hitr:1.5,attackr:0.75
      ,bb:0,bby:1.8//,bbtransp:1 210329 comment out, in deep8 bb wasnt reordered with it
      ,psSize:0.75
      
      ,bbysc:0.85,orbitCenter:0.5,xw:1,yw:2,zw:1,ap:1//deep8
      
      };
      
    //if (h.scaler) o.scale*=h.scaler; 
    //return h?Conet.hcopy(h,o):o;
    return planim.objCopy(h,o);
    //...
  }
  ;
  planim.templarArch=function(h) {
    var o=planim.templar(h);
    //o.fn='/shooter/objs/templar/arch.txt';
    //o.ar=6;o.arMin=3;
    Conet.hcopy({fn:'/shooter/objs/templar/arch.txt',ar:5,arMin:3},o);//ar:6
    return o;
    //...
  }
  
  
  planim.bane=function(h) {
    
    return planim.objCopy(h,{fn:'/shooter/objs/bane/o5.txt',pos:new THREE.Vector3(8,-1,-1),v:0.015,vrot:0.001,animIdle:'stand',animRun:'run'
    ,rotofs:Math.PI/2,scale:0.34,roty:0,//ai:ai,wpRand:1,running:1,noEgo:1
    });
    
    
    //...
  }
  
  console.log('AnimObjs 0.48 ');//FOLDORUPDATEVERSION
  //...
}
)();
//---
//fr o,1
//fr o,1,0
//fr o,1,2
//fr o,1,4
//fr o,1,7
//fr p,72,43
