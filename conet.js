var Conet={};
(function(Conet) {
  Conet.offline=false;
  Conet.version='v.1.268 ';//FOLDORUPDATEVERSION
  Conet.files={};
  var uploads={},fns,logc,logs=[];//fn=>data,first
  function xhr(p) {
    var x=new XMLHttpRequest();
    x.overrideMimeType('text/plain');
    x.open('GET',p.url,true);
    x.onreadystatechange=function() {
      //onsole.log('Conet.xhr '+x.readyState);
      if (x.readyState!=4) return;
      //console.log(x.responseText);
      if (p.f) p.f(x.responseText);//sendChunk();
    }
    try {
    x.send(null);
    } catch (e) { console.log('Conet.xhr err');console.log(e); }
    return x;
  }
  function upload(p) {
    //onsole.log('Conet.upload 0');
    if (Conet.offline) {
      //onsole.log('Conet.upload 1');
      localStorage['conetd'+p.fn]=p.data;
      localStorage['conetu'+p.fn]='update';
      if (p.f) p.f();
      return;
    }
    
    
    var fn=p.fn,uh=uploads[fn];
    if (uh) {  uh.data=p.data;uh.first=!p.append;return; }//true
    uh={data:p.data,first:!p.append};uploads[fn]=uh;//true
    
    //var fn=p.fn,ser=p.data,first=true;
    
    
    function sendChunk(responseText) {
      var uh=uploads[fn];
      if (!uh.first&&(uh.data.length==0)) {
        xhr({url:fn+'?CONETFC'});
        //setTimeout(function() { xhr({url:fn+'?CONETFC',f:function (s) {alert(s);}}); },1000);
        delete(uploads[fn]);
        if (p.f) p.f(responseText);
        if (p.log) p.log(responseText===''?'Conet-save error.':'Conet-saved: '+p.fn+'.');
        return;
      }
      console.log('conet-sendChunk '+uh.data.length);
      
      var sh,clen=100000;//200000 was ok,400000 err;
      if (uh.data.length>clen) {
        sh=uh.data.substr(0,clen);uh.data=uh.data.substr(clen);
      } else {
        sh=uh.data;uh.data='';
      }
      var url=fn+'?'+(uh.first?'RESET&':'')+'APPEND='+encodeURIComponent(sh);
      uh.first=false;
      xhr({url:url,f:sendChunk});
      /*
      setTimeout(function() {
        xhr({url:url,f:sendChunk});
      }
      ,1000);
      */
    }
    sendChunk();
  }
  function download(p) {
    var noResponseTimer;
    var x=xhr({url:p.fn,f:function(s) {
      clearTimeout(noResponseTimer);
      if (x.status!=200) {
        console.log('conet.download '+p.fn+': offline (status!=200) '+noResponseTimer);
        if (!p.usecache) { Conet.offline=false;p.f(undefined);return; }//nocache
        Conet.offline=true;
        s=localStorage['conetd'+p.fn];
        if (s!==undefined) p.f(s);
        return;
      }
      Conet.offline=false;
      if (localStorage['conetu'+p.fn]=='update') {
        localStorage['conetu'+p.fn]='';
        s=localStorage['conetd'+p.fn];
        p.f(s);
        console.log('uploading offline changes.');
        upload({fn:p.fn,data:s});
        return;
      }
      if (p.usecache) {
        localStorage['conetd'+p.fn]=s;
        console.log('conet.download set localStorage: conetd'+p.fn);
      }
      p.f(s);
    }
    });
    noResponseTimer=setTimeout(function() {
      console.log('conet.download '+p.fn+': offline (timer)');
      x.abort();
      //---following handling not needed, since after abort above handler is executed
      //offline=true;
      //s=localStorage['conetd'+p.fn];
      //if (s!==undefined) p.f(s);
    }
    ,10000);
  }
  function lz(n) {
    return n<10?'0'+n:n;
  }
  Conet.fileMenu=function(p) {
    //---m.a are set only for compatibility (e.g. in paint Load,Save else trigger localStorage io)
    //---
    function setCurFn(v) {
      m.curFn=v;
      Menu.ms(p.loadMs?mload:m,m.curFn);
      //...
    }
    function mload1() {
      ////m.curFn=this.s;
      ////Menu.ms(m,m.curFn);
      var fn=this.a;//this.s;
      if (p.loadList||!p.savef) checkListFile(fn);//| if there is no save, filelist be updated on load
      else setCurFn(fn);//checkListFile(fn);
      p.loadf(fn);
    }
    function mloadUpdate() {
      mload.sub.splice(1,mload.sub.length-1);
      //onsole.log(m.files);
      for (var i=0;i<m.files.length;i++) {
        var fn=m.files[i].fn;
        var i0=fn.lastIndexOf('/')+1;//if (i0==-1) i0=0;
        var i1=fn.indexOf('.',2);//skip path dots
        if (i1==-1) i1=fn.length;
        if (i1-i0>10) i0=i1-10;
        mload.sub.push({s:fn.substr(i0,i1-i0),ms:fn.substr(0,i0)+'^'+fn.substr(i1)//,fs:0.5
          ,a:fn,actionf:mload1});
      }
    }
    function checkListFile(v) {
      //m.curFn=v;
      //Menu.ms(p.loadMs?mload:m,m.curFn);
      setCurFn(v);
      var iv=-1;
      for (var i=m.files.length-1;i>=0;i--) if (m.files[i].fn==v) { iv=i;break; }
      if (iv==0) return;
      if (iv==-1) {
        m.files.splice(0,0,{fn:v});
      } else {
        var h=m.files[iv];
        m.files.splice(iv,1);
        m.files.splice(0,0,h);
      }
      mloadUpdate();
      Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      //...
    }
    Conet.fileMenuCount=(Conet.fileMenuCount||0)+1;
    var mload,msid='conetFileMenu'+Conet.fileMenuCount,
        m={s:'<span style="font-size:0.5em;">Conet</span>File',ms:'',msid:(p.loadMs?undefined:msid),sub:[],
          checkListFile:checkListFile};//ms:p.defFn||''
    
    if (p.m) for (var k in p.m) if (p.m.hasOwnProperty(k)) m[k]=p.m[k];
    
    if (p.newf) m.sub.push({s:'New',actionf:p.newf});
    
    m.sub.push(mload={s:'Load',noa:1,a:'conetLoad',sub:[{s:'...',doctrl:'Load'
    
    ,valuef:function() {
      return m.curFn||p.defFn||'';
    }
    ,setfunc:function(v,initLoad) {
      if (initLoad) return;
      checkListFile(v);
      p.loadf(v);
    }
    
    }]});
    
    if (p.loadMs) {
      mload.ms='';mload.msid=msid;
    }
    
    if (p.savef) {
    m.sub.push(
    {s:'Save',a:'conetSave',keys:['83_c'],ms:'<span style="color:#00f">ctrl+s</span>',actionf:function() {
      checkListFile(m.curFn);
      p.savef(m.curFn);
    }
    });
    m.sub.push({s:'Save as&hellip;',a:'conetSaveAs',doctrl:'Save as'
    ,setfunc:function(v,initLoad) {
      if (initLoad) return;
      //m.curFn=v;
      //Menu.ms(m,m.curFn);
      //var iv=-1;
      //for (var i=m.files.length-1;i>=0;i--) if (m.files[i].fn==v) { iv=i;break; }
      //if (iv==-1) {
      //  m.files.splice(0,0,{fn:v});
      //} else {
      //  var h=m.files[iv];
      //  m.files.splice(h,1);
      //  m.files.splice(0,0,h);
      //}
      //mloadUpdate();
      //Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      checkListFile(v);
      p.savef(v);
    }
    ,valuef:function() {
      return m.curFn||p.defFn||'';
    }
    });
    }
    
    if (p.url) {
      //onsole.log('Conet.fileMenu checking url: '+p.url);
      var s=document.URL,i=s.indexOf('?');
      if (i!=-1) {
        s=s.substring(i+1);
        var a=s.split('&'),params={};
        for (i=0;i<a.length;i++) {
          s=a[i];
          var b=s.split('=');
          params[b[0]]=b[1];
        }
        s=params[p.url];
        if (s) {
          console.log('Conet.fileMenu loading via url: '+s+' (history ignored)');
          p.loadf(s);
          return;// {s:'-'};
        }
      }
    }
    
    Conet.download({fn:p.fn,f:function(v) {
      //console.log('Conet.fileMenu '+p.fn+' '+v);
      if (v===undefined) {
        var hfn=p.defFn||p.curFn;
        //onsole.log('conet.fileMenu no fn "'+p.fn+'", initing with "'+hfn+'"');
        m.files=(hfn!==undefined?[{fn:hfn}]:[]);
        Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      } else {
        //onsole.log('conet.fileMenu found fn "'+p.fn+'": '+v);
        m.files=JSON.parse(v);
      }
      
      //Conet.fmFiles=m.files;//--- this is currently needed for cutouts app.js editmode
      if (p.filesRef) Conet.files[p.filesRef]=m.files;
      
      //onsole.log('Conet.fileMenu '+p.fn+' '+v);
      //onsole.log(Conet.fmFiles);
      mloadUpdate();
      if (p.noStartLoad) return;
      //m.curFn=p.curFn?p.curFn:m.files[0].fn;
      //Menu.ms(p.loadMs?mload:m,m.curFn);
      checkListFile(p.curFn?p.curFn:m.files[0].fn);
      p.loadf(m.curFn,1);
    }
    });
    
    m.cfmLoad=function(s) {
      //console.log('cfmload '+s);
      //console.log(p);
      
      checkListFile(s);
      p.loadf(s);
      
    }
    m.checkListFile=checkListFile;
    return m;
  }
  Conet.initEditHistory=function(pf) {
    //---
    download({fn:'/util/edit.txt',f:function(s) {
      fns=JSON.parse(s);
      if (pf) pf();
    }
    });
    
  }
  Conet.log=function(sh) {
    if (!logc) {
      var c=document.createElement('div'),s=c.style;s.fontSize='10px';s.fontFamily='Sans-serif';s.paddingLeft='2px';
      s.position='absolute';c.innerHTML='Log:<br>123...';s.left='2px';s.top='50px';s.backgroundColor='rgba(255,255,255,0.2)';
      s.userSelect=s.MozUserSelect=s.WebkitUserSelect='none';
      document.body.appendChild(c);Conet.logc=logc=c;
    }
    logs.push(sh);
    logc.innerHTML='<b>Logs:</b> '+logs.join('<br>');
  }
  Conet.parseUrl=function(s) {
    if (s===undefined) s=document.URL;
    var i0=s.indexOf('?');
    s=(i0==-1?'':s.substr(i0+1));
    var a=s.split('&'),h={};
    for (var i=0;i<a.length;i++) {
      var sh=a[i];
      var i0=sh.indexOf('=');
      if (i0==-1) h[sh]=1; else h[sh.substr(0,i0)]=sh.substr(i0+1);
    }
    return h;
  }
  Conet.updateEditHistory=function(p) {
    var fn=p.fn;
    if (p.fns) fns=p.fns;
    
    if (!fns) {
    Conet.initEditHistory(function() {
      Conet.updateEditHistory(p);
    }
    );
    return;
    }
    
    var d=new Date(),ds=d.getFullYear()+'-'+lz(d.getMonth())+'-'+lz(d.getDate())+' '+lz(d.getHours())+':'
      +lz(d.getMinutes())+':'+lz(d.getSeconds());
    var found=false;
    for (var h=fns.length-1;h>=0;h--) {
      var a=fns[h];
      if (a[0]==fn) {
        fns.splice(h,1);
        a[1]++;a[2]=ds;
        fns.splice(0,0,a);
        found=true;
        break;
      }
    }
    if (!found) fns.splice(0,0,[fn,1,ds]);
    upload({fn:'/util/edit.txt',data:JSON.stringify(fns,undefined,' ')});
    fns=undefined;
    console.log('conet.updateEditHistory');
  }
  Conet.xhr=xhr;
  Conet.upload=upload;
  Conet.download=download;
}
)(Conet);
console.log('Conet '+Conet.version);
//fr o,1
//fr o,1,5,17
//fr o,1,8
//fr o,1,8,2
//fr o,1,8,3
//fr o,1,8,4
//fr o,1,8,5
//fr o,1,8,17
//fr o,1,8,18
//fr o,1,8,31
//fr o,1,8,32
//fr o,1,8,56
//fr o,1,9,1
//fr o,1,11
//fr o,1,12
//fr o,1,12,4
//fr p,25,34
