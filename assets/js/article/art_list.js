$(function () {

    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,//页码值 默认请求第一页
        pagesize: 2,//每页显示几条数据，默认2条
        cate_id: '', //文章分类的ID
        state: ''  // 文章发布的状态
    };
    getList();
    getCate();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //获取文章列表数据
    function getList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }

    //获取文章分类列表
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！');
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();
            }
        });
    }

    //为筛选表单 绑定submit 事件 
    $('#form-search').on('submit', function (e) {
        e.preventDefault();//阻止表单默认提交
        //获取下拉列表被选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        //为查询参数 p对象中的 cate_id state 赋值
        q.cate_id = cate_id;
        q.state = state;

        //根据查询条件重新渲染数据
        getList();
    });


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                /*   console.log(first);
                  console.log(obj.curr); */
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    getList();
                }
            }
        });
    }



    //通过代理方式 为 删除按钮 btn_edit 绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        //获取文章的id
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗?', {icon:3,title:'提示'}, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章数据失败！');
                    layer.msg('删除文章数据成功！');
                    getList();
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    layer.close(index);
                }
            });
        });
    });

    var indexEdit = null;
    //通过代理方式 为 编辑按钮 btn_edit 绑定点击事件
    $('tbody').on('click', '.btn_edit', function () {
        var id = $(this).attr('data-id');
        location.href = '../article/art_edit.html?id=' + id;
    });
});