//---
function Panim(ps) {
  //---
  const self=this,th0=new Bullet.Transform(),th1=new Bullet.Transform(),
        tmp=new Vecmath.Vec3(),PI=Math.PI,
        tempMatrix=new THREE.Matrix4(),euler=new THREE.Euler(0,1,0,'YXZ');
  
  this.panos=[];
  this.a=[];
  
  this.calc=function(dt) {
    //---
    
    const tsd0=self.tsd0,gpad=self.xrUtil?self.xrUtil.gp1:undefined;
    
    if (1) {
    //if (o0) 
    for (let o0 of self.panos) {
      let o=o0;
      
      const gp=o0.gravityPull;
      if (gp&&gp.ileft) {
    
        o.o.bones[gp.ileft].co.getWorldTransform(th0);const p0=th0.origin;
        o.o.bones[gp.iright].co.getWorldTransform(th1);const p1=th1.origin;
        if (!o.cpos) o.cpos={};
        o.cpos.x=(p0.x+p1.x)/2;o.cpos.y=(p0.y+p1.y)/2;o.cpos.z=(p0.z+p1.z)/2;
        const dx=p0.x-p1.x,dz=p0.z-p1.z,ang=Math.atan2(dz,dx);let f=gp.xz||50;
        let ah,g0;
        //console.log(ang);
    
        if (o===self.stick15o) {
          let dx=0,dy=0;
          if (gpad) { dx=gpad.axes[2];dy=gpad.axes[3]; }
          else { dx=tsd0.dx;dy=tsd0.dy; }
          
          if ((dx!=0)||(dy!=0)) {
             //onsole.log(tsd0.dx+' '+tsd0.dy);
            let ay=0;
            if (self.camera) {
              tempMatrix.identity().extractRotation(self.camera.matrixWorld);
              euler.setFromRotationMatrix(tempMatrix);
              ay=euler.y;
              //onsole.log(euler);
              //console.log(euler.x+','+euler.y+','+euler.zay+','+euler.order+'  '+self.controls.getAzimuthalAngle());
            } else ay=self.controls.getAzimuthalAngle();
             
            const a2=Math.atan2(dy,dx)-PI/2-ay,//view
                  da=Conet.dAng(a2,ang);
            //onsole.log(da);
            const mda=0.15;
            o.turnLeft=da<-mda;
            o.turnRight=da>mda;
            o.moveFore=Math.abs(da)<=mda;
            //onsole.log(mleft.on+' '+mright.on+' '+da);
          } else { o.turnLeft=false;o.turnRight=false;o.moveFore=false; }
          //o.turnLeft=mleft.on;
          //o.turnRight=mright.on;
          //o.moveFore=mforward.on;
          //o.moveBack=mback.on;
        } else if (o.panai) {
          o.panchanget=(o.panchanget||0)+dt;
          if ((o.panchanget>3000)&&o.o.pans&&self.stick15o) {
            const p1=self.stick15o.cpos,p0=o.cpos;
            if (p1&&p0) {
              const dx=p1.x-p0.x,dz=p1.z-p0.z,a2=Math.atan2(dz,dx)-PI/2,
                    da=Conet.dAng(a2,ang),d2=dx*dx+dz*dz;
              const mda=0.15;
              o.turnLeft=da<-mda;
              o.turnRight=da>mda;
              o.moveFore=(Math.abs(da)<=mda)&&(d2>1500);
              //onsole.log(d2);
              //o0.panchanget=0;
            }
          }
        }
    
        let al=(o.turnLeft?-1:0)+(o.turnRight?1:0),ar=al;
        if (al!=0) {
          if (gp.panTurn) {
            //onsole.log('panTurn nao '+gp.panTurn);
            //onsole.log(o);
            //onsole.log(o[gp.panTurn]);
            self.start(o,o.o[gp.panTurn]);
          }
          if (gp.fTurn) f=gp.fTurn;
          o.wasMnav=true;
        } else if (o.moveFore) { 
          al=1;ar=-1; 
          //onsole.log('ileft');
          //onsole.log(gp);
          if (gp.panForward) self.start(o,o.o[gp.panForward]);
          o.wasMnav=true;
        } else if (o.moveBack) { 
          if (gp.fBack) f=gp.fBack;
          al=-1;ar=1; 
        } else {
          if (o.wasMnav&&gp.panIdle&&o.pan) self.start(o,o.o[gp.panIdle]);
          o.wasMnav=false;
        }
        if (al!=0) {
          ah=ang+al*Math.PI/2;g0=o.o.bones[gp.ileft].co.gravity;g0.x=Math.cos(ah)*f;g0.z=Math.sin(ah)*f;//12
          ah=ang-ar*Math.PI/2;g0=o.o.bones[gp.iright].co.gravity;g0.x=Math.cos(ah)*f;g0.z=Math.sin(ah)*f;//13
        } else {
          g0=o.o.bones[gp.ileft].co.gravity;g0.x=0;g0.z=0;//12
          g0=o.o.bones[gp.iright].co.gravity;g0.x=0;g0.z=0;//13
        }
    
      } else {
    //   let o=o0,mnav=mleft.on||mright.on||mforward.on||mback.on||mup.on;
    //   if (mnav||o.wasMnav) {
    //     var dx=(mleft.on?-1:0)+(mright.on?1:0),
    //       dz=(mback.on?1:0)+(mforward.on?-1:0),
    //       dy=(mup.on?gp.yUp:gp.yDown);//3*5:-1*5
    //     var b=o.o.bones[gp.i],f=gp.xz||7;//7//1 //f was 90 //250
    //     b.co.gravity.x=dx*f;
    //     b.co.gravity.y=dy;
    //     b.co.gravity.z=dz*f;
    //     //console.log(b.co.gravity.y);
    //     o.wasMnav=mnav;
    //   }
      }
      
      if (o0.env&&(o0.pani!==undefined)) {
        var t6=o0.pant;
        t6+=dt;
        while (1) {
          var an=o0.pan[o0.pani];
          var e=Bullet.BulletGlobals.SIMD_EPSILON;
          if (t6<an.t) { 
            //---interpol
            //for (var ab of an.a) {
            for (var abi=an.a.length-1;abi>=0;abi--) {
              var ab=an.a[abi];
              if (!ab.interpol) continue;
              var constr=o0.o.j6dofs[ab.i];
    
              if (!constr.og) {
                var al=constr.angularLimits;
                constr.og=[
                  new Vecmath.Vec3(al[0].loLimit,al[1].loLimit,al[2].loLimit),
                  new Vecmath.Vec3(al[0].hiLimit,al[1].hiLimit,al[2].hiLimit),
                ];
              }
    
    
              //onsole.log('anim '+JSON.stringify(ab));
              var ab0=o0.pan[(o0.pani-1+o0.pan.length)%o0.pan.length].a[abi];
              var x0=ab0.x||0,y0=ab0.y||0,z0=ab0.z||0,
                  x1=ab.x||0,y1=ab.y||0,z1=ab.z||0,
                  f1=t6/an.t,f0=1-f1;
                  x=(x0*f0+x1*f1),y=(y0*f0+y1*f1),z=(z0*f0+z1*f1);
              //onsole.log(ab.dz);
              tmp.set3(x-e,y-e,z-e-(ab.dz||0));
              constr.setAngularLowerLimit(tmp);
              tmp.set3(x+e,y+e,z+e+(ab.dz||0));
              constr.setAngularUpperLimit(tmp);    
            }
            
            break;
          }
          //onsole.log('anim '+animi);
          for (var ab of an.a) {
            var constr=o0.o.j6dofs[ab.i];
    
            if (ab.gy) {
              if (o0.o.bones[ab.i].co.gravity.y!=ab.gy) {
                //onsole.log('setting gravity.y from '+o0.o.bones[ab.i].co.gravity.y+' to '+ab.gy);
                o0.o.bones[ab.i].co.gravity.y=ab.gy;
              }
              //continue;
            }
            
            if (!constr.og) {
              var al=constr.angularLimits;
              constr.og=[
                new Vecmath.Vec3(al[0].loLimit,al[1].loLimit,al[2].loLimit),
                new Vecmath.Vec3(al[0].hiLimit,al[1].hiLimit,al[2].hiLimit),
              ];
              //console.log('constr.og');
              //console.log(constr.og);
            }
    
            
            //onsole.log('anim '+JSON.stringify(ab));
            if (ab.x!==undefined||ab.y!==undefined||ab.z!=undefined
              ||ab.dx!=undefined||ab.dy!=undefined||ab.dz!=undefined) 
            {
            tmp.set3(
              ab.x||0-e-ab.dx||0,
              ab.y||0-e-ab.dy||0,
              ab.z||0-e-ab.dz||0
            );
            constr.setAngularLowerLimit(tmp);
            tmp.set3(
              ab.x||0+e+ab.dx||0,
              ab.y||0+e+ab.dy||0,
              ab.z||0+e+ab.dz||0
            );
            constr.setAngularUpperLimit(tmp);
            }
          }
          t6-=an.t;
          if (an.f) an.f();//console.log('pani='+o0.pani);
          if (an.toOg) {
            for (var constr of o0.o.j6dofs) {
              if (!constr.og) continue;
              constr.setAngularLowerLimit(constr.og[0]);
              constr.setAngularUpperLimit(constr.og[1]);
            }
            //onsole.log('toOg');
          }
          o0.pani=(o0.pani+1)%o0.pan.length;
        }
        o0.pant=t6;
      }
    }
    }
    
    if (0) {
    t6+=dt;
    if (t6>500) {
      if (o0.env) {
        //onsole.log('game.calc. '+o0.o.j6dofs);
        var e=Bullet.BulletGlobals.SIMD_EPSILON,constr,
            va=[
              [-e,-e,-e,e,e,e],
              [-e+1,-e,-e,e+1,e,e]
            ];
            
        i6=(i6+1)%va.length;
        var ah=va[i6];
    
        constr=o0.o.j6dofs[0];
        tmp.set3(ah[0],ah[1],ah[2]);
        constr.setAngularLowerLimit(tmp);
        tmp.set3(ah[3],ah[4],ah[5]);
        constr.setAngularUpperLimit(tmp);    
        constr=o0.o.j6dofs[1];
        tmp.set3(ah[0],ah[1],ah[2]);
        constr.setAngularLowerLimit(tmp);
        tmp.set3(ah[3],ah[4],ah[5]);
        constr.setAngularUpperLimit(tmp);    
      }
      t6=0;
    }
    }
    
    //console.log('baseUnit.game.calc');
    //if (!o.ps) return;
    //if (1) return;
    for (var i=0;i<self.a.length;i++) { const o=self.a[i];
    
    var o5=o.o;
    if (!o5) return;
    //console.log('baseUnit.game.calc');
    var oo=o5.o,pos=o.pos;
    oo.x=pos.x;
    //onsole.log('baseunit.game.calc pos='+f4(pos.x)+' '+f4(pos.y)+' '+f4(pos.z));
    //oo.y=pos.y;
    oo.z=pos.z;
    oo.rot=o.roty;
    
    }
    //oo.go.rotofs=o.rotofs;
  }
  //---
  this.objOnload=function(o) {
    
    //onsole.log(o.bulletCfg);
    if (o.ps.diff) o.meshes[0].diff=o.ps.diff;
    
    //onsole.log(o);
    
    o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
    //Pd5.bulletize(o);
    Pd5.bulletize(o,{damp0:1,damp1:1});
    
    
    var bc=o.bulletCfg,v;
    if (bc) {
      for (var b of bc.bones) {
        //onsole.log(b);
        //onsole.log(o.bones);
        var co=o.bones[b.i].co;
        if ((v=b.inverseMass)!==undefined) {
          //console.log(co.inverseMass+' '+v);
          co.inverseMass=v;
        }
        if ((v=b.gravityY)!==undefined) co.gravity.y=v;
      }
      //onsole.log(o.bones);
      //if (1) return;
      o.pans=[];
      for (var p of bc.pans) {
        o[p.name]=p.a;
        o.pans.push(p);//.a);
      }
      o.ps.gravityPull=bc.gravityPull;
      //console.log(o);
      //return;
    }
    
    if (o.ps.panOnload) o.ps.panOnload();
    
    //...
  }
  this.obj=function(x,z,ps) {
    var o0;
    
    //a.push( 
    o0=Conet.hcopy(ps,{
      fn:ps.fn
      ,pos:new THREE.Vector3(x,-1.8,z),health:5,rotofs:Math.PI
      ,anim:'idle'
      ,scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
      ,onload:ps.onload||self.objOnload//,inverseMass:ps.inverseMass||100,panps:ps
      });//);
    //panos.push(o0);
    self.panos.push(o0);self.a.push(o0);
    return o0;
    
    //...
  }
  this.start=function(o,pan) {
    //anim=pan;//o0.o.panTurnLeft;
    //animi=0;t6=0;
    //onsole.log(pan);
    if (o.pan===pan) return;
    
    if (!o.env) {//--- this was checkstartanims()
      o.env=true;
      o.o.anim=undefined;
      o.o.animInt=undefined;
    }
    
    
    //for (var b of o.o.bones) if (b.co) b.co.gravity.y=-30;
    
    if (o.pan)
    for (let b of pan[0].a) if (b.gy!==undefined) o.o.bones[b.i].co.gravity.y=b.gy;
    
    //o0.o.bones[ab.i].co.gravity.y=ab.gy;
    
    
    o.pan=pan;
    o.pani=0;
    o.pant=0;
    //o.o.bones[7].co.gravity.y=300;
    //...
  }
  this.onload=function() {
    //---
    var o=this.o;
    /*
    if (this===stick15o) {
      const gp=this.gravityPull;
      gp.panForward='panForward';//---not panDown
      //o.panForward[0].a.push({i:7,gy:350});
      o.panForward=[
        {t:200,a:[{i:0,x:1.8,dz:0.5},{i:2,x:-1.875},{i:1,x:0.25,dz:0.5},{i:3,x:-0.25},{i:4,x:0},{i:5,x:0},{i:7,gy:280}]}
       //,{t:200,a:[{i:0,x:0.75,dz:0.5},{i:2,x:-1.25},{i:1,x:0.25,dz:0.5},{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
       ,{t:300,a:[{i:0,x:0.5,dz:0}   ,{i:2,x:-0.25},{i:1,x:-0.25,dz:0} ,{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
       ,{t:200,a:[{i:0,x:0.25,dz:0.5},{i:2,x:-0.25},{i:1,x:1.8,dz:0.5},{i:3,x:-1.875},{i:4,x:0},{i:5,x:0}]}
       ,{t:300,a:[{i:0,x:-0.25,dz:0} ,{i:2,x:-0.25},{i:1,x:0.5,dz:0}   ,{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
      ];
      console.log(o.panForward);
    }
    */
    //console.log(o===stick15o);
    //console.log(this===stick15o);
    
    setTimeout(function() {
      //panStart(o.ps,o.panIdle);//...
      
      if (!o.ps.panOnloadNostart) 
        self.start(o.ps,o.panIdle);//...
      else {
        o.ps.env=true;
        o.anim=undefined;
        o.animInt=undefined;
      }
      //for (var b of o.bones) if (b.co) b.co.gravity.y=-5;
      
      
    }
    ,1500);
    //...
  }
  //...
}


console.log('Panim v.0.47 ');//FOLDORUPDATEVERSION
//...
//fr o,1
//fr o,1,8
//fr o,1,11
//fr o,1,13,20
//fr p,40,4
