//----
(function() {
  //---
  let what='Action v.0.16 ';//FOLDORUPDATEVERSION
  
  function calc(ps) {
    //---
    let p0=ps.p0,p1=ps.p1,op=ps.op,
        fore=ps.fore,turna=ps.turna;
    
    let dx=p0.x-p1.x,
        dy=p0.y-p1.y,
        dz=p0.z-p1.z;
    let d2=dx*dx+dy*dy+dz*dz;
    if (!(op.aiReact&&(d2>op.aiReact))) {
      turna=Math.atan2(dy,dx)+Math.PI/2;
      if (op.aiApproach) { 
        //let d2=dx*dx+dy*dy+dz*dz;
        //console.log('aiApproach d2='+d2); 
        if (d2>op.aiApproach) fore=true;
      }
    }
    
    ps.fore=fore;
    ps.turna=turna;
    //...
  }
  
  window.w3ditScriptInit({initf:function (ps) {
    //---
    ps.editxr.action={calc:calc};
    //...
  }
  ,what:what});
  //...
}
)();
//----
//fr o,1
//fr o,1,3
//fr o,1,5
//fr p,5,29
