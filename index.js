import * as firebase from "firebase/app";
import "firebase/database";
import BaseApi from "./src/firebaseAssync.js";
import LoginApi from "./V1/service/loginApi.js"; 

var app = firebase.initializeApp({
    apiKey: "AIzaSyAv3S0kbtfgfsfPkHnm73hHgvWsOHvNezE",
    authDomain: "revolutionary-people.firebaseapp.com",
    databaseURL: "https://revolutionary-people.firebaseio.com",
    projectId: "revolutionary-people",
    storageBucket: "revolutionary-people.appspot.com",
    messagingSenderId: "",
    appID: "",
});

window.$z = {
    BaseApi : ()=>{
        return new BaseApi(firebase);
    },
    LoginApi: ()=>{
        return LoginApi;
    }
}

window.db = window.$z.BaseApi();


// $z.BaseApi().activateRealtime('player_data', (res)=>{
//     if(res.length == undefined){

//     }else{
//         console.log('updated', res.length);
//     }
// })