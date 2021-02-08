//---
var CanvNotes=function() {
  //---
  var logs=[],ot,canvas,cont,width,height,tparts=[],first=true,
      canv,fpst=0,fpsc=0,fpss='',dpr=1,objs=[],oinp={},
      view={posx:0,posy:0,scx:1,scy:1},sels=[],movedist=0,self=this;
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
        x=(oinp.x*dpr-width/2)/(dpr*view.scx)-view.posx,
        y=(oinp.y*dpr-height/2)/(dpr*view.scy)-view.posy;
    
    if (movedist<10) {
    
    for (var o of sels) o.sel=undefined;
    sels.length=0;
    
    var smallo=undefined,smallf;
    for (var o of objs) {
      if ((x>=o.x)&&(y>=o.y)&&(x<=(o.x+o.w))&&(y<=(o.y+o.h))) {
        //onsole.log(o);
        var f=o.w*o.h;
        if (smallo) if (smallf<=f) continue;
        smallo=o;smallf=f;
        //o.sel=1;
        //sels.push(o);
      }
    }
    if (smallo) {
      smallo.sel=1;
      sels.push(smallo);
      //console.log(smallo);
      if (smallo.onselect) smallo.onselect();
    }
    
    }
    //objs.push({x:x,y:y,w:10,h:10,sel:1});
    
  }
  function mouseMove(e) {
    if (!oinp.md) return;
    var x=e.pageX,y=e.pageY;
    movedist=Math.max(movedist,Math.abs(x-oinp.x)+Math.abs(y-oinp.y));
    view.posx=oinp.px+(x-oinp.x)/view.scx;
    view.posy=oinp.py+(y-oinp.y)/view.scy;
    console.log(view);
    //if (!mousePart) return;
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
  
  function init() {
    var c=document.createElement('canvas');
    document.body.appendChild(c);canvas=c;
    //canvas=document.getElementById('canvas');
    cont=canvas.parentNode;
    
    //log('pa0.len='+pa0.len);
    var c=window;//canvas;//window
    c.addEventListener('mousemove',mouseMove);
    c.addEventListener('mousedown',mouseDown);
    c.addEventListener('mouseup',mouseUp);
    c.addEventListener('touchstart',touchStart,{passive:false});
    c.addEventListener('touchmove',touchMove,{passive:false});
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
    
    
    Menu.init([{s:'Menu',sub:[Menu.mFullscreen]}],{listen:1});
    
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
      //og("Canvas "+canvas.width+'x'+canvas.height+' dpr:'+dpr);
      
    }  
    
    var t=new Date().getTime();var dt=t-ot;ot=t;
    
    var ctx = canvas.getContext('2d');
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
    
    var posx=view.posx,posy=view.posy,scx=view.scx,scy=view.scy;
    
    //ctx.fillRect(Math.random()*width,Math.random()*height,50,50);
    var fs=12*dpr;//--- round wohl nicht noetig hier wegen antialiasing text
    ctx.font=fs+'px sans-serif';
    ctx.textBaseline='top';
    for (var o of objs) {
      var x=round(width/2 +(o.x+posx)*dpr*scx);//+0.5,
          y=round(height/2+(o.y+posy)*dpr*scy);//+0.5,
          w=round(o.w*dpr*scx),h=round(o.h*dpr*scy);
          
      if ((x+w<0)||(x>width)||(y+h<0)||(y>height)) continue;   
          
      //ctx.fillStyle='rgba(150,255,150,0.5)';
      //ctx.fillRect(x,y,w,h);
      
      if ((scx>1)) {///dpr)) {
    
        if (o.bgcol) {
          ctx.fillStyle=o.bgcol;//||'rgba(150,255,150,0.5)';
          ctx.fillRect(x,y,w,h);
        }
    
    
        ctx.fillStyle='#000';
        ctx.save();
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.clip();
        
        if (o.sa!==undefined) 
          for (var i=0;i<o.sa.length;i++) 
            ctx.fillText(o.sa[i],x+1,y+1+fs*i);
        else if (o.s!==undefined) 
          ctx.fillText(o.s,x+1,y+1);
        else {
          ctx.fillText('Lorem ipsum dolor sit amet, consectetur adipisici elit,',x+1,y+1);
          ctx.fillText('sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',x+1,y+fs);
        }
        if (o.img) {
          var iw=o.img.width,ih=o.img.height,wh=w,hh=h-fs;
          if (iw&&ih) {
            var sc=Math.min(wh/iw,hh/ih);
            ctx.drawImage(o.img,x,y+1+fs,iw*sc,ih*sc);
          }
        }
        ctx.restore();
        //ctx.strokeRect(x,y,w,h);
        if (o.bgcol) {
          ctx.strokeStyle='#000';
          ctx.strokeRect(x-0.5,y-0.5,w,h);
        }
        if (o.sel) {
          ctx.strokeStyle='#f00';
          ctx.lineWidth=3*dpr;
          ctx.strokeRect(x-0.5,y-0.5,w,h);
          ctx.lineWidth=1;
        }
      } else {
        ctx.fillStyle=o.sel?'#f00':o.smolcol;
        ctx.fillRect(x,y,w,h);
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
    ctx.fillText('CanvNotes v.0.212 - '+fpss,10*dpr,10*dpr);//FOLDORUPDATEVERSION
    for (var h=0;h<logs.length;h++)
      ctx.fillText(logs[h],10*dpr,10*dpr+fs+h*fs);
    
    setTimeout(draw,10);
  }
  init();
  
  this.objs=objs;
  this.view=view;
  this.sels=sels;
  this.round=round;
  //...
}
//...
//fr o,1
//fr o,1,10
//fr o,1,11
//fr p,1,53
