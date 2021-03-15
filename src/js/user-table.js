'use strict'
$(function () {
    var userListVm = new Vue({
        el: '#user-list',
        data: {
            name: '',
            gender: null,
            age: null,
            emailAddr: '',
            phone: '',
            createdBegin: null,
            createdEnd: null,
            page: 1,
            pageSize: 20,
            rows: [],
            totalCnt: 0,
            showRange: '0到0',
            currentPage: 1,
            maxPage: 10,
        },
        methods: {
            sendGetUserListRequest: function () {
                let body = {
                    name: this.name,
                    gender: this.gender,
                    age: this.age,
                    create_begin: this.createdBegin,
                    create_end: this.createdEnd,
                    email: this.emailAddr,
                    phone: this.phone,
                    page: this.page,
                    pageSize: this.pageSize
                }
                console.log(body);
                let url = ENV + URL.admin.userList;
                let listVm = this
                sendPostRequest({
                    url: url,
                    data: this.getValidBody(body),
                    success: function (data) {
                        listVm.rows = data.data['user_info_list'];
                        listVm.totalCnt = data.data['total_count'];
                        listVm.showRange = (listVm.page * listVm.pageSize + 1) + "到" + (listVm.page * listVm.pageSize + listVm.pageSize);
                        listVm.maxPage = Math.ceil(listVm.totalCnt / listVm.pages)
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
                return body;
            },
            changePage: function (page) {
                if (this.page === page) {
                    return;
                }
                if (page > this.maxPage || page < 1) {
                    return;
                }
                this.page = page;
                this.sendGetUserListRequest();
            },
            setPageSize: function (pageSize) {
                if (this.pageSize === pageSize) {
                    return;
                }
                this.pageSize = pageSize;
                this.sendGetUserListRequest();
            },
            exportData: function () {
                let body = {
                    name: this.name,
                    gender: this.gender,
                    age: this.age,
                    create_begin: this.createdBegin,
                    create_end: this.createdEnd,
                    email: this.emailAddr,
                    phone: this.phone,
                    page: this.page,
                    pageSize: this.pageSize
                }
                console.log(body);
                let url = ENV + URL.admin.userListCsv;
                sendPostRequest({
                    url: url,
                    data: this.getValidBody(body),
                    success: function (data) {
                        // todo:打印提示
                    },
                    error: function (msg) {

                    }
                })
            }
        }
    })
})