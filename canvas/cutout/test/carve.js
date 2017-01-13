var appt=0;
game={
init:function(ps) {
  
  var edito,obones,selp,selc,
      carves=[];//carves is a clone of rawData.carves without temp carv-variables (xmin,..)
  
  var rawData=urls.rawData?JSON.parse(atob(urls.rawData)):(0?{
  carves:[selc={p0:selp={x:0.5,y:0.5,r:0.1},p1:{x:0.7,y:0.7,r:0.05},bo:0.01,dabs:0}],
  bones:[{i:0,p:-1,x:150,y:50}]
  }:{
  carves:[
    {"p0":{"x":0.39121,"y":0.89939,"r":0.05865},"p1":{"x":0.54762,"y":0.89939,"r":0.0391},"bo":0.00978,"dabs":0},//,"pd":{"x":0.21506,"y":0.01955}
    {"p0":{"x":0.54762,"y":0.89939,"r":0.0391},"p1":{"x":0.74312,"y":0.87984,"r":0.02933},"bo":0.00978,"dabs":0.00978},//,"pd":{"x":0.21506,"y":0.21506}
    {"p0":{"x":0.74312,"y":0.87984,"r":0.02933},"p1":{"x":0.86043,"y":0.87007,"r":0.02933},"bo":0.00978,"bbo":0,"dabs":0}//,"pd":{"x":0.21506,"y":0.41057}
  ],
  
  "bones":[
  {i:0,p:-1},//{i:0,p:-1,z:0,xs:1,ys:1,a:0,x:0,y:0},//{i:0,p:0,z:0,xs:s0,ys:s0,a:0,x:80,y:0}
  {i:1,p:0},//{i:1,p:0,z:0,xs:1,ys:1,a:0,x:80,y:0},
  {i:2,p:1}//{i:2,p:1,z:0,xs:1,ys:1,a:0,x:100,y:-10}
  //,{i:1,p:0,a:0.5},{i:2,p:3}
  ]});
  
  //arvesToRect(rawData);
  
  var s0=0.6;
  var img;
  function loadCarvO() {
    var b0=rawData.bones[0],sc=1.5;
    img=load({fn:urls.img||'cutout/horatii__',xp:b0.x||-150,yp:b0.y||-50,xsp:sc,ysp:sc,iw:512//,filterOnce:1,filter:filterCarve
      ,rawData:rawData,
    onparse:function(o) {
      var s='';
      for (var i=0;i<o.bones.length;i++) {
        s+=(i==0?'[':',')+'\n'+JSON.stringify(o.bones[i]);
      }
      s+='\n]';
      carves=JSON.parse(JSON.stringify(o.carves));
      obones=s;//JSON.stringify(o.bones);//,undefined,' ');
    }
    ,onload:function(o) {
      vis(o);
      edito=o;//console.log(o);
    }
      });
    
    //...
  }
  
  loadCarvO();
  //console.log(img);
  var m=new Vecmath.Mat3();m.setIdentity();
  var sc=1.2;
  var se={img:img,a:0,x:0,y:0,x0:256,y0:256,m:m,z:-1,xs:sc,ys:sc};//,iw:512,ih:512});
  
  se.canvDraw=function(ct) {
    var s=512*seg0.xs;//carves=rawData.carves;
    ct.strokeStyle='#fff';
    //ct.strokeRect(0,0,255*s,255*s);
    for (var i=0;i<carves.length;i++) {
      var c=carves[i];
      ct.strokeStyle=selp==c.p0?'#ff0':'#fff';
      ct.beginPath();
      ct.arc((c.p0.x-0.5)*s,(c.p0.y-0.5)*s,c.p0.r*s,0,360);
      ct.stroke();
      ct.strokeStyle=selp==c.p1?'#ff0':'#fff';
      ct.beginPath();
      ct.arc((c.p1.x-0.5)*s,(c.p1.y-0.5)*s,c.p1.r*s,0,360);
      ct.stroke();
      ct.strokeStyle=selc==c?'#ff0':'#fff';
      ct.beginPath();
      ct.moveTo((c.p0.x-0.5)*s,(c.p0.y-0.5)*s);
      ct.lineTo((c.p1.x-0.5)*s,(c.p1.y-0.5)*s);
      ct.stroke();
      ct.fillStyle=ct.strokeStyle;
      ct.fillText(''+i,(c.p0.x-0.5)*s,(c.p0.y-0.5)*s-2);
    }
    
  }
  segs.push(se);seg0.segs.push(se);
  
  function fr(v) {
    return Math.floor(0.5+v*10000)/10000;
  }
  function dist(ax,ay,bx,by) {
    var dx=bx-ax,dy=by-ay;
    return dx*dx+dy*dy;
  }
  game.cdown=function(e) {
    //Conet.log('cdown '+nx/sc+' '+ny/sc+' '+seg0.xs);
    var mx=0.5+nx/(512*sc),my=0.5+ny/(512*sc);
        //carves=rawData.carves;
    if (e.button==2) {
      if (selp) {
        selp.x=fr(mx);selp.y=fr(my);
      }
    } else if (e.button==1) {
      if (selp) {
        selp.r=fr(Math.sqrt(dist(mx,my,selp.x,selp.y)));
      }
    } else {
      var mind=Number.MAX_VALUE,minp,minc,d;
      for (var i=carves.length-1;i>=0;i--) {
        var c=carves[i];
        d=dist(mx,my,c.p0.x,c.p0.y);if (d<mind) { mind=d;minp=c.p0;minc=c; }
        d=dist(mx,my,c.p1.x,c.p1.y);if (d<mind) { mind=d;minp=c.p1;minc=c; }
      }
      selp=minp;selc=minc;
    }
    //console.log(e);
  }
  
  ps.ma.push({s:'Recarve',fs:1.4,actionf:function() {
    hide(edito);
    //og('Recarve nao.');
    rawData.carves=carves;
    rawData.bones=JSON.parse(obones);
    loadCarvO();
  }
  });
  ps.ma.push({s:'Carves',fs:1.35,sub:[{s:'Add',fs:1.4,
  actionf:function() {
    carves.push(selc={p0:selp={x:0.5,y:0.5,r:0.1},p1:{x:0.7,y:0.7,r:0.05},bo:0.01,dabs:0});
    //log('add nao');
  }
  },{s:'Del',fs:1.4,
  actionf:function() {
    log('del nao');//...
  }
  },{s:'Black<br>Border..',fs:0.9,doctrl:'0 none, empty default',
  valuef:function() {
    if (!selc) return undefined;
    return selc.bbo===undefined?'':selc.bbo;
  }
  ,setfunc:function(v) {
    if (v.length==0) delete(selc.bbo); else selc.bbo=parseFloat(v);
  }
  }
  
  ]});
  ps.ma.push({s:'Bones..',fs:1.4,doctrl:'Bone structure',ta:true,tacols:40,tarows:15,
  valuef:function() {
    return obones;
  }
  ,setfunc:function(s) {
    obones=s;
    //now show if not parseable sth stuff doesnt blow up on recarve
    try {
    JSON.parse(s);
    } catch (e) { alert(''+e); }
  }
  });
  
  ps.ma[0].sub.push({s:'Export',ms:'Json',fs:1.4,doctrl:'Cutout',ta:true,tacols:40,tarows:15,
  valuef:function() {
    var s='{"carves":'+JSON.stringify(carves)+',\n"bones":';
    s+=obones+'}';
    return s;
  }
  ,setfunc:function(s) {
    //---
  }
  });
  
  ps.ma[0].sub.push({s:'Export',ms:'Url',wrap:1,fs:1.4,doctrl:'Cutout',ta:true,tacols:40,tarows:15,
  valuef:function() {
    var s='{"carves":'+JSON.stringify(carves)+',\n"bones":';
    s+=obones+'}';
    urls.rawData=btoa(s);
    s='';
    for (var k in urls) if (urls.hasOwnProperty(k)) s+=(s.length>0?'&':'')+k+'='+urls[k];
    var durl=document.URL,i=durl.indexOf('?');
    return durl.substr(0,i+1)+s;
  }
  ,setfunc:function(s) {
    //---
  }
  });
  
}
,calc:function() {
  //if (false)
  //if (segs.length>0)
  appt+=dt;
  for (var i=segs.length-1;i>=1;i--) {
    var s=segs[i];
    //if (i==1) segs[0].img=segs[i].img;
    if (s.oa===undefined) s.oa=s.a;
    segs[i].a=s.oa+Math.sin(appt*0.001*(i));
  }
  //if (appt<500) console.log(segs[0]);
}
,drawCanv:function(ct) {
  var w=200;
  if (segs.length>1) ct.drawImage(segs[1].img,0,0,w,w);
  ct.strokeStyle='#000';ct.strokeRect(0,0,w,w);
  
}

};
loaded();
//fr o,2
//fr o,2,25
//fr o,2,25,3
//fr o,2,33
//fr o,2,36
//fr o,2,38
//fr o,2,40
//fr o,2,43
//fr o,2,47
//fr o,2,48
//fr o,2,58
//fr o,2,63
//fr o,3
//fr o,4
//fr p,58,7
