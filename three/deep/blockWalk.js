//----
console.log('BlockWalk 1.455 ');//FOLDORUPDATEVERSION
var BlockWalk=function(bwps) {
  //---
  const self=this,PI=Math.PI;
  let tempMatrix,euler,tempv;
  
  this.tweens=[];
  this.blockMeshPos={x:0,y:0,z:0};
  this.units=[];
  
  function len2(x0,y0,x1,y1) {
    var dx=x1-x0,dy=y1-y0;
    return dx*dx+dy*dy;
  }
  
  
  function checkWalk(u,dx,dz) {
    //---
    //onsole.log('checkWalk 0');
    if (u.posytw&&!u.posytw.ended) return false;
    const gw=self.gw,gh=self.gh||gw,bmp=self.blockMeshPos,blockAt=self.blockAt,player=self.player,updatePlayerView=self.updatePlayerView;
    //onsole.log(updatePlayerView+' '+player);
    let pos=u.m.position,x=pos.x+dx,z=pos.z+dz;
    const xi=Math.floor((x-bmp.x)/gw+0.5+(dx>0?0.5:-0.5)),
          yi=Math.floor((pos.y-bmp.y)/gh-0.5),
          zi=Math.floor((z-bmp.z)/gw+0.5+(dz>0?0.5:-0.5));
    const xj=Math.floor((x-bmp.x)/gw+0.5),
          yj=Math.floor((pos.y-bmp.y)/gh-0.5),
          zj=Math.floor((z-bmp.z)/gw+0.5);
    if (0) { 
      console.log('x:'+xj+' y:'+yj+' z:'+zj);
      //console.log('gw='+gw+' bmp='+JSON.stringify(bmp));
      console.log(blockAt(xj,yj,zj));
      console.log(blockAt(xj,yj-1,zj));
      console.log(blockAt(xj,yj-2,zj));
      return; 
    }
    let ret;
    if (u.bullet) {
      ret=!blockAt(xi,yi,zi)&&!blockAt(xj,yj,zj);
    } else {
      ret=!blockAt(xi,yi,zi)&&!blockAt(xj,yj,zj,u
        )&&!blockAt(xj,yj+1,zj);
      //onsole.log('ret='+ret);
      if (ret) { 
        if (!blockAt(xi,yi-1,zi)&&!blockAt(xj,yj-1,zj)) {
          if (blockAt(xj,yj-2,zj)) {//dont fall down
            if (0) pos.y=(yj-1+0.5)*gw;
            else self.tweens.push(u.posytw={o:pos,key:'y',value:(yj-1+0.5)*gh+bmp.y,t:100,onset:((u===player)?updatePlayerView:undefined)});
            //posyt=0;
          } else 
            ret=false;
        }
      } 
      else //if (!ret) 
      if (!blockAt(xi,yi+1,zi)&&!blockAt(xj,yj+1,zj)&&!blockAt(xi,yi+2,zi)&&!blockAt(xj,yj+2,zj)) {
        if (0) pos.y=(yj+1+0.5)*gw;
        else self.tweens.push(u.posytw={o:pos,key:'y',value:(yj+1+0.5)*gh+bmp.y,t:100,onset:((u===player)?updatePlayerView:undefined)});
        //posyt=0;
        ret=true;
      }
    }
    if (ret) {
      //---ggf collr
      let r0=u.collr;
      if (r0) {
        for (let uh of self.units) {
          if (uh===u) continue;
          if (!(r1=uh.collr)) continue;
          let d=len2(x,z,uh.pos.x,uh.pos.z),md=r0+r1;
          if (d>=md*md) continue;
          d=Math.sqrt(d);
          x=uh.pos.x+(x-uh.pos.x)*md/d;
          z=uh.pos.z+(z-uh.pos.z)*md/d;
          //console.log('collr check');
        }
      }
    
    
      pos.x=x;pos.z=z; 
      if (u===player) {
        updatePlayerView();
    /*
        const t=controls.target,p=controls.object.position;
        if (!mIsoView.checked) {
          mat0.rotY(u.m.rotation.y);
          ph0.set3(0,0,gw*3);
          mat0.transformV3(ph0,ph1);
          p.set(pos.x+ph1.x,pos.y+ph1.y,pos.z+ph1.z);//p
          ph0.set3(0,0,-gw*2);
          mat0.transformV3(ph0,ph1);
          t.set(pos.x+ph1.x,pos.y+ph1.y,pos.z+ph1.z);//t
        } else {
          const r=clipr,y=pos.y;
          objs[0].visible=!((r.x0<=x)&&(r.y0<=y)&&(r.z0<=z)&&(r.x1>=x)&&(r.y1>=y)&&(r.z1>=z));
          const dx=p.x-t.x,dy=p.y-t.y,dz=p.z-t.z;
        
          t.set(pos.x,pos.y,pos.z);
          p.set(pos.x+dx,pos.y+dy,pos.z+dz);
        }
    */
      }
    }
    return ret;
    //...
  }
  
  
  
  function getAi(u) {
    //--
    let t=0,//units=blockWalk.units,dist2=blockWalk.dist2,
        lastSeen,unitPlayer,lastSeenT=0,waitForAttack=0,startAttack=1500;
    
    return function(dt) {
      //---
      //t+=dt;
      if (u.aiReset) { //via stateRestore
        delete(u.aiReset);
        lastSeen=undefined;
      }
      
      if (u.doBlock) return;
      
      let units=self.units;
      if (unitPlayer===undefined) {
        for (let uh of units) if (!uh.ai) unitPlayer=uh;
        return;
      }
      //if (t>500) {
      let p0=u.m.position,u1=unitPlayer,p1=u1.m.position,d2=dist2(p0,p1);
      //onsole.log(unitPlayer.col);
      let alerted=(u1.hp>0)&&(d2<(((u1.col==2)&&(u1.blockHeight==1))?2000:u.aiRangeAlert||20000));
      if (alerted!=u.alerted) {
        //onsole.log('alerted='+alerted+' u1.col='+u1.col+' u1.blockHeight='+u1.blockHeight);
        u.alerted=alerted;
        u.bbdraw(u.bb);
      }
      u.doTurn=0;
      u.doRun=0;
      //u.doAttack=0;
      if (lastSeenT>0) {
        lastSeenT-=dt;
        if (lastSeenT<=0) lastSeen=undefined;
      }
      
      if (!alerted) waitForAttack=0;
      
      if (1&&(alerted||lastSeen)&&!u.doAttack) {
      
        if (alerted&&attackRange(u)) {
          if (!bwps.observeBlock) {
            u.doAttack=1;
            u.attackt=0;
          } else {
            waitForAttack+=dt;
            if (waitForAttack>=startAttack) {
              waitForAttack=0;
              u.doAttack=1;
              u.attackt=0;
            } else if (u1.doAttack&&(u1.attackt>300)&&!u.cantblock) {
              u.doBlock=1;
              u.blockt=0;
              return;
            }
            //onsole.log(waitForAttack);
          }
        } else {
        
        if (alerted) {
          if (!lastSeen) {
            lastSeen=new THREE.Vector3();
            //onsole.log('new lastSeen');
          }
          lastSeen.copy(p1);
          lastSeenT=2000;
        } else {
          p1=lastSeen;
          d2=dist2(p0,p1);
        }
        const dx=p1.x-p0.x,dz=p1.z-p0.z;
        const a2=Math.atan2(dz,-dx)-PI/2,
              da=Conet.dAng(a2,u.a);//ang);
      //u.a=a2;
      //u.o.ay=u.a;
      ////onsole.log(da);
        const mda=0.15;//0.15
      
        if (Math.abs(da)>mda) 
          u.doTurn=da<0?-1:1;
        else if (d2>(alerted?3000:300))
          u.doRun=1;
        else {
          //if (alerted) {
          //  u.doAttack=1;
          //  u.attackt=0;
          //} else {
            lastSeen=undefined;
            //onsole.log('did set lastSeen=undef');
          //}
        }
        }
      }
      //u.doTurn=alerted?1:0;
        //console.log('scan '+((dist2(u.m.position,unitPlayer.m.position)<20000)?'see':'dont see'));
      //  t=0;
      //}
      //...
    }
    //...
  }
  
  function attackRange(u,hit) {
    //---
    for (let uh of self.units) {
      if (u===uh) continue;
      if ((u.ai!==undefined)&&(uh.ai!==undefined)) continue;
      let p=u.m.position,ph=uh.m.position;
      let d=dist2(ph,p);
      if ((d>9000)||(d<100)) continue;//12300
      //onsole.log('check attack range d='+d);
      tempv.set(ph.x-p.x,ph.y-p.y,ph.z-p.z);
      tempMatrix.makeRotationY(-u.o.ay+PI/2);
      tempv.applyMatrix4(tempMatrix);
      if ((tempv.x<0)||(Math.abs(tempv.z)>20)) continue;
      //onsole.log('attack range');// x z='+tempv.x+' '+tempv.z);
      if (hit) {
        uh.o.ps.hitt=0;
        uh.o.ps.hite={u:u};
      } else return uh;
    }
    //...
  }
  
  function stopAttack(u) {
    //---
    u.doAttack=false;
    if (!u.ai) u.visTurn=1;
    u.aMark1.visible=false;
    u.aMark0.visible=false;
    u.o.dtscale=1;
    //...
  }
  
  function setCrouch(u,crouch) {
    //---
    if (crouch) {
      u.animIdle='cstand';
      u.animRun='crun';
      u.speedRun=0.075;
      u.bb.y=0.5;
      u.blockHeight=1; 
    } else {
      u.animIdle='stand2';
      u.animRun='run';
      u.speedRun=0.15;
      u.bb.y=0.9;
      u.blockHeight=2;
    }
    u.bbdraw(u.bb);
    //...
  }
  
  function steer(u,dt) {
    //---
    //let animMove=false,animTurn=false;
    u.speed=0;
    
    if (u.hp==0) return;
    if (u.cantblock) u.cantblock=Math.max(0,u.cantblock-dt);
    
    let ps=u.o.ps;
    
    if (ps&&ps.hite) { //--- see also planim.hite tech
      //onsole.log('hite');
      u.doTurn=0;
      u.doRun=0;
      if (ps.hitt==0) {
        u.hp=Math.max(0,u.hp-ps.hite.u.ap);
        //onsole.log(ps.hite.u.ap);
        u.bbdraw(u.bb);
        ps.hitt=1;if (dt>0) dt--;
      }
      //u.animIdle=u.hp==0?'lost':'hit';
      Pd5.animStart(u.o,u.hp==0?u.animLost:u.animHit);
      ps.hitt+=dt;
      if (ps.hitt>300) {//300 250
        //u.animIdle='stand2';
        delete(ps.hite);
        //u.cantblock=1000;
      }
      if (u.doAttack) {
        stopAttack(u);
        //u.doAttack=false;
        //if (!u.ai) u.visTurn=1;
        //u.aMark1.visible=false;
        //u.aMark0.visible=false;
        //u.o.dtscale=1;
      }
      return;
    } 
    
    if (u.doBlock) {
      for (let uh of self.units) {
        if (u===uh) continue;
        if (!uh.doAttack) continue;
        if (uh.attackt<500) continue;
        //onsole.log('blocking attack at attackt='+uh.attackt);
        stopAttack(uh);
        uh.o.ps.hitt=1;
        uh.o.ps.hite=u;
        uh.cantblock=1500;
        //onsole.log('stop attack nao');
      }
    }
    
    
    if (!u.ai) {
    
    const tsd0=self.tsd0,gpad0=self.xrUtil?self.xrUtil.gp1:undefined;
          tsd1=self.tsd1,gpad1=self.xrUtil?self.xrUtil.gp2:undefined;
    
    //if (!gpad) return;
    u.doTurn=0;
    u.doRun=0;
    
    let dx=0,dy=0;
    if (gpad0) {  
      dx=gpad0.axes[2];dy=gpad0.axes[3]; 
      //let sh='';for (let b of gpad0.buttons) sh+=b.pressed?':':'.';
      //console.log(gpad0.buttons[4].pressed);
      let crouchPressed=gpad0.buttons[4]?.pressed;
      if (crouchPressed!=u._crouchPressed) {
        u._crouchPressed=crouchPressed;
        if (crouchPressed) setCrouch(u,u.animIdle=='stand2');
      }
    } else if (tsd0) { dx=tsd0.dx;dy=tsd0.dy; }
    let d0=(dx!=0)||(dy!=0);
    
    let dx1=0,dy1=0;
    if (gpad1) {  dx1=gpad1.axes[2];dy1=gpad1.axes[3]; } else if (tsd1) { dx1=tsd1.dx;dy1=tsd1.dy; }
    let d1=(dx1!=0)||(dy1!=0);
    
    let ay=0;
    if (d0||d1) {
      if (self.room) {
        ay=-self.room.rotation.y;
      } else if (self.camera) {
        //if (!tempMatrix) {
        //  tempMatrix=new THREE.Matrix4();
        //  euler=new THREE.Euler(0,1,0,'YXZ');
        //  tempv=new THREE.Vector3();
        //}
        tempMatrix.identity().extractRotation(self.camera.matrixWorld);
        euler.setFromRotationMatrix(tempMatrix);
        ay=euler.y;
        //if (self.room) ay=-self.room.rotation.y;
        //onsole.log('ay='+ay);
      } //else ay=self.controls.getAzimuthalAngle();
    }
    
    //autoattack
    let attackAngle=undefined;
    //onsole.log(u.autoAttack);
    if (
      !d1
      &&!((u.col==2)&&(u.blockHeight==1)) //241230 no autoattack while in stealthmode
      &&(u.autoAttack!='none')
      ) { 
    let mind=Number.MAX_VALUE,minu=undefined,p0=u.m.position;
    for (let uh of self.units) {
      if (uh===u) continue;
      if (uh.hp<=0) continue;
      let p1=uh.m.position,d2=dist2(p0,p1);
      if (d2>12000) continue;
      if (d2<mind) { mind=d2;minu=uh; }
    }
    if (minu) {
      //onsole.log(Conet.f4(mind));
      let p1=minu.m.position,dx=p1.x-p0.x,dz=p1.z-p0.z;
      attackAngle=Math.atan2(dz,-dx)-PI/2;
    }
    }
    
    if (d1||(attackAngle!==undefined)) {
      //onsole.log(dx1+' '+dy1+' '+self.room.rotation.y);
      const a2=(attackAngle!==undefined)?attackAngle
            :Math.atan2(dy1,-dx1)-PI/2+ay
            ,da=Conet.dAng(a2,u.o.ay),ada=Math.abs(da);
      if (ada>0.05) {
        u.o.ay+=Math.min(ada,dt*(u.speedTurn||0.01))*(da<0?-1:1);
        u.aMark0.rotation.y=u.o.ay-PI/2;
      }
      if (!bwps.observeBlock)
      if (!u.doAttack) {
        u.animIdle='stand2';
        u.animRun='run';
        u.doAttack=true;
        u.attackt=0;
        u.speedRun=0.15;
        u.bb.y=0.9;
        u.blockHeight=2;
      }
      u.visTurn=false;
    }
       
    if (d0) {
      const a2=Math.atan2(dy,-dx)-PI/2+ay,//*0+(self.room?-self.room.rotation.y:ay),//view
            da=Conet.dAng(a2,u.a);//ang);
      //onsole.log(da);
      const mda=0.15;
      //u.doAttack=undefined;
      if (Math.abs(da)>mda) {
        //u.a+=(da<0?-1:1)*dt*0.01;
        ////u.o.meshes[0].tmesh.rotation.y=u.a;
        //u.o.ay=u.a;
        //animTurn=true;
        //u.doTurn=da<0?-1:1;
        u.a+=da;
        if (!d1&&!u.doAttack) {
          u.visTurn=true;
          //onsole.log('visTurn=true');
          //u.o.ay=u.a;
          //if (u.o.ps) u.o.ps.roty=u.a;
        } //else 
          //u.visTurn=true;
      } else {
        //u.speed=u.speedRun||self.speed||0.0002*1;//(Math.abs(a3)-0.1)*((a3<0)?1:-1);
        //animMove=true;
        u.doRun=1;
      } 
    } else if (self.room) u.visTurn=false;
    
    //if (attackRange(u)) console.log('attack range');
    
    
    } else {
      //ai(u,dt);//
      u.ai(dt);//--- ai
    }
    
    u.o.dtscale=1;
    if (u.doBlock) {
      Pd5.animStart(u.o,u.animBlock);
      u.blockt+=dt;
      if (u.blockt>300) {
        u.doBlock=false;
      }
      return;
    }
    if (u.doAttack) {
      let mt=u.mt||(u.ai?1000:1000),mt0=u.mt0||(mt-350);//1000;
      if (!u.aMark0.visible) {
        Conet.beep({time:mt,freq:200,freqAtTime:[[350,mt-50],[450,mt-30],[50,mt]],
          gainAtTime:[[0,0],[Sound.vol/2,100],[Sound.vol,mt-10],[0,mt]]});
        Pd5.animStart(u.o,u.animAttack);
        u.aMark1.visible=true;
        u.aMark0.visible=true;
      }
      u.o.dtscale=200/mt0;//0.2;
      u.attackt+=dt;
      u.aMark1.scale.x=u.attackt/mt;
      if ((u.attackt>=mt0)&&u.aMark1.visible) {
        attackRange(u,1);
        u.aMark1.visible=false;
      }
      if (u.attackt>=mt) { 
        //attackRange(u,1);
        u.doAttack=false;
        if (!u.ai) u.visTurn=1;
        u.aMark0.visible=false;
      }
    }
    if (u.visTurn) {
      const da=Conet.dAng(u.a,u.o.ay),ada=Math.abs(da);
      if (ada>0.05) {
        u.o.ay+=Math.min(ada,dt*(u.speedTurn||0.01))*(da<0?-1:1);
        //onsole.log('visTurn u.o.ay='+u.o.ay+' u.speedTurn='+u.speedTurn);
        if (u.aMark0) u.aMark0.rotation.y=u.o.ay-PI/2;
        if (u.o.ps) u.o.ps.roty=u.o.ay;
      } else {
        //onsole.log('visTurn=false '+u.a+' '+u.o.ay);
        u.visTurn=false;
      }
    }
    if (u.doTurn) {
      u.a+=u.doTurn*dt*(u.speedTurn||0.01);
      //u.o.ay=u.a;
      //if (u.o.ps) u.o.ps.roty=u.a;
      if (!u.doAttack) {
        u.o.ay=u.a;
        u.aMark0.rotation.y=u.o.ay-PI/2;
        if (u.o.ps) u.o.ps.roty=u.a;
        Pd5.animStart(u.o,u.animRun);
        //onsole.log('run 0');
      }
    } else if (u.doRun) {
      u.speed=u.speedRun||self.speed||0.0002*1;//(Math.abs(a3)-0.1)*((a3<0)?1:-1);
      if (u.doAttack) u.speed=0.05;
      if (!u.doAttack) {
        Pd5.animStart(u.o,u.animRun);
        //onsole.log('run 1');
      }
    } else 
      if (!u.doAttack) {
        Pd5.animStart(u.o,u.visTurn?u.animRun:u.animIdle);
        //onsole.log('idle 0');
      }
    
    
    //if (animMove||animTurn) {
    //  Pd5.animStart(u.o,u.animRun);//'run'
    //} else {
    //  Pd5.animStart(u.o,u.animIdle);
    //}
    
    //u.a-=dx*dt*0.01;
    //u.o.meshes[0].tmesh.rotation.y=u.a;
    //const a3=dy;
    //if (Math.abs(a3)>0.1) {
    //  u.speed=0.0002*(Math.abs(a3)-0.1)*((a3<0)?1:-1);
    //  Pd5.animStart(u.o,'run');
    //} else {
    //  u.speed=0;
    //  Pd5.animStart(u.o,'stand2');
    //}
    //...
  }
  function dist2(p0,p1) {
    //---
    const dx=p1.x-p0.x,dy=p1.y-p0.y,dz=p1.z-p0.z;
    return dx*dx+dy*dy+dz*dz;
    //...
  }
  
  function stateSave() {
    //---
    for (let u of self.units) {
      let p=u.pos;
      u.stateOriginal={a:u.a,pos:{x:p.x,y:p.y,z:p.z}};
      //onsole.log(u.stateOriginal);
    }
    //...
  }
  function stateRestore() {
    //---
    for (let u of self.units) {
      let o=u.stateOriginal;
      u.a=o.a;u.o.ay=u.a;
      u.pos.x=o.pos.x;u.pos.y=o.pos.y;u.pos.z=o.pos.z;
      u.hp=u.ohp;
      u.aiReset=1;
      setCrouch(u,false);
    }
    //...
  }
  
  
  this.calc=function(dt) {
    //---
    
    if (!tempMatrix) {
      tempMatrix=new THREE.Matrix4();
      euler=new THREE.Euler(0,1,0,'YXZ');
      tempv=new THREE.Vector3();
    }
    
    
    //let unit0=self.unit0,
    let units=self.units;
    //if (unit0&&units.length==0) units.push(unit0);
    //if (!u) return;
    for (let u of units) {
      steer(u,dt);
      if (u.speed!=0) {
        const dx=u.speed*dt*Math.sin(u.a);
        const dz=u.speed*dt*Math.cos(u.a);
        const m=u.o.meshes[0].tmesh;
        if (0) {
          m.position.x+=dx;
          m.position.z+=dz;
        } else if (!checkWalk(u,dx,dz)) {
          if (!checkWalk(u,dx,0)) 
            checkWalk(u,0,dz);
        }
      }
    }
    Conet.calcTweens(self.tweens,dt);
    //...
  }
  this.checkWalk=checkWalk;
  this.steer=steer;this.dist2=dist2;
  this.getAi=getAi;
  this.setCrouch=setCrouch;
  this.stateSave=stateSave;this.stateRestore=stateRestore;
  //...
}
//...
//fr o,2
//fr o,2,11
//fr o,2,15
//fr o,2,15,4
//fr o,2,21
//fr o,2,23
//fr o,2,30
//fr p,38,301
