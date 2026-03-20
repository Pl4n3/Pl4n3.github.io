//---
let pd5Verts=(function () {
  //onsole.log('pd5Verts loaded !!1');
  //let self={};
  let self={what:'pd5Verts 0.112 '},//FOLDORUPDATEVERSION
      editxr,xrUtil,pts=[],
      uds=[],//uds=userData array, needed with onchange
      o5,p0,f,editPoint,oldUi,button,oldy,muv,buttons;
  console.log(self.what);
  
  self.init=function(ps) {
    //---
    //onsole.log('pPd5Verts.init');
    //onsole.log(ps);
    editxr=ps.editxr;
    xrUtil=ps.xrUtil;
    button=ps.button;
    buttons=xrUtil.hud.buttons;
    //...
  }
  
  function onchange(ps) {
    //---
    //console.log(ps);
    //onsole.log(this);
    let i=uds.indexOf(this);
    let v=o5.verts[i].p0;
    v.x=(ps.x-p0.x)/f;
    v.y=(ps.y-p0.y)/f;
    v.z=(ps.z-p0.z)/f;
    //o5.calcVertNorms=1;//--- is already set
    
    //onsole.log('onchange i='+i+' ps.x='+ps.x);
    //...
  }
  
  function drawUv() {
    //---
    let ct=xrUtil.hud.ct,c=xrUtil.hud.c,wi=c.width,he=c.height;
    //ct.fillStyle='#f00';
    //ct.fillRect(muv.x*wi,muv.y*he,muv.w*wi,muv.h*he);
    ct.strokeStyle='rgba(0,255,0,0.5)';
    ct.beginPath();
    
    let m=o5.meshes[0];
    for (let t of m.fa) {
      let x0=muv.x*wi+t.v0.u*muv.w*wi,
          y0=muv.y*he+t.v0.v*muv.h*he,
          x1=muv.x*wi+t.v1.u*muv.w*wi,
          y1=muv.y*he+t.v1.v*muv.h*he,
          x2=muv.x*wi+t.v2.u*muv.w*wi,
          y2=muv.y*he+t.v2.v*muv.h*he;
      ct.moveTo(x0,y0);
      ct.lineTo(x1,y1);
      ct.lineTo(x2,y2);
      ct.lineTo(x0,y0);
    }
    ct.stroke();
    //onsole.log(o5.verts[0]);
    //...
  }
  
  self.toggle=function(ps) {
    //---
    if (pts.length>0) {
      for (let p of pts) editxr.pointRemove(p);
      pts.length=0;uds.length=0;
      o5.meshes[0].tmesh.userData.editPoint=editPoint;
      editxr.select();//---remove selection
      editxr.rayObjsReset();
    
      let i=buttons.indexOf(muv);
      buttons.splice(i,1);
      button.y=oldy;  
      for (let b of oldUi) buttons.push(b);
      return;
    }
    //onsole.log('pd5Verts.toggle');
    //onsole.log(ps);
    o5=ps.selected.o5;//---ps.selected is pointMesh.userData
    console.log(o5);
    editPoint=o5.meshes[0].tmesh.userData.editPoint;
    delete(o5.meshes[0].tmesh.userData.editPoint);
    //p0=ps.selected.op;
    p0=ps.pointMesh.position;
    //onsole.log(p0);
    //for (let i=0;i<10;i++) pts.push(editxr.pointAdd({x:i*0.05+p0.x,y:p0.y,z:p0.z,noSerialze:1}));
    f=0.01;
    for (let v of o5.verts) {
      //onsole.log(v.p0);
      let p=v.p0,pn;
      pts.push(pn=editxr.pointAdd({
        x:p.x*f+p0.x,
        y:p.y*f+p0.y,
        z:p.z*f+p0.z,
        noSerialze:1
      }));
      pn.userData.onchange=onchange;
      uds.push(pn.userData);
    }
    editxr.rayObjsReset();
    
    //oldUi=xrUtil.hudRemove({x:0.04,y:0.54,w:0.54,h:0.27});
    oldy=button.y;button.y=0.2;
    oldUi=xrUtil.hudRemove({x:0.04,y:0.50,w:0.64,h:0.5});
    buttons.push(muv={_s:'uv',x:0.04,y:0.31,w:0.65,h:0.65,ondraw:drawUv});
    //...
  }
  
  return self;
}
)();

let test0=function(ps) {
  //---
  console.log('test0 ps='+ps);
  //...
}

export { pd5Verts,test0 };
//...
//fr o,1
//fr o,1,8
//fr o,1,10
//fr o,1,12
//fr o,1,14
//fr o,4
//fr p,0,44
