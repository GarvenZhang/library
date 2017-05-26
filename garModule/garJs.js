/**
 * Created by John Gorven on 2017/2/10.
 */
/**
 * component name:form validate
 */
!!(function ($) {
    $.validator4F=function () {this.cache=[];};
    var fn=$.validator4F.prototype;
    fn.add=function (dom,rule,errorMsg) {
        var ary=rule.split(':');
        this.cache.push(function () {
            var strategy=ary.shift();
            ary.unshift(dom.value);
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
                    strategyAry.unshift(dom.value);
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
!!(function ($) {
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
!!(function () {
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
    for(var aInp=document.querySelectorAll('input'), l=aInp.length;l--;)
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
!!(function ($) {
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
!!(function () {
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
        this.wrap=wrap;
        this.table=table;
        this.beginPageIndex=data.beginPageIndex||1;
        this.currentPage=data.currentPage||1;
        this.endPageIndex=data.endPageIndex||1;
        this.pageCount=data.pageCount||0;
        this.pageSize=data.pageSize||0;
        this.recordCount=data.recordCount||0;
        this.recordList=data.recordList||[];
        this.pCtn=null;
        this.pICtn=null;
        this.pI=this.pageSize||0;
        this.pE=new gar.component.CustomEvent();
        this.updateTB=null;
        this.version=version||'chineseVersion';
    };
    var fn=$.Pagination.prototype;
    fn.defaults={
        chineseVersion:['上一页','页','下一页'],
        englishVersion:['Previous','page','Next']
    };
    fn.createStru=function () {
        this.wrap.innerHTML='<a class="fl" href="javascript:;">'+this.defaults[this.version][0]+'</a>' +
            '<div></div>' +
            '<div></div>' +
            '<a class="fr" href="javascript:;">'+this.defaults[this.version][2]+'</a>';
        this.pCtn=this.wrap.querySelectorAll('div')[0];
        this.pICtn=this.wrap.querySelectorAll('div')[1];
    };
    fn.choosePI=function () {
        var _pI=this.pI,_pICtn=this.pICtn;
        _pICtn.innerHTML='<input  type="button" value="'+_pI+'"><small>/'+this.defaults[this.version][1]+'</small> ' +
            '<ul class="hide">' +
            ' <li><small>'+_pI+'</small></li>' +
            ' <li><small>'+(_pI+10)+'</small></li> ' +
            '<li><small>'+(_pI+20)+'</small></li> ' +
            '</ul>';
        var aLi=_pICtn.querySelectorAll('li'),
            oInp=_pICtn.querySelector('input');
        gar.reverseEach(aLi,function (i, item, len) {
            gar.addHandler(item,'click',function (e) {
                e=gar.getEvent(e);
                oInp.value=gar.getInnerText(gar.getTarget(e));
            },false);
        });
    };
    fn.paginate=function () {
        //release previous click event
        if(this.pCtn)
            gar.reverseEach(this.pCtn,function (i, item, len) {
                item.onclick=null;
            });
        //calc
        var pages=this.pageCount,
            nP=this.currentPage,
            endP=this.endPageIndex,
            _pCtn=this.pCtn,
            html='',self=this;
        if(pages<=6){
            var i=1;
            while(i<=endP){
                html+='[<a href="javascript:;">'+i+'</a>]&nbsp;';
                ++i;
            }
        } else {
            if(nP<=2){
                var i =1;
                while(i<=4){
                    html+='[<a href="javascript:;">'+i+'</a>]&nbsp;';
                    ++i;
                }
                html+='<span>...</span>';
            }else if(nP>2&&nP+4<endP){
                html+='<span>...</span>';
                var i =1;
                while(i<=4){
                    html+='[<a href="javascript:;">'+(nP-2+i)+'</a>]&nbsp;';    // [...]  1 + nP + 2  [...]
                    ++i;
                }
                html+='<span>...</span>';
            }else if(nP+4>=endP){
                html+='<span>...</span>';
                var i =1;
                while(i<=4){
                    html+='[<a href="javascript:;">'+(nP-2+i)+'</a>]&nbsp;';
                    ++i;
                }
            }
            html+='[<a href="javascript:;">'+endP-1+'</a>]' +
                '[<a href="javascript:;">'+endP+'</a>]';
        }
        _pCtn.innerHTML=html;

        //add new click event
        gar.reverseEach(this.pCtn,function (i,item,len) {
            item.onclick=function (e) {
                self.pE.trigger('updateMsg');
                self.paginate();
                self.changeStatus(e);
            };
        });
    };
    fn.changeStatus=function (e) {
        //reset situation
        gar.reverseEach(this.pCtn,function (i, item, len) {
            item.className='';
        });
        e=gar.getEvent(e);
        var tar=gar.getRelatedTarget(e);
        tar.className='garPStatus';
        this.currentPage=parseInt(tar.innerHTML);
    };
    fn.updateTable=function () {
        if(!this.updateTB){
            this.updateTB();
        }
    };
    fn.setUpdateTableFn=function (fn) {
        this.updateTB=fn||function () {
                //..
            };
    };
    fn.updateMsg=function (fn) {
        var self=this;
        var _updateMsg=(function () {
            var _self=self;
            return function () {
                fn.call(_self,function (result) {
                    //update msg
                    _self.beginPageIndex=result.beginPageIndex||_self.beginPageIndex;
                    _self.currentPage=result.currentPage||_self.currentPage;
                    _self.endPageIndex=result.endPageIndex||_self.endPageIndex;
                    _self.pageCount=result.pageCount||_self.pageCount;
                    _self.pageSize=result.pageSize||_self.pageSize;
                    _self.recordCount=result.recordCount||_self.recordCount;
                    _self.recordList=result.recordList||_self.recordList;
                    //update table data
                    _self.updateTable.call(_self);
                },{
                    pageSize:_self.pICtn.querySelector('input').innerHTML,
                    pageNum:function () {
                        var index=1;
                        gar.reverseEach(_self.pCtn,function (i, item, len) {
                            if(/garPStatus/.test(item.className)){
                                index=item.innerHTML;
                            }
                        });
                        return index;
                    }
                });
            }
        });
        this.pE.listen('updateMsg',_updateMsg);
    };
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
 *      $.model=[{...}]
 *      $gRepeatEvent.trigger('gRepeatEvent');
 */
!!(function ($) {//
    $.model={};
    $.view={};
    $.gRepeatDirective=function () {
        var doc=document,
            aWrap=doc.querySelectorAll('[g-repeat]'),
            aScope={};
        $.customEvents.gRepeatEvent=new gar.component.CustomEvent();

        //do
        var replace=function () {
            gar.each(aWrap,function (i, item, len,index) {
                var outHtml=gar.getOuterHTML(item),
                    scopeName=outHtml.match(/ g-repeat=[\'|\"].+in (.+)[\'|\"]/)[1];
                if(!scopeName)throw new TypeError('gRepeat directive');

                scopeName = /\./g.test(scopeName) ? scopeName.replace(/\./g,'') : scopeName;
                aScope[scopeName] = gar.isType(aScope[scopeName],'array') ? aScope[scopeName] : [];

                outHtml=outHtml.replace(/ g-repeat/,' g-repeatID=\''+i+'\' g-repeat');

                $.view[i] = aScope[scopeName][i] = $.model[scopeName] ? outHtml : 'undefined';
            });

            gar.each(aScope,function (i, item, len) {
                for (var l=item.length,item0,j=0;j<l;++j){
                    item0=item[j];
                    if(!item0 || /undefined/.test(item0) )continue;

                    var modelData=$.model[i], // must be an Array
                        htmlArr=new Array,
                        result='';

                    gar.each(modelData,function (i, item1, len) {
                        htmlArr.push({
                            view:item0,
                            model:item1
                        });
                    });

                    gar.each(htmlArr,function (i, item, len) {
                        var _view=item.view,
                            _model=item.model,
                            _item=_view.match(/ g-repeat=[\'|\"](.+) in/)[1];

                        result += _view.replace(new RegExp('\\(\\('+_item+'\\.(.+)\\)\\)','g'),function () {
                            return _model[arguments[1]];
                        });

                    });
                    aWrap[j].parentNode.innerHTML=result;
                }

            });
        };
        return function () {
            //update
            if(JSON.stringify($.view) == '{}')replace();
            else
                gar.each($.view,function (i, item, len) {
                    var aRepeated=doc.querySelectorAll('[g-repeatID='+i+']');
                    gar.each(aRepeated,function (key, value, len,i) {
                        if(i==len-1)return;
                        doc.removeChild(item);
                    });
                    aRepeated[0].innerHTML=$.view[i];
                    replace();
                });
        }
    }();

    //listen
    $.customEvents.gRepeatEvent.listen('gRepeatEvent',$.gRepeatDirective);
    window.$gRepeatEvent=$.customEvents.gRepeatEvent;
})(window.gar.component);





























