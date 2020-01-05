var zeeJs = {

}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function select(selector){
    return document.querySelector(selector)
}
function valuateData(selection){
    return selection;
}
function importFile(url, callback){
    let objFile = new XMLHttpRequest();
    objFile.onreadystatechange = function(res){
        if(res.target.status == 200 && res.target.readyState == 4){
            callback(res.target.responseText);
            // console.log(res.target);
        }
    }
    objFile.open("GET", url, true);
    objFile.send(null);
}

function importAll(){
    let importerAll = document.querySelectorAll('import-el');

    for(let imp of importerAll){
        importFile(imp.attributes.src.value, (el)=>{
            let obj = document.createElement('div');
            obj.innerHTML = el;
            if(obj.children.length < 1)return console.log('import-el', 'With id', imp.id, "not have html element to render");
            imp.parentElement.appendChild(obj.children[0]);
            if(imp.parentElement.lastElementChild.children[imp.parentElement.lastElementChild.children.length-1].tagName == "SCRIPT"){
                eval(imp.parentElement.lastElementChild.children[imp.parentElement.lastElementChild.children.length-1].innerText);
            }
            let selectIdx = imp.parentElement.children.deleteUsingEquality(item=>{
                if(item.attributes.src !== undefined){
                    return item.attributes.src.value == imp.attributes.src.value && item.id == imp.id;
                }
            })

            if(el.includes('<import-el')){
                importAll();
            }
        })
    }
}

window.onload = ()=>{
    importAll();
}

HTMLCollection.prototype.find = Array.prototype.find;
HTMLCollection.prototype.findIndex = Array.prototype.findIndex;
HTMLCollection.prototype.deleteUsingEquality = function(predicate){
    let selectIdx = this.findIndex(predicate);
    let idx = 0;
    for(let obj of this){
        if(idx == selectIdx){
            obj.remove();
        }
        idx++;
    }
};
HTMLCollection.prototype.deleteByIdx = function(idx){
    let selectindex = idx;
    let idx2 = 0;
    for(let obj of this){
        if(idx2 == selectindex){
            obj.remove();
        }
        idx2++;
    }
};