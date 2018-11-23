//---bod2
var Bod2=function() {
  //---
  var parts=[],pairs=[],constraints=[],units=[],
      mousePart,mouseP={x:0,y:0},PI=Math.PI,PI2=PI*2,
      logs=[],
      STICK=0,DISTANCE=1,ot,canvas,cont,width,height,
      tparts=[],dpr=1,a=0.2,stones=[],self,gwi=800,ghe=600,
      gox=50,goy=50,tpartCount=0,jpads=[],cv0,audio,drawcount=0,
      scale=2.5,attacks=[];
  //-----         
  function partNew4(x,y,xa,ya) {
    return partNew6(x,y,x,y,xa,ya);
  }
  function partNew6(x,y,x1,y1,xa,ya) {
    return {x0:x,y0:y,x1:x1,y1:y1,xa:xa,ya:ya};
  }
  function pairNew2(p0,p1) {
    return pairNew4(p0,p1,pLen(p0.x0,p0.y0,p1.x0,p1.y0),STICK);
  }
  function pairNew4(p0,p1,l,k) {
    return {p0:p0,p1:p1,len:l,kind:k};
  }
  function pLen(x0,y0,x1,y1) {
    var dx=x0-x1,dy=y0-y1;
    return Math.sqrt(dx*dx+dy*dy);
  }
  
  function midA(a0,a1) {
    var ah;if (a0>a1) { ah=a0;a0=a1;a1=ah; }
    while (a1-a0>PI) a1-=PI2;
    return (a1+a0)/2;
  }
  function deltaA(a0,a1) {
    while (a1-a0>PI) a1-=PI2;
    while (a1-a0<-PI) a1+=PI2;
    return (a1-a0);
  }
  
  function contains(r,x,y) {
    return (x>r.x)&&(x<r.x+r.w)&&(y>r.y)&&(y<r.y+r.h);//...
  }
  function calcFc(fc,dt) {
    var u=fc.u,mx=0,my=0,ges=0;
    for (var i=u.parts.length-1;i>=0;i--) {
      var p=u.parts[i],w=p.weight||1;
      mx+=p.x0*w;my+=p.y0*w;ges+=w;
    }
    mx/=ges;my/=ges;
    
    
    fc.t+=dt;
    var tg=0;for (var i=fc.a.length-1;i>=0;i--) tg+=fc.a[i].t;
    if (fc.t>=tg) {
      fc.first=false;
      fc.t=fc.t%tg;
    }
    var t=fc.t,i1=-1;
    for (var i=0;i<fc.a.length;i++) {
      if (t>=fc.a[i].t) { t-=fc.a[i].t;continue; }
      i1=i;break;
    }
    var ak1=fc.a[i1];
    if (fc.oi1!=i1) {
      var a=ak1.attack;
      if (a) {
        //onsole.log('attack nao');
        attacks.push({x:u.mx+(u.mirror?-a.x-a.w:a.x),y:u.my+a.y,w:a.w,h:a.h,t:250,u:u});
        Sound.osc({a:[{fr:[200,400],v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,fr:[50,500]}]});
      }
      if (ak1.sound) {
        Sound.osc({a:[{fr:[40,20],v:0,n:1},{t:10,v:1},{t:240,v:0}]});  
      }
    }
    fc.oi1=i1;
    var fa1=ak1.a,fa0=(fc.first&&(i1==0))?u.firsta:fc.a[i1==0?fc.a.length-1:i1-1].a,f1=t/fc.a[i1].t,f0=1-f1;
    //if (u.mirror) { f1*=-1;f0*=-1; }
    //var fa=fc.a[0].a;
    var usc=u.sc||1;
    for (var i=u.parts.length-1;i>=0;i--) {
      var p=u.parts[i],fp0=fa0[i],fp1=fa1[i];
      p.x0+=((u.mirror?-1:1)*(fp0.x*f0+fp1.x*f1)*usc-p.x0+mx)/1;
      p.y0+=((fp0.y*f0+fp1.y*f1)*usc-p.y0+my)/1;
    }
    //console.log('calcFc');
  }
  function calc(dtime) {
    //----
    var xh,yh;
    for (var h=parts.length-1;h>=0;h--) {
      var p=parts[h];
      xh=p.x0;yh=p.y0;//mCopy(fh,p.f0);
      p.x0+=p.x0-p.x1+p.xa*dtime*dtime/100;//ft*ft;
      p.y0+=p.y0-p.y1+p.ya*dtime*dtime/100;//ft*ft;
      //p.f0[2]+=p.f0[2]-p.f1[2]+p.a[2]*ft*ft;
      p.x1=xh;p.y1=yh;//mCopy(p.f1,fh);
    }
    
    for (var h=pairs.length-1;h>=0;h--) {
      var pa=pairs[h];
      var p0=pa.p0,p1=pa.p1;
      var dx=p0.x0-p1.x0,dy=p0.y0-p1.y0;
      var deltalen=Math.sqrt(dx*dx+dy*dy);
      //float [] f0=pa.p0.f0;
      //float [] f1=pa.p1.f0;
      //mSub(delta,f0,f1);
      //float deltalen=mLen(delta);
    
      if (pa.kind==DISTANCE) if (deltalen>pa.len) continue;
      if (deltalen==0) continue;
      var diff=(deltalen-pa.len)/deltalen;
      diff*=0.5;
      //diff*=0.5f*dtime/25;
    
      dx*=diff;dy*=diff;
      p0.x0-=dx;p0.y0-=dy;
      p1.x0+=dx;p1.y0+=dy;
      //mMul(delta,diff);
      //mSub(f0,f0,delta);
      //mAdd(f1,f1,delta);
    }
    
    for (var h=constraints.length-1;h>=0;h--) {
      var c=constraints[h];
      if (c.type=='ac') {
      var x0,y0;
      if (c.peek) {
        x0=c.p0.x0-c.p1.x0;y0=c.p0.y0-c.p1.y0;
      } else {
        x0=c.p1.x0-c.p0.x0;y0=c.p1.y0-c.p0.y0;
      }
      var a0=Math.atan2(y0,x0);
      var l0=pLen(c.p1.x0,c.p1.y0,c.p0.x0,c.p0.y0);
      var x1=c.p2.x0-c.p1.x0;var y1=c.p2.y0-c.p1.y0;
      var a1=Math.atan2(y1,x1);
      var l1=pLen(c.p2.x0,c.p2.y0,c.p1.x0,c.p1.y0);
      //og('ac '+l1+' '+c.p2.x0+' '+c.p2.y0+' '+c.p1.x0+' '+c.p1,y0);
    
      var d0=c.u.mirror?-c.da1:c.da0;
      var d1=c.u.mirror?-c.da0:c.da1;
    
      var da=deltaA(a0,a1);//(float)(a1-a0);
      //out(''+da);
      if (da<d0) da=d0; else
      if (da>d1) da=d1; else continue;
    
      var am=midA(a0,a1);//(a0+a1)/2;
    
      a0=am-da/2;//while (a0<-PI) a0+=PI*2;while (a0>PI) a0-=PI*2;
      a1=am+da/2;//while (a1<-PI) a1+=PI*2;while (a1>PI) a1-=PI*2;
    
      var yh=Math.sin(a0)*l0;
      var xh=Math.cos(a0)*l0;
      var dv=4;
      x0=(xh-x0)/dv;y0=(yh-y0)/dv;
      if (c.peek) {
        c.p1.x0-=x0;c.p1.y0-=y0;c.p0.x0+=x0;c.p0.y0+=y0;
      } else {
        c.p1.x0+=x0;c.p1.y0+=y0;c.p0.x0-=x0;c.p0.y0-=y0;
      }
      
      
      yh=Math.sin(a1)*l1;
      xh=Math.cos(a1)*l1;
      x1=(xh-x1)/dv;y1=(yh-y1)/dv;
      c.p2.x0+=x1;c.p2.y0+=y1;
      c.p1.x0-=x1;c.p1.y0-=y1; 
      
      //og('ac '+l1+' '+xh+' '+x1);
      //og('ac '+c.p0.x0+','+c.p0.y0+' '+c.p1.x0+','+c.p1.y0+' '+c.p2.x0+','+c.p2.y0);
      }
      if (c.type=='fc') calcFc(c,dtime);
    }
    
    var stoned=false;
    for (var h=parts.length-1;h>=0;h--) {
      var p=parts[h],pr=p.r||10,x=p.x0,y=p.y0;  
      //p.stoned=false;
      p.x0=Math.min(gwi,Math.max(0,p.x0));
      p.y0=Math.min(ghe,Math.max(0,p.y0));
      for (var i=stones.length-1;i>=0;i--) {
        var r=stones[i],rmx=r.x+r.w/2,rmy=r.y+r.h/2;
        if (!contains(r,x<rmx?x+pr:x-pr,y<rmy?y+pr:y-pr)) continue;
        var dy0=y+pr-r.y,dy1=r.y+r.h-(y-pr),dx0=x+pr-r.x,dx1=r.x+r.w-(x-pr);
        if ((dy0<=dy1)&&(dy0<=dx0)&&(dy0<=dx1)) {
          p.y0=r.y-pr;
        } else if ((dx0<=dy1)&&(dx0<=dy0)&&(dx0<=dx1)) {
          p.x0=r.x-pr;
        } else if ((dy1<=dy0)&&(dy1<=dx0)&&(dy1<=dx1)) {
          p.y0=r.y+r.h+pr;
        } else p.x0=r.x+r.w+pr;
        var dx=p.x0-p.x1;p.x1+=dx/2;
        var dy=p.y0-p.y1;p.y1+=dy/2; 
        stoned=true;
      }
    }
    
    //if (self.soundt) 
    //  self.soundt=Math.max(0,self.soundt-dtime);
    //else if (stoned) {
    //  Sound.osc({a:[{fr:[40,20],v:0,n:1},{t:10,v:1},{t:240,v:0}]});
    //  self.soundt=400;
    //}
    
    if (mousePart) {
      mousePart.x0=mouseP.x;mousePart.y0=mouseP.y;
    }
    
    for (var k in tparts) if (tparts.hasOwnProperty(k)) {
      var p=tparts[k];
      if (!p) continue;
      p.x0=p.xt;p.y0=p.yt;
    }
    
    for (var h=units.length-1;h>=0;h--) {
      var u=units[h];
      var mx=0,my=0,ymi=100000,sf=false;
      for (var i=u.parts.length-1;i>=0;i--) {
        var p=u.parts[i];//pa[i];
        mx+=p.x0;my+=p.y0;ymi=Math.min(ymi,p.y0);
        if (u.currentFc) {  //check for attacks
          for (var j=attacks.length-1;j>=0;j--) {
            var a=attacks[j];
            if (a.u==u) continue;
            if (contains(a,p.x0,p.y0)) { sf=true;u.floatt=1500;p.x1=p.x0+(a.u.mirror?-20:20); }
          }
        }
      }
      if (sf) { u.hp=Math.max(0,u.hp-1);setFloating(u); }
      mx/=u.parts.length;my/=u.parts.length;
      u.mx=mx;u.my=my;u.ymi=ymi;
      
      if (u.shadowImg) {
        var mind=Number.MAX_VALUE,mini=-1;
        for (var i=stones.length-1;i>=0;i--) {
          var r=stones[i];
          if ((r.x>mx)||(r.x+r.w<mx)||(r.y<my)) continue;
          var d=r.y-my;
          if (d>=mind) continue;
          mind=d;mini=i;
        }
        //onsole.log(mini);
        u.shadowStone=(mini==-1?undefined:stones[mini]);
      }
     
     
     if (u.parts.length>12) for (var i=jpads.length-1;i>=0;i--) {
      var jp=jpads[i];
      if ((mx>jp.x)&&(mx<jp.x+jp.w)&&(my>jp.y)&&(my<jp.y+jp.h)) { //30,50,470,490
        var p3=u.parts[3],p2=u.parts[2],
            pa0=u.parts[9],pa3=u.parts[12];
        p3.x1=p3.x0-jp.dx;p3.y1=p3.y0-jp.dy;
        p2.x1=p2.x0-jp.dx;p2.y1=p2.y0-jp.dy;
        pa0.x1=pa0.x0-jp.dx;pa0.y1=pa0.y0-jp.dy;
        pa3.x1=pa3.x0-jp.dx;pa3.y1=pa3.y0-jp.dy;
        self.setFloating(u);
        Sound.osc({a:[{fr:[50,500],v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,fr:[200,400]}]});
      }
     }
     
     
     
     
      
      if ((!mousePart)&&(tpartCount==0)&&(h==0)) {
        
        var b=5,b2=b*2,ox=b,oy=b,wi=width/scale,he=height/scale;
        if (wi<gwi+b2) { ox=Math.min(b,wi/2-u.mx);ox=Math.max(ox,wi-gwi-b); } else ox=(wi-gwi-b2)/2;
        if (he<ghe+b2) { oy=Math.min(b,he/2-u.my);oy=Math.max(oy,he-ghe-b); } else oy=(he-ghe-b2)/2;
        gox+=(ox-gox)/10;
        goy+=(oy-goy)/10;
      }
    }
    
    for (var h=attacks.length-1;h>=0;h--) {
      var a=attacks[h];
      a.t-=dtime;
      if (a.t>0) continue;
      attacks.splice(h,1);
    }
    
    self.extCalc(dtime);//...because this now is window, because draw is invoked async
    //console.log(this);//.extCalc);
    
  }
  //----
  function log(s) {
    logs.splice(1,0,s);
    while (logs.length>20) logs.pop();
  }
  function searchPart(mx,my) {
    var radius=60;
    var md=radius*radius;
    var mc=undefined;
    for (var i=0;i<parts.length;i++) {
      var p=parts[i];
      var d=(p.x0-mx)*(p.x0-mx)+(p.y0-my)*(p.y0-my);
      if (d<md) {
        md=d;mc=p;
      }
    }
    return mc;
  }
  function mouseDown(e) {
    //log
    mousePart=searchPart(e.pageX-gox,e.pageY-goy);
  }
  function mouseUp(e) {
    //log("mouseUp");
    mousePart=undefined;
  }
  function mouseMove(e) {
    //if (!mousePart) return;
    mouseP.x=e.pageX-gox;mouseP.y=e.pageY-goy;
  }
  
  function touchStart(e) {
    //var sh='';
    tpartCount=0;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var c=searchPart(t.pageX-gox,t.pageY-goy);
      //sh+=' '+t.identifier+'-'+c;
      if (c) { c.xt=t.pageX-gox;c.yt=t.pageY-goy; 
        tparts[t.identifier]=c;//h
        tpartCount++;
      }
    }
    //log('touchstart '+sh);
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function touchMove(e) {
    //og('touchmove '+e.touches.length);
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var c=tparts[t.identifier];
      if (!c) continue;
      c.xt=t.pageX-gox;c.yt=t.pageY-goy;
    }
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function touchEnd(e) {
    //var sh='';
    var tp={};
    tpartCount=0;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      //sh+=' '+t.identifier;
      tp[t.identifier]=tparts[t.identifier];
      tpartCount++;
    }
    tparts=tp;
    //log('touchend '+sh);
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function resize(e) {
    //canvas.width=cont.clientWidth;canvas.height=cont.clientHeight;
    //log("Canvas resize "+canvas.width+" x "+canvas.height);
    var w=window.innerWidth,h=window.innerHeight,s=canvas.style;
    width=w;height=h;
    canvas.width=w*dpr;canvas.height=h*dpr;
    s.width=w+'px';s.height=h+'px';
    //og("Canvas resize "+w+" x "+h);
    //...
  }
  
  function init(p) {
    console.log('Bod2 '+this.version);
    if (p) {
      if (p.w) gwi=p.w;
      if (p.h) ghe=p.h;
    }
    dpr=window.devicePixelRatio;
    
    //log('pa0.len='+pa0.len);
    window.addEventListener('mousemove',mouseMove,false);
    window.addEventListener('mousedown',mouseDown,false);
    window.addEventListener('mouseup',mouseUp,false);
    window.addEventListener('touchstart',touchStart,false);
    window.addEventListener('touchmove',touchMove,false);
    window.addEventListener('touchend',touchEnd,false);
    window.addEventListener('resize',resize,false);
    canvas=document.getElementById('canvas');
    cont=canvas.parentNode;
    ot=new Date().getTime();
    resize();
    self=this;this.canvas=canvas;
    
    //--------------create jumppad
    
    
    var w=50,h=20,h2=(h-1)/2;
    cv0=document.createElement('canvas');
    cv0.width=w;cv0.height=h;
    var ct=cv0.getContext('2d');
    var id=ct.createImageData(w,h);
    for (var y=0;y<h;y++) for (var x=0;x<w;x++) {
      var i=(y*w+x)*4;
      id.data[i]=255;
      id.data[i+1]=255;
      id.data[i+2]=0;
      id.data[i+3]=255*(1-Math.abs(y/h2-1))*(x<h2?x/h2:1)*(x>w-h2?1-(x-w+h2+1)/h2:1);
    }
    var ct=cv0.getContext('2d');
    ct.putImageData(id,0,0);
    
    //---------------
    
    
    
    draw();
  }
  function drawTexTri(ct,img,x0,y0,x1,y1,x2,y2,u0,v0,u1,v1,u2,v2) {
    
    ct.save();
    ct.beginPath();ct.moveTo(x0,y0);ct.lineTo(x1,y1);ct.lineTo(x2,y2);ct.clip();
    
    
    x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0; 
    u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0; 
    var id = 1.0 / (u1*v2 - u2*v1);
    var a = id * (v2*x1 - v1*x2);
    var b = id * (v2*y1 - v1*y2);
    var c = id * (u1*x2 - u2*x1);
    var d = id * (u1*y2 - u2*y1);
    var e = x0 - a*u0 - c*v0;
    var f = y0 - b*u0 - d*v0;
     
    // draw image
    ct.transform( a, b, c, d, e, f );
    ct.drawImage(img, 0, 0);
    
    ct.restore();
    
    
  }
  
  function draw() {
    //if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight)) {
    //  canvas.width=cont.clientWidth;canvas.height=cont.clientHeight;
    //  log("Canvas "+canvas.width+" x "+canvas.height);
    //}  
    
    var t=new Date().getTime();
    
    if (!canvas.getContext) return;
    var ctx=canvas.getContext('2d'),ct=ctx,sc=dpr*scale,ox=gox*sc,oy=goy*sc;
    
    
    //console.log(sc);
    
    //width=canvas.width,height=canvas.height;
    //ctx.fillStyle='#555';//cccccc;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#000000';
    ctx.lineWidth=1;
    ctx.strokeRect(ox,oy,gwi*sc,ghe*sc);
    
    var dt=t-ot;ot=t;
    
    //drawcount++;if (drawcount%10==0) 
      calc(10);
    
    //var tc=0;
    //while (t-ot>10) {
    //  calc(10);ot+=10;
    //  tc++;if (tc>5) ot=t;
    //}
    //var dt=10;
    
    //ctx.fillStyle='#000000';
    
    if (self.extDraw0) self.extDraw0(ctx,ox,oy,sc);
    
    
    for (var i=stones.length-1;i>=0;i--) {
      var r=stones[i],b=20,b2=b*2;
      if (r.img) {
        var x0=0.14,y0=0.35,w=0.77,h=0.65;
        //ctx.globalAlpha=0.1;
        ctx.drawImage(r.img,ox+(r.x-x0*r.w)*sc,oy+(r.y-y0*r.h)*sc,(r.w/w)*sc,(r.h/h)*sc);
        //ctx.globalAlpha=1;
        //ctx.strokeRect(ox+(r.x)*sc,oy+(r.y)*sc,(r.w)*sc,(r.h)*sc);
        continue;
      }
      ctx.fillStyle=r.col||'#999';
      ctx.fillRect(ox+(r.x-b)*sc,oy+(r.y-b)*sc,(r.w+b2)*sc,(r.h+b2)*sc);
    }
    
    
    for (var i=units.length-1;i>=0;i--) {
      var u=units[i];
      var st=u.shadowStone;
      if (!st) continue;
      var he=st.y-u.my;
      //onsole.log(he);
      var h1=300,h0=100;
      if (he>h1) continue;
      ctx.globalAlpha=0.6*((he<h0)?1:(1-(he-h0)/(h1-h0)));
      var w=(u.shsc||1)*150,h=(u.shsc||1)*30;
      ctx.drawImage(u.shadowImg,ox+(u.mx-w/2)*sc,oy+(st.y-h/2)*sc,w*sc,h*sc);
      ctx.globalAlpha=1;
    }
    
    for (var i=jpads.length-1;i>=0;i--) {
      var jp=jpads[i];
      if (!jp.shadowImg) continue;
      var w=jp.w*sc,w2=w/2;
      
      var ws=150,hs=30;
      ct.globalAlpha=0.6;
      ct.drawImage(jp.shadowImg,ox+(jp.x+jp.w/2-ws/2)*sc,oy+(jp.y+jp.h-hs/2)*sc,ws*sc,hs*sc);
      ct.globalAlpha=1;
    }
    
    ctx.fillStyle='#000000';
    
    if (0) {
    var pw=5*sc,pw2=pw/2;
    for (var i=0;i<parts.length;i++) {
      var p=parts[i];
      ctx.fillRect(ox+p.x0*sc-pw2,oy+p.y0*sc-pw2,pw,pw);
    }
    
    for (var i=0;i<pairs.length;i++) {
      var pa=pairs[i];
      var p0=pa.p0,p1=pa.p1;
      ctx.beginPath();
      ctx.moveTo(ox+p0.x0*sc,oy+p0.y0*sc);
      ctx.lineTo(ox+p1.x0*sc,oy+p1.y0*sc);
      ctx.closePath();
      ctx.stroke();
    }
    }
    
    for (var ui=units.length-1;ui>=0;ui--) {
      var u=units[ui],usc=u.sc||1;
      for (var i=u.weights.length-1;i>=0;i--) {
        var w=u.weights[i];
        var x0=w.p0.x0,y0=w.p0.y0;
        var dx=w.p1.x0-x0,dy=w.p1.y0-y0;
        var dl=Math.sqrt(dx*dx+dy*dy);
        dx=dx*w.l/dl;dy=dy*w.l/dl;
        var a=Math.atan2(dy,dx)+Math.PI/2;
        var dx2=Math.cos(a),dy2=Math.sin(a);
        for (var j=0;j<w.wps.length;j++) {
          var wp=w.wps[j];
          wp.xr=x0+usc*(dx2*wp.x*(u.mirror?-1:1)+dx*wp.y);//dx*2;//w.fa[i*2];
          wp.yr=y0+usc*(dy2*wp.x*(u.mirror?-1:1)+dy*wp.y);//dy*2;//w.fa[i*2+1];
          //ctx.strokeRect(wp.xr-1,wp.yr-1,3,3);
        }
      }
      //var xm=0,ymi=100000;
      for (var h=u.verts.length-1;h>=0;h--) {
        var v=u.verts[h];
        var x=0,y=0,w=0;
        for (var i=v.wps.length-1;i>=0;i--) {
          var wp=v.wps[i];
          x+=wp.xr*wp.wv;y+=wp.yr*wp.wv;w+=wp.wv;
        }
        v.x=x/w;v.y=y/w;
        //xm+=v.x;ymi=Math.min(ymi,v.y);
        //ctx.strokeRect(v.x-5,v.y-5,10,10);
      }
      //xm/=u.verts.length;ymi-=10;
      
      var fs=4*sc,x=ox+u.mx*sc,y=oy+(u.ymi-15)*sc,bw=20;
      ctx.font=fs+'px sans-serif';
      ctx.textBaseline='bottom';ctx.textAlign='center';
      ctx.fillStyle='#aaaaaa';
      
      //ctx.fillText('5/20 HP',ox+xm*sc,oy+ymi*sc);
      ctx.fillText(u.hp+' HP',x,y);
      ctx.fillStyle='#f00';
      ctx.fillRect(x-bw/2*sc,y,bw*sc,2*sc);
      ctx.fillStyle='#0f0';
      ctx.fillRect(x-bw/2*sc,y,bw*sc*u.hp/u.mhp,2*sc);
      //tx.strokeRect(ox+xm*sc-5,oy+ymi*sc-5,10,10);
      
    for (var j=0;j<u.polys.length;j++) {
      var p=u.polys[j];
      
      if (p.img&&(p.verts.length==3)) {
        var v0=p.verts[0],v1=p.verts[1],v2=p.verts[2],w=p.img.width,h=p.img.height;
        drawTexTri(ctx,p.img,ox+v0.x*sc,oy+v0.y*sc,ox+v1.x*sc,oy+v1.y*sc,ox+v2.x*sc,oy+v2.y*sc,v0.u*w,v0.v*h,v1.u*w,v1.v*h,v2.u*w,v2.v*h);
        continue;
      }
      
      ctx.fillStyle=p.c;
      ctx.beginPath();
      for (var i=0;i<p.verts.length;i++) {
        var v=p.verts[i];
        //if (i==0) ctx.moveTo(v.x,v.y); else ctx.lineTo(v.x,v.y);
        if (i==0) ctx.moveTo(ox+v.x*sc,oy+v.y*sc); else ctx.lineTo(ox+v.x*sc,oy+v.y*sc);
      }
      ctx.fill();
    }
    
    if (0)//u.dbg)
    for (var h=0;h<u.polys.length;h++) {
      var p=u.polys[h],x=0,y=0;
      for (var i=0;i<p.verts.length;i++) {
        var v=p.verts[i];x+=v.x;y+=v.y;
      }
      x/=p.verts.length;y/=p.verts.length;
      ctx.fillStyle='#fff';ctx.fillText(''+h,x,y);
    }
    
    
      if (u.dbg) 
      for (var h=u.verts.length-1;h>=0;h--) { var v=u.verts[h];ctx.fillStyle='#0f0';ctx.fillText(''+h,ox+sc*v.x,oy+sc*v.y); }
    }
    
    
    var fs=10*sc;
    ctx.font=fs+'px sans-serif';
    ctx.textBaseline='top';
    ctx.fillStyle='#000000';
    for (var h=0;h<logs.length;h++)
      ctx.fillText(logs[h],fs,fs+h*fs);
    
    for (var i=jpads.length-1;i>=0;i--) {
      var jp=jpads[i],w=jp.w*sc,w2=w/2,l=2*Math.sqrt(jp.dx*jp.dx+jp.dy*jp.dy),c=5;
        
      ct.globalAlpha=0.3;
      ct.drawImage(cv0,ox+jp.x*sc,oy+jp.y*sc,w,jp.h*sc);
      ct.globalAlpha=1;
      ct.save();
      ct.translate(ox+(jp.x+jp.w/2)*sc,oy+(jp.y+jp.h/2)*sc);
      ct.rotate(Math.atan2(jp.dy,jp.dx)+Math.PI/2);
      for (var j=0;j<c;j++) { 
        var y=(j/(c-1)+t*0.0025)%1;
        ct.globalAlpha=1-Math.abs(2*y-1);
        ct.drawImage(cv0,-w2,-w2/4-sc*(l*y-jp.h/2),w,w/4);
      }
      ct.restore();
    }
    
    if (0) for (var i=attacks.length-1;i>=0;i--) {
      var a=attacks[i];
      ct.strokeStyle='#f00';
      ct.strokeRect(ox+a.x*sc,oy+a.y*sc,a.w*sc,a.h*sc);
    }
    
    
    if (self.extDraw1) self.extDraw1(ctx,ox,oy,sc);
    
    setTimeout(draw,10);
  }
  function loadUnit(o,xp,yp) {
    //alert(o.parts.length);
    o.omx=0;o.omy=0;
    var pa=[];
    for (var i=0;i<o.parts.length;i++) {
      var p=o.parts[i];
      var ph;
      parts.push(ph=partNew4(p[0]+xp,p[1]+yp,0,a));
      pa.push(ph);
      o.parts[i]=ph;
    }
    
    var pai;
    
    if (o.pairs)
    for (var i=0;i<o.pairs.length;i++) {
      var p=o.pairs[i];
      pairs.push(pai=pairNew2(pa[p[0]],pa[p[1]]));
      //pai.len*=2;
    }
    if (o.constraints)
    for (var i=0;i<o.constraints.length;i++) {
      var co=o.constraints[i];
      var c={type:co[0],u:o};
      if (c.type=='ac') {
        c.p0=pa[co[1]];c.p1=pa[co[2]];c.p2=pa[co[3]];
        c.da0=co[4];c.da1=co[5];c.peek=co[6];
      }
      constraints.push(c);
    }
    
    if (o.fcs) {
      o.firsta=[];
      for (var j=0;j<o.parts.length;j++) o.firsta.push({x:0,y:0});
      o.fch={};
      for (var i=0;i<o.fcs.length;i++) {
      var fc=o.fcs[i],fcn={name:fc[0],a:[],u:o,type:'fc'};
      for (var j=1;j<fc.length;j++) {
        var fcj=fc[j],mx=0,my=0,ges=0,fk;
        
        if (Array.isArray(fcj)) {
          fk={t:fcj[0],a:[]};
          for (var k=0;k<(fcj.length-1)/2;k++) {
            var fp={x:fcj[1+k*2],y:fcj[2+k*2]},w=pa[k].weight||1;
            mx+=fp.x*w;my+=fp.y*w;ges+=w;
            fk.a.push(fp);
          }
        } else {
          fk=fcj;
          if (fk.a0) {
            fk.a=[];
            for (var k=0;k<fk.a0.length/2;k++) {
              var fp={x:fk.a0[k*2],y:fk.a0[1+k*2]},w=pa[k].weight||1;
              mx+=fp.x*w;my+=fp.y*w;ges+=w;
              fk.a.push(fp);
            }
            delete(fk.a0);
          }
        }
        
        mx/=ges;my/=ges;
        for (var k=0;k<fk.a.length;k++) { var p=fk.a[k];p.x-=mx;p.y-=my; }
        fcn.a.push(fk);
      }
      o.fcs[i]=fcn;
      o.fch[fcn.name]=fcn;
      //console.log(fcn);
      //if (i==0) constraints.push(fcn);
      }
    }
    
    
    var wps=[];
    if (o.weights)
    for (var i=0;i<o.weights.length;i++) {
      var we=o.weights[i];
      var w={p0:pa[we[0]],p1:pa[we[1]],wps:[]};
      w.l=Math.sqrt((w.p0.x0-w.p1.x0)*(w.p0.x0-w.p1.x0)+(w.p0.y0-w.p1.y0)*(w.p0.y0-w.p1.y0));
      var wpa=we[2];
      for (var j=0;j<wpa.length/3;j++) {
        var wp={x:wpa[j*3],y:wpa[j*3+1],wv:wpa[j*3+2]};
        w.wps.push(wp);
        wps.push(wp);
      }
      o.weights[i]=w;
      //weights.push(w);
    }
    //var vea=[];
    if (o.verts)
    for (var i=0;i<o.verts.length;i++) {
      var ve=o.verts[i];
      var v={wps:[]};
      for (var j=0;j<ve.length;j++) v.wps.push(wps[ve[j]]);
      //verts.push(v);
      o.verts[i]=v;
      //vea.push(v);
    }
    if (o.polys)
    for (var i=0;i<o.polys.length;i++) {
      var po=o.polys[i];
      var p={c:'rgb('+po[0]+','+po[1]+','+po[2]+')',verts:[]};
      var va=po[3];
      for (var j=0;j<va.length;j++) p.verts.push(o.verts[va[j]]);
      o.polys[i]=p;
      //polys.push(p);
    }
    units.push(o);
    return o;//{parts:pa};
    //alert(weights.length);
  }
  function adel(a,o) {
    var i=a.indexOf(o);
    a.splice(i,1);
  }
  
  this.demoBod2=function() {
    
    var p0,p1,p2,p3,p4,pa0;
    parts.push(p0=partNew6(150,150,150,190,0,0));
    parts.push(p1=partNew6(350,150,350,110,0,0));
    parts.push(p2=partNew6(250,350,250,350,0,0));
    parts.push(p3=partNew6(200,100,200,100,0,0));
    pairs.push(pa0=pairNew2(p0,p1));
    pairs.push(pa0=pairNew2(p0,p2));
    pairs.push(pa0=pairNew2(p1,p2));
    pairs.push(pa0=pairNew2(p0,p3));
    pairs.push(pa0=pairNew2(p1,p3));
    
    parts.push(p0=partNew6(50,50,50,50,0,0));
    parts.push(p1=partNew6(150,50,145,45,0,0));
    parts.push(p2=partNew6(50,80,50,80,0,0));
    parts.push(p3=partNew6(50,110,50,110,0,0));
    parts.push(p4=partNew6(70,110,70,110,0,0));
    pairs.push(pa0=pairNew2(p0,p1));
    pairs.push(pa0=pairNew2(p0,p2));
    pairs.push(pa0=pairNew2(p2,p3));
    pairs.push(pa0=pairNew2(p3,p4));
    pairs.push(pa0=pairNew2(p2,p4));
    
    init();
  }
  this.setFc=function(u,name) {
    //onsole.log('bod2.setFc '+name);
    //console.trace();
    var fc=u.fch[name];
    if (u.currentFc) adel(constraints,u.currentFc);
    constraints.push(fc);
    u.currentFc=fc;
    
    var mx=0,my=0,ges=0;
    for (var h=u.parts.length-1;h>=0;h--) {
      var p=u.parts[h],w=p.weight||1;
      mx+=w*p.x0;my+=w*p.y0;ges+=w;
    }
    mx/=ges;my/=ges;
    
    for (var h=u.parts.length-1;h>=0;h--) {
      var p=u.parts[h],fp=u.firsta[h];
      fp.x=(p.x0-mx)*(u.mirror?-1:1);
      fp.y=(p.y0-my);
    }
    
    fc.t=0;fc.first=true;
  }
  function setFloating(u) {
    adel(constraints,u.currentFc);
    delete(u.currentFc);
  }
  this.extCalc=function(dt) {
    //...
  }
  
  this.setFloating=setFloating;this.loadUnit=loadUnit;
  this.init=init;this.parts=parts;this.stones=stones;
  this.jpads=jpads;
  this.units=units;this.attacks=attacks;
  this.version='0.458 ';//FOLDORUPDATEVERSION
  //this.sound1=sound1;
}

//fr o,1
//fr o,1,19
//fr o,1,20
//fr o,1,37
//fr o,1,41
//fr p,2,394
