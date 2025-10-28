//---
(function () {
  //...
  function cloneNodes(a0) {
    var a1=new Array(a0.length);
    for (var i=a0.length-1;i>=0;i--) {
      var n0=a0[i],n1={}
      if (n0.texta) n1.texta=n0.texta;
      if (n0.gramFunc) n1.gramFunc=n0.gramFunc;
      n1.original=n0;
      a1[i]=n1;
    }
    for (var i=a0.length-1;i>=0;i--) {
      var n0=a0[i],n1=a1[i];
      if (n0.afrom) {
        n1.afrom=new Array(n0.afrom.length);
        for (var j=n0.afrom.length-1;j>=0;j--) {
          var e0=n0.afrom[j],e1={};
          e1.o0=n1;e1.o1=a1[e0.o1.userData.cloneIndex];
          e1.userData=e0.userData;
          n1.afrom[j]=e1;
        }
      }
      if (n0.ato) {
        n1.ato=new Array(n0.ato.length);
        for (var j=n0.ato.length-1;j>=0;j--) {
          var e0=n0.ato[j],e1={};
          e1.o1=n1;e1.o0=a1[e0.o0.userData.cloneIndex];
          e1.userData=e0.userData;
          n1.ato[j]=e1;
        }
      }
    }
    //onsole.log('gree0.cloneNodes');
    //onsole.log(a1);
    return a1;
    //...
  }
  //...
  var hudc=0;
  function f2(v) {
    return Math.floor(0.5+v*100)/100;
  }
  
  
  planim.etDebug('Anim '+planim.version+' [r] rec [v] view');
  planim.addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(1.5,0.5,1.50),bg:1,_autoRotate:1,
  target:new THREE.Vector3(0.4,0.5-0.40,0),fov:60,bgcol:0x666666,_vr:1,recordOnKey:1
  
  
  ,hudar:0.26,hudx:0.05,hudy:-0.05,hudz:-0.15,hudres:256,//fovportrait:1,
  hudRender:function(ct) {
    ct.font='17px sans-serif';
    /*
    hudc++;
    var v0=planim.views[0],p=planim.base.position,
      pc=v0?v0.camera.position:undefined,
      qc=v0?v0.camera.quaternion:undefined;
    ct.fillText('base:'+f2(p.x)+','+f2(p.y)+','+f2(p.z)+' '+hudc,2,2);
    //ct.fillText('WASD/cursorkeys -> fly around',2,18);
    ct.fillText((pc?'pc:'+f2(pc.x)+','+f2(pc.y)+','+f2(pc.z):'')
      +(qc?' qc:'+f2(qc.x)+','+f2(qc.y)+','+f2(qc.z)+','+f2(qc.w):''),2,18);
    */
    ct.fillText(planim.etDebug(),2,2);//2,34
  }
  
  
  });
  
  planim.box(0,-1.9,0,6,0.2,6).castShadow=false;
  //planim.box(0,0,0,0.2,0.2,0.2);
  //planim.box(0,0,-1,0.2,0.2,0.2);
  //planim.box(0.1,0.1,-0.9,0.2,0.2,0.2);
  planim.defaultLights();
  
  var sc=document.createElement('script');
  sc.onload=function() {
    var pf=0.01*0.25,currops=[],
        //currdata=[], --- probably not needed, instead on function call clone nodes
        t0=0,scaling=[];//,funcs={};
    //onsole.log('gree.loaded');
    Gree.initSub({base:planim.base,camera:planim.views[0].camera
      ,headLength:pf*20,headWidth:pf*5,lineb:pf*20});
    Gree.grid=pf;
    //console.log(Gree);
    //console.log(planim.base);
    
    
    function scale(o) {
      if (!o.scale) o=o.original;
      if (o.scale.x==1) scaling.push(o);
      o.scale.set(4,4,4);
      //...
    }
    
    function ofromPs(o,ps) {
      for (var oh of o.afrom) if (oh.userData.greePs===ps) return oh.o1;
      return undefined;//throw 'didnt find ps.';
      //...
    }
    
    function ofrom(o,i) {
      return o.afrom[i].o1;
      //...
    }
    function oto(o,i) {
      return o.ato[i].o0;
      //...
    }
    function paramsToArray(o) {
      
      var n1=o;o.params=[];
      while (true) {
        //if (n1.afrom.length<2) break;
        //n1=ofrom(n1,1);
        n1=ofromPs(n1,nextparam);
        if (n1===undefined) break;
        o.params.push(n1);
      }
      
      
      //...
    }
    
    function push(o) {
      //currdata[currops.length]={};
      currops.push(o);
      //...
    }
    
    function curropsPush(o) {
      //...
      //var o1=ofrom(o,0);
      var o1=ofromPs(o,ref);
      o1.param=o;
      push(o1);//currops.push(o1);
      //...
    }
    
    function nodesToArray(n,a) {
      //...
      if (n.userData.cloneIndex!==undefined) return;//already in array
      n.userData.cloneIndex=a.length;
      a.push(n);
      for (var o of n.afrom) nodesToArray(o.o1,a);
      //---
    }
    
    planim.game.calc=function(dt) {
      //
      Gree.animate();
      //console.log('gree0.calc '+dt);
      //console.log(currop);
      
      for (var i=scaling.length-1;i>=0;i--) {
        var o=scaling[i],sc=Math.max(1,o.scale.x-dt*0.01);
        o.scale.set(sc,sc,sc);
        if (sc==1) scaling.splice(i,1);
      }
      
      t0+=dt;
      if (t0<1) return;
      t0=0;
      
      if (currops.length==0) return;
      var curr=currops[currops.length-1];
          //data=currdata[currops.length-1];
      scale(curr);//currop.scale.set(5,5,5);scaling.push(currop);
      
      if (curr.afrom.length==0) { //no op but value
        //onsole.log(curr.texta[0]);
        var param=curr.param||oto(curr,0);
        param.result=curr.texta[0];
        //logInfo('param.result='+param.result);
        scale(param);
        currops.pop();
        
        //onsole.log('value-- '+param.result+' '+currops.length);
        //if (currops.length>0) { 
        //  //console.log(currops[currops.length-1]);
        //  currops[currops.length-1].result=param.result;
        //}
        return;
      }
      
      var opname=ofromPs(curr,ref),//ofrom(curr,0),
          opn=opname.texta[0];
      scale(opname);
      //if (!curr.params) 
      //onsole.log('opn="'+opn+'"');
      if (opn=='if') {
        var logif=false;
        if (logif) console.log('if 0');
        var params=curr.params
        if (params) {
          if (logif) console.log('if 1');
          //onsole.log('if-- params[0].result='+curr.params[0].result);
      
      
      //    currops.pop();
      //    if (curr.params[0].result) {
      //      curropsPush(curr.params[1]);scale(curr.params[1]);
      //    } else {
      //      curropsPush(curr.params[2]);scale(curr.params[2]);
      //    }
      //    delete(curr.params);
      
          if (!params.gramif) {
            if (logif) console.log('if 2');
            //data.result0=params[0].result;
            if (params[0].result) {//data.result0) {
              curropsPush(params[1]);scale(params[1]);
            } else {
              curropsPush(params[2]);scale(params[2]);
            }
            params.gramif=1;
          } else {
            if (logif) console.log('if 3');
            currops.pop();
            var param=oto(curr,0);
            if (params[0].result) {//data.result0) {
              if (logif) console.log('if then result: '+params[1].result);
              param.result=params[1].result;
            } else {
              if (logif) console.log('if else result: '+params[2].result);
              param.result=params[2].result;
            }
            scale(param);
            delete(curr.params);
          }
      
          return;
        }
        paramsToArray(curr);
        //data.params=curr.params;
        //onsole.log('if-- params.len='+curr.params.length);
        curropsPush(curr.params[0]);
      
      } else if (opn=='=') {
        if (curr.params) {
          //for (var p of curr.params) console.log('-->'+p.result);
          var v0=curr.params[0].result,result=true;
          for (var i=curr.params.length-1;i>=1;i--) if (v0!=curr.params[i].result) { result=false;break; }
          var param=oto(curr,0);
          param.result=result;scale(param);
          delete(curr.params);
          currops.pop();
          return;
        }
        paramsToArray(curr);
        for (var i=curr.params.length-1;i>=0;i--) curropsPush(curr.params[i]);
      } else if (opn=='<') {
        if (curr.params) {
          var v0=curr.params[0].result,result=true;
          for (var i=curr.params.length-1;i>=1;i--) if (parseFloat(v0)>=parseFloat(curr.params[i].result)) { result=false;break; }
          var param=oto(curr,0);
          param.result=result;scale(param);
          delete(curr.params);
          currops.pop();
          return;
        }
        paramsToArray(curr);
        for (var i=curr.params.length-1;i>=0;i--) curropsPush(curr.params[i]);
      } else if (opn=='set') {
        if (curr.params) {
          var o=ofrom(curr.params[0],0);
          o.texta=[''+curr.params[1].result];
          //onsole.log(o.texta);
          scale(o);scale(curr.params[0]);
          Gree.textRender.call(o);
          delete(curr.params);
          currops.pop();
          if (curr.afrom.length==3) currops.push(ofrom(curr,2));
          return;
        }
        paramsToArray(curr);
        curropsPush(curr.params[1]);
      } else if (opn=='+') {
        //onsole.log(
        if (curr.params) {
          var result=0;
          for (var p of curr.params) { //console.log('+ param result: '+p.result);
            result+=parseFloat(p.result); }
          //console.log('+ result: '+result);
          delete(curr.params);
      
          var param=oto(curr,0);
          param.result=result;
          scale(param);
          currops.pop();
          return;
        }
        paramsToArray(curr);
        for (var i=curr.params.length-1;i>=0;i--) curropsPush(curr.params[i]);  
      } else if (opn=='-') {
        if (curr.params) {
          var pa=curr.params;
          var result=parseFloat(pa[0].result);
          for (var i=1;i<pa.length;i++) { 
            result-=parseFloat(pa[i].result); }
          //console.log('- result: '+result);
          delete(curr.params);
          var param=oto(curr,0);
          param.result=result;
          scale(param);
          currops.pop();
          return;
        }
        paramsToArray(curr);
        for (var i=curr.params.length-1;i>=0;i--) curropsPush(curr.params[i]);  
      } else if (opn=='out') {
        if (curr.params) {
          console.log(curr.params[0].result);
          delete(curr.params);
          currops.pop();
          if (curr.afrom.length==3) push(ofrom(curr,2));
          return;
        }
        paramsToArray(curr);
        curropsPush(curr.params[0]);
      } else if (opn=='func') {
        if (curr.params) {
          var o=ofrom(curr.params[0],0);
          o.gramFunc=curr.params;
          //funcs[curr.params[0].result]=curr.params;
          delete(curr.params);
          currops.pop();
          if (curr.afrom.length==3) push(ofrom(curr,2));
          return;
        }
        paramsToArray(curr);
        curropsPush(curr.params[0]);
      } else if (opname.gramFunc) {
        //onsole.log('gramFunc 0');
        if (curr.params) {
          //onsole.log('gramFunc 1');
          //onsole.log('gramFunc '+curr.params.length);
          //var fa=opname.gramFunc;
          
          if (!curr.params.gramStarted) {
            //onsole.log('gramFunc 2');
            var fa=opname.gramFunc;
            //onsole.log(fa);
            //now clone nodes
            //1) collect nodes of func into array via node.userData.cloneIndex
            
            var a=fa.nodeArray;
            if (!a) {
              a=[];
              nodesToArray(fa[0],a);
              fa.nodeArray=a;
            }
            
            //onsole.log(a);
            a=cloneNodes(a);
            var fa1=[];
            for (var i=0;i<fa.length;i++) fa1.push(a[fa[i].userData.cloneIndex]);
            //onsole.log(fa1);
            fa=fa1;
            
            if ((curr.params.length+2)!=fa.length) { console.log('wrong param count.');return; }
            for (var i=0;i<curr.params.length;i++) {
              var o=ofrom(fa[i+1],0);
              o.texta=[''+curr.params[i].result];
              o.original.texta=o.texta;
              o=o.original;
              //onsole.log(o.texta);
              scale(o);scale(curr.params[i]);
              Gree.textRender.call(o);
            }
            curr.params.gramStarted=fa;
            curropsPush(fa[fa.length-1]);
          } else {
            //onsole.log('gramFunc 3');
            var fa=curr.params.gramStarted;
            //onsole.log('gramFunc result: '+fa[fa.length-1].result+' '+curr.result);
      
            var param=oto(curr,0);
            param.result=fa[fa.length-1].result;
            //onsole.log(fa[fa.length-1]);
            scale(param);
      
            delete(curr.params);
            currops.pop();
            if (curr.afrom.length==3) push(ofrom(curr,2));
          }
          return;
        }
        paramsToArray(curr);
        for (var i=curr.params.length-1;i>=0;i--) curropsPush(curr.params[i]);
      }
      //
    }
    //---
    //var o0=Gree.addText('Test',-0.5,0,-1,{scale:0.01});
    //var o1=Gree.addText('Word',0.5,0,-1,{scale:0.01});
    //Gree.addLine(o0,o1,{minl:1,maxl:10});
    
    var ref={col:0x999900,minl:pf*10,maxl:1500},nextparam={col:0x00aa00,minl:pf*10,maxl:500},nextop={minl:pf*10,maxl:500},
        op={col:'#111',scale:pf},param={col:'#0a0',scale:pf};
    
    function opNode(x,y,z) {
      return Gree.addText('   ',pf*x,pf*y,pf*z,op);
    }
    function paramNode(x,y,z,s) {
      return Gree.addText(s||'   ',pf*x,pf*y,pf*z,param);
    }
    
    function textNode(s,x,y,z) {
      return Gree.addText(s,pf*x,pf*y,pf*z,{scale:pf});
    }
    
    
    function nextOp(n0,n1) {
      return Gree.addLine(n0,n1,nextop);
      //...
    }
    
    function nextParam(n0,n1) {
      return Gree.addLine(n0,n1,nextparam);
      //...
    }
    function refl(n0,n1) {
      return Gree.addLine(n0,n1,ref);
      //...
    }
    
    function twoOps() {
      
      var o0=Gree.addText('   ',50,150,50,op);
      var out=Gree.addText('out',50,100,150);
      Gree.addLine(o0,out,ref);
      var p0=Gree.addText('   ',150,150,50,param);
      Gree.addLine(o0,p0,nextparam);
      var v23=Gree.addText('23',150,150,150);
      Gree.addLine(p0,v23,ref);
      
      var o1=Gree.addText('   ',50,50,50,op);
      Gree.addLine(o0,o1,nextop);
      Gree.addLine(o1,out,ref);
      p0=Gree.addText('   ',150,50,50,param);
      Gree.addLine(o1,p0,nextparam);
      var v42=Gree.addText('42',150,50,150);
      Gree.addLine(p0,v42,ref);
      
      //...
    }
    function loopSimple() {
      
      var o0=opNode(50,150,50);
      var out=textNode('out',100,200,50);
      refl(o0,out);
      var p0=paramNode(150,150,50);
      nextParam(o0,p0);
      var v23=textNode('Looping forever, yay.',200,200,50);
      refl(p0,v23);
      
      
      var o1=opNode(0,50,50);
      nextOp(o0,o1);
      var o2=opNode(-50,150,50);
      nextOp(o1,o2);
      nextOp(o2,o0);
      
      //...
    }
    
    function loopWithExit() {
      
      
      var o0=opNode(50,150,50);push(o0);
      var v=textNode('if',50,200,50);
      refl(o0,v);//Gree.addLine(o0,v,ref);
      var p0=paramNode(150,150,50,'//what?');
      nextParam(o0,p0);
      
      var o1=opNode(150,250,50);refl(p0,o1);
      var equals=textNode('=',150,300,50);refl(o1,equals);
      var p1=paramNode(250,250,50);nextParam(o1,p1);
      v=textNode('9',250,300,50);refl(p1,v);
      var p2=paramNode(350,250,50);nextParam(p1,p2);
      var count=textNode('0',450,100,250);refl(p2,count);
      
      p1=paramNode(250,150,50,'//then');nextParam(p0,p1);//p0
      o1=opNode(350,150,50);refl(p1,o1);
      var out=textNode('out',250,50,250);refl(o1,out);
      p2=paramNode(450,150,50);nextParam(o1,p2);
      v=textNode('Loop ended.',450,200,50);refl(p2,v);
      
      p0=paramNode(250,50,50,'//else');nextParam(p1,p0);
      o1=opNode(250,-50,50);refl(p0,o1);
      v=textNode('set',300,0,50);refl(o1,v);
      p0=paramNode(350,-50,50);nextParam(o1,p0);refl(p0,count);
      p1=paramNode(450,-50,50);nextParam(p0,p1);
      var o2=opNode(550,-50,50);refl(p1,o2);
      v=textNode('+',500,0,50);refl(o2,v);
      p0=paramNode(550,50,50);nextParam(o2,p0);refl(p0,count);
      p1=paramNode(550,150,50);nextParam(p0,p1);
      v=textNode('1',550,200,50);refl(p1,v);
      
      o2=opNode(150,-50,50);nextOp(o1,o2);refl(o2,out);
      p0=paramNode(150,50,50);nextParam(o2,p0);refl(p0,count);nextOp(o2,o0);
      
      //...
    }
    
    function load(sa) {
      //--
      var x=0,y=0,z=0;
      for (var i=0;i<sa.length;i++) {
        var a=sa[i],n=undefined,s0=a[0];
        //onsole.log(a);
        if (s0=='op') n=opNode(a[1]+x,a[2]+y,a[3]+z);
        else if (s0=='text') n=textNode(a[1],a[2]+x,a[3]+y,a[4]+z); 
        else if (s0=='refl') refl(sa[i+a[1]][1],sa[i+a[2]][1]);
        else if (s0=='param') n=paramNode(a[1]+x,a[2]+y,a[3]+z,a[4]);
        else if (s0=='nextParam') nextParam(sa[i+a[1]][1],sa[i+a[2]][1]);
        else if (s0=='nextOp') nextOp(sa[i+a[1]][1],sa[i+a[2]][1]);
        else if (s0=='pos') { x+=a[1];y+=a[2];z+=a[3];}
        else if (s0=='//') { }
        else { console.log('unknown node '+s0);break; }
        if ((currops.length==0)&&n) push(n);
        if (n===undefined) continue;
        sa[i]=[a,n];
      }
      //...
    }
    
    
    var sn0=planim.urlfiles.sn0;
    if (sn0) {
      var a=JSON.parse(sn0.v);
      load(a);
    } else
      loopWithExit();
    
    
    //----
  }
  sc.src='/three/gree.js';
  document.body.appendChild(sc);
  
  //planim.loadObjsThenLoop([{fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,-1.00),anim:'stand2',scale:0.004,ohkey:'m',roty:0},]);
  
  function test(v) {
    if (v==1) return 1;
    return test(1)+2;
    //...
  }
  //onsole.log('gree0.text(0)='+test(0));
  function fibo(v) {
    if (v<2) return v;//...
    return fibo(v-1)+fibo(v-2);
  }
  //console.log(fibo(2));
  //---
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,1
//fr o,1,13
//fr o,1,25
//fr o,1,25,11
//fr o,1,25,13
//fr o,1,25,15
//fr o,1,25,16
//fr o,1,25,17
//fr o,1,25,19
//fr o,1,25,21
//fr o,1,25,23
//fr o,1,25,25
//fr o,1,25,34
//fr o,1,25,35
//fr o,1,25,37
//fr o,1,25,42
//fr o,1,25,43
//fr o,1,25,48
//fr o,1,25,50
//fr o,1,33
//fr p,74,44
