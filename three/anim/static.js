//---
function initAnimScript() {
  //...
  var sc=0.01,y0=-180,vr=url.vr!=0,rot=true;
  console.log('Anim v.'+version+'static 0.85 ');//FOLDORUPDATEVERSION
  version='Fly around with\nwasd/cursorkeys.';
  var vh={w:1,h:1,x:0,y:0,bg:1,autoRotate:1,fov:60,bgcol:0x666666,vr:1,
    hudar:0.16,hudx:0.1,hudy:-0.1,hudres:256,fovportrait:1,
  hudRender:function(ct) {
    ct.font='17px sans-serif';
    ct.fillText('R key -> toggle rotation',2,2);
    ct.fillText('WASD/cursorkeys -> fly around',2,18);
  }
  };
  if (!vr) {
    rot=false;
    vh.vr=0;vh.autoRotate=0;
    vh.target=new THREE.Vector3(0,-1.2,0);
    vh.cam=new THREE.Vector3(0,-1.2,2);
  }
  addView(vh);
  resize();
  
  base.add(new THREE.AmbientLight(0x999999));
  pointLight({x:3,y:3,z:3,col:0xffffff,dist:10,int:2.5});
  var l=new THREE.PointLight(0xaaffff,1,0);l.position.set(3,-6,-3);base.add(l);
  
  //if (0) {
    box(0,-1.9,0,6,0.2,6,m0).castShadow=false;
  if (0) {
    var bs=[[0,0,0],[-1,0,0],[-2,0,0],[0,0,1],[-1,0,1],[-2,0,1],[0,-1,0],[-1,-1,0],[-2,-1,0]];
    for (var i=0;i<bs.length;i++) {
      var b=bs[i];
      box(-0.8+b[0]*0.1,-1.5+b[1]*0.1,b[2]*0.1,0.1,0.1,0.1,m1).castShadow=false;
    }
  }
  loadObjsThenLoop([
  {fn:'/canvas/w3dit/churchJpg.txt',pos:new THREE.Vector3(0,-1.8+0.001,0),scale:0.004,ai:function(dt) {
    if (keys[82]) {
      rot=!rot;
      keys[82]=false;
    }
    if (rot) base.rotation.y+=0.001*dt;
  }
  },
  ]);
  
  if (vr) {
    base.position.set(0,0.6,-2.2);
    views[0].camera.rotation.x=-0.3;
  }
}
initAnimScript();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,6
//fr o,1,31
//fr p,52,24
