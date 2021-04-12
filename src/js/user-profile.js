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
        axiosHandler: null,
        preData: null
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
            userProfileVm.preData = response.data.data;
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
                return;
            }
            if (!this.checkModified) {
                profileToastVm.showToast(INFO, '没有修改信息')
                return;
            }
            let body = {
                name: this.name,
                email: $.cookie('login-email'),
                phone: this.phone,
                gender: this.gender,
                age: this.age,
                password: this.password,
                verify_code: this.authCode
            }
            let url = ENV + URL.user.modify;
            this.axiosHandler({
                url: url,
                data: this.getValidBody(body),
                method: 'post'
            }).then(rsp => {
                if (rsp.data.status !== 0) {
                    profileToastVm.showToast(ERROR, '修改失败: ' + rsp.data.message);
                    return;
                }
                profileToastVm.showToast(INFO, '修改成功');
            }).catch(err => {
                profileToastVm.showToast(ERROR, '修改失败');
            });
        },
        deleteUser: function () {
            if (this.authCode === null) {
                profileToastVm.showToast(WARN, '验证码为空')
                return;
            }
            let body = {
                verify_code: this.authCode,
                email: $.cookie('login-email')
            };
            let url = ENV + URL.user.delete;
            this.axiosHandler({
                method: 'post',
                url: url,
                data: body
            }).then(rsp => {
                if (rsp.data.status !== 0) {
                    profileToastVm.showToast(ERROR, '删除失败: ' + rsp.data.message);
                    this.authCode = null;
                    return;
                }
                profileToastVm.showToast(INFO, '删除成功');
                //todo: 跳转到登录界面
            }).catch(err => {
                profileToastVm.showToast(ERROR, '删除失败');
            });
        },
        checkModified: function () {
            for (let key of this.preData) {
                if (this.preData[key] !== this[key]) {
                    return true;
                }
            }
            return false;
        },
        getValidBody: function (body) {
            if (body['gender'] === '男') {
                body['gender'] = 1;
            } else if (body['gender'] === '女') {
                body['gender'] = 2;
            } else {
                body['gender'] = 0;
            }
            return body;
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

const uploadAvatarVm = new Vue({
    el: '#upload_avatar',
    data: {
        axiosHandler: null,
        avatar: null,
        file: null,
        message: null,
        img: null,
        reader: null,
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
        this.reader = new FileReader();
        this.img = new Image();
        let convas = document.createElement('canvas');
        let context = convas.getContext('2d');
        this.img.onload = function () {
            let targetWidth = 64, targetHeight = 64;
            convas.width = targetWidth;
            convas.height = targetHeight;
            context.clearRect(0, 0, targetWidth, targetHeight);
            context.drawImage(uploadAvatarVm.img, 0, 0, targetWidth, targetHeight);
            convas.toBlob(blob => {
                console.log(blob);
                uploadAvatarVm.avatar = blob;
            }, 'image/png')
        };
        this.reader.onload = function (e) {
            uploadAvatarVm.img.src = e.target.result;
        };
    },
    methods: {
        uploadAvatar: function () {
            let url = ENV + URL.user.setAvatar;
            console.log(this.avatar);
            // let xhr = new XMLHttpRequest();
            // xhr.onreadystatechange = function () {
            //     if (xhr.status === 200) {
            //         console.log(xhr.responseText);
            //     }
            // };
            // xhr.open('post', url, true);
            // xhr.send(this.avatar);
            this.axiosHandler({
                method: 'post',
                url: url,
                data: this.avatar,
                headers: {
                    'content-type': 'image/png',
                },
            }).then(rsp => {
                console.log(rsp)
            })
        },
        setAvatar: function (event) {
            this.file = event.target.files[0];
            this.reader.readAsDataURL(this.file);
        }
    }
})