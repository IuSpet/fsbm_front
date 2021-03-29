'use strict'

// 登录页提示框
const loginToastVm = new Vue({
    el: '#login-toast',
    data: {
        toastHeader: '',
        toastBody: ''
    },
    methods: {
        showToast: function (header, body) {
            this.toastHeader = header;
            this.toastBody = body;
            $('#login-toast').toast({
                animation: true,
                autohide: true,
                delay: 3000,
            }).toast('show')
        }
    }
});
// 登录/注册表单逻辑
const loginVm = new Vue({
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
        passwordRepeat: '',
        phone: '',
        name: '',
        authCode: ''
    },
    created: function () {
        let loginHistory = $.cookie('lg_remember_me');
        if (loginHistory !== 'true') {
            this.rememberMe = false;
            this.emailAddr = '';
            this.password = '';
            this.passwordRepeat = '';
            this.phone = '';
            this.name = '';
            this.authCode = '';
            return;
        }
        this.rememberMe = true;
        this.emailAddr = $.cookie('lg_user_email');
        this.password = $.cookie('lg_user_password');
        this.passwordRepeat = '';
        this.phone = '';
        this.name = '';
        this.authCode = '';
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
            this.byPhoneMessage = false;
        },
        setLoginByPhoneMessage: function () {
            this.byPassword = false;
            this.byEmail = false;
            this.byPhoneMessage = true;
        },
        sendAuthCode: function () {
            if (this.emailAddr === '') {
                loginToastVm.showToast('提示', '输入邮箱');
                return;
            }
            let body = {
                email: this.emailAddr
            };
            let url = ENV + URL.tool.sendEmailCode;
            sendPostRequest({
                url: url,
                data: body,
                success: function (data) {
                    if (data.status !== 0) {
                        loginToastVm.showToast("验证码发送失败", data.message);
                        return;
                    }
                    loginToastVm.showToast('验证码发送成功', '验证码有效时间3分钟');
                },
                error: function (msg) {
                    console.log(msg);
                }
            })
        },
        sendLoginReq: function () {
            let body = {
                email: this.emailAddr,
                password: this.password,
                phone: this.phone,
                verify_code: this.authCode
            };
            let url
            if (this.byPassword) {
                url = ENV + URL.user.loginByPassword
                if (body.email === '') {
                    loginToastVm.showToast(WARN, '邮箱不能为空');
                    return;
                }
                if (body.password === '') {
                    loginToastVm.showToast(WARN, '密码不能为空');
                    return;
                }
            } else if (this.byEmail) {
                url = ENV + URL.user.loginByVerificationCode
                if (body.email === '') {
                    loginToastVm.showToast(WARN, '邮箱不能为空');
                    return;
                }
                if (body.verify_code === '') {
                    loginToastVm.showToast(WARN, '验证码不能为空')
                    return;
                }
            } else if (this.byPhoneMessage) {
                url = ''
                if (body.phone === '') {
                    loginToastVm.showToast(WARN, '手机号不能为空');
                    return;
                }
                if (body.verify_code === '') {
                    loginToastVm.showToast(WARN, '验证码不能为空')
                    return;
                }
            }
            console.log(url)
            sendPostRequest({
                url: url,
                data: body,
                success: function (data) {
                    if (data.status !== 0) {
                        loginToastVm.showToast('登录失败', data.message);
                        return;
                    }
                    loginToastVm.showToast(INFO, '登录成功');
                    $.cookie("login-email", body.email, {expires: 7, path: '/'})
                    if (loginVm.rememberMe) {
                        $.cookie('lg_remember_me', 'true', {expires: 30, path: '/'})
                        $.cookie('lg_user_email', body.email, {expires: 30, path: '/'})
                        $.cookie('lg_user_password', body.password, {expires: 30, path: '/'})
                    } else {
                        $.cookie('lg_remember_me', 'false')
                    }
                    // todo:跳转
                },
                error: function (msg) {
                    loginToastVm.showToast(ERROR, '请求失败');
                    console.log(msg);
                }
            });
        },
        sendRegisterReq: function () {
            if (!EmailRegex.test(this.emailAddr)) {
                loginToastVm.showToast(WARN, '邮箱格式不正确');
                return;
            }
            if (this.name.length < 6 || this.name.length > 20) {
                loginToastVm.showToast(WARN, '用户名长度6-20');
                return;
            }
            if (!PwdRegex.test(this.password)) {
                console.log(this.password)
                loginToastVm.showToast(WARN, '密码须包含字母数字，8-30字符');
                return;
            }
            if (this.password !== this.passwordRepeat) {
                loginToastVm.showToast(WARN, '两次输入密码不一致');
                return;
            }
            let body = {
                email: this.emailAddr.toString(),
                name: this.name,
                password: this.password,
                phone: this.phone
            }
            let url = ENV + URL.user.register;
            sendPostRequest({
                url: url,
                data: body,
                success: function (data) {
                    console.log(data)
                    if (data.status !== 0) {
                        loginToastVm.showToast("注册失败", data.message);
                        return
                    }
                    // todo:跳转到下一个页面
                    $.cookie("login-email", body.email, {expires: 7, path: '/'})
                    loginToastVm.showToast(INFO, '登录成功');
                },
                error: function (msg) {
                    loginToastVm.showToast(ERROR, "请求失败");
                }
            });
        }
    }
});
