// import Vue from '../../lib/vue'
$(function () {
    var loginVm = new Vue({
        el: '#login-card',
        data: {
            login: true,
            register: false,
            byPassword: true,
            byEmail: false,
            byPhoneMessage: false,
            rememberMe: false,
            emailAddr: '',
            password: '',
            phone: '',
            name: '',
            authCode: ''
        },
        methods: {
            setLoginStatus: function () {
                this.login = true;
                this.register = false;
                this.password = ''
            },
            setRegisterStatus: function () {
                this.login = false;
                this.register = true;
                this.password = ''
            },
            setLoginByPassword: function () {
                this.byPassword = true;
                this.byEmail = false;
                this.byPhoneMessage = false;
            },
            setLoginByEmail: function () {
                this.byPassword = false;
                this.byEmail = true;
                this.byPhoneMessage = true;
            },
            setLoginByPhoneMessage: function () {
                this.byPassword = false;
                this.byEmail = false;
                this.byPhoneMessage = true;
            },
            sendAuthCode: function () {

            },
            sendLoginReq: function () {

            },
            sendRegisterReq: function () {
                let body = {
                    "email": this.email,
                    "name": this.name,
                    "password": this.password
                }
                $.ajax({
                    type: "post",
                    url: "http://127.0.0.1:8080/user/register",
                    async: true,
                    dataType: "json",
                    data: body,
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (errorMsg) {
                        alert(errorMsg)
                    }
                })
            }
        }
    })
});
