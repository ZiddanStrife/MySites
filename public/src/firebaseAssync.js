export default class{
    constructor(firebase){
        this.db = firebase.database();

        this.getData = (path, onSuccess)=>{
            return this.db
            .ref(path)
            .once('value')
            .then((res)=>{onSuccess(res.val())});
        }

        this.updateData = (path, data, onSuccess)=>{
            if(data.length !== undefined){
                let key = this.db
                .ref(path)
                .once('value')
                .then(res=>{
                    let inc = 0;
                    if(res.val() == null){
                        this.setData(path, 0, ()=>{});
                    }else{
                        if(res.val().length == undefined){
                            inc = 0;
                        }else{
                            inc = res.val().length;
                        }
                    }
                    
                    for(let obj of data){
                        this.db
                        .ref(path + "/" +inc)
                        .update(obj);
                        inc++;
                    }
                })

            }else{
                return this.db
                .ref(path)
                .update(data)
                .then((res)=>{onSuccess(res)});
            }
            
        }
        this.setData = (path , data,callback)=>{
            this.db
            .ref(path)
            .set(data)
            .then((res)=>{callback(res)});
        }
        this.activateRealtime = (path, callback)=>{
            return this.getData(path, res=>{
                let exist = (res !== null);
                if(exist){
                    return this.db
                    .ref(path)
                    .on('value', (res)=>{callback(res.val())});
                }else{
                    this.setData(path, 0, ()=>{});
                    this.activateRealtime(path, callback)
                    return callback([])
                }
            })
        }
    }
}