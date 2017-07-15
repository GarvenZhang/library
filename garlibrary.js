(function (window) {
    window.gar={};
    var gar=window.gar;

    /**
     * Created by John Gorven on 2017/1/1.
     */
    var doc=document;

    /**
     * ajax
     * {
     *      url：<String>,
     *      method:<String>,
     *      sync:<Boolean>,
     *      data:<Object> / <String>,
     *      setHeaders:{
     *                    name:value
     *                  },
     *      fn:<Function>
     * }
     */
    gar.ajax=function(obj) {
        //create XMLHttp Obj
        var xhr=new XMLHttpRequest();
        //request cte
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    var resHeaders=xhr.getResponseHeader('Content-Type');
                    if(/json/.test(resHeaders))obj.fn(JSON.parse(xhr.responseText));
                    else obj.fn(xhr.responseText);
                }
                else throw new Error('Request was unsuccessful:'+xhr.status);
            }
        };
        //open
        xhr.open(obj.method, obj.url, !/false/.test(obj.sync) || true);
        //set Header
        if(obj.setHeaders){
            var headers = obj.setHeaders;
            for(var name in headers) xhr.setRequestHeader(name, headers[name]);
        }
        //send data
        xhr.send( JSON.stringify(obj.data) || null);
    };

    gar.addURLParam=function (url, name, val) {
        url+=(url.indexOf('?')?'?':'&');
        url+=encodeURIComponent(name)+'='+encodeURIComponent(val);
        return url;
    };

    gar.serialize=function (form) {
        var formEle = form.elements; eparts = [], field = null, i, len, j, optLen, option, optValue;
        for(i = 0, len = formEle.length; i < len; ++i){
            field = formEle[i];
            switch(field.type){
                case 'select-one':
                case 'select-multiple':
                    if(field.name.length){
                        for(j = 0, optLen = field.options.length; j < optLen; ++j){
                            option = field.options[j];
                            if(option.selected){
                                optValue = '';
                                if(option.hasAttribute) optValue = option.hasAttribute('value') ? option.value :option.text;
                                else optValue = option.attributes['value'].specified ? option.value : option.text;
                                parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
                            }
                        }
                    }
                    break;
                case undefined:
                case 'file':
                case 'submit':
                case 'reset':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if(!field.checked) break;
                default:
                    if(field.name.length) parts.push( encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value) );
            }
        }
        return parts.join('&');
    };

    gar.sumbitData=function (method, url, asynchronous, fn, formEle) {
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function () {
            if(xhr.readyState===4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status===304)fn();
                else console.info('REQUEST WAS UNSUCCESSFUL: '+xhr.status);
            }
        };
        xhr.open(method,url,asynchronous);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(this.serialize(formEle));
    };

    /**
     * EventUtil
     */
    gar.getEvent=function (e) {
        return e||window.event;
    };
    gar.getTarget=function (e) {
        return e.target||e.srcElement;
    };
    gar.getRelatedTarget=function (e) {
        if(e.relatedTarget)this.getRelatedTarget=function (e) {
            return e.relatedTarget;
        };
        //IE8 n' -
        else if(e.toElement)this.getRelatedTarget=function (e) {
            return e.toElement;
        };
        else if(e.fromElement)this.getRelatedTarget=function (e) {
            return e.fromElement;
        };
        else this.getRelatedTarget=function () {
                return null;
            };
        this.getRelatedTarget(e);
    };

    gar.preventDefault=function (e) {
        if(e.preventDefault)this.preventDefault=function (e) {
            e.preventDefault();
        };
        else this.preventDefault=function (e) {
            e.returnValue=true;
        };
        this.preventDefault(e);
    };

    gar.stopPropagation=function (e) {
        if(e.stopPropagation)this.stopPropagation=function (e) {
            e.stopPropagation();
        };
        else this.stopPropagation=function (e) {
            e.cancelBubble=true;
        };
        this.stopPropagation(e);
    };

    gar.addHandler=function (ele, type, handler,bubble) {
        if(ele.addEventListener) ele.addEventListener(type,handler,bubble);
        else if(ele.attachEvent)ele.attachEvent('on'+type,handler);
        else ele['on'+type]=handler;
    };

    gar.removeHandler=function (ele, type, handler, bubble) {
        if(ele.removeEventListener) ele.removeEventListener(type,handler,bubble);
        else if(ele.detachEvent) ele.detachEvent(type,handler,bubble);
        else ele['on'+type]=null;
    };

    gar.getCharCode=function (e) {  // aim to keypress only
        if(typeof e.charCode=='number')this.getCharCode=function (e) {
            return e.charCode;
        };
        else this.getCharCode=function (e) {
            return e.keyCode;
        };
        this.getCharCode(e);
    };

    //aim to mousedown n' mouseup
    gar.getButton=function (e) {
        if(doc.implementation.hasFeature('MouseEvents','2.0'))return e.button;
        else
        //IE8 n' -: change total 8 items(IE) to one of three(DOM)
            switch(e.button){
                case 0:case 1:case 3: case 5: case 7: return 0;
                case 2:case 6: return 1;
                case 4:return 2;
            }
    };
    gar.getWheelDelta=function (e) {
        //opear9.5-
        if(e.wheelDelta)return client.engine.opera&&client.engine.opera<9.5?-e.wheelDelta:e.wheelDelta;
        //FF
        else return -e.detail*40;
    };
    gar.imitClick=function (ele) {
        var event=doc.createEvent('MouseEvents');
        event.initMouseEvent('click',true,true,doc.defaultView,0,0,0,0,0,false,false,false,false,0,null);
        ele.dispatchEvent(event);
    };

    /**
     * getId
     */
    window.getEl=function(cssSelector) {
        return doc.querySelector(cssSelector);
    };
    window.getEls=function(cssSelector){
        return doc.querySelectorAll(cssSelector);
    };

    /**
     * check obj's type:Arguments,Array,Boolean,Date,Error,Function,JSON,Math,Number,Object,RegExp,String
     */
    gar.isType=function (obj,type) {
        return new RegExp(type.toLowerCase(),'i').test(Object.prototype.toString.call(obj));
    };

    /**
     * iterator:
     * 1.each:
     * 2.reverseEach:
     * 3.breakEach:
     */
    gar.each=function (obj, callback) {
        if(gar.isType(obj, 'nodelist')) obj=[].slice.call(obj);
        var val,i=-1,o,isArr=obj instanceof Array,l=obj.length;
        if(isArr)for(;o=obj[++i];)val=callback.call(o,i,o,l);
        else for(o in obj)val=callback.call(obj[o], ++i, obj[o], l, o);
        return obj;
    };
    gar.reverseEach=function (arr, callback) {
        for(var l=len =arr.length;l--;)callback(l,arr[l],len);
    };
    gar.breakEach=function (arr, callback) {
        for(var i =-1,o;o=arr[++i];)if(callback(i,o)===false)break;
    };
    /**
     * decode queryString
     */
    gar.getQueryStringArgs=function() {
        //remove first string '?'
        var qs=location.search.length>0?location.search.substring(1):'',
            //divide every name-value group
            items=qs.length?qs.split('&'):[],
            result={},
            item;
        for(var len=items.length;len--;){
            //devide name-value
            item=items[len-1].split('=');
            //name:item[0];value=item[1]
            if(decodeURIComponent(item[0]).length)result[decodeURIComponent(item[0])]=decodeURIComponent(item[1]);
        }
        return result;
    };

    /**
     * get element's offsetLeft or offsetTop
     */
    gar.getEleLeft=function (ele){
        var actualLeft=ele.offsetLeft,
            cur=ele.offsetParent;
        //sum target element's and its all parent's offsetLeft
        /* while(cur!==null){
         actualLeft+=cur.offsetLeft;
         cur=cur.offsetParent;
         }*/
        return actualLeft;
    };

    gar.getEleTop=function (ele){
        var actualTop=ele.offsetTop,
            cur=ele.offsetParent;
        /*while(cur!==null){
         actualTop+=cur.offsetTop;
         cur=cur.offsetParent;
         }*/
        return actualTop;
    };

    /**
     * get clientWidth n' clientHeight(<html> or <body>)
     */
    gar.getViewpoint=function () {
        //version of IE before IE7
        //attribute of doc.compatMode is not supported by lower Safari 3.1
        if(doc.compatMode=='BackCompat')
            return{
                width:doc.body.clientWidth,
                height:doc.body.clientHeight
            };
        else return{
            width:doc.documentElement.Width,
            height:doc.documentElement.clientHeight
        };
    };

    /**
     * get doc total height n' width
     */
    gar.getDocHeight=function (){
        //IE backCompat: doc.body
        return doc.compatMode=='CSS1Compat'?Math.max(doc.documentElement.scrollHeight,doc.documentElement.clientHeight):Math.max(doc.body.scrollHeight,doc.body.clientHeight);
    };
    gar.getDocWidth=function (){
        return doc.compatMode=='CSS1Compat'?Math.max(doc.documentElement.scrollWidth,doc.documentElement.clientWidth):Math.max(doc.body.scrollWidth,doc.body.clientWidth);
    };

    /**
     * scroll to top
     */
    gar.scrollToTo=function (ele){
        if(ele.scrollTop!=0)ele.scrollTop=0;
    };

    /**
     * get element's size
     */
    gar.getBoundingClientRect=function (ele){
        var scrollTop=doc.documentElement.scrollTop,
            scrollLeft=doc.documentElement.scrollLeft;
        //if ele.getBoundingClientRect() is supported
        if(ele.getBoundingClientRect){
            //when first using this function , we should define 'offset' manually
            //and later,it's not necessary to define it cause 'offset' belongs to this function
            if(typeof arguments.callee.offset!='number'){
                //create a temporary element to get 'offset=2' when running in IE8 n' -
                var temp=doc.createElement('div');
                temp.style.cssText='position:absolute;top:0;left:0;';
                doc.body.appendChild(temp);
                arguments.callee.offset=-temp.getBoundingClientRect().top-scrollTop;
                //clear
                doc.body.removeChild(temp);
                temp=null;
            }
            var rect=ele.getBoundingClientRect(),
                offset=arguments.callee.offset;
            return {
                left:rect.left+offset,
                right:rect.right+offest,
                top:rect.top+offset,
                bottom:rect.bottom+offset
            }
        }else {
            //generally,offsetWidth=right-left,offsetHeight=bottom-top,left=getEleLeft(),right=getEleTop()
            //-scrollLeft: in case of browser's window was scrolled when calling the function
            var actuallLeft=getEleLeft(ele),
                actuallTop=getEleTop(ele);
            return{
                left:actuallLeft-scrollLeft,
                right:actuallLeft+ele.offsetWidth-scrollLeft,
                top:actuallTop-scrollTop,
                bottom:actuallTop+ele.offsetHeight-scrollTop
            }
        }
    };

    /**
     * requestAnimationFrame ff4.0+ chrome IE10+,OP
     */
    if(!window.requestAnimationFrame)
        window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||
            window.oRequestAnimationFrame||window.msRequestAnimationFrame||
            function(callback){return window.setTimeout(callback,1000/60)};

    /**
     * addClass:hide&show
     */
    gar.addClass=function (eleOrObj,classname) {
        if(!eleOrObj.nodeType) {
            for (var className in eleOrObj)
                if (!new RegExp('\\b' + className + '\\b', 'gi').test(eleOrObj[className].className))
                    eleOrObj[className].className = eleOrObj[className].className.concat(' ' + className);
        } else if(!new RegExp('\\b'+classname+'\\b','gi').test(eleOrObj.className))
            eleOrObj.className=eleOrObj.className.concat(' '+classname);
    };
    gar.removeClass=function (eleOrObj,classname) {
        if(!eleOrObj.nodeType) {
            for (var className in eleOrObj)
                if(new RegExp('\\b'+className+'\\b','gi').test(eleOrObj[className].className))
                    eleOrObj[className].className=(''+eleOrObj[className].className+'').replace(className,'');
        } else if(new RegExp('\\b'+classname+'\\b','gi').test(eleOrObj.className))
            eleOrObj.className=(''+eleOrObj.className+'').replace(classname,'');
    };

    /**
     * get style
     */
    gar.getStyle=function(ele,css,pseudoEleInfo){
        if(doc.defaultView)this.getStyle=function (ele,css, pseudoEleInfo) {
            return document.defaultView.getComputedStyle(ele,pseudoEleInfo||null)[css];
        };
        else if(ele.currentStyle)this.getStyle=function (ele,css) {
            return ele.currentStyle[css];
        };
        return this.getStyle(ele, css, pseudoEleInfo);
    };

    /**
     * who attribute belongs to?
     */
    gar.propertyWhere=function (obj,name){
        if(obj.hasOwnProperty(name))return 'instance';
        else if (name in obj && !obj.hasOwnProperty(name))return 'prototype';
        else return false;
    };

    /**
     * add option into select
     * clear selectbox
     */
    gar.addOpt=function (selectbox,optTxt,optVal){
        selectbox.add(new Option(optTxt,optVal),undefined);
    };
    gar.clearSelectbox=function (selectbox){
        for(var i=selectbox.options.lenght;i--;)selectbox.remove(0);
    };

    /**
     * innerText:
     */
    gar.getInnerText=function (ele) {
        return (typeof ele.textContent =='string') ? ele.textContent:ele.innerText;
    };
    gar.setInnerText=function(ele,txt){
        return (typeof ele.textContent == 'string' ) ? ele.textContent=txt :　ele.innerText=txt;
    };
    gar.getOuterHTML=function (ele) {
        if(typeof ele.outerHTML == 'string')
            this.getOuterHTML=function (ele) {
                return ele.outerHTML;
            };
        else this.getOuterHTML=function (ele) {
                var div=doc.createElement('div');
                div.appendChild(ele.cloneNode(true));
                return div.innerHTML;
            };
        return this.getOuterHTML(ele);
    };
    /**
     * contains:
     */

    gar.contains=function (refNode, otherNode) {
        if( typeof refNode.contains == 'function' && (!client.engine.webkit || client.engine.webkit >= 522))
            this.contains=function (refNode, otherNode) {
                return refNode.contains(otherNode);
            };
        else if( typeof refNode.compareDocumentPosition == 'function')
            this.contains=function (refNode, otherNode) {
                return !! (refNode.compareDocumentPosition(otherNode) & 16);
            };
        else {
            this.contains=function (refNode, otherNode) {
                var node = otherNode.parentNode;
                do{
                    if(node == refNode)return true;
                    else node=node.parentNode;
                }while( node !== null );
                return false;
            }
        }
        return this.contains(refNode,otherNode);
    };

    /**
     * function throttle:ignore some requests based on time quantum for some cases where function is frequently called which brings about capability being decreased
     * aim to situation like these: 1.resize event 2.mousemove 3.update progress
     */
    gar.throttle=function (fn, interval) {
        var _self=fn,timer,firstTime=true;
        return function () {
            var args=arguments,_me=this;
            if(firstTime){
                _self.apply(_me,args);
                return firstTime=false;
            }
            if(timer)return false;
            timer=setTimeout(function () {
                clearTimeout(timer);
                timer=null;
                _self.apply(_me,args);
            },interval||500);
        };
    };

    /**
     * time sharing function:in some cases,we need to create thousands of node at a time but browser will suffer huge work leading to degrade performance
     */
    gar.timeChunk=function (ary, fn, count,interval) {
        var obj,t,len=ary.length,
            start=function () {
                for(var  i =0;i<Math.min(count||1,len);i++){
                    obj=ary.shift();
                    fn(obj);
                }
            };
        return function () {
            t=setInterval(function () {
                if(ary.length===0)return clearInterval(t);
                start();
            },interval);
        };
    };

    /**
     * currying function: receive some arguments but not calculate at once until this function is really needed
     */
    gar.currying=function (fn) {
        var args=[];
        return function () {
            if(arguments.length===0)return fn.apply(this,args);
            else {
                [].push.apply(args,arguments);
                return arguments.callee;
            }
        }
    };


    /**
     * jude object type: String ,Array , or Number
     */
    for(var i =0,type;type=['String','Array','Number'][i++];)
        (function (type) {
            gar['is'+type]=function (obj) {
                return Object.prototype.toString.call(obj)==='[Object'+type+']';
            }
        })(type);

    /**
     * cookie and subcookie:
     */
    gar.cookieUtil={
        get:function (name) {
            var cName=encodeURIComponent(name)+'=',
                cStart=doc.cookie.indexOf(cName),
                cVal=null;
            if(cStart>-1){
                var cEnd=doc.cookie.indexOf(';',cStart);
                if(cEnd===-1)cEnd=doc.cookie.length;
                cVal=decodeURIComponent(doc.cookie.substring(cStart+cName.length,cEnd));
            }
            return cVal;
        },
        set:function (name, val, expires, path, domain, secure) {
            var cTxt=encodeURIComponent(name)+'='+encodeURIComponent(val);
            if(expires instanceof Date)cTxt+=';expires='+expires.toGMTString();
            if(path)cTxt+=';path='+path;
            if(domain)cTxt+=';domain='+domain;
            if(secure)cTxt+=';secure';
            doc.cookie=cTxt;
        },
        unset:function (name, path, domain, secure) {
            this.set(name,'',new Date(0),path,domain,secure);
        }
    };
    gar.subCookieUtil={
        get:function (name, subName) {
            var subCookies=this.getAll(name);
            if(subCookies)return subCookies[subName];
            else return null;
        },
        getAll:function (name) {
            var cN=encodeURIComponent(name)+'=',
                cStart=doc.cookie.indexOf(cN),
                cVal=null,
                cEnd,subCookie,i,parts,result={};
            if(cStart>-1){
                cEnd=doc.cookie.indexOf(';',cStart);
                if(cEnd===-1)cEnd=doc.cookie.length;
                cVal=doc.cookie.substring(cStart+cN.length,cEnd);
                if(cVal.length>0){
                    subCookie=cVal.split('&');
                    for(i=0;subCookie[i];i++){
                        parts=subCookie[i].split('=');
                        result[decodeURIComponent(parts[0])]=decodeURIComponent(parts[1]);
                    }
                    return result;
                }
            }
            return null;
        },
        set:function (name, subName, val, expires, path, domain, secure) {
            var subCookies=this.getAll(name)||{};
            subCookies[subName]=val;
            this.setAll(name,subName,val,expires,path,domain,secure);
        },
        setAll:function (name, subCookies, expires, path, domain, secure) {
            var cTxt=encodeURIComponent(name)+'=',
                subCookieParts=new Array(),
                subName;
            for(subName in subCookies)
                if(subName.length>0&&subCookies.hasOwnProperty(subName))
                    subCookieParts.push(encodeURIComponent(subName)+'='+encodeURIComponent(subCookies[subName]));
            if(subCookieParts.length>0){
                cTxt+=subCookieParts.join('&');
                if(expires instanceof Data)cTxt+=';expires='+expires.toGMTString();
                if(path)cTxt+=';path='+path;
                if(domain)cTxt+=';domain='+domain;
                if(secure)cTxt+=';secure';
            }else cTxt+=';expires='+(new Date(0)).toGMTString();
            doc.cookie=cTxt;
        },
        unset:function (name, subName, path, domain, secure) {
            var subcookies=this.getAll(name);
            if(subcookies){
                delete subcookies[subName];
                this.setAll(name,subcookies,null,path,domain,secure);
            }
        },
        unsetAll:function (name, path, domain, secure) {
            this.setAll(name,null,new Date(0),path,domain,secure);
        }
    };

    /**
     * localStorage : a version of being compatible to those browsers that only support globalStorage
     */
    gar.getLocalStorage=function () {
        if(typeof localStorage=='object')this.getLocalStorage=function () {return localStorage;};
        else if(typeof globalStorage=='object')this.getLocalStorage=function () {return globalStorage[localhost.host];};
        else throw new Error('Local storage not available!');
        return this.getLocalStorage();
    };

    /**
     * get Full screen width&height
     */
    gar.getFullPageWH=function (wOrh) {
        var pageWidth=doc.innerWidth,pageHeight=doc.innerHeight;
        if(typeof pageWidth!='number'){
            if(doc.compatMode=='CSS1Compat'){
                pageWidth=doc.documentElement.clientWidth;
                pageHeight=doc.documentElement.clientHeight;
            }else{
                pageWidth=doc.body.clientWidth;
                pageHeight=doc.body.clientHeight;
            }
        }
        if(wOrh=='w') return pageWidth;
        else return pageHeight;
    };
    /**
     * get an element's sum height:margin+padding+content
     */
    gar.getEleSumH=function (ele) {
        return ele.offsetTop+ele.offsetHeight+(parseInt(gar.getStyle(ele,'marginBottom'))?parseInt(gar.getStyle(ele,'marginBottom')):0)
    };
    /**
     * parasitic combination inheritance:
     */
    gar.inheritPrototype=function (subType, supType) {
        var _pro=(function (pro) {
            function F(){}
            F.prototype=pro;
            return new F();
        })(supType.prototype);
        _pro.constructor=subType;
        subType.prototype=_pro;
    };

    /**
     * form script:
     */
    gar.getSelectionTxt=function (txtbox) {
        if(typeof (txtbox.selectionStart) == 'number')this.getSelectionTxt = function (txtbox) {
            return txtbox.value.substring(txtbox.selectionStart,txtbox.selectionEnd);
        };
        else if(document.selection)this.getSelectionTxt = function (txtbox) {
            return document.selection.createRange().text;
        };
        return this.getSelectionTxt(txtbox);
    };

    /* ===================================================== change native javascript object ============================================================================ */
    Function.fn=Function.prototype;
    /**
     * bind: compatible with old version browser
     */
    if(!Function.fn.bind){
        Function.fn.bind=function (obj) {
            var slice=[].slice,
                args=slice.call(arguments,1),
                self=this,
                nop=function () {},
                bound=function () {
                    return self.apply(this instanceof nop?this:(obj||{}),args.concat(slice.call(arguments)));
                };
            nop.prototype=self.prototype;
            bound.prototype=new nop();
            return bound;
        };
    }

    /**
     * detect plugins:
     */
    gar.hasPlugin=function (name) {
        var name=name.toLowerCase();
        for(var np=navigator.plugins,l=np.length;l--;)
            if(np[l].name.toLowerCase().indexOf(name)>-1)
                return true;
        return false;
    };
    gar.hasIEplugin=function (name) {
        try{
            new ActiveXObject(name);
            return true;
        }catch(ex){
            return false;
        }
    };
    gar.hasFlash=function () {
        var result=gar.hasPlugin('Flash');
        if(!result)result=gar.hasIEplugin('ShockwaveFlash.ShockwaveFlash');
        return result;
    };

    /**
     * ability detect:
     */
    gar.isHostMethod=function (obj, property) {
        var t=typeof obj[property];
        return t=='function'||(!!(t=='object'&&obj[property]))||t=='unknown';
    };
    gar.isDOM1=function () {
        return this.isDOM1=!!(doc.getElementById&&doc.createElement&&doc.getElementsByTagName);
    };

    /**
     * File Reader:
     */
    gar.blobSlice=function (blob, startByte, length) {
        if(blob.slice)this.blobSlice=function (blob, startByte, length) {
            return blob.slice(startByte,length);
        };
        else if(blob.webkitSlice)this.blobSlice=function (blob, startByte, length) {
            return blob.webkitSlice(startByte,length);
        };
        else if(blob.mozSlice)this.blobSlice=function (blob, startByte, length) {
            return blob.mozSlice(startByte,length);
        };
        else this.blobSlice=function () {
                return null;
            };
        return this.blobSlice(blob,startByte,length);
    };
    gar.createObjURL=function (blob) {
        if(window.URL)this.createObjURL=function (blob) {
            return window.URL.createObjectURL(blob);
        };
        else if(window.webkitURL)this.createObjURL=function (blob) {
            return window.webkitURL.createObjectURL(blob);
        };
        else this.createObjURL=function () {
                return null;
            };
        return this.createObjURL(blob);
    };
    gar.revokeObjURL=function (url) {
        if(window.URL)this.revokeObjURL=function (url) {
            window.URL.revokeObject(url);
        };
        else if(window.webkitURL)this.revokeObjURL=function (url) {
            window.webkitURL.revokeObject(url);
        };
        return this.revokeObjURL(url);
    };
    /**
     * for security:
     */
    gar.preventIframe=function () {
        if(top.location!=self.location)top.location=self.location;
    };

    /**
     * canvas：
     */
    gar.createRectLinearGradient=function (ctx, x, y, w, h) {
        return ctx.createLinearGradient(x,y,x+w,y+h);
    };

    /**
     * browser detect:
     * @return <Object>{
     *      engine:engine,
            browser:browser,
            system:system
     * }
     */
    gar.browserDetect=function (fn) {
        //default data
        var engine={
                x5:0,
                opera:0,
                webkit:0,
                khtml:0,
                gecko:0,
                ie:0,
                ver:null
            },
            browser={
                opera:0,
                safari:0,
                chrome:0,
                konq:0,
                firefox:0,
                ie:0,
                ver:null
            },
            system={
                win:false,
                mac:false,
                x11:false,
                //mobile
                iphone:false,
                ipod:false,
                ipad:false,
                ios:false,

                android:false,
                nokiaN:false,
                winMobile:false,

                //game system
                wii:false,
                ps:false
            },
            ua=navigator.userAgent,
            p=navigator.platform;

        //detect engine n' browser
        if(/micromessenger/i.test(ua))engine.x5=true;
        else if(window.opera){
            engine.ver=browser.ver=window.opera.version();
            engine.opera=browser.opera=parseFloat(engine.ver);
        }else if(/AppleWebKit\/(\S+)/.test(ua)){
            engine.ver=RegExp['$1'];
            engine.webkit=parseFloat(engine.ver);
            if(/Chrome\/(\S+)/.test(ua)){
                browser.ver=RegExp['$1'];
                browser.chrome=parseFloat(browser.ver);
            }else if(/version\/(\S+)/.test(ua)){
                browser.ver=RegExp['$1'];
                browser.safari=parseFloat(browser.ver);
            }else{
                var safariVersion=1;
                if(engine.webkit<100)safariVersion=1;
                else if(engine.webkit<312)safariVersion=1.2;
                else if(engine.webkit<412)safariVersion=1.3;
                else safariVersion=2;
                browser.safari=browser.ver=safariVersion;
            }
        }else if(/KHTML\/(\S+)/.test(ua)||/Konqueror\/([^;]+)/.test(ua)){
            engine.ver=browser.ver=RegExp['$1'];
            engine.khtml=browser.konq=parseFloat(engine.ver);
        }else if(/rv:([^/]+)\) Gecko\/\d{8}/.test(ua)){
            engine.ver=RegExp['$1'];
            engine.gecko=parseFloat(engine.ver);
            if(/Firefox\/(\S+)/.test(ua)){
                browser.ver=RegExp['$1'];
                browser.firefox=parseFloat(browser.ver);
            }
        }else if(/MSIE ([^;]+)/.test(ua)){
            engine.ver=browser.ver=RegExp['$1'];
            engine.ie=browser.ie=parseFloat(engine.ver);
        }

        //detect client system
        if(p.indexOf('Win')===0)
            if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                if (RegExp['$1'] === 'NT') {
                    switch (RegExp['$2']) {
                        case '5.0':
                            system.win = '2000';
                            break;
                        case '5.1':
                            system.win = 'XP';
                            break;
                        case '6.0':
                            system.win = 'Vista';
                            break;
                        case '6.1':
                            system.win = '7';
                            break;
                        default:
                            system.win = 'NT';
                            break;
                    }
                }
                else if (RegExp['$1'] === '9x')system.win = 'ME';
                else system.win = RegExp['$1'];
            }
            else if(p.indexOf('Mac')===0)system.mac=true;
            else if(p.indexOf('x11')===0||p.indexOf('Linux')===0)system.x11=true;

        //detect mobile
        if(ua.indexOf('iPhone')>-1){
            system.iphone=true;
            if(system.mac&&ua.indexOf('Mobile')>-1){
                if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua))system.ios=parseFloat(RegExp.$1.replace('_','.'));
                else system.ios=2;
            }
        }
        else if(/Android (\d+\.\d+)/.test(ua))system.android=parseFloat(RegExp['$1']);
        else if(ua.indexOf('iPod')>-1)system.ipod=true;
        else if(ua.indexOf('iPad')>-1)system.ipod=true;
        else if(system.win==='CE')system.winMobile=system.win;
        else if(system.win==='Ph'){
            if(/Windows Phone OS (\d+\.\d+)/.test(ua)){
                system.win='Phone';
                system.winMobile=parseFloat(RegExp['$1']);
            }
        }
        else if(ua.indexOf('NokiaN')>-1)system.nokiaN=true;

        //detect game system
        if(ua.indexOf('Wii')>-1)system.wii=true;
        else if(/playstation/i.test(ua))system.ps=true;

        //do something
        if(fn)
            if(engine.webkit){
                if(browser.chrome)fn.chrome.call(this);
                else if(browser.safari)fn.safari.call(this);
            }else if(engine.gecko){
                if(browser.firefox)fn.firefox.call(this);
                else fn.otherGecko.call(this);
            }else if(browser.ie) fn.ie.call(this);
            else if(browser.opera)fn.opera.call(this);
            else if(browser.konq)fn.konq.call(this);


        return {
            engine:engine,
            browser:browser,
            system:system
        }
    };

    /**
     * touch trace: aim to x5
     */
    gar.touchTrace=function (browser) {
        if(browser){
            var _y=0,
                handler=function (e) {
                    var e=gar.getEvent(e);
                    if(e.touches.lengt===1){
                        switch (e.type){
                            case 'touchstart':_y=e.touches[0].clientY;break;
                            case 'touchmove': if(e.touches[0].clientY-_y>50)return 'load';
                            case 'touchend':
                                gar.removeHandler(doc,'touchstart',handler,false);
                                gar.removeHandler(doc,'touchmove',handler,false);
                                gar.removeHandler(doc,'touchend',handler,false);
                        }
                    }
                };
            gar.addHandler(doc,'touchstart',handler,false);
            gar.addHandler(doc,'touchmove',handler,false);
            gar.addHandler(doc,'touchend',handler,false);
        }
        return handler;
    };


    /**
     * only one orientation for mobile web:
     */
    gar.isProtrait=function (landscapeFunc,back2ProtraitFunc) {
        if(typeof window.orientation ==='number'){
            if(window.orientation!==0)landscapeFunc();
            gar.addHandler(window,'orientationchange',function () {
                if(window.orientation!==0)landscapeFunc();
                else back2ProtraitFunc();
            },false);
        } else {
            var _init=gar.getFullPageWH('w'),lastTime;
            gar.addHandler(window,'resize',function () {
                var thisTime=gar.getFullPageWH('w');
                if(thisTime!==_init)gar.throttle(landscapeFunc);
                else if(lastTime&&lastTime!=_init&&_init===thisTime)back2ProtraitFunc();
                lastTime=thisTime;
            },false);
        }
    };

    /**
     * form validate strategies
     */
    gar.formValidateStrategies={
        isEmpty:function (val,errorMsg) {
            if(val==='')return errorMsg;
        },
        minLen:function (val, len, errorMsg) {
            if(val.length<len)return errorMsg;
        },
        maxLen:function (val,len,errorMsg) {
            if(val.length>len)return errorMsg;
        },
        onlyLen: function (val, len, errorMsg) {
              if(val.length != len) return errorMsg;
        },
        limitedNum: function (val, len, errorMsg) {
            var min = len.split('-')[0], max = len.split('-')[1], val = val[0] === '0' ? val.substring(1) : val;
            if(! (parseFloat(val) <= parseFloat(max) && parseFloat(val) >= parseFloat(min) ) ) return errorMsg;
        },
        isMobile:function (val, errorMsg) {
            if(!/^1(3|4|5|8)[0-9]{9}$/.test(val))return errorMsg;
        },
        isMail:function (val, errorMsg) {
            if(!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)) return errorMsg;
        },
        onlyNum:function (val, errorMsg) {
            if(!/^\d+$/.test(val))return errorMsg;
        },
        illegalInp:function (val,errorMsg) {    //   ~!@#$%^&*();<>/' --
            if(/([~!@#$%^&*();<>/']+|(--)+)/i.test(val))return errorMsg;
        },
        confirmPwd:function (newVal, oldVal, errorMsg) {
            if(/md5-/.test(newVal)){
                oldVal=md5(oldVal);
                newVal=newVal.slice(4);
            }
            if(oldVal !== newVal)return errorMsg;
        },
        singleSelect: function (value, errorMsg) {
            /*for(var arr = Array.prototype.slice.call(dom, 0), l = arr.length, i = 0; l--; ){
                if(arr[l].checked) ++i;
            }
            if(i !== 1) return errorMsg;*/
            if(!value) return errorMsg;
        }
    };

    /**
     * implement AOP: pick up some unrelated function form core profession logic module and add to which again by the way of dynamically appending
     */
    Function.fn.before=function (beforefn) {
        var _self=this;
        return function () {
            beforefn.apply(this,arguments);
            return _self.apply(this,arguments);
        };
    };
    Function.fn.after=function (afterfn) {
        var _self=this;
        return function () {
            var ret =_self.apply(this,arguments);
            afterfn.apply(this,arguments);
            return ret;
        }
    };

    /* ===================================================== data structure ============================================================================ */

    /**
     * List
     */
    gar.List=function () {
        this.listSize=0;
        this.pos=0;
        this.dataStore=[];
    };

    gar.List.prototype={
        constructor:gar.List,
        append:function (ele) {
            this.dataStore[this.listSize++]=ele;
        },
        find:function (ele) {
            for(var l=this.dataStore.length;l--;)
                if(this.dataStore[l]==ele)
                    return l;
            return -1;
        },
        remove:function (ele) {
            var foundAt=this.find(ele);
            if(foundAt<-1){
                this.dataStore.splice(foundAt,1);
                --this.listSize;
                return true;
            }
            return false;
        },
        length:function () {
            return this.listSize;
        },
        toString:function () {
            return this.dataStore;
        },
        insert:function (ele, after) {
            var insertPos=this.find(after);
            if(insertPos>-1){
                this.dataStore.splice(insertPos+1,0,ele);
                ++this.listSize;
                return true;
            }
            return false;
        },
        clear:function () {
            delete this.dataStore;
            this.dataStore=[];
            this.listSize=this.pos=0;
        },
        contains:function (ele) {
            for(var l=this.dataStore.length;l--;)
                if(this.dataStore[l]==ele)
                    return true;
            return false;
        },
        front:function () {
            this.pos=0;
        },
        end:function () {
            this.pos=this.listSize-1;
        },
        prev:function () {
            if(this.pos>0)--this.pos;
        },
        next:function () {
            if(this.pos<this.listSize-1)++this.pos;
        },
        currPos:function () {
            return this.pos;
        },
        moveTo:function(pos){
            this.pos=pos;
        },
        getEle:function () {
            return this.dataStore[this.pos];
        }
    };

    /**
     * Stack
     */
    gar.Stack=function () {
        this.dataStore=[];
        this.top=0;
    };
    gar.Stack.prototype={
        constructor:gar.Stack,
        push:function (ele) {
            this.dataStore[this.top++]=ele;
        },
        pop:function () {
            return this.dataStore[--this.top];
        },
        peek:function () {
            return this.dataStore[this.top-1];
        },
        length:function () {
            return this.top;
        },
        clear:function () {
            this.top=0;
        }
    };

    /**
     * Queue:
     */
    gar.Queue=function () {
        this.dataStore=[];
    };
    gar.Queue.prototype={
        constructor:gar.Queue,
        enqueue:function (ele) {
            this.dataStore.push(ele);
        },
        dequeue:function () {
            return this.dataStore.shift();
        },
        front:function () {
            return this.dataStore[0];
        },
        back:function () {
            return this.dataStore[this.dataStore.length-1];
        },
        toString:function () {
            var retStr='';
            for(var i =0 ,l =this.dataStore.length;i<l;i++)retStr+=this.dataStore[i]+'\n';
            return retStr;
        },
        empty:function () {
            if(this.dataStore.length===0)return true;
            return false;
        },
        count:function () {
            return this.dataStore.length;
        }
    };

    /*
     * LinkedList：
     */
    //LList
    gar.SingleNode=function(ele){
        this.ele=ele;
        this.next=null;
    };
    gar.LList=function(){
        this.head=new gar.SingleNode('head');
    };
    gar.LList.prototype={
        constructor:gar.LList,
        find:function(item){
            var curN=this.head;
            while(curN.ele!=item)curN=curN.next;
            return curN;
        },
        insert:function(newEle,item){
            var newN=new gar.SingleNode(newEle),
                cur=this.find('item');
            newN.next=cur.next;
            cur.next=newN;
        },
        display:function(fn){
            var curN=this.head;
            while(!(curN.next==null)){
                fn(curN.next.ele);
                curN=curN.next;
            }
        },
        findPrev:function(item){
            var curN=this.head;
            while(!(curN.next==null)&&(curN.next.ele!=item))curN=curN.next;
            return curN;
        },
        remove:function(item){
            var prevN=this.findPrev(item);
            if(!(prevN.next==null)){
                prevN.next=prevN.next.next;
                item.next=null;
            }
        }
    };

    //loopList:
    gar.loopList=function () {
        gar.LList.call(this);
        this.head.next=this.head;
    };

    gar.loopList.prototype=new gar.LList();
    var garLL$$=gar.loopList;
    garLL$$.fn=gar.loopList.prototype;
    garLL$$.fn.constructor=gar.loopList;

    garLL$$.fn.display=function (fn) {
        var curN=this.head;
        while(!(curN.next==null)&&!(curN.next.ele=='head')){
            fn(curN.next.ele);
            curN=curN.next;
        }
    };

    //DbList:
    gar.DbNode=function(ele){
        this.ele=ele;
        this.prev=null;
        this.next=null;
    };
    gar.DbLList=function(){
        this.head=new gar.DbNode('head');
    };
    gar.DbLList.prototype={
        constructor:gar.DbNode,
        find:function(item){
            var curN=this.head;
            while(curN.ele!=item)curN=curN.next;
            return curN;
        },
        display:function(fn){
            var curN=this.head;
            while(!(curN.next==null)){
                fn(curN.next.ele);
                curN=curN.next;
            }
        },
        insert:function(newEle,item){
            var newN=new DbNode(newEle),
                cur=this.find(item);
            newN.next=cur.next;
            newN.prev=cur;
            cur.next.prev=newN;
            cur.next=newN;
        },
        remove:function(item){
            var curN=this.find(item);
            if(!(curN.next==null)){
                curN.next.prev=curN.prev;
                curN.prev.next=curN.next;
                curN.prev=curN.next=null;
            }
        },
        findLast:function(){
            var curN=this.head;
            while(!(curN.next==null))curN=curN.next;
            return curN;
        },
        dispReverse:function(fn){
            var lastN=this.findLast;
            while(!(curN.prev==null)){
                fn(curN);
                curN=curN.prev;
            }
        }
    };

    /**
     * Dictionary:
     */
    gar.Dictionary=function (dic) {
        this.dataStore=dic||{};
    };
    gar.Dictionary.prototype={
        constructor:gar.Dictionary,
        add:function (key, val) {
            this.dataStore[key]=val;
        },
        find:function (key) {
            return this.dataStore[key];
        },
        remove:function (key) {
            delete this.dataStore[key];
        },
        showAll:function (fn) {
            for(var key in Object.keys(this.dataStore).sort())fn(key,this.dataStore[key]);
        },
        count:function () {
            var n=0;
            for(var key in Object.keys(this.dataStore))++n;
            return n;
        },
        clear:function () {
            for(var key in Object.keys(this.dataStore))delete this.dataStore[key];
        }
    };

    /**
     * HashTable:
     */
    gar.HashTable=function (arrLen) {
        this.table=new Array(arrLen);
    };
    gar.HashTable.prototype={
        constructor:gar.HashTable,
        //data instanceof String
        HornerHash:function (str) {
            for(var H=37,total=0,l=str.length;l--;)total+=H*total+str.charCodeAt(l);
            total%=this.table.length;
            if(total<0)total+=this.table.length-1;
            return parseInt(total);
        },
        //data instanceof Integer
        setIntKeyData:function (arr, nLength,min,max) {
            for(var l=arr.length,num='';l--;){
                for(var i=nLength;i--;)num+=Math.random()*nLength>>>0;
                num+=min+Math.random()*(max-min+1)|0;
                arr[l]=num;
            }
        }
    };

//chain address method
    gar.chainAddr=function (arrLen) {
        gar.HashTable.call(this,arrLen);
        for(var l=arrLen;l--;)this.table[l]=new Array();
    };

    gar.inheritPrototype(gar.chainAddr,gar.HashTable);
    var garCA$$=gar.chainAddr;
    garCA$$.fn=gar.chainAddr.prototype;

    garCA$$.fn.put=function (key, data) {
        var pos=this.HornerHash(key),index=0,t=this.table;
        while(t[pos][index]!=undefined)index+=2;
        t[pos][index]=key;
        t[pos][index+1]=data;
    };
    garCA$$.fn.get=function (key) {
        var index=0,pos=this.HornerHash(key),t=this.table;
        while(t[pos][index]!=key){
            index+=2;
            if(t[pos][index]===undefined)return undefined;
        }
        return t[pos][index];
    };


//linear probing method:
    gar.lineProb=function (arrL) {
        gar.HashTable.call(this,arrL);
        this.vals=[];
    };

    gar.inheritPrototype(gar.lineProb,gar.HashTable);
    var garLP$$=gar.lineProb;
    garLP$$.fn=garLP$$.prototype;

    garLP$$.fn.put=function (key, data) {
        var pos=this.HornerHash(key),t=this.table,v=this.vals;
        if(t[pos]===undefined){
            t[pos]=key;
            v[pos]=data;
        }else{
            while(t[pos]!=undefined)++pos;
            t[pos]=key;
            v[pos]=data;
        }
    };
    garLP$$.fn.get=function (key) {
        var hash=-1;
        hash=this.HornerHash(key);
        if(hash>-1)
            for(var i =hash;this.table[hash]!=undefined;i++)
                if(this.table[hash]===key)
                    return this.vals[hash];
        return undefined;
    };

    /**
     * Set:
     */    gar.Set=function () {
        this.dataStore=[];
    };
    gar.Set.prototype={
        constructor:gar.Set,
        add:function (data) {
            if(this.dataStore.indexOf(data)<0){
                this.dataStore.push(data);
                return true;
            }else return false;
        },
        remove:function (data) {
            var pos=this.dataStore.indexOf(data);
            if(pos>-1){
                this.dataStore.splice(pos,1);
                return true;
            }else return false;
        },
        size:function () {
            return this.dataStore.length;
        },
        show:function () {
            return this.dataStore;
        },
        contains:function (data) {
            if(this.dataStore.indexOf(data)>-1)return true;
            else return false;
        },
        union:function (set) {
            for(var tmpSet=new gar.Set(),d=this.dataStore,l=d.length;l--;)tmpSet.add(d[l]);
            for(var sD=set.dataStore,sL=sD.length;sL--;)
                if(!tmpSet.contains(sD[sL]))
                    tmpSet.dataStore.push(sD[sL]);
            return tmpSet;
        },
        intersect:function (set) {
            var tmpSet=new gar.Set();
            for(var d=this.dataStore,l=d.length;l--;)
                if(set.contains(d[l]))
                    tmpSet.dataStore.push(d[l]);
            return tmpSet;
        },
        subset:function (set) {
            if(this.size()>set.size())return false;
            for(var member in this.dataStore)
                if(!set.contains(member))
                    return false;
            return true;
        },
        difference:function (set) {
            for(var tmpSet=new gar.Set(),d=this.dataStore,l=d.length;l--;)
                if(!set.contains(d[l]))
                    tmpSet.add(d[l]);
            return tmpSet;
        }
    };

    /**
     * BST:
     */
    gar.BSTNode=function (data, left, right) {
        this.data=data;
        this.left=left;
        this.right=right;
        this.show=BSTNode$$show;
    };
    var BSTNode$$show=function () {
        return this.data;
    };

    gar.BST=function () {
        this.root=null;
    };
    gar.BST.prototype={
        constructor:gar.BST,
        insert:function (data) {
            var n=new gar.BSTNode(data,null,null);
            if(this.root===null)this.root=n;
            else{
                var cur=this.root,parent;
                while(true){
                    parent=cur;
                    if(data<cur.data){
                        cur=cur.left;
                        if(cur===null){
                            parent.left=n;
                            break;
                        }
                    }else{
                        cur=cur.right;
                        if(cur===null){
                            parent.right=n;
                            break;
                        }
                    }
                }
            }
        },
        inOrder:function (node, fn) {
            if(!(node===null)){
                arguments.callee(node.left);
                fn(node.show());
                arguments.callee(node.right);
            }
        },
        preOrder:function (node, fn) {
            if(!(node===null)){
                fn(node.show());
                arguments.callee(node.left);
                arguments.callee(node.right);
            }
        },
        postOrder:function (node,fn) {
            if(!(node===null)){
                arguments.callee(node.left);
                arguments.callee(node.right);
                fn(node.show());
            }
        },
        getMin:function (node) {
            var cur=node||this.root;
            while(!(cur.left===null))cur=cur.left;
            return cur.data;
        },
        getMax:function (node) {
            var cur=node||this.root;
            while(!(cur.right===null))cur=cur.right;
            return cur.data;
        },
        find:function (data) {
            var cur=this.root;
            while(cur!==null){
                if(data===cur.data)return cur;
                else if(data<cur.data)cur=cur.left;
                else cur=cur.right;
            }
            return null;
        },
        removeNode:function(node,data){
            if(node===null)return null;
            if(data===node.data){
                if(node.left===null&&node.right===null)return null;
                if(node.left===null)return node.right;
                if(node.right===null)return node.left;
                var tmpNode=this.getMin(node.right);
                node.data=tmpNode.data;
                node.right=arguments.callee(node.right,tmpNode.data);
                return node;
            }else if(data<node.data){
                node.left=arguments.callee(node.left,data);
                return node;
            }else{
                node.right=arguments.callee(node.right,data);
                return node;
            }
        },
        remove:function (data) {
            this.root=this.removeNode(this.root,data);
        }
    };

    //for count:
    gar.BSTNode4C=function (data,left,right) {
        gar.BSTNode.apply(this,arguments);
        this.count=1;
    };
    gar.BST4C=function () {
        gar.BST.call(this);
    };
    gar.inheritPrototype(gar.BST4C,gar.BST);
    gar.BST4C.prototype.update=function (data) {
        var d=this.find(data);
        ++d.count;
        return d;
    };

    /**
     * sort algorithm:
     */
    gar.swap=function (arr, index1, index2) {
        arr[index1]=[arr[index2],arr[index2]=arr[index1]][0];
    };
    gar.bubbleSort=function (arr) {
        var i =arr.length-1,pos,j;
        while(i){
            pos=0;
            for(j=0;j<i;j++)
                if(arr[j]>arr[j+1]){
                    this.swap(arr,j,j+1);
                    pos=j;
                }
            i=pos;
        }
        return arr;
    };
    gar.selectionSort=function (arr) {
        for(var min,outer=0,lO=arr.length-2,lI=arr.length-1;outer<=lO;++outer){
            min=outer;
            for(var inner=outer+1;inner<=lI;++inner){
                if(arr[inner]<arr[min])min=inner;
                this.swap(arr,outer,min);
            }
        }
    };
    gar.insertionSort=function (arr) {
        var tmp,inner,l=arr.length;
        for(var outer=1;outer<=l-1;outer++){
            tmp=arr[outer];
            inner=outer;
            while(inner>0&&(arr[inner-1]>=tmp)){
                arr[inner]=arr[inner-1];
                --inner;
            }
            arr[inner]=tmp;
        }
    };
    gar.mergeSort=function (arr) {
        var merge=function (l, r) {
            var result=[];
            while(l.length&&r.length){
                if(l[0]<=r[0])result.push(l.shift());
                else result.push(r.shift());
            }
            while(l.length)result.push(l.shift());
            while(r.length)result.push(r.shift());
            return result;
        };
        return function () {
            var len =arr.length;
            if(len<2)return arr;
            var mid=len>>1,
                l=arr.slice(0,mid),
                r=arr.slice(mid);
            return merge(l,r);
        }
    };
    gar.shellSort=function (arr) {
        var l =arr.length,
            tmp,
            gap=l>>1;
        while(gap!==0){
            for(var i =gap;i<l;++i){
                tmp=arr[i];
                for(var j =i-gap;j>=0&&tmp<arr[j];j-=gap)arr[j+gap]=arr[j];
                arr[j+gap]=temp;
            }
            gap=l>>1;
        }
    };
    gar.heapSort=function (array) {
        var heapify=function (arr, x, len) {
            if (Object.prototype.toString.call(arr).slice(8, -1) === 'Array' && typeof x === 'number') {
                var l = 2 * x + 1, r = 2 * x + 2, largest = x, temp;
                if (l < len && arr[l] > arr[largest]) {
                    largest = l;
                }
                if (r < len && arr[r] > arr[largest]) {
                    largest = r;
                }
                if (largest != x) {
                    temp = arr[x];
                    arr[x] = arr[largest];
                    arr[largest] = temp;
                    heapify(arr, largest, len);
                }
            } else {
                return 'arr is not an Array or x is not a number!';
            }
        };
        return function (array) {
            if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
                //create heap
                var heapSize = array.length, temp;
                for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
                    heapify(array, i, heapSize);
                }
                //heap sort
                for (var j = heapSize - 1; j >= 1; j--) {
                    temp = array[0];
                    array[0] = array[j];
                    array[j] = temp;
                    heapify(array, 0, --heapSize);
                }
                return array;
            } else {
                return 'array is not an Array!';
            }
        }
    };
    /**
     * search algorithm:
     * precondition:arr must be sorted
     */
    gar.binarySearch=function (arr, dest, start, end) {
        var start=start||0,end=end||arr.length-1,mid,ele;
        while(start<=end){
            mid=(start+end)>>1;
            ele=arr[mid];
            if(ele<dest)low=mid+1;
            else if(ele>dest)high=mid-1;
            else return mid;
        }
        return -1;
    };

    /**
     * Duff Device:when length is far big
     */
    gar.duffDevice=function (data,fn) {
        var iterations=data.length>>3,
            leftover=data.length%8,
            i=0;
        if(leftover){
            do fn(data[i++]);while(--leftover)
        }
        do{
            fn(data[i++]);fn(data[i++]);fn(data[i++]);fn(data[i++]);fn(data[i++]);fn(data[i++]);fn(data[i++]);fn(data[i++]);
        }while(--iterations);
    };

    /**
     * motion function:
     */
    gar.easeOut=function(ele,css,destination,extent) {

        var speed,
            eleCss,
            distance;

        //ensure only one timer is working
        if(ele.timer)clearInterval(ele.timer);

        ele.timer=setInterval(function () {
            distance=destination-eleCss;

            eleCss=parseInt(ele.style[css]);

            //ensure that speed will not be equal to zero -->positive number: up,negative number: down
            speed=distance>0?Math.ceil((distance)/extent):Math.floor((distance)/extent);

            if(destination!==eleCss)ele.style[css]=eleCss+speed+'px';
            else clearInterval(ele.timer);

        },17);
    };

    /**
     * component library
     */
    gar.component={};

})(window);

