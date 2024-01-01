//----
console.log('BlockWalk 1.54 ');//FOLDORUPDATEVERSION
var BlockWalk=function(ps) {
  //---
  const self=this,PI=Math.PI;
  let tempMatrix,euler;
  
  this.tweens=[];
  this.blockMeshPos={x:0,y:0,z:0};
  function checkWalk(u,dx,dz) {
    //---
    if (u.posytw&&!u.posytw.ended) return false;
    const gw=self.gw,gh=self.gh||gw,bmp=self.blockMeshPos,blockAt=self.blockAt,player=self.player,updatePlayerView=self.updatePlayerView;
    const pos=u.m.position,x=pos.x+dx,z=pos.z+dz;
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
      ret=!blockAt(xi,yi,zi)&&!blockAt(xj,yj,zj)&&!blockAt(xj,yj+1,zj);
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
  function steer(u,dt) {
    //---
    const tsd0=self.tsd0,gpad=self.xrUtil?self.xrUtil.gp1:undefined;
    
    //if (!gpad) return;
    
    let dx=0,dy=0;
    if (gpad) {
      dx=gpad.axes[2];
      dy=gpad.axes[3];
    } else {
      dx=tsd0.dx;
      dy=tsd0.dy;
    }
    
    //if ((dx==0)&&(dy==0)) return;
    
    let animMove=false,animTurn=false;
    u.speed=0;
    if ((dx!=0)||(dy!=0)) {
      let ay=0;
      if (self.camera) {
        if (!tempMatrix) {
          tempMatrix=new THREE.Matrix4();
          euler=new THREE.Euler(0,1,0,'YXZ');
        }
        tempMatrix.identity().extractRotation(self.camera.matrixWorld);
        euler.setFromRotationMatrix(tempMatrix);
        ay=euler.y;
      } //else ay=self.controls.getAzimuthalAngle();
       
      const a2=Math.atan2(dy,-dx)-PI/2+ay,//view
            da=Conet.dAng(a2,u.a);//ang);
      //onsole.log(da);
      const mda=0.15;
      
      if (Math.abs(da)>mda) {
        u.a+=(da<0?-1:1)*dt*0.01;
        u.o.meshes[0].tmesh.rotation.y=u.a;
        animTurn=true;
      } else {
        u.speed=self.speed||0.0002*1;//(Math.abs(a3)-0.1)*((a3<0)?1:-1);
        animMove=true;
      } 
    }
    if (animMove||animTurn) {
      Pd5.animStart(u.o,'run');
    } else {
      Pd5.animStart(u.o,'stand2');
    }
    
    
    
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
  this.calc=function(dt) {
    //---
    let u=self.unit0;
    if (!u) return;
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
    Conet.calcTweens(self.tweens,dt);
    //...
  }
  this.checkWalk=checkWalk;
  this.steer=steer;
  //...
}
//...
//fr o,2
//fr o,2,8
//fr p,33,28
