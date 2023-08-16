
export const netConfig = {
    // axios 基础url地址
    // baseURL: 'http://opentest.shlongtian.com:31348/kycmms',
    baseURL: 'https://cmms.hrgly.com/kycmms',
    // 为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用
    cors: true,
    // 根据后端定义配置
    contentType: 'application/json;charset=UTF-8',
    //消息框消失时间
    messageDuration: 3000,
    //最长请求时间
    requestTimeout: 30000,
    //操作正常code，支持String、Array、int多种类型
    successCode: [200, 0, 1013],
    //登录失效code
    invalidCode: [1004],
    //无权限code
    noPermissionCode: -1,

    mapKey: "KYABZ-NKLCZ-WR2X7-7D7JR-V67ST-3GBAN"
};
