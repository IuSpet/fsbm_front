const TEST_ENV = 'http://127.0.0.1:8080';
const PRODUCT_ENV = '';
// 测试环境和生成环境切换，上线前确保是生产环境
const ENV = 'http://127.0.0.1:8080';
const URL = {
    user: {
        register: '/user/register',
        loginByPassword: '/user/login/password',
        loginByVerificationCode: '/user/login/verify',
        logout: '/user/logout',
        modify: '/user/modify',
        delete: '/user/delete',
        applyRole: '/user/apply_role'
    },
    tool: {
        sendEmailCode: '/tool/no_auth/generate_verification_code'
    },
    admin: {
        userList: '/admin/user_list',
        userListCsv: '/admin/user_list/csv'
    }
}
const INFO = '提示'
const WARN = '警告'
const ERROR = '错误'