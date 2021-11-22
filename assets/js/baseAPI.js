// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {

    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    //统一为有权限的接口  设置headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complete函数回调  不能请求是否成功，都会执行 complete 这个方法
    options.complete=function (res) {
            //可以通过res.responseJSON属性来获取到服务器传回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //强制清空本地存储token
                localStorage.removeItem('token');
                // 强制跳转到登录页面
                location.href = '/code/login.html';
            }
        }

});