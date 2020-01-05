class LoginApi{
    static login(BaseApi, data , onSuccess){
        return BaseApi.getData('users/'.concat(data.userName, "_", btoa(data.password)), onSuccess);
    }
}
export default LoginApi;