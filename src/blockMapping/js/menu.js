var menuJs = {};
menuJs.el = undefined;
menuJs.listValue = [];
menuJs.createMenu = (selection)=>{
    if(selection !== undefined){
        menuJs.el = document.querySelector(selection);
        menuJs.el.className += " menu-js";
        let idx = 0;
        for(let obj of menuJs.listValue){
            let typeEl = "<label>"+obj.text+"</label>"
            if(obj.type == undefined){
                obj.type = "text";
            }

            if(obj.type == 'checkbox'){
                typeEl = "<input type='checkbox' onchange='menuJs.listValue["+idx+"].onchange(this)'>" + obj.text;
            }
            let menuItem = "<div>".concat(typeEl,"</div>");
            idx++;
            menuJs.el.innerHTML += " ".concat(menuItem);
        }
    }else{
        console.log("MenuJs Alert: menu Is Not Have template.");
    }
}