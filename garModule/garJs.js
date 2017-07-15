/**
 * Created by John Gorven on 2017/2/10.
 */
/**
 * component name:form validate
 */
!(function ($) {
    $.validator4F=function () {this.cache=[];};
    var fn=$.validator4F.prototype;
    fn.add=function (dom,rule,errorMsg) {
        var ary=rule.split(':');
        this.cache.push(function () {
            var strategy=ary.shift();
            ary.unshift( (gar.isType(dom, 'nodelist') || gar.isType(dom, 'array') ) ? dom : dom.value);
            ary.push(errorMsg);
            return gar.formValidateStrategies[strategy].apply(dom,ary);
        });
    };
    fn.adds=function (dom,rules) {
        for(var self=this,i=0,rule;rule=rules[i++];){
            (function (rule) {
                var strategyAry=rule.strategy.split(':'),
                    errorMsg=rule.errorMsg;
                self.cache.push(function () {
                    var strategy=strategyAry.shift();
                    strategyAry.unshift( (gar.isType(dom, 'nodelist') || gar.isType(dom, 'array') ) ? dom : dom.value);
                    strategyAry.push(errorMsg);
                    return gar.formValidateStrategies[strategy].apply(dom,strategyAry);
                });
            })(rule);
        }
    };
    fn.start=function () {
        for(var i =0,validatorFunc;validatorFunc=this.cache[i++];){
            var msg=validatorFunc();
            if(msg)return msg;
        }
    };
})(window.gar.component);
/**
 * compoment name:custom event:
 */
!(function ($) {
    $.CustomEvent=function () {
        this.clientList={};
    };
    $.customEvents={};
    var fn=$.CustomEvent.prototype;
    fn.listen=function (key, fn) {
        if(!this.clientList[key])this.clientList[key]=[];
        this.clientList[key].push(fn);
    };
    fn.trigger=function () {
        var key=Array.prototype.shift.call(arguments),
            fns=this.clientList[key];
        if(!fns||fns.length===0)return false;
        for(var i =0,fn;fn=fns[i++];)gar.isType(fn,'function')?fn.apply(this,arguments):fn[arguments[0]].apply(fn,Array.prototype.slice.call(arguments,1));
    };
    fn.remove=function (key, fn) {
        var fns=this.clientList[key];
        if(!fns)return false;
        if(!fn)fns.length=0;
        else
            for(var l=fns.length,_fn;l--;){
                _fn=fns[l];
                if(_fn===fn)fns.splice(l,1);
            }

    }

})(window.gar.component);
/**
 * component name:terminal-like type
 * class name: gar-terminal-like
 * html dom structure must be seeming to this:
    <p class="gar-terminal-like" >
        <label for="account">ACCOUNT:</label><input id="account" >
        <span><span></span><b></b></span>
    </p>
 *
 */
!(function () {
    var aTerLike=getEls('.gar-terminal-like'), spanSup,spanSub,b,len=aTerLike.length;
    //dom
    var frag=document.createDocumentFragment();
    for(;len--;){
        oInput=aTerLike[len].querySelector('input');

        //create
        spanSup=document.createElement('span');
        spanSub=document.createElement('span');
        b=document.createElement('b');

        //style
        gar.addClass(oInput,'farToUnseen');
        gar.addClass(spanSup,'relative');
        gar.addClass(spanSub,'inline-block');

        //append
        spanSup.appendChild(spanSub);
        spanSup.insertBefore(b,null);
        frag.appendChild(spanSup);
        aTerLike[len].insertBefore(frag,null);

        //event listener
        gar.addHandler(aTerLike[len],'click',oInput.focus,false);
        gar.addHandler(oInput,'keyup',function (e) {transform(this,e);},false);
    }
    //show words in <input> on <span> in way of terminal-like
    function transform(from, e) {
        e=gar.getEvent(e);
        //visual area
        var tw=e.target.parentNode.childNodes[4].firstChild;
        tw.innerHTML=from.value;
    }
    //promise the <input> appearance not to be ugly
    for(var aInp=document.querySelectorAll('.gar-terminal-like input'), l=aInp.length;l--;)
        if(!aInp[l].getAttribute('maxlength'))
            aInp[l].setAttribute('maxlength',20);
})();

/**
 * component name:canvas modal
 * effect:using canvas to draw bg and content is still input element
 * class name: canvasModalKey - canvasModal - modalBody
 * html dom structure must be seeming to this:
     <p class="questionForSafety gar-canvasModalKey" id="questionForSafety">QUESTION&ANSWER</p>
     <div class="gar-canvasModal " >
         <div class="gar-modalBg"></div>
         <div class="gar-modalBody">
             <small class="tips">TIPS:<small>PLEASE FILL A QUESTION AND ANSWER TO FIND YOUR ACCOUNT!</small></small>
             <p class="que gar-terminal-like">
                <label for="que">QUESTION:</label><input type="text" id="que" required size="30">
             </p>
             <p class="ans gar-terminal-like">
                <label for="ans">ANSWER:</label><input type="text" id="ans" required size="20">
             </p>
             <p class="clearfix">
                <button type="button">CONFIRM</button>
             </p>
         </div>
     </div>
 */
!(function ($) {
    $.CanvasModal=function(oCanvasModal){
        this.oCanvasModal=oCanvasModal;
        this.oModalBg=oCanvasModal.querySelector('.gar-modalBg');
        this.oModalBody=oCanvasModal.querySelector('.gar-modalBody');
    };

    $.CanvasModal.prototype={
        constructor:$.CanvasModal,
        drawBg:function (){
            this.canM=this.oModalBg.querySelector('canvas');
            var w=this.canvasW,h=this.canvasH;

            if(this.canM.getContext){
                var ctx=this.canM.getContext('2d');
                ctx.fillStyle='rgba(0,0,0,.6)';
                //border
                ctx.beginPath();

                ctx.strokeStyle='rgb(44,170,42)';
                ctx.lineWidth=2;
                ctx.lineCap='square';

                ctx.moveTo(10,1);
                ctx.lineTo(w-10,1);
                ctx.lineTo(w-1,10);
                ctx.lineTo(w-1,h);
                ctx.lineTo(1,h);
                ctx.lineTo(1,10);
                ctx.closePath();
                ctx.stroke();

                //canvasModal's navBox
                ctx.beginPath();

                ctx.lineCap='square';

                ctx.moveTo(10,5);
                ctx.lineTo(w-10,5);
                ctx.lineTo(w-5,10);
                ctx.lineTo(w-5,30);
                ctx.lineTo(5,30);
                ctx.lineTo(5,10);
                ctx.lineTo(10,5);

                ctx.moveTo(w-33,5);
                ctx.lineTo(w-33,30);

                ctx.closePath();
                ctx.fillStyle='#004100';
                ctx.fill();
                ctx.stroke();

                //heading
                /*ctx.font='20px courier,courier_ser';
                ctx.textAlign='center';
                ctx.textBaseline='top';
                ctx.fillStyle='rgb(44,170,42)';
                ctx.fillText(heading||'INFO BOX',250,6);
                ctx.fillText('X',481,6);*/
            }
        },
        rewriteHeading:function (txt) {
            this.oDragArea.innerText=txt;
        },
        drawHeading:function () {
            this.canvasW=Math.max(500,(parseFloat(gar.getStyle(this.oModalBody,'width')))+36); //gar-modalBody's width + 18 + 18
            //this.canvasH=Math.max(200,60+this.oCanvasModal.querySelectorAll('p').length*35+28); // cuz element <p> n' element <small> are not fixed in height so we can only get their actual height via F12
            this.canvasH=Math.max(160,44+parseFloat(gar.getStyle(this.oModalBody,'height'))+10);

            var frag=document.createDocumentFragment();

            //create
            var canM=document.createElement('canvas'),
                oDragArea=document.createElement('div'),
                closeBtn=document.createElement('a');

            //attr
            canM.setAttribute('width',this.canvasW);
            canM.setAttribute('height',this.canvasH);
            oDragArea.className='gar-dragArea';

            //append
            canM.appendChild(document.createTextNode('CANVAS IS NOT ALLOWED IN YOUR CURRENT BROWSER VERSION.PLEASE UPDATE YOUR BROWSER!'));
            closeBtn.appendChild(document.createTextNode('X'));
            oDragArea.innerText='INFO BOX';
            (function(){
                for(var nodeArr=[canM,oDragArea,closeBtn],len=nodeArr.length;len--;)frag.appendChild(nodeArr[len]);
            })();
            this.oModalBg.appendChild(frag);
            //add Class attr
            this.oDragArea=this.oModalBg.querySelector('.gar-dragArea');
        },
        openBox:function () {
            //except nodeName='#text'
            var _self=this,
                _key=_self.oCanvasModal.previousSibling,
                _oCanvasModal=_self.oCanvasModal,
                _firstInp=_oCanvasModal.querySelector('input'),
                _table=_oCanvasModal.querySelectorAll('table');
            while(!_key.className||_key.className.indexOf('gar-canvasModalKey')==-1)_key=_key.previousSibling;

            //status
            this.MODALCLOSE=this.MODALDEFAULT='translate(-'+parseFloat(gar.getStyle(_oCanvasModal,'width'))/2+'px,-'+parseFloat(gar.getStyle(_oCanvasModal,'height'))/2+'px) scale(.01)';
            this.MODALOPEN='translate(-'+parseFloat(gar.getStyle(_oCanvasModal,'width'))/2+'px,-'+parseFloat(gar.getStyle(_oCanvasModal,'height'))/2+'px) scale(1)';
            _oCanvasModal.style.transform=_self.MODALDEFAULT;

            gar.addHandler(_key,'click',function () {
                _self.openBoxFn();
            },false);

            _self.contentLimit();
        },
        openBoxFn:function () {
            var _self=this,
                _key=_self.oCanvasModal.previousSibling,
                _oCanvasModal=_self.oCanvasModal,
                _firstInp=_oCanvasModal.querySelector('input'),
                _table=_oCanvasModal.querySelectorAll('table');
            _oCanvasModal.style.transform=_self.MODALOPEN;
            gar.removeClass(_oCanvasModal,'unseen');

            if(_firstInp){
                _firstInp.focus();
                //ensure that box-dragging merely happens when box is opened
                _self.moveBox();
            }else if(_table){

            }
        },
        moveBox:function () {
            var _CanvasModal=this.oCanvasModal,
                _DragArea=this.oDragArea;

            //remove event when moving for unnecessary space using
            gar.addHandler(_DragArea,'mousedown',dragStart,false);

            function dragStart(e) {
                e =gar.getEvent(e);
                var pageX=e.pageX,
                    pageY=e.pageY,
                    L, T;
                // <=ie8
                if(pageX===undefined)pageX=e.clientX+(document.body.scrollLeft||document.documentElement.scrollLeft);
                if(pageY===undefined)pageY=e.clientY+(document.body.scrollTop||document.documentElement.scrollTop);
                //calculate the distance from cursor to oCanvasModal's inner-border
                L=pageX-gar.getEleLeft(_CanvasModal);
                T=pageY-gar.getEleTop(_CanvasModal);
                //ie:setCapture
                if(this.setCapture)this.setCapture(true);

                //dragMove listener
                gar.addHandler(document,'mousemove',dragMove,false);
                //dragRelease listener
                gar.addHandler(document,'mouseup',dragRelease,false);

                function dragMove(e) {//document:just to ensure however fast of mouse's moving is ok
                    e=gar.getEvent(e);
                    var pageX=e.pageX,
                        pageY=e.pageY;
                    // <=ie8
                    if(pageX===undefined)pageX=e.clientX+(document.body.scrollLeft||document.documentElement.scrollLeft);
                    if(pageY===undefined)pageY=e.clientY+(document.body.scrollTop||document.documentElement.scrollTop);
                    //oCanvasModal moves
                    _CanvasModal.style.left=pageX-L+'px';
                    _CanvasModal.style.top=pageY-T+'px';
                }
                function dragRelease() {
                    gar.removeHandler(document,'mousemove',dragMove,false);
                    gar.removeHandler(document,'mouseup',dragRelease,false);
                    //remove
                    if(_DragArea.releaseCapture)_DragArea.releaseCapture();
                }
                //preventDefault event: pic, txt,...  can't be dragged in a default way
                return false;
            }
        },
        contentLimit:function () {
            var _input=this.oModalBody.querySelectorAll('input');
            if(_input)
                for(var len=_input.length;len--;)
                    _input[len].setAttribute('maxlength','25');
        },
        closeBox:function () {
            var _self=this,
                _closeBtn=_self.oModalBg.querySelector('a'),
                _oCanvasModal=_self.oCanvasModal,
                _DragArea=_self.oDragArea;
            _closeBtn.onclick=function () {
                _oCanvasModal.style.transform=_self.MODALCLOSE;
                //delay time must be smaller half than .modalClose's duration so that user can view the animation effect
                setTimeout(function () {
                    gar.addClass(_oCanvasModal,'unseen');
                },100);

                //remove event of boxMove
                gar.removeHandler(_DragArea,'mousedown',_self.moveBox.dragStart,false);

            };
        },
        updateBox:function () {
            //reset
            var  _closeBtn=this.oModalBg.querySelector('a');
            _closeBtn.onclick=null;
            this.oCanvasModal.className='gar-canvasModal';
            this.oCanvasModal.style='';
            this.oModalBg.innerHTML='';
            //update
            this.drawHeading();
            this.drawBg();
            this.openBox();
            this.closeBox();
            gar.addClass({
                'unseen':this.oCanvasModal,
                'modalDefault':this.oCanvasModal
            });
        }
    };

    var fn=$.CanvasModal.prototype;

    fn.init=function (oCanvasModal,id) {
        //create instance
        var oCan=new $.CanvasModal(oCanvasModal);
        oCan.drawHeading();
        oCan.drawBg();
        oCan.openBox();
        oCan.closeBox();

        gar.addClass({
            'unseen':oCan.oCanvasModal,
            'modalDefault':oCan.oCanvasModal
        });
        //rewrite heading
        modalEvent.listen(id,oCan);
    };


    //modalEvent
    var modalEvent=new gar.component.CustomEvent();
    gar.component.customEvents.modalEvent=modalEvent;
    var aCanvasModal=getEls('.gar-canvasModal'),len=aCanvasModal.length;
    while(len--)fn.init(aCanvasModal[len],len);



})(window.gar.component);

