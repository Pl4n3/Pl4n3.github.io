//---
let pd5Verts=(function () {
  //onsole.log('pd5Verts loaded !!1');
  //let self={};
  let self={what:'pd5Verts 0.59 '},//FOLDORUPDATEVERSION
      editxr,pts=[],uds=[],//uds=userData array, needed with onchange
      o5,p0,f,editPoint;
  console.log(self.what);
  
  self.init=function(ps) {
    //---
    //onsole.log('pPd5Verts.init');
    //onsole.log(ps);
    editxr=ps.editxr;
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
    //onsole.log('onchange i='+i+' ps.x='+ps.x);
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
      return;
    }
    //onsole.log('pd5Verts.toggle');
    console.log(ps);
    o5=ps.selected.o5;//---ps.selected is pointMesh.userData
    editPoint=o5.meshes[0].tmesh.userData.editPoint;
    delete(o5.meshes[0].tmesh.userData.editPoint);
    p0=ps.selected.op;
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
//fr o,1,7
//fr o,1,9
//fr o,1,11
//fr o,4
//fr p,28,34
