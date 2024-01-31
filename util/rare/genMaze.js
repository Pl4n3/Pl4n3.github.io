//| --------------------------------------------------------
//| generiert 3d labyrint, verwendet in three/lego1.htm, shooter
//| --------------------------------------------------------
function genMaze(ps) {
  //---
  if (!ps) ps={};
  var newworlds=[],world,gw=ps.gw||3;
  var worlds=[{map:{'0_0_0':1},ways:[{x:0,y:0,z:0,l:0,gl:0}]}];//,m=world.map;
  
  function rani(m) {
    return Math.floor(Math.random()*m);
  }
  function et(x,y,z) {
    return world.map[x+'_'+y+'_'+z];
  }
  function wayBlock(x,y,z) {
    return (et(x,y,z)==1)&&!et(x,y+1,z);
  }
  function cloneWorld(w0,x,y,z,type,wayi,l,wi2) {
    var w1={map:{},ways:[],fields:{}};
    for (var k in w0.map) if (w0.map.hasOwnProperty(k)) w1.map[k]=w0.map[k];
    for (var i=0;i<w0.ways.length;i++) w1.ways.push(w0.ways[i]);
    for (var k in w0.fields) if (w0.fields.hasOwnProperty(k)) {
      var fs0=w0.fields[k],fs1={};
      for (var kk in fs0) if (fs0.hasOwnProperty(kk)) {
        fs1[kk]=fs0[kk];
      }
      w1.fields[k]=fs1;
    }
    w1.map[x+'_'+y+'_'+z]=type;
    var wi=w1.ways[wayi];
    w1.ways[wayi]={x:x,y:y,z:z,l:l,gl:wi?wi.gl:0};
    if (wi2!==undefined) {
      w1.ways[wi2].gl+=w1.ways[wi2].l;
      w1.ways[wayi].gl=w1.ways[wi2].gl;
      w1.ways[wi2].l=0;
      //onsole.log(w1.ways);
    }
    return w1;
  }
  function noconsWorld(x,y,z,t,nws,wi,l,wi2,xv,yv,zv) {
    var n=0,w=gw,w2=w*2;
    if ((x>=w)||(x<=-w)||(z>=w)||(z<=-w)||(y>=w2)||(y<0)||et(x,y,z)||et(x,y+1,z)||et(x,y-1,z)) return false;//| no place -> pretend connections
    if (t==1) {
      if (wayBlock(x-1,y,z)) n++;
      if (wayBlock(x+1,y,z)) n++;
      if (wayBlock(x,y,z-1)) n++;
      if (wayBlock(x,y,z+1)) n++;
      if (et(x-1,y,z)==5) n++;
      if (et(x+1,y,z)==4) n++;
      if (et(x,y,z-1)==2) n++;
      if (et(x,y,z+1)==3) n++;
      if (et(x-1,y+1,z)==4) n++;
      if (et(x+1,y+1,z)==5) n++;
      if (et(x,y+1,z-1)==3) n++;
      if (et(x,y+1,z+1)==2) n++;
    }
    if (t==5) {
      //n++;//connection to previous way-segment
      if (wayBlock(x+1,y,z)) n++;
      if (wayBlock(x-1,y-1,z)) n++;
      if (et(x+1,y+1,z)==5) n++;
      if (et(x-1,y-1,z)==5) n++;
      if (et(x,y,z-1)==5) n++;//
      if (et(x,y,z+1)==5) n++;
    }
    if (t==4) {
      //n++;
      if (wayBlock(x-1,y,z)) n++;
      if (wayBlock(x+1,y-1,z)) n++;
      if (et(x-1,y+1,z)==4) n++;
      if (et(x+1,y-1,z)==4) n++;
      if (et(x,y,z-1)==4) n++;
      if (et(x,y,z+1)==4) n++;
    }
    if (t==3) {
      //n++;
      if (wayBlock(x,y,z+1)) n++;
      if (wayBlock(x,y-1,z-1)) n++;
      if (et(x,y+1,z+1)==3) n++;
      if (et(x,y-1,z-1)==3) n++;
      if (et(x-1,y,z)==3) n++;
      if (et(x+1,y,z)==3) n++;
    }
    if (t==2) {
      //n++;
      if (wayBlock(x,y,z-1)) n++;
      if (wayBlock(x,y-1,z+1)) n++;
      if (et(x,y+1,z-1)==2) n++;
      if (et(x,y-1,z+1)==2) n++;
      if (et(x-1,y,z)==2) n++;
      if (et(x+1,y,z)==2) n++;
    }
    if (n>=2) return false;
    //return n<2;//(wi2!==undefined)?n<3:n<2;
    var w1;
    nws.push(w1=cloneWorld(world,x,y,z,t,wi,l,wi2));
    var kv=xv+'_'+yv+'_'+zv,fv=w1.fields[kv];
    if (!fv) { fv={next:[]};w1.fields[kv]=fv; }
    fv.next=fv.next.concat([[x,y,z]]);
    return true;
    //...
  }
  function extendWay(nws,x,y,z,wi,l,wi2) {
    var w=gw,w2=w*2,t=et(x,y,z);//w=3
    //if (((t==1)||(t==5))&&(x<w) &&!et(x+1,y,z)&&!et(x+1,y+1,z)&&!et(x+1,y-1,z)&&!wayBlock(x+2,y,z)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x+1,y,z+1)
      ////&&(et(x+1,y,z-1)!=2)&&(et(x+1,y,z+1)!=3)&&(et(x+1,y+1,z-1)!=3)&&(et(x+1,y+1,z+1)!=2)
    //if (((t==1))        &&(x>-w)&&!et(x-1,y,z)&&!et(x-1,y+1,z)&&!et(x-1,y-1,z)&&!wayBlock(x-2,y,z)&&!wayBlock(x-1,y,z-1)&&!wayBlock(x-1,y,z+1)) nws.push(cloneWorld(world,x-1,y,z,1,wi,l,wi2));
    //if (((t==1))        &&(z<w) &&!et(x,y,z+1)&&!et(x,y+1,z+1)&&!et(x,y-1,z+1)&&!wayBlock(x,y,z+2)&&!wayBlock(x+1,y,z+1)&&!wayBlock(x-1,y,z+1)) nws.push(cloneWorld(world,x,y,z+1,1,wi,l,wi2));
    //if (((t==1))        &&(z>-w)&&!et(x,y,z-1)&&!et(x,y+1,z-1)&&!et(x,y-1,z-1)&&!wayBlock(x,y,z-2)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x-1,y,z-1)) nws.push(cloneWorld(world,x,y,z-1,1,wi,l,wi2));
    //if (((t==1)||(t==5))&&(x<w)&&(y<w2)&&!et(x+1,y,z)&&!et(x+1,y+1,z)&&!et(x+1,y+2,z)&&(et(x+1,y+1,z-1)!=4)&&(et(x+1,y+1,z+1)!=4)&&!wayBlock(x+2,y+1,z)) 
    
    //if (((t==1)||(t==5))&&nocons(x+1,y,z,1)) nws.push(cloneWorld(world,x+1,y,z,1,wi,l,wi2));
    //if (((t==1))        &&nocons(x-1,y,z,1)) nws.push(cloneWorld(world,x-1,y,z,1,wi,l,wi2));
    //if (((t==1))        &&nocons(x,y,z+1,1)) nws.push(cloneWorld(world,x,y,z+1,1,wi,l,wi2));
    //if (((t==1))        &&nocons(x,y,z-1,1)) nws.push(cloneWorld(world,x,y,z-1,1,wi,l,wi2));
    //if (((t==1)||(t==5))&&nocons(x+1,y+1,z,5)) nws.push(cloneWorld(world,x+1,y+1,z,5,wi,l,wi2));
    //if (((t==1)||(t==4))&&nocons(x-1,y+1,z,4)) nws.push(cloneWorld(world,x-1,y+1,z,4,wi,l,wi2));
    
    if ((t==1)||(t==5)) noconsWorld(x+1,y,z,1,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==4)) noconsWorld(x-1,y,z,1,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==3)) noconsWorld(x,y,z+1,1,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==2)) noconsWorld(x,y,z-1,1,nws,wi,l,wi2,x,y,z);
    //if (1) return;
    //| ramps up
    if ((t==1)||(t==5)) noconsWorld(x+1,y+1,z,5,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==4)) noconsWorld(x-1,y+1,z,4,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==3)) noconsWorld(x,y+1,z+1,3,nws,wi,l,wi2,x,y,z);
    if ((t==1)||(t==2)) noconsWorld(x,y+1,z-1,2,nws,wi,l,wi2,x,y,z);
    //| ramps down
    if (t==5) noconsWorld(x-1,y-1,z,5,nws,wi,l,wi2,x,y,z);if (t==5) noconsWorld(x-1,y-1,z,1,nws,wi,l,wi2,x,y,z);if (t==1) noconsWorld(x-1,y  ,z,5,nws,wi,l,wi2,x,y,z);
    if (t==4) noconsWorld(x+1,y-1,z,4,nws,wi,l,wi2,x,y,z);if (t==4) noconsWorld(x+1,y-1,z,1,nws,wi,l,wi2,x,y,z);if (t==1) noconsWorld(x+1,y  ,z,4,nws,wi,l,wi2,x,y,z);
    if (t==3) noconsWorld(x,y-1,z-1,3,nws,wi,l,wi2,x,y,z);if (t==3) noconsWorld(x,y-1,z-1,1,nws,wi,l,wi2,x,y,z);if (t==1) noconsWorld(x,y  ,z-1,3,nws,wi,l,wi2,x,y,z);
    if (t==2) noconsWorld(x,y-1,z+1,2,nws,wi,l,wi2,x,y,z);if (t==2) noconsWorld(x,y-1,z+1,1,nws,wi,l,wi2,x,y,z);if (t==1) noconsWorld(x,y  ,z+1,2,nws,wi,l,wi2,x,y,z);
    
    //...
  }
  for (var i=0;i<100;i++) {
    for (var worldi=0;worldi<worlds.length;worldi++) {
      world=worlds[worldi];
      for (var wi=0;wi<world.ways.length;wi++) { 
        var w=world.ways[wi],x=w.x,y=w.y,z=w.z,l=w.l,nws=[];
        extendWay(nws,x,y,z,wi,l+1);
        //if ((x<5) &&!et(x+1,y,z)&&!et(x+1,y+1,z)&&!wayBlock(x+2,y,z)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x+1,y,z+1)) nws.push(cloneWorld(world,x+1,y,z,1,wi,l+1));
        //if ((x>-5)&&!et(x-1,y,z)&&!et(x-1,y+1,z)&&!wayBlock(x-2,y,z)&&!wayBlock(x-1,y,z-1)&&!wayBlock(x-1,y,z+1)) nws.push(cloneWorld(world,x-1,y,z,1,wi,l+1));
        //if ((z<5) &&!et(x,y,z+1)&&!et(x,y+1,z+1)&&!wayBlock(x,y,z+2)&&!wayBlock(x+1,y,z+1)&&!wayBlock(x-1,y,z+1)) nws.push(cloneWorld(world,x,y,z+1,1,wi,l+1));
        //if ((z>-5)&&!et(x,y,z-1)&&!et(x,y+1,z-1)&&!wayBlock(x,y,z-2)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x-1,y,z-1)) nws.push(cloneWorld(world,x,y,z-1,1,wi,l+1));
        //if (1) {//l<5) {
        //  for (var j=0;j<nws.length;j++) newworlds.push(nws[j]);continue:
        //}
        if (l>3) {
          var nws2=[];
          for (var j=0;j<nws.length;j++) {
            world=nws[j];var ww=world.ways,w;
            extendWay(nws2,x,y,z,ww.length,0,wi);
            //if ((x<5) &&!et(x+1,y,z)&&!et(x+1,y+1,z)&&!wayBlock(x+2,y,z)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x+1,y,z+1)) { nws2.push(w=cloneWorld(world,x+1,y,z,1,ww.length,0));w.ways[wi].l=0; }
            //if ((x>-5)&&!et(x-1,y,z)&&!et(x-1,y+1,z)&&!wayBlock(x-2,y,z)&&!wayBlock(x-1,y,z-1)&&!wayBlock(x-1,y,z+1)) { nws2.push(w=cloneWorld(world,x-1,y,z,1,ww.length,0));w.ways[wi].l=0; }
            //if ((z<5) &&!et(x,y,z+1)&&!et(x,y+1,z+1)&&!wayBlock(x,y,z+2)&&!wayBlock(x+1,y,z+1)&&!wayBlock(x-1,y,z+1)) { nws2.push(w=cloneWorld(world,x,y,z+1,1,ww.length,0));w.ways[wi].l=0; }
            //if ((z>-5)&&!et(x,y,z-1)&&!et(x,y+1,z-1)&&!wayBlock(x,y,z-2)&&!wayBlock(x+1,y,z-1)&&!wayBlock(x-1,y,z-1)) { nws2.push(w=cloneWorld(world,x,y,z-1,1,ww.length,0));w.ways[wi].l=0; }
          }
          //console.log('wi='+wi+' nws2[0].ways.length='+nws2[0].ways.length);
          //console.log(nws2);
          world=worlds[worldi];
          if (nws2.length>0) nws=nws2;
        }
        for (var j=0;j<nws.length;j++) newworlds.push(nws[j]);
      }
    }
    if (newworlds.length==0) {
      console.log('no new worlds '+i);break;
    }
    worlds=[];
    for (var j=Math.min(newworlds.length,50)-1;j>=0;j--) {
      var nwi=rani(newworlds.length);
      worlds.push(newworlds[nwi]);newworlds.splice(nwi,1);
    }
    newworlds=[];
  }
  console.log('worlds.length='+worlds.length);
  //console.log(worlds[rani(worlds.length)]);
  world=worlds[rani(worlds.length)];
  return world;
  //---
}
//fr o,3
//fr o,3,8
//fr o,3,9
//fr o,3,10
//fr p,34,93
