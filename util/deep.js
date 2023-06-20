//----
var Deep=function(ps) {
  var rH=ps.rH?ps.rH:undefined,PI=Math.PI,
      version='0.328 ',//FOLDORUPDATEVERSION
      newView=true,ovs=[],lastcurs=undefined,curso=undefined,
      self=this,dt=0;
  function dkey(x,y,z) {
    return z+' '+y+' '+x;//...
  }
  function initR(x,y,z) {
    var g={x:x,y:y,z:z};
    rH[dkey(x,y,z)]=g;
    return g;
  }
  function getR(z,y,x,create) {
    var ret=rH[dkey(x,y,z)];
    if (create&&!ret) {
      //console.log('deep.getR create '+x+' '+y+' '+z);console.trace();
      ret=initR(x,y,z);
    }
    return ret;
  }
  function round(v) {
    return Math.floor(v+0.5);
  }
  function viewline(x0,y0,z0,xh,yh,zh,l) {
    var vx0=x0+0.5,vy0=y0+0.5,vz0=z0+0.5,lr=Math.sqrt(l),dx=xh/lr,dy=yh/lr,dz=zh/lr;
    //var view=true;
    for (var s=0;s<lr;s++) {
      if (getR(Math.floor(vz0+s*dz),Math.floor(vy0+s*dy),Math.floor(vx0+s*dx))) continue;
      return false;
    }
    return true;
  }
  function freeFor(g,o) {
    if (!g) return 0;
    if (g.block) return 0;
    if (!g.os) return 1;
    if (g.os.length==0) return 1;
    if (g.os[0]!=o) return 0;
    return 1;
  }
  this.maxlen=2;
  this.moveUpdown=true;
  this.pathStart=function(g,o) {
    if (g.gpos) if (!g.len||(g.gpos.len<g.len)) g=g.gpos;
    
    var path=[g],g0=g,g1;
    let updown=!o.fly;
    while (true) {
      var gs=[],x=g0.x,y=g0.y,z=g0.z;
      //console.log(g0);
      //onsole.log(x+' '+y+' '+z);
      g1=getR(z-1,y,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else if (updown) {
      g1=getR(z-1,y+1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else {
      g1=getR(z-1,y-1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1);
      }}
      //console.log(g1);console.log(gs.length);
      g1=getR(z,y,x-1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else if (updown) {
      g1=getR(z,y+1,x-1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else {
      g1=getR(z,y-1,x-1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); 
      }}
      //console.log(g1);console.log(gs.length);
      g1=getR(z+1,y,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else if (updown) {
      g1=getR(z+1,y+1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else {
      g1=getR(z+1,y-1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); 
      }}
      //console.log(g1);console.log(gs.length);
      g1=getR(z,y,x+1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else if (updown) {
      g1=getR(z,y+1,x+1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); else { 
      g1=getR(z,y-1,x+1);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1); 
      }}
      
      if (o.fly) {
        g1=getR(z,y-1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1);
        g1=getR(z,y+1,x);if (g1&&(g1.len!==undefined)&&(g1.len<g0.len)) gs.push(g1);
      }
      
      //console.log(g1);
      //onsole.log(gs.length);
      if (gs.length==0) break;
      g0=gs[Conet.rani(gs.length)];//Math.floor(Math.random()*gs.length)];
      path.splice(0,0,//g0.gpos||
        g0);
      //path.push(g0.gpos||g0);
    }
    
    this.lenInit();
    
    for (var i=0;i<path.length;i++) {
      var g=path[i];//,x=g.x,y=g.y;
      //g.len=1;
      var y=g.y;
      for (var z=g.z;z<g.z+o.zw;z++) for (var x=g.x;x<g.x+o.xw;x++) {
        var g1=getR(z,y,x);
        if (g1) g1.len=1;
      }
    }
    //onsole.log(path);
    
    return path;
    //...
  }
  this.lenInit=function() {
    for (var k in rH) {
      var g=rH[k];
      delete(g.len);
      delete(g.gpos);
      delete(g.mark);
    }
    //...
  }
  this.calcLen=function(x,y,z,len,o) {
    var g=getR(z,y,x);
    
    //onsole.log('calcLen 0');
    if (g&&(g.len!=-1)&&(g.len<len)) return 0;
    
    //onsole.log('calcLen 1');
    for (var zh=z;zh<(z+o.zw);zh++) for (var yh=y;yh<(y+o.yw);yh++) for (var xh=x;xh<(x+o.xw);xh++) {
      if (!freeFor(getR(zh,yh,xh),o)) return 0;
    }
    
    //onsole.log('calcLen 2');
    
    if (!o.fly) {
    var ground=false;var g1;
    for (var zh=z;zh<(z+o.zw);zh++) for (var xh=x;xh<(x+o.xw);xh++) {
      if (!freeFor(g1=getR(zh,y-1,xh),o)) {
        if (g1&&g1.os&&(g1.os.length>0)) { } else
        ground=true;
      }
    }
    if (!ground) return 0;
    }
    
    //onsole.log('calcLen 3');
    
    
    if (!g) { g=initR(x,y,z); }
    g.len=len;
    
    var yh=y;
    for (var zh=z;zh<(z+o.zw);zh++) 
    for (var xh=x;xh<(x+o.xw);xh++) {
      var g0=getR(zh,yh,xh,1);
      if ((zh==z)&&(yh==y)&&(xh==x)) continue;
      if (g0.gpos) if (g0.gpos.len<len) continue;
      g0.gpos=g;
    }
    
    len++;
    var ret=1;
    if (len>=this.maxlen) return ret;
    
    //onsole.log('calcLen 4');
    
    
    var updown=self.moveUpdown&&!o.fly;
    
    var r0;
    r0=this.calcLen(x-1,y,z,len,o);if (updown) { if (r0==0) r0=this.calcLen(x-1,y+1,z,len,o);if (r0==0) r0=this.calcLen(x-1,y-1,z,len,o); }
    ret+=r0;
    //ret+=this.calcLen(x-1,y,z,len,o);
    r0=this.calcLen(x+1,y,z,len,o);if (updown) { if (r0==0) r0=this.calcLen(x+1,y+1,z,len,o);if (r0==0) r0=this.calcLen(x+1,y-1,z,len,o); }
    ret+=r0;
    //ret+=this.calcLen(x+1,y,z,len,o);
    r0=this.calcLen(x,y,z-1,len,o);if (updown) { if (r0==0) r0=this.calcLen(x,y+1,z-1,len,o);if (r0==0) r0=this.calcLen(x,y-1,z-1,len,o); }
    ret+=r0;
    //ret+=this.calcLen(x,y,z-1,len,o);
    r0=this.calcLen(x,y,z+1,len,o);if (updown) { if (r0==0) r0=this.calcLen(x,y+1,z+1,len,o);if (r0==0) r0=this.calcLen(x,y-1,z+1,len,o); }
    ret+=r0;
    
    if (o.fly) {
      r0=this.calcLen(x,y-1,z,len,o);ret+=r0;
      r0=this.calcLen(x,y+1,z,len,o);ret+=r0;
    }
    
    //ret+=this.calcLen(x,y,z+1,len,o);
    return ret;
  }
  this.checkMarkAttack=function(o,retArray,ps) {
    
    var ar=o.ar||1,y=o.y,a=retArray?[]:undefined;//,ow=o.w||1;
    for (var z=o.z-ar;z<o.z+o.zw+ar;z++) for (var x=o.x-ar;x<o.x+o.xw+ar;x++) 
      for (var y=o.y-1;y<=o.y+1;y++)
      {
      //if ((x<0)||(y<0)||(x>=gw)||(y>=gw)) continue;
      var dx=x<o.x?x-o.x:(x>o.x+o.xw-1?x-o.x-o.xw+1:0),
          dz=z<o.z?z-o.z:(z>o.z+o.zw-1?z-o.z-o.zw+1:0);
      if ((dx==0)&&(dz==0)) continue;
      //console.log(dx+' '+dy+' sum '+(Math.abs(dx)+Math.abs(dy)));
      var d=Math.abs(dx)+Math.abs(dz);
      if (d>ar) continue;
      if (o.arMin) if (d<o.arMin) continue;
      var g=getR(z,y,x);//,1);
      if (!g) continue;
      if (getR(z,y-1,x)) continue;//attack only on ground (for nao)
      var o0=undefined;
      if (g.os) if (g.os.length>0) {
        o0=g.os[0];
        if (o0.party===o.party) continue;//no friendly fire
        if (self.friendlyParty) if (self.friendlyParty(o0.party,o.party)) continue;
        if (retArray&&!o0.isvis) continue;//cannot calc invisible objs
      } 
      if (!o0&&ps&&ps.withObjs) continue;
      if (g.block) continue;
      if (retArray) a.push(g); else g.mark=1;
    }
    
    return a;
    //...
  }
  this.placeGrid=function(o,yes) {
    //onsole.log('deep.placeGrid '+o.x+' '+o.y+' '+o.z+' '+yes);
    //if (!yes) 
    //return;
    for (var z=o.z+o.zw-1;z>=o.z;z--) 
    for (var y=o.y+o.yw-1;y>=o.y;y--) 
    for (var x=o.x+o.xw-1;x>=o.x;x--) {
      var g=getR(z,y,x);if (!g) { g=initR(x,y,z); }
      var os=g.os;if (!os) { os=[];g.os=os; }
      if (yes) {
        os.splice(0,0,o);
      } else {
        var i=os.indexOf(o);
        if (i!=-1) os.splice(i,1);
      }
    }
    //...
  }
  function place(o,dx,dy,dz) {
    for (var z=o.xw-1;z>=0;z--)
    for (var y=o.yw-1;y>=0;y--)
    for (var x=o.xw-1;x>=0;x--)
      //if (!getR(round(o.z+dz+z),Math.floor(o.y+dy+y),round(o.x+dx+x))) return false; 
      if (!getR(round(o.z+dz+z),round(o.y+dy+y),round(o.x+dx+x))) return false; 
    return true;
  }
  this.place=place;//wahrscheinlich nur vorläufig public
  this.isNewView=function() {
    var r=newView;newView=false;
    return r;
  }
  this.sees=function(o0,o1) {
    if (o0.hito==o1) return true;
    //first rough distance check
    var d=dist(o0,o1);
    //onsole.log('deep.sees d='+d);
    d-=Math.max(o1.xw,Math.max(o1.yw,o1.zw))-1;
    d-=o0.eyeh;
    //onsole.log('deep.sees d='+d+' '+o0.viewlen);
    if (d>o0.viewlen) return false;
    
    //now check every grid of o1, first angle then viewline (ggf mit round?)
    for (var z=o1.z+o1.zw-1;z>=o1.z;z--)
    for (var x=o1.x+o1.xw-1;x>=o1.x;x--) {
      if (Math.abs(dAngle(o0,{x:x,z:z}))>o0.viewa) continue;
      //return true;
      for (var y=o1.y+o1.yw-1;y>=o1.y;y--) {
        var xh=x-o0.x,yh=y-o0.y-o0.eyeh,zh=z-o0.z,l=zh*zh+xh*xh+yh*yh;
        if (viewline(o0.x,o0.y+o0.eyeh,o0.z,xh,yh,zh,l)) return true;
        //if (viewline(round(o0.x),round(o0.y+o0.eyeh),round(o0.z),xh,yh,zh,l)) return true;
      }
    }
    
    
    return false;
  }
  function setViews(oaa) {
    for (var k in rH) if (rH.hasOwnProperty(k)) delete(rH[k].view);
    //getR(curs.z,curs.y,curs.x).view=true;
    var vs=[];
    //var o=curs;
    for (var oi=oaa.length-1;oi>=0;oi--) {
    var o=oaa[oi];
    if (o) {
    var rad=o.viewlen||7,rad2=rad*rad,c=0,radym=o.viewlendown||(rad+3),eyeh=o.eyeh||1,
        x0=round(o.x),y0=round(o.y+(o.eyeh||1)),z0=round(o.z);//Math.floor(o.x+0.5),y0=Math.floor(o.y+0.5),z0=Math.floor(o.z+0.5);
    //onsole.log('deep.setView '+x0+' '+y0+' '+z0);
    var oa=o.a;
    if (o.roty!==undefined) oa=-o.roty+PI/2;
    for (var yh=-radym;yh<=rad;yh++) {
    var rady=yh>=-eyeh?rad:radym,rady2=rady*rady;
    for (var zh=-rady;zh<=rady;zh++) 
    for (var xh=-rady;xh<=rady;xh++) {
      var l=zh*zh+xh*xh+yh*yh;
      if (l>rady2) continue;
      var x1=x0+xh,y1=y0+yh,z1=z0+zh;
      var r=getR(z1,y1,x1);
      if (!r) continue;
      
      if (l>0) {
        if ((zh!=0)||(xh!=0)) {
          var a=Math.atan2(zh,xh);
          var da=oa-a;
          if (da>PI) da-=2*PI;
          if (da<-PI) da+=2*PI;
          if (Math.abs(da)>(o.viewa||1.57)) continue;
        }
        //check view line
        if (!viewline(x0,y0,z0,xh,yh,zh,l)) continue;
        //var vx0=x0+0.5,vy0=y0+0.5,vz0=z0+0.5,lr=Math.sqrt(l),dx=xh/lr,dy=yh/lr,dz=zh/lr;
        //var view=true;
        //for (var s=0;s<lr;s++) {
        //  if (getR(Math.floor(vz0+s*dz),Math.floor(vy0+s*dy),Math.floor(vx0+s*dx))) continue;
        //  view=false;break;
        //}
        //if (!view) continue;
      }
          
      c++;
      r.view=true;
      r.wview=true;
      vs.push(r);
    }
    }
    //onsole.log('deep.setViews '+c);
    //onsole.log(o);
    }}
    //onsole.log(oa);
    var change=false;
    if (vs.length!=ovs.length) change=true; else 
    for (var i=0;i<ovs.length;i++) if (!ovs[i].view) { change=true;break; }
    ovs=vs;
    return change;
    //console.log('Deep.setView c='+c);
    //img=null;
  }
  function setView(o) {
    return setViews([o]);
  }
  this.toggleCrouch=function(o) {
    if (o.crouch) {
      o.yw=2;
      if (!place(o,0,0,0)) {
        o.yw=1;
        return false;
      }
      o.eyeh=1;
    } else {
      o.eyeh=0;
      o.yw=1;
    }
    o.crouch=!o.crouch;
    //onsole.log('toggleCrouch '+o.crouch);
    newView=true;
    return true;
  }
  this.calc=function(os,curs,newView0,dtp,viewall,retNewView) {
    dt=dtp;
    if (lastcurs!==curs) {
      lastcurs=curs;
      if (curs) newView=true;
    }
    if (curs) curso=curs;
    
    var x,y,z,dda;
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      o.running=false;
      o.moving=false;
      //if (o.health>0) {
      if (o.tick) o.tick();
      if (o.health>0) {
      if (o.pdest!==undefined) {
        var p=o.pdest,dx=p.x-o.x,dy=p.y-o.y,dz=p.z-o.z;
        if ((dx*dx+dy*dy+dz*dz)<0.3) {
          delete(o.pdest);delete(o.adest);
        } else {
        var a=Math.atan2(dz,dx);
        //onsole.log(o.pdest);
        //onsole.log(o);
        //onsole.log('deep.calc pdest a='+a);
        o.adest=a;//-PI/2;
        //delete(o.pdest);
        if (dy>0) o.jumpt=1;
        }
      }
      if (o.adest!==undefined) {
        dda=o.adest-o.a;
        while (dda>=PI) dda-=2*PI;
        while (dda<-PI) dda+=2*PI;
        var adda=Math.abs(dda);
        //if (adda<0.1) delete(o.adest);
        if (dda>0) o.da=1; else o.da=-1;
        if (o.pdest||o.runOnA) if (adda<0.5) o.d=o.v;
      }
      if (o.da!=0) {
        var da=o.da*dt*0.005;//*0.5;
        if (o.adest!==undefined) {
          if (Math.abs(dda)<Math.abs(da)) {
            da=dda;
            delete(o.adest);
            o.da=0;
          }
        }
        o.a+=da;
        while (o.a>=PI) o.a-=2*PI;
        while (o.a<-PI) o.a+=2*PI;
        o.running=true;
        if (o==curs) newView=true;
      }
      var upstairs=false;
      if (o.d!=0) {
        var d=dt*o.d*(o.crouch?0.5:1),dx=d*Math.cos(o.a),dz=d*Math.sin(o.a),dzh=dz,dxh=dx,r=0.4;
        if (dzh<0) dzh-=r; else if (dzh>0) dzh+=r;
        if (dxh<0) dxh-=r; else if (dxh>0) dxh+=r;
        
        //if (!getR(round(o.z+dzh),round(o.y),round(o.x+dxh))||!getR(round(o.z+dz),round(o.y),round(o.x+dx))) {
        //  if (getR(round(o.z),round(o.y),round(o.x+dxh))) { dz=0;dzh=0; } else if (getR(round(o.z+dzh),round(o.y),round(o.x))) { dx=0;dxh=0; }}
        //if (getR(round(o.z+dzh),round(o.y),round(o.x+dxh))) {
        
        if (!place(o,dxh,0,dzh)||!place(o,dx,0,dz)) {
          upstairs=place(o,dxh,1,dzh);
          if (upstairs) o.jumpt=150;
          //console.log(placeUp);
          if (place(o,dxh,0,0)) { dz=0;dzh=0; } 
          else if (place(o,0,0,dzh)) { dx=0;dxh=0; }
        }
        if (place(o,dxh,0,dzh)) {
        
          o.x+=dx;o.z+=dz;
          //curs.x+=d*Math.cos(curs.a);curs.z+=d*Math.sin(curs.a);
          o.running=true;
          if (o==curs) {
            //centerScreen(o);
            newView=true;
          }
        }
      }
    
      var dy=dt*(((o.jumpt>0)
        //||upstairs
        )?0.01:-0.005);
      if (place(o,0,dy+(dy>0?0.5:-0.5),0)&&place(o,0,dy,0)) { //0.5 is similar to radius r above
        o.y+=dy;
        o.moving=true;
        if (o==curs) newView=true;
      } else if (o.jumpt>0) o.jumpt=0;
      o.jumpt=Math.max(0,o.jumpt-dt);
      //if o.notvisible continue;
      }
      var r=getR(round(o.z),round(o.y),round(o.x));
      
      if (o.running) o.moving=true;
      
      if (r) {
        //r.obj=1;
        if (!r.view&&!viewall&&!o.alwaysShow) { o.alpha=Math.max(0,o.alpha-0.001*dt);if (o.alpha==0) continue; } else 
          o.alpha=Math.min(1,o.alpha+0.003*dt);
      }
    }
    //curs.newView=newView;
    if (newView||newView0) {
      //centerScreen(curs);
      //img=null;
      //setView();
      //this.setView(curs);
      newView=false;
      //img=null;
      var changeView=setView(curs);
      return retNewView?1:changeView;
    }
    return 0;
    //...
  }
  this.dista=function(o0,o1) {
    //---
    var dx=o0.x-o1.x;
    if (o1.xw) {
      //onsole.log('deep.dist '+dx+' '+o1.xw);
      if (dx>0) dx=Math.max(0,dx-(o1.xw-1));
    }
    var dy=o0.y-o1.y;
    if (o1.yw) {
      //onsole.log('deep.dist '+dy+' '+o1.yw);
      if (dy>0) dy=Math.max(0,dy-(o1.yw-1));
    }
    var dz=o0.z-o1.z;
    
    if (o1.zw) {
      //onsole.log('deep.dist '+dz+' '+o1.zw);
      if (dz>0) dz=Math.max(0,dz-(o1.zw-1));
    }
    
    return Math.abs(dx)+Math.abs(dy)+Math.abs(dz);
    //...
  }
  function dist(o0,o1) {
    var dx=o0.x-o1.x;
    if (o1.xw) {
      //onsole.log('deep.dist '+dx+' '+o1.xw);
      if (dx>0) dx=Math.max(0,dx-(o1.xw-1));
    }
    var dy=o0.y-o1.y;
    if (o1.yw) {
      //onsole.log('deep.dist '+dy+' '+o1.yw);
      if (dy>0) dy=Math.max(0,dy-(o1.yw-1));
    }
    var dz=o0.z-o1.z;
    
    if (o1.zw) {
      //onsole.log('deep.dist '+dz+' '+o1.zw);
      if (dz>0) dz=Math.max(0,dz-(o1.zw-1));
    }
    
    
    return Math.sqrt(dx*dx+dy*dy+dz*dz);
  }
  function dAnglea(o,a) {
    while ((a-o.a)>PI) a-=PI*2;
    while ((a-o.a)<-PI) a+=PI*2;
    var da=a-o.a;
    return da;
  }
  function dAngle(o,pos,dea) {
    var dx=pos.x-o.x;
    var dz=-pos.z+o.z;
    //var l=Math.sqrt(dx*dx+dz*dz);
    var a=Math.atan2(dx,dz)-PI/2+(dea===undefined?0:dea);
    return dAnglea(o,a);
  }
  this.tickBane=function() {
    var o=this,r=getR(round(o.z),round(o.y),round(o.x)),
        view=r?r.view:false,
        da;
    
    //if (r) r.obj=1;
    //o.running=sees(o,curs);
    //return;
    
    o.da=0;
    o.d=0;
    o.attack=false;
    
    if (!curso) return;
    var curs=curso;
    
    
    o.alwaysShow=dist(o,curs)<4;
    if (o.health<=0) return;
    
    if (curs.health==0) return;
    var see=//(o.hito==curs)||
      self.sees(o,curs);
    
    //o.alwaysShow=dist(o,curs)<4;
    
    if (see) {
      //o.running=1;
      //o.aim={x:curs.x+0.5,y:curs.y+0.5,z:curs.z+0.5};
      o.aim={x:curs.x,y:curs.y,z:curs.z};
      o.tsee=0;
      delete(o.hito);
    } 
    
    
    if (!o.aim) return;
    
    var flee=view&&!curs.crouch;
    if (flee) da=dAngle(o,o.aim,PI); else 
    da=dAngle(o,o.aim);
    
    //console.log(da);
    if (Math.abs(da)>0.1) o.da=da>0?1:-1;
    
    if (da<0.2) {
      var d=dist(o,o.aim);
      if (flee||
        (d>((see&&!flee)?(o.xw+curs.xw)/2+1:0))) {
        //if (!view) delete(o.hito);
        //onsole.log('deep.tickBane '+(o.xw+curs.xw)+' '+o.hito);
        o.d=o.v;//0.005;//025;
      } else if (see) { 
        //console.log('tickBane attack');
        o.attack=true; 
      } 
      if ((d<0.5)&&!see) {
        o.tsee+=dt;
        if (o.tsee>500) delete(o.aim);
      }
      //else if (!see) delete(o.aim);
    }
    //o.t+=dt;
    //if (o.t>500) { o.da=o.da==1?-1:1;o.t=0; }
    //o.a+=0.001*dt;
  }
  this.setRH=function(h) {
    rH=h;newView=true;
    this.rH=rH;
  }
  this.checkObjVis=function(o) {
    //...
    for (var z=o.z+o.zw-1;z>=o.z;z--)
    for (var y=o.y+o.yw-1;y>=o.y;y--)
    for (var x=o.x+o.xw-1;x>=o.x;x--)
      if (getR(z,y,x).view) { o.isvis=true;return true; }
    o.isvis=false;
    return false;
    //...
  }
  
  this.getFreePositions=function() {
    //---
    var pa=[];
    for (var k in rH) {
      var g=rH[k];
      if (g.os&&g.os.length>0) continue;
      if (getR(g.z,g.y-1,g.x)) continue;
      if (g.sky) continue;
      if (g.y!=0) continue;
      pa.push(g);
      //onsole.log(g);
    }
    return pa;
    //...
  }
  this.setBlocks=function(blocks) {
    //----
    for (var i=0;i<blocks.length;i++) {
      var b=blocks[i];
      for (var z=b.z;z<b.z+b.zw;z++)
      for (var y=b.y;y<b.y+b.yw;y++)
      for (var x=b.x;x<b.x+b.xw;x++) {
        if (b.i) {
          delete rH[dkey(x,y,z)];
          continue;
        }
        var g=getR(z,y,x,1);
        //g.block=1;
        if (b.dbg) g.dbg=1;
        if (b.sky) g.sky=1;
        //if (b.ground) g.ground=1;
        g.wview=1;
      }
    }
    //...
  }
  
  this.dist=dist;
  this.dAngle=dAngle;
  this.rH=rH;this.dkey=dkey;
  this.getR=getR;
  this.setViews=setViews;
  //----
  console.log('Deep '+version);//+' '+dist);//...
}

//fr o,1
//fr o,1,25
//fr o,1,26
//fr p,45,46
