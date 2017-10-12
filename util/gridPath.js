//---calculate shortest path in a grid
//---code originated in canvas/grid/grid.htm
var GridPath=function(grid,gw,gh) {
  //---
  var dirs=[[-1,0],[0,1],[1,0],[0,-1]],maxlen=50;//25
  function calcLen(x,y,len,o) {
    var g=grid[y][x];
    //if (g.wall) return;
    //if (g.os) {
    //  if (g.os[0]!=o) return;
    //}
    //onsole.log('calcLen x='+x+' y='+y+' g.len='+g.len);
    if ((g.len!=-1)&&(g.len<len)//&&!g.gpos
      ) return 0;
    //console.log('calcLen 0');
    
    if (o.w&&(o.w>1)) {
      //onsole.log('calcLen 1');
      for (var yh=y;yh<(y+o.w);yh++) for (var xh=x;xh<(x+o.w);xh++) {
        if ((xh>=gw)||(yh>=gh)) return 0;
        if (!freeFor(grid[yh][xh],o)) return 0;
      }
      g.len=len;
      for (var yh=y;yh<(y+o.w);yh++) for (var xh=x;xh<(x+o.w);xh++) {
        var g0=grid[yh][xh];
        if ((yh==y)&&(xh==x)) continue;
        if (g0.gpos) if (g0.gpos.len<len) continue;
        g0.gpos=g;
        //if ((g0.len==-1)||(g0.len>len)) {
        //  g0.len=len;
        //  if (g0==g) delete(g0.gpos); else g0.gpos=g;
        //}
      }
    } else 
    
    {
      //onsole.log('calcLen 2');
      if (!freeFor(g,o)) return 0;
      //if ((g.len!=-1)&&(g.len<len)) return;
      g.len=len;
    }
    len++;
    var ret=1;
    if (len>=maxlen) return ret;
    
    if (x>0) ret+=calcLen(x-1,y,len,o);
    if (y>0) ret+=calcLen(x,y-1,len,o);
    if (x<gw-1) ret+=calcLen(x+1,y,len,o);
    if (y<gh-1) ret+=calcLen(x,y+1,len,o);
    return ret;
  }
  function calcPath(gmx,gmy,selo) {
    for (var y=gh-1;y>=0;y--) for (var x=gw-1;x>=0;x--) {
      g=grid[y][x]; g.len=-1; g.mark=false;
    }
    calcLen(gmx,gmy,0,selo); 
    //alert('calclen done');
    var x=selo.x,y=selo.y;
    var lh=0;
    var path=[];
    while (true) {
      var g0=grid[y][x];
      //g0.mark=true;
      path.push([x,y]);
      if ((x==gmx)&&(y==gmy)) break;
      var ways=[];
      var mlen=g0.len;
      for (var i=0;i<dirs.length;i++) {
        var d=dirs[i],xd=x+d[0],yd=y+d[1];
        if ((xd<0)||(xd>=gw)||(yd<0)||(yd>=gh)) continue;
        g=grid[yd][xd];
        //g=gAt(x+d[0],y+d[1]);if (!g.wall) 
        if (g.len!=-1) { if (g.len<mlen) { ways=[];mlen=g.len; } if (g.len==mlen) ways.push(i); }
      }
      if (ways.length==0) { 
        path=[];//alert('noway');
        break; }
      var d=dirs[ways[Math.floor(Math.random()*ways.length)]];
      x+=d[0];y+=d[1];
      lh++;
      //if (lh>15) break;
    }
    return path;
  }
  this.lenInit=function() {
    for (var y=gh-1;y>=0;y--) 
      for (var x=gw-1;x>=0;x--) {
        var g=grid[y][x];
        g.len=-1;delete(g.attacko);
        delete(g.gpos);
        delete(g.mark);
      }
  }
  //---
  var freeFor=function(g,o) {
    return true;
  }
  this.setFreeFor=function(f) {
    freeFor=f;
  }
  this.calcLen=calcLen;
  this.calcPath=calcPath;
  this.maxlen=maxlen;
}
//fr o,2
//fr o,2,2
//fr o,2,3
//fr o,2,4
//fr p,31,88
