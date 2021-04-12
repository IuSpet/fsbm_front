// import '../../lib/vue.js'
// import {ENV, URL, INFO, WARN, ERROR} from './const.js'
// import {sendPostRequest} from './common.js'
// import * as echarts from '../../lib/echarts';

const userListFormVm = new Vue({
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
        maxPage: 10,
        option: null,
        myChart: null,
        sort: {
            Name: null,
            Email: null,
            Phone: null,
            Gender: null,
            Age: null,
            CreatedAt: null,
            Status: null
        },
        sortQueue: [],
        axiosHandler: null
    },
    created: function () {
        this.axiosHandler = axios.create({
            headers: {
                post: {
                    email: $.cookie('login-email')
                }
            }
        });
        this.sendGetUserListRequest();
        if (this.option === null) {
            this.option = {
                title: {
                    text: '注册人数统计'
                },
                legend: {
                    data: ['注册人数']
                },
                xAxis: {
                    type: 'category',
                    data: ['2021-03-01', '2021-03-02']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '注册人数',
                    data: [10, 20],
                    type: 'line'
                }]
            };
        }
    },
    mounted: function () {
        this.myChart = echarts.init(document.getElementById('user-register-chart1'));
        this.setChartOption();
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
                page_size: this.pageSize
            }
            let url = ENV + URL.admin.userList;
            let listVm = this;
            this.axiosHandler({
                method: 'post',
                url: url,
                data: this.getValidBody(body)
            }).then(rsp => {
                if (rsp.data.status !== 0) {
                    console.log(data.data.message);
                    return;
                }
                listVm.rows = rsp.data.data['user_info_list'];
                listVm.totalCnt = rsp.data.data['total_count'];
                listVm.showRange = ((listVm.page - 1) * listVm.pageSize + 1) + "到" + Math.min(listVm.totalCnt, listVm.page * listVm.pageSize + listVm.pageSize);
                listVm.maxPage = Math.ceil(listVm.totalCnt / listVm.pageSize);
                this.resetSort();
            }).catch(err => {
                console.log(err);
            });
            url = ENV + URL.admin.userRegister;
            this.axiosHandler({
                method: 'post',
                url: url,
                data: this.getValidBody(body)
            }).then(rsp => {
                if (rsp.data.status !== 0) {
                    console.log(rsp.data.message);
                    return;
                }
                listVm.option = {
                    xAxis: {
                        type: 'category',
                        data: rsp.data.data.series.map(a => a['date'])
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: rsp.data.data.series.map(a => a['cnt']),
                        type: 'line'
                    }]
                };
                if (listVm.myChart !== null) {
                    listVm.setChartOption();
                }
            }).catch(err => {
                console.log(err);
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
            axios({
                method: 'post',
                url: url,
                data: this.getValidBody(body),
                responseType: 'blob'
            }).then(response => {
                console.log('success')
                console.log(response)
                fileDownload(response.data, '用户列表.csv');
            }).catch(error => {
                console.log(error)
            });

        },
        setChartOption: function () {
            this.myChart.setOption(this.option);
        },
        clickSortField: function (field) {
            switch (this.sort[field]) {
                case 'asc':
                    this.sort[field] = 'desc';
                    this.pushNewDescField(field);
                    break;
                case 'desc':
                    this.sort[field] = null;
                    this.removeSortField(field);
                    break;
                case null:
                    this.sort[field] = 'asc';
                    this.pushNewAscField(field);
                    break;
                default:
                    this.sort[field] = null;
                    this.removeSortField(field);
            }
            console.log(this.sortQueue);
            let body = {
                name: this.name,
                gender: this.gender,
                age: this.age,
                create_begin: this.createdBegin,
                create_end: this.createdEnd,
                email: this.emailAddr,
                phone: this.phone,
                page: this.page,
                page_size: this.pageSize,
                sort_fields: this.sortQueue
            };
            let url = ENV + URL.admin.userList;
            let listVm = this;
            this.axiosHandler({
                method: 'post',
                url: url,
                data: this.getValidBody(body)
            }).then(rsp => {
                if (rsp.data.status !== 0) {
                    console.log(rsp.data.message);
                    return;
                }
                listVm.rows = rsp.data.data['user_info_list'];
                listVm.totalCnt = rsp.data.data['total_count'];
                listVm.showRange = ((listVm.page - 1) * listVm.pageSize + 1) + "到" + Math.min(listVm.totalCnt, listVm.page * listVm.pageSize + listVm.pageSize);
                listVm.maxPage = Math.ceil(listVm.totalCnt / listVm.pageSize);
            }).catch(err => {
                console.log(err);
            });

        },
        pushNewAscField: function (field) {
            let sortField = {
                field: field,
                order: 'asc'
            };
            this.sortQueue.push(sortField);
        },
        pushNewDescField: function (field) {
            for (let item of this.sortQueue) {
                if (item['field'] === field) {
                    item['order'] = 'desc';
                    break;
                }
            }
        },
        removeSortField: function (field) {
            let idx = this.sortQueue.findIndex(item => {
                return item['field'] === field;
            })
            if (idx !== -1) {
                this.sortQueue.splice(idx, 1);
            }
        },
        resetSort: function () {
            this.sort = {
                name: null,
                email: null,
                phone: null,
                gender: null,
                age: null,
                created_at: null,
                status: null
            };
            this.sortQueue = [];
        },
        printTable: function () {
            let body = this.getValidBody({
                name: this.name,
                gender: this.gender,
                age: this.age,
                create_begin: this.createdBegin,
                create_end: this.createdEnd,
                email: this.emailAddr,
                phone: this.phone,
                page: this.page,
                page_size: this.pageSize
            });
            window.sessionStorage.setItem('user_list_req', JSON.stringify(body));
            window.open('user_list_print.html');
        }
    }
});
const userRegisterChart1Vm = new Vue({
    data: {
        myChart: null,
        option: null
    },
    methods: {
        created: function () {
            this.option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                }]
            };
        },
        mounted: function () {
            this.myChart = echarts.init($('user-register-chart1'))
            myBarChart.setOption(this.option)

        }
    }
})