/**
 * component:progress bar
 * class name: gar-progressBar
 * html dom structure must be seeming to this:
       <div class="gar-progressBar"></div>
 */
!(function () {
    function ProgressBar(obj) {
        this.oProgBar=obj;
    }

    ProgressBar.fn=ProgressBar.prototype;

    ProgressBar.fn.create=function (pTxt,version,url) {
        var frag=document.createDocumentFragment(),
            p=document.createElement('p'),
            small=document.createElement('small'),
            spanPer=document.createElement('span'),
            spanDetail=document.createElement('span'),
            div=document.createElement('div'),

            iLen=19,
            arrNode=[div,small,p],arrNodeL=arrNode.length,
            spanArr=[spanDetail,spanPer],spanArrL=spanArr.length;

        do div.insertBefore(document.createElement('i'),null); while(iLen--);

        //append
        p.appendChild(document.createTextNode(pTxt||'HANDLING....'));
        spanPer.appendChild(document.createTextNode('0%: '));
        while(spanArrL--)small.appendChild(spanArr[spanArrL]);
        while(arrNodeL--)frag.appendChild(arrNode[arrNodeL]);
        this.oProgBar.insertBefore(frag,null);

        this.spanPer=this.oProgBar.querySelector('small').firstChild;
        this.spanDetail=this.oProgBar.querySelector('small').lastChild;
        this.aI=this.oProgBar.querySelectorAll('i');

        if(!version||version==='ajax')this.msgSync(url);
        else this.animVersion();
    };

    ProgressBar.fn.msgSync=function (url) {
        var _self=this,
            _aI=this.aI,
            i=0; //how many <i> has been added className now

        //ajax&progress
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function () {
            if(xhr.readyState===4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status===304)console.log('SUCCESSFUL!');
                else console.info('REQUEST WAS UNSUCCESSFUL: '+xhr.status);
            }
        };
        xhr.onprogress=function (e) {

            e=gar.getEvent(e);
            if(e.lengthComputable){
                var per=e.position/e.totalSize,
                    times=per*20|0;//how many <i> should be added className now
                _self.dynamicMsg.apply(this,arguments);
                if(per==1.0)xhr.onprogress=null;//just use a time but related to dom
            }
        };
        xhr.open('get',url,false);
        xhr.send(null);
    };

    ProgressBar.fn.animVersion=function () {
        var _self=this,
            per=0,
            i=0,
            times=4,
            _aI=_self.aI,timer;

        timer=setInterval(function () {
            if(times>=20)clearInterval(timer);
            i=_self.dynamicMsg.call(this,_self,i,per,_aI,times);
            per+=0.2;
            if(per===1){
                _self.dynamicMsg.call(this,_self,i,per,_aI,times);
                //prepare enough time for progress bar to reach 100% and show animation
                setTimeout(function () {_self.autoClose();},300);
            }
            times+=4;
        },300);

    };

    ProgressBar.fn.dynamicMsg=function (_self,i,per,_aI,times) {
        _self.spanPer.innerHTML=Math.round(per*100)+'%: ';
        _self.spanDetail.innerHTML=(function (per) {
            switch(true){
                case per<0.2:return 'SENDING REQUEST TO THE SERVER!';
                case per>=0.2&&per<0.4:return 'SEARCHING FOR YOUR INFO FROM DATABASE!';
                case per>=0.4&&per<0.6:return 'HANDLING RELATED CALCULATION IN THE SERVER!';
                case per>=0.6&&per<0.8:return 'GOT INFO AND READY TO SEND FROM THE SERVER!';
                case per>=0.8&&per<1.0:return 'RECEIVING THE DATA!';
                default :return 'DONE!';
            }
        })(per);
        while(i<times){
            _aI[i].className='progressBar_show';
            i++;
        }
        return i;
    };

    ProgressBar.fn.autoClose=function () {
        var _oProgress=this.oProgBar;
        //prevent from coming into scroll on the body
        gar.addClass({
            'noscroll':document.body,
            'modalClose':_oProgress,
            'closeProgressBar':_oProgress
        });
        //delay time must be smaller half than .modalClose's duration so that user can view the animation effect
        setTimeout(function () {gar.addClass(_oProgress,'hide');},200);
    };

    ProgressBar.fn.init=function (ele) {
        new ProgressBar(ele).create(false,'anim');
    };

    var progBar=getEls('.gar-progressBar'),len=progBar.length;
    while(len--)ProgressBar.fn.init(progBar[len]);
})();

/**
 * component:photo gallery
 * class name:gargallery
 * html dom structure must be seeming to this:
 *
 */
gar.photoGallery=function () {};
gar.photoGallery.fn=gar.photoGallery.prototype;
gar.photoGallery.fn.ordinaryStruc=function (pics,fragment) {
    for(var _imgArr=[],li,h3,i=-1;pics[++i];){
        _imgArr[i]=document.createElement('img');
        li=document.createElement('li');
        h3=document.createElement('h3');
        li.appendChild(h3);
        li.insertBefore(_imgArr[i],h3);
        fragment.appendChild(li);
    }
    return _imgArr;
};
gar.photoGallery.fn.galleryStyle=function (pics,fragment) {
    var _style=[3,2,3,2,3,3,4,3],
        imgStruc=function () {
            var img=document.createElement('img'),
                div=document.createElement('div'),
                p=document.createElement('p');
            div.insertBefore(p,null);
            div.insertBefore(img,p);
            return [img,div];
        };

    for(var _imgArr=[],i=1,j=0,sum=0,tmp,li;pics[i-1];){
        li=document.createElement('li');
        gar.addClass(li,'clearfix');
        while((i%23==0?23:i%23)<=((_style[j%8]+sum)%23==0?23:(_style[j%8]+sum)%23)){   //3+2+3+2+3+3+4+3=23    _style.length=8
            tmp=imgStruc();
            li.appendChild(tmp[1]);
            _imgArr.push(tmp[0]);
            if(i===23){
                sum=0;
                ++i;
                break;
            }
            ++i;
        }
        sum+=_style[j%8];
        ++j;
        fragment.appendChild(li);
    }

    return _imgArr;
};
gar.photoGallery.fn.handleAPI=function (dataObj,coreProperty) {
    //when use this component to date docking
    // {
    //     name:<String>,
    //     url:<String>,
    //     id:<Number>
    // }
    var data=dataObj,prop,d;

    for(var i =0;d=data[i];i++){
        tmp='';
        for( prop in d)if(!new RegExp(coreProperty).test(prop))tmp+= prop+'='+d[prop]+'&';
        data[i]= '<'+tmp.slice(0,tmp.length-1)+'>'+d['baseUrl'];
    }
    return data;
};


/**
 * component:single photo scale
 * id :garsinglePro
 * html dom structure must be seeming to this:
 *  <div class="garsinglePro">
        <img src="" alt="" width="" height="">
    </div>
 */
gar.singlePro=(function () {
    try{
        var wrap=getEl('#garsinglePro'),
            nowImg=wrap.querySelector('img');

        //exit the window of single product's watching
        gar.addHandler(wrap,'click',function (e) {
            var e= gar.getEvent(e),
                tar=gar.getTarget(e);

            if(tar===this){
                hSize('.gargallery');
                gar.addClass(this,'hide');
            }

        },false);
    }catch(ex){}
    return function (img) {
        img.onclick=function () {
            if(/baseurl\/(.+\..+)/.test(this.src)){
                nowImg.src=RegExp['$1'];
                console.log(RegExp.$1,this.src);
            }else nowImg.src=this.src;
            nowImg.alt=this.parentNode.lastChild.innerHTML;
            nowImg.style.transform='translate('+nowImg.width/(-2)+'px,'+nowImg.height/(-2)+'px)';

            hSize('#garsinglePro');

            //getEl('#ctxshowwrap').style.height=parseInt(gar.getFullPageWH('h'))-parseInt(gar.getStyle(getEl('#nav'),'height'))+'px';
            gar.removeClass(wrap,'hide');
        };
    }
})();


/**
 * pictures preload:
 * preListObj:{
 *     imgWrap:<Object>,
 *     defaultPic:<String>,
 *     pictures:<Array>
 * }
 * domStructureFn:{
 *     main:<Function>,
 *     part:<Function>
 * }
 *waterfall:{
 *     a1:<Number>,
 *     d:<Number>,
 *     distanceFn:return  page sum height - browser window height  <Function>
 * }
 */
