const TEST_ENV = 'http://127.0.0.1:8080';
const PRODUCT_ENV = 'http://47.95.248.242:8080';
// 测试环境和生成环境切换，上线前确保是生产环境
const ENV = 'http://47.95.248.242:8080';
const URL = {
    user: {
        register: '/user/register',
        loginByPassword: '/user/login/password',
        loginByVerificationCode: '/user/login/verify',
        logout: '/user/logout',
        modify: '/user/modify',
        delete: '/user/delete',
        applyRole: '/user/apply_role',
        getProfile: '/user/get_profile'
    },
    tool: {
        sendEmailCode: '/tool/no_auth/generate_verification_code'
    },
    admin: {
        userList: '/admin/user_list',
        userListCsv: '/admin/user_list/csv',
        userRegister: '/admin/user_register/line_chart'
    }
}
const PATH = {
    login: "",
    user_table: "",
    user_profile: "",
}
const PwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
const EmailRegex = new RegExp('^[a-z0-9A-Z]+[-|a-z0-9A-Z._]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')
const INFO = '提示';
const WARN = '警告';
const ERROR = '错误';
// export {ENV,URL,INFO,WARN,ERROR}