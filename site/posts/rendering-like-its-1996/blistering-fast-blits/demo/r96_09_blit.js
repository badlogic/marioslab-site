
var r96_09_blit = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(r96_09_blit) {
  r96_09_blit = r96_09_blit || {};

"use strict";var Module=typeof r96_09_blit!="undefined"?r96_09_blit:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort(text)}}var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;wasmBinaryFile="r96_09_blit.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;exports=Asyncify.instrumentWasmExports(exports);Module["asm"]=exports;wasmMemory=Module["asm"]["j"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["m"];addOnInit(Module["asm"]["k"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);exports=Asyncify.instrumentWasmExports(exports);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}instantiateAsync().catch(readyPromiseReject);return{}}var tempDouble;var tempI64;function __asyncjs__setup_web_mfb(){return Asyncify.handleAsync(async()=>{Asyncify.handleSleep(wakeUp=>{requestAnimationFrame(wakeUp)});window._minifb.keyMap={"Space":32,"Quote":39,"Comma":44,"Minus":45,"Period":46,"Slash":47,"Digit0":48,"Digit1":49,"Digit2":50,"Digit3":51,"Digit4":52,"Digit5":53,"Digit6":54,"Digit7":55,"Digit8":56,"Digit9":57,"Semicolon":59,"Equal":61,"NumpadEqual":61,"KeyA":65,"KeyB":66,"KeyC":67,"KeyD":68,"KeyE":69,"KeyF":70,"KeyG":71,"KeyH":72,"KeyI":73,"KeyJ":74,"KeyK":75,"KeyL":76,"KeyM":77,"KeyN":78,"KeyO":79,"KeyP":80,"KeyQ":81,"KeyR":82,"KeyS":83,"KeyT":84,"KeyU":85,"KeyV":86,"KeyW":87,"KeyX":88,"KeyY":89,"KeyZ":90,"BracketLeft":91,"Backslash":92,"BracketRight":93,"Backquote":96,"Escape":256,"Enter":257,"Tab":258,"Backspace":259,"Insert":260,"Delete":261,"ArrowRight":262,"ArrowLeft":263,"ArrowDown":264,"ArrowUp":265,"PageUp":266,"PageDown":267,"Home":268,"End":269,"CapsLock":280,"ScrollLock":281,"NumLock":282,"PrintScreen":283,"Pause":284,"F1":290,"F2":291,"F3":292,"F4":293,"F5":294,"F6":295,"F7":296,"F8":297,"F9":298,"F10":299,"F11":300,"F12":301,"F13":302,"F14":303,"F15":304,"F16":305,"F17":306,"F18":307,"F19":308,"F20":309,"F21":310,"F22":311,"F23":312,"F24":313,"F25":314,"Numpad0":320,"Numpad1":321,"Numpad2":322,"Numpad3":323,"Numpad4":324,"Numpad5":325,"Numpad6":326,"Numpad7":327,"Numpad8":328,"Numpad9":329,"NumpadComma":330,"NumpadDivide":331,"NumpadMultiply":332,"NumpadSubtract":333,"NumpadAdd":334,"NumpadEnter":335,"NumpadEqual":336,"ShiftLeft":340,"ControlLeft":341,"AltLeft":342,"MetaLeft":343,"ShiftRight":344,"ControlRight":345,"AltRight":346,"MetaRight":347,"ContextMenu":348}})}function mfb_open_ex_js(windowData,title,width,height,flags){let canvas=document.getElementById(UTF8ToString(title));if(!canvas)return 0;if(!window._minifb){window._minifb={nextId:1,windows:[]}}let id=window._minifb.nextId++;canvas.width=width;canvas.height=height;if(!canvas.style.width&&!canvas.style.height){canvas.style.width=width+"px";canvas.style.height=height+"px"}if(!canvas.style["image-rendering"])canvas.style["image-rendering"]="pixelated";if(!canvas.style["user-select"])canvas.style["user-select"]="none";if(!canvas.style["border"])canvas.style["border"]="none";if(!canvas.style["outline-style"])canvas.style["outline-style"]="none";canvas.tabIndex=-1;let w={id:id,canvas:canvas,windowData:windowData,activeTouchId:null,events:[{type:"active"}]};function toMfbCode(code){return window._minifb.keyMap[code]?window._minifb.keyMap[code]:-1}function getMousePos(event){let rect=canvas.getBoundingClientRect();let pos={x:event.clientX-rect.left,y:event.clientY-rect.top};pos.x=pos.x/canvas.clientWidth*canvas.width;pos.y=pos.y/canvas.clientHeight*canvas.height;return pos}function getMfbKeyModFromEvent(event){const KB_MOD_SHIFT=1;const KB_MOD_CONTROL=2;const KB_MOD_ALT=4;const KB_MOD_SUPER=8;let mod=0;if(event.shiftKey)mod=mod|KB_MOD_SHIFT;if(event.ctrlKey)mod=mod|KB_MOD_CONTROL;if(event.altKey)mod=mod|KB_MOD_ALT;if(event.metaKey)mod=mod|KB_MOD_SUPER;return mod}canvas.addEventListener("keydown",event=>{let code=toMfbCode(event.code);Module._window_data_set_key(windowData,code,1);let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"keydown",code:code,mod:mod})});canvas.addEventListener("keyup",event=>{let code=toMfbCode(event.code);Module._window_data_set_key(windowData,code,0);let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"keydown",code:code,mod:mod})});canvas.addEventListener("mousedown",event=>{if(event.button>8)return;let pos=getMousePos(event);let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);Module._window_data_set_mouse_button(windowData,event.button+1,1);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"mousebutton",button:event.button+1,mod:mod,isPressed:true})},false);canvas.addEventListener("mousemove",event=>{let pos=getMousePos(event);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);w.events.push({type:"mousemove",x:pos.x,y:pos.y})},false);canvas.addEventListener("mouseup",event=>{if(event.button>8)return;let pos=getMousePos(event);let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);Module._window_data_set_mouse_button(windowData,event.button+1,0);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"mousebutton",button:event.button+1,mod:mod,isPressed:false})},false);document.body.addEventListener("mouseup",event=>{if(event.button>8)return;let pos=getMousePos(event);let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);Module._window_data_set_mouse_button(windowData,event.button+1,0);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"mousebutton",button:event.button+1,mod:mod,isPressed:false})},false);canvas.addEventListener("wheel",event=>{event.preventDefault();let mod=getMfbKeyModFromEvent(event);Module._window_data_set_mouse_wheel(windowData,event.deltaX,event.deltaY);Module._window_data_set_mod_keys(windowData,mod);w.events.push({type:"mousescroll",mod:mod,x:event.deltaX,y:event.deltaY})},false);canvas.addEventListener("touchstart",event=>{if(!w.activeTouchId){let touch=event.changedTouches[0];let pos=getMousePos(touch);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);Module._window_data_set_mouse_button(windowData,1,1);w.activeTouchId=touch.identifier;w.events.push({type:"mousebutton",button:1,mod:0,isPressed:true})}event.preventDefault()},false);canvas.addEventListener("touchmove",event=>{if(w.activeTouchId!=null){for(let i=0;i<event.changedTouches.length;i++){let touch=event.changedTouches[i];if(w.activeTouchId===touch.identifier){let pos=getMousePos(touch);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);w.events.push({type:"mousemove",x:pos.x,y:pos.y});break}}}event.preventDefault()},false);function touchEndOrCancel(event){if(w.activeTouchId!=null){for(let i=0;i<event.changedTouches.length;i++){let touch=event.changedTouches[i];if(w.activeTouchId===touch.identifier){let pos=getMousePos(touch);Module._window_data_set_mouse_pos(windowData,pos.x,pos.y);Module._window_data_set_mouse_button(windowData,1,0);w.activeTouchId=null;w.events.push({type:"mousebutton",button:1,mod:0,isPressed:false});break}}}event.preventDefault()}canvas.addEventListener("touchend",touchEndOrCancel,false);canvas.addEventListener("touchcancel",touchEndOrCancel,false);window._minifb.windows[id]=w;return id}function mfb_update_events_js(windowData){const STATE_INVALID_WINDOW=-2;const STATE_INTERNAL_ERROR=-4;if(windowData==0)return STATE_INVALID_WINDOW;let windowId=Module._window_data_get_specific(windowData);if(!window._minifb)return STATE_INTERNAL_ERROR;if(!window._minifb.windows[windowId])return STATE_INVALID_WINDOW;let w=window._minifb.windows[windowId];let events=w.events;w.events=[];for(let i=0;i<events.length;i++){let event=events[i];if(event.type=="active"){Module._window_data_call_active_func(windowData,1)}else if(event.type=="mousebutton"){Module._window_data_call_mouse_btn_func(windowData,event.button,event.mod,event.isPressed?1:0)}else if(event.type=="mousemove"){Module._window_data_call_mouse_move_func(windowData,event.x,event.y)}else if(event.type=="mousescroll"){Module._window_data_call_mouse_wheel_func(windowData,event.mod,event.x,event.y)}else if(event.type=="keydown"){Module._window_data_call_keyboard_func(windowData,event.code,event.mod,1)}else if(event.type=="keyup"){Module._window_data_call_keyboard_func(windowData,event.code,event.mod,0)}}return Module._window_data_get_close(windowData)}function mfb_update_js(windowData,buffer,width,height){const STATE_INVALID_WINDOW=-2;const STATE_INVALID_BUFFER=-3;const STATE_INTERNAL_ERROR=-4;if(windowData==0)return STATE_INVALID_WINDOW;let windowId=Module._window_data_get_specific(windowData);if(!window._minifb)return STATE_INTERNAL_ERROR;if(!window._minifb.windows[windowId])return STATE_INVALID_WINDOW;if(buffer==0)return STATE_INVALID_BUFFER;let w=window._minifb.windows[windowId];let canvas=w.canvas;if(width<=0){width=canvas.width;height=canvas.height}else{if(canvas.width!=width)canvas.width=width;if(canvas.height!=height)canvas.height=height}Module._reverse_color_channels(buffer,buffer,width,height);let framePixels=new Uint8ClampedArray(HEAPU8.buffer,buffer,width*height*4);let imageData=new ImageData(framePixels,width,height);canvas.getContext("2d").putImageData(imageData,0,0);Module._reverse_color_channels(buffer,buffer,width,height);return Module._window_data_get_close(windowData)}function __asyncjs__load_file(path,size){return Asyncify.handleAsync(async()=>{let url="./"+UTF8ToString(path);let response=await fetch(url);if(!response.ok)return 0;let data=new Uint8Array(await response.arrayBuffer());let ptr=_malloc(data.byteLength);HEAPU8.set(data,ptr);HEAPU32[size>>2]=data.byteLength;return ptr})}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}Module["ExitStatus"]=ExitStatus;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}Module["callRuntimeCallbacks"]=callRuntimeCallbacks;function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort("invalid type for getValue: "+type)}return null}Module["getValue"]=getValue;function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort("invalid type for setValue: "+type)}}Module["setValue"]=setValue;function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}Module["_emscripten_memcpy_big"]=_emscripten_memcpy_big;function getHeapMax(){return 2147483648}Module["getHeapMax"]=getHeapMax;function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}Module["emscripten_realloc_buffer"]=emscripten_realloc_buffer;function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}Module["_emscripten_resize_heap"]=_emscripten_resize_heap;function handleException(e){if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)}Module["handleException"]=handleException;function callUserCallback(func){if(ABORT){return}try{func()}catch(e){handleException(e)}}Module["callUserCallback"]=callUserCallback;function safeSetTimeout(func,timeout){return setTimeout(function(){callUserCallback(func)},timeout)}Module["safeSetTimeout"]=safeSetTimeout;function _emscripten_sleep(ms){return Asyncify.handleSleep(wakeUp=>safeSetTimeout(wakeUp,ms))}Module["_emscripten_sleep"]=_emscripten_sleep;var printCharBuffers=[null,[],[]];Module["printCharBuffers"]=printCharBuffers;function printChar(stream,curr){var buffer=printCharBuffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}}Module["printChar"]=printChar;function flush_NO_FILESYSTEM(){if(printCharBuffers[1].length)printChar(1,10);if(printCharBuffers[2].length)printChar(2,10)}Module["flush_NO_FILESYSTEM"]=flush_NO_FILESYSTEM;var SYSCALLS={varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret}};Module["SYSCALLS"]=SYSCALLS;function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;for(var j=0;j<len;j++){printChar(fd,HEAPU8[ptr+j])}num+=len}HEAPU32[pnum>>2]=num;return 0}Module["_fd_write"]=_fd_write;function _proc_exit(code){EXITSTATUS=code;if(!keepRuntimeAlive()){if(Module["onExit"])Module["onExit"](code);ABORT=true}quit_(code,new ExitStatus(code))}Module["_proc_exit"]=_proc_exit;function exitJS(status,implicit){EXITSTATUS=status;_proc_exit(status)}Module["exitJS"]=exitJS;function runAndAbortIfError(func){try{return func()}catch(e){abort(e)}}Module["runAndAbortIfError"]=runAndAbortIfError;function sigToWasmTypes(sig){var typeNames={"i":"i32","j":"i32","f":"f32","d":"f64","p":"i32"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]]);if(sig[i]==="j"){type.parameters.push("i32")}}return type}Module["sigToWasmTypes"]=sigToWasmTypes;function runtimeKeepalivePush(){}Module["runtimeKeepalivePush"]=runtimeKeepalivePush;function runtimeKeepalivePop(){}Module["runtimeKeepalivePop"]=runtimeKeepalivePop;var Asyncify={instrumentWasmImports:function(imports){var ASYNCIFY_IMPORTS=["env.invoke_*","env.emscripten_sleep","env.emscripten_wget","env.emscripten_wget_data","env.emscripten_idb_load","env.emscripten_idb_store","env.emscripten_idb_delete","env.emscripten_idb_exists","env.emscripten_idb_load_blob","env.emscripten_idb_store_blob","env.SDL_Delay","env.emscripten_scan_registers","env.emscripten_lazy_load_code","env.emscripten_fiber_swap","wasi_snapshot_preview1.fd_sync","env.__wasi_fd_sync","env._emval_await","env._dlopen_js","env.__asyncjs__*"].map(x=>x.split(".")[1]);for(var x in imports){(function(x){var original=imports[x];var sig=original.sig;if(typeof original=="function"){var isAsyncifyImport=ASYNCIFY_IMPORTS.indexOf(x)>=0||x.startsWith("__asyncjs__")}})(x)}},instrumentWasmExports:function(exports){var ret={};for(var x in exports){(function(x){var original=exports[x];if(typeof original=="function"){ret[x]=function(){Asyncify.exportCallStack.push(x);try{return original.apply(null,arguments)}finally{if(!ABORT){var y=Asyncify.exportCallStack.pop();assert(y===x);Asyncify.maybeStopUnwind()}}}}else{ret[x]=original}})(x)}return ret},State:{Normal:0,Unwinding:1,Rewinding:2,Disabled:3},state:0,StackSize:4096,currData:null,handleSleepReturnValue:0,exportCallStack:[],callStackNameToId:{},callStackIdToName:{},callStackId:0,asyncPromiseHandlers:null,sleepCallbacks:[],getCallStackId:function(funcName){var id=Asyncify.callStackNameToId[funcName];if(id===undefined){id=Asyncify.callStackId++;Asyncify.callStackNameToId[funcName]=id;Asyncify.callStackIdToName[id]=funcName}return id},maybeStopUnwind:function(){if(Asyncify.currData&&Asyncify.state===Asyncify.State.Unwinding&&Asyncify.exportCallStack.length===0){Asyncify.state=Asyncify.State.Normal;runAndAbortIfError(_asyncify_stop_unwind);if(typeof Fibers!="undefined"){Fibers.trampoline()}}},whenDone:function(){return new Promise((resolve,reject)=>{Asyncify.asyncPromiseHandlers={resolve:resolve,reject:reject}})},allocateData:function(){var ptr=_malloc(12+Asyncify.StackSize);Asyncify.setDataHeader(ptr,ptr+12,Asyncify.StackSize);Asyncify.setDataRewindFunc(ptr);return ptr},setDataHeader:function(ptr,stack,stackSize){HEAP32[ptr>>2]=stack;HEAP32[ptr+4>>2]=stack+stackSize},setDataRewindFunc:function(ptr){var bottomOfCallStack=Asyncify.exportCallStack[0];var rewindId=Asyncify.getCallStackId(bottomOfCallStack);HEAP32[ptr+8>>2]=rewindId},getDataRewindFunc:function(ptr){var id=HEAP32[ptr+8>>2];var name=Asyncify.callStackIdToName[id];var func=Module["asm"][name];return func},doRewind:function(ptr){var start=Asyncify.getDataRewindFunc(ptr);return start()},handleSleep:function(startAsync){if(ABORT)return;if(Asyncify.state===Asyncify.State.Normal){var reachedCallback=false;var reachedAfterCallback=false;startAsync(handleSleepReturnValue=>{if(ABORT)return;Asyncify.handleSleepReturnValue=handleSleepReturnValue||0;reachedCallback=true;if(!reachedAfterCallback){return}Asyncify.state=Asyncify.State.Rewinding;runAndAbortIfError(()=>_asyncify_start_rewind(Asyncify.currData));if(typeof Browser!="undefined"&&Browser.mainLoop.func){Browser.mainLoop.resume()}var asyncWasmReturnValue,isError=false;try{asyncWasmReturnValue=Asyncify.doRewind(Asyncify.currData)}catch(err){asyncWasmReturnValue=err;isError=true}var handled=false;if(!Asyncify.currData){var asyncPromiseHandlers=Asyncify.asyncPromiseHandlers;if(asyncPromiseHandlers){Asyncify.asyncPromiseHandlers=null;(isError?asyncPromiseHandlers.reject:asyncPromiseHandlers.resolve)(asyncWasmReturnValue);handled=true}}if(isError&&!handled){throw asyncWasmReturnValue}});reachedAfterCallback=true;if(!reachedCallback){Asyncify.state=Asyncify.State.Unwinding;Asyncify.currData=Asyncify.allocateData();if(typeof Browser!="undefined"&&Browser.mainLoop.func){Browser.mainLoop.pause()}runAndAbortIfError(()=>_asyncify_start_unwind(Asyncify.currData))}}else if(Asyncify.state===Asyncify.State.Rewinding){Asyncify.state=Asyncify.State.Normal;runAndAbortIfError(_asyncify_stop_rewind);_free(Asyncify.currData);Asyncify.currData=null;Asyncify.sleepCallbacks.forEach(func=>callUserCallback(func))}else{abort("invalid state: "+Asyncify.state)}return Asyncify.handleSleepReturnValue},handleAsync:function(startAsync){return Asyncify.handleSleep(wakeUp=>{startAsync().then(wakeUp)})}};Module["Asyncify"]=Asyncify;var asmLibraryArg={"d":__asyncjs__load_file,"h":__asyncjs__setup_web_mfb,"c":_emscripten_memcpy_big,"b":_emscripten_resize_heap,"e":_emscripten_sleep,"a":_fd_write,"i":mfb_open_ex_js,"g":mfb_update_events_js,"f":mfb_update_js};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["k"]).apply(null,arguments)};var _main=Module["_main"]=function(){return(_main=Module["_main"]=Module["asm"]["l"]).apply(null,arguments)};var _reverse_color_channels=Module["_reverse_color_channels"]=function(){return(_reverse_color_channels=Module["_reverse_color_channels"]=Module["asm"]["n"]).apply(null,arguments)};var _window_data_set_mouse_pos=Module["_window_data_set_mouse_pos"]=function(){return(_window_data_set_mouse_pos=Module["_window_data_set_mouse_pos"]=Module["asm"]["o"]).apply(null,arguments)};var _window_data_set_mouse_wheel=Module["_window_data_set_mouse_wheel"]=function(){return(_window_data_set_mouse_wheel=Module["_window_data_set_mouse_wheel"]=Module["asm"]["p"]).apply(null,arguments)};var _window_data_set_mouse_button=Module["_window_data_set_mouse_button"]=function(){return(_window_data_set_mouse_button=Module["_window_data_set_mouse_button"]=Module["asm"]["q"]).apply(null,arguments)};var _window_data_set_key=Module["_window_data_set_key"]=function(){return(_window_data_set_key=Module["_window_data_set_key"]=Module["asm"]["r"]).apply(null,arguments)};var _window_data_set_mod_keys=Module["_window_data_set_mod_keys"]=function(){return(_window_data_set_mod_keys=Module["_window_data_set_mod_keys"]=Module["asm"]["s"]).apply(null,arguments)};var _window_data_get_specific=Module["_window_data_get_specific"]=function(){return(_window_data_get_specific=Module["_window_data_get_specific"]=Module["asm"]["t"]).apply(null,arguments)};var _window_data_call_active_func=Module["_window_data_call_active_func"]=function(){return(_window_data_call_active_func=Module["_window_data_call_active_func"]=Module["asm"]["u"]).apply(null,arguments)};var _window_data_call_resize_func=Module["_window_data_call_resize_func"]=function(){return(_window_data_call_resize_func=Module["_window_data_call_resize_func"]=Module["asm"]["v"]).apply(null,arguments)};var _window_data_call_close_func=Module["_window_data_call_close_func"]=function(){return(_window_data_call_close_func=Module["_window_data_call_close_func"]=Module["asm"]["w"]).apply(null,arguments)};var _window_data_call_keyboard_func=Module["_window_data_call_keyboard_func"]=function(){return(_window_data_call_keyboard_func=Module["_window_data_call_keyboard_func"]=Module["asm"]["x"]).apply(null,arguments)};var _window_data_call_char_input_func=Module["_window_data_call_char_input_func"]=function(){return(_window_data_call_char_input_func=Module["_window_data_call_char_input_func"]=Module["asm"]["y"]).apply(null,arguments)};var _window_data_call_mouse_btn_func=Module["_window_data_call_mouse_btn_func"]=function(){return(_window_data_call_mouse_btn_func=Module["_window_data_call_mouse_btn_func"]=Module["asm"]["z"]).apply(null,arguments)};var _window_data_call_mouse_move_func=Module["_window_data_call_mouse_move_func"]=function(){return(_window_data_call_mouse_move_func=Module["_window_data_call_mouse_move_func"]=Module["asm"]["A"]).apply(null,arguments)};var _window_data_call_mouse_wheel_func=Module["_window_data_call_mouse_wheel_func"]=function(){return(_window_data_call_mouse_wheel_func=Module["_window_data_call_mouse_wheel_func"]=Module["asm"]["B"]).apply(null,arguments)};var _window_data_get_close=Module["_window_data_get_close"]=function(){return(_window_data_get_close=Module["_window_data_get_close"]=Module["asm"]["C"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["D"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["E"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return(___errno_location=Module["___errno_location"]=Module["asm"]["F"]).apply(null,arguments)};var _emscripten_stack_set_limits=Module["_emscripten_stack_set_limits"]=function(){return(_emscripten_stack_set_limits=Module["_emscripten_stack_set_limits"]=Module["asm"]["G"]).apply(null,arguments)};var _emscripten_stack_get_base=Module["_emscripten_stack_get_base"]=function(){return(_emscripten_stack_get_base=Module["_emscripten_stack_get_base"]=Module["asm"]["H"]).apply(null,arguments)};var _emscripten_stack_get_end=Module["_emscripten_stack_get_end"]=function(){return(_emscripten_stack_get_end=Module["_emscripten_stack_get_end"]=Module["asm"]["I"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["J"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["K"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return(stackAlloc=Module["stackAlloc"]=Module["asm"]["L"]).apply(null,arguments)};var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=function(){return(___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=Module["asm"]["M"]).apply(null,arguments)};var dynCall_viiii=Module["dynCall_viiii"]=function(){return(dynCall_viiii=Module["dynCall_viiii"]=Module["asm"]["N"]).apply(null,arguments)};var dynCall_iiiiii=Module["dynCall_iiiiii"]=function(){return(dynCall_iiiiii=Module["dynCall_iiiiii"]=Module["asm"]["O"]).apply(null,arguments)};var dynCall_viiiiii=Module["dynCall_viiiiii"]=function(){return(dynCall_viiiiii=Module["dynCall_viiiiii"]=Module["asm"]["P"]).apply(null,arguments)};var dynCall_viii=Module["dynCall_viii"]=function(){return(dynCall_viii=Module["dynCall_viii"]=Module["asm"]["Q"]).apply(null,arguments)};var dynCall_ii=Module["dynCall_ii"]=function(){return(dynCall_ii=Module["dynCall_ii"]=Module["asm"]["R"]).apply(null,arguments)};var dynCall_iiii=Module["dynCall_iiii"]=function(){return(dynCall_iiii=Module["dynCall_iiii"]=Module["asm"]["S"]).apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){return(dynCall_jiji=Module["dynCall_jiji"]=Module["asm"]["T"]).apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){return(dynCall_vi=Module["dynCall_vi"]=Module["asm"]["U"]).apply(null,arguments)};var dynCall_viiiii=Module["dynCall_viiiii"]=function(){return(dynCall_viiiii=Module["dynCall_viiiii"]=Module["asm"]["V"]).apply(null,arguments)};var _asyncify_start_unwind=Module["_asyncify_start_unwind"]=function(){return(_asyncify_start_unwind=Module["_asyncify_start_unwind"]=Module["asm"]["W"]).apply(null,arguments)};var _asyncify_stop_unwind=Module["_asyncify_stop_unwind"]=function(){return(_asyncify_stop_unwind=Module["_asyncify_stop_unwind"]=Module["asm"]["X"]).apply(null,arguments)};var _asyncify_start_rewind=Module["_asyncify_start_rewind"]=function(){return(_asyncify_start_rewind=Module["_asyncify_start_rewind"]=Module["asm"]["Y"]).apply(null,arguments)};var _asyncify_stop_rewind=Module["_asyncify_stop_rewind"]=function(){return(_asyncify_stop_rewind=Module["_asyncify_stop_rewind"]=Module["asm"]["Z"]).apply(null,arguments)};var ___start_em_js=Module["___start_em_js"]=3856;var ___stop_em_js=Module["___stop_em_js"]=14120;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function callMain(args){var entryFunction=Module["_main"];var argc=0;var argv=0;try{var ret=entryFunction(argc,argv);exitJS(ret,true);return ret}catch(e){return handleException(e)}}function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(shouldRunNow)callMain(args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"])shouldRunNow=false;run();


  return r96_09_blit.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = r96_09_blit;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return r96_09_blit; });
else if (typeof exports === 'object')
  exports["r96_09_blit"] = r96_09_blit;
