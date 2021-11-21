// 
$(function () {
    //点击  去注册账号  的连接
    $('#link_reg').on('click', () => {
        $('.login_box').hide();
        $('.reg_box').show();
    });

    //点击  去登录  的连接
    $('#link_login').on('click', () => {
        $('.login_box').show();
        $('.reg_box').hide();
    });

    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;//消息提示
    //通过form.verify() 方法自定义校验规则
    form.verify({
        //自定义密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],

        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value)
                return '两次密码不一致!';
        }

    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();//阻止表单默认提交行为
        //获取页面表单中的值
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        //发起post请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0)
                return layer.msg(res.message);
            layer.msg('注册成功，请登录！')
            // 模拟人的点击行为
            $('#link_login').click();
        });
    });


    // 监听登录提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();//阻止默认提交行为
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),//快速获取表单数据
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('登录失败!');
                layer.msg('登录成功');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                //跳转到后台首页
                location.href = '/code/index.html';
            }
        });
    });
});