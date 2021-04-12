const UserListPrintVm = new Vue({
    el: '#user-list-print',
    data: {
        rows: null,
        body: null,
        axiosHandler: null
    },
    created: function () {
        this.body = JSON.parse(window.sessionStorage.getItem('user_list_req'));
        let loginEmail = $.cookie('login-email');
        this.axiosHandler = axios.create({
            headers: {
                post: {
                    email: loginEmail
                }
            }
        });
        let url = ENV + URL.admin.userListPrint;
        this.axiosHandler({
            method: 'post',
            url: url,
            data: this.body,
        }).then(rsp => {
            if (rsp.data.status !== 0) {
                console.log(rsp.data.message);
                return;
            }
            this.rows = rsp.data.data['user_info_list'];
        })
    },
    mounted: function () {
        console.log(this.rows);
    }

})