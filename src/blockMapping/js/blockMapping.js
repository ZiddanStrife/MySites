// basic functional
function select(selection){return document.querySelector(selection)}
function getValue(selection){return select(selection).value;}
function setValue(selection, value){document.querySelector(selection).value = value;}

// ----------------
var timeOutFloater = undefined;
var timeOutNotifier = undefined;
var _blockMapObj = {
    getPosition: function(x, y, mapObj){
        let position = {
            x : x,
            y : y
        };
        let blockObj = mapObj.arrayBlock.find(t=>{return t.position.x == x && t.position.y});
        if(blockObj !== undefined){
            let left = (x+1)*blockObj.size.xSize, top = (y+1)*blockObj.size.ySize;
            position.topInt = top;
            position.leftInt = left;
            position.top = top + 'px';
            position.left = left + 'px';
        }
        return position;
    },
    moveListener: (x, y, blockObj, block)=>{
        let floater = select('.block-mapping-floater');
        floater.style.display = 'inline-block';
        let top = (x+1)*blockObj.size.xSize + "px", left = (y+1)*blockObj.size.ySize + "px";

        let bodyFloater, headerFloater;
        headerFloater = "<div align='center' style='text-decoration: underline'>Position</div>";
        bodyFloater = headerFloater + "<div>".concat(
            "X: ", x,"<br>",
            "Y: ", y, "<br>",
            "Top: ", top,"<br>",
            "Left: ", left,"<br>",
            "</div>"
        );
        _writeEl(floater, bodyFloater);
        clearTimeout(timeOutFloater);
        timeOutFloater = setTimeout(()=>{
            floater.style.display = 'none';
        }, 5000);
    },
    showNotif(text, displayTime){
        let notifier = select('.block-mapping-floater');
        notifier.innerHTML = "";
        notifier.style.display = "inline-block";
        let bodyNotifier = document.createElement("DIV");
        bodyNotifier.innerHTML = text;
        notifier.style.background = "grey";

        _appendChildEl(notifier, bodyNotifier);
        clearTimeout(timeOutNotifier);
        timeOutNotifier = setTimeout(()=>{
            notifier.style.display = 'none';
        }, displayTime);
    },
    zoom: function(type, mapObj){
        let parentElement = mapObj.mainEl().parentElement;
        if(mapObj.size.scale == undefined || mapObj.size.scalePercent == undefined){
            mapObj.size.scale = 0.7;
            mapObj.size.scalePercent = 0;
        }
        let inc = 0.1;

        if(type == 'in'){
            if(mapObj.size.scalePercent == 100)return _blockMapObj.showNotif(mapObj.size.scalePercent + "%", 1000);
            mapObj.size.scale = mapObj.size.scale + inc;
            mapObj.size.scalePercent = mapObj.size.scalePercent + 10;
        }else{
            if(mapObj.size.scalePercent == 0)return _blockMapObj.showNotif(mapObj.size.scalePercent + "%", 1000);
            mapObj.size.scale = mapObj.size.scale - inc;
            mapObj.size.scalePercent = mapObj.size.scalePercent - 10;
        }
        parentElement.style.transform = "scale(".concat(mapObj.size.scale, ")");
        _blockMapObj.showNotif(mapObj.size.scalePercent + "%", 1000);
    },
    className: 'block-map-item'
};
function _writeEl(elObj, inHtml){
    elObj.innerHTML = inHtml;
}
function _appendChildEl(elObj, nodeEl){
    elObj.appendChild(nodeEl);
}
function _finishEvent(mapObj){
    mapObj.reactiveArrayBlock = document.querySelectorAll('.block-map-item');
    var blockAll = mapObj.reactiveArrayBlock;
    let idx = 0;
    for(let block of blockAll){
        let obj = mapObj.arrayBlock[idx];
        block.className += " ceramic-default";
        if(mapObj.debugMode !== undefined && mapObj.debugMode){
            block.innerHTML = obj.position.x + " . " + obj.position.y;
            block.style.lineHeight = "12pt";
            block.style.paddingTop = "1%";
            block.style.boxSizing = "border-box";
            block.style.color = "black";
            block.style.cursor = "pointer";
        }
        mapObj._setConfigBlock(block, obj.position.x+"."+obj.position.y);
        block.onclick = ()=>{
            if(mapObj.debugMode !== undefined && mapObj.debugMode){
                _blockMapObj.moveListener(obj.position.x, obj.position.y, obj, block);
            }
            let sum = 100/(mapObj.size.totalY);
            let zoomCount = 100 - Math.round((obj.position.y+1) * sum);
            if(mapObj.size.scalePercent == undefined){
                mapObj.size.scalePercent = 0;
            }
            let loopSum = Math.round(zoomCount/10);
            if(String(zoomCount).length == 1)return _blockMapObj.zoom('out', mapObj);
            for(let obj of new Array(loopSum)){
                if(mapObj.size.scalePercent/10 < loopSum){
                    _blockMapObj.zoom('in', mapObj);
                }else{
                    _blockMapObj.zoom('out', mapObj);
                }
            }

            let top = ((obj.position.x+1)*obj.size.xSize)/mapObj.size.scale, left = ((obj.position.y+1)*obj.size.ySize)/mapObj.size.scale;
            window.scrollTo(top.toFixed(), left.toFixed());
        };
        idx++;
    }
}
function createMap(selection, mapOption, blockOption){
    if(blockOption == undefined){
        blockOption = {
            borderSize: 0.5,
            blockOpacity: 1,
        }
    };
    if(mapOption == undefined){
        mapOption = {
            size: {
                sizeType: "px",
                xSize: 1000,
                ySize: 1000,
                xBlockSize: 20,
                yBlockSize: 20,
                perspective: 1000,
            }
        }
    }
    var mapEl = select(selection);
    var mainEl = function(){
        return select(mapObj.id);
    }


    var mapObj = {
        mapEl: mapEl,
        id: selection,
        size: mapOption.size,
        blockOption: blockOption,
        arrayBlock: [],
        reactiveArrayBlock: [],
        mainEl: function(){
            return select(mapObj.id);
        },
        blockConfig: {
            list: []
        },
        debugMode: mapOption.debugMode
    }
    mapObj._createBreak = function(){
        let breakEl = document.createElement("BR");
        mapEl.appendChild(breakEl);
    }
    mapObj._setBlockOption = function(blockObj){
        let style = blockObj.style;
        let opt = this.blockOption;
        style.opacity = opt.blockOpacity;
        style.borderWidth = opt.borderSize + "px";
        style.background = opt.backgroundColor;
        return blockObj;
    }
    mapObj._processXY = function(szXY){
        let x = szXY.split('.')[0];
        let y = szXY.split('.')[1];
        return {x: x, y: y};
    }
    mapObj._processXYCollection = function(){
        if(this.blockOption.blockConfig == undefined)return;
        for(let blockConfig of this.blockOption.blockConfig){
            let lineId = blockConfig.lineId;
            for(let line of blockConfig.line){
                let lineObjFrom = mapObj._processXY(line.from);
                let lineObjTo = mapObj._processXY(line.to);
                if(lineObjFrom.x == lineObjTo.x && lineObjFrom.y !== lineObjTo.y){
                    let startIdx = Number(lineObjFrom.y);
                    let endIdx = Number(lineObjTo.y) + 1;
                    for(let obj of new Array(endIdx)){
                        if(startIdx == endIdx)continue;
                        mapObj.blockConfig.list.push({x: Number(lineObjFrom.x), y: startIdx, className: line.class, value: lineObjFrom.x + "." + startIdx});
                        startIdx++;
                    }
                }else if(lineObjFrom.y == lineObjTo.y && lineObjFrom.x !== lineObjTo.x){
                    let startIdx = Number(lineObjFrom.x);
                    let endIdx = Number(lineObjTo.x) + 1;
                    for(let obj of new Array(endIdx)){
                        if(startIdx == endIdx)continue;
                        mapObj.blockConfig.list.push({y: Number(lineObjFrom.y), x: startIdx, className: line.class, value:   startIdx + "." + lineObjFrom.y});
                        startIdx++;
                    }
                }
            }
        }
        console.log('blockConfigProcessed', mapObj.blockConfig);
    }

    mapObj._setConfigBlock = function(blockObj, value){
        let findValue = this.blockConfig.list.find(t=>{return t.value == value});
        if(findValue !== undefined){
            blockObj.className += " " + findValue.className; 
        }
    }

    mapObj._createBlock = function(xIdx, yIdx){
        let block = document.createElement("DIV");
        block.className = "block-map-item";
        block.size = {
            xSize: mapObj.size.xBlockSize,
            ySize: mapObj.size.yBlockSize,
            borderSize2x: this.blockOption.borderSize
        }
        block.style.width = (mapObj.size.xBlockSize - (this.blockOption.borderSize *2)) + mapObj.size.sizeType;
        block.style.height = (mapObj.size.yBlockSize - (this.blockOption.borderSize *2)) + mapObj.size.sizeType;
        let idx = this.arrayBlock.length;
        block.idx = idx;
        block.position = {
            x: xIdx,
            y: yIdx,
            value: xIdx+'.'+yIdx
        }

        block = this._setBlockOption(block);
        mapEl.appendChild(block);

        this.arrayBlock.push(block);
        // block.innerHTML = "New Block";
    }
    mapObj.generateWall = function(){
        let el = select(mapObj.id);
        let size = this.size;
        // elParent.innerHTML = "<div class='wall'></div>" + elParent.innerHTML;

        // every wall
        let wallBack = document.createElement("DIV");
        wallBack.className = "wall-back wall";
        wallBack.style.width = size.xSize + size.sizeType;
        wallBack.style.height = size.ySize/2 + size.sizeType;
        wallBack.style.transform = "rotateX(0deg) ".concat(
            "translateZ(-",size.ySize/2,"px) ",
            "translateY(-",100,"px) ",
        );
        el.before(wallBack);

        let wallLeft = document.createElement("DIV");
        wallLeft.className = "wall-left wall";
        wallLeft.style.width = size.ySize + size.sizeType;
        wallLeft.style.height = size.ySize/2 + size.sizeType;
        wallLeft.style.transform = "rotateY(90deg) ".concat(
            "translateZ(-",size.ySize/2,"px) ",
            "translateY(-",100,"px) ",
        );
        el.before(wallLeft);

        let wallRight = document.createElement("DIV");
        wallRight.className = "wall-right wall";
        wallRight.style.width = size.ySize + size.sizeType;
        wallRight.style.height = size.ySize/2 + size.sizeType;
        wallRight.style.transform = "rotateY(-90deg) ".concat(
            "translateZ(-",size.ySize*2,"px) ",
            "translateY(-",100,"px) ",
        );
        el.before(wallRight);
    }

    mapObj.generateMap = function(){
        mapEl.style.display = "inline-block";
        mapEl.style.lineHeight = "0px";
        mapEl.style.width = this.size.xSize + this.size.sizeType;
        mapEl.style.height = this.size.ySize + this.size.sizeType;
        

        let x = this.size.xSize / this.size.xBlockSize;
        let y = this.size.ySize / this.size.yBlockSize;
        if(String(x).includes(".")){
            x = Math.round(x) -1;
        }
        if(String(y).includes(".")){
            y = Math.round(y) -1;
        }
        
        let yInc = 0;
        for(let yList of new Array(y)){
            let xInc = 0;
            for(let xList of new Array(x)){
                this._createBlock(xInc, yInc);
                xInc++;
            }
            yInc++;
            this._createBreak();
        }
        this.size.totalX = x;
        this.size.totalY = y;

        this._createFloater();
        this._createZoomer();

        this._processXYCollection();
        _finishEvent(this);
        mapObj.generateWall();

        if(this.size.perspective == undefined){
            mapObj.perSpectiveMode(false);
        }else{
            mapObj.perSpectiveMode(true);
            mainEl().parentElement.style.perspective = this.size.perspective + this.size.sizeType;
        }
    }

    mapObj._createZoomer = function(){
        let zoomer = document.createElement("SPAN");
        zoomer.className = "block-map-zoomer";

        let item = document.createElement("SPAN");
        item.className = "block-map-zoomer-item";
        item.innerText = "+";
        item.onclick = ()=>{_blockMapObj.zoom('in', mapObj)};
        zoomer.appendChild(item);

        zoomer.appendChild(document.createElement("BR"));
        
        let item2 = document.createElement("SPAN");
        item2.className = "block-map-zoomer-item";
        item2.innerText = "-";
        item2.onclick = ()=>{_blockMapObj.zoom('out', mapObj)};
        zoomer.appendChild(item2);        

        document.body.appendChild(zoomer);
    }

    mapObj._createFloater = function(){
        let innerEl = "<div class='floater-body'></div>";
        let floater = "<span class='block-mapping-floater'>"+innerEl+"</span>";

        document.body.innerHTML += floater;
    }
    mapObj.perSpectiveMode = function(bool){
        let elParent = select(mapObj.id).parentElement;
        let el = select(mapObj.id);
        if(bool){
            elParent.className += " body-perspective";
            el.className += " perspective-class";
        }else{
            elParent.className = elParent.className.replace(" body-perspective", "");
            el.className = el.className.replace(" perspective-class", "");
        }
    }

    // object creater
    mapObj._createCube = function(size, backgroundColor, opacity, borderColor){
        let objectData = _newObjectMedia(size, size, 'px');
        let objectStd = _newObjectStandar(size, size, 'px');
        let objectFaceList = [];

        let objectFace1 = _newObjectFace(size, size, 'px', 180, undefined);
        objectFaceList.push(objectFace1);

        let objectFace2 = _newObjectFace(size, size, 'px', 90, undefined);
        objectFaceList.push(objectFace2);

        let objectFace3 = _newObjectFace(size, size, 'px', -90, undefined);
        objectFaceList.push(objectFace3);

        let objectFace4 = _newObjectFace(size, size, 'px', 180, undefined);
        objectFaceList.push(objectFace4);

        let idx = 1;
        for(let objFace of objectFaceList){
            objFace.style.border = "1px solid " + borderColor;
            objFace.style.opacity = opacity;
            objFace.style.background = backgroundColor;
            objFace.name = 'face'+idx;
            
            objectStd.appendChild(objFace);
            idx++;
        }

        objectData.appendChild(objectStd);
        objectData.objectType = 'cube';
        objectData.size = size;
        objectData.sizeType = 'px';
        return objectData;
    }
    mapObj.createObject = function(objectType, option){
        // object type : grass , tree, building, cube , ball
        var objectData = undefined;
        if(option !== undefined){
            if(objectType == 'cube'){
                objectData = mapObj._createCube(option.size, option.backgroundColor, option.opacity, option.borderColor);
            };
        }
        return objectData;
    }


    // object mover

    mapObj.moveCube = function(objData, cordinateObj){
        let mapPosition = _blockMapObj.getPosition(cordinateObj.x, cordinateObj.y , this);
        _styleConfigure(objData, {
            left: mapPosition.leftInt + 195 + 'px'
        });
        let yBlockSize = this.size.yBlockSize;

        let faceList = objData.children[0].children;
        let face1 = faceList.find(t=>{return t.name == 'face1'});
        let face2 = faceList.find(t=>{return t.name == 'face2'});
        let face3 = faceList.find(t=>{return t.name == 'face3'});
        let face4 = faceList.find(t=>{return t.name == 'face4'});
        let duplicator = objData.size / 100;
        let startY1;
        if(duplicator > 0.9){
            startY1 = - ((this.size.ySize/2) + (yBlockSize*duplicator));
        }else{
            startY1 = - ((this.size.ySize/2) + (yBlockSize*1));
        }
        startY1 = startY1+2;
        _styleConfigure(face1, {transforms:{
            translateZ: 'translateZ('+ -(startY1 + objData.size + mapPosition.topInt) +'px)'
        }});
        let startY4 = - (this.size.ySize/2 + yBlockSize);
        startY4 = startY4+2;

        _styleConfigure(face4, {transforms:{
            translateZ: 'translateZ('+ -(startY4 + mapPosition.topInt)+'px)'
        }});

        let yBlockSizeExt = 0;
        if(duplicator < 1){
            yBlockSizeExt = -yBlockSize/2;
        }
        _styleConfigure(face2, {transforms:{
            translateY: 'translateY('+(startY4 + mapPosition.topInt + yBlockSize + yBlockSizeExt)+'px)'
        }});
        _styleConfigure(face3, {transforms:{
            translateY: 'translateY('+ -(startY4 + mapPosition.topInt + yBlockSize + yBlockSizeExt)+'px)'
        }});
    }

    mapObj.moveObjectTo = function(objData, cordinateObj){
        if(objData.objectType == 'cube'){
            mapObj.moveCube(objData, cordinateObj);
        }
    }

    // object insert

    mapObj.putInObject = function(objectData, option){
        if(option !== undefined){
            let obj = {
                style: option.style == undefined ? {} : option.style,
                bottom: option.bottom, 
            };
            obj.style.bottom = option.bottom;
            _styleConfigure(objectData, obj.style);

            if(option.position !== undefined){
                mapObj.moveObjectTo(objectData, option.position);
            }
        }
        mapObj.mainEl().parentElement.appendChild(objectData);
    }

    return mapObj;
}

