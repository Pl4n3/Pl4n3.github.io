//---
function initAnimScript() {
  //...
  addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(250,-10,50),bg:1,
    target:new THREE.Vector3(0,-40,50),fov:50,bgcol:0x666666});
  if (1) {
  addView({w:0.9,h:0.45,x:0.05,y:0.03,bw_:'5px',cam:new THREE.Vector3(-60,30,60),
    target:new THREE.Vector3(-30,30,-30),fov:20,bgcol:0x444444});
  addView({w:0.9,h:0.45,x:0.05,y:0.5,bw_:'5px',cam:new THREE.Vector3(-53,30,-90),
    target:new THREE.Vector3(-30,30,-30),fov:20,bgcol:0x444444});
  }
  resize();
  //if (0) {
  
  
  
  loopAfterLoaded=2;
  Conet.download({fn:'../shooter/objs/templar/dialog.txt',pos:new THREE.Vector3(-30,-140,-80),f:oonload,
   anim:'stand2',scale:0.0775,ohkey:'templar'});
  Conet.download({fn:'../shooter/objs/bot/dialog.txt',pos:new THREE.Vector3(-30,-140,20),f:oonload,
   anim:'stand',scale:0.29,ohkey:'bot'});
  
  scra=[
  {t:1000,f:function() {
    threeEnv.dtscale=1;
    anim('templar','speak');
    anim('bot','stand');
    //o=oh.bot;    Pd5.animStart(o,o.animh.disagree);
    viewText(1,'Java is to Javascript');
    //viewText(2,'');
    //console.log('... '+this.t);
  }
  },{t:1500,f:function() {
    viewText(1,'as Car is to Carpet!');
  }
  },{t:500,f:function() {
    anim('bot','disagree');//var o=oh.bot;    Pd5.animStart(o,o.animh.disagree);
    //viewText(2,'');
    //...
  }
  },{t:1000,f:function() {
    //var o;
    //o=oh.templar;Pd5.animStart(o,o.animh.stand2);
    //o=oh.bot;    Pd5.animStart(o,o.animh.stand);
    threeEnv.dtscale=0.2;
    anim('templar','stand2');
    //anim('bot','stand');
    viewText(1,'');
    //console.log('--> '+this.t);
  }
  },{t:1000,f:function() {
    threeEnv.dtscale=1;
    anim('templar','stand2');
    anim('bot','speak');
    viewText(2,'As Ham is to Hamster!');
    //...
  }
  },{t:500,f:function() {
    anim('templar','disagree');
  }
  },{t:1000,f:function() {
    threeEnv.dtscale=0.2;
    anim('bot','stand');
    viewText(2,'');
  }
  },{t:1000,f:function() {
    threeEnv.dtscale=1;
    anim('templar','speak');
    anim('bot','stand');
    viewText(1,'As Pain is to Painting!');
  }
  },{t:500,f:function() {
    anim('bot','disagree');//...
  }
  },{t:1000,f:function() {
    threeEnv.dtscale=0.2;
    anim('templar','stand2');
    viewText(1,'');
  }
  },{t:1000,f:function() {
    threeEnv.dtscale=1;
    anim('templar','hit');
    anim('bot','hit');
    //...
  }
  },{t:2000,f:function() {
    threeEnv.dtscale=0.2;
    //...
  }
  }];
  
  //...
}
initAnimScript();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,21
//fr o,1,22
//fr o,1,23
//fr o,1,24
//fr o,1,25
//fr o,1,26
//fr o,1,27
//fr o,1,28
//fr o,1,29
//fr o,1,30
//fr o,1,31
//fr o,1,32
//fr p,6,85
