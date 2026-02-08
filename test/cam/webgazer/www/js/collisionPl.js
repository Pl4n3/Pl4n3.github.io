// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = false;

const collisionSVG = "collisionSVG";
var force = [];
var nodes = [];
let debug=false;
let pointDisplay;
let fmPositions;

function createPointDisplay() {
  //---
  let c=document.createElement('canvas'),w=640,h=480;
  c.width=w;c.height=h;
  let st=c.style;
  //st.backgroundColor='#0f0';
  st.position='absolute';
  st.left='0px';st.top='240px';
  document.body.appendChild(c);
  let ct=c.getContext('2d');
  let r={
  drawPoints:function() {
    //---
    let pts=fmPositions;
    ct.clearRect(0,0,w,h);
    //onsole.log('drawPoints');
    ct.strokeStyle='#000';
    ct.strokeRect(0,0,w,h);
    ct.fillStyle='#444';
    //onsole.log(pts.length);
    //or (let p of pts) 
    for (let i=0;i<pts.length;i++) {
      let p=pts[i],x=p[0],y=p[1],f=8;
      x=(x-w/2)*f+w/2;
      y=(y-h/2)*f+h/2;
      ct.fillRect(x,y,2,2);
      if (f>1) ct.fillText(''+i,x,y);
    }
    //...
  }
  };
  return r;
  //...
}

window.onload = async function() {
  
      if (0&&!window.saveDataAcrossSessions) {
          var localstorageDataLabel = 'webgazerGlobalData';
          localforage.setItem(localstorageDataLabel, null);
          var localstorageSettingsLabel = 'webgazerGlobalSettings';
          localforage.setItem(localstorageSettingsLabel, null);
      }
  
  let urls=Conet.parseUrl();
  let useCam=(urls.useCam===undefined)?1:((urls.useCam==0)?0:urls.useCam);   
  if (useCam=='debug') debug=true;
  if (useCam) { 
      
      const webgazerInstance = await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('TFFacemesh')
        .begin();  
  let st=webgazer.getVideoElementCanvas().style;
  if (debug) {
    st.display='';st.position='absolute';
    st.left='320px';
    pointDisplay=createPointDisplay();
  }
      
      webgazerInstance.showVideoPreview(false) //debug /* shows all video previews */
        .showPredictionPoints(false) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); // Kalman Filter defaults to on.
        // Add the SVG component on the top of everything.
      //setupCollisionSystem();
      webgazer.setGazeListener( collisionEyeListener );
      //webgazer.getVideoElementCanvas().style.display='';
   }
  
  (function() {
    //---
    let scene,m0,m1,tweens=[];
    
    function box(x,y,z,w,h,b,m) {
      let mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,b),m);
      mesh.position.set(x,y,z);
      mesh.updateMatrix();
      mesh.matrixAutoUpdate=false;
      mesh.castShadow=true;
      mesh.receiveShadow=true;
      scene.add(mesh);
      return mesh;
    }
    
    function init() {
      
      //script src="https://threejs.org/build/three.min.js">/script>  //r124
      //script src="https://threejs.org/examples/js/libs/stats.min.js">/script> //r109
      //script src="https://threejs.org/examples/js/controls/OrbitControls.js">/script>  //v81
      
      
      let camera,controls,renderer,stats,o5,slider;
      
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setClearColor(0x888888);
      renderer.shadowMap.enabled=true;
      renderer.shadowMap.type=THREE.BasicShadowMap;
      //renderer.outputEncoding=THREE.sRGBEncoding;
      //				renderer.shadowMapEnabled=true;
      //				renderer.shadowMapType=THREE.PCFShadowMap;//PCFShadowMap;
      
      renderer.setPixelRatio( window.devicePixelRatio );let w,h;
      renderer.setSize(w=640,h=480);// window.innerWidth, window.innerHeight );
      
      let cont=document.body//document.getElementById('container')
        ,ms=[];
          
      cont.appendChild(c=renderer.domElement);
      let st=c.style;
      if (debug) {
        st.position='absolute';
        st.left='640px';st.top='240px';
      }
      st.width='640px';st.height='480px';
      
      camera=new THREE.PerspectiveCamera(60,w/h,1,3000);
      camera.position.z=500;
      
      if (1) {
      controls=new THREE.OrbitControls(camera,renderer.domElement);
      //controls.enableDamping=true;
      //controls.dampingFactor=0.25;
      camera.position.set(0,0,200);
      controls.enableZoom=true;
      controls.enablePan=true;
      controls.maxDistance=600;
      //controls.rotateSpeed=0.4;
      }
      
      m0=new THREE.MeshPhongMaterial( { color:0x666666,flatShading:true } );
      m1=new THREE.MeshPhongMaterial({color:0x77dd77,flatShading:true,
            transparent:true,opacity:0.5});//9.7
      
      var bw=20,ot=Date.now();//,sw=15,sw2=(sw-1)/2,bh=bw/2;//20,15
      
      function dist2(p0,p1) {
        //---
        let dx=p0[0]-p1[0],dy=p0[1]-p1[1],dz=p0[2]-p1[2],d2=dx*dx+dy*dy+dz*dz;
        return d2;
        //...
      }
      
      function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        stats.update();
        
        let t=Date.now(),dt=t-ot;ot=t;
        Conet.calcTweens(tweens,dt);
        //console.log(dt);
        
        let pts=fmPositions,ww,wh;
        if (o5) {//&&pts) {
          if (pts) {
          let c=o5.texCanv;
          let ct=c.getContext('2d');
          ct.fillStyle=(Math.random()<0.5)?'#f00':'#0f0';
          ct.fillRect(0,0,c.width,c.height);
          let c0=webgazerCanvas;
          if (c0) ct.drawImage(c0,0,0);
          o5.canvTex.needsUpdate=true;
          
          ////let pa=[224,130,24,22,190,222];
          //let pa=[224,24,22,222,190,130];
          let pa=o5.ext?.webgazer.uvs||[27,24,22,222,190,130,  
                  442,463,252,254,259,359,
                  57,181,39,405,269,287
                  //57,181,178,81,39, 13,0,17,14,269,311,402,405,287
                  //57,181,179,41,39, 12,0,17,15,269,271,403,405,287
                  ];
          ////let pa=[27,130,24,22,190,56];
          let uvs=o5.meshes[1].baUvs,a=uvs.array;
          for (let i=0;i<pa.length;i++) {
            let p=pts[pa[i]];
            a[i*2]=p[0]/512;
            a[i*2+1]=1-(p[1]/512);
          }
          uvs.needsUpdate=true;
          ww=webgazerCanvas.width;
          wh=webgazerCanvas.height;
          }   
          
          if (!useCam) {
            let m=o5.meshes[1],uvs=m.baUvs,a=uvs.array,i0=25,i1=i0+1;
            for (let i=i0;i<i1;i++) {
              a[i*2]+=0.001;//=Math.random();
              a[i*2+1]+=0.001;//=Math.random();
            }
            uvs.needsUpdate=true;
          } 
              
          for (let ak of o5.anim) {
          if (pts) {
          if (1) { 
            let p0=pts[10],p1=pts[152],dy=p0[1]-p1[1],dz=p0[2]-p1[2],ang=Math.atan2(-dz,-dy);
            //console.log(ang);
            ak.bs[2].q.x=-ang*0.5; 
          }
          if (1) { 
            let p0=pts[93],p1=pts[323],dx=p0[0]-p1[0],dz=p0[2]-p1[2],ang=Math.atan2(-dz,-dx);
            //console.log(ang);
            ak.bs[2].q.y=-ang*0.5; 
          }
          if (1) { 
            let p0=pts[93],p1=pts[323],dx=p0[0]-p1[0],dy=p0[1]-p1[1],ang=Math.atan2(-dy,-dx);
            //console.log(ang);
            ak.bs[2].q.z=ang*0.5; 
          }
          if (1) {
            let p0=pts[93],p1=pts[323],mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2,mz=(p0[2]+p1[2])/2;
            //console.log(Conet.f4(mx)+' '+Conet.f4(my)+' '+Conet.f4(mz));
            ak.bs[2].t.x=(mx-ww/2);//320
            ak.bs[2].t.y=85-(my-wh/2);//240
            //onsole.log(o5.anim[0].bs[2].t.y);
          }
          //mouth
          if (o5.ext?.webgazer.mouthTransform) {
            //let p0=pts[0],p1=pts[17],dx=p0[0]-p1[0],dy=p0[1]-p1[1],dz=p0[2]-p1[2],d2=dx*dx+dy*dy+dz*dz;
            let d0=dist2(pts[0],pts[17]),d1=dist2(pts[10],pts[152]);
            //console.log(Conet.f4(d0/d1));
            ak.bs[6].q.x=-d0/d1*4;
            ak.bs[6].t.y=45-d0/d1*200;
            ak.bs[6].t.z=0+d0/d1*100;
          }
          }
          if (slider) {
          let f=slider.value/100,
            x0=12.5,x1=25,x=(x1-x0)*f+x0,
            y0=62.5,y1=80,y=(y1-y0)*f+y0,
            z0=37.5,z1=40,z=(z1-z0)*f+z0;
          ak.bs[3].t.x=x;
          ak.bs[5].t.x=-x;
          ak.bs[3].t.y=y;
          ak.bs[5].t.y=y;
          ak.bs[3].t.z=z;
          ak.bs[5].t.z=z;
          }
          }
        }
        
        threeRender(dt);
        
        renderer.render(scene,camera);
        //render();
      }
      
      //if (0)
      let ground=box(0,-150,0,1600,bw,1600,m0);
      ground.castShadow=false;
      
      var l=new THREE.AmbientLight(0x555555),f=3;scene.add(l);
      l=new THREE.PointLight(0xffffff,1,0);l.position.set(-100*f,200*f,100*f);scene.add(l);
      l=new THREE.PointLight(0xffffaa,1,0);l.position.set(100*f,100*f,100*f);
      l.castShadow=true;
      l.shadow.camera.near=100;
      l.shadow.camera.far=3000;
      l.shadow.mapSize.width=1024;//2048;
      l.shadow.mapSize.height=1024;
      scene.add(l);
      l=new THREE.PointLight(0xaaffff,1,0);l.position.set(100*f,-200*f,-100*f);scene.add(l);
      
      
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      stats.domElement.style.left = '654px';
      stats.domElement.style.zIndex = 100;
      cont.appendChild(stats.domElement);
      
      Conet.download({fn:(urls.fn||'/anim/w3dit/objs/webgazer/v2mouth.o5.json'),f:function(v) {
        //---
        let o=Pd5.load(v);o5=o;
        o.scale=1;
        //if (ps0.anim) Pd5.animStart(o,ps0.anim);
        threeEnv.base=scene;//ps1.base;
        //if (ps0.transparent) o.transparent=true;
        
        if (useCam) o.meshes[1].diff='canv:';
        //console.log(o.meshes);
        //o.meshes[1].basicMaterial=1;
        
        threeAddObj(o,0,-150,0,1);//0.5
        //if (ps.ay) o.ay=ps.ay;
        //if (ps0.ay) o.ay=ps0.ay;//250615 added and tested, is ps.ay check still needed?
        o.calcVertNorms=1;
        
        if (o.ext?.webgazer.slider) {
        {
        let c=document.createElement('input');slider=c;
        c.type='range';c.step='any';c.value=100;
        c.style.width='636px';
        if (debug) {
          c.style.position='absolute';
          c.style.top='700px';
        }
        cont.appendChild(c);
        }
        
        if (!debug) {
          let c=document.createElement('div');
          c.innerHTML='Morph face with slider.';
          //c.style.fontSize='1.5em';
          cont.appendChild(c);
        }
        }
        
        /* bluescreen checkbox */ {
          //---
          cont.appendChild(document.createTextNode('Blue screen'));
          let c=document.createElement('input'),lsk='webgazeBlueScreen';
          c.type='checkbox';
          c.oninput=function() {
            //---
            //console.log(this.checked);
            let o=this.checked;
            renderer.setClearColor(o?0x0000ff:0x888888);
            ground.visible=!o;
            localStorage[lsk]=o?1:undefined;
            //...
          }
          cont.appendChild(c);
          if (localStorage[lsk]==1) { c.checked=true;c.oninput(); }
          //...
        }
        
        
        //console.log(o);
        //...
      }
      });
      
      
      //window.addEventListener('resize',resize,false);
      
      
      animate();
      //---
    }
    init();
    //...
  }
  )();
      
  //---
}
;

