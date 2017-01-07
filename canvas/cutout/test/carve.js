var appt=0;
game={
init:function(ps) {
  
  //var ma=ps.ma;
  //ma.push(mlog={s:'<b>Log:</b>',px:0.02,py:0.02,pw:0.4,ph:0.5,noinp:true,fs:0.05,log:true});
  
  
  //var s=(isGl?2:1);
  //load({fn:'paint/cat',xp:0,yp:240*s,xsp:s,ysp:s,iw:1024,onload:oledit});
  //load({fn:'paint/lizard',xp:0,yp:240,xsp:1,ysp:1,iw:512,onload:oledit});
  //s*=0.8;load({fn:'paint/monalisa',xp:0,yp:-385*s,xsp:s,ysp:s,iw:1024,onload:oledit});
  var s=1.5;
  log('simple.init 0');
  //load({fn:'paint/ast',xp:0,yp:0,xsp:s,ysp:s,iw:512,rawData:
  //{"rects":[{"x":49,"y":22,"w":282,"h":94,"cx":89,"cy":66}//,"ps":[{"x":295,"y":67}]}
  ////,{"x":99,"y":171,"w":151,"h":76,"cx":111,"cy":214}
  //],"bones":[{"i":0,"p":-1,"pp":-1,"z":0}
  //]}
  var carves=[
    {"p0":{"x":0.39121,"y":0.89939,"r":0.05865},"p1":{"x":0.54762,"y":0.89939,"r":0.0391},"pd":{"x":0.21506,"y":0.01955},"bo":0.00978,"dabs":0},
    {"p0":{"x":0.54762,"y":0.89939,"r":0.0391},"p1":{"x":0.74312,"y":0.87984,"r":0.02933},"pd":{"x":0.21506,"y":0.21506},"bo":0.00978,"dabs":0.00978},
    {"p0":{"x":0.74312,"y":0.87984,"r":0.02933},"p1":{"x":0.86043,"y":0.87007,"r":0.02933},"pd":{"x":0.21506,"y":0.41057},"bo":0.00978,"bbo":0,"dabs":0}
  ];
  
  
  function filterCarve(d,p) {
    var id=p.id_;
    for (var i=0;i<carves.length;i++) carve(id,carves[i]);
    //carve(id,{"p0":{"x":0.39121,"y":0.89939,"r":0.05865},"p1":{"x":0.54762,"y":0.89939,"r":0.0391},"pd":{"x":0.21506,"y":0.01955},"bo":0.00978,"dabs":0});
    //carve(id,{"p0":{"x":0.54762,"y":0.89939,"r":0.0391},"p1":{"x":0.74312,"y":0.87984,"r":0.02933},"pd":{"x":0.21506,"y":0.21506},"bo":0.00978,"dabs":0.00978});
    //carve(id,{"p0":{"x":0.74312,"y":0.87984,"r":0.02933},"p1":{"x":0.86043,"y":0.87007,"r":0.02933},"pd":{"x":0.21506,"y":0.41057},"bo":0.00978,"bbo":0,"dabs":0});
    
  }
  
  var rawData=
  {"rects":[
  //{"x":111,"y":11,"w":129,"h":59,"cx":140,"cy":40},
  //{"x":111,"y":111,"w":134,"h":44,"cx":130,"cy":135},
  //{"x":111,"y":211,"w":89,"h":34,"cx":126,"cy":230}
  ],"bones":[
  {i:0,p:-1},//{i:0,p:-1,z:0,xs:1,ys:1,a:0,x:0,y:0},//{i:0,p:0,z:0,xs:s0,ys:s0,a:0,x:80,y:0}
  {i:1,p:0},//{i:1,p:0,z:0,xs:1,ys:1,a:0,x:80,y:0},
  {i:2,p:1}//{i:2,p:1,z:0,xs:1,ys:1,a:0,x:100,y:-10}
  //,{i:1,p:0,a:0.5},{i:2,p:3}
  ]};
  
  var ih=512;
  for (var i=0;i<carves.length;i++) {
    var ps=carves[i],p0=ps.p0,p1=ps.p1,
        pd=ps.pd,xd=Math.floor(pd.x*ih),yd=Math.floor(pd.y*ih),
        xmin=Math.floor(Math.min(p0.x-p0.r,p1.x-p1.r)*ih),
        ymin=Math.floor(Math.min(p0.y-p0.r,p1.y-p1.r)*ih),
        xmax=Math.floor(Math.max(p0.x+p0.r,p1.x+p1.r)*ih),
        ymax=Math.floor(Math.max(p0.y+p0.r,p1.y+p1.r)*ih)
        ps0=i==0?undefined:carves[i-1];
    var r,b;
    rawData.rects.push(r={x:xd+1,y:yd+1,w:xmax-xmin-1,h:ymax-ymin-1,cx:p0.x*ih-xmin+xd,cy:p0.y*ih-ymin+yd});
    //rawData.bones.push(b={i:i,p:i-1,z:0,xs:1,ys:1,a:0,x:(i==0?0:(ps0.p1.x-ps0.p0.x)*ih),y:(i==0?0:(ps0.p1.y-ps0.p0.y)*ih)});
    //console.log(JSON.stringify(b));
    //console.log('from carves, x:'+(xd+1)+' y:'+(yd+1)+' w:'+(xmax-xmin-1)+' h:'+(ymax-ymin-1)
    //  +' cx:'+(Math.floor(p0.x*ih)-xmin+xd)+' cy:'+(Math.floor(p0.y*ih)-ymin+yd)
    //  +' nx:'+Math.floor(0.5+(p1.x-p0.x)*ih)+' ny:'+Math.floor(0.5+(p1.y-p0.y)*ih)
    //  );
  }
  for (var i=0;i<rawData.bones.length;i++) {
    var b=rawData.bones[i];
    b.a=b.a||0;b.xs=b.xs||1;b.ys=b.ys||1;b.z=b.z||0;
    if (b.p!=-1) {
      var c=carves[b.i],cp=carves[rawData.bones[b.p].i];
      b.x=(c.p0.x-cp.p0.x)*ih;b.y=(c.p0.y-cp.p0.y)*ih;
    } else {
      b.x=0;b.y=0;
    }
  }
  
  var s0=0.6;
  var img=load({fn:'cutout/horatii__',xp:-150,yp:-50,xsp:s,ysp:s,iw:512,filterOnce:1,filter:filterCarve,rawData:rawData});
  //console.log(img);
  var m=new Vecmath.Mat3();m.setIdentity();
  var se={img:img,a:0,x:0,y:0,x0:256,y0:256,m:m,z:-1,xs:1.25,ys:1.25};//,iw:512,ih:512});
  segs.push(se);seg0.segs.push(se);
  
  log('simple.init 1 segs.length='+segs.length);
}
,calc:function() {
  //if (false)
  //if (segs.length>0)
  appt+=dt;
  for (var i=segs.length-1;i>=1;i--) {
    var s=segs[i];
    if (s.oa===undefined) s.oa=s.a;
    segs[i].a=s.oa+Math.sin(appt*0.001*(i));
  }
  //if (appt<500) console.log(segs[0]);
}
};
loaded();
//fr o,2
//fr o,2,23
//fr o,3
//fr p,2,44
