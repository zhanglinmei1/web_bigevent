$(function () {
    // 获取用户基本信息
    getUserInfo();
    //点击按钮退出登录
    $('#btn_loginout').on('click', function () {
        //提示用户是否确认退出
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储的token
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = '/code/login.html';
            //关闭 confirm 询问窗
            layui.layer.close(index);
        });
    })
});
//获取用户基本信息
function getUserInfo() {/* 
    var token = localStorage.getItem("token"); */
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers就是请求头配置对象
        /*  headers: { Authorization: token || '' }, */
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败!');
            //调用renderAvatar(user)方法 渲染用户头像
            renderAvatar(res.data);
        }
    });
}

//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.text-avatar').text(first).show();
        $('.layui-nav-img').hide();
    }

}