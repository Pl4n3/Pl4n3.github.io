//--- 3d graphs with three.js
var Gree={};
(function (Gree) {
  var renderer,scene,camera,controls,os=[],lines=[],cont,mouse=new THREE.Vector2(),raycaster=new THREE.Raycaster(),plane,selected,
      offset=new THREE.Vector3(),cw,ch,canvFont,stats,effect,logDiv,vrInput,phoneVr,vrquat,keya={},ot,quat,sel0,sel1,camMove,doShot=false,
      lineMaterial,colEdit='#f60',colCursor='#c60',colSel='#090',colSel1='#460',cursor={x:0,y:0,on:true},seldist,distt=0,cfg={};
  //init();
  //animate();
  //gree[218,51.49,91.17]
  
  function addCanvas(p) {
    var c1=document.createElement('canvas');
    //Gree.log(p.cw+' '+p.ch);
    var w2=Math.pow(2,1+Math.floor(Math.log(Math.max(p.cw,p.ch))/Math.log(2)));
    //Gree.log(w2);
    c1.width=w2;//p.cw*2;
    c1.height=w2;//p.ch*2;
    var ct=c1.getContext('2d');
    var t1=new THREE.Texture(c1);
    t1.needsUpdate=true;
    //t1.minFilter=THREE.LinearMipMapLinearFilter;
    //t1.minFilter=THREE.LinearFilter;
    //Nearest
    var planeMaterial=new THREE.MeshBasicMaterial({
      map:t1,
      opacity:0.8,
      transparent:true
    });
    var geom;
    var o=new THREE.Mesh(geom=new THREE.PlaneGeometry(p.cw*p.gf,p.ch*p.gf),planeMaterial);
    
    var xa=p.cw/w2,ya=p.ch/w2;
    geom.faceVertexUvs=[[
       [{x:0,y:1}   ,{x:0,y:1-ya},{x:xa,y:1}]
      ,[{x:0,y:1-ya},{x:xa,y:1-ya},{x:xa,y:1}]]];//[0][0][0].y*=p.ar;
    
    
    o.position.set(p.x,p.y,p.z);
    scene.add(o);
    os.push(o);
    o.ato=[];
    o.afrom=[];
    o.dx=0;
    o.dy=0;
    o.dz=0;
    o.c=c1;o.t=t1;o.ct=ct;
    o.cw=p.cw;o.ch=p.ch;o.gf=p.gf;o.x=p.x;o.y=p.y;o.z=p.z;
    o.geometry=geom;
    return o;
  }
  function setSize(o,cw,ch) {
    var c=o.c;
    var w2=Math.pow(2,1+Math.floor(Math.log(Math.max(cw,ch))/Math.log(2)));
    c.width=w2;c.height=w2;o.ct=c.getContext('2d');
    var x=cw*o.gf/2,y=ch*o.gf/2,g=o.geometry;
    g.vertices[0].x=-x;g.vertices[0].y=y;
    g.vertices[1].x=x;g.vertices[1].y=y;
    g.vertices[2].x=-x;g.vertices[2].y=-y;
    g.vertices[3].x=x;g.vertices[3].y=-y;
    
    var xa=cw/w2,ya=ch/w2;
    g.faceVertexUvs=[[
       [{x:0,y:1}   ,{x:0,y:1-ya},{x:xa,y:1}]
      ,[{x:0,y:1-ya},{x:xa,y:1-ya},{x:xa,y:1}]]];//[0][0][0].y*=p.ar;
    
    o.cw=cw;o.ch=ch;
    g.uvsNeedUpdate=true;
    g.verticesNeedUpdate=true;
    if (o.render) o.render();
  }
  function measureContext(p) {
    var ctf=canvFont.getContext('2d');
    ctf.font=p.size+'px Arial';
    return ctf;
  }
  function textRender(dt) {
    var o=this,ct=o.ct;
    delete(o.render);
    ct.fillStyle=o.col||'#ffc';//o.col?o.col:'#ffc';
    ct.fillRect(0,0,o.cw,o.ch);
    ct.font=o.fontSize+'px Arial';
    ct.fillStyle='#000';
    ct.textBaseline='top';
    //ct.fillText(o.text,3,4);
    var a=o.texta,x0=o.ff+1,y0=o.ff+2;
    for (var i=0;i<a.length;i++) {
      var s=a[i];
      ct.fillText(s,x0,y0+i*o.fontSize);
    }
    ct.strokeStyle=o.col?o.col:'#550';
    var lw=o.ff*(o.col?1.5:0.5);
    ct.lineWidth=lw;
    ct.strokeRect(lw/2,lw/2,o.cw-(lw),o.ch-(lw));
    o.t.needsUpdate=true;//---2020-03-24 needed in gree0 for updates with set
    if (!Gree.isEdit||!cursor.on) return;
    ct.fillStyle=colCursor;
    var s=a[cursor.y];
    var xh=measureContext({size:o.fontSize}).measureText(s.substr(0,cursor.x)).width;
    ct.fillRect(x0-o.ff*1.5+xh,y0-1+cursor.y*o.fontSize,o.ff*3,o.fontSize+2);
  }
  function textDim(o) {
    var ff=o.ff,h=o.fontSize;
    
    var ctf=measureContext({size:h});
    var a=o.texta;
    //console.log(a);
    
    var w=0;
    for (var i=a.length-1;i>=0;i--) w=Math.max(w,ctf.measureText(a[i]).width);
    w=Math.floor(w+0.5);
    w+=ff*2+2;
    
    o.cw=w;
    o.ch=a.length*h+ff*2+2;
    return o;
  }
  function addText(s,x,y,z,ps) {
    if (!ps) ps={};
    //var ff=4,h=12*ff;
    //var ctf=measureContext({size:h});
    //var a=s.split('\n');
    //var w=0;
    //for (var i=a.length-1;i>=0;i--) w=Math.max(w,ctf.measureText(a[i]).width);
    //w=Math.floor(w+0.5);
    //w+=ff*2+2;
    //var o=addCanvas({x:x,y:y,z:z,cw:w,ch:a.length*h+ff*2+2,gf:1/ff});
    //o.fontSize=h;
    //o.text=s;o.texta=a;o.ff=ff;
    
    var ff=4;
    var oh={ff:ff,fontSize:12*ff,texta:s.split('\n')};
    oh=textDim(oh);
    var o=addCanvas({x:x,y:y,z:z,cw:oh.cw,ch:oh.ch,gf:(ps.scale||1)/oh.ff});
    o.fontSize=oh.fontSize;
    //o.text=s;
    o.texta=oh.texta;o.ff=oh.ff;
    if (ps.col) o.col=ps.col;
    
    textRender.call(o);
    return o;
  }
  //gree[250.84,46.09,39.06]
  function addLine(o0,o1,ps) {
    if (!ps) ps={};
    //var x0=o0.position.x,y0=o0.position.y,z0=o0.position.z,
    //    x1=o1.position.x,y1=o1.position.y,z1=o1.position.z;
    //var dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.sqrt(dx*dx+dy*dy+dz*dz),b=Math.min(20,l/4);
    //dx/=l;dy/=l;dz/=l;
    //var o=new THREE.ArrowHelper(new THREE.Vector3(dx,dy,dz),new THREE.Vector3(0,0,0),l-b*2,0x000000);
    //				o.position.set(x0+b*dx,y0+b*dy,z0+b*dz);
    var o;
    
    if (Gree.arrows) 
      o=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0),20,ps.col||0,2,1);
    else {
      var g=new THREE.Geometry();g.vertices=[new THREE.Vector3(0,0,0),new THREE.Vector3(10,10,10)];
      o=new THREE.Line(g,lineMaterial);
    
      g=new THREE.CubeGeometry(3,3,3);
      //var m=new THREE.MeshBasicMaterial({color:0x00ff00});
      
      var m=				new THREE.MeshPhongMaterial({
        					color: 0x156289,
    		    			emissive: 0x072534,
    				    	side: THREE.DoubleSide,
    					    shading: THREE.FlatShading
    				  })
      
      var c=new THREE.Mesh(g,m);
      scene.add(c);
      o.head=c;
    }
    
    o.userData.greePs=ps;
    o0.afrom.push(o);
    o1.ato.push(o);
    o.o0=o0;
    o.o1=o1;
    if (ps.minl) o.minl=ps.minl;
    if (ps.maxl) o.maxl=ps.maxl;
    updateLine(o);
    //console.log(o);
    lines.push(o);
    scene.add(o);
    
    
    
    
  }
  function lineRemoveI(i) {
    var l=lines[i],o0=l.o0,o1=l.o1;
    var j=o0.afrom.indexOf(l);o0.afrom.splice(j,1);
    j=o1.ato.indexOf(l);o1.ato.splice(j,1);
    lines.splice(i,1);
    scene.remove(l);
    scene.remove(l.head);
  }
  //gree[162.82,167.66,80.61]
  function updateLine(o) {
    var o0=o.o0,o1=o.o1,x0=o0.position.x,y0=o0.position.y,z0=o0.position.z,x1=o1.position.x,y1=o1.position.y,z1=o1.position.z,dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.sqrt(dx*dx+dy*dy+dz*dz),b=Math.min(cfg.lineb||20,l/4);
    dx/=l;
    dy/=l;
    dz/=l;
    
    if (Gree.arrows) {
      o.setDirection(new THREE.Vector3(dx,dy,dz));
      o.setLength(l-b*2,cfg.headLength||20,cfg.headWidth||5);//setting headlength only works in new three.js
    } else {
      l=l-b*2;
      var g=o.geometry;
      g.vertices[1].set(dx*l,dy*l,dz*l);
      g.verticesNeedUpdate=true;
      
      var c=o.head;
      c.position.set(x0+(b+l)*dx,y0+(b+l)*dy,z0+(b+l)*dz);
    }
    
    o.position.set(x0+b*dx,y0+b*dy,z0+b*dz);
  }
  //gree[74.85,99.14,261.55]
  function initCore() {
    //...
    canvFont=document.createElement('canvas');
    //...
  }
  function init() {
    // renderer
    renderer=new THREE.WebGLRenderer({ antialias:true });
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(12303291);
    //renderer.devicePixelRatio=window.devicePixelRatio;
    //renderer.setPixelRatio(window.devicePixelRatio);
    cont=document.body;
    var rd=renderer.domElement;
    //cont.appendChild(rd);
    // scene
    lineMaterial=new THREE.LineBasicMaterial({color:0x000f});
    
    scene=new THREE.Scene();
    scene.add(THREE.AxesHelper?new THREE.AxesHelper(300):new THREE.AxisHelper(300));
    // camera
    camera=new THREE.PerspectiveCamera(45,1,1,10000);Gree.camera=camera;
    //window.innerWidth / window.innerHeight
    camera.position.set(200,100,400);
    
    var l=new THREE.PointLight(0xffffff,1,0);
    l.position.set(0,250,250);
    scene.add(l);
    
    
    
    function gotVRDevices(devices) {
      //og('gotVRDevices');
      for (var i=0;i<devices.length;i++) {
        var d=devices[i];
        if (d instanceof PositionSensorVRDevice) {
          console.log('vr found 0');
          vrInput=d;//log('vr device found.');
          d.resetSensor();//formerly zeroSensor
          console.log('vr found 1');
          break;
        }
      }
    }
    if (navigator.getVRDevices) navigator.getVRDevices().then(gotVRDevices); else
    if (navigator.mozGetVRDevices) navigator.mozGetVRDevices(gotVRDevices);
    if (window.PhoneVR) phoneVr=new PhoneVR();
    
    
    if (THREE.OculusRiftEffect) {
      var HMD={
        //		hResolution: dpr*window.innerWidth/ps.scf,//640 1280 2560
    	    //	vResolution: dpr*window.innerHeight/ps.scf,//360 800  1440
    	  	  	hResolution:2560,
        vResolution:1440,
        hScreenSize: 0.14976,
    	  	  vScreenSize: 0.0936,
        //hScreenSize: 0.07488,//0.14976,
    	  	  //vScreenSize: 0.04212,//0.0936,
    	  	  interpupillaryDistance: 0.074,
    	    	lensSeparationDistance: 0.074,
    	    	eyeToScreenDistance: 0.041,
    	    	distortionK : [1.0, 0.22, 0.24, 0.0],
    		    chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
      };
      effect=new THREE.OculusRiftEffect(renderer,{worldFactor:100,HMD:HMD});
    }
    
    
    if (false) {
      logDiv=document.createElement('div');
      logDiv.innerHTML='Log.';
      var s=logDiv.style;s.backgroundColor='rgba(255,255,255,0.2)';s.position='absolute';s.left='0px';s.top='0px';
      cont.appendChild(logDiv);
    }
    resize();
    cont.appendChild(rd);
    // (camera) controls
    if (THREE.OrbitControls) {
      controls=new THREE.OrbitControls(camera,rd);
      //controls.rotateSpeed=0.4;
      //controls.autoRotate=true;
    }
    
    initCore();
    //var o0=addText('Hai0',-50,-50,0);
    //var o1=addText('Hai1',200,50,0);
    //addLine(o0,o1);//-100,50,0,100,50,0);
    //var object=new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( -50, 0, 0 ),50,0x000000);
    //				object.position.set(50,50,0);
    //				scene.add(object);
    //addLine(os[0],os[1]);
    plane=new THREE.Mesh(new THREE.PlaneGeometry(2000,2000,8,8),new THREE.MeshBasicMaterial({
      color:0,
      opacity:0.25,
      transparent:true,
      visible:false,
    }));
    plane.visible=true;//false;
    scene.add(plane);
    if (window.Stats) {
      stats=new Stats();
      stats.domElement.style.position='absolute';
      stats.domElement.style.top='0px';
      cont.appendChild(stats.domElement);
    }
    // events
    rd.addEventListener('mousemove',mouseMove,false);
    rd.addEventListener('mousedown',mouseDown,false);
    rd.addEventListener('mouseup',mouseUp,false);
    window.addEventListener('resize',resize,false);
    window.addEventListener('keydown',keyDown,false);
    window.addEventListener('keyup',keyUp,false);
    window.addEventListener('keypress',keyPress,false);
    
    
    
    animate();
  }
  //gree[117.67,28.62,125.44]
  function mouseMove(e) {
    mouse.x=e.clientX/cw*2-1;
    mouse.y=-(e.clientY/ch)*2+1;
    
    if (!raycaster.setFromCamera) return;
    raycaster.setFromCamera(mouse,camera);
    var o=selected;
    if (o) {
      var intersects=raycaster.intersectObject(plane);
      o.position.copy(intersects[0].point.sub(offset));
      for (var i=o.ato.length-1;i>=0;i--)
        updateLine(o.ato[i]);
      for (var i=o.afrom.length-1;i>=0;i--)
        updateLine(o.afrom[i]);
      return;
    }
    var intersects=raycaster.intersectObjects(os);
    if (intersects.length>0) {
      cont.style.cursor='pointer';
      var o=intersects[0].object;
      plane.position.copy(o.position);
      plane.lookAt(camera.position);
    } else
      cont.style.cursor='auto';
  }
  //gree[71.7,30.38,201.13]
  function mouseDown(e) {
    var vh=new THREE.Vector3(mouse.x,mouse.y,0.5);
    if (!vh.unproject) return;
    var vector=vh.unproject(camera);
    var raycaster=new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
    var intersects=raycaster.intersectObjects(os);
    if (intersects.length>0) {
      if (controls) controls.enabled=false;
      var o=intersects[0];
      //console.log(o);return;
      selected=o.object;
      var intersects=raycaster.intersectObject(plane);
      offset.copy(intersects[0].point).sub(plane.position);
      cont.style.cursor='move';
    }
  }
  //gree[21.96,27.32,251.35]
  function mouseUp(e) {
    if (controls) controls.enabled=true;
    if (selected) {
      plane.position.copy(selected.position);
      selected=null;
    }
    cont.style.cursor='pointer';
  }
  //gree[55.05,157.23,168.3]
  function resize(e) {
    //var c=renderer.domElement.parentNode;
    //cw=c.clientWidth*Gree.pwidth,ch=c.clientHeight;
    cw=window.innerWidth*Gree.pwidth,ch=window.innerHeight;
    //Gree.log('gree.resize '+cw+' '+ch+' '+window.devicePixelRatio+' '+renderer.devicePixelRatio);
    
    camera.aspect=cw/ch;
    camera.updateProjectionMatrix();
    renderer.setSize(cw,ch);  //renderer.domElement.style.position='absolute';
                              //renderer.domElement.style.left=cw+'px';
    if (effect) effect.setSize(cw,ch);
    var s=renderer.domElement.style;
    s.width=cw+'px';s.height=ch+'px';
  }
  function keyDown(e) {
    //..
    var kc=e.keyCode;
    //console.log('keyDown '+kc+' '+e.keyIdentifier);
    //console.log('keydown');
    //console.log(e);
    if ((kc==32)&&controls) {
      controls.autoRotate=!controls.autoRotate;
      console.log('controls.autoRotate='+controls.autoRotate); 
    }
    if (Gree.formKey(e)) return;
    
    if (Gree.isEdit) {
      var change=0;
      var o=sel0,a=o.texta,x=cursor.x,y=cursor.y;s=a[y];
      if (kc==27) {
        Gree.isEdit=false;
        sel0.col=colSel;sel0.render=textRender; } 
      else if (kc==39) { if (x<s.length) { cursor.x++;change=1; }}
      else if (kc==37) { if (x>0) { cursor.x--;change=1; }}
      else if (kc==40) { if (y<a.length-1) { cursor.y++;cursor.x=Math.min(cursor.x,a[cursor.y].length);change=1; }}
      else if (kc==38) { if (y>0) { cursor.y--;cursor.x=Math.min(cursor.x,a[cursor.y].length);change=1; }}
      else if (kc==36) { if (x>0) { cursor.x=0;change=1; }} 
      else if (kc==35) { if (x<s.length) { cursor.x=s.length;change=1; }} 
      else if (kc==8) { //BACKSPACE
        e.preventDefault();
        if (x>0) {
          a[y]=s.substr(0,x-1)+s.substr(x);cursor.x--;change=2;
        } else if (y>0) {
          cursor.x=a[y-1].length;a[y-1]+=s;a.splice(y,1);cursor.y--;change=2;
        }
      }
      else if (kc==46) { //DEL
        if (x<s.length) {
          a[y]=s.substr(0,x)+s.substr(x+1);change=2;
        } else if (y<a.length-1) {
          a[y]+=a[y+1];a.splice(y+1,1);change=2;
        }
      }
      else if (kc==13) {  //Return
        o.texta.splice(y+1,0,s.substr(x));o.texta[y]=s.substr(0,x);
        cursor.y++;cursor.x=0;change=2;
      }
      else if (kc==16||kc==17||kc==18) {}
      //else if (e.key.length==1) { a[y]=s.substr(0,x)+e.key+s.substr(x);cursor.x++;change=2; }
      if (change) { 
        if (change==2) { textDim(o);setSize(o,o.cw,o.ch); }
        cursor.on=1;cursor.t=0;o.render=textRender; 
        //Gree.change=true;
      }
      return;
    }
    
    keya[kc]=true;
    var shift=keya[16];
    if (kc==70) {
      var c=document.body;
      if (c.requestFullscreen) c.requestFullscreen();
      else if (c.mozRequestFullScreen) c.mozRequestFullScreen();
      else if (c.webkitRequestFullScreen) c.webkitRequestFullscreen(); 
      //checkInitVideo();
    } 
    else if (kc==88) { camera.rotation.x+=0.1*(shift?1:-1); } //X
    else if (kc==89) { camera.rotation.y+=0.1*(shift?1:-1); } //Y
    else if (kc==81) { //Q
      var m=new THREE.Matrix4();
      m.makeTranslation(0,0,-1);
      var m2=new THREE.Matrix4();
      m2.makeRotationFromQuaternion(quat);
      m2.multiply(m);
      var dx=m2.elements[12],dy=m2.elements[13],dz=m2.elements[14],
          px=camera.position.x,py=camera.position.y,pz=camera.position.z;
      
      var md=1000,mo;
      for (var h=os.length-1;h>=0;h--) {
        var o=os[h];
        if (!o.texta) continue;
        var ox=o.position.x,oy=o.position.y,oz=o.position.z,
            x=ox-px,y=oy-py,z=oz-pz,l=Math.sqrt(x*x+y*y+z*z);
        x=px+dx*l-ox;y=py+dy*l-oy;z=pz+dz*l-oz;var d=Math.sqrt(x*x+y*y+z*z);
        if (d>=md) continue;
        md=d;mo=o;
      }
    
      if (mo) Gree.select(mo);
      
        
      //console.log(Math.sqrt(dx*dx+dy*dy+dz*dz));
      
      
      //camera.position.x+=m2.elements[12]*dt;
      //camera.position.y+=m2.elements[13]*dt;
      //camera.position.z+=m2.elements[14]*dt;
    
    }
    else if (kc==82) { //R
      if (sel0) {
      var o=sel0,ox=o.position.x,oy=o.position.y,oz=o.position.z,
          px=camera.position.x,py=camera.position.y,pz=camera.position.z,
          dx=px-ox,dy=py-oy,dz=pz-oz,l=Math.sqrt(dx*dx+dy*dy+dz*dz);
      dx/=l;dy/=l;dz/=l;var l1=200;
      camMove={x0:px,y0:py,z0:pz,x1:ox+dx*l1,y1:oy+dy*l1,z1:oz+dz*l1,t:0,mt:500};
      //camera.position.x=ox+dx*l1;
      //camera.position.y=oy+dy*l1;
      //camera.position.z=oz+dz*l1;
      //console.log(l);
      }
    }
    else if (kc==86) doShot=true;
    else if (kc==76) { //L
      if (sel0&&sel1) {
        var del=0;
        for (var i=lines.length-1;i>=0;i--) {
          var l=lines[i],o0=l.o0,o1=l.o1;
          if (o0==sel0&&o1==sel1) { lineRemoveI(i);del++; }
          if (o0==sel1&&o1==sel0) { lineRemoveI(i);del++; }
        }
        if (del>0) Gree.log(del+'/'+(lines.length+del)+' line removed.'); else {
          addLine(sel1,sel0);Gree.log(lines.length+'. line added.');
        }
      } else Gree.log('Select 2 nodes.');
    }
  }
  function keyUp(e) {
    var kc=e.keyCode;
    
    if (Gree.formKey(e)||Gree.isEdit) {
      return;
    }
    
    keya[kc]=false;
    if ((kc==32)&&sel0) {
      Gree.isEdit=true;cursor.x=0;cursor.y=0;cursor.on=true;cursor.t=0;
      sel0.col=colEdit;sel0.render=textRender;
      //Gree.log('edit mode');
    } else if (kc==69) seldist=undefined;//E
  }
  function keyPress(e) {
    //Gree.log('keyPress '+e.keyCode+' '+e.key);
    //console.log('keypress');
    //console.log(e);
    if (Gree.formKey(e)||!Gree.isEdit) return;
    if (e.charCode==0) return;
    var o=sel0,a=o.texta,x=cursor.x,y=cursor.y;s=a[y];
    a[y]=s.substr(0,x)+String.fromCharCode(e.charCode)+s.substr(x);cursor.x++;
    textDim(o);setSize(o,o.cw,o.ch); 
    cursor.on=1;cursor.t=0;o.render=textRender;
    //Gree.change=true;
  }
  //gree[67.77,76.34,111.1]
  
  function quatMatrix(dx,dy,dz) {
    var m=new THREE.Matrix4();
    m.makeTranslation(dx,dy,dz);
    var m2=new THREE.Matrix4();
    //console.log(quat);
    m2.makeRotationFromQuaternion(quat);
    m2.multiply(m);
    return m2;
  }
  
  function animate() {
    if (controls) controls.update();
    var t=new Date().getTime();if (!ot) ot=t;
    var dt=t-ot;ot=t;distt+=dt;
    
    var checkDist=false;
    if (distt>100) { distt=0;checkDist=true; }
    
    if (Gree.isEdit) {
      cursor.t+=dt;
      if (cursor.t>175) {
        cursor.t=0;cursor.on=!cursor.on;sel0.render=textRender;
      }
    }
    
    if (vrInput) { var or=vrInput.getState().orientation;vrquat=[or.x,or.y,or.z,or.w]; }
    else if (phoneVr) { var or=phoneVr.rotationQuat();if (or) vrquat=[or.x,or.y,or.z,or.w];  }
    
    for (var h=lines.length-1;h>=0;h--) {
      var li=lines[h],o0=li.o0,o1=li.o1,p0=o0.position,p1=o1.position,dx=p1.x-p0.x,dy=p1.y-p0.y,dz=p1.z-p0.z,l=Math.max(0.01,Math.sqrt(dx*dx+dy*dy+dz*dz));
      dx/=l;
      dy/=l;
      dz/=l;
      var dl=0,minl=li.minl||100,maxl=li.maxl||100;
      
      if (l<minl)
        dl=(minl-l)/4;  //li.l
      else if (l>maxl)
        dl=(maxl-l)/4;
      
      o1.dx+=dx*dl;
      o1.dy+=dy*dl;
      o1.dz+=dz*dl;
      o0.dx-=dx*dl;
      o0.dy-=dy*dl;
      o0.dz-=dz*dl;
    }
    var md=Gree.grid,md2=md*md;//md=50
    //if (0)
    for (var i=os.length-1;i>=0;i--) {
      var o0=os[i];
      if (!o0.texta) continue;
      var p0=o0.position;
      if (checkDist)
      for (var j=i-1;j>=0;j--) {
        var o1=os[j];
        if (!o1.texta) continue;
        var p1=o1.position,dx=p1.x-p0.x,dy=p1.y-p0.y,dz=p1.z-p0.z,l=Math.max(0.01,dx*dx+dy*dy+dz*dz);
        if (l>=md2)
          continue;
        l=Math.sqrt(l);
        dx/=l;
        dy/=l;
        dz/=l;
        var dl=(md-l)/4;
        //li.l
        o1.dx+=dx*dl;
        o1.dy+=dy*dl;
        o1.dz+=dz*dl;
        o0.dx-=dx*dl;
        o0.dy-=dy*dl;
        o0.dz-=dz*dl;
      }
      var gr=Gree.grid;
      o0.dx+=(Math.floor(p0.x/gr+0.5)*gr-p0.x)/4;
      o0.dy+=(Math.floor(p0.y/gr+0.5)*gr-p0.y)/4;
      o0.dz+=(Math.floor(p0.z/gr+0.5)*gr-p0.z)/4; 
    }
    
    quat=camera.quaternion;
    if (vrquat) quat=new THREE.Quaternion(vrquat[0],vrquat[1],vrquat[2],vrquat[3]);
    
    var dx=0,dy=0,dz=0;
    if (keya[16]) {
      if (keya[87]||keya[38]) dy+=1;
      if (keya[83]||keya[40]) dy+=-1;
    } else {
      if (keya[87]||keya[38]) dz+=-1;//87
      if (keya[83]||keya[40]) dz+=1;//83
    }
    if (keya[65]||keya[37]) dx+=-0.5;//65
    if (keya[68]||keya[39]) dx+=0.5;//68
    
    if ((dx!=0)||(dy!=0)||(dz!=0)) {
      //var m=new THREE.Matrix4();
      //m.makeTranslation(dx,0,dz);
      //var m2=new THREE.Matrix4();
      ////console.log(quat);
      //m2.makeRotationFromQuaternion(quat);
      //m2.multiply(m);
      var m2=quatMatrix(dx,dy,dz);
      //console.log(m2.elements[12]+' '+m2.elements[13]+' '+m2.elements[14]);
      camera.position.x+=m2.elements[12]*dt;
      camera.position.y+=m2.elements[13]*dt;
      camera.position.z+=m2.elements[14]*dt;
      //camera.updateMatrix();
    }
    
    if (keya[69]&&sel0) { //E
      //var px=camera.position.x,py=camera.position.y,pz=camera.position.z;
      //var o=sel0,ox=o.position.x,oy=o.position.y,oz=o.position.z;
      //var dx=px-ox,dy=py-oy,dz=pz-oz,l=Math.sqrt(dx*dx+dy*dy+dz*dz);
      //dx/=l;dy/=l;dz/=l;var l1=l-200;
      //o.position.set(ox+dx*l1,oy+dy*l1,oz+dz*l1);
    
      var o=sel0,px=camera.position.x,py=camera.position.y,pz=camera.position.z;
      if (!seldist) {
        var ox=o.position.x,oy=o.position.y,oz=o.position.z,
            dx=px-ox,dy=py-oy,dz=pz-oz;
        seldist=Math.sqrt(dx*dx+dy*dy+dz*dz);
      }
      var m2=quatMatrix(0,0,-seldist);
      o.position.set(px+m2.elements[12],py+m2.elements[13],pz+m2.elements[14]);
      //camMove={x0:px,y0:py,z0:pz,x1:ox+dx*l1,y1:oy+dy*l1,z1:oz+dz*l1,t:0,mt:500};
    }
    
    if (camMove) {
      var c=camMove;
      c.t+=dt;if (c.t>=c.mt) { c.t=c.mt;camMove=undefined; }
      var f=c.t/c.mt;
      f=0.5-Math.cos(f*Math.PI)/2;  
      var f1=1-f;
      camera.position.x=c.x0*f1+c.x1*f;
      camera.position.y=c.y0*f1+c.y1*f;
      camera.position.z=c.z0*f1+c.z1*f;
      //camera.updateMatrix();
    }
    
    if (vrquat) { 
      var rotMat=new THREE.Matrix4();
      camera.matrixAutoUpdate=false;
      camera.updateMatrix();
      //rotMat.makeRotationFromEuler(new THREE.Euler(-camAx,PI+cam.rot,0,'ZYX'));
      //camera.matrix.multiply(rotMat);
      //quat=new THREE.Quaternion(vrquat[0],vrquat[1],vrquat[2],vrquat[3]);
      rotMat.makeRotationFromQuaternion(quat);
      camera.matrix.multiply(rotMat);
    }
    
    
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      var d=o.dx*o.dx+o.dy*o.dy+o.dz*o.dz;
      var md=10;
      if (d>md) {
        d=Math.sqrt(d);
        md=Math.sqrt(md);
        o.dx*=md/d;
        o.dy*=md/d;
        o.dz*=md/d;
      }
      o.position.x+=o.dx;
      o.position.y+=o.dy;
      o.position.z+=o.dz;
      o.dx=0;
      o.dy=0;
      o.dz=0;
      if (!o.texta) {
        //var m=new THREE.Matrix4();
        //m.makeTranslation(o.x,o.y,o.z);//-35,-25,-100);
        //var m2=new THREE.Matrix4();
        //m2.makeRotationFromQuaternion(quat);
        //m2.multiply(m);
        var m2=quatMatrix(o.x,o.y,o.z);
        o.position.x=camera.position.x+m2.elements[12];
        o.position.y=camera.position.y+m2.elements[13];
        o.position.z=camera.position.z+m2.elements[14];
      }
      o.quaternion.copy(quat);
      if (o.render) {
        o.t.needsUpdate=1;
        o.render(dt);
      }
    }
    for (var h=lines.length-1;h>=0;h--)
      updateLine(lines[h]);
    
    
    
    if (cfg.issub) return;
    
    
    
    var useEffect=effect&&vrquat;
    if (useEffect) effect.render(scene,camera);
    else {
      //renderer.autoClear=true;
      //renderer.setClearColor(12303291);
      renderer.render(scene,camera);
    }
    if (stats) stats.update();
    
    if (doShot) {
      doShot=false;
      var c0=renderer.domElement;
      var c1=document.createElement('canvas');
      var w=c0.width/(useEffect?2:1),h=c0.height,b=useEffect?Math.floor(h*0.2):0;w-=2*b;h-=2*b;
      c1.width=w;c1.height=h;
      var ct=c1.getContext('2d');
      ct.drawImage(c0,b,b,w,h,0,0,w,h);
      //window.open(c1.toDataURL('image/png'),'PngExport');
      var div=document.createElement('div');
      var b=document.createElement('button');b.innerHTML='Back';div.appendChild(b);
    b.onclick=function() {
      document.body.removeChild(div);
      c0.style.display='';
    }
      div.appendChild(document.createTextNode(' Export screenshot:'));
      div.appendChild(document.createElement('br'));  
      var i=new Image();i.src=c1.toDataURL('image/png');
      i.style.width='300px';
      div.appendChild(i);
      document.body.appendChild(div);
      c0.style.display='none';
      Gree.log('screenshot done.')
      //console.log(c0);
    }
    
    
    requestAnimationFrame(animate);
  }
  //gree[313.39,111.31,76.17]
  function remove(o) {
    scene.remove(o);
    os.splice(os.indexOf(o),1);
  }
  function clear() {
    for (var i=os.length-1;i>=0;i--)
      scene.remove(os[i]);
    os.splice(0,os.length);
    for (var i=lines.length-1;i>=0;i--)
      scene.remove(lines[i]);
    lines.splice(0,lines.length);
  }
  Gree.os=os;
  Gree.lines=lines;
  Gree.init=init;
  Gree.addCanvas=addCanvas;
  Gree.addText=addText;
  Gree.addLine=addLine;
  Gree.clear=clear;
  Gree.setSize=setSize;
  Gree.textRender=textRender;
  Gree.remove=remove;
  Gree.quatMatrix=quatMatrix;
  Gree.animate=animate;
  Gree.pwidth=0.5;
  Gree.arrows=true;
  Gree.isEdit=false;
  Gree.grid=50;
  //Gree.change=false;
  Gree.getVrquat=function() {
    return vrquat;
  }
  Gree.getVrInput=function() {
    return vrInput;
  }
  Gree.log=function(s) {
    if (logDiv) logDiv.innerHTML=s+'<br>'+logDiv.innerHTML;
  }
  Gree.formKey=function(e) {
    var tc=e.target;
    return (tc instanceof HTMLTextAreaElement)||(tc instanceof HTMLInputElement);
  }
  Gree.select=function(o) {
    if (sel0) { 
      if (o==sel0) return;
      if (sel1) { delete(sel1.col);sel1.render=textRender; }
      sel1=sel0;sel1.col=colSel1;sel1.render=textRender; 
    }
    sel0=o;sel0.col=colSel;sel0.render=textRender;
  }
  Gree.initSub=function(ps) {
    initCore();
    scene=ps.base;
    camera=ps.camera;
    cfg=ps;
    cfg.issub=1;
    //...
  }
}
(Gree));  //fr o,2
           //fr o,2,5
           //fr o,2,14
//fr o,2
//fr o,2,7
//fr o,2,10
//fr o,2,12
//fr o,2,14
//fr o,2,17
//fr o,2,36
//fr o,2,62
//fr p,16,135
