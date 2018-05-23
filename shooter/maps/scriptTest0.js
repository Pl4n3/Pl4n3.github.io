var Script={name:'test0',version:'0.149 '};//FOLDORUPDATEVERSION
Script.calc=function(o) {
  var o5=o.o5;
  if (is2d) { 
    o.z=0;
    if (o==ego) {
      //o.specialAnim=mBack.on?o.o5.animh.cidle:undefined;
      //o.attack=mAction.on;
      if (mRight.on) { o.rot=PI/2;o.goFront=true; }
      else if (mLeft.on) { o.rot=-PI/2;o.goFront=true; }
      else { 
        o.goFront=false; 
      }
    }
  }
    //if (o!=ego) 
    {
      var oF=o.focus;
      if (oF&&oF.o5) 
      if ((o.bbName=='Malus')&&(oF.bbName=='Samus'))
      if (dist(o,oF)<0.7) {
        o.ai=undefined;//o.focus=undefined;
        o.ai0=undefined;
        oF.ai0=undefined;oF.focus=undefined;
         o.specialAnim= o.o5.animh.malusSamus1;
        oF.specialAnim=oF.o5.animh.malusSamus1;
        oF.x=o.x;oF.y=o.y;oF.z=o.z;
        oF.rot=o.rot;
        //if (!game.log_0) { console.log(oF);game.log_0=1; }
      }
    }
    
  if (o.isBane&&ego) {
    var d=dist(o,ego);
    //o.goFront=false;
    if (d>7) {
      o5.animStop=1;
    } else {
      o5.animStop=0;
      var da=dAngle(o,ego),ada=Math.abs(da);
      var egoSees=(Math.abs(dAngle(ego,o))<1.5);
      if (d<5) {
        if (egoSees) { //---flee
          if (ada<3) {
            if (da>0) o.turnLeft=true; else o.turnRight=true;
          } 
          if (ada>1.5) o.goFront=true;
          //if (da>0) 
          //o.rot+=dt*0.01;
          //o.goFront=true;//o5.animStop=0;
        } else { //---approach
          if (ada>0.1) {
            if (da<0) o.turnLeft=true; else o.turnRight=true;
          }
          if ((ada<1)&&(d>1.5)) o.goFront=true; 
        }
        //o5.animStop=0;
      } else {//if (d<7) {
        if (ada>0.1) {
          if (da<0) o.turnLeft=true; else o.turnRight=true;
        }
        if (!egoSees&&(ada<1)) o.goFront=true;
      }
    }
    //else o5.animStop=1;
    //o5.animStop=d>7;
  }  
    
  if (1) return;
  if (isVr) return;
  if (o.turnLeft||o.turnRight||o.goFront||!doSteps) { 
  //if (o.turnLeft||o.turnRight||o.goFront||!o.o5.animStop) { 
    o.brot=undefined;return; }
  if (o.brot===undefined) o.brot=o.rot;
  o.rot=o.brot+0.5*Math.sin(gtime*0.003);
}
//og('Hello from scrptTest0!');
scriptRegister(Script);
//fr o,1
//fr p,4,68
