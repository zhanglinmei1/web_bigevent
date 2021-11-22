$(function () {
    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;//消息提示
    //通过form.verify() 方法自定义校验规则
    form.verify({
        //自定义密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function (value) {
            var oldPwd = $('[name=oldPwd]').val();
            if (oldPwd === value)
                return '新旧密码不能相同！';
        },
        repwd: function (value) {
            var newpwd = $('[name=newPwd]').val();
            if (newpwd !== value)
                return '两次密码不一致!';
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新密码失败！');
                layer.msg('更新密码成功！');
                //重置表单
                $('.layui-form')[0].reset();
            }
        });
    })

    /* function selectPassWord(password) {
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: localStorage.getItem('username'),
            success: function (res) {
                console.log(res);
                console.log(localStorage.getItem('username'));
                console.log(res.password + "==" + password);
                if (res.status === 0) {
                    if (res.password === password)
                        return true;
                    return false;
                }
            }
        })
    } */

});