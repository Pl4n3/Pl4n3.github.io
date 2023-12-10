//----
console.log('BlockWalk v.1.24 ');//FOLDORUPDATEVERSION
var BlockWalk=function(ps) {
  //---
  const self=this,tweens=[];
  this.tweens=tweens;
  this.blockMeshPos={x:0,y:0,z:0};
  this.checkWalk=function(u,dx,dz) {
    //---
    if (u.posytw&&!u.posytw.ended) return false;
    const gw=self.gw,bmp=self.blockMeshPos,blockAt=self.blockAt,player=self.player,updatePlayerView=self.updatePlayerView;
    const pos=u.m.position,x=pos.x+dx,z=pos.z+dz;
    const xi=Math.floor((x-bmp.x)/gw+0.5+(dx>0?0.5:-0.5)),
          yi=Math.floor((pos.y-bmp.y)/gw-0.5),
          zi=Math.floor((z-bmp.z)/gw+0.5+(dz>0?0.5:-0.5));
    const xj=Math.floor((x-bmp.x)/gw+0.5),
          yj=Math.floor((pos.y-bmp.y)/gw-0.5),
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
            else tweens.push(u.posytw={o:pos,key:'y',value:(yj-1+0.5)*gw+bmp.y,t:100,onset:((u===player)?updatePlayerView:undefined)});
            //posyt=0;
          } else 
            ret=false;
        }
      } 
      else //if (!ret) 
      if (!blockAt(xi,yi+1,zi)&&!blockAt(xj,yj+1,zj)&&!blockAt(xi,yi+2,zi)&&!blockAt(xj,yj+2,zj)) {
        if (0) pos.y=(yj+1+0.5)*gw;
        else tweens.push(u.posytw={o:pos,key:'y',value:(yj+1+0.5)*gw+bmp.y,t:100,onset:((u===player)?updatePlayerView:undefined)});
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
  //...
}
//...
//fr o,2
//fr o,2,4
//fr p,4,31
