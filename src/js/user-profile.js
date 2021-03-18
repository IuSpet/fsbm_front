const userProfileVm = new Vue({
    el: '#user-profile',
    data: {
        name: null,
        age: null,
        gender: null,
        phone: null,
        password: null,
        password2: null,
        authCode: null,
        axiosHandler: null
    },
    created: function () {
        let loginEmail = $.cookie('login-email');
        this.axiosHandler = axios.create({
            headers: {
                post: {
                    email: loginEmail
                }
            }
        });
        let body = {
            email: loginEmail
        };
        let url = ENV + URL.user.getProfile;
        this.axiosHandler({
            method: 'post',
            url: url,
            data: body
        }).then(response => {
            if (response.data.status !== 0) {
                console.log(response.data.message);
                return;
            }
            console.log(response.data.data)
            userProfileVm.name = response.data.data.name;
            userProfileVm.age = response.data.data.age;
            userProfileVm.gender = response.data.data['gender'];
            userProfileVm.phone = response.data.data['phone'];
        }).catch(error => {
            console.log(error);
        })
    },
    methods: {
        sendAuthCode: function () {
            let email = $.cookie('login-email');
            let url = ENV + URL.tool.sendEmailCode;
            axios({
                method: 'post',
                url: url,
                data: {email: email}
            });
        },
        modifyProfile: function () {
            console.log("help")
            if (this.password !== null && this.password !== this.password2) {
                profileToastVm.showToast(WARN, '两次输入密码不一致')
            }
            //todo:修改用户信息
        },
        deleteUser: function () {
            //todo:重复弹窗确认后发送删除用户请求
        }
    }
});

const profileToastVm = new Vue({
    el: '#profile-toast',
    data: {
        toastHeader: null,
        toastBody: null
    },
    methods: {
        showToast: function (header, body) {
            this.toastHeader = header;
            this.toastBody = body;
            $('#profile-toast').toast({
                animation: true,
                autohide: true,
                delay: 3000,
            }).toast('show')
        }
    }
})