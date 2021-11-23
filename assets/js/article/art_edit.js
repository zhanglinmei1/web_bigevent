$(function () {
    var form = layui.form;
    var layer = layui.layer;

    //获取的是路径后面所有参数的字符串
    var urlParam = decodeURI(window.location.href.split("?")[1]);
    //decodeURI是因为浏览器会对参数自动加密，所以该方法是解密的过程
    var id = urlParam.split("id=")[1].split("&")[0];
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0)
                return layer.msg('获取文章详情失败！');
            // < 快速填充 表单数据  要在HTML form标签上添加  lay-filter="form-edit"  属性
            form.val('form-edit', res.data);
            form.render();
        }
    });


    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    });

    // 为表单绑定 submit 提交事件
    $('#form-edit').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('Id', id);
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 定义一个修改文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '../article/art_list.html';
            }
        })
    }



});