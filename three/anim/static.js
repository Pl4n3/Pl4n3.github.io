//---
function initAnimScript() {
  //...
  var sc=0.01,y0=-180,rot=true;
  console.log('Anim v.'+version+'static 0.43 ');//FOLDORUPDATEVERSION
  version='Fly around with\nwasd/cursorkeys.';
  addView({w:1,h:1,x:0,y:0,bg:1,autoRotate:1,fov:60,bgcol:0x666666,vr:1,
    hudar:0.16,hudx:0.1,hudy:-0.1,hudres:256,
  hudRender:function(ct) {
    ct.font='17px sans-serif';
    ct.fillText('R key -> toggle rotation',2,2);
    ct.fillText('WASD/cursorkeys -> fly around',2,18);
  }
  
  });
  resize();
  
  box(0,-1.9,0,6,0.2,6,m0).castShadow=false;
  
  loadObjsThenLoop([
  {fn:'/canvas/w3dit/churchJpg.txt',pos:new THREE.Vector3(0,-1.8,0),scale:0.004,ai:function(dt) {
    if (keys[82]) {
      rot=!rot;
      keys[82]=false;
    }
    if (rot) base.rotation.y+=0.001*dt;
  }
  },
  ]);
  
  base.position.set(0,0.6,-2.2);
  views[0].camera.rotation.x=-0.3;
}
initAnimScript();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,6
//fr o,1,14
//fr p,17,11