gar.picPreLoad=function (preListObj,domStructureFn,waterfall) {
    var pics=preListObj.pictures,
        picIndex=0,  // record how many pictures has been loaded
        loadingPic=true,
        imgDomArr;
    var myImg=(function () {
        var fragment=document.createDocumentFragment();
        //domStructureFn must return those img doms that were created
        imgDomArr=domStructureFn.main.call(this,pics,fragment);
        preListObj.imgWrap.appendChild(fragment);
        //remove  excess
        if(imgDomArr.length>pics.length){
            var dis=imgDomArr.length-pics.length;
            while(dis--){
                var o=imgDomArr.pop();
                o.onclick=null;
                o.parentNode.parentNode.removeChild(o.parentNode);
            }
        }
        return {
            setSrc:function (src) {
                if(/(\d+),imgIndex\s/.test(src)){
                    var index=parseInt(RegExp['$1']);
                    imgDomArr[index].src=RegExp.rightContext;
                    if(/\<(.+)\>/.test(pics[index]))domStructureFn.part.call(this, imgDomArr[index],RegExp['$1']);
                    return;
                }
                //defaultPic for loading
                if(loadingPic){
                    var i =0;
                    do imgDomArr[i++].src=src; while(imgDomArr[i]);
                    loadingPic=false;
                }
            }
        };
    })();
    var proxyImg=(function () {
        for(var i =-1,img=[];preListObj.pictures[++i];){
            img[i]=new Image;
            img[i].onload=(function (index) {
                var index=index;
                return function () {
                    myImg.setSrc(index+',imgIndex '+img[index].src);
                }
            })(i);
        }
        return {
            setSrc:function (srcArr) {
                myImg.setSrc(preListObj.defaultPic);
                var i =0;
                do{
                    if(/\<.+\>/.test(srcArr[i]))srcArr[i]='/baseurl'+RegExp.rightContext;

                    //img[picIndex].src=srcArr[i];    //if srcArr[i] = pics src

                    (function (picIndex) {
                        gar.ajax({
                            url:srcArr[i]+'.txt',
                            method:'get',
                            fn:function (result) {
                                img[picIndex].src=result;
                            }
                        });
                    })(picIndex);
                }while(srcArr[i++]&&img[++picIndex])
            }
        }
    })();
    //waterfall
    if(waterfall){
        var l=pics.length, n=0,An,loadingPicsNow,
            wfHandler=function () {
                var _scrollH= /CSS1Compat/.test(document.compatMode)?document.body.scrollTop:document.documentElement.scrollTop,
                    d=waterfall.distanceFn();
                if((getScrollTop() + getWindowHeight() - getScrollHeight()<30)||n===0 || /load/.test(gar.touchTrace(gar.browserDetect().engine.x5))) {        //for better controlling the smooth effect
                    An = waterfall.a1 + waterfall.d * n;
                    if (An < l) {

                        if (l - An > waterfall.d) {
                            loadingPicsNow = n === 0 ? pics.slice(0, An) : preListObj.pictures.slice(An, An + waterfall.d);
                            proxyImg.setSrc(loadingPicsNow);
                            ++n;
                        } else {
                            proxyImg.setSrc(preListObj.pictures.slice(An, l));
                            ++n;

                            if (An>=l){
                                gar.removeHandler(window,'scroll',wfHandler,false);
                            }
                        }
                    } else  {
                        gar.removeHandler(window,'scroll',wfHandler,false);

                        proxyImg.setSrc(preListObj.pictures.slice(0, l));
                    }

                    hSize('#product');
                }
            };
        //init
        wfHandler();
        gar.addHandler(window,'scroll',wfHandler,false);
        //window.onscroll=wfHandler;
    }else proxyImg.setSrc(pics);

};
//滚动条在Y轴上的滚动距离
function getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}
//文档的总高度
function getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}
//浏览器视口的高度
function getWindowHeight(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

/**
 * component name:tree menu
 * class name:gartreeMenu
 * html dom structure must be seeming to this:
 *
 */
(function () {

})();

/**
 * use localStorage to cache js , css , base64 file
 */
gar.CacheFile=function () {
    this.storage=gar.getLocalStorage();
};
gar.CacheFile.prototype={
    constructor:gar.CacheFile,
    getFile:function (kind,name,url,fn) {
        var _self=this;
        gar.ajax({
            url:url,
            method:'get',
            fn:function (result) {
                _self.storage.setItem(name,result);
                if(/js/i.test(kind))_self.writeJs(name);
                else if(/css/i.test(kind))_self.writeCss(name);
                fn();
            }
        })
    },
    writeJs:function (name) {
        var oJs=document.createElement('script');

        oJs.innerHTML=this.storage.getItem(name);
        document.body.appendChild(oJs);
    },
    writeCss:function (name) {
        var oStyle=document.createElement('style');
        document.head.appendChild(oStyle);
        oStyle.innerHTML=this.storage.storage(name);
    },

    init:function (kind,name,url,fn) {
        this.getFile(kind,name,url,fn);
    }
};

/**
 * component name :ellipse whirl animation
 * parameter:{
 *      pNode:<Element>[optional],
 *      width:<Number>[optional],
 *      height:<Number>[optional],
 *      angleChange:<Number>[optional],
 *      itemsNum:<Number>[optional],
 *      imgs:<Array>,
 *      x0:<Number>,
 *      y0:<Number>,
 *      a:<Number>,
 *      b:<Number>,

 * }
 */
!!(function ($) {
    $.EllipseWhirl=function (parameter) {
        this.PNODE=parameter.pNode||document.body;
        this.WIDTH=parameter.width||gar.getFullPageWH('w');
        this.HEIGHT=parameter.height||gar.getFullPageWH('h');
        this.IMGS=parameter.imgs;
        this.X0=parameter.x0;
        this.Y0=parameter.y0;
        this.A=parameter.a;
        this.B=parameter.b;
        this.ANGLECHANGE=parameter.angleChange||1;
        this.ITEMSNUM=parameter.itemsNum||this.IMGS.length;
        this.items=new Array();
        this.nowShow=0;
        this.canvas=null;
        this.ctx=null;
        this.timerStack=new gar.Stack();
        this.timerI=null;
        this.keyOne=true;
        this.scanN=new Array;
    };
    var fn=$.EllipseWhirl.prototype;
    fn.calcScanN=function () {
        for(var i =0;i<this.ITEMSNUM;i++)this.scanN[i]=0;
    };
    fn.createCanvas=function () {
        this.canvas=document.createElement('canvas');
        var canvas=this.canvas;
        canvas.width=this.WIDTH;
        canvas.height=this.HEIGHT;
        canvas.className='mainBg';
        canvas.innerHTML='CANVAS IS NOT SUPPORTED IN YOUR BROWSER!';
        this.PNODE.appendChild(canvas);
        this.ctx=canvas.getContext('2d');
    };
    fn.createImg=function () {
        var img,self=this,l=this.ITEMSNUM;
        for(;l--;){
            img=new Image();

            img.onload=(function (index) {
                var i =index;
                return function () {
                    var info=self.items[i],
                        _w=info.img.width,
                        _h=info.img.height;

                    info.angle=(i+1)*(360/self.ITEMSNUM);
                    self.calcPos(info,self,_w,_h);

                    ++self.nowShow;

                    if(self.nowShow===self.ITEMSNUM){
                        self.timerI=setInterval(function () {
                            self.startMove.apply(self);
                        },1000/60);
                    }

                }
            })(l);

            img.src=this.IMGS[l];
            img.id=l;
            this.items[l]={img:img};
        }
    };
    fn.startMove=function () {
        var self=this,ctx=this.ctx;
        ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        gar.reverseEach(this.items,function (i,item,len) {
            item.angle+=self.ANGLECHANGE;
            if(item.angle==360)item.angle=0;
            if(item.angle%45===0&&item.angle%90!=0&&self.keyOne){
                clearInterval(self.timerI);
                self.keyOne=false;

                //scan
                self.scan(self,ctx);
            }
            self.calcPos(item,self,item.img.width,item.img.height);
        });
    };
    fn.calcPos=function (info,self,_w,_h) {
        info.radian=info.angle*(Math.PI/180);
        info.x=self.X0+self.A*Math.cos(info.radian)-(_w>>1);
        info.y=self.Y0+self.B*Math.sin(info.radian)-(_h>>1);

        var num=self.getCoreProp(info,0.5,1);
        info.num=num;
        info.nowW=_w*num;
        info.nowH=_h*num;
        self.ctx.globalAlpha=num;
        self.ctx.drawImage(info.img,info.x,info.y,info.nowW,info.nowH);
        self.ctx.globalAlpha=1;
    };
    fn.getCoreProp=function (obj, n1, n2) {
        return (((obj.y + obj.img.height / 2 - this.Y0) + 2 * this.B) / this.B - 1) / 2 * (n2 - n1) + n1;
    };
    fn.scan=function (self,ctx) {
        gar.reverseEach(self.items,function (i, item, len) {
            var gradient=ctx.createLinearGradient(item.x,item.y+item.nowH/2,item.x+1,item.y+item.nowH/2);
            gradient.addColorStop(0,'rgba(44,220,41,'+parseFloat(item.num-0.3)+')');
            gradient.addColorStop(1,'rgba(20,253,14,'+parseFloat(item.num-0.3)+')');
            ctx.shadowOffsetX=-1;
            ctx.shadowBlur=10;
            ctx.shadowColor='rgba(20,50,14,'+parseFloat(item.num-0.3)+')';
            ctx.fillStyle=gradient;
            ctx.globalCompositeOperation='destination-over';

            var deltaD=40*item.nowW/3400;   //  t= s/v = nowW/(deltaD/deltaT)

            (function (i) {
                var t=setInterval(function () {
                    self.timerStack.push(t);

                    self.calcPos(item,self,item.img.width,item.img.height);

                    ctx.globalCompositeOperation='source-over';

                    ctx.fillRect(item.x+deltaD*self.scanN[i],item.y,2,item.nowH);

                    ++self.scanN[i];

                    if(self.scanN[i]*deltaD-1 >= item.nowW){
                        clearInterval(t);
                        self.scanN[i]=0;
                        if(self.scanN[0]===0&&self.scanN[1]===0&&self.scanN[2]===0&&self.scanN[3]===0)
                            setTimeout(function () {
                                self.keyOne=true;
                                self.timerI=setInterval(function () {
                                    self.startMove.apply(self);
                                },1000/60);
                            },500);
                        /*for(var j =scaned=0;j<len;++j){
                            if(self.scanN[j]!==0)break;
                            if(++scaned === len-1){         //??????????
                                setTimeout(function () {
                                    self.keyOne=true;
                                    self.timerI=setInterval(function () {
                                        self.startMove.apply(self);
                                    },60);
                                },500);
                            }
                        }*/


                    }

                },40);
            })(i);

        });
    };
    fn.stopAnim=function (obj) {
        var hide=getEl('#hideMainBg');
        if(!obj)return;
        var self=this;
        gar.addHandler(obj,'mouseover',stop,false);
        gar.addHandler(obj,'mouseout',function () {
            /*if(self.keyOne)
                self.timerI=setInterval(function () {
                    self.startMove.apply(self);
                },60);
            else{
                var l=4;
                while(l--)clearInterval(self.timerStack.pop());
                self.scan(self,self.ctx);
            }*/
            hide.className='hide';
        },false);
        /*gar.addHandler(obj,'click',function () {
            if(!obj.style.transform)hide.className='hide';
        },false);*/
        function stop() {
            /*if(self.keyOne)clearInterval(self.timerI);
            else{
                var l=4;
                while(l--)clearInterval(self.timerStack.pop());
            }*/
            hide.className='show';
        }
    };
    fn.init=function () {
        this.calcScanN();
        this.createCanvas();
        this.createImg();
    }
})(window.gar.component);

/**
 * component name: multi-function table
 * html structure must be seeming to this:
 *  <table class="gar-table">
     <thead>
        <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>TEL</th>
            <th>PHONE</th>
            <th>QQ</th>
        </tr>
     </thead>
     <tbody></tbody>
     <tfoot></tfoot>
    </table>
 */
!!(function ($) {
    $.MFTable=function (table,data,ths) {
        this.table=table;
        this.data=data;
        this.ths=ths||this.table.querySelectorAll('th');
        this.result=null;
    };
    var fn=$.MFTable.prototype;
    fn.addSortBtn=function (theads) {
        var self =this;
        gar.reverseEach(theads,function (i, item, len) {
            var type=item.className;
            item.innerHTML+='<i class="gar-triangleU"></i><i class="gar-triangleB "></i>';
            item.querySelectorAll('i')[0].onclick=function () {
                self.result = /Number/i.test(type) ? self.sortNum(type,'sort') : self.sortLetter(type,'sort');
                self.showData();
            };
            item.querySelectorAll('i')[1].onclick=function () {
                self.result = /Number/i.test(type) ? self.sortNum(type,'reverse') : self.sortLetter(type,'reverse');
                self.showData();
            };
        });
    };
    fn.sortLetter=function (type,order) {
        var _type=type.split('-')[type.split('-').length-1],
            arr=[],
            self=this;
        gar.each(this.data.dataStore,function (i, item, len) {
            arr.push(item);
        });
        if(/sort/.test(order)){
            return self.shellSort(arr,_type,order,'str');
        }else if(/reverse/.test(order)){
            return self.shellSort(arr,_type,order,'str');
        }
    };
    fn.sortNum=function (type,order) {
        var _type=type.split('-')[type.split('-').length-1],
            arr=[],
            self=this;
        gar.each(this.data.dataStore,function (i, item, len) {
            arr.push(item);
        });
        if(/sort/.test(order)){
            return self.shellSort(arr,_type,order,'num');
        }else{
            return self.shellSort(arr,_type,order,'num');
        }
    };
    fn.bubbleSort=function (arr,attr,order,type) {
        var i =arr.length-1,pos,j;
        while(i){
            pos=0;
            for(j=0;j<i;j++){
                if(/sort/.test(order)){
                    if((/num/.test(type)&&(parseFloat(arr[j][attr])<parseFloat(arr[j+1][attr])) || /str/.test(type)&&arr[j+1][attr].localeCompare(arr[j][attr])<0)){
                        gar.swap(arr,j,j+1);
                        pos=j;
                    }
                }else {
                    if((/num/.test(type)&&(parseFloat(arr[j][attr])>parseFloat(arr[j+1][attr])) || /str/.test(type)&&(arr[j][attr].localeCompare(arr[j+1][attr])<0))){
                        gar.swap(arr,j,j+1);
                        pos=j;
                    }
                }
            }
            i=pos;
        }
        return arr;
    };
    fn.selectionSort=function (arr,attr,order,type) {
        for(var min,outer=0,lO=arr.length-2,lI=arr.length-1;outer<=lO;++outer){
            min=outer;
            for(var inner=outer+1;inner<=lI;++inner){
                if(/sort/.test(order)){
                    if(((/num/.test(type)&&(parseFloat(arr[inner][attr]) < parseFloat(arr[min][attr])) || (/str/.test(type)&&arr[inner][attr].localeCompare(arr[min][attr])<0)))){
                        min=inner;
                        console.log(arr);
                    }
                }else {
                    if(((/num/.test(type)&&(parseFloat(arr[inner][attr]) > parseFloat(arr[min][attr]))) || (/str/.test(type)&&(arr[min][attr].localeCompare(arr[inner][attr])<0)))){
                        min=inner;
                        console.log(arr);
                    }
                }
                gar.swap(arr,outer,min);
            }
        }
        return arr;
    };
    fn.insertSort=function (arr,attr,order,type) {
        var tmp,inner,l=arr.length;
        for(var outer=1;outer<=l-1;outer++){
            tmp=arr[outer];
            inner=outer;
            if(/sort/.test(order)){
                while(
                    inner>0&&(/num/.test(type)&&(parseFloat(arr[inner-1][attr])>=parseFloat(tmp[attr])) ||
                    inner>0&&/str/.test(type)&&tmp[attr].localeCompare(arr[inner-1][attr])<0)  )
                {
                    arr[inner]=arr[inner-1];
                    --inner;
                }
            }else{
                while(
                    inner>0&&(/num/.test(type)&&(parseFloat(arr[inner-1][attr])<=parseFloat(tmp[attr])) ||
                    inner>0&&/str/.test(type)&&arr[inner-1][attr].localeCompare(tmp[attr])<0)  )
                {
                    arr[inner]=arr[inner-1];
                    --inner;
                }
            }
            arr[inner]=tmp;
        }
        return arr;
    };
    fn.shellSort=function (arr,attr,order,type) {
        var l =arr.length,
            tmp,
            gap=l>>1;
        while(gap!==0){
            for(var i =gap;i<l;++i){
                tmp=arr[i];
                if(/sort/.test(order)) {
                    for(var j =i-gap;/num/.test(type)&&j>=0&&parseFloat(tmp[attr])<parseFloat(arr[j][attr]) ||
                        /str/.test(type)&&j>=0&&tmp[attr].localeCompare(arr[j][attr])<0;j-=gap) {
                        arr[j + gap] = arr[j];
                    }
                }else{
                    for(var j =i-gap;/num/.test(type)&&j>=0&&parseFloat(tmp[attr])>parseFloat(arr[j][attr]) ||
                    /str/.test(type)&&j>=0&&arr[j][attr].localeCompare(tmp[attr])<0;j-=gap) {
                        arr[j + gap] = arr[j];
                    }
                }
                arr[j+gap]=tmp;
            }
            gap=gap>>1;
        }
        return arr;
    };
    fn.heapSort=function (arr,attr,order,type) {
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
    fn.showData=function () {
        this.table.querySelector('tbody').innerHTML='';
        var _data=this.result||this.data.dataStore,      //dictionary
            htmls='',
            html='';
        gar.each(_data,function (i, item, len) {
            html='<tr>';
            gar.each(item,function (i, it, len) {
                html+='<td>'+it+'</td>';
            });
            html+='</tr>';
            htmls+=html;
        });
        this.table.querySelector('tbody').innerHTML=htmls;
    };
    fn.getResult=function () {
        return this.result;
    };
    fn.init=function () {
        this.addSortBtn(this.ths);
        this.showData();
    }
})(window.gar.component);

/**
 * component name: pagination
 * html structure must be seeming to this:
 *      <div id='gar-pagination' class="gar-pagination clearfix"></div>
 * @param: pageSize--'the number of records per page'   pageNum--'target page index'
 * @getter: beginPageIndex--'index of beginning page'
 *          currentPage--'current page index'
 *          endPageIndex--'index of ending page'
 *          pageCount--'total pages' number'
 *          pageSize--'~'
 *          recordCount--'total records' number'
 *          recordList--'the Object/Array of records'
 */
!!(function ($) {
    $.Pagination=function (wrap,data,table,version) {
        this.wrap = wrap;
        this.table = table;
        this.beginPageIndex = data.beginPageIndex || 1;
        this.currentPage = data.currentPage || 1;
        this.endPageIndex = data.endPageIndex ||1 ;
        this.pageCount = data.pageCount || 0;
        this.pageSize = data.pageSize || 0;
        this.recordCount = data.recordCount || 0;
        this.recordList = data.recordList || [];
        this.pCtn = null;
        this.pICtn = null;
        this.pI = this.pageSize || 0;
        this.pE = new gar.component.CustomEvent();
        this.updateTB = null;
        this.version = version || 'chineseVersion';
        this.times = 0;
        this.noDataTips = '暂无数据!';
    };
    var fn = $.Pagination.prototype;

    //default item
    fn.defaults = {
        chineseVersion:['上一页','页','下一页'],
        englishVersion:['Previous','page','Next']
    };

    //create total structure
    fn.createStru = function () {
        var self = this;

        //set wrap innerHTML
        this.wrap.innerHTML = '<a id="pre-btn" class="fl" href="javascript:;">' + this.defaults[ this.version ][0]+'</a>' +
            '<div></div>' +
            '<div></div>' +
            '<a id="next-btn" class="fr" href="javascript:;">' + this.defaults[ this.version ][2]+'</a>';

        //get tow div
        this.pCtn = this.wrap.querySelectorAll('div')[0];
        this.pICtn = this.wrap.querySelectorAll('div')[1];

        //add event
        getEl('#pre-btn').onclick = function (e) {

            if(self.currentPage === 1) return;

            self.currentPage -= 1;

            //update
            self.updateInner(self);
        };

        getEl('#next-btn').onclick = function (e) {

            if(self.currentPage === self.endPageIndex) return;

            self.currentPage += 1;

            //update
            self.updateInner(self);
        };

    };

    //choose page interval
    fn.choosePI = function () {
        var self = this,
            _pI = self.pI,
            _pICtn = self.pICtn;

        //select: page number provided to choose
        _pICtn.innerHTML = '<input  type="button" value="' + _pI + '"><small>/' + self.defaults[ self.version ][1] + '</small> ' +
            '<ul class="hide">' +
            ' <li><small>' + _pI + '</small></li>' +
            ' <li><small>' + ( _pI + 8 ) + '</small></li> ' +
            '<li><small>' + ( _pI + 16 ) +'</small></li> ' +
            '</ul>';

        //get li and input
        var aLi = _pICtn.querySelectorAll('li'),
            oInp = _pICtn.querySelector('input');

        //add click event to each li
        gar.reverseEach(aLi, function (i, item, len) {
            gar.addHandler(item, 'click', function (e) {
                e=gar.getEvent(e);
                oInp.value = gar.getInnerText( gar.getTarget(e) );

                //update
                self.updateInner(self);

            },false);
        });
    };

    //set paginate rule
    fn.paginate = function () {

        //release previous click event
        if(this.pCtn)
            gar.reverseEach(this.pCtn, function (i, item, len) {
                item.onclick = null;
            });

        //calc
        var pages = this.pageCount,
            nP = this.currentPage,
            endP = this.endPageIndex,
            _pCtn = this.pCtn,
            html = '',
            self = this;

        //pages total number <= 6
        if(pages <= 6){
            var i = 1;
            while(i <= endP){
                html += '[<a href="javascript:;">'+i+'</a>]&nbsp;';
                ++i;
            }

        //pages total number > 6
        } else {

            //current page number <= 2, just display previous 4 page number
            if(nP <= 2){
                var i =1;
                while(i <= 4){
                    html += '[<a href="javascript:;">'+i+'</a>]&nbsp;';
                    ++i;
                }
                html += '<span>...</span>';
                html += '[<a href="javascript:;">' + (endP - 1) + '</a>]&nbsp;';

            // 2 < current page number && current page + 4 < end page number
            // just display current page number in [-2, +2] range page number
            }else if(nP > 2 && nP + 4 < endP){
                html += '<span>...</span>';
                var i = 1;
                while(i <= 4){
                    html += '[<a href="javascript:;">'+ (nP - 2 + i) +'</a>]&nbsp;';    // [...]  1 + nP + 2  [...]
                    ++i;
                }
                html += '<span>...</span>';
                html += '[<a href="javascript:;">' + (endP - 1) + '</a>]&nbsp;';

            //current page number + 4 >= end page number
            //just display last 4 page number
            }else if(nP + 4 >= endP){
                html+='<span>...</span>';
                var i = -1;
                while(nP + i < endP){
                    html += '[<a href="javascript:;">'+ (nP + i) +'</a>]&nbsp;';
                    ++i;
                }
            }
        }

        _pCtn.innerHTML = html;

        //set first page index status
        this.pCtn.querySelectorAll('a')[0].className = 'garPStatus';

        //add new click event
        gar.each(this.pCtn.querySelectorAll('a'), function (i,item,len) {
            item.onclick=function () {

                //update index status
                self.currentPage = parseInt(this.innerHTML);

                //update
                self.updateInner(self);
            };
        });
    };

    //change status
    fn.changeStatus = function () {
        var self = this;

        //reset situation
        //set status
        gar.each(self.pCtn.querySelectorAll('a'), function (i, item, len, attr) {
            if(item.innerHTML == self.currentPage) item.className = 'garPStatus';
            else item.className= '';
            console.log(item.innerHTML, self.currentPage, item.className, item);
        });
    };

    fn.updateTable = function () {
        if(!this.updateTB){
            this.updateTB();
        }
    };

    fn.setUpdateTableFn = function (fn) {
        this.updateTB = fn || function () {
                //..
            };
    };

    //update data message
    fn.updateMsg = function (fn) {
        var self = this;
        var _updateMsg = (function () {

            //save environment
            var _self = self;

            return function () {
                fn.call(_self,
                    function (result) {
                        //update msg
                        _self.beginPageIndex= result.beginPageIndex || _self.beginPageIndex;
                        //_self.currentPage = result.currentPage||_self.currentPage;
                        _self.endPageIndex= result.endPageIndex || result.pageCount;
                        _self.pageCount= result.pageCount || _self.pageCount;
                        _self.pageSize= result.pageSize || _self.pageSize;
                        _self.recordCount= result.recordCount || _self.recordCount;
                        //_self.recordList= result.recordList||_self.recordList;

                        if(_self.recordCount === 0) return _self.wrap.innerHTML = _self.noDataTips;

                        //first time to get data
                        if(_self.times === 0){
                            _self.paginate();
                            ++ _self.times;
                        }

                        //paginate again based on new data
                        self.paginate();
                        self.changeStatus();
                    },
                    {
                        pageSize: _self.pICtn.querySelector('input').value,
                        pageNum: function () {

                            //if change pageSize, just set pageNum to 1
                            if(_self.pageSize != _self.pICtn.querySelector('input').value){
                                _self.pageSize = _self.pICtn.querySelector('input').value;
                                _self.currentPage =1;
                                return 1;
                            }

                            return _self.currentPage;
                        }
                    }
                );
            }
        })();

        this.pE.listen('updateMsg', _updateMsg);
    };

    fn.updateInner = function (self) {
        //get new data
        self.pE.trigger('updateMsg');

        //paginate again based on new data
        self.paginate();

        //show current page index
        self.changeStatus();
    };

    //init
    fn.init=function () {
        this.createStru();
        this.choosePI();
        this.paginate();
        this.pE.trigger('updateMsg');
    }
})(window.gar.component);

/**
 * @name:g-repeat directive (imitate ng-repeat usage)
 * @description: [g-repeat] must be the only child of its parentNode
 * @usage:
 *      $.model={a:[],...}
 *      $gRepeatEvent.trigger('gRepeatEvent');
 * @usage:
 *      if html structure lick this :<a href="((item.nextUrl))"> ((item.title)) </a>,  must change like this:
 *      <a href="((item.nextUrl))">
 *          ((item.title))
 *          </a>
 */
!!(function ($) {//
    $.model={};
    $.view={};
    $.gRepeatDirective=function () {
        var doc = document,
            aWrap,
            aScope = {};
        $.customEvents.gRepeatEvent = new gar.component.CustomEvent();

        //do
        var replace=function () {

            aWrap = doc.querySelectorAll('[g-repeat]');

            gar.each(aWrap,function (i, item, len, index) {
                var outHtml=gar.getOuterHTML(item),
                    scopeName=outHtml.match(/ g-repeat=(?:'|").+in (.+\w)(?:"|')/)[1];
                if(!scopeName)throw new TypeError('gRepeat directive');
                scopeName = /\./g.test(scopeName) ? scopeName.replace(/\./g,'') : scopeName;
                aScope[scopeName] = gar.isType(aScope[scopeName],'array') ? aScope[scopeName] : [];

                outHtml=outHtml.replace(/ g-repeat/,' g-repeatID=\''+i+'\' g-repeat');
                console.log($.model, scopeName);
                $.view[i] = aScope[scopeName][i] = $.model[scopeName] ? outHtml : 'undefined';
            });

            console.log($.view);
            gar.each(aScope,function (i, item, len, attr) {
                for (var l=item.length, item0 , j=0; j<l; ++j){
                    item0=item[j];
                    if(!item0 || /undefined/.test(item0) )continue;

                    var modelData=$.model[attr], // must be an Array
                        htmlArr=new Array,
                        result='';

                    gar.each(modelData,function (attr, item1, len) {
                        htmlArr.push({
                            view:item0,
                            model:{
                                key: attr,
                                value: item1
                            }
                        });
                    });

                    //replace ui special str
                    gar.each(htmlArr,function (attr, item, len) {
                        var _view=item.view,
                            _model=item.model.value,
                            _item=_view.match(/ g-repeat=[\'\"](.+) in/)[1];
                        result += _view.replace(new RegExp('\\(\\('+_item+'(?:\\.([\\w\\.\\d]+)\\)\\)|\\)\\))','g'),function () {
                            //for in parentNode
                            /*console.log()
                            if( gar.isType(_model[ arguments[1] ], 'array') ){
                                if(_view.match(/ g-repeat=['"].+in (\w+)['"]/g)[2] == _item){
                                    console.log(RegExp.$1);
                                }
                            }*/
                            if( /\./.test(arguments[1]) ){
                                var tmpVar = arguments[1].split('.'),
                                    l = tmpVar.length, i = -1,
                                    result = _model;
                                console.log(tmpVar);
                                while(++i < l){
                                    result = result[ tmpVar[i] ];
                                    if(!gar.isType(result, 'number') && !result) return result = '感谢您的留言，我们收到后会尽快回复您，请留意本网站和您的邮箱信息！';
                                }
                                return result;
                            }
                            return arguments[1] ? _model[ arguments[1] ] : item.model.key;
                        });
                        //...
                    });

                    aWrap[j].parentNode.innerHTML = result;
                }

            });
        };
        return function () {
            //update
            if(JSON.stringify($.view) == '{}') replace();
            else
                gar.each($.view,function (i, item, len) {
                    var aRepeated=doc.querySelectorAll('[g-repeatID="'+i+'"]');
                    gar.each(aRepeated,function (i, value, len, key) {
                        if(i==len-1)return;
                        doc.removeChild(item);
                    });
                    aRepeated[0].innerHTML=$.view[i];
                    replace();
                });
        }
    }();

    //reset
    var reset = function () {
        $.view = {};
        console.log($.view);
    };
    $.customEvents.gRepeatReset = new gar.component.CustomEvent();

    //listen
    $.customEvents.gRepeatEvent.listen('gRepeatEvent', $.gRepeatDirective);
    $.customEvents.gRepeatReset.listen('gRepeatReset', reset);
    window.$gRepeatEvent = $.customEvents.gRepeatEvent;
    window.$gRepeatReset = $.customEvents.gRepeatReset;
})(window.gar.component);

/**
 * @name: traditional-simple transform
 * @html: <a href="javascript:;" id="stBtn" >简体</a>
 * @param url:'/library/garModule/st_dictionary'
 *
 */
!(function ($) {
    var dic={
            SIMPLE_CHINESE:'啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座锕嗳嫒瑷暧霭谙铵鹌媪骜鳌钯呗钣鸨龅鹎贲锛荜哔滗铋筚跸苄缏笾骠飑飙镖镳鳔傧缤槟殡膑镔髌鬓禀饽钹鹁钸骖黪恻锸侪钗冁谄谶蒇忏婵骣觇禅镡伥苌怅阊鲳砗伧谌榇碜龀枨柽铖铛饬鸱铳俦帱雠刍绌蹰钏怆缍鹑辍龊鹚苁骢枞辏撺锉鹾哒鞑骀绐殚赕瘅箪谠砀裆焘镫籴诋谛绨觌镝巅钿癫铫鲷鲽铤铥岽鸫窦渎椟牍笃黩簖怼镦炖趸铎谔垩阏轭锇锷鹗颚颛鳄诶迩铒鸸鲕钫鲂绯镄鲱偾沣凫驸绂绋赙麸鲋鳆钆赅尴擀绀戆睾诰缟锆纥镉颍亘赓绠鲠诟缑觏诂毂钴锢鸪鹄鹘鸹掴诖掼鹳鳏犷匦刿妫桧鲑鳜衮绲鲧埚呙帼椁蝈铪阚绗颉灏颢诃阖蛎黉讧荭闳鲎浒鹕骅桦铧奂缳锾鲩鳇诙荟哕浍缋珲晖诨馄阍钬镬讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫郏浃铗镓蛲谏缣戋戬睑鹣笕鲣鞯绛缰挢峤鹪鲛疖颌鲒卺荩馑缙赆觐刭泾迳弪胫靓阄鸠鹫讵屦榉飓钜锔窭龃锩镌隽谲珏皲剀垲忾恺铠锴龛闶钪铐骒缂轲钶锞颔龈铿喾郐哙脍狯髋诓诳邝圹纩贶匮蒉愦聩篑阃锟鲲蛴崃徕涞濑赉睐铼癞籁岚榄斓镧褴阆锒唠崂铑铹痨鳓诔缧俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢蔹奁潋琏殓裢裣鲢魉缭钌鹩蔺廪檩辚躏绫棂蛏鲮浏骝绺镏鹨茏泷珑栊胧砻偻蒌喽嵝镂瘘耧蝼髅垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈脔娈栾鸾銮囵荦猡泺椤脶镙榈褛锊呒唛嬷杩劢缦镘颡鳗麽扪焖懑钔芈谧猕祢渑腼黾缈缪闵缗谟蓦馍殁镆钼铙讷铌鲵辇鲶茑袅陧蘖嗫颟蹑苎咛聍侬哝驽钕傩讴怄瓯蹒疱辔纰罴铍谝骈缥嫔钋镤镨蕲骐绮桤碛颀颃鳍佥荨悭骞缱椠钤嫱樯戗炝锖锵镪羟跄诮谯荞缲硗跷惬锲箧锓揿鲭茕蛱巯赇虮鳅诎岖阒觑鸲诠绻辁铨阕阙悫荛娆桡饪轫嵘蝾缛铷颦蚬飒毵糁缫啬铯穑铩鲨酾讪姗骟钐鳝垧殇觞厍滠畲诜谂渖谥埘莳弑轼贳铈鲥绶摅纾闩铄厮驷缌锶鸶薮馊飕锼谡稣谇荪狲唢睃闼铊鳎钛鲐昙钽锬顸傥饧铴镗韬铽缇鹈阗粜龆鲦恸钭钍抟饨箨鼍娲腽纨绾辋诿帏闱沩涠玮韪炜鲔阌莴龌邬庑怃妩骛鹉鹜饩阋玺觋硖苋莶藓岘猃娴鹇痫蚝籼跹芗饷骧缃飨哓潇骁绡枭箫亵撷绁缬陉荥馐鸺诩顼谖铉镟谑泶鳕埙浔鲟垭娅桠氩厣赝俨兖谳恹闫酽魇餍鼹炀轺鹞鳐靥谒邺晔烨诒呓峄饴怿驿缢轶贻钇镒镱瘗舣铟瘾茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂镛莸铕鱿伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉橼鸢鼋钺郓芸恽愠纭韫殒氲瓒趱錾驵赜啧帻箦谮缯谵诏钊谪辄鹧浈缜桢轸赈祯鸩诤峥钲铮筝骘栉栀轵轾贽鸷蛳絷踬踯觯锺纣绉伫槠铢啭馔颞骓缒诼镯谘缁辎赀眦锱龇鲻偬诹驺鲰镞缵躜鳟讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄',
            TRADITIONAL_CHINESE:'啊阿埃挨哎唉哀皚癌藹矮艾礙愛隘鞍氨安俺按暗岸胺案骯昂盎凹敖熬翺襖傲奧懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙壩霸罷爸白柏百擺佰敗拜稗斑班搬扳般頒板版扮拌伴瓣半辦絆邦幫梆榜膀綁棒磅蚌鎊傍謗苞胞包褒剝薄雹保堡飽寶抱報暴豹鮑爆杯碑悲卑北輩背貝鋇倍狽備憊焙被奔苯本笨崩繃甭泵蹦迸逼鼻比鄙筆彼碧蓖蔽畢斃毖幣庇痹閉敝弊必辟壁臂避陛鞭邊編貶扁便變卞辨辯辮遍標彪膘表鱉憋別癟彬斌瀕濱賓擯兵冰柄丙秉餅炳病並玻菠播撥缽波博勃搏鉑箔伯帛舶脖膊渤泊駁捕蔔哺補埠不布步簿部怖擦猜裁材才財睬踩采彩菜蔡餐參蠶殘慚慘燦蒼艙倉滄藏操糙槽曹草廁策側冊測層蹭插叉茬茶查碴搽察岔差詫拆柴豺攙摻蟬饞讒纏鏟產闡顫昌猖場嘗常長償腸廠敞暢唱倡超抄鈔朝嘲潮巢吵炒車扯撤掣徹澈郴臣辰塵晨忱沈陳趁襯撐稱城橙成呈乘程懲澄誠承逞騁秤吃癡持匙池遲弛馳恥齒侈尺赤翅斥熾充沖蟲崇寵抽酬疇躊稠愁籌仇綢瞅醜臭初出櫥廚躇鋤雛滁除楚礎儲矗搐觸處揣川穿椽傳船喘串瘡窗幢床闖創吹炊捶錘垂春椿醇唇淳純蠢戳綽疵茨磁雌辭慈瓷詞此刺賜次聰蔥囪匆從叢湊粗醋簇促躥篡竄摧崔催脆瘁粹淬翠村存寸磋撮搓措挫錯搭達答瘩打大呆歹傣戴帶殆代貸袋待逮怠耽擔丹單鄲撣膽旦氮但憚淡誕彈蛋當擋黨蕩檔刀搗蹈倒島禱導到稻悼道盜德得的蹬燈登等瞪凳鄧堤低滴迪敵笛狄滌翟嫡抵底地蒂第帝弟遞締顛掂滇碘點典靛墊電佃甸店惦奠澱殿碉叼雕雕刁掉吊釣調跌爹碟蝶叠諜疊丁盯叮釘頂鼎錠定訂丟東冬董懂動棟侗恫凍洞兜抖鬥陡豆逗痘都督毒犢獨讀堵睹賭杜鍍肚度渡妒端短鍛段斷緞堆兌隊對墩噸蹲敦頓囤鈍盾遁掇哆多奪垛躲朵跺舵剁惰墮蛾峨鵝俄額訛娥惡厄扼遏鄂餓恩而兒耳爾餌洱二貳發罰筏伐乏閥法琺藩帆番翻樊礬釩繁凡煩反返範販犯飯泛坊芳方肪房防妨仿訪紡放菲非啡飛肥匪誹吠肺廢沸費芬酚吩氛分紛墳焚汾粉奮份忿憤糞豐封楓蜂峰鋒風瘋烽逢馮縫諷奉鳳佛否夫敷膚孵扶拂輻幅氟符伏俘服浮涪福袱弗甫撫輔俯釜斧脯腑府腐赴副覆賦復傅付阜父腹負富訃附婦縛咐噶嘎該改概鈣蓋溉幹甘桿柑竿肝趕感稈敢贛岡剛鋼缸肛綱崗港杠篙臯高膏羔糕搞鎬稿告哥歌擱戈鴿胳疙割革葛格蛤閣隔鉻個各給根跟耕更庚羹埂耿梗工攻功恭龔供躬公宮弓鞏汞拱貢共鉤勾溝茍狗垢構購夠辜菇咕箍估沽孤姑鼓古蠱骨谷股故顧固雇刮瓜剮寡掛褂乖拐怪棺關官冠觀管館罐慣灌貫光廣逛瑰規圭矽歸龜閨軌鬼詭癸桂櫃跪貴劊輥滾棍鍋郭國果裹過哈骸孩海氦亥害駭酣憨邯韓含涵寒函喊罕翰撼捍旱憾悍焊汗漢夯杭航壕嚎豪毫郝好耗號浩呵喝荷菏核禾和何合盒貉閡河涸赫褐鶴賀嘿黑痕很狠恨哼亨橫衡恒轟哄烘虹鴻洪宏弘紅喉侯猴吼厚候後呼乎忽瑚壺葫胡蝴狐糊湖弧虎唬護互滬戶花嘩華猾滑畫劃化話槐徊懷淮壞歡環桓還緩換患喚瘓豢煥渙宦幻荒慌黃磺蝗簧皇凰惶煌晃幌恍謊灰揮輝徽恢蛔回毀悔慧卉惠晦賄穢會燴匯諱誨繪葷昏婚魂渾混豁活夥火獲或惑霍貨禍擊圾基機畸稽積箕肌饑跡激譏雞姬績緝吉極棘輯籍集及急疾汲即嫉級擠幾脊己薊技冀季伎祭劑悸濟寄寂計記既忌際繼紀嘉枷夾佳家加莢頰賈甲鉀假稼價架駕嫁殲監堅尖箋間煎兼肩艱奸緘繭檢柬堿鹼揀撿簡儉剪減薦檻鑒踐賤見鍵箭件健艦劍餞漸濺澗建僵姜將漿江疆蔣槳獎講匠醬降蕉椒礁焦膠交郊澆驕嬌嚼攪鉸矯僥腳狡角餃繳絞剿教酵轎較叫窖揭接皆稭街階截劫節莖睛晶鯨京驚精粳經井警景頸靜境敬鏡徑痙靖竟競凈炯窘揪究糾玖韭久灸九酒廄救舊臼舅咎就疚鞠拘狙疽居駒菊局咀矩舉沮聚拒據巨具距踞鋸俱句懼炬劇捐鵑娟倦眷卷絹撅攫抉掘倔爵桔傑捷睫竭潔結解姐戒藉芥界借介疥誡屆巾筋斤金今津襟緊錦僅謹進靳晉禁近燼浸盡勁荊兢覺決訣絕均菌鈞軍君峻俊竣浚郡駿喀咖卡咯開揩楷凱慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕顆科殼咳可渴克刻客課肯啃墾懇坑吭空恐孔控摳口扣寇枯哭窟苦酷庫褲誇垮挎跨胯塊筷儈快寬款匡筐狂框礦眶曠況虧盔巋窺葵奎魁傀饋愧潰坤昆捆困括擴廓闊垃拉喇蠟臘辣啦萊來賴藍婪欄攔籃闌蘭瀾讕攬覽懶纜爛濫瑯榔狼廊郎朗浪撈勞牢老佬姥酪烙澇勒樂雷鐳蕾磊累儡壘擂肋類淚棱楞冷厘梨犁黎籬貍離漓理李裏鯉禮莉荔吏栗麗厲勵礫歷利傈例俐痢立粒瀝隸力璃哩倆聯蓮連鐮廉憐漣簾斂臉鏈戀煉練糧涼梁粱良兩輛量晾亮諒撩聊僚療燎寥遼潦了撂鐐廖料列裂烈劣獵琳林磷霖臨鄰鱗淋凜賃吝拎玲菱零齡鈴伶羚淩靈陵嶺領另令溜琉榴硫餾留劉瘤流柳六龍聾嚨籠窿隆壟攏隴樓婁摟簍漏陋蘆盧顱廬爐擄鹵虜魯麓碌露路賂鹿潞祿錄陸戮驢呂鋁侶旅履屢縷慮氯律率濾綠巒攣孿灤卵亂掠略掄輪倫侖淪綸論蘿螺羅邏鑼籮騾裸落洛駱絡媽麻瑪碼螞馬罵嘛嗎埋買麥賣邁脈瞞饅蠻滿蔓曼慢漫謾芒茫盲氓忙莽貓茅錨毛矛鉚卯茂冒帽貌貿麽玫枚梅酶黴煤沒眉媒鎂每美昧寐妹媚門悶們萌蒙檬盟錳猛夢孟瞇醚靡糜迷謎彌米秘覓泌蜜密冪棉眠綿冕免勉娩緬面苗描瞄藐秒渺廟妙蔑滅民抿皿敏憫閩明螟鳴銘名命謬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌謀牟某拇牡畝姆母墓暮幕募慕木目睦牧穆拿哪吶鈉那娜納氖乃奶耐奈南男難囊撓腦惱鬧淖呢餒內嫩能妮霓倪泥尼擬妳匿膩逆溺蔫拈年碾攆撚念娘釀鳥尿捏聶孽嚙鑷鎳涅您檸獰凝寧擰濘牛扭鈕紐膿濃農弄奴努怒女暖虐瘧挪懦糯諾哦歐鷗毆藕嘔偶漚啪趴爬帕怕琶拍排牌徘湃派攀潘盤磐盼畔判叛乓龐旁耪胖拋咆刨炮袍跑泡呸胚培裴賠陪配佩沛噴盆砰抨烹澎彭蓬棚硼篷膨朋鵬捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片騙飄漂瓢票撇瞥拼頻貧品聘乒坪蘋萍平憑瓶評屏坡潑頗婆破魄迫粕剖撲鋪仆莆葡菩蒲埔樸圃普浦譜曝瀑期欺棲戚妻七淒漆柒沏其棋奇歧畦崎臍齊旗祈祁騎起豈乞企啟契砌器氣迄棄汽泣訖掐洽牽扡釬鉛千遷簽仟謙乾黔錢鉗前潛遣淺譴塹嵌欠歉槍嗆腔羌墻薔強搶橇鍬敲悄橋瞧喬僑巧鞘撬翹峭俏竅切茄且怯竊欽侵親秦琴勤芹擒禽寢沁青輕氫傾卿清擎晴氰情頃請慶瓊窮秋丘邱球求囚酋泅趨區蛆曲軀屈驅渠取娶齲趣去圈顴權醛泉全痊拳犬券勸缺炔瘸卻鵲榷確雀裙群然燃冉染瓤壤攘嚷讓饒擾繞惹熱壬仁人忍韌任認刃妊紉扔仍日戎茸蓉榮融熔溶容絨冗揉柔肉茹蠕儒孺如辱乳汝入褥軟阮蕊瑞銳閏潤若弱撒灑薩腮鰓塞賽叁傘散桑嗓喪搔騷掃嫂瑟色澀森僧莎砂殺剎沙紗傻啥煞篩曬珊苫杉山刪煽衫閃陜擅贍膳善汕扇繕墑傷商賞晌上尚裳梢捎稍燒芍勺韶少哨邵紹奢賒蛇舌舍赦攝射懾涉社設砷申呻伸身深娠紳神沈審嬸甚腎慎滲聲生甥牲升繩省盛剩勝聖師失獅施濕詩屍虱十石拾時什食蝕實識史矢使屎駛始式示士世柿事拭誓逝勢是嗜噬適仕侍釋飾氏市恃室視試收手首守壽授售受瘦獸蔬樞梳殊抒輸叔舒淑疏書贖孰熟薯暑曙署蜀黍鼠屬術述樹束戍豎墅庶數漱恕刷耍摔衰甩帥栓拴霜雙爽誰水睡稅吮瞬順舜說碩朔爍斯撕嘶思私司絲死肆寺嗣四伺似飼巳松聳慫頌送宋訟誦搜艘擻嗽蘇酥俗素速粟僳塑溯宿訴肅酸蒜算雖隋隨綏髓碎歲穗遂隧祟孫損筍蓑梭唆縮瑣索鎖所塌他它她塔獺撻蹋踏胎苔擡臺泰酞太態汰坍攤貪癱灘壇檀痰潭譚談坦毯袒碳探嘆炭湯塘搪堂棠膛唐糖倘躺淌趟燙掏濤滔絳萄桃逃淘陶討套特藤騰疼謄梯剔踢銻提題蹄啼體替嚏惕涕剃屜天添填田甜恬舔腆挑條迢眺跳貼鐵帖廳聽烴汀廷停亭庭挺艇通桐酮瞳同銅彤童桶捅筒統痛偷投頭透凸禿突圖徒途塗屠土吐兔湍團推頹腿蛻褪退吞屯臀拖托脫鴕陀馱駝橢妥拓唾挖哇蛙窪娃瓦襪歪外豌彎灣玩頑丸烷完碗挽晚皖惋宛婉萬腕汪王亡枉網往旺望忘妄威巍微危韋違桅圍唯惟為濰維葦萎委偉偽尾緯未蔚味畏胃餵魏位渭謂尉慰衛瘟溫蚊文聞紋吻穩紊問嗡翁甕撾蝸渦窩我斡臥握沃巫嗚鎢烏汙誣屋無蕪梧吾吳毋武五捂午舞伍侮塢戊霧晤物勿務悟誤昔熙析西硒矽晰嘻吸錫犧稀息希悉膝夕惜熄烯溪汐犀檄襲席習媳喜銑洗系隙戲細瞎蝦匣霞轄暇峽俠狹下廈夏嚇掀鍁先仙鮮纖鹹賢銜舷閑涎弦嫌顯險現獻縣腺餡羨憲陷限線相廂鑲香箱襄湘鄉翔祥詳想響享項巷橡像向象蕭硝霄削哮囂銷消宵淆曉小孝校肖嘯笑效楔些歇蠍鞋協挾攜邪斜脅諧寫械卸蟹懈泄瀉謝屑薪芯鋅欣辛新忻心信釁星腥猩惺興刑型形邢行醒幸杏性姓兄兇胸匈洶雄熊休修羞朽嗅銹秀袖繡墟戌需虛噓須徐許蓄酗敘旭序畜恤絮婿緒續軒喧宣懸旋玄選癬眩絢靴薛學穴雪血勛熏循旬詢尋馴巡殉汛訓訊遜迅壓押鴉鴨呀丫芽牙蚜崖衙涯雅啞亞訝焉咽閹煙淹鹽嚴研蜒巖延言顏閻炎沿奄掩眼衍演艷堰燕厭硯雁唁彥焰宴諺驗殃央鴦秧楊揚佯瘍羊洋陽氧仰癢養樣漾邀腰妖瑤搖堯遙窯謠姚咬舀藥要耀椰噎耶爺野冶也頁掖業葉曳腋夜液壹壹醫揖銥依伊衣頤夷遺移儀胰疑沂宜姨彜椅蟻倚已乙矣以藝抑易邑屹億役臆逸肄疫亦裔意毅憶義益溢詣議誼譯異翼翌繹茵蔭因殷音陰姻吟銀淫寅飲尹引隱印英櫻嬰鷹應纓瑩螢營熒蠅迎贏盈影穎硬映喲擁傭臃癰庸雍踴蛹詠泳湧永恿勇用幽優悠憂尤由郵鈾猶油遊酉有友右佑釉誘又幼迂淤於盂榆虞愚輿余俞逾魚愉渝漁隅予娛雨與嶼禹宇語羽玉域芋郁籲遇喻峪禦愈欲獄育譽浴寓裕預豫馭鴛淵冤元垣袁原援轅園員圓猿源緣遠苑願怨院曰約越躍鑰嶽粵月悅閱耘雲鄖勻隕允運蘊醞暈韻孕匝砸雜栽哉災宰載再在咱攢暫贊贓臟葬遭糟鑿藻棗早澡蚤躁噪造皂竈燥責擇則澤賊怎增憎曾贈紮喳渣劄軋鍘閘眨柵榨咋乍炸詐摘齋宅窄債寨瞻氈詹粘沾盞斬輾嶄展蘸棧占戰站湛綻樟章彰漳張掌漲杖丈帳賬仗脹瘴障招昭找沼趙照罩兆肇召遮折哲蟄轍者鍺蔗這浙珍斟真甄砧臻貞針偵枕疹診震振鎮陣蒸掙睜征猙爭怔整拯正政幀癥鄭證芝枝支吱蜘知肢脂汁之織職直植殖執值侄址指止趾只旨紙誌摯擲至致置幟峙制智秩稚質炙痔滯治窒中盅忠鐘衷終種腫重仲眾舟周州洲謅粥軸肘帚咒皺宙晝驟珠株蛛朱豬諸誅逐竹燭煮拄矚囑主著柱助蛀貯鑄築住註祝駐抓爪拽專磚轉撰賺篆樁莊裝妝撞壯狀椎錐追贅墜綴諄準捉拙卓桌琢茁酌啄著灼濁茲咨資姿滋淄孜紫仔籽滓子自漬字鬃棕蹤宗綜總縱鄒走奏揍租足卒族祖詛阻組鉆纂嘴醉最罪尊遵昨左佐柞做作坐座錒噯嬡璦曖靄諳銨鵪媼驁鰲鈀唄鈑鴇齙鵯賁錛蓽嗶潷鉍篳蹕芐緶籩驃颮飆鏢鑣鰾儐繽檳殯臏鑌髕鬢稟餑鈸鵓鈽驂黲惻鍤儕釵囅諂讖蕆懺嬋驏覘禪鐔倀萇悵閶鯧硨傖諶櫬磣齔棖檉鋮鐺飭鴟銃儔幬讎芻絀躕釧愴綞鶉輟齪鶿蓯驄樅輳攛銼鹺噠韃駘紿殫賧癉簞讜碭襠燾鐙糴詆諦綈覿鏑巔鈿癲銚鯛鰈鋌銩崠鶇竇瀆櫝牘篤黷籪懟鐓燉躉鐸諤堊閼軛鋨鍔鶚顎顓鱷誒邇鉺鴯鮞鈁魴緋鐨鯡僨灃鳧駙紱紼賻麩鮒鰒釓賅尷搟紺戇睪誥縞鋯紇鎘潁亙賡綆鯁詬緱覯詁轂鈷錮鴣鵠鶻鴰摑詿摜鸛鰥獷匭劌媯檜鮭鱖袞緄鯀堝咼幗槨蟈鉿闞絎頡灝顥訶闔蠣黌訌葒閎鱟滸鶘驊樺鏵奐繯鍰鯇鰉詼薈噦澮繢琿暉諢餛閽鈥鑊訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽郟浹鋏鎵蟯諫縑戔戩瞼鶼筧鰹韉絳韁撟嶠鷦鮫癤頜鮚巹藎饉縉贐覲剄涇逕弳脛靚鬮鳩鷲詎屨櫸颶鉅鋦窶齟錈鐫雋譎玨皸剴塏愾愷鎧鍇龕閌鈧銬騍緙軻鈳錁頷齦鏗嚳鄶噲膾獪髖誆誑鄺壙纊貺匱蕢憒聵簣閫錕鯤蠐崍徠淶瀨賚睞錸癩籟嵐欖斕鑭襤閬鋃嘮嶗銠鐒癆鰳誄縲儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧蘞奩瀲璉殮褳襝鰱魎繚釕鷯藺廩檁轔躪綾欞蟶鯪瀏騮綹鎦鷚蘢瀧瓏櫳朧礱僂蔞嘍嶁鏤瘺耬螻髏壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸臠孌欒鸞鑾圇犖玀濼欏腡鏍櫚褸鋝嘸嘜嬤榪勱縵鏝顙鰻麼捫燜懣鍆羋謐獼禰澠靦黽緲繆閔緡謨驀饃歿鏌鉬鐃訥鈮鯢輦鯰蔦裊隉蘗囁顢躡苧嚀聹儂噥駑釹儺謳慪甌蹣皰轡紕羆鈹諞駢縹嬪釙鏷鐠蘄騏綺榿磧頎頏鰭僉蕁慳騫繾槧鈐嬙檣戧熗錆鏘鏹羥蹌誚譙蕎繰磽蹺愜鍥篋鋟撳鯖煢蛺巰賕蟣鰍詘嶇闃覷鴝詮綣輇銓闋闕愨蕘嬈橈飪軔嶸蠑縟銣顰蜆颯毿糝繅嗇銫穡鎩鯊釃訕姍騸釤鱔坰殤觴厙灄畬詵諗瀋謚塒蒔弒軾貰鈰鰣綬攄紓閂鑠廝駟緦鍶鷥藪餿颼鎪謖穌誶蓀猻嗩脧闥鉈鰨鈦鮐曇鉭錟頇儻餳鐋鏜韜鋱緹鵜闐糶齠鰷慟鈄釷摶飩籜鼉媧膃紈綰輞諉幃闈溈潿瑋韙煒鮪閿萵齷鄔廡憮嫵騖鵡鶩餼鬩璽覡硤莧薟蘚峴獫嫻鷴癇蠔秈躚薌餉驤緗饗嘵瀟驍綃梟簫褻擷紲纈陘滎饈鵂詡頊諼鉉鏇謔澩鱈塤潯鱘埡婭椏氬厴贗儼兗讞懨閆釅魘饜鼴煬軺鷂鰩靨謁鄴曄燁詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤銦癮塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌鏞蕕銪魷傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬櫞鳶黿鉞鄆蕓惲慍紜韞殞氳瓚趲鏨駔賾嘖幘簀譖繒譫詔釗謫輒鷓湞縝楨軫賑禎鴆諍崢鉦錚箏騭櫛梔軹輊贄鷙螄縶躓躑觶鍾紂縐佇櫧銖囀饌顳騅縋諑鐲諮緇輜貲眥錙齜鯔傯諏騶鯫鏃纘躦鱒訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇'
        },
        lang='s',
        pattern_s=/^zh-cn$/i,
        pattern_t=/^zh-tw|zh-hk$/i,
        btn=getEl('#stBtn'),
        wrap = document,
        browserLang=(navigator.language ||　navigator.browserLanguage).toLowerCase(),
        getC=gar.cookieUtil.get,
        setC=gar.cookieUtil.set,
        cookie=getC('lang'),
        deltaTime=7.2e+6,
        isSupportNodeIterator= (typeof document.createNodeIterator === 'function'),
        node,
        oSAlgor,
        localeStorage;

    if(!btn) return;

    //searchAlgorithm
    var sAlgor={
        linear:function (data,target) {
            var index=false;
            gar.duffDevice(data,function (item) {
                if(item === target) return index = data.indexOf(item);
            });
            return index;
        },
        binary:function (data,target) {
            var start=0,end=data.length-1,mid;
            while(start <= end){
                mid = (start+end) >> 1;
                if(data[mid].localeCompare(target) < 0) start = mid + 1;
                else if(data[mid].localeCompare(target) > 0) end = mid - 1;
                else return data[mid];
            }
            return false;
        },
        bubbleS:function (arr) {
            var i =arr.length-1,pos,j,arr=arr;
            while(i){
                pos=0;
                for(j=0;j<i;j++){
                    if(arr[j+1].localeCompare(arr[j]) < 0)
                        throw new Error(-1);
                }
                i=pos;
            }
        }
    };

    //detect localCompare function is right or not
    var isSupportLocaleCompare= function () {
        var flag;
        try{
            sAlgor.bubbleS(dic.s_order) && sAlgor.bubbleS(dic.t_order);
            flag = true;
        }catch(e){
            flag = false;
        }
        return flag;
    };

    //localeStorage
    try{
        localeStorage = gar.getLocalStorage();
        if(!localeStorage.st_Dictionary)
            gar.ajax({
                url:'/library/garModule/st_dictionary',
                method:'get',
                fn:function (result) {
                    localeStorage.st_Dictionary = result;
                    getDic();
                    isSupportLocaleCompare = isSupportLocaleCompare();
                }
            });
        else {
            getDic();
            isSupportLocaleCompare = isSupportLocaleCompare();
        }

        //get st_dictionary data
        function getDic() {
            var tmpDic = localeStorage.st_Dictionary.match(/\(s_order = (.+)\)[\n\r]+\(t_order = (.+)\)[\n\r]+\(s_obj = (.+)\)[\n\r]+\(t_obj = (.+)\)/);
            dic.s_order = tmpDic[1];
            dic.t_order = tmpDic[2];
            dic.s_obj = JSON.parse(tmpDic[3]);
            dic.t_obj = JSON.parse(tmpDic[4]);
        }
    }catch(e){
        confirm('请更换或升级浏览器版本以得到更好的用户体验，谢谢！');
    }

    //single char transform
    String.prototype.gar_STTran=function (langData) {
        var strL=this.length,i = -1,
            result = '',
            initType = (langData[13] === '爱' ? dic.TRADITIONAL_CHINESE : dic.SIMPLE_CHINESE),targetType = (langData[13] === '爱' ? dic.SIMPLE_CHINESE :
                dic.TRADITIONAL_CHINESE),
            _obj,_order;
        if(isSupportLocaleCompare){
            oSAlgor = sAlgor.binary;

            //dictionary that already ordered
            _obj = langData[13] === '爱' ? dic.t_obj : dic.s_obj;
            _order = langData[13] === '爱' ? dic.t_order : dic.s_order;

            while(++i < strL){
                //skip the char that is not chinese
                if(/[^\u4e00-\u9fa5]/.test(this[i])){
                    result += this[i];
                    continue;
                }
                tmp=oSAlgor(_order,this[i]);
                result += tmp && _obj[tmp] ? _obj[tmp] : this[i];
            }
        }else{
            oSAlgor = sAlgor.linear;
            while(++i < strL){
                //skip the char that is not chinese
                if(/[^\u4e00-\u9fa5]/.test(this[i])){
                    result += this[i];
                    continue;
                }
                tmpIndex=oSAlgor(initType,this[i]);
                result += tmpIndex ? targetType[tmpIndex] : this[i];
            }
        }
        return result;
    };

    //DOM iterator
    var st_tran=function () {
        var _data;
        //transition details
        var _typeToTran=function (item,fn,fn_args) {
            if(!item || (item.tagName && /^(br|hr|script|link)$/i.test(item.tagName) ) ) return;
            _data = typeof fn === 'function' ?  fn_args[0] : fn;
            if(item.alt && item.alt != '') item.alt = item.alt.gar_STTran(_data);
            if(item.value &&　item.value != '') item.value = item.value.gar_STTran(_data);
            if(item.placeholder &&　item.placeholder != '') item.placeholder = item.placeholder.gar_STTran(_data);
            if(item.nodeType === 3) item.data = item.data.gar_STTran(_data);
            else if(typeof fn === 'function' && fn_args[1] ){
                if( !fn_args[1].hasChildNodes() ) return;
                fn(_data, fn_args[1]);
            }
        },
        //iterator method -- createNodeIterator
            _nodeIterator=function (data) {
            iterator=document.createNodeIterator(wrap, NodeFilter.SHOW_ALL,null,false);
            node=iterator.nextNode();
            while(node !== null){
                _typeToTran(node,data);
                node=iterator.nextNode();
            }
        },
        //iterator method -- traditional DOM tree iterator
            _childNodesIterator=function (data,obj) {
            var iterator = typeof obj === 'object' ? obj.childNodes : wrap.childNodes;
            for(var l = iterator.length;l--;) _typeToTran(iterator[l],_childNodesIterator,[data,iterator[l] ]);
        };

        return function (langType) {
            if(isSupportNodeIterator){
                if(langType === 's')_nodeIterator(dic.SIMPLE_CHINESE);
                else _nodeIterator(dic.TRADITIONAL_CHINESE);
            }else{
                if(langType === 's')_childNodesIterator(dic.SIMPLE_CHINESE);
                else _childNodesIterator(dic.TRADITIONAL_CHINESE);
            }
        }
    }();

    btn.onclick=function () {
        if(getC('lang') === 's'){
            st_tran('t');
            setC('lang','t',Date.now ? Date.now()+deltaTime : new Date() + deltaTime );
            gar.setInnerText(this,'繁体');
        }else if(getC('lang') === 't'){
            st_tran('s');
            setC('lang','s',Date.now ? Date.now()+deltaTime : new Date() + deltaTime );
            gar.setInnerText(this,'简体');
        }
    };

    //init btn's innerText
    if(cookie){
        if(/^s$/.test(cookie)){
            st_tran('s');
            gar.setInnerText(btn,'简体');
        }else{
            st_tran('t');
            gar.setInnerText(btn,'繁体');
        }
    }else{
        if(pattern_s.test(browserLang)){
            gar.setInnerText(btn,'简体');
            setC('lang','s',Date.now ? Date.now()+deltaTime : new Date() + deltaTime );
        } else if(pattern_t.test(browserLang)){
            gar.setInnerText(btn,'繁体');
            setC('lang','t',Date.now ? Date.now()+deltaTime : new Date() + deltaTime );
        }
    }

    var self = this;
    //api - set wrap
    gar.component.setTS_wrap = function (wrap) {
        self.wrap = wrap;
    }

})(window);

/**
 * @name: form element choice
 */
!(function ($) {
    //elements type
    var types = {
        'text': function (title, id) {
            return '<li> ' +
                '<label for="' + id + '">' + title + ':</label> ' +
                '<input name="' + id + '" id="' + id + '" type="text"> ' +
                '</li>'
        },
        'password': function () {

        },
        'radio': function (title, id, dataArr) {
            /**
             * @param dataArr {
             *      checkedNum: <Number>,
             *      value: <Array>,
             *      innertext: <Array>
             * }
             */
            var inps = '';
            gar.each(dataArr['value'], function (i, item, len) {
                inps += ('<input' + (i+1 == dataArr.checkedNum[i] ? ' checked ' : '' ) + ' id="' + id + '-' + (i+1) +'" type="radio" name="' + id + '" value="' + dataArr.value[i] + '"><label for="' + id + '-' + (i+1) + '">' + dataArr.innertext[i] + '</label>');
            });
            console.log(dataArr);
            return '<li> ' +
                '<label >' + title + ':</label> ' +
                (dataArr.mobile ? '<div>' : '') +
                    inps +
                (dataArr.mobile ? '</div>' : '') +
                '</li>';
        },
        'checkbox': function (title, id, dataArr) {
            /**
             * @param dataArr {
             *      checkedNum: <Array>,
             *      value: <Array>,
             *      innertext: <Array>
             * }
             */
            var checkbox = '';
            gar.each(dataArr['value'], function (i, item, len) {
                checkbox += '<input type="checkbox" ' + (i+1 == dataArr.checkedNum[i] ? ' checked ' : '' ) + 'id="' + id + '-' + (i+1) + '" name="' + id + '" value="' + dataArr.innertext[i] + '"><label for="' + id + '-' + (i+1) + '">' + dataArr.innertext[i] + '</label>';
            });
            return '<li> ' +
                '<label>' + title + '</label>' +
                (dataArr.mobile ? '<div>' : '') +
                checkbox +
                (dataArr.mobile ? '</div>' : '') +
                ' </li>';
        },
        'select': function (title, id, dataArr) {
            /**
             * @param dataArr {
             *      checkedNum: <Array>,
             *      value: <Array>,
             *      innertext: <Array>
             * }
             */
            var options = '';
            gar.each(dataArr['value'], function (i, item, le) {
                options += '<option id="' + id + '-' + i + '" value="' + dataArr.value[i] + '"' + (i+1 == dataArr.checkedNum[i] ? ' selected ' : '') +'>' + dataArr.innertext[i] + '</option>';
            });
            return '<li> ' +
                '<label for="' + id + '">' + title + '</label> ' +
                '<select name="' + id + '" id="' +id + '"> ' +
                options +
                '</select> ' +
                '</li>';
        },
        'textarea': function (title, id, dataArr) {
            /**
             * @second choice : <textarea contenteditable="true" name="q5" id="q5" ></textarea>
             */
            //return dataArr.mobile ?
            return 'textarea' ?
                (
                    '<li > ' +
                    '<label class="gar-labelTxtA" for="' + id + '">' + title + '</label><br>' +
                    '<textarea  name="' + id + '" id="' + id + '" ></textarea>' +
                    ' </li>'
                ) :
                (
                    '<li > ' +
                '<label class="gar-labelTxtA" for="' + id + '">' + title + '</label><br>' +
                '<p name="' + id + '" id="' + id + '" contenteditable="true"></p> ' +
                '</li>'
                ) ;

        }
    };

    //create li innertext
    $.CreateForm = function () {};
    var fn = $.CreateForm.prototype;

    fn.createList =function (dataArr) {
        var i = -1 , l = dataArr.length, result = '', item, type, args;
        while(++i < l){
            item = dataArr[i];
            type = item[0];
            args = item.slice(1, item.length);
            console.log(args);
            result += types[ type ](args[0], 'q'+args[1].id, args[1]); // title, id, dataArr
        }
        return result;
    };
    fn.init = function (pNode,dataArr) {
        pNode.innerHTML = this.createList(dataArr);
    }


})(window.gar.component);