function _transformConfigure(styleObj , transformType, transformValue){
    let splitList = styleObj.style.transform.split(' ');
    let transformObjValue = splitList.find(val => {return val.includes(transformType)});
    if(transformObjValue !== undefined){
        styleObj.style.transform = styleObj.style.transform.replace(transformObjValue, '');
        styleObj.style.transform += " " + transformValue;
    }else{
        styleObj.style.transform += " " + transformValue;
    }
}
function _styleConfigure(objectData, styleObj){
    for(let prop in styleObj){
        if(prop == 'transforms'){
            for(let prop2 in styleObj[prop]){
                _transformConfigure(objectData, prop2, styleObj[prop][prop2]);
            }
        }else{
            objectData.style[prop] = styleObj[prop];
        }
    }
}

function _newObjectRender(xSize, ySize, sizeType){
    let objectRender = document.createElement('span');
    objectRender.style.width = xSize + sizeType;
    objectRender.style.height = ySize + sizeType;
    return objectRender;
}
function _newObjectFace(xSize, ySize, sizeType, rotateX, rotateY){
    let objectFace = _newObjectRender(xSize, ySize, sizeType);
    objectFace.className = "standar-object-face";
    objectFace.style.transform = "".concat(
        "rotateX(",rotateX == undefined ? '0': rotateX,"deg) ",
        "rotateY(",rotateY == undefined ? '0': rotateY,"deg) ",
        "translateZ(",ySize/2, sizeType,") "
    )
    return objectFace;
}

function _newObjectMedia(xSize, ySize, sizeType){
    let objectMedia = _newObjectRender(xSize, ySize, sizeType);
    objectMedia.className = "standar-object-media";
    return objectMedia;
}

function _newObjectStandar(xSize, ySize, sizeType){
    let objectStandar = _newObjectRender(xSize, ySize, sizeType);
    objectStandar.className = "standar-object-class";
    return objectStandar;
}

HTMLCollection.prototype.find = Array.prototype.find;