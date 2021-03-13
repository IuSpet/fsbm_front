'use strict'
$(function () {
    var userListVm = new Vue({
        el: '#user-list',
        data: {
            name: '',
            gender: '',
            age: null,
            emailAddr: '',
            phone: '',
            createdBegin: '',
            createdEnd: '',
            page: 1,
            pageSize: 20
        },
        methods: {
            sendGetUserListRequest: function () {
                console.log("???")
                let body = {
                    name: this.name,
                    gender: this.gender,
                    age: this.age,
                    create_begin: this.createdBegin,
                    create_end: this.createdEnd,
                    email: this.emailAddr,
                    phone: this.phone,
                    page: this.page,
                    pageSize: this.pageSize,
                }
                console.log(body);
                let url = ENV + URL.admin.userList;
                sendPostRequest({
                    url: url,
                    data: this.getValidBody(body),
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (msg) {
                        console.log("err:" + msg);
                    }
                })
            },
            getValidBody: function (body) {
                if (body.gender === '男') {
                    body.gender = 1;
                } else if (body.gender === '女') {
                    body.gender = 2;
                } else {
                    body.gender = null;
                }
                return body
            }
        }
    })
})