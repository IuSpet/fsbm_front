const sendPostRequest = function (options) {
    $.ajax({
        type: "POST",
        url: options.url,
        async: true,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(options.data),
        success: function (data) {
            if (typeof options.success === 'function') {
                return options.success(data)
            }
        },
        error: function (errorMsg) {
            if (typeof options.error === 'function') {
                return options.error(errorMsg)
            }
        }
    })
};

const isPasswordAvailable = function (password) {

}

const fileDownload = function (data, fileName) {
    if (!data) {
        return;
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
}

const userLogout = function () {
    let email = $.cookie('login-email');
    let handler = axios.create({
        headers: {
            post: {
                email: email,
            }
        }
    })
    if (email !== undefined) {
        let body = {
            email: email,
        };
        let url = ENV + URL.user.logout;
        handler({
            method: 'post',
            url: url,
            data: body,
        });
    }
}

// export {sendPostRequest}

const topUserProfileVm = new Vue({
    el: '#top_user_profile',
    data: {
        name: null,
        avatar: null,
        axiosHandler: null,
        imgBase64: null,
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
        // 获取用户名
        let url = ENV + URL.user.getProfile;
        let body = {
            email: loginEmail,
        };
        this.axiosHandler({
            method: 'post',
            url: url,
            data: body,
        }).then(rsp => {
            if (rsp.data.status !== 0) {
                console.log(rsp.data.message);
                return;
            }
            this.name = rsp.data.data['name'];
        })
        // 获取用户头像
        url = ENV + URL.user.getAvatar;
        console.log(body);
        this.axiosHandler({
            method: 'post',
            url: url,
            data: body,
            responseType: 'blob'
        }).then(rsp => {
            console.log(rsp);
            this.avatar = rsp.data;
            if (this.avatar !== null) {
                let blob = new Blob([this.avatar]);
                let reader = this.blob2Base64(blob);
                reader.addEventListener("load", () => {
                    topUserProfileVm.imgBase64 = reader.result;
                });
            }
        })
    },
    methods: {
        blob2Base64: function (blob) {
            let r = new FileReader();
            r.readAsDataURL(blob);
            return r;
        }
    }

})