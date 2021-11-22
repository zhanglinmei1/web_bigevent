$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });

    //调用 初始化用户基本信息
    initUserInfo();

    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('获取用户信息失败！');
                //调用form.val()方法快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    //重置按钮事件
    $('#btnReset').on('click', function (e) {
        //阻止表单的重置行为
        e.preventDefault();
        //点击重置之后，快速调用初始化用户基本信息
        initUserInfo();
    });

    //提交修改按钮 的提交事件
    $('.layui-form').on('submit', function (e) {
        console.log(1111);
        e.preventDefault();//阻止表单的默认提交行为
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败！');
                console.log(res);
                layer.msg('更新用户信息成功！');
                //更新父页面的 getUserInfo()方法
                window.parent.getUserInfo();
            }
        });

    });
});