window.onbeforeunload = function() {
  if (window.saveDataAcrossSessions) {
      webgazer.end();
  } else {
      //localforage.clear();
  }
}

var webgazerCanvas = null;

var previewWidth = webgazer.params.videoViewerWidth;

var collisionEyeListener = async function(data, clock) {
  if(!data)
    return;
  /*
  nodes[0].px = data.x;
  nodes[0].py = data.y;
  force.resume();
  */
  if (!webgazerCanvas) {
    webgazerCanvas=webgazer.getVideoElementCanvas();
    //webgazerCanvas.style.display='';
  }
  //console.log(webgazerCanvas.width);
  //webgazerCanvas.style.display='';
  
  fmPositions=await webgazer.getTracker().getPositions();
  //onsole.log(fmPositions);
  if (pointDisplay) pointDisplay.drawPoints(fmPositions);
  /*
  var whr = webgazer.getVideoPreviewToCameraResolutionRatio();
  
  var line = d3.select('#eyeline1')
            .attr("x1",data.x)
            .attr("y1",data.y)
            .attr("x2",previewWidth - fmPositions[145][0] * whr[0])
            .attr("y2",fmPositions[145][1] * whr[1]);
  
  var line = d3.select("#eyeline2")
            .attr("x1",data.x)
            .attr("y1",data.y)
            .attr("x2",previewWidth - fmPositions[374][0] * whr[0])
            .attr("y2",fmPositions[374][1] * whr[1]);
  
  var dot = d3.select("#predictionSquare")
            .attr("x",data.x)
            .attr("y",data.y);
  */
  //----
}
//fr o,10
//fr o,10,10
//fr o,12
//fr o,12,32
//fr o,12,32,5
//fr o,12,32,5,51
//fr o,12,32,5,53
//fr o,12,32,5,78
//fr o,12,32,5,78,36
//fr p,63,270
