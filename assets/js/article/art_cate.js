$(function () {
    var form = layui.form;
    var layer = layui.layer;
    getCate();
    //获取文章分类列表
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    var indexAdd = null;
    //添加文章分类
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过代理的方式为 form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('新增文章分类失败！');
                getCate();
                layer.msg('新增文章分类成功！');
                layer.close(indexAdd);
            }
        });
    });

    var indexEdit = null;
    //编辑文章分类
    $('tbody').on('click', '.btn_edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                /* < 快速填充 表单数据  要在HTML form标签上添加  lay-filter="form-edit"  属性*/
                form.val('form-edit', res.data)
            }
        });
    });

    //通过代理的方式为 form-edit 表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新文章分类失败！');
                getCate();
                layer.msg('更新文章分类成功！');
                layer.close(indexEdit);
            }
        });
    });

    //通过代理方式 为删除按钮绑定  点击事件
    $('tbody').on('click', '.btn_del', function () {
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('删除失败！');
                layer.msg('删除成功');
                getCate();
            }
        });
    });

});