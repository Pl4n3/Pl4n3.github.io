//---
var CanvNotes=function(gps) {
  //---
  var logs=[],ot,canvas,cont,width,height,tparts=[],first=true,
      canv,fpst=0,fpsc=0,fpss='',dpr=1,objs=[],oinp={},
      view={posx:0,posy:0,scx:1,scy:1},sels=[],movedist=0,self=this,
      tweens=[];//,mdrag;
  
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
    
    if (isNaN(o.intern.selx)) { console.error('isnan');return; }
    
    o.x=o.intern.selx+(x-oinp.x)/view.scx;
    o.y=o.intern.sely+(y-oinp.y)/view.scy;
    var grid=2;
    o.x=Math.floor(0.5+o.x/grid)*grid;
    o.y=Math.floor(0.5+o.y/grid)*grid;
    if (o.children) for (var o0 of o.children) moveObj(o0,x,y);
    
    //...
  }
  function delObj(o) {
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
    objs.splice(i,1);
    //...
  }
  
  function mouseDown(e) {
    //log
    var x=e.pageX,y=e.pageY;
    oinp.x=x;oinp.y=y;oinp.md=true;
    oinp.px=view.posx;oinp.py=view.posy;
    movedist=0;
    //if ((x<200)&&(y<200)) tryFullscreen();
    
  }
  function mouseUp(e) {
    //log("mouseUp");
    oinp.md=false;
    
    var width=canvas.width,height=canvas.height,
        //x=(oinp.x*dpr-width/2)/(dpr*view.scx)-view.posx,
        //y=(oinp.y*dpr-height/2)/(dpr*view.scy)-view.posy,
        ix=oinp.x*dpr,iy=oinp.y*dpr;
    
    if (movedist<10) {
    
    //while (sels.length>=self.selCount) {
    //  var o=sels[0];o.sel=undefined;
    //  sels.splice(0,1);
    //}
    
    //for (var o of sels) o.sel=undefined;
    //sels.length=0;
    
    var smallo=undefined,smallf;
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
    var o=smallo;
    
    if (((!o)&&(sels.length>0))||(o&&(sels.length==self.selCount))) {
      //onsole.log('unselecting '+sels.length);
      for (var oh of sels) oh.sel=undefined;
      sels.splice(0,sels.length);
    }
    
    if (o) {
      //onsole.log(o);
      if (self.onUp) self.onUp(o);
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
      if (o.onselect) o.onselect();
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
    if (e.touches.length==1) mouseDown(e.touches[0]);
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
    else if (e.touches.length==2) {
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
    if (e.touches.length==0) mouseUp();
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
  
  function load(fn) {
    //load(v);
    //console.log(fn);
    Conet.download({fn:fn,f:function(v) {
      //...
      var a=JSON.parse(v);
      objs=a;self.objs=objs;//onsole.log(a);
      Conet.log('Loaded '+fn+'.');
      
      if (a.length>0) {
        var v=a[0].view;
        if (v) { view.posx=v.posx;view.posy=v.posy;view.scx=v.scx;view.scy=v.scy; }
      }
      
      for (var o of objs) initObj(o);
    }
    });
    //onet.download({fn:v+'?1',f:parseLoad});
  }
  function initObj(o) {
    //
    if (o.imgfn) 
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
     ,defFn:'/anim/arrows/canvNotes/test0.json',url:'fn',noStartLoad:0,loadf:load
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
       
    {s:'Add',actionf:function() {
      //...
      var o;
      if (sels.length==1) {
        o=serialObj(sels[0]);
        delete(o.children);delete(o.edges);
        o.x+=2;o.y+=2;
      } else
        o={x:0,y:0,w:40,h:10,s:'Test',bgcol:'rgba(150,150,150,0.5)'};
      initObj(o);
      objs.push(o);
      //alert(32);
      //---
    }
       },
       
    {s:'Edit..',doctrl:'Edit properties.',ta:1,jsonCheck:1,cstay:1,okS:'Set',cancelS:'Close',valuef:function() {
      if (sels.length==0) { alert('Nothing selected.');return; }
      return JSON.stringify(serialObj(sels[0]),undefined,' ');
      //...
    }
    ,setfunc:function(v) {
      var o=JSON.parse(v);
      //onsole.log(o);
      Conet.hcopy(o,sels[0],undefined,undefined,undefined,{delall:1});
      o=initObj(sels[0]);
      o.sel=1;
    }
       },
       
        //mdrag={s:'',r:1,checked:undefined,checkbox:1,ms:'Drag'},
        
    {s:'Child',ms:'Toggle sel0.child=sel1',actionf:function() {
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
    
    {s:'Delete',actionf:function() {
      //---
      if (sels.length==0) Conet.log('Nothing selected to delete.');
      for (var o of sels) delObj(o);
      sels.splice(0,sels.length);
      
      //...
    }
    },
    
        
        Menu.mFullscreen]}
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
    
    var t=new Date().getTime();var dt=t-ot;ot=t;
    
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
    
    if (self.draw0) self.draw0();
    
    //onsole.log(tweens.length);
    
    for (var ti=tweens.length-1;ti>=0;ti--) {
      var t=tweens[ti];
      //onsole.log(t.t+' '+t.mt+dt);
      t.t=Math.min(t.mt,t.t+dt);
      //onsole.log(t.t+' '+t.mt);
      var f=t.t/t.mt;
      
      f=f==0?0:f==1?1:Math.pow(2,-10*f)*Math.sin((f*10-0.75)*(2*Math.PI/3))+1;
      
      //t.o.x=t.p0.x+f*(t.p1.x-t.p0.x);
      //t.o.y=t.p0.y+f*(t.p1.y-t.p0.y);
      t.o[t.k]=t.v0+f*(t.v1-t.v0);
      if (t.t==t.mt) tweens.splice(ti,1);
    }
    
    //console.log(tweens.length);
    
    var posx=view.posx,posy=view.posy,scx=view.scx,scy=view.scy;
    
    //ctx.fillRect(Math.random()*width,Math.random()*height,50,50);
    var fs=12*dpr;//--- round wohl nicht noetig hier wegen antialiasing text
    ctx.font=fs+'px sans-serif';
    ctx.textBaseline='top';
    var smallScale=self.smallScale||1;
    
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
    
    for (var o of objs) {
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
      if ((x+w<0)||(x>width)||(y+h<0)||(y>height)) continue;
          
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
        
        if (o.draw) o.draw(ctx,x,y,w,h);
        else {
        if (o.sa!==undefined) 
          for (var i=0;i<o.sa.length;i++) 
            ctx.fillText(o.sa[i],x+1,y+1+fsh*i);
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
            var sc=Math.min(wh/iw,hh/ih);
            ctx.drawImage(o.img,x,y+(withText?1+fs:0),iw*sc,ih*sc);
          }
        }}
        ctx.restore();
        //ctx.strokeRect(x,y,w,h);
        if (o.bgcol&&!o.noBorder) {
          ctx.strokeStyle='#000';
          ctx.strokeRect(x-0.5,y-0.5,w,h);
        }
        if (o.sel&&!o.selNoDeco) {
          ctx.strokeStyle='#f00';
          ctx.lineWidth=3*dpr;
          ctx.strokeRect(x-0.5,y-0.5,w,h);
          ctx.lineWidth=1;
        }
      } else {
        ctx.fillStyle=o.sel?'#f00':(o.smolcol||o.bgcol);
        ctx.fillRect(x,y,w+1,h+1);
      }
      //ctx.fillText('Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',x+1,y+1);
      //ctx.strokeRect(x,y,w,h);
    }
    
    fpst+=dt;fpsc++;
    if (fpst>1000) {
      fpss=Math.floor(fpsc*1000/fpst+0.5)+' fps';
      fpst=0;fpsc=0;
    }
    
    ctx.fillStyle='#000000';
    ctx.fillText('CanvNotes v.0.557 - '+fpss,10*dpr,10*dpr);//FOLDORUPDATEVERSION
    for (var h=0;h<logs.length;h++)
      ctx.fillText(logs[h],10*dpr,10*dpr+fs+h*fs);
    
    setTimeout(draw,10);
  }
  
  function serialObj(o) {
    var h=Conet.hcopy(o,undefined,undefined,{sel:1,img:1,intern:1});
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
    return h;
    //...
  }
  function serialize() {
    var s='';
    objs[0].view=view;
    for (var o of objs) s+=(s.length==0?'[\n':',\n')+JSON.stringify(serialObj(o));
    s+='\n]';
    return s;
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
  //...
}
//console.log('CanvNotes v. 1.0 ');
//console.log(CanvNotes);
//...
//fr o,1
//fr o,1,26,2
//fr o,1,27
//fr o,1,27,2
//fr o,1,28
//fr o,1,28,41
//fr o,1,28,49
//fr o,1,28,53
//fr o,1,28,64
//fr p,8,151
