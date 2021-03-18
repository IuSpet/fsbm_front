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
        myChart: null
    },
    created: function () {
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
                pageSize: this.pageSize
            }
            let url = ENV + URL.admin.userList;
            let listVm = this
            sendPostRequest({
                url: url,
                data: this.getValidBody(body),
                success: function (data) {
                    listVm.rows = data.data['user_info_list'];
                    listVm.totalCnt = data.data['total_count'];
                    listVm.showRange = ((listVm.page - 1) * listVm.pageSize + 1) + "到" + Math.min(listVm.totalCnt, listVm.page * listVm.pageSize + listVm.pageSize);
                    listVm.maxPage = Math.ceil(listVm.totalCnt / listVm.pageSize)
                },
                error: function (msg) {
                    console.log("err:" + msg);
                }
            });
            url = ENV + URL.admin.userRegister
            sendPostRequest({
                url: url,
                data: this.getValidBody(body),
                success: function (data) {
                    listVm.option = {
                        xAxis: {
                            type: 'category',
                            data: data.data.series.map(a => a['date'])
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: data.data.series.map(a => a['cnt']),
                            type: 'line'
                        }]
                    };
                    if (listVm.myChart !== null) {
                        listVm.setChartOption()
                    }
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


