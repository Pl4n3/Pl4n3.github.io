var threeEnv={
  //camera,scene,renderer,
  //lightMesh,reflectionCube
  scale:1,dtscale:1,r:2.5,
  ot:new Date().getTime(),os:[],rotLightV:0.05,ps:[],ps2:[],path:'',camFar:10000,
  billboards:[],posVerts:{},vertIndices:{}
},isVr=false,onlyThree=false,threeTexH={},threeTL=window.THREE&&THREE.TextureLoader?new THREE.TextureLoader():undefined;
function threeParticles(geometry,x,y,z,wh,c) {
  				for ( i = 0; i < c; i ++ ) {
    					var vertex = new THREE.Vector3();
    					vertex.x = (x+wh*Math.random()-wh/2)*threeEnv.scale;
    					vertex.y = y*threeEnv.scale;//1000 * Math.random() - 500;
    					vertex.z = (z+wh*Math.random()-wh/2)*threeEnv.scale;
    					geometry.vertices.push( vertex );
  				}
}
function threeImgOnload() {
  this.text.needsUpdate=true;
  this.o5.drawNew=true;
}
function threeTexture(ts,o5,tlOnload) {
  //onsole.log('threeTexture '+ts);
  var text;
  if (Pd5.startsWith(ts,'canv:')) {
    var c=document.createElement('canvas');
    c.width=512;c.height=512;
    var ct=c.getContext('2d');
    ct.fillStyle='rgb(100,100,100)';
    ct.fillRect(0,0,512,512);
    ct.fillStyle='rgb(250,0,0)';
    ct.fillText(''+Math.random(),50,300); 
    text=new THREE.Texture(c);
    text.needsUpdate=true;
    o5.texCanv=c;
    o5.canvTex=text;
  } else if (ts.substr(0,5)=='data:') {
    var image=document.createElement('img');
    //image.src=ts;
    text=new THREE.Texture(image);
    image.text=text;
    image.o5=o5;
    image.onload=threeImgOnload;
    image.src=ts;
    //text.needsUpdate=true;
  } else { 
    text=threeTexH[ts];
    if (text) return text;
    //onsole.log('threeTexture load '+(threeEnv.path+ts)+' threeTL='+threeTL);
    //onsole.log(threeEnv);
    var fn=ts.startsWith('/')?ts:threeEnv.path+ts;
    //onsole.log('threeTexture '+fn);
    if (fn.endsWith('.json')) {
      var img=document.createElement('img');
      text=new THREE.Texture(img);
  Conet.download({fn:fn,f:function(v) {
    var o=JSON.parse(v);
    img.text=text;
    img.o5=o5;
    img.onload=threeImgOnload;
    img.src=o.data;
  }
      });
    } else {
      text=(threeTL&&!threeEnv.noThreeTL)?threeTL.load(fn,tlOnload||threeEnv.texLoaded):
        THREE.ImageUtils.loadTexture(fn,undefined,threeEnv.texLoaded);
      threeTexH[ts]=text;
    }
  }
  if (text) {
  text.wrapS=THREE.RepeatWrapping;
  text.wrapT=THREE.RepeatWrapping; 
  }
  //onsole.log('...threeTexture text='+text+' ts='+ts+' threeEnv.path='+threeEnv.path);
  //onsole.log(text);
  return text;
}
function threeCreateMesh(lo,first,px,py,pz,scale,mat) {
  for (var mi=lo.meshes.length-1;mi>=0;mi--) {
  var m=lo.meshes[mi];
  var ge=new THREE.Geometry();
  var ve=lo.verts,ve2=[];
  //for (var h=0;h<ve.length;h++) {
  //  var p=ve[h].p1;
  //  ge.vertices.push(new THREE.Vector3(p.x,-p.y,p.z));
  //}
  
  if (!first) for (var h=ve.length-1;h>=0;h--) delete ve[h].ive2; 
  first=false;
  
  var fa=m.fa;
  for (var h=0;h<fa.length;h++) {
    var t=fa[h];
    
    if (t.p) if (t.p.coll=='c') continue;
  
    var v0=t.v0;if (v0.nv!==undefined) v0=v0.nv;
    var v1=t.v1;if (v1.nv!==undefined) v1=v1.nv;
    var v2=t.v2;if (v2.nv!==undefined) v2=v2.nv;
  
    if (v0.ive2===undefined) { var p=v0.p1;ge.vertices.push(new THREE.Vector3(p.x,-p.y,p.z));v0.ive2=ve2.length;ve2.push(v0); }
    if (v1.ive2===undefined) { var p=v1.p1;ge.vertices.push(new THREE.Vector3(p.x,-p.y,p.z));v1.ive2=ve2.length;ve2.push(v1); }
    if (v2.ive2===undefined) { var p=v2.p1;ge.vertices.push(new THREE.Vector3(p.x,-p.y,p.z));v2.ive2=ve2.length;ve2.push(v2); }
  
    var face=new THREE.Face3(v0.ive2,v1.ive2,v2.ive2);
    //var nl=Math.sqrt(t.nx*t.nx+t.ny*t.ny+t.nz*t.nz);
    //face.normal.set(t.nx/nl,t.ny/nl,t.nz/nl); 
    face.normal.set(t.nx,t.ny,t.nz);face.o5t=t;
    ge.faces.push(face);
    ge.faceVertexUvs[0].push([new THREE.Vector2(t.v0.u,1-t.v0.v),new THREE.Vector2(t.v1.u,1-t.v1.v),new THREE.Vector2(t.v2.u,1-t.v2.v)]); // uvs
  }
  m.ve2=ve2;
  //console.log(ge.faces[0].vertexTangents[0]);
  ge.computeVertexNormals();
  //console.log(ge.faces[0].vertexTangents[0]);
  if (THREE.REVISION<73) ge.computeTangents();
  //if (ge.faces.length==4)  { console.log(ge.faces[0].vertexNormals[0]);console.log(fa[0].nx+' '+fa[0].ny+' '+fa[0].nz); }
  //console.log(ge.faceVertexUvs[0][0]);
  
  
  		  		var mesh1=new THREE.Mesh(ge,
      //(threeEnv.wireMat&&(Math.random()<0.5))?threeEnv.wireMat:
      mat?mat:
      m.material);
  	  			mesh1.position.x=px;
  	  			mesh1.position.y=py;
  	  			mesh1.position.z=pz;
  	  			mesh1.scale.set(scale,scale,scale);
  	  			mesh1.castShadow=lo.castShadow!==undefined?lo.castShadow:(lo.transparent?false:true);
  	  			mesh1.receiveShadow=!lo.hud;
  //var pe=new THREE.Object3D();pe.add(mesh1);			threeEnv.scene.add(pe);
  	//			threeEnv.scene.add(mesh1);
  			//  if (!notAdd) 
  //console.log('threeCreateMesh ');
  //console.log(ge);
  if (!lo.noSceneAdd) threeEnv.base.add(mesh1);
  m.tmesh=mesh1;
  }
}
function threeSetMeshMaterial(m,lo) {
  //onsole.log('threeSetMeshMaterial 0');
  if (!lo.phong) {
  //onsole.log('threeSetMeshMaterial 1');
  var ambient = 0xffffff, diffuse = 0xffffff, specular = 0xffffff, shininess = 35;
  
  var diff=threeTexture(m.diff?m.diff:"d.jpg",lo);
  var spec=threeTexture(m.spec?m.spec:"s.jpg",lo);
  var norm=threeTexture(m.norm?m.norm:"n.jpg",lo);
  
  /*
  var diff=threeTexture(m.diff?m.diff:"d.jpg",lo,function(t) {
    m.tdiff=t;threeEnv.texLoaded();
  }
  );
  var spec=threeTexture(m.spec?m.spec:"s.jpg",lo,function(t) {
    m.tspec=t;threeEnv.texLoaded();
  }
  );
  var norm=threeTexture(m.norm?m.norm:"n.jpg",lo,function(t) {
    m.tnorm=t;threeEnv.texLoaded();
  }
  );
  */
  
  
  var shader=THREE.ShaderLib["normalmap"];
  if (!shader) {
    //onsole.log('threeSetMeshMaterial: no shaderlib normalmap');
    //console.log(JSON.stringify(lo,undefined,' '));
    var ph={
      //color:0x777777
      color:ambient,//ambient,
      //color:0x000000,
      specular:specular,
      shininess:shininess,
      map:diff,specularMap:spec,normalMap:norm,
      reflectivity:0.2,
    };
  
    
    if (lo.ps) {
      if (lo.ps.color!==undefined) ph.color=lo.ps.color;
      if (lo.ps.shininess!==undefined) ph.shininess=lo.ps.shininess;
    }
    //onsole.log('threeSetMeshMaterial '+(lo.ps?'ps':'-'));
    m.material=new THREE.MeshPhongMaterial(ph);
    return;
  }
  				var uniforms=THREE.UniformsUtils.clone( shader.uniforms );
  
  				uniforms["enableAO"].value = false;
  				uniforms["enableDiffuse"].value = true;
  				uniforms["enableSpecular"].value = true;
  				uniforms["enableReflection"].value = true;
  				uniforms["enableDisplacement"].value = false;
  
  var t;
  
  t=diff;uniforms["tDiffuse"].value=t;m.tdiff=t;
  t=spec;uniforms["tSpecular"].value=t;m.tspec=t;
  t=norm;uniforms["tNormal"].value=t;m.tnorm=t;
  
  //onsole.log('threeSetMeshMaterial: setting m.tdiff');
  //onsole.log(m);
  
  				uniforms["uDisplacementBias"].value = - 0.428408;
  				uniforms["uDisplacementScale"].value = 2.436143;
  
  				uniforms["uDiffuseColor"].value.setHex( diffuse );
  				uniforms["uSpecularColor"].value.setHex( specular );
  				uniforms["uAmbientColor"].value.setHex( ambient );
  
  				uniforms["uShininess"].value = shininess;
  
  				//uniforms["tCube"].value = threeEnv.reflectionCube;
  				//uniforms["uReflectivity"].value = 0.3;//0.1
  
  				var parameters={fragmentShader:shader.fragmentShader,vertexShader:shader.vertexShader,uniforms:uniforms,lights:true,fog:true};
  var ps=parameters;
  if (lo.transparent) { 
    ps.transparent=true;
    //ps.depthWrite=false; 
    //ps.side=THREE.DoubleSide;
    //ps.opacity=0.25;
    //parameters.depthTest=false; 
    ps.alphaTest=0.95;//false; 
    //ps.blending=THREE.AdditiveBlending;
  }
  //m.depthTest=false;
  m.material=new THREE.ShaderMaterial(parameters);
  } else { 
  m.material=new THREE.MeshBasicMaterial({wireframe:true});//m.material.depthTest=false;
  //m.material=new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534 });
  //				    //	side: THREE.DoubleSide,
  //					    //shading: THREE.FlatShading
  //				  });
  }
}
function threeAddObj(lo,px,py,pz,scale) {
  px*=threeEnv.scale;py*=threeEnv.scale;pz*=threeEnv.scale;scale*=threeEnv.scale;
  
  var o5=lo;
  
  //var nm=false;
  //var norm=false;
  
  				// normal map shader
  for (var mi=lo.meshes.length-1;mi>=0;mi--) {
    var m=lo.meshes[mi];
    //				var shader=THREE.NormalDisplacementShader;
    threeSetMeshMaterial(m,lo);
  }
  
  
  threeCreateMesh(lo,true,px,py,pz,scale);
  if (!lo.noOsAdd) threeEnv.os.push(lo);
}
function threeReaddObj(o) {
  //...
  if (o.bb) {
    threeEnv.base.add(o.bb.threeMesh);
    threeEnv.billboards.push(o.bb);//splice(threeEnv.billboards.indexOf(o.bb),1);
  }
  for (var mi=o.meshes.length-1;mi>=0;mi--) 
    threeEnv.base.add(o.meshes[mi].tmesh);
  threeEnv.os.push(o);//splice(threeEnv.os.indexOf(o),1);
  //...
}
function threeRemoveObj(o) {
  if (o.bb) {
    threeEnv.base.remove(o.bb.threeMesh);
    threeEnv.billboards.splice(threeEnv.billboards.indexOf(o.bb),1);
  }
  for (var mi=o.meshes.length-1;mi>=0;mi--) 
    threeEnv.base.remove(o.meshes[mi].tmesh);
  threeEnv.os.splice(threeEnv.os.indexOf(o),1);
  //...
}
function threeInit(ps) {
  if (!ps.scf) ps.scf=1;
  //console.log('threeInit '+ps.scf);
  
  //				var cw=400,ch=400;//,cw2=cw*3,ch2=ch*3;
  var cw=ps.cw?ps.cw:400;
  var ch=ps.ch?ps.ch:400;
  //			var camera=new THREE.OrthographicCamera(cw*3/-2,cw*3/2,ch*3/2,ch*3/-2,-10000,10000);
  	//			camera.position.z=1500;
  //threeEnv.camera=camera;
  
  				scene=new THREE.Scene();threeEnv.scene=scene;threeEnv.base=scene;
  //scene.fog=new THREE.FogExp2(0x000000,0.001);
  
  				// LIGHTS
  
  var ambientLight = new THREE.AmbientLight(0x555555);//111
  scene.add( ambientLight );
  threeEnv.ambientLight=ambientLight;
  
  				
  var 				pointLight = new THREE.PointLight( 0xff9900 );
  				pointLight.position.z = 10000;
  				pointLight.distance = 4000;
  			//	scene.add( pointLight );
  
  
  				var spotLight = new THREE.SpotLight( 0xffffff );
  				spotLight.position.set( 1000, 500, 1000 );
  				spotLight.castShadow = true;
  				spotLight.shadowCameraNear = 500;//500
  				spotLight.shadowCameraFov = 70;
  				spotLight.shadowBias = 0.001;
  				spotLight.shadowMapWidth = 1024;
  				spotLight.shadowMapHeight = 1024;
  			scene.add( spotLight );threeEnv.spotLight=spotLight;
  
  				directionalLight2 = new THREE.DirectionalLight( 0xaaff33, 0 );
  				directionalLight2.position.set( -1, 1, 0.5 ).normalize();
  
  
  				directionalLight3 = new THREE.DirectionalLight( 0xaaff33 );
  				directionalLight3.position.set( -1, 1, 0.5 ).normalize();
  				// light representation
  
  				var sphere = new THREE.SphereGeometry( 100, 16, 8 );
  				var lightMesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
  				lightMesh.position = pointLight.position;
  				lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
  threeEnv.lightMesh=lightMesh;				
  //scene.add( lightMesh );
  
  //				var path = "textures/cube/SwedishRoyalCastle/";
  var p2=threeEnv.skyPath||'/shooter/objs/skybox/';
  				var format = '.jpg';
  				var urls = [
  //						path + 'px' + format, path + 'nx' + format,
  //						path + 'py' + format, path + 'ny' + format,
  //						path + 'pz' + format, path + 'nz' + format
  p2+'right.jpg',p2+'left.jpg',p2+'up.jpg',p2+'down.jpg',p2+'front.jpg',p2+'back.jpg',
  					];
  
  var reflectionCube=THREE.CubeTextureLoader?
    new THREE.CubeTextureLoader().load(urls):THREE.ImageUtils.loadTextureCube( urls );
  threeEnv.reflectionCube=reflectionCube;
  
  //----skybox
  
  var shader = THREE.ShaderLib[ "cube" ],mesh;
  				shader.uniforms["tCube"].value=reflectionCube;
  				var material = new THREE.ShaderMaterial( {
  					fragmentShader: shader.fragmentShader,
  					vertexShader: shader.vertexShader,
  					uniforms: shader.uniforms,
  					side: THREE.BackSide
  				}),
  				mesh=new THREE.Mesh(new THREE.CubeGeometry(11000,11000,11000),material);
  //if (threeSky) 				scene.add(mesh);
  threeEnv.skyMesh=mesh;
  
  //--------------
  /*				
  geometry = new THREE.Geometry();
  				sprite = THREE.ImageUtils.loadTexture(urlPf("images/grass3.png"));
  //sprite.offset=new THREE.Vector2(0.5,1); 
  				
  //var wh=800;
  //				for ( i = 0; i < 100; i ++ ) {
  //  					var vertex = new THREE.Vector3();
  //  					vertex.x = wh * Math.random() - wh/2;
  //  					vertex.y = 10;//1000 * Math.random() - 500;
  //  					vertex.z = wh * Math.random() - wh/2;
  //  					geometry.vertices.push( vertex );
  //				}
  
  var y0=10;
  threeParticles(geometry,0,y0,0,800,100);
  threeParticles(geometry,800,y0,0,800,20);
  threeParticles(geometry,1600,y0,0,800,5);
  threeParticles(geometry,0,y0,-800,800,100);
  threeParticles(geometry,0,y0,-1600,800,20);
  threeParticles(geometry,0,y0,-2400,800,5);
  
  
    ////					geometry.vertices.push(new THREE.Vector3(0,10,0));
    ////					geometry.vertices.push(new THREE.Vector3(100,10,0));
  
  //					geometry.vertices.push(new THREE.Vector3(-100,10,-100));
  //  					geometry.vertices.push(new THREE.Vector3(100,10,-100));
  //  					geometry.vertices.push(new THREE.Vector3(-100,10,100));
  //  					geometry.vertices.push(new THREE.Vector3(100,10,100));
    
  				material = new THREE.ParticleBasicMaterial({size:1500,sizeAttenuation:true,map:sprite,transparent:true});//1500
  				//material.color.setRGB(1,0,0);//HSV( 1.0, 0.2, 0.8 );
  				particles = new THREE.ParticleSystem( geometry, material );
  				particles.sortParticles = true;
  //particles.receiveShadows=true;
  				scene.add( particles );
  */
  //---
  
  
  				var renderer = new THREE.WebGLRenderer();
  //renderer.domElement.style.backgroundColor='#f00';
  //				if (!isVr) 
  renderer.setSize(cw,ch);
  if (isVr) {
    //threeEnv.controls=new THREE.OculusRiftControls(camera);
    //scene.add(threeEnv.controls.getObject());
    scene.add(threeEnv.camera);
    //var dpr=window.devicePixelRatio||1;
    var HMD={
      //		hResolution: dpr*window.innerWidth/ps.scf,//640 1280 2560
  	    //	vResolution: dpr*window.innerHeight/ps.scf,//360 800  1440
  	  	  	hResolution:2560/ps.scf,
      vResolution:1440/ps.scf,
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
    threeEnv.effect=new THREE.OculusRiftEffect(renderer,{worldFactor:100,HMD:HMD});
    
    //threeEnv.effect=new THREE.VREffect(renderer);
  }
  if (!onlyThree) {
  if (!ps.noStyle) {
    var st=				renderer.domElement.style;
    st.backgroundColor='#222';
    st.position='absolute';
    st.left='10px';
    st.top='20px';
  }
  if (!ps.noDomAdd) 				document.body.appendChild( renderer.domElement );
  }
  
  //				renderer.setSize(cw,ch);
  //var st=				renderer.domElement.style;
  //st.backgroundColor='#222';
  //st.position='absolute';
  //st.left='10px';
  
  //st.top='20px';//400
  threeEnv.renderer=renderer;
  if (!ps.noDomAdd) 				document.body.appendChild( renderer.domElement );
  
  				renderer.gammaInput = true;
  				renderer.gammaOutput = true;
  				renderer.physicallyBasedShading = true;
  
  				renderer.shadowMapEnabled = true;
  				renderer.shadowMapType = THREE.PCFShadowMap;
  threeEnv.c=renderer.domElement;
  return renderer.domElement;
}
function threeBillboardAdd(p) {
  if (!p.ar) p.ar=0.5;
  
  if (!p.c) {
    var cw=p.cw||128;//Math.floor(1024*(p.s||1)+0.5);
    var c=document.createElement('canvas');c.width=cw;c.height=cw;
    var ct=c.getContext('2d');ct.fillStyle='rgba(0,0,0,0.5)';ct.fillRect(0,0,c.width,c.height);p.c=c;p.ct=ct;
    ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';ct.fillText('n/i',2,2);
  }
  
  //p.drawBb();
  p.update=true;
  
    var t1=new THREE.Texture(p.c);
    t1.needsUpdate=true;
    //if (!mipmap) t1.minFilter=THREE.LinearFilter;
    //Nearest
    var planeMaterial=new THREE.MeshBasicMaterial({map:t1,opacity:1,transparent:((p.transparent!==undefined)?p.transparent:true)});
    var g=new THREE.PlaneGeometry(p.gw||80,(p.gw||80)*p.ar);
    
    g.faceVertexUvs=[[[{x:0,y:1},{x:0,y:1-p.ar},{x:1,y:1}],[{x:0,y:1-p.ar},{x:1,y:1-p.ar},{x:1,y:1}]]];//[0][0][0].y*=p.ar;
    //onsole.log(g);
    var o=new THREE.Mesh(g,planeMaterial);
    o.position.set(p.x,p.y,p.z);
    var sc=p.s||1;
    o.scale.set(sc,sc,sc);
    threeEnv.base.add(o);//scene
    p.threeTex=t1;
    p.threeMesh=o;
  
  threeEnv.billboards.push(p);
  return p;
}
function threeBane(noSceneAdd) {
  var lo=Pd5.loadh({
  bones:[
  {up:-1,t:{x:0,y:0,z:0},q:{x:0,y:0,z:0},ws:[{x:2.5,y:0.0,z:2.5},{x:2.5,y:0.0,z:-2.5},{x:-2.5,y:0.0,z:-2.5},{x:-2.5,y:0.0,z:2.5}],},
  {up:0,t:{x:-0.39999998,y:1.1,z:0.19999999},q:{x:-0.0,y:-0.0,z:-0.0},ws:[{x:-0.049999997,y:0.84999996,z:0.0},{x:0.0,y:-0.55,z:0.0},{x:-0.7,y:0.55,z:0.0,w:0.3},{x:0.79999995,y:-0.55,z:0.0,w:0.29999998},{x:0.39999998,y:-0.5,z:0.5,w:0.5},{x:-0.7,y:-0.5,z:0.0,w:0.3},{x:-0.35,y:0.65,z:0.0,w:0.7},{x:0.19999999,y:1.15,z:0.0,w:0.7},{x:-0.35,y:-0.5,z:0.0,w:0.7},{x:0.39999998,y:-0.55,z:0.0,w:0.7},{x:0.59999996,y:1.4499999,z:0.0,w:0.3},{x:0.0,y:0.0,z:0.75},{x:0.0,y:0.0,z:-0.75},{x:0.0,y:0.59999996,z:-0.55},{x:0.0,y:0.59999996,z:0.55},{x:0.0,y:-0.45,z:0.55},{x:0.0,y:-0.45,z:-0.55},{x:-0.35,y:0.0,z:0.65,w:0.7},{x:-0.35,y:0.0,z:-0.65,w:0.7},{x:-0.35,y:0.5,z:-0.45,w:0.7},{x:-0.35,y:0.5,z:0.45,w:0.7},{x:-0.7,y:0.0,z:0.5,w:0.3},{x:-0.7,y:0.0,z:-0.5,w:0.3},{x:-0.7,y:0.39999998,z:-0.39999998,w:0.3},{x:-0.7,y:0.39999998,z:0.39999998,w:0.3},{x:-0.7,y:-0.39999998,z:0.39999998,w:0.3},{x:-0.7,y:-0.39999998,z:-0.39999998,w:0.3},{x:0.35,y:0.099999994,z:0.95,w:0.7},{x:0.35,y:0.099999994,z:-0.95,w:0.7},{x:0.19999999,y:-0.39999998,z:0.59999996,w:0.4117647},{x:0.29999998,y:0.84999996,z:0.59999996,w:0.7},{x:0.29999998,y:0.84999996,z:-0.59999996,w:0.7},{x:0.79999995,y:0.099999994,z:1.1,w:0.3},{x:0.79999995,y:0.099999994,z:-1.1,w:0.3},{x:0.79999995,y:-0.39999998,z:-0.75,w:0.3},{x:0.79999995,y:-0.39999998,z:0.75,w:0.3},{x:0.7,y:1.05,z:0.75,w:0.3},{x:0.7,y:1.05,z:-0.75,w:0.3},{x:0.59999996,y:-0.39999998,z:0.59999996,w:0.5},{x:0.39999998,y:-0.29999998,z:0.7,w:0.5},{x:-0.35,y:-0.5,z:0.35,w:0.5},{x:-0.55,y:-0.39999998,z:0.45,w:0.5},{x:-0.14999999,y:-0.39999998,z:0.45,w:0.5},{x:-0.35,y:-0.29999998,z:0.55,w:0.5},{x:-0.35,y:-0.5,z:-0.35,w:0.5},{x:-0.55,y:-0.39999998,z:-0.45,w:0.5},{x:-0.14999999,y:-0.39999998,z:-0.45,w:0.5},{x:-0.35,y:-0.29999998,z:-0.55,w:0.5},{x:0.39999998,y:-0.5,z:-0.5,w:0.5},{x:0.19999999,y:-0.39999998,z:-0.59999996,w:0.5},{x:0.59999996,y:-0.39999998,z:-0.59999996,w:0.5},{x:0.39999998,y:-0.29999998,z:-0.7,w:0.5}],},
  {up:1,t:{x:0.39999998,y:-0.45,z:-0.59999996},q:{x:0.46383494,y:-0.17124544,z:0.07493895},ws:[{x:0.0,y:-0.17999999,z:-0.6},{x:0.0,y:-0.049999997,z:0.099999994,w:0.5},{x:-0.19999999,y:0.049999997,z:-0.0,w:0.5},{x:0.0,y:0.17999999,z:-0.29},{x:0.0,y:-0.17999999,z:-0.19},{x:0.0,y:0.17999999,z:-0.96},{x:0.0,y:-0.12,z:-0.96},{x:-0.17999999,y:0.0,z:-0.24},{x:-0.17999999,y:0.0,z:-0.96},{x:0.17999999,y:0.0,z:-0.24},{x:0.17999999,y:0.0,z:-0.96},{x:0.0,y:-0.12,z:-1.08,w:0.5},{x:0.0,y:0.0,z:-1.4399999,w:0.5},{x:0.0,y:0.24,z:-1.2,w:0.5},{x:0.24,y:0.0,z:-1.2,w:0.5},{x:-0.24,y:0.0,z:-1.2,w:0.5},{x:0.0,y:0.24,z:-0.6},{x:-0.24,y:0.0,z:-0.6},{x:0.24,y:0.0,z:-0.6},{x:0.19999999,y:0.049999997,z:-0.0,w:0.5},{x:0.0,y:0.14999999,z:-0.099999994,w:0.5}],},
  {up:2,t:{x:0.0,y:0.0,z:-1.2},q:{x:0.31781882,y:-0.0,z:-0.0},ws:[{x:0.0,y:-0.12,z:0.12,w:0.5},{x:0.0,y:0.0,z:-0.24,w:0.5},{x:0.0,y:0.24,z:-0.0,w:0.5},{x:0.24,y:0.0,z:-0.0,w:0.5},{x:-0.24,y:0.0,z:-0.0,w:0.5},{x:0.0,y:0.0,z:0.0},{x:0.0,y:-1.4399999,z:0.12},{x:0.0,y:-0.24,z:-0.17999999},{x:0.0,y:-0.24,z:0.12},{x:0.0,y:-0.65999997,z:0.24},{x:0.0,y:-0.6,z:-0.24},{x:0.17999999,y:-0.24,z:-0.0},{x:0.24,y:-0.6,z:-0.0},{x:-0.17999999,y:-0.24,z:-0.0},{x:-0.24,y:-0.6,z:-0.0},{x:0.0,y:-1.3199999,z:0.06},{x:0.0,y:-0.9,z:-0.17999999},{x:-0.24,y:-0.96,z:-0.0},{x:0.24,y:-0.96,z:-0.0},{x:0.0,y:-0.96,z:0.24},{x:0.06,y:-1.38,z:0.12},{x:-0.06,y:-1.38,z:0.12},{x:-0.3,y:-0.96,z:0.06},{x:0.3,y:-0.96,z:0.06},{x:0.3,y:-0.6,z:0.06},{x:-0.3,y:-0.6,z:0.06},{x:0.0,y:0.0,z:-0.0}],},
  {up:1,t:{x:-0.35,y:-0.45,z:-0.45},q:{x:0.27106228,y:0.15689866,z:-0.0},ws:[{x:0.0,y:-0.17999999,z:-0.6},{x:0.0,y:-0.17999999,z:-0.19},{x:0.0,y:-0.049999997,z:0.099999994,w:0.5},{x:-0.19999999,y:0.049999997,z:-0.0,w:0.5},{x:0.0,y:0.17999999,z:-0.29},{x:0.0,y:0.17999999,z:-0.96},{x:0.0,y:-0.12,z:-0.96},{x:-0.17999999,y:0.0,z:-0.24},{x:-0.17999999,y:0.0,z:-0.96},{x:0.17999999,y:0.0,z:-0.24},{x:0.17999999,y:0.0,z:-0.96},{x:0.0,y:-0.12,z:-1.08,w:0.5},{x:0.0,y:0.0,z:-1.4399999,w:0.5},{x:0.0,y:0.24,z:-1.2,w:0.5},{x:0.24,y:0.0,z:-1.2,w:0.5},{x:-0.24,y:0.0,z:-1.2,w:0.5},{x:0.0,y:0.24,z:-0.6},{x:-0.24,y:0.0,z:-0.6},{x:0.24,y:0.0,z:-0.6},{x:0.19999999,y:0.049999997,z:-0.0,w:0.5},{x:0.0,y:0.14999999,z:-0.099999994,w:0.5}],},
  {up:4,t:{x:0.0,y:0.0,z:-1.2},q:{x:-0.18208182,y:-0.0,z:-0.0},ws:[{x:0.0,y:-0.12,z:0.12,w:0.5},{x:0.0,y:0.0,z:-0.24,w:0.5},{x:0.0,y:0.24,z:-0.0,w:0.5},{x:0.24,y:0.0,z:-0.0,w:0.5},{x:-0.24,y:0.0,z:-0.0,w:0.5},{x:0.0,y:-1.4399999,z:0.12},{x:0.0,y:-0.6,z:-0.24},{x:0.0,y:-0.24,z:-0.17999999},{x:0.0,y:-0.24,z:0.12},{x:0.0,y:-0.65999997,z:0.24},{x:0.17999999,y:-0.24,z:-0.0},{x:0.24,y:-0.6,z:-0.0},{x:-0.17999999,y:-0.24,z:-0.0},{x:-0.24,y:-0.6,z:-0.0},{x:0.0,y:-1.3199999,z:0.06},{x:0.0,y:-0.9,z:-0.17999999},{x:-0.24,y:-0.96,z:-0.0},{x:0.24,y:-0.96,z:-0.0},{x:0.0,y:-0.96,z:0.24},{x:0.06,y:-1.38,z:0.12},{x:-0.06,y:-1.38,z:0.12},{x:-0.3,y:-0.96,z:0.06},{x:0.3,y:-0.96,z:0.06},{x:0.3,y:-0.6,z:0.06},{x:-0.3,y:-0.6,z:0.06}],},
  {up:1,t:{x:-0.35,y:-0.45,z:0.45},q:{x:-0.5026905,y:-0.17475581,z:-0.0},ws:[{x:0.0,y:-0.17999999,z:0.19},{x:0.0,y:-0.049999997,z:-0.099999994,w:0.5},{x:-0.19999999,y:0.049999997,z:0.0,w:0.5},{x:0.0,y:0.17999999,z:0.29},{x:0.0,y:0.17999999,z:0.96},{x:0.0,y:-0.12,z:0.96},{x:-0.17999999,y:0.0,z:0.24},{x:-0.17999999,y:0.0,z:0.96},{x:0.17999999,y:0.0,z:0.24},{x:0.17999999,y:0.0,z:0.96},{x:0.0,y:-0.12,z:1.08,w:0.5},{x:0.0,y:0.0,z:1.4399999,w:0.5},{x:0.0,y:0.24,z:1.2,w:0.5},{x:0.24,y:0.0,z:1.2,w:0.5},{x:-0.24,y:0.0,z:1.2,w:0.5},{x:0.0,y:0.24,z:0.6},{x:0.0,y:-0.17999999,z:0.6},{x:-0.24,y:0.0,z:0.6},{x:0.24,y:0.0,z:0.6},{x:0.19999999,y:0.049999997,z:0.0,w:0.5},{x:0.0,y:0.14999999,z:0.099999994,w:0.5}],},
  {up:6,t:{x:0.0,y:0.0,z:1.2},q:{x:-0.3747729,y:-0.0,z:-0.0},ws:[{x:0.0,y:-0.12,z:-0.12,w:0.5},{x:0.0,y:0.0,z:0.24,w:0.5},{x:0.0,y:0.24,z:0.0,w:0.5},{x:0.24,y:0.0,z:0.0,w:0.5},{x:-0.24,y:0.0,z:0.0,w:0.5},{x:0.0,y:-0.6,z:0.24},{x:0.0,y:-0.24,z:0.17999999},{x:0.0,y:-0.24,z:-0.12},{x:0.0,y:-0.65999997,z:-0.24},{x:0.17999999,y:-0.24,z:0.0},{x:0.24,y:-0.6,z:0.0},{x:-0.17999999,y:-0.24,z:0.0},{x:-0.24,y:-0.6,z:0.0},{x:0.0,y:-1.3199999,z:-0.06},{x:0.0,y:-0.9,z:0.17999999},{x:-0.24,y:-0.96,z:0.0},{x:0.24,y:-0.96,z:0.0},{x:0.0,y:-0.96,z:-0.24},{x:0.06,y:-1.38,z:-0.12},{x:-0.06,y:-1.38,z:-0.12},{x:-0.3,y:-0.96,z:-0.06},{x:0.3,y:-0.96,z:-0.06},{x:0.3,y:-0.6,z:-0.06},{x:-0.3,y:-0.6,z:-0.06},{x:0.0,y:-1.4399999,z:-0.12}],},
  {up:1,t:{x:0.39999998,y:-0.45,z:0.59999996},q:{x:-0.30998167,y:0.17124543,z:0.09630647},ws:[{x:0.0,y:-0.049999997,z:-0.099999994,w:0.5},{x:-0.19999999,y:0.049999997,z:0.0,w:0.5882353},{x:0.0,y:0.17999999,z:0.29},{x:0.0,y:-0.17999999,z:0.19},{x:0.0,y:0.17999999,z:0.96},{x:0.0,y:-0.12,z:0.96},{x:-0.17999999,y:0.0,z:0.24},{x:-0.17999999,y:0.0,z:0.96},{x:0.17999999,y:0.0,z:0.24},{x:0.17999999,y:0.0,z:0.96},{x:0.0,y:-0.12,z:1.08,w:0.5},{x:0.0,y:0.0,z:1.4399999,w:0.5},{x:0.0,y:0.24,z:1.2,w:0.5},{x:0.24,y:0.0,z:1.2,w:0.5},{x:-0.24,y:0.0,z:1.2,w:0.5},{x:0.0,y:0.24,z:0.6},{x:0.0,y:-0.17999999,z:0.6},{x:-0.24,y:0.0,z:0.6},{x:0.24,y:0.0,z:0.6},{x:0.19999999,y:0.049999997,z:0.0,w:0.5},{x:0.0,y:0.14999999,z:0.099999994,w:0.5}],},
  {up:8,t:{x:0.0,y:0.0,z:1.2},q:{x:0.26022592,y:-0.0,z:-0.0},ws:[{x:0.0,y:-0.24,z:0.17999999},{x:0.0,y:-0.24,z:-0.12},{x:0.0,y:-0.65999997,z:-0.24},{x:0.0,y:-0.6,z:0.24},{x:0.17999999,y:-0.24,z:0.0},{x:0.24,y:-0.6,z:0.0},{x:-0.17999999,y:-0.24,z:0.0},{x:-0.24,y:-0.6,z:0.0},{x:0.0,y:-1.3199999,z:-0.06},{x:0.0,y:-0.9,z:0.17999999},{x:-0.24,y:-0.96,z:0.0},{x:0.24,y:-0.96,z:0.0},{x:0.0,y:-0.96,z:-0.24},{x:0.06,y:-1.38,z:-0.12},{x:-0.06,y:-1.38,z:-0.12},{x:-0.3,y:-0.96,z:-0.06},{x:0.3,y:-0.96,z:-0.06},{x:0.3,y:-0.6,z:-0.06},{x:-0.3,y:-0.6,z:-0.06},{x:0.0,y:-1.4399999,z:-0.12},{x:0.0,y:-0.12,z:-0.12,w:0.5},{x:0.0,y:0.0,z:0.24,w:0.5},{x:0.0,y:0.24,z:0.0,w:0.5},{x:0.24,y:0.0,z:0.0,w:0.5},{x:-0.24,y:0.0,z:0.0,w:0.5}],},
  {up:1,t:{x:0.59999996,y:0.0,z:-0.25},q:{x:-0.0,y:0.11065322,z:-0.0},ws:[{x:0.19999999,y:-0.55,z:0.0,w:0.7},{x:-0.39999998,y:1.15,z:0.0,w:0.3},{x:-0.19999999,y:-0.55,z:0.0,w:0.3},{x:0.0,y:1.4499999,z:0.0,w:0.7},{x:0.45,y:1.5999999,z:0.0},{x:1.0,y:1.5,z:0.0},{x:1.4,y:1.15,z:0.0},{x:1.5999999,y:0.55,z:0.0},{x:1.5999999,y:-0.14999999,z:0.0},{x:1.1999999,y:-0.55,z:0.0},{x:0.59999996,y:-0.55,z:0.0},{x:0.59999996,y:-0.55,z:0.0},{x:-0.25,y:0.099999994,z:0.95,w:0.3},{x:-0.25,y:0.099999994,z:-0.95,w:0.3},{x:-0.29999998,y:0.84999996,z:0.59999996,w:0.3},{x:-0.29999998,y:0.84999996,z:-0.59999996,w:0.3},{x:0.19999999,y:0.099999994,z:1.1,w:0.7},{x:0.19999999,y:0.099999994,z:-1.1,w:0.7},{x:0.19999999,y:-0.39999998,z:-0.75,w:0.7},{x:0.19999999,y:-0.39999998,z:0.75,w:0.7},{x:0.099999994,y:1.05,z:0.75,w:0.7},{x:0.099999994,y:1.05,z:-0.75,w:0.7},{x:0.59999996,y:0.099999994,z:1.1999999},{x:0.59999996,y:0.099999994,z:-1.1999999},{x:0.59999996,y:-0.35,z:0.9},{x:0.59999996,y:-0.35,z:-0.9},{x:0.5,y:1.15,z:-0.9},{x:0.5,y:1.15,z:0.9},{x:1.15,y:0.14999999,z:0.95},{x:1.15,y:0.14999999,z:-0.95},{x:1.15,y:-0.29999998,z:-0.7},{x:1.15,y:-0.29999998,z:0.7},{x:1.15,y:0.95,z:0.7},{x:1.15,y:0.95,z:-0.7}],},
  {up:1,t:{x:-0.5,y:0.0,z:-0.35},q:{x:-0.0,y:0.08195971,z:-0.0},ws:[{x:-0.19999999,y:0.55,z:0.0,w:0.7},{x:-0.59999996,y:0.5,z:0.0},{x:-0.95,y:0.39999998,z:0.0},{x:-1.1,y:-0.099999994,z:0.0},{x:-0.95,y:-0.5,z:0.0},{x:-0.19999999,y:-0.5,z:0.0,w:0.7},{x:-0.59999996,y:-0.59999996,z:0.0},{x:0.14999999,y:0.65,z:0.0,w:0.3},{x:0.14999999,y:-0.5,z:0.0,w:0.3},{x:0.14999999,y:0.0,z:0.65,w:0.3},{x:0.14999999,y:0.0,z:-0.65,w:0.3},{x:0.14999999,y:0.5,z:-0.45,w:0.3},{x:0.14999999,y:0.5,z:0.45,w:0.3},{x:-0.19999999,y:0.0,z:0.5,w:0.7},{x:-0.19999999,y:0.0,z:-0.5,w:0.7},{x:-0.19999999,y:0.39999998,z:-0.39999998,w:0.7},{x:-0.19999999,y:0.39999998,z:0.39999998,w:0.7},{x:-0.19999999,y:-0.39999998,z:0.39999998,w:0.7},{x:-0.19999999,y:-0.39999998,z:-0.39999998,w:0.7},{x:-0.59999996,y:-0.099999994,z:0.59999996},{x:-0.59999996,y:-0.099999994,z:-0.59999996},{x:-0.59999996,y:0.29999998,z:-0.45},{x:-0.59999996,y:0.29999998,z:0.45},{x:-0.59999996,y:-0.45,z:0.45},{x:-0.59999996,y:-0.45,z:-0.45},{x:-0.95,y:-0.099999994,z:0.5},{x:-0.95,y:-0.099999994,z:-0.5},{x:-0.95,y:0.25,z:0.35},{x:-0.95,y:0.25,z:-0.35},{x:-0.95,y:-0.35,z:-0.35},{x:-0.95,y:-0.35,z:0.35},{x:0.14999999,y:0.5,z:0.45,w:0.3},{x:0.14999999,y:0.5,z:-0.45,w:0.3},{x:0.14999999,y:0.0,z:-0.65,w:0.3},{x:0.14999999,y:0.0,z:0.65,w:0.3},{x:0.14999999,y:-0.5,z:0.0,w:0.3},{x:0.14999999,y:0.65,z:0.0,w:0.3}],},
  ],
  verts:[[0.91796875,0.10546875,[11,30,]],[0.91796875,0.10546875,[11,29,]],[0.9277344,0.24609375,[11,28,]],[0.9277344,0.24609375,[11,27,]],[0.9258073,0.16992188,[11,26,]],[0.9258073,0.16992188,[11,25,]],[0.8496094,0.083984375,[11,24,]],[0.8496094,0.083984375,[11,23,]],[0.84765625,0.27929688,[11,22,]],[0.84765625,0.27929688,[11,21,]],[0.8564162,0.17045456,[11,20,]],[0.8564162,0.17045456,[11,19,]],[0.8563939,0.01953125,[11,6,]],[0.9459808,0.049715877,[11,4,]],[0.98437506,0.17045456,[11,3,]],[0.9459808,0.32137787,[11,2,]],[0.8563939,0.3515625,[11,1,]],[0.7558594,0.0234375,[11,5,1,5,]],[0.7578125,0.107421875,[11,17,1,25,]],[0.7578125,0.107421875,[11,18,1,26,]],[0.75402766,0.20063925,[11,14,1,22,]],[0.7539905,0.20063925,[11,13,1,21,]],[0.75,0.3046875,[11,16,1,24,]],[0.75,0.3046875,[11,15,1,23,]],[0.754009,0.3666548,[11,0,1,2,]],[0.6644223,0.3968395,[1,6,11,7,]],[0.6621094,0.3359375,[1,19,11,11,]],[0.6644465,0.20063913,[1,18,11,10,]],[0.6621094,0.3359375,[1,20,11,12,]],[0.6643981,0.20063913,[1,17,11,9,]],[0.6640625,0.029296875,[1,8,11,8,]],[0.5761719,0.099609375,[1,16,]],[0.5761719,0.099609375,[1,15,]],[0.56640625,0.3515625,[1,14,]],[0.56640625,0.3515625,[1,13,]],[0.57486343,0.20063913,[1,12,]],[0.57480764,0.20063913,[1,11,]],[0.57483554,0.034623563,[1,1,]],[0.5876336,0.4572088,[1,0,]],[0.1328125,0.47070312,[10,33,]],[0.1328125,0.47070312,[10,32,]],[0.1328125,0.12109375,[10,31,]],[0.1328125,0.12109375,[10,30,]],[0.107421875,0.26367188,[10,29,]],[0.107421875,0.26367188,[10,28,]],[0.2734375,0.5292969,[10,27,]],[0.2734375,0.5292969,[10,26,]],[0.27148438,0.12890625,[10,25,]],[0.27148438,0.12890625,[10,24,]],[0.2723686,0.25230825,[10,23,]],[0.2723686,0.25230825,[10,22,]],[0.2676809,0.034623563,[10,11,]],[0.2676809,0.034623563,[10,10,]],[0.114103615,0.034623563,[10,9,]],[0.01171875,0.15536213,[10,8,]],[0.01171875,0.3666548,[10,7,]],[0.06291116,0.5477628,[10,6,]],[0.16529603,0.6534091,[10,5,]],[0.30607522,0.68359375,[10,4,]],[0.5236431,0.5477628,[1,7,10,1,]],[0.4212582,0.63831675,[10,3,1,10,]],[0.3828125,0.5019531,[10,21,1,37,]],[0.3828125,0.5019531,[10,20,1,36,]],[0.47851562,0.421875,[1,31,10,15,]],[0.47851562,0.421875,[1,30,10,14,]],[0.375,0.2421875,[10,17,1,33,]],[0.4852841,0.23082387,[1,28,10,13,]],[0.48521343,0.23082387,[1,27,10,12,]],[0.375,0.2421875,[10,16,1,32,]],[0.36523438,0.123046875,[10,18,1,34,]],[0.47245067,0.034623563,[1,9,10,2,]],[0.36523438,0.123046875,[10,19,1,35,]],[0.7898241,0.8936982,[8,9,]],[0.5250831,0.95836943,[8,2,]],[0.49121094,0.8359375,[8,3,]],[0.7903948,0.9584115,[8,4,]],[0.7903948,0.8482008,[8,5,]],[0.5047131,0.893653,[8,6,]],[0.7898241,0.8936982,[8,7,]],[0.5047131,0.893653,[8,8,]],[0.8574219,0.41992188,[9,14,]],[0.9567095,0.80414295,[9,0,]],[0.8379132,0.80412406,[9,1,]],[0.7903948,0.6498215,[9,2,]],[0.98046875,0.67189384,[9,3,]],[0.8848611,0.80554473,[9,4,]],[0.884671,0.6737629,[9,5,]],[0.8848611,0.80554473,[9,6,]],[0.884671,0.6737629,[9,7,]],[0.8886719,0.421875,[9,8,]],[0.9567095,0.56167936,[9,9,]],[0.884671,0.5415101,[9,10,]],[0.884671,0.5415101,[9,11,]],[0.7903948,0.53961086,[9,12,]],[0.8574219,0.41992188,[9,13,]],[0.86072147,0.54197735,[9,15,]],[0.86072147,0.54197735,[9,16,]],[0.86072147,0.6742302,[9,17,]],[0.86072147,0.6742302,[9,18,]],[0.8535156,0.39453125,[9,19,]],[0.6470784,0.8941466,[8,18,]],[0.6470784,0.8941466,[8,17,]],[0.64783925,0.82613605,[8,16,]],[0.64783925,0.980431,[8,15,]],[0.98046875,0.89231527,[9,21,8,11,]],[0.8854317,0.98046875,[9,22,8,12,]],[0.884671,0.89418435,[9,24,8,14,]],[0.884671,0.89418435,[9,23,8,13,]],[0.8379132,0.84820837,[9,20,8,10,]],[0.46656522,0.13938206,[1,39,8,20,]],[0.42382812,0.109375,[1,38,8,19,]],[0.5078125,0.103515625,[1,29,8,1,]],[0.46657267,0.07901275,[8,0,1,4,]],[0.37006578,0.034623563,[10,0,1,3,]],[0.45507812,0.9824219,[1,39,8,20,]],[0.44726562,0.90234375,[1,38,8,19,]],[0.44726562,0.90234375,[1,29,8,1,]],[0.44140625,0.82421875,[8,0,1,4,]],[0.6470784,0.8941466,[6,18,]],[0.6470784,0.8941466,[6,17,]],[0.64783925,0.82613605,[6,16,]],[0.64783925,0.980431,[6,15,]],[0.5047131,0.893653,[6,8,]],[0.5250831,0.95836943,[6,3,]],[0.5047131,0.893653,[6,6,]],[0.49121094,0.8359375,[6,0,]],[0.7898241,0.8936982,[6,9,]],[0.7898241,0.8936982,[6,7,]],[0.7903948,0.8482008,[6,5,]],[0.7903948,0.9584115,[6,4,]],[0.8379132,0.84820837,[6,10,7,0,]],[0.8854317,0.98046875,[6,12,7,2,]],[0.98046875,0.89231527,[6,11,7,1,]],[0.884671,0.89418435,[6,14,7,4,]],[0.884671,0.89418435,[6,13,7,3,]],[0.8535156,0.39453125,[7,24,]],[0.86072147,0.6742302,[7,23,]],[0.86072147,0.6742302,[7,22,]],[0.86072147,0.54197735,[7,21,]],[0.86072147,0.54197735,[7,20,]],[0.8574219,0.41992188,[7,19,]],[0.8574219,0.41992188,[7,18,]],[0.7903948,0.53961086,[7,17,]],[0.884671,0.5415101,[7,16,]],[0.884671,0.5415101,[7,15,]],[0.9567095,0.56167936,[7,14,]],[0.8886719,0.421875,[7,13,]],[0.884671,0.6737629,[7,12,]],[0.8848611,0.80554473,[7,11,]],[0.884671,0.6737629,[7,10,]],[0.8848611,0.80554473,[7,9,]],[0.7903948,0.6498215,[7,8,]],[0.8379132,0.80412406,[7,7,]],[0.9567095,0.80414295,[7,6,]],[0.98046875,0.67189384,[7,5,]],[0.98046875,0.89231527,[4,12,5,1,]],[0.8854317,0.98046875,[4,13,5,2,]],[0.884671,0.89418435,[4,14,5,3,]],[0.884671,0.89418435,[4,15,5,4,]],[0.8379132,0.84820837,[4,11,5,0,]],[0.86072147,0.6742302,[5,24,]],[0.86072147,0.6742302,[5,23,]],[0.86072147,0.54197735,[5,22,]],[0.86072147,0.54197735,[5,21,]],[0.8574219,0.41992188,[5,20,]],[0.8574219,0.41992188,[5,19,]],[0.7903948,0.53961086,[5,18,]],[0.884671,0.5415101,[5,17,]],[0.884671,0.5415101,[5,16,]],[0.9567095,0.56167936,[5,15,]],[0.8886719,0.421875,[5,14,]],[0.884671,0.6737629,[5,13,]],[0.8848611,0.80554473,[5,12,]],[0.884671,0.6737629,[5,11,]],[0.8848611,0.80554473,[5,10,]],[0.7903948,0.6498215,[5,9,]],[0.8379132,0.80412406,[5,8,]],[0.9567095,0.80414295,[5,7,]],[0.98046875,0.67189384,[5,6,]],[0.8535156,0.39453125,[5,5,]],[0.7898241,0.8936982,[4,10,]],[0.7898241,0.8936982,[4,8,]],[0.7903948,0.8482008,[4,6,]],[0.7903948,0.9584115,[4,5,]],[0.6470784,0.8941466,[4,18,]],[0.6470784,0.8941466,[4,17,]],[0.64783925,0.980431,[4,16,]],[0.64783925,0.82613605,[4,0,]],[0.5047131,0.893653,[4,9,]],[0.5047131,0.893653,[4,7,]],[0.49121094,0.8359375,[4,1,]],[0.5250831,0.95836943,[4,4,]],[0.98046875,0.89231527,[2,12,3,1,]],[0.8854317,0.98046875,[2,13,3,2,]],[0.8379132,0.84820837,[2,11,3,0,]],[0.884671,0.89418435,[2,14,3,3,]],[0.884671,0.89418435,[2,15,3,4,]],[0.86072147,0.6742302,[3,25,]],[0.86072147,0.6742302,[3,24,]],[0.86072147,0.54197735,[3,23,]],[0.86072147,0.54197735,[3,22,]],[0.8574219,0.41992188,[3,21,]],[0.8574219,0.41992188,[3,20,]],[0.7903948,0.53961086,[3,19,]],[0.884671,0.5415101,[3,18,]],[0.884671,0.5415101,[3,17,]],[0.9567095,0.56167936,[3,16,]],[0.8886719,0.421875,[3,15,]],[0.884671,0.6737629,[3,14,]],[0.8848611,0.80554473,[3,13,]],[0.884671,0.6737629,[3,12,]],[0.8848611,0.80554473,[3,11,]],[0.98046875,0.67189384,[3,10,]],[0.7903948,0.6498215,[3,9,]],[0.8379132,0.80412406,[3,8,]],[0.9567095,0.80414295,[3,7,]],[0.8535156,0.39453125,[3,6,]],[0.5047131,0.893653,[2,9,]],[0.5047131,0.893653,[2,7,]],[0.49121094,0.8359375,[2,4,]],[0.5250831,0.95836943,[2,3,]],[0.6470784,0.8941466,[2,18,]],[0.6470784,0.8941466,[2,17,]],[0.64783925,0.980431,[2,16,]],[0.64783925,0.82613605,[2,0,]],[0.7898241,0.8936982,[2,8,]],[0.7903948,0.9584115,[2,5,]],[0.7898241,0.8936982,[2,10,]],[0.7903948,0.8482008,[2,6,]],[0.703125,0.12786025,[6,2,1,41,]],[0.6328125,0.12799913,[6,19,1,42,]],[0.66814315,0.1640625,[6,20,1,43,]],[0.66779435,0.091796875,[6,1,1,40,]],[0.45507812,0.9824219,[6,20,1,43,]],[0.44726562,0.90234375,[6,19,1,42,]],[0.44726562,0.90234375,[6,2,1,41,]],[0.44140625,0.82421875,[6,1,1,40,]],[0.42382812,0.109375,[2,19,1,50,]],[0.46656522,0.13938206,[2,20,1,51,]],[0.46657267,0.07901275,[2,1,1,48,]],[0.5078125,0.103515625,[2,2,1,49,]],[0.6328125,0.12799913,[4,19,1,46,]],[0.66814315,0.1640625,[4,20,1,47,]],[0.703125,0.12786025,[4,3,1,45,]],[0.66779435,0.091796875,[4,2,1,44,]],[0.45507812,0.9824219,[4,20,1,47,]],[0.44726562,0.90234375,[4,3,1,45,]],[0.44726562,0.90234375,[4,19,1,46,]],[0.44140625,0.82421875,[4,2,1,44,]],[0.45507812,0.9824219,[2,20,1,51,]],[0.44726562,0.90234375,[2,2,1,49,]],[0.44140625,0.82421875,[2,1,1,48,]],[0.44726562,0.90234375,[2,19,1,50,]],[0.12890625,0.98046875,[0,1,]],[0.13085938,0.9082031,[0,2,]],[0.234375,0.9082031,[0,3,]],[0.23046875,0.98046875,[0,0,]],],
  fa:[[8,3,15],[15,16,8],[11,5,3],[3,8,11],[7,0,5],[5,11,7],[12,13,0],[0,7,12],[2,9,16],[16,15,2],[4,10,9],[9,2,4],[1,6,10],[10,4,1],[13,12,6],[6,1,13],[14,4,2],[2,15,14],[14,15,3],[3,5,14],[1,4,14],[14,13,1],[0,13,14],[14,5,0],[22,8,16],[16,24,22],[21,11,8],[8,22,21],[18,7,11],[11,21,18],[17,12,7],[7,18,17],[28,22,24],[24,25,28],[29,21,22],[22,28,29],[33,28,25],[25,38,33],[36,29,28],[28,33,36],[9,23,24],[24,16,9],[10,20,23],[23,9,10],[6,19,20],[20,10,6],[12,17,19],[19,6,12],[23,26,25],[25,24,23],[20,27,26],[26,23,20],[27,35,34],[34,26,27],[26,34,38],[38,25,26],[53,52,48],[48,41,53],[41,48,50],[50,44,41],[50,45,40],[40,44,50],[45,58,57],[57,40,45],[46,39,57],[57,58,46],[43,39,46],[46,49,43],[42,43,49],[49,47,42],[53,42,47],[47,52,53],[56,40,57],[57,39,56],[55,54,44],[55,44,40],[40,56,55],[43,54,55],[55,56,39],[39,43,55],[54,53,41],[41,44,54],[42,53,54],[54,43,42],[45,62,60],[60,58,45],[50,68,62],[62,45,50],[48,71,68],[68,50,48],[71,48,52],[62,64,59],[59,60,62],[68,67,64],[64,62,68],[64,33,38],[38,59,64],[67,36,33],[33,64,67],[61,46,58],[58,60,61],[63,61,60],[60,59,63],[34,63,59],[59,38,34],[65,49,46],[46,61,65],[66,65,61],[61,63,66],[35,66,63],[63,34,35],[69,47,49],[49,65,69],[99,80,89],[89,94,99],[80,95,91],[91,89,80],[94,89,92],[92,96,94],[89,91,90],[90,92,89],[92,90,84],[84,86,92],[91,88,84],[84,90,91],[91,95,98],[98,88,91],[92,86,97],[97,96,92],[86,84,81],[81,85,86],[97,86,85],[88,87,81],[81,84,88],[88,98,87],[99,94,93],[93,80,99],[95,80,93],[93,94,96],[95,93,83],[83,98,95],[96,97,83],[83,93,96],[98,83,82],[82,87,98],[97,85,82],[82,83,97],[78,101,103],[103,75,78],[101,77,73],[73,103,101],[76,102,101],[101,78,76],[102,74,77],[77,101,102],[79,100,103],[103,73,79],[100,72,75],[75,103,100],[74,102,100],[100,79,74],[102,76,72],[72,100,102],[81,87,106],[106,104,81],[104,106,105],[105,107,104],[87,82,108],[108,106,87],[108,76,78],[78,106,108],[106,78,75],[75,105,106],[107,105,75],[75,72,107],[81,104,107],[107,85,81],[108,107,72],[72,76,108],[85,107,108],[108,82,85],[111,32,36],[36,109,111],[109,36,67],[110,109,68],[68,71,110],[68,109,67],[37,32,111],[111,112,37],[70,37,112],[52,113,71],[113,112,110],[110,71,113],[113,70,112],[113,52,69],[47,69,51],[77,116,114],[114,73,77],[79,73,114],[114,115,79],[77,74,117],[117,116,77],[74,79,115],[115,117,74],[119,124,123],[123,121,119],[120,125,124],[124,119,120],[127,119,121],[121,129,127],[128,120,119],[119,127,128],[118,126,129],[129,121,118],[122,118,121],[121,123,122],[120,128,126],[126,118,120],[125,120,118],[118,122,125],[135,140,146],[146,141,135],[140,139,144],[144,146,140],[141,146,143],[143,138,141],[146,144,145],[145,143,146],[143,145,154],[154,149,143],[144,147,154],[154,145,144],[144,139,136],[136,147,144],[143,149,137],[137,138,143],[154,147,153],[153,149,154],[147,136,148],[148,153,147],[149,153,150],[150,137,149],[132,133,131],[131,134,132],[153,148,133],[133,132,153],[153,132,134],[134,150,153],[133,127,129],[129,131,133],[134,131,129],[129,126,134],[148,152,130],[130,133,148],[130,128,127],[127,133,130],[150,134,130],[130,152,150],[130,134,126],[126,128,130],[135,141,142],[142,140,135],[139,140,142],[141,138,142],[139,142,151],[151,136,139],[138,137,151],[151,142,138],[136,151,152],[152,148,136],[137,150,152],[152,151,137],[179,165,170],[170,164,179],[170,167,169],[169,168,170],[165,162,167],[167,170,165],[164,170,168],[168,163,164],[168,169,178],[178,171,168],[167,173,178],[178,169,167],[162,161,173],[173,167,162],[163,168,171],[171,160,163],[171,178,177],[177,172,171],[173,174,177],[177,178,173],[173,161,174],[160,171,172],[155,157,156],[156,158,155],[172,177,155],[155,158,172],[174,157,155],[155,177,174],[185,186,191],[191,189,185],[190,187,185],[185,189,190],[185,181,183],[183,186,185],[187,182,181],[181,185,187],[184,188,191],[191,186,184],[187,190,188],[188,184,187],[180,184,186],[186,183,180],[182,187,184],[184,180,182],[157,180,183],[183,156,157],[158,156,183],[183,181,158],[172,158,159],[159,176,172],[181,182,159],[159,158,181],[175,160,172],[172,176,175],[163,160,175],[175,166,163],[179,164,166],[166,165,179],[164,163,166],[162,165,166],[162,166,175],[175,161,162],[175,176,174],[174,161,175],[174,176,159],[159,157,174],[159,182,180],[180,157,159],[216,202,207],[207,201,216],[207,204,206],[206,205,207],[202,199,204],[204,207,202],[201,207,205],[205,200,201],[205,206,212],[212,208,205],[204,210,212],[212,206,204],[204,199,198],[198,210,204],[205,208,197],[197,200,205],[208,212,215],[215,209,208],[210,211,215],[215,212,210],[197,208,209],[210,198,211],[192,195,193],[193,196,192],[209,215,192],[192,196,209],[211,195,192],[192,215,211],[216,201,203],[203,202,216],[203,201,200],[199,202,203],[199,203,213],[213,198,199],[200,197,213],[213,203,200],[198,213,214],[214,211,198],[197,209,214],[214,213,197],[211,214,194],[194,195,211],[209,196,194],[194,214,209],[194,228,227],[227,195,194],[194,196,225],[225,228,194],[195,227,226],[226,193,195],[196,193,226],[226,225,196],[227,221,223],[223,226,227],[228,224,221],[221,227,228],[221,217,220],[220,223,221],[224,219,217],[217,221,224],[222,225,226],[226,223,222],[218,222,223],[223,220,218],[224,228,225],[225,222,224],[219,224,222],[222,218,219],[229,18,21],[21,231,229],[29,231,21],[231,29,36],[36,230,231],[36,32,230],[37,30,232],[232,230,37],[32,37,230],[17,18,229],[229,232,17],[30,17,232],[124,235,233],[233,123,124],[122,123,233],[233,234,122],[125,236,235],[235,124,125],[236,125,122],[122,234,236],[238,66,35],[35,240,238],[31,240,35],[238,237,65],[65,66,238],[237,69,65],[113,69,237],[237,239,113],[70,113,239],[239,37,70],[37,239,240],[240,31,37],[17,30,244],[244,243,17],[19,17,243],[37,241,244],[244,30,37],[241,37,31],[243,242,20],[20,19,243],[20,242,27],[241,31,35],[35,242,241],[27,242,35],[188,247,245],[245,191,188],[189,191,245],[245,246,189],[190,248,247],[247,188,190],[246,248,190],[190,189,246],[217,252,249],[249,220,217],[218,220,249],[249,250,218],[219,251,252],[252,217,219],[250,251,219],[219,218,250],[255,254,253],[253,256,255]],
  anims:[
  {name:'run',a:[
  {t:0.1,bs:[{t:{x:0,y:0,z:0},q:{x:0,y:0,z:0}},{t:{x:-0.39999998,y:0.9,z:0.0},q:{x:0.0,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:-0.59999996},q:{x:-0.44246742,y:-0.107029274,z:-0.07493895}},{t:{x:0.0,y:0.0,z:-1.1999999},q:{x:0.4106646,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:-0.45},q:{x:-0.46734533,y:0.03938438,z:0.0}},{t:{x:0.0,y:0.0,z:-1.1999999},q:{x:0.46433187,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:0.45},q:{x:0.14242415,y:0.54573077,z:0.0}},{t:{x:0.0,y:0.0,z:1.1999999},q:{x:0.35311782,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:0.59999996},q:{x:0.024750104,y:-0.4276557,z:-0.23544383}},{t:{x:0.0,y:0.0,z:1.1999999},q:{x:0.35396615,y:0.0,z:0.0}},{t:{x:0.59999996,y:0.19999999,z:0.0},q:{x:0.0,y:0.0,z:-0.039224666}},{t:{x:-0.5,y:0.39999998,z:0.0},q:{x:0.0,y:0.0,z:-0.08195971}},]},
  {t:0.1,bs:[{t:{x:0,y:0,z:0},q:{x:0,y:0,z:0}},{t:{x:-0.39999998,y:1.1,z:-0.19999999},q:{x:0.0,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:-0.59999996},q:{x:-0.31028694,y:0.17124544,z:-0.07493895}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:0.22481686,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:-0.45},q:{x:-0.62089336,y:-0.15689866,z:0.0}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:-0.31384343,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:0.45},q:{x:0.3208181,y:0.17475581,z:0.0}},{t:{x:0.0,y:0.0,z:1.2},q:{x:-0.20314407,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:0.59999996},q:{x:0.5703673,y:-0.17124543,z:-0.09630647}},{t:{x:0.0,y:0.0,z:1.2},q:{x:0.3599291,y:0.0,z:0.0}},{t:{x:0.59999996,y:0.0,z:0.19999999},q:{x:0.0,y:0.12820514,z:0.0}},{t:{x:-0.5,y:0.0,z:0.35},q:{x:0.0,y:0.057081807,z:0.0}},]},
  {t:0.11,bs:[{t:{x:0,y:0,z:0},q:{x:0,y:0,z:0}},{t:{x:-0.39999998,y:1.3,z:0.0},q:{x:0.0,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:-0.59999996},q:{x:0.043022547,y:0.35311782,z:-0.22848696}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:-0.38539982,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:-0.45},q:{x:-0.032044202,y:-0.535551,z:0.0}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:-0.41769952,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:0.45},q:{x:0.2636724,y:-0.06078385,z:-0.021367522}},{t:{x:0.0,y:0.0,z:1.2},q:{x:-0.2995464,y:0.0,z:0.046245422}},{t:{x:0.39999998,y:-0.45,z:0.59999996},q:{x:0.24935755,y:0.10007241,z:-0.09630647}},{t:{x:0.0,y:0.0,z:1.2},q:{x:-0.37451732,y:0.0,z:0.0}},{t:{x:0.59999996,y:-0.29999998,z:0.0},q:{x:0.0,y:0.0,z:0.09630647}},{t:{x:-0.5,y:-0.39999998,z:0.0},q:{x:0.0,y:0.0,z:0.057081807}},]},
  {t:0.1,bs:[{t:{x:0,y:0,z:0},q:{x:0,y:0,z:0}},{t:{x:-0.39999998,y:1.1,z:0.19999999},q:{x:0.0,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:-0.59999996},q:{x:-0.46383494,y:0.17124544,z:-0.07493895}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:-0.31781882,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:-0.45},q:{x:-0.27106228,y:-0.15689866,z:0.0}},{t:{x:0.0,y:0.0,z:-1.2},q:{x:0.18208182,y:0.0,z:0.0}},{t:{x:-0.35,y:-0.45,z:0.45},q:{x:0.5026905,y:0.17475581,z:0.0}},{t:{x:0.0,y:0.0,z:1.2},q:{x:0.3747729,y:0.0,z:0.0}},{t:{x:0.39999998,y:-0.45,z:0.59999996},q:{x:0.30998167,y:-0.17124543,z:-0.09630647}},{t:{x:0.0,y:0.0,z:1.2},q:{x:-0.26022592,y:0.0,z:0.0}},{t:{x:0.59999996,y:0.0,z:-0.25},q:{x:0.0,y:-0.11065322,z:0.0}},{t:{x:-0.5,y:0.0,z:-0.35},q:{x:0.0,y:-0.08195971,z:0.0}},]},
  ]},
  ]
  			});
  Pd5.calc(lo,0,0.0,0.0,10,{x:0,y:-1,z:0},0,0,true);
  Pd5.calcNormals(lo,true);
  //lo.phong=true;
  if (noSceneAdd) lo.noSceneAdd=true;
  threeAddObj(lo,0,0,0,200);
  if (!noSceneAdd) lo.meshes[0].tmesh.rotation.x=0.4;
  //threeAddObj(10,2,0,30);
  return lo;
}
function threeRender(dt) {
  //				requestAnimationFrame( animate );
  //if (Math.abs(r-10)<0.0001) threeAddObj(10,2,0,30);
  
  
  var ry=0,rx=0.4;
  if (dt===undefined) {
    var t=new Date().getTime();
    //dt=Math.floor((t-threeEnv.ot)*threeEnv.dtscale+0.5);
    dt=(t-threeEnv.ot)*threeEnv.dtscale;
    threeEnv.ot=t;
  }    
  
  //console.log('threeRender '+threeEnv.os.length);
  Pd5.os=threeEnv.os;//for animText.attack
  for (var obi=threeEnv.os.length-1;obi>=0;obi--) {
    var lo=threeEnv.os[obi];
    
    if (threeEnv.aipos) {
      if (lo.ps.ai) {
        //onsole.log('...threRender lo.ps.ai');
        lo.ps.ai(dt);
      }
      lo.ay=lo.ps.roty+(lo.ps.rotofs||0);
      var bb=lo.bb;
      if (bb) {
        var p=lo.ps.pos;
        bb.x=p.x;bb.y=p.y+(lo.ps.bby||0);bb.z=p.z;
      }
    }
  
    //console.log('calc obi');
    var calcnorms=true;
    if (!threeEnv.nocalc) calcnorms=Pd5.calc(lo,dt,0,lo.ay||0,lo.scale||1,{x:lo.x||0,y:lo.y||0,z:lo.z||0},0,0,true);
    if (calcnorms) Pd5.calcNormals(lo,true); //else console.log('calcNormals skipped');
  
    for (var mi=lo.meshes.length-1;mi>=0;mi--) {
      var m=lo.meshes[mi];
      var mesh1=m.tmesh;
      if (!mesh1) continue;
      //					mesh1.rotation.y=ry;
      					//mesh1.rotation.x=rx;
      					var mgv=mesh1.geometry.vertices;
      					var ve2=m.ve2;//lo.verts;
      					for (var h=0;h<ve2.length;h++) {
        						var v=ve2[h];
      	  					var p=v.p1;
      	  					var mp=mgv[h];
      	  					mp.x=p.x;mp.y=-p.y;mp.z=p.z;
      					}
      					var fa=m.fa;
      					//for (var h=fa.length-1;h>=0;h--) {
      			//  			var t=fa[h];
      					for (var h=mesh1.geometry.faces.length-1;h>=0;h--) {
        var tf=	mesh1.geometry.faces[h],t=tf.o5t;
      			  			tf.normal.set(t.nx,t.ny,t.nz);
      					}
      
      var g=mesh1.geometry;
      g.computeVertexNormals();
      g.verticesNeedUpdate = true;
      g.normalsNeedUpdate = true;
      //g.computeBoundingBox();
      if (lo.cm) g.computeBoundingSphere();//else shadows are wrong for phys objs
      
      if (threeEnv.aipos) {
        mesh1.position.copy(lo.ps.pos);
        //mesh1.rotation.y=lo.ps.roty+(lo.ps.rotofs||0);
      }
    }
  }
  
  var br=threeEnv.useBaseRot?planim.baseRot:undefined;
  
  //var q=threeEnv.camera.quaternion;
  //console.log(q._x+' '+q._y+' '+q._z+' '+q._w);
  
  for (var i=threeEnv.billboards.length-1;i>=0;i--) {
    var bb=threeEnv.billboards[i];
    if (bb.update) {
      bb.update=false;
      if (bb.o.bbdraw) bb.o.bbdraw(bb); else {
      var c=bb.c,w=c.width,h=c.height*bb.ar,ct=bb.ct;//c.getContext('2d');
      ct.clearRect(0,0,w,h);
      ct.fillStyle='rgba(0,0,0,0.5)';ct.fillRect(0,0,w,h);//p.c=c;p.ct=ct;
      //ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';
      //ct.fillText('-> '+Math.random(),2,2);
      var o=bb.o,f=o.health/o.mhealth;
      //console.log(o);
      //ct.fillStyle='rgba(255,0,0,0.5)';
      var wb=o.bbwb||2,w0=(w-wb*2)*f;
      if (!o.bbtransp) {
        ct.fillStyle='rgba(0,255,0,1)';ct.fillRect(wb,wb,w0,h-wb*2);
        ct.fillStyle='rgba(255,0,0,1)';ct.fillRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);
      } else {
        ct.fillStyle='rgba(0,255,0,0.3)';ct.clearRect(wb,wb,w0,h-wb*2);ct.fillRect(wb,wb,w0,h-wb*2);
        ct.fillStyle='rgba(255,0,0,0.3)';ct.clearRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);ct.fillRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);
      }
      }
      //bb.threeTex.needsUpdate=1;
      bb.threeTex.needsUpdate=true;
      //onsole.log(' '+bb.threeTex.needsUpdate);
    }
    bb.threeMesh.position.set(bb.x,bb.y,bb.z);
    if (br) {
      bb.threeMesh.rotation.set(-br.x,-br.y,-br.z);
      bb.threeMesh.rotation.order='ZYX';
    } else 
      //bb.threeMesh.matrix.copy(threeEnv.camera.matrix);
      bb.threeMesh.quaternion.copy(threeEnv.camera.quaternion);
  }
  
  
  
  if (threeEnv.lightMesh) {
    threeEnv.lightMesh.position.x = 2500 * Math.cos( threeEnv.r );
    threeEnv.lightMesh.position.z = 2500 * Math.sin( threeEnv.r );
  }
  
  if (!threeEnv.noRotLight) threeEnv.				r+=threeEnv.rotLightV*dt;
  //console.log(threeEnv.				r);
  
  if (threeEnv.renderer) threeEnv.renderer.render(threeEnv.scene,threeEnv.camera);
  return dt;
}
function threeAnimate() {
  threeRender();
  setTimeout(threeAnimate,10);
}
function threePs(p) {
  var o=threeEnv.ps2.pop();
  var ps=threeEnv.ps;
  console.log('threePs '+ps);
  //console.log(ps);
  //console.log(p);
  if (o) {
    //console.log('threePs oooooo');
    
    var vs=o.geometry.vertices;
    for (var h=vs.length-1;h>=0;h--) {
      var v=vs[h];
      v.x=p.x;v.y=p.y;v.z=p.z;
      v.ox=p.x;v.oy=p.y;v.oz=p.z;
    }
    
    o.t=0;
    ps.push(o);
    //console.log(o.ps);
    threeEnv.scene.add(o.ps);
    return;
  }
  
  var geometry=new THREE.Geometry();
  var fn='boom.png';
  if (window.urlPf) fn=urlPf(fn); else fn='/shooter/'+fn;
  var sprite=THREE.ImageUtils.loadTexture(fn);
  for (var h=50-1;h>=0;h--) {
    var v=new THREE.Vector3(p.x,p.y,p.z);
    var vx=(Math.random()-0.5),vy=(Math.random()-0.5),vl=Math.sqrt(vx*vx+vy*vy)
    vl/=(Math.random())*200;
    //vl/=(0.5+Math.random()*0.5)*100;
    v.vx=vx/vl;
    v.vz=vy/vl;
    v.ox=p.x;v.oy=p.y;v.oz=p.z;
    geometry.vertices.push(v);
  }
  //					geometry.vertices.push(new THREE.Vector3(0,60,0));
  var material=new THREE.ParticleBasicMaterial({size:30*threeEnv.scale,sizeAttenuation:true,map:sprite,transparent:true,color:'#f00'});//1500
  //var material=new THREE.PointsMaterial({size:30*threeEnv.scale,sizeAttenuation:true,map:sprite,transparent:true,color:'#f00'});//1500
  particles=new THREE.ParticleSystem(geometry,material);
  //particles=new THREE.Points(geometry,material);
  particles.sortParticles=true;
  ps.push({geometry:geometry,material:material,t:0,mt:500,ps:particles});
  scene.add(particles);
  //og('ps created');
  
}
function threePsCalc() {
  var ps=threeEnv.ps;
  for (var i=ps.length-1;i>=0;i--) {
    var o=ps[i];
    //o.t=(o.t+dt)%o.mt;
    o.t+=dt;
    if (o.t>o.mt) {
      ps.splice(i,1);
      scene.remove(o.ps);
      threeEnv.ps2.push(o);
      continue;
    }
    var f=o.t/o.mt;
    o.material.size=Math.sin(PI*f)*30*threeEnv.scale;
    var vs=o.geometry.vertices;
    for (var h=vs.length-1;h>=0;h--) {
      var v=vs[h];
      v.x=v.ox+v.vx*f;
      v.y=v.oy-Math.sin(PI/2*f)*60;
      v.z=v.oz+v.vz*f;
    }
  }
}
function threeMeshUpdate(lo,dy) {
  for (var mi=lo.meshes.length-1;mi>=0;mi--) {
    var m=lo.meshes[mi];
    threeEnv.base.remove(m.tmesh);
    //if (m.wmesh) threeEnv.base.remove(m.wmesh);
  }
  Pd5.calc(lo,0,0.0,0.0,1,{x:0,y:dy,z:0},0,0,true);//y:-1
  Pd5.calcNormals(lo,true);//lo.transparent=true;  
  var o=lo.o;
  //alert(o.x+' '+o.y+' '+o.z);
  threeCreateMesh(lo,false,0,0,0,1,undefined);//mThreeWires.checked?threeEnv.wireMat:undefined);
  //threeCreateMesh(lo,false,o.x*20*threeEnv.scale,o.y*20*threeEnv.scale,o.z*20*threeEnv.scale,1,undefined);//mThreeWires.checked?threeEnv.wireMat:undefined);
  //for (var mi=lo.meshes.length-1;mi>=0;mi--) {
  //  var m=lo.meshes[mi];
  //  m.wmesh=new THREE.Mesh(m.tmesh.geometry,threeEnv.wireMat);
  //  m.wmesh.scale.set(200,200,200);
  //  threeEnv.base.add(m.wmesh);
  //}
  
  
  //if (mThreePoints.checked) {
  //  var ge=new THREE.Geometry();
  //  for (var h=0;h<lo.verts.length;h++) {
  //    //var p=lo.verts[h].p1;
  //    ge.vertices.push(new THREE.Vector3(0,0,0));//(p.x+tr.x)*200,(-p.y+tr.y)*200,(p.z+tr.z)*200));
  //  }
  //  var pa=new THREE.ParticleSystem(ge,threeEnv.partMat);
  //  pa.sortParticles=true;
  //  threeEnv.base.add(pa);
  //  threeEnv.partGe=ge;
  //  threeEnv.partPs=pa;
  //}
  
  //drawNew=true;
  //threeRender();
}
//-----------
function DungeonGeometry(ps,view) {
  
  //console.log('DungeonGeometry d=');
  //console.log(p);
  THREE.BufferGeometry.call( this );
  var width=50,height=50,depth=50,t='roofCant0';
  this.type='DungeonGeometry';
  this.parameters = {
    width: width,
    height: height,
    depth: depth,
  };
  
  var scope = this;
  
  // buffers
  
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  
  // helper variables
  
  var numberOfVertices = 0;
  var groupStart = 0;
  
  // build each side of the box geometry
  var w=width,h=height,d=depth,a,mx,mz,xz,
  
    a=[[[-100,100,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,100,100,0.4688,0.3801]
       ,[-100,-100,-100,0.1563,0.3676],[-100,100,-100,0.1563,0.2142],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563]
       ,[100,100,-100,0.355,0.1563],[-100,100,-100,0.1563,0.2142],[-100,100,100,0.27,0.4381],[100,100,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563],[100,100,100,0.4688,0.3801],[100,-100,100,0.4688,0.4108],[100,-100,-100,0.355,0.3096],[-100,100,-100,0.1563,0.2142],[-100,100,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-100,-100,0.1563,0.3676]],
       [
       [2,0,1],[0,2,3]
       ,[4,7,6],[7,4,5]
       ,[2,1,4],[4,6,2]
       //,[15,12,14],[12,15,13]
       //,[17,19,18],[23,21,22],[10,16,11],[16,10,20],[17,8,19],[9,21,23]
       ]];
  
  if (0) {
  var pa=a[0],fa=a[1];
  for (var i=0;i<pa.length;i++) { var p=pa[i];
    var x=(mx?-1:1)*(xz?p[2]:p[0]),
        y=p[1],
        z=(mz?-1:1)*(xz?p[0]:p[2]);
    vertices.push(x*w/200,y*h/200,z*d/200);normals.push(0,0,1);uvs.push(p[3],p[4]); }
  for (var i=0;i<fa.length;i++) { var f=fa[i];
    if ((mz&&!xz)||(xz&&!mx&&!mz)||(mx&&!xz)) indices.push(f[0],f[1],f[2]); else indices.push(f[0],f[2],f[1]); 
  }
  } 
  function key(x,y,z) {
    return z+' '+y+' '+x;
  }
  function vert(x,y,z,u,v) {
    x+=b*ps.dx;//-=b*(ps.xmax+ps.xmin)/2;
    z+=b*ps.dz;//-=b*(ps.zmax+ps.zmin)/2;
    y+=b*ps.dy;//-=b*ps.ymin;
    u*=0.5;
    v*=0.5;
    vertices.push(x,y,z);normals.push(u,v,0);uvs.push(u||0,v||0);
    return vertices.length/3-1;
  }
  var rH=ps.rH,b=ps.blockw||10;  
  for (var k in rH) if (rH.hasOwnProperty(k)) {
    var a=rH[k],x,y,z;
    if (a.sky) continue;
    if (a.x!==undefined) {
      x=a.x;y=a.y;z=a.z;
    } else {
      x=a[0];y=a[1];z=a[2];
    }
    //if (a.view^view) continue;
    if (view&&!a.view) continue;
    if (!view&&(a.view||!a.wview
      )) continue;
    if (!rH[key(x,y-1,z)]) {
      var i0=vert(x*b,y*b,z*b,0,0),i1=vert((x+1)*b,y*b,z*b,1,0),i2=vert(x*b,y*b,(z+1)*b,0,1),i3=vert((x+1)*b,y*b,(z+1)*b,1,1);
      indices.push(i0,i3,i1);indices.push(i0,i2,i3);
    }
    if (!rH[key(x,y+1,z)]) {
      var i0=vert(x*b,(y+1)*b,z*b,0,0),i1=vert((x+1)*b,(y+1)*b,z*b,1,0),i2=vert(x*b,(y+1)*b,(z+1)*b,0,1),i3=vert((x+1)*b,(y+1)*b,(z+1)*b,1,1);
      indices.push(i0,i1,i3);indices.push(i0,i3,i2);
    }
    if (!rH[key(x-1,y,z)]) {
      var i0=vert(x*b,y*b,z*b,0,0),i1=vert(x*b,(y+1)*b,z*b,1,0),i2=vert(x*b,(y+1)*b,(z+1)*b,1,1),i3=vert(x*b,y*b,(z+1)*b,0,1);
      indices.push(i0,i1,i2);indices.push(i0,i2,i3);
    }
    if (!rH[key(x+1,y,z)]) {
      var i0=vert((x+1)*b,y*b,z*b,0,0),i1=vert((x+1)*b,(y+1)*b,z*b,1,0),i2=vert((x+1)*b,(y+1)*b,(z+1)*b,1,1),i3=vert((x+1)*b,y*b,(z+1)*b,0,1);
      indices.push(i0,i2,i1);indices.push(i0,i3,i2);
    }
    if (!rH[key(x,y,z-1)]) {
      var i0=vert(x*b,y*b,z*b,0,0),i1=vert((x+1)*b,y*b,z*b,1,0),i2=vert((x+1)*b,(y+1)*b,z*b,1,1),i3=vert(x*b,(y+1)*b,z*b,0,1);
      indices.push(i0,i1,i2);indices.push(i0,i2,i3);
    }
    if (!rH[key(x,y,z+1)]) {
      var i0=vert(x*b,y*b,(z+1)*b,0,0),i1=vert((x+1)*b,y*b,(z+1)*b,1,0),i2=vert((x+1)*b,(y+1)*b,(z+1)*b,1,1),i3=vert(x*b,(y+1)*b,(z+1)*b,0,1);
      indices.push(i0,i2,i1);indices.push(i0,i3,i2);
    }
  }
  groupCount=indices.length;
  scope.addGroup( groupStart, groupCount, 0 );
  groupStart += groupCount;
  
  //onsole.log('DungeonGeometry indices.len='+indices.length);
  
  this.setIndex( indices );
  this.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  this.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
  this.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
  
  if (view) {//view) {
    this.computeFaceNormals();
    this.computeVertexNormals();
  }
}
if (window.THREE) {
  DungeonGeometry.prototype=Object.create( THREE.BufferGeometry.prototype );
  DungeonGeometry.prototype.constructor=DungeonGeometry;
  //onsole.log('threePd5: DungeonGeometry inited.');
}
//--------three js contruction funcs
threeEnv.pv=function(p) {
  
  var k=(p.k||'')+' '+Math.floor(p.x*1000+0.5)+' '+Math.floor(p.y*1000+0.5)+' '+Math.floor(p.z*1000+0.5),ret=threeEnv.posVerts[k];
  if (!ret) {
    threeEnv.posVerts[k]=p;
    ret=p;
  } //else console.log('from hash');
  
  return ret;
  //...
}
threeEnv.addTri=function(ps) {
  var fa,ge=ps.ge,vl=ge.vertices.length,v0,v1,v2,//=ps.v0,v1=ps.v1,v2=ps.v2,
      a0=ps.a0,k=ps.k,f=ps.f,vis=threeEnv.vertIndices;
  
  if (a0) {
    var a1=ps.a1,a2=ps.a2;
    if (ps.dim) {
      v0=new THREE.Vector3(a0[0],a0[1],a0[2]);                  v1=new THREE.Vector3(a0[0]+a1[0],a0[1]+a1[1],a0[2]+a1[2]);
      v2=new THREE.Vector3(a0[0]+a2[0],a0[1]+a2[1],a0[2]+a2[2]);//v3=new THREE.Vector3(a0[0]+a3[0],a0[1]+a3[1],a0[2]+a3[2]);
    } else {
      v0=new THREE.Vector3(a0[0],a0[1],a0[2]);v1=new THREE.Vector3(a1[0],a1[1],a1[2]);
      v2=new THREE.Vector3(a2[0],a2[1],a2[2]);//v3=new THREE.Vector3(a3[0],a3[1],a3[2]);
    }
  } else {
    v0=ps.v0;v1=ps.v1;v2=ps.v2;//v3=ps.v3;
  }
  if (k) { v0.k=k;v1.k=k;v2.k=k; }
  if (f) { v0=f(v0);v1=f(v1);v2=f(v2); }
  
  //var i0=v0.flat?-1:ge.vertices.indexOf(v0);if (i0==-1) { ge.vertices.push(v0);i0=ge.vertices.length-1; }
  //var i1=v1.flat?-1:ge.vertices.indexOf(v1);if (i1==-1) { ge.vertices.push(v1);i1=ge.vertices.length-1; }
  //var i2=v2.flat?-1:ge.vertices.indexOf(v2);if (i2==-1) { ge.vertices.push(v2);i2=ge.vertices.length-1; }
  
  //--- lots faster than above
  var i0=v0.flat?-1:v0.vi||-1;if (i0==-1) { ge.vertices.push(v0);i0=ge.vertices.length-1;v0.vi=i0; }
  var i1=v1.flat?-1:v1.vi||-1;if (i1==-1) { ge.vertices.push(v1);i1=ge.vertices.length-1;v1.vi=i1; }
  var i2=v2.flat?-1:v2.vi||-1;if (i2==-1) { ge.vertices.push(v2);i2=ge.vertices.length-1;v2.vi=i2; }
  
  //var i0=v0.flat?undefined:vis[v0];if (i0===undefined) { ge.vertices.push(v0);i0=ge.vertices.length-1;vis[v0]=i0; }
  //var i1=v1.flat?undefined:vis[v1];if (i1===undefined) { ge.vertices.push(v1);i1=ge.vertices.length-1;vis[v1]=i1; }
  //var i2=v2.flat?undefined:vis[v2];if (i2===undefined) { ge.vertices.push(v2);i2=ge.vertices.length-1;vis[v2]=i2; }
  
  ge.faces.push(fa=new THREE.Face3(i0,i1,i2));
  fa.vertexColors=[v0.col||ps.c0||ps.c,v1.col||ps.c1||ps.c,v2.col||ps.c2||ps.c];
  //fa.vertexColors=[v0.col?v0.col:ps.c0,v1.col?v1.col:ps.c1,v2.col?v2.col:ps.c2];
  //...
}
threeEnv.addQuad=function(ps) {
  //---
  var v0,v1,v2,v3,a0=ps.a0,k=ps.k,f=ps.f;
  if (a0) {
    var a1=ps.a1,a2=ps.a2,a3=ps.a3;
    if (ps.dim) {
      v0=new THREE.Vector3(a0[0],a0[1],a0[2]);                  v1=new THREE.Vector3(a0[0]+a1[0],a0[1]+a1[1],a0[2]+a1[2]);
      v2=new THREE.Vector3(a0[0]+a2[0],a0[1]+a2[1],a0[2]+a2[2]);v3=new THREE.Vector3(a0[0]+a3[0],a0[1]+a3[1],a0[2]+a3[2]);
    } else {
      v0=new THREE.Vector3(a0[0],a0[1],a0[2]);v1=new THREE.Vector3(a1[0],a1[1],a1[2]);
      v2=new THREE.Vector3(a2[0],a2[1],a2[2]);v3=new THREE.Vector3(a3[0],a3[1],a3[2]);
    }
  } else {
    v0=ps.v0;v1=ps.v1;v2=ps.v2;v3=ps.v3;
  }
  if (k) { v0.k=k;v1.k=k;v2.k=k;v3.k=k; }
  if (f) { v0=f(v0);v1=f(v1);v2=f(v2);v3=f(v3); }
  var c0=ps.c0||ps.c,c1=ps.c1||ps.c,c2=ps.c2||ps.c,c3=ps.c3||ps.c;
  threeEnv.addTri({ge:ps.ge,v0:v0,v1:v1,v2:v2,c0:c0,c1:c1,c2:c2});
  threeEnv.addTri({ge:ps.ge,v0:v1,v1:v3,v2:v2,c0:c1,c1:c3,c2:c2});
  //---
}
//fr o,9,33
//fr o,16
//fr o,18
//fr o,32
//fr o,33
//fr p,6,158
