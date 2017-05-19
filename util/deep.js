//----
var Deep=function(ps) {
  var rH=ps.rH?ps.rH:undefined,PI=Math.PI,
      version='0.69 ',//FOLDORUPDATEVERSION
      newView=true,ovs=[],lastcurs=undefined,curso=undefined,
      self=this,dt=0;
  function dkey(x,y,z) {
    return z+' '+y+' '+x;//...
  }
  function getR(z,y,x) {
    return rH[dkey(x,y,z)];
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
  
  
  function setView(o) {
    for (var k in rH) if (rH.hasOwnProperty(k)) delete(rH[k].view);
    //getR(curs.z,curs.y,curs.x).view=true;
    var vs=[];
    //var o=curs;
    if (o) {
    var rad=o.viewlen,rad2=rad*rad,c=0,
        x0=round(o.x),y0=round(o.y+o.eyeh),z0=round(o.z);//Math.floor(o.x+0.5),y0=Math.floor(o.y+0.5),z0=Math.floor(o.z+0.5);
    //onsole.log('deep.setView '+x0+' '+y0+' '+z0);
    for (var zh=-rad;zh<=rad;zh++) for (var yh=-rad;yh<=rad;yh++) for (var xh=-rad;xh<=rad;xh++) {
      var l=zh*zh+xh*xh+yh*yh;
      if (l>rad2) continue;
      var x1=x0+xh,y1=y0+yh,z1=z0+zh;
      var r=getR(z1,y1,x1);
      if (!r) continue;
      
      if (l>0) {
        if ((zh!=0)||(xh!=0)) {
          var a=Math.atan2(zh,xh);
          var da=o.a-a;
          if (da>PI) da-=2*PI;
          if (da<-PI) da+=2*PI;
          if (Math.abs(da)>o.viewa) continue;
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
    
    var change=false;
    if (vs.length!=ovs.length) change=true; else 
    for (var i=0;i<ovs.length;i++) if (!ovs[i].view) { change=true;break; }
    ovs=vs;
    return change;
    //console.log('Deep.setView c='+c);
    //img=null;
  }
  
  this.toggleCrouch=function(o) {
    if (o.crouch) {
      o.yw=2;
      if (!place(o,0,0,0)) {
        o.yw=1;
        return;
      }
      o.eyeh=1;
    } else {
      o.eyeh=0;
      o.yw=1;
    }
    o.crouch=!o.crouch;
    //onsole.log('toggleCrouch '+o.crouch);
    newView=true;
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
      if (o.tick) o.tick();
      if (o.adest!==undefined) {
        dda=o.adest-o.a;
        while (dda>=PI) dda-=2*PI;
        while (dda<-PI) dda+=2*PI;
        if (dda>0) o.da=1; else o.da=-1;
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
      if (o.d!=0) {
        var d=dt*o.d*(o.crouch?0.5:1),dx=d*Math.cos(o.a),dz=d*Math.sin(o.a),dzh=dz,dxh=dx,r=0.4;
        if (dzh<0) dzh-=r; else if (dzh>0) dzh+=r;
        if (dxh<0) dxh-=r; else if (dxh>0) dxh+=r;
        
        //if (!getR(round(o.z+dzh),round(o.y),round(o.x+dxh))||!getR(round(o.z+dz),round(o.y),round(o.x+dx))) {
        //  if (getR(round(o.z),round(o.y),round(o.x+dxh))) { dz=0;dzh=0; } else if (getR(round(o.z+dzh),round(o.y),round(o.x))) { dx=0;dxh=0; }}
        //if (getR(round(o.z+dzh),round(o.y),round(o.x+dxh))) {
        
        if (!place(o,dxh,0,dzh)||!place(o,dx,0,dz)) {
          if (place(o,dxh,0,0)) { dz=0;dzh=0; } else if (place(o,0,0,dzh)) { dx=0;dxh=0; }}
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
    
      var dy=dt*(o.jumpt>0?0.01:-0.005);
      if (place(o,0,dy+(dy>0?0.5:-0.5),0)&&place(o,0,dy,0)) { //0.5 is similar to radius r above
        o.y+=dy;
        o.moving=true;
        if (o==curs) newView=true;
      } else if (o.jumpt>0) o.jumpt=0;
      o.jumpt=Math.max(0,o.jumpt-dt);
      //if o.notvisible continue;
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
  
  function dist(o0,o1) {
    var dx=o0.x-o1.x;
    var dy=o0.y-o1.y;
    var dz=o0.z-o1.z;
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
    
    if (!curso) return;
    var curs=curso;
    var see=self.sees(o,curs);
    
    o.alwaysShow=dist(o,curs)<4;
    
    if (see) {
      //o.running=1;
      //o.aim={x:curs.x+0.5,y:curs.y+0.5,z:curs.z+0.5};
      o.aim={x:curs.x,y:curs.y,z:curs.z};
      o.tsee=0;
    } 
    
    
    if (!o.aim) return;
    
    
    if (view)  da=dAngle(o,o.aim,PI); else 
    da=dAngle(o,o.aim);
    
    //console.log(da);
    if (Math.abs(da)>0.1) o.da=da>0?1:-1;
    
    if (da<0.2) {
      var d=dist(o,o.aim);
      if (view||
        (d>(see?2:0))) o.d=o.v;//0.005;//025;
        
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
  }
  
  //----
  console.log('Deep v.'+version);//...
}

//fr o,1
//fr o,1,28
//fr p,18,31
