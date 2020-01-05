import * as firebase from "firebase/app";
import "firebase/database";
import BaseApi from "./src/firebaseAssync.js";

var app = firebase.initializeApp({
    apiKey: "AIzaSyAv3S0kbtfgfsfPkHnm73hHgvWsOHvNezE",
    authDomain: "explore-life-online.firebaseapp.com",
    databaseURL: "https://explore-life-online.firebaseio.com",
    projectId: "explore-life-online",
    storageBucket: "explore-life-online.appspot.com",
    messagingSenderId: "",
    appID: "",
});

window.$z = {
    BaseApi : ()=>{
        return new BaseApi(firebase);
    },
}

window.db = window.$z.BaseApi();


// $z.BaseApi().activateRealtime('player_data', (res)=>{
//     if(res.length == undefined){

//     }else{
//         console.log('updated', res.length);
//     }
// })