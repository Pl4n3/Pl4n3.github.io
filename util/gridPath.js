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
    if (!freeFor(g,o)) return;
    if ((g.len!=-1)&&(g.len<len)) return;
    g.len=len;
    len++;
    if (len>=maxlen) return;
    if (x>0) calcLen(x-1,y,len,o);
    if (y>0) calcLen(x,y-1,len,o);
    if (x<gw-1) calcLen(x+1,y,len,o);
    if (y<gh-1) calcLen(x,y+1,len,o);
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
  //---
  var freeFor=function(g,o) {
    return true;
  }
  this.setFreeFor=function(f) {
    freeFor=f;
  }
  this.calcPath=calcPath;
}
//fr o,2
//fr o,2,2
//fr o,2,3
//fr p,51,4
