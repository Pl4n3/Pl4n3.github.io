//---
var CanvNotes=function(gps) {
  //---
  var logs=[],ot,canvas,cont,width,height,tparts=[],first=true,
      canv,fpst=0,fpsc=0,fpss='',dpr=1,objs=[],oinp={},
      view={posx:0,posy:0,scx:1,scy:1},sels=[],movedist=0,self=this,
      tweens=[],mautolayout,mtime,mdown,//,mdrag;
      arrow=[[0,-0.3],[0.7,-0.3],[0.7,-0.6],[1,0],[0.7,0.6],
      [0.7,0.3],[0,0.3]//,[0,-0.3]
      ],images={},grid=2,scripts={},handlers={};
  
  self.selCount=3;
  //---- --
  function log(s) {
    logs.splice(0,0,s);
    while (logs.length>50) logs.pop();
  }
  function dist(x0,y0,x1,y1) {
    var dx=x1-x0,dy=y1-y0;
    return Math.sqrt(dx*dx+dy*dy);
    //...
  }
  function round(f) {
    return Math.floor(f+0.5);
    //...
  }
  function tween(o,h) {
    //---
    //if (!o.intern) o.intern={};
    var op=o.intern.origpos;
    if (op) {
      //o.x=op.x;o.y=op.y;
      //tweens.push({o:o,t:0,mt:500,p0:{x:o.x,y:o.y},p1:{x:op.x,y:op.y}});
      if (h.x!==undefined) tweens.push({o:o,t:0,mt:500,k:'x',v0:o.x,v1:op.x});
      if (h.y!==undefined) tweens.push({o:o,t:0,mt:500,k:'y',v0:o.y,v1:op.y});
      if (h.w!==undefined) tweens.push({o:o,t:0,mt:500,k:'w',v0:o.w,v1:op.w});
      if (h.h!==undefined) tweens.push({o:o,t:0,mt:500,k:'h',v0:o.h,v1:op.h});
      delete(o.intern.origpos);
    } else {
      o.intern.origpos={x:o.x,y:o.y,w:o.w,h:o.h};
      //o.x+=h.x;o.y+=h.y;
      //tweens.push({o:o,t:0,mt:500,p0:{x:o.x,y:o.y},p1:{x:o.x+h.x,y:o.y+h.y}});
      if (h.x!==undefined) tweens.push({o:o,t:0,mt:500,k:'x',v0:o.x,v1:h.x});
      if (h.y!==undefined) tweens.push({o:o,t:0,mt:500,k:'y',v0:o.y,v1:h.y});
      if (h.w!==undefined) tweens.push({o:o,t:0,mt:500,k:'w',v0:o.w,v1:h.w});
      if (h.h!==undefined) tweens.push({o:o,t:0,mt:500,k:'h',v0:o.h,v1:h.h});
    }
    //...
  }
  function moveObj(o,x,y) {
    
    if (o.dontmove) return;
    if (isNaN(o.intern.selx)) { console.error('isnan');return; }
    
    o.x=o.intern.selx+(x-oinp.x)/view.scx;
    o.y=o.intern.sely+(y-oinp.y)/view.scy;
    //var grid=2;
    if (!o.nogrid) {
      o.x=Math.floor(0.5+o.x/grid)*grid;
      o.y=Math.floor(0.5+o.y/grid)*grid;
    }
    if (o.children&&!mautolayout.checked) for (var o0 of o.children) moveObj(o0,x,y);
    handlerRun('change',o);
    
    if (0)
    if (mtime&&(mtime===Menu.mcontrol)) {
      if (!o.keyFrames) o.keyFrames=[];
      var t=parseInt(mtime.value),kf=undefined;
      for (var i=0;i<o.keyFrames.length;i++) {
        var kfi=o.keyFrames[i];
        if (kfi.t<t) continue;
        if (kfi.t==t) kf=kfi; else {
          kf={t:t};o.keyFrames.splice(i,0,kf);
        }
        break;
      }
      if (!kf) { kf={t:t};o.keyFrames.push(kf); }
      kf.x=o.x;kf.y=o.y;
      //o.keyFrames=[{t:mtime.value,x:o.x,y:o.y}];
      //console.log(o);
    }
    
    //...
  }
  function delObj(o) {
    if (o.intern.unHook) o.intern.unHook();
    
    for (var oh of objs) {
      if (oh===o) continue;
      if (oh.children) for (var i=oh.children.length-1;i>=0;i--) if (oh.children[i]===o) {
        oh.children.splice(i,1);
        if (oh.children.length==0) delete(oh.children);
        console.log('delObj child');
      }
      if (oh.edges) for (var i=oh.edges.length-1;i>=0;i--) {
        var e=oh.edges[i];
        if ((o===e.p1)||(o===e.p2)) {
          oh.edges.splice(i,1);
          if (oh.edges.length==0) delete(oh.edges);
          console.log('delObj edge');
        }
      }
    }
    
    var i=objs.indexOf(o);
    if (i!=-1) objs.splice(i,1);
    handlerRun('change',o);
    //...
  }
  
  function handlerAdd(k,f) {
    let a=handlers[k];
    if (!a) { a=[];handlers[k]=a; }
    a.push(f);
    //...
  }
  function handlerRun(k,p0,p1) {
    //---
    let a=handlers[k];
    if (!a) return;
    for (let f of a) f(p0,p1);
    //...
  }
  function handlerDel(k,f) {
    let a=handlers[k];
    let i=a.indexOf(f);
    a.splice(i,1);
    //...
  }
  
  function inpObj() {
    //---
    let ix=oinp.x*dpr,iy=oinp.y*dpr,
        smallo=undefined,smallf;
    for (var o of objs) {
      var oi=o.intern;
      if (!oi) continue;
      oi.selx=o.x;oi.sely=o.y;
      if ((ix>=oi.x)&&(iy>=oi.y)&&(ix<=(oi.x+oi.w))&&(iy<=(oi.y+oi.h))) {
      //if ((x>=o.x)&&(y>=o.y)&&(x<=(o.x+o.w))&&(y<=(o.y+o.h))) {
        //console.log(ix+' '+iy);
        //console.log(oi);
        if (o.selectable!==undefined) if (!o.selectable) continue;
        var f=o.w*o.h;
        if (smallo) if (smallf<=f) continue;
        smallo=o;smallf=f;
        //o.sel=1;
        //sels.push(o);
      }
    }
    return smallo;
    //...
  }
  
  function mouseDown(e) {
    //log
    var x=e.pageX,y=e.pageY;
    oinp.x=x;oinp.y=y;oinp.md=true;
    oinp.px=view.posx;oinp.py=view.posy;
    movedist=0;
    
    if (mdown.checked) {
      //let o=inpObj();
      //if (o) {
      //  if (self.onUp) self.onUp(o);
      //  if (o.onUp) o.onUp();
      //  movedist=1000;//no other onUp
      //  oinp.md=false;//no drag
      //}
      mouseUp(e);
      movedist=1000;//no other onUp
      oinp.md=true;
    }
    
    
    //if ((x<200)&&(y<200)) tryFullscreen();
    
  }
  function mouseUp(e) {
    //og("mouseUp");
    oinp.md=false;
    
    var width=canvas.width,height=canvas.height,
        //x=(oinp.x*dpr-width/2)/(dpr*view.scx)-view.posx,
        //y=(oinp.y*dpr-height/2)/(dpr*view.scy)-view.posy,
        ix=oinp.x*dpr,iy=oinp.y*dpr;
    //onsole.log('movedist='+movedist);
    if (movedist<10) {
    
    //while (sels.length>=self.selCount) {
    //  var o=sels[0];o.sel=undefined;
    //  sels.splice(0,1);
    //}
    
    //for (var o of sels) o.sel=undefined;
    //sels.length=0;
    
    //var smallo=undefined,smallf;
    //for (var o of objs) {
    //  var oi=o.intern;
    //  if (!oi) continue;
    //  oi.selx=o.x;oi.sely=o.y;
    //  if ((ix>=oi.x)&&(iy>=oi.y)&&(ix<=(oi.x+oi.w))&&(iy<=(oi.y+oi.h))) {
    //  //if ((x>=o.x)&&(y>=o.y)&&(x<=(o.x+o.w))&&(y<=(o.y+o.h))) {
    //    //console.log(ix+' '+iy);
    //    //console.log(oi);
    //    if (o.selectable!==undefined) if (!o.selectable) continue;
    //    var f=o.w*o.h;
    //    if (smallo) if (smallf<=f) continue;
    //    smallo=o;smallf=f;
    //    //o.sel=1;
    //    //sels.push(o);
    //  }
    //}
    var o=inpObj();//smallo;
    //onsole.log(o);
    
    if (((!o)&&(sels.length>0))||(o&&(sels.length==self.selCount))) {
      //onsole.log('unselecting '+sels.length);
      for (var oh of sels) oh.sel=undefined;
      sels.splice(0,sels.length);
    }
    
    if (o) {
      //onsole.log(o);
      if (self.onUp) self.onUp(o);
      if (o.onUp) o.onUp();
      if (o.sel) {
        o.sel=undefined;
        var i=sels.indexOf(o);sels.splice(i,1);
      } else {
      if (sels.length<self.selCount) {
      o.sel=1;
      //o.intern.selx=o.x;
      //o.intern.sely=o.y;
      //if (o.children) for (var o0 of o.children) {
      //  o0.intern.selx=o0.x;
      //  o0.intern.sely=o0.y;
      //}
      sels.push(o);
      }
      //onsole.log('selected obj index '+objs.indexOf(o));
      if (o.textfield) {
        console.log('Nao show textfield.');
        var c=document.createElement('input'),st=c.style;
        c.type='text';
        st.position='absolute';st.top='4px';st.left='4px';
        st.width='100px';st.height='20px';
        c.value=o.s||o.sa;
        document.body.appendChild(c);
        console.log(c);
      } else {
      //console.log(smallo);
      //onsole.log(o);
      if (o.onselect) o.onselect(ix,iy);
      var h=o.onclick;
      if (h) {
        tween(o,h);
    
    //    var op=o.intern.origpos;
    //    if (op) {
    //      //o.x=op.x;o.y=op.y;
    //      //tweens.push({o:o,t:0,mt:500,p0:{x:o.x,y:o.y},p1:{x:op.x,y:op.y}});
    //      if (h.x!==undefined) tweens.push({o:o,t:0,mt:500,k:'x',v0:o.x,v1:op.x});
    //      if (h.y!==undefined) tweens.push({o:o,t:0,mt:500,k:'y',v0:o.y,v1:op.y});
    //      if (h.w!==undefined) tweens.push({o:o,t:0,mt:500,k:'w',v0:o.w,v1:op.w});
    //      if (h.h!==undefined) tweens.push({o:o,t:0,mt:500,k:'h',v0:o.h,v1:op.h});
    //      delete(o.intern.origpos);
    //    } else {
    //      o.intern.origpos={x:o.x,y:o.y,w:o.w,h:o.h};
    //      //o.x+=h.x;o.y+=h.y;
    //      //tweens.push({o:o,t:0,mt:500,p0:{x:o.x,y:o.y},p1:{x:o.x+h.x,y:o.y+h.y}});
    //      if (h.x!==undefined) tweens.push({o:o,t:0,mt:500,k:'x',v0:o.x,v1:h.x});
    //      if (h.y!==undefined) tweens.push({o:o,t:0,mt:500,k:'y',v0:o.y,v1:h.y});
    //      if (h.w!==undefined) tweens.push({o:o,t:0,mt:500,k:'w',v0:o.w,v1:h.w});
    //      if (h.h!==undefined) tweens.push({o:o,t:0,mt:500,k:'h',v0:o.h,v1:h.h});
    //    }
    
      }}}
    }
    
    }
    //objs.push({x:x,y:y,w:10,h:10,sel:1});
    
  }
  function mouseMove(e) {
    if (!oinp.md) return;
    var x=e.pageX,y=e.pageY;
    //if (mdrag&&mdrag.checked) {
    if (sels.length>0) {
      //if (sels.length>0) {
      for (var o of sels) {
        ////var o=sels[0];
        //o.x=o.intern.selx+(x-oinp.x)/view.scx;
        //o.y=o.intern.sely+(y-oinp.y)/view.scy;
        //var grid=2;
        //o.x=Math.floor(0.5+o.x/grid)*grid;
        //o.y=Math.floor(0.5+o.y/grid)*grid;
        //if (o.children) for (var o0 of o.children) {
        //  o0.x=o0.intern.selx+(x-oinp.x)/view.scx;
        //  o0.y=o0.intern.sely+(y-oinp.y)/view.scy;
        //  o0.x=Math.floor(0.5+o0.x/grid)*grid;
        //  o0.y=Math.floor(0.5+o0.y/grid)*grid;
        //}
        moveObj(o,x,y);
      }
      //...
    } else {
      movedist=Math.max(movedist,Math.abs(x-oinp.x)+Math.abs(y-oinp.y));
      view.posx=oinp.px+(x-oinp.x)/view.scx;
      view.posy=oinp.py+(y-oinp.y)/view.scy;
      
      //console.log(view);
      //if (!mousePart) return;
    }
  }
  function mouseScroll(e) {
    //---
    var up=false;
    if (e.wheelDelta!=undefined) up=e.wheelDelta>0;
    else up=e.detail<0;
    
    //console.log('mouseScroll up='+up);
    var d=up?1.1:1/1.1;
    view.scx*=d;view.scy*=d;
    //onsole.log(self.mouseScroll);
    //if (self.mouseScroll) self.mouseScroll(up);
    
    //...
  }
  
  
  function touchStart(e) {
    //var sh='';
    //if (e.touches.length==1)
    if (!oinp.md) //---for checkDown to touch multiple sounds at the same time
      mouseDown(e.touches[e.touches.length-1]);
    else if (e.touches.length==2) {
      var t0=e.touches[0],t1=e.touches[1];
      oinp.t0=t0;oinp.t1=t1;
      oinp.scx=view.scx;oinp.scy=view.scy;
      oinp.px=view.posx;oinp.py=view.posy;
      oinp.md=false;
      movedist=1000;
      //console.log('touch scale start');
    }
    
    //for (var h=0;h<e.touches.length;h++) {
    //  var t=e.touches[h];
    //  var x=t.pageX,y=t.pageY;
    //  if (e.touches.length==1) mouseDown(t);
    //  else if (e.touches.length==2) {
    //    
    //  }
      //if ((x<200)&&(y<200)) { tryFullscreen();return; }
      ////sh+=' '+t.identifier+'-'+c;
      //if (c) { c.xt=t.pageX;c.yt=t.pageY; }
      //tparts[t.identifier]=c;//h
    //}
    //log('touchstart '+sh);
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function touchMove(e) {
    //og('touchmove '+e.touches.length);
    if (e.touches.length==1) mouseMove(e.touches[0]);
    else if ((e.touches.length==2)&&oinp.t0&&oinp.t1) {
      var t0=e.touches[0],t1=e.touches[1];
      var d0=dist(oinp.t0.pageX,oinp.t0.pageY,oinp.t1.pageX,oinp.t1.pageY),
          d1=dist(t0.pageX,t0.pageY,t1.pageX,t1.pageY),
          x0=(oinp.t0.pageX+oinp.t1.pageX)/2,
          y0=(oinp.t0.pageY+oinp.t1.pageY)/2,
          x1=(t0.pageX+t1.pageX)/2,
          y1=(t0.pageY+t1.pageY)/2;
      view.scx=oinp.scx*d1/d0;
      view.scy=oinp.scy*d1/d0;
      view.posx=oinp.px+(x1-x0)/view.scx;
      view.posy=oinp.py+(y1-y0)/view.scy;
      //console.log(oinp.t0.pageX+' '+t0.pageX);
    }
    
    
    //for (var h=0;h<e.touches.length;h++) {
    //  var t=e.touches[h];
    //  if (e.touches.length==1) mouseMove(t);
      //var c=tparts[t.identifier];
      //if (!c) continue;
      //c.xt=t.pageX;c.yt=t.pageY;
    //}
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function touchEnd(e) {
    //var sh='';
    //var tp={};
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      ////sh+=' '+t.identifier;
      //tp[t.identifier]=tparts[t.identifier];
    }
    if (e.touches.length==0) { 
      oinp.t0=undefined;oinp.t1=undefined;
      mouseUp();
    }
    //tparts=tp;
    //log('touchend '+sh);
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function tilt(x,y) {
    //log("Tilt: "+Math.floor(x)+' '+Math.floor(y));
    //for (var i=parts.length-1;i>=0;i--) {
    //  var p=parts[i];
    //  p.xa=y/180;
    //  p.ya=x/180;
    //}
  }
  
  function getImage(fn) {
    //---
    var img=images[fn];
    if (img!==undefined) return img;
    
    var img=new Image();
    img.src=fn;
    return img;
    //...
  }
  
  function initScript(o) {
    //---
    var sc=undefined;
    var so=scripts[o.script];
    if (so) sc=so.script;
    if (!sc) {
    console.log('loading: '+o.script);
    window.cano=self;//---so that script can access cano
    sc=document.createElement('script');
    so={script:sc};
    scripts[o.script]=so;
    sc.onload=function() {
      //onsole.log('script loaded.');
      so.loaded=1;
      //onsole.log(this);
      //onsole.log(sc);
    }
    sc.src=o.script;
    }
    o.intern.script=sc;
    if (so.loaded) {
      //onsole.log('need to activate script for obj');
      so.hookObj(o);
    }
    document.head.appendChild(sc);// or body
    //...
  }
  
  function clear() {
    //---
    for (var o of objs) if (o.intern.unHook) o.intern.unHook();
    if (mdown) Menu.setChecked(mdown,false);
    
    delete(self.audioQueuesStay);
    objs.length=0;
    //...
  }
  this.clear=clear;
  
  function load(fn) {
    //load(v);
    if (fn.endsWith('.js')) {
      clear();
      let o;
      initScript(o={bgcol:'#0f0',script:fn,intern:{}});
      objs.push(o);
      return;
    }
    //console.log(fn);
    Conet.download({fn:fn,f:function(v) {
      //...
      clear();
      //--- above is sometimes set in canvApps/pointGraph.js
      //--- flag is check in canvApps/audio.htm
      
      var a=JSON.parse(v);
      objs=a;self.objs=objs;//onsole.log(a);
      Conet.log('Loaded '+fn+'.');
      
      if (a.length>0) {
        var v=a[0].view;
        if (v) { 
          view.posx=v.posx;view.posy=v.posy;view.scx=v.scx;view.scy=v.scy;
          if (v.eventsOnDown) {
            Menu.setChecked(mdown,true);
            Conet.log('To select switch ondown off.');
          }
        }
      }
      
      for (var o of objs) initObj(o);
    }
    });
    //onet.download({fn:v+'?1',f:parseLoad});
  }
  function initObj(o) {
    //
    if (o.imgfn) {
    
    if (o.imgfn.endsWith('.png')) {
      //var img=new Image();
      //img.src=o.imgfn;
      //o.img=img;
      o.img=getImage(o.imgfn);
    } else
    
    Conet.download({o:o,fn:o.imgfn,f:function(v) {
      
      //console.log(this);
      var img=new Image();
      img.src=JSON.parse(v).data;
      var o=this.o;//objs[1];
      o.img=img;
      
      //var c=20;
      //for (var x=0;x<c;x++) for (var y=0;y<c;y++) if (x||y) {
      //  objs.push(Conet.hcopy(o0,{x:o0.x+o0.w*x,y:o0.y+o0.h*y},undefined,undefined,1));
      //}
    }
    });
    }
    o.intern={};
    
    if (o.textW||o.textD) {
      var ctx=canvas.getContext('2d');
      if (o.scale) ctx.font=((fsh=(o.scale*o.h))*0.9)+'px sans-serif';
      if (o.fs) ctx.font=o.fs+'px sans-serif';
      if (o.sa) {
        o.w=0;
        for (var s of o.sa) 
          o.w=Math.max(o.w,ctx.measureText(s).width);
        o.w+=2;
      } else {
        o.w=ctx.measureText(o.s).width+2;
      }
      if (o.fs) {
        o.h=o.fs*(o.sa?o.sa.length:1)+1;
      }
    }
    
    if (o.children) for (var i=0;i<o.children.length;i++) 
      o.children[i]=objs[o.children[i]];
    if (o.edges) for (var e of o.edges) {
      e.p1=objs[e.p1];
      e.p2=objs[e.p2];
    }
    if (o.script) {
      initScript(o);
    /*
      var sc=undefined;
      var so=scripts[o.script];
      if (so) sc=so.script;
      if (!sc) {
      console.log('loading: '+o.script);
      window.cano=self;//---so that script can access cano
      sc=document.createElement('script');
      so={script:sc};
      scripts[o.script]=so;
    sc.onload=function() {
      //onsole.log('script loaded.');
      so.loaded=1;
      //onsole.log(this);
      //onsole.log(sc);
    }
      sc.src=o.script;
      }
      o.intern.script=sc;
      if (so.loaded) {
        //onsole.log('need to activate script for obj');
        so.hookObj(o);
      }
      document.head.appendChild(sc);// or body
    */
    }
    
    
    return o;
    //...
  }
  function init() {
    var c=document.createElement('canvas');
    (gps.parentNode||document.body).appendChild(c);canvas=c;
    //canvas=document.getElementById('canvas');
    cont=canvas.parentNode;
    
    //log('pa0.len='+pa0.len);
    var c=canvas;//window;
    window.addEventListener('mousemove',mouseMove);
    c.addEventListener('mousedown',mouseDown);
    c.addEventListener('mouseup',mouseUp);
    c.addEventListener('touchstart',touchStart,{passive:false});
    window.addEventListener('touchmove',touchMove,{passive:false});
    c.addEventListener('touchend',touchEnd);
    c.addEventListener('DOMMouseScroll',mouseScroll,false);
    c.addEventListener('mousewheel',mouseScroll,false);
    
    
    if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function () {
      tilt(event.beta, event.gamma);
    }
    , true);
    } else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
      tilt(event.acceleration.x * 2, event.acceleration.y * 2);
    }
    , true);
    } else {
    window.addEventListener('MozOrientation', function () {
      tilt(orientation.x * 50, orientation.y * 50);
    }
    , true);
    }
    
    //canvas=document.getElementById('canvas');
    //cont=canvas.parentNode;
    
    //og('Up-left touch/mouseclick tries fullscreen mode.');
    //og('UserAgent '+navigator.userAgent);
    //var dpr=window.devicePixelRatio || 1;
    //log('DevicePixelRatio '+dpr);
    
    
    if (gps&&!gps.nomenu) {
      
    var cfm=0?undefined:Conet.fileMenu({fn:'/anim/arrows/canvNotes/files.txt'
     ,defFn:'/anim/arrows/canvNotes/test0.json',url:'fn',noStartLoad:gps.menuNoStartLoad||0,loadf:load
     ,loadList:1 //---because unloading pointGraph svg scene doesnt work right currently
    ,savef:function(fn) {
      Conet.upload({fn:fn,data:serialize()});
      Conet.log('Saved '+fn+'.');
    }
    });
    cfm.sub.push({s:'Export',actionf:function() {
      console.log(serialize());
    }
    });  
      
      Menu.init([{s:'Menu',
       sub:[cfm,
       
       {s:'Edit',sub:[
       
    {s:'Add',r:1,actionf:function() {
      //...
      var o,i=-1;
      if (sels.length==1) {
        i=objs.indexOf(sels[0]);
        o=serialObj(sels[0],1);
        //delete(o.children);delete(o.edges);delete(o.view);
        o.x+=o.w/10;o.y+=o.h/10;
        o.x=Math.ceil(1+o.x/grid)*grid;
        o.y=Math.ceil(1+o.y/grid)*grid;
        //delete(sels[0].sel);sels[0]=o;o.sel=1;
        //o.intern={};o.intern.selx=o.x;o.intern.sely=o.y;
        //console.log(o);
      } else
        o={x:0,y:0,w:40,h:10,s:'Test',bgcol:'rgba(150,150,150,0.5)'};
      initObj(o);
      if (i!=-1) objs.splice(i+1,0,o); else objs.push(o);
      handlerRun('change',o);
      //alert(32);
      //---
    }
       },
       
    {s:'Add..',doctrl:'Copy nodes to',value:'1,1',
    setfunc:function(v) {
      //---
      let a=v.split(','),dx=parseFloat(a[0]),dy=parseFloat(a[1]);
      console.log('Add.. '+dx+' '+dy);
      
      let max=Number.MAX_VALUE,minx=max,miny=max,maxx=-max,maxy=-max;
      for (let o of sels) {
        minx=Math.min(minx,o.x);
        miny=Math.min(miny,o.y);
        maxx=Math.max(maxx,o.x+o.w);
        maxy=Math.max(maxy,o.y+o.h);
      }
      dx=dx*(maxx-minx);
      dy=dy*(maxy-miny);
      console.log(minx+' '+miny+' -> '+maxx+' '+maxy);
      for (let oh of sels) {
        let i=objs.indexOf(oh);
        let o=serialObj(oh,1);
        o.x+=dx;o.y+=dy;
        //o.x=Math.ceil(1+o.x/grid)*grid;
        //o.y=Math.ceil(1+o.y/grid)*grid;
        initObj(o);
        objs.splice(i+1,0,o);
        handlerRun('change',o);
      }
      //...
    }
    },
       
       
    {s:'Edit..',doctrl:'Edit properties.',r:1,ta:1,jsonCheck:1,cstay:1,okS:'Set',cancelS:'Close',valuef:function() {
      if (sels.length==0) { alert('Nothing selected.');return; }
      
      return JSON.stringify(serialObj(sels[0]),undefined,' ');
      //...
    }
    ,setfunc:function(v) {
      var o=JSON.parse(v);
      //onsole.log(o);
      if (sels[0].intern.unHook) sels[0].intern.unHook();
      Conet.hcopy(o,sels[0],undefined,undefined,undefined,{delall:1});
      o=initObj(sels[0]);
      o.sel=1;
    }
       },
       
       
    {s:'Random<br>Color',r:1,fs:0.7,actionf:function() {
      if (sels.length==0) { alert('Nothing selected.');return; }
      
      function rani(v) {
        return Math.floor(Math.random()*v);
      }
      
      //sels[0].bgcol='rgba('+(Conet.rani(150)+100)+','+(Conet.rani(150)+100)+','+(Conet.rani(150)+100)+',0.5)';
      sels[0].bgcol='rgba('+(rani(200)+50)+','+(rani(200)+50)+','+(rani(200)+50)+',0.5)';
      //...
    }
    },
        //mdrag={s:'',r:1,checked:undefined,checkbox:1,ms:'Drag'},
        
    mautolayout={checkbox:1,ms:'Auto Layout',r:1,
    actionf:function() {
      if (this.checked) for (var o of objs) delete(o.intern.childlens);
      //onsole.log(this.checked);
    }
    },
        
    {s:'Child',r:1,ms:'Toggle sel0.child=sel1',actionf:function() {
      //---
      if (sels.length!=2) { Conet.log('To toggle child, select 2 objs.');return; }
      
      var o0=sels[0],o1=sels[1];
      
      if (!o0.children) o0.children=[];
      var i=o0.children.indexOf(o1);
      if (i!=-1) {
        o0.children.splice(i,1);
        if (o0.children.length==0) delete(o0.children);
      } else 
        o0.children.push(o1);
      
      //...
    }
    },
    
    {s:'Edge',ms:'Toggle sel0.e=sel1,sel2',actionf:function() {
      //---
      if (sels.length!=3) { Conet.log('To toggle edge, select 3 objs.');return; }
      
      var o0=sels[0],o1=sels[1],o2=sels[2];
      
      if (!o0.edges) o0.edges=[];
      var removed=false;
      for (var i=o0.edges.length-1;i>=0;i--) {
        var e=o0.edges[i];
        if ((e.p1==o1)&&(e.p2==o2)) {
          o0.edges.splice(i,1);
          if (o0.edges.length==0) delete(o0.edges);
          removed=true;
          break;
        }
      }
      if (!removed) o0.edges.push({p1:o1,p2:o2});
      //o0.edges=[{p1:o1,p2:o2}];
      //...
    }
    },
    
    {s:'Delete',r:1,actionf:function() {
      //---
      if (sels.length==0) Conet.log('Nothing selected to delete.');
      for (var o of sels) delObj(o);
      sels.splice(0,sels.length);
      
      //...
    }
    },
    
    {s:'Index..',doctrl:'Edit index.',r:1,valuef:function() {
      if (sels.length==0) { alert('Nothing selected.');return; }
      
      return objs.indexOf(sels[0]);
      //...
    }
    ,setfunc:function(v) {
      var o=sels[0],i=objs.indexOf(o);
      objs.splice(i,1);
      objs.splice(//v>i?v-1:
        v,0,o);
      //---
    }
    },
    
    
    ]},
        
    {s:'View',sub:[Menu.mFullscreen,
        
    mtime={s:'0',ctrlTextId:'mtimeS',close:1,r:1,ms:'Time',doctrl:'Time',range:{min:0,max:100},value:0
    //r:1 gives bug
    ,setfunc:function(v) {
      alert(v);
    }
    ,oninput:function(v) {
      //---
      mtime.value=v;
      mtime.s=v;
      //console.log(mtime);
      //...
    }
    }
    
    ,mdown={ms:'Events on down',checkbox:1,r:1}
    
    ]}]}
            
        
       ],{listen:1});
    }
    
    //if (gps.initMenu) gps.initMenu();
    
    ot=new Date().getTime();
    draw();
  }
  function draw() {
    if (!canv) {
      canv={width:canvas.width,height:canvas.height};
    }
    //if (false)
    if ((canv.width!=cont.clientWidth)||(canv.height!=cont.clientHeight)) {
      canv.width=cont.clientWidth;canv.height=cont.clientHeight;
      //var dpr=window.devicePixelRatio || 1;
      //var dr=1;//((dpr==1)||(dpr==2))?1:Math.sqrt((dpr*dpr)*6/7);
      //canvas.width=canv.width/dr+(dr!=1?2:0);canvas.height=canv.height/dr+(dr!=1?2:0);//*devicePixelRatio;
      //log("Canvas "+canvas.width+" x "+canvas.height);
      ////log("DevicePixelRatio "+dpr+(dr!=1?" ("+dr+")":""));
      
      dpr=window.devicePixelRatio||1;view.dpr=dpr;
      canvas.width=canv.width*dpr;canvas.height=canv.height*dpr;
      var style=canvas.style;
      style.width=canv.width+'px';style.height=canv.height+'px';
      //onsole.log("Canvas "+canvas.width+'x'+canvas.height+' dpr:'+dpr);
    }  
    
    var t=Date.now();//new Date().getTime();
    var dt=t-ot;ot=t;
    
    var ctx=canvas.getContext('2d');
    if (first) {
      //og("webkitBackingStorePixelRatio="+(ctx.webkitBackingStorePixelRatio||1));
      var backingStorePixelRatio=ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;
      //og('BackingStorePixelRatio '+backingStorePixelRatio);
      first=false;
    }
    
    width=canvas.width,height=canvas.height;
    view.width=width;view.height=height;view.ctx=ctx;
    ctx.fillStyle='#cccccc';
    ctx.fillRect(0,0,width,height);
    ctx.strokeStyle='#000000';
    ctx.lineWidth=1;
    ctx.strokeRect(Math.floor(5*dpr)+0.5,Math.floor(5*dpr)+0.5,round(width-10*dpr),round(height-10*dpr));
    
    if (self.draw0) self.draw0(dt,ctx);
    //if (self.draw0s) for (let f of self.draw0s) f(dt,ctx);
    handlerRun('draw0',dt,ctx);
    
    var mtimeOn=mtime&&(mtime===Menu.mcontrol);
    if (mtime&&mtime.animate) {
      var v=mtime.range.min+((mtime.value-mtime.range.min)+0.02*dt)%(mtime.range.max-mtime.range.min)
      mtime.value=Math.floor(0.5+v*10000)/10000;
      //mtime.s=v;
      //console.log('animate mtime '+v);
    }
    
    drawShapes(ctx);
    //onsole.log(tweens.length);
    
    for (var ti=tweens.length-1;ti>=0;ti--) {
      var t=tweens[ti],f;
      
      if (t.mtime) {
        var th=mtime.value;
        if ((th<t.t)||(th>t.mt)) continue;
        f=(th-t.t)/(t.mt-t.t);
        //ontinue;
      } else {
        //onsole.log(t.t+' '+t.mt+dt);
        t.t=Math.min(t.mt,t.t+dt);
        //onsole.log(t.t+' '+t.mt);
        f=t.t/t.mt;
      }
      
      if (t.linear) {} else
      f=f==0?0:f==1?1:Math.pow(2,-10*f)*Math.sin((f*10-0.75)*(2*Math.PI/3))+1;
      
      //t.o.x=t.p0.x+f*(t.p1.x-t.p0.x);
      //t.o.y=t.p0.y+f*(t.p1.y-t.p0.y);
      t.o[t.k]=t.v0+f*(t.v1-t.v0);
      if ((!t.mtime)&&(t.t==t.mt)) tweens.splice(ti,1);
    }
    
    //console.log(tweens.length);
    
    var posx=view.posx,posy=view.posy,scx=view.scx,scy=view.scy;
    
    //ctx.fillRect(Math.random()*width,Math.random()*height,50,50);
    var fs=12*dpr;//--- round wohl nicht noetig hier wegen antialiasing text
    ctx.font=fs+'px sans-serif';
    ctx.textBaseline='top';
    var smallScale=self.smallScale||0.5;//1
    
    if (mautolayout&&mautolayout.checked) {
      for (var o of objs) {
        var oi=o.intern;
        oi.dx=0;oi.dy=0;
      }
      for (var o of objs) {
        var oi=o.intern;
        //oi.dx=0;oi.dy=0;
        if (!o.children) continue;
        if ((!oi.childlens)||(oi.childlens.length!=o.children.length)) 
          oi.childlens=new Array(o.children.length);
        for (var i=o.children.length-1;i>=0;i--) {
          var q=o.children[i],dx=q.x-o.x,dy=q.y-o.y,l=Math.max(0.01,Math.sqrt(dx*dx+dy*dy));
          var el=oi.childlens[i];
          if (el===undefined)  { oi.childlens[i]=l;continue; }
          dx/=l;dy/=l;
          var d=(el-l)/12;
          oi.dx-=d*dx;
          oi.dy-=d*dy;
          var qi=q.intern;
          qi.dx+=d*dx;
          qi.dy+=d*dy;
        }
      }
      for (var o of objs) {
        //if (!o.children) continue;
        var oi=o.intern;
        o.x+=oi.dx;o.y+=oi.dy;
      }
      //onsole.log('mautolayout nao');
    }
    
    for (var o of objs) {
      var x,y,w,h;
      if (o.pos) {
        x=(o.pos[1]=='left')?o.x*dpr:width-(o.x)*dpr;
        y=o.y*dpr;w=o.w*dpr;h=o.h*dpr;
      } else {
        x=round(width/2 +(o.x+posx)*dpr*scx);//+0.5,
        y=round(height/2+(o.y+posy)*dpr*scy);//+0.5,
        w=round(o.w*dpr*scx);h=round(o.h*dpr*scy);
      }
      var oi=o.intern;
      if (!oi) { oi={};o.intern=oi; }
      oi.x=x;oi.y=y;oi.w=w;oi.h=h;
    }
    
    for (var o of objs) {
      if (o.children) for (var q of o.children) {
        var oi=o.intern,qi=q.intern,col='rgba(50,50,50,0.2)';
        ctx.strokeStyle=col;//'rgba(0,0,0,0.1)';
        ctx.lineWidth=0.5*view.dpr*scx;
        ctx.beginPath();
        ctx.moveTo(oi.x,oi.y);
        ctx.lineTo(qi.x,qi.y);
        ctx.stroke();
        ctx.fillStyle=col;//'rgba(0,0,0,0.1)';
        var w=2*view.dpr*scx;
        ctx.fillRect(oi.x-w/2,oi.y-w/2,w,w);
      }
      if (o.edges) for (var eh of o.edges) {
        var p0=o.intern,p1=eh.p1.intern,p2=eh.p2.intern,
            col=eh.color||'rgba(50,150,150,0.5)',
            lw=eh.width||1;
        ctx.strokeStyle=col;
        ctx.lineWidth=lw*view.dpr*scx;
        ctx.beginPath();
        ctx.moveTo(p0.x,p0.y);
        var tx1=p0.x-p1.x,
            tx2=p2.x-p1.x,
            ty1=p0.y-p1.y,
            ty2=p2.y-p1.y,
            d1=Math.sqrt(tx1*tx1+ty1*ty1),
            d2=Math.sqrt(tx2*tx2+ty2*ty2),
            tx=p1.x-Math.sqrt(d1*d2)*(tx1/d1+tx2/d2)/2,
            ty=p1.y-Math.sqrt(d1*d2)*(ty1/d1+ty2/d2)/2;
        ctx.quadraticCurveTo(tx,ty,p2.x,p2.y);
        //ctx.lineTo(p1.x,p1.y);
        //ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
        ctx.fillStyle=col;//'rgba(0,0,0,0.1)';
        var w=(lw*3)*view.dpr*scx;
        ctx.fillRect(p0.x-w/2,p0.y-w/2,w,w);
        w=(lw*1.5)*view.dpr*scx;
        ctx.fillRect(p1.x-w/2,p1.y-w/2,w,w);
      }
    }
    ctx.lineWidth=1;
    
    var ix=-1;
    for (var o of objs) {
      ix++;
      //var x,y,w,h;
      //if (o.pos) {
      //  x=(o.pos[1]=='left')?o.x*dpr:width-(o.x)*dpr;
      //  y=o.y*dpr;w=o.w*dpr;h=o.h*dpr;
      //} else {
      //  x=round(width/2 +(o.x+posx)*dpr*scx);//+0.5,
      //  y=round(height/2+(o.y+posy)*dpr*scy);//+0.5,
      //  w=round(o.w*dpr*scx);h=round(o.h*dpr*scy);
      //}
      //var oi=o.intern;
      //if (!oi) { oi={};o.intern=oi; }
      //oi.x=x;oi.y=y;oi.w=w;oi.h=h;
      var oi=o.intern,x=oi.x,y=oi.y,w=oi.w,h=oi.h;
      if (((x+w<0)||(x>width)||(y+h<0)||(y>height))&&!o.noclip) continue;
          
      //ctx.fillStyle='rgba(150,255,150,0.5)';
      //ctx.fillRect(x,y,w,h);
      
      if ((scx>smallScale)) {///dpr)) {
        var fsh=fs;
        //if (o.scale) ctx.font=((fsh=(o.scale*h))*0.9)+'px sans-serif';
        //if (o.scale) ctx.font=((fsh=(o.scale*o.h*dpr*scy))*0.9)+'px sans-serif';
        
        //if (o.textW) {
        //  w=ctx.measureText(o.s).width+2;
        //  o.w=w/(dpr*scx);
        //}
    
        if (o.bgcol) {
          ctx.fillStyle=o.bgcol;//||'rgba(150,255,150,0.5)';
          ctx.fillRect(x,y,w,h);
        }
    
    
        ctx.fillStyle='#000';
        ctx.save();
        
        if (!o.noclip) {
          ctx.beginPath();
          ctx.rect(x,y,w,h);
          ctx.clip();
        }
        
        //var fsh=fs;
        //if (o.scale) ctx.font=((fsh=(o.scale*h))*0.9)+'px sans-serif';
        if (o.scale) ctx.font=((fsh=(o.scale*o.h*dpr*scy))*0.9)+'px sans-serif';
        if (o.fs) ctx.font=(fsh=(o.fs*dpr*scy))+'px sans-serif';
        
        if (o.draw0) { //---same as draw but also text with sa..
          o.intern.fsh=fsh;
          o.draw0(ctx,x,y,w,h);
        }
        
        if (o.draw) {
          o.intern.fsh=fsh;
          o.draw(ctx,x,y,w,h);
        } else {
        if (o.sa!==undefined) 
          for (var i=0;i<o.sa.length;i++) {
            if (o.alignCenter) {
              ctx.textAlign='center';
              ctx.textBaseline='middle';
              ctx.fillText(o.sa[i],x+w/2,y+h/2+fsh*i-(o.sa.length-1)*fsh/2);
              ctx.textAlign='start';
              ctx.textBaseline='alphabetic';
            } else
              ctx.fillText(o.sa[i],x+1,y+1+fsh*i);
          }
        else if (o.s!==undefined) 
          ctx.fillText(o.s,x+1,y+1);
        else {
          ctx.fillText('Lorem ipsum dolor sit amet, consectetur adipisici elit,',x+1,y+1);
          ctx.fillText('sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',x+1,y+fs);
        }
        if (o.img) {
          var withText=(o.s||o.sa),
              iw=o.img.width,ih=o.img.height,wh=w,hh=h-(withText?fs:0);
          if (iw&&ih) {
            var sc=Math.min(wh/iw,hh/ih)*(o.imgscale||1);
            ctx.drawImage(o.img,x+(o.imgx||0)*sc,y+(o.imgy||0)*sc+(withText?1+fs:0),iw*sc,ih*sc);
          }
        }}
        ctx.restore();
        //ctx.strokeRect(x,y,w,h);
        if ((o.bgcol&&!o.noBorder)||o.border) {
          ctx.strokeStyle='#000';
          ctx.strokeRect(x-0.5,y-0.5,w,h);
          if (o.border) {
            ctx.fillStyle='#000';
            ctx.fillText(ix,x+2,y+2);
          }
        }
        if (o.sel&&!o.selNoDeco) {
          ctx.strokeStyle='#f00';
          ctx.lineWidth=3*dpr;
          ctx.strokeRect(x-0.5,y-0.5,w,h);
          ctx.lineWidth=1;
        }
        
        if (mtimeOn) {
          ctx.fillStyle=o.keyFrames?'#0f0':'#444';
          ctx.fillRect(x,y,5,5);
        }
      } else {
        ctx.fillStyle=o.sel?'#f00':(o.smolcol||o.bgcol);
        ctx.fillRect(x,y,w+1,h+1);
      }
      //ctx.fillText('Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',x+1,y+1);
      //ctx.strokeRect(x,y,w,h);
    }
    
    handlerRun('draw1',dt,ctx);
    
    
    fpst+=dt;fpsc++;
    if (fpst>1000) {
      fpss=Math.floor(fpsc*1000/fpst+0.5)+' fps';
      fpst=0;fpsc=0;
    }
    
    ctx.fillStyle='#000000';
    ctx.fillText('CanvNotes v.0.893 - '+fpss,10*dpr,10*dpr);//FOLDORUPDATEVERSION
    for (var h=0;h<logs.length;h++)
      ctx.fillText(logs[h],10*dpr,10*dpr+fs+h*fs);
    
    setTimeout(draw,10);
  }
  
  function drawShapes(ct) {
    //---
    //console.log(this);
    var posx=view.posx,posy=view.posy,scx=view.scx,scy=view.scy;
    
    
    
    for (var obj of objs) if (obj.shapeDefs) {
      if (!obj.intern.shapeDefs) {
        //---remove tweens
        for (var i=tweens.length-1;i>=0;i--) {
          var tw=tweens[i];
          if (tw.mtime) { console.log('removing tween');tweens.splice(i,1); }
        }
        obj.intern.shapeDefs=JSON.parse(JSON.stringify(obj.shapeDefs));
        var vars={};
        for (var sd of obj.intern.shapeDefs) {
          if (sd.id) vars[sd.id]=sd;
          var prevsp=undefined;
          if (sd.shapes)
          for (var sp of sd.shapes) {
            if (sp.pos) { var p=vars[sp.pos];sp.x=(sp.x||0)+p.x;sp.y=(sp.y||0)+p.y; }
            if (sp.pos0) { var p=vars[sp.pos0];sp.x0=(sp.x0||0)+p.x;sp.y0=(sp.y0||0)+p.y; }
            if (sp.pos1) { var p=vars[sp.pos1];sp.x1=(sp.x1||0)+p.x;sp.y1=(sp.y1||0)+p.y; }
            if (prevsp) {
            
              //--- initially the plan was to fill up all missing key-values
              // for simple transitions (dont have to check if key is there),
              // but now using tweens, initially only for changing values but
              // then render for random times doesnt work, this needs also tweens
              // for fix values. thus tweens are now made for defined values,
              // without fillup (fillup would just add unnessary fix tweens)
            
              //for (var k of Object.keys(prevsp)) {
              for (var k of Object.keys(sp)) {
                var v=sp[k],pv=prevsp[k];
                //if (v===undefined) sp[k]=pv;
                //else if ((v!=pv)&&(k!='t')) {
                if ((v!==undefined)&&(pv!==undefined)&&(k!='t')) {
                  //console.log('add tween k='+k+' '+pv+' '+v);
                  var tw={mtime:1,o:sd.currentShape,k:k,v0:pv,v1:v,t:prevsp.t,mt:sp.t};
                  if (!sp.spring) tw.linear=1;
                  tweens.push(tw);
                  //onsole.log('add tween k='+k+' '+pv+' '+v);
                  //onsole.log(tw);
                }
              }
            } else {
              if (sp.t===undefined) sp.t=0;
              sd.currentShape=JSON.parse(JSON.stringify(sp));
            }
            prevsp=sp;
          }
        }
        console.log('created intern.shapeDefs');
        console.log(vars);
        //console.log(obj.intern.shapeDefs);
      }
      for (var sd of obj.intern.shapeDefs) {
        var sp=sd.currentShape;//shapes[0];//--- next sp generated via mtime
        if (!sp) continue;
        ct.fillStyle='rgba('+(sp.r||0)+','+(sp.g||0)+','+(sp.b||0)+','+(sp.a||0.5)+')';
        if (sd.isArrow) {
          //ct.strokeStyle='rgba(0,0,0,0.5)';
          //ct.beginPath();
          //ct.moveTo(width/2+(sp.x0+posx)*dpr*scx,height/2+(sp.y0+posy)*dpr*scy);
          //ct.lineTo(width/2+(sp.x1+posx)*dpr*scx,height/2+(sp.y1+posy)*dpr*scy);
          //ct.stroke();
        
          var dx=sp.x1-sp.x0,dy=sp.y1-sp.y0,len=Math.sqrt(dx*dx+dy*dy);
          var a=Math.atan2(dy,dx),sin=Math.sin(a),cos=Math.cos(a);
        
          ct.beginPath();
          //ct.lineWidth=dpr*scx;
          for (var i=0;i<arrow.length;i++) {
            var x=arrow[i][0],y=arrow[i][1];
            x*=len;y*=20;
            var x1=x*cos-y*sin,y1=x*sin+y*cos;
            x=x1;y=y1;
            x=width /2+(sp.x0+x+posx)*dpr*scx;
            y=height/2+(sp.y0+y+posy)*dpr*scy;
            if (i==0) ct.moveTo(x,y); else ct.lineTo(x,y);
          }
          ct.fill();
          //ct.stroke();
        }
        if (sd.isText) {
          var x=width /2+(sp.x+posx)*dpr*scx,
              y=height/2+(sp.y+posy)*dpr*scy;
          ct.font='bold '+(sp.fs*dpr*scx)+'px sans-serif';
          ct.textAlign='center';
          ct.textBaseline='middle';
          ct.fillText(sp.text,x,y);
        }
      }
    }
    ct.textAlign='start';
    ct.textBaseline='alphabetic';
    
    //...
  }
  
  function serialObj(o,forAdd) {
    var h=Conet.hcopy(o,undefined,undefined,{sel:1,img:1,intern:1});
    if (forAdd) {
      delete(h.children);delete(h.edges);delete(h.view);
    } else {
    if (h.children) {
      var a=[];
      for (var o of h.children) a.push(objs.indexOf(o));
      h.children=a;
    }
    if (h.edges) {
      var a=[];
      for (var e of h.edges) {
        var en=Conet.hcopy(e);
        en.p1=objs.indexOf(en.p1);
        en.p2=objs.indexOf(en.p2);
        a.push(en);
      }
      h.edges=a;
    }
    }
    return h;
    //...
  }
  function serialize() {
    var s='';
    view.eventsOnDown=mdown.checked?1:0;
    objs[0].view=view;
    for (var o of objs) if (!o.noserialize) s+=(s.length==0?'[\n':',\n')+JSON.stringify(serialObj(o));
    s+='\n]';
    return s;
  }
  
  this.add=function(o) {
    //---
    objs.push(initObj(o));
    return o;
    //...
  }
  
  this.addScriptHook=function(hookObj) {
    //--- 
    let script=document.currentScript;
    //--- direct hooks
    for (let o of objs) {
      if (o.intern.script===script) {
        hookObj(o);
      }
    }
    
    //--- register hookObj for later hooks
    for (let so of Object.values(scripts)) {
      if (so.script===script) {
        so.hookObj=hookObj;
      }
    }
    //...
  }
  
  this.setObjs=function(_objs) {
    //---
    objs=_objs;
    self.objs=_objs;
    //...
  }
  
  init();  //---for molded (and other external apps): invoke init after 
             //   constructor, e.g. to have initMenu access to fields (e.g. sels)
  
  this.objs=objs;
  this.view=view;
  this.sels=sels;
  this.round=round;
  this.load=load;//this.init=init;
  this.initObj=initObj;
  this.tween=tween;
  this.scripts=scripts;this.delObj=delObj;
  this.handlerAdd=handlerAdd;this.handlerDel=handlerDel;
  //...
}
//console.log('CanvNotes v. 1.0 ');
//console.log(CanvNotes);
//...
//fr o,1
//fr o,1,22
//fr o,1,24
//fr o,1,25
//fr o,1,42
//fr o,1,42,9
//fr o,1,44
//fr o,1,44,42
//fr o,1,44,52
//fr o,1,44,56
//fr o,1,44,61
//fr o,1,44,65
//fr o,1,44,65,2
//fr o,1,44,70
//fr o,1,44,82
//fr o,1,44,93
//fr o,1,44,94
//fr o,1,52
//fr o,1,54
//fr o,1,56
//fr p,2,109
