var students = [],  //存储所有的学生信息
    editId = 0,     //当前要编辑的学生id
    cn = 1,         //当前的页码
    tn = 0,         //总页码数
    mn = 7,         //最大显示的分页数量（超过显示省略号）
    sn = 6,        //一页显示多少条数据showNum
    preCn = 1;      //纪录搜索前的当前页，方便返回

//左侧菜单点击
$('#menu li').click(function () {
    tab($(this).index());   //把点击元素对应的索引传进去
    $(this).index() == 1 && clearForm();
})

//选项卡
function tab(n) {
    $('#menu li').eq(n).addClass('active').siblings().removeClass('active');
    $('#content > div').eq(n).addClass('active').siblings().removeClass('active');
}

//初始化
function init() {
    if (localStorage.students) { //本地存储有数据
        students = JSON.parse(localStorage.students);   //数据存储到变量中
        tn = Math.ceil(students.length / sn);   //向上取整,即使多一条也要多一页来显示

        renderList();   //渲染学生列表
    } else {    //本地没有数据,默认生成几条数据
        createDefaultData();
    }
}

init();

// 抽取公共部分
function saveAndChangePage(data, num) {
    var len = students.length;
    localStorage.students = JSON.stringify(data);  //把数据存到本地
    tn = Math.ceil(len / sn);
    cn = num || tn;
}

// 创建首次的默认数据
function createDefaultData() {
    $.ajax({
        url: '/getDefaultData',
        dataType: 'json',
        success: function (res) {
            // console.log(res);
            students = res.data;   //把数据存到变量
            // localStorage.students = JSON.stringify(res.data);  //把数据存到本地
            // tn = Math.ceil(students.length / sn);
            saveAndChangePage(res.data, 1);
            renderList();   //渲染学生列表
        }
    })
}

// 渲染学生列表
function renderList() {
    renderTable();  //渲染所有的数据

    // 调用自定义的page组件创建分页
    $('#page').page({
        cn,     //cn:cn 省略写法=> cn
        tn,
        mn,
        callBack: function (n) {
            cn = n;     //把点击的页码赋给cn, 重新渲染
            renderTable();
        }
    });
}

// 渲染表格
function renderTable() {
    /*
        第1页   0-sn    cn=1
        第2页   sn-2sn   cn=2
    */
    var arr = students.slice((cn - 1) * sn, cn * sn);  //每页取sn条数据
    // 表头
    var thead = `
        <thead>
            <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>邮箱</th>
                <th>年龄</th>
                <th>手机号</th>
                <th>住址</th>
                <th>操作</th>
            </tr>
        </thead>`;

    var tr = arr.map(function (item) {
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.sex}</td>
                <td>${item.email}</td>
                <td>${item.age}</td>
                <td>${item.tel}</td>
                <td>${item.add}</td>
                <td>
                    <button data-id=${item.id} class="editBtn btnBg1">编辑</button>
                    <button data-id=${item.id} class="delBtn btnBg2">删除</button>
                </td>
            </tr>`;
    }).join('');

    $('.studentTable').html(`<table>${thead}<tbody>${tr}</tbody></table>`);
}

// 随机生成一条新数据
$('#randomAdd').click(function () {
    $.ajax({
        url: '/randomAdd',
        dataType: 'json',
        success: function (res) {
            // console.log(res);
            students.push(res);
            // localStorage.students = JSON.stringify(students);
            // tn = Math.ceil(students.length / sn);
            // cn = tn;    //页码显示到最后一页
            saveAndChangePage(students);
            renderList();
        }
    })
});

// 搜索功能
$('#searchBtn').click(function () {
    var select = $('.searchBox select').val();  //下拉框的值
    var word = $('.searchBox input').val();     //输入框的值

    if (!word) {
        alert('输入内容不能为空');
        return;
    }

    preCn = cn;

    //搜索操作
    $.ajax({
        url: '/search',
        type: 'post',
        dataType: 'json',
        data: {     //带过去的数据
            select,
            word
        },
        success: function (res) {
            // console.log(res);
            if (res.length) {
                students = res;
                tn = Math.ceil(students.length / sn);
                cn = 1;
                renderList();
            } else {
                $('.studentTable').html('没有找到相关的内容');
                $('#page').html('');
            }
        }
    })
});


// 搜索后返回显示所有数据
$('#backBtn').click(function () {
    $('.searchBox input').val('');
    students = JSON.parse(localStorage.students);
    tn = Math.ceil(students.length / sn);
    cn = preCn;
    renderList();
});


//自定义新增
$('#customAdd').click(function () {
    tab(1);
});

// 表单验证 validate.js

// 编辑
$('.studentTable').on('click', '.editBtn', function () {
    tab(1);
    // 把此学生信息回填到表单中
    $.ajax({
        url: '/getStuInfo',
        type: 'post',
        dataType: 'json',
        data: {
            id: this.dataset.id
        },
        success: function (res) {
            // console.log(res);
            $('#name').val(res[0].name);
            $('#email').val(res[0].email);
            $('#age').val(res[0].age);
            $('#tel').val(res[0].tel);
            $('#address').val(res[0].add);
            if (res[0].sex == '男') {
                $('#male').prop('checked', true);
                $('#female').prop('checked', false);
            } else {
                $('#male').prop('checked', false);
                $('#female').prop('checked', true);
            }

            editId = res[0].id;
            $('.submitBtn').html('确定修改');
        }
    });
});

// 提交（修改或新增）
$('#addForm .submitBtn').click(function () {
    var arr = $('#addForm').serializeArray();  //序列化表单表格元素，并返回一个json格式的数据
    // console.log(arr);

    //是否所有的数据都有值
    var hasValue = arr.every(function (item) {
        return item.value != '';
    });

    //是否所有的表单都通过了验证
    var isValidate = $('.regValidate').toArray().every(function (item) {
        return $(item).html() == '';
    });

    if (!hasValue) {
        alert('请填写表单的每一项');
        return;
    }
    if (!isValidate) {
        alert('请保证每一项都符合要求');
        return;
    }

    //提交数据
    var newData = {
        name: arr[0].value,
        sex: arr[1].value,
        email: arr[2].value,
        age: arr[3].value,
        tel: arr[4].value,
        add: arr[5].value,
    }
    //自定义提交
    if ($(this).html() == '提交') {
        $.ajax({
            url: '/customAdd',
            type: 'post',
            dataType: 'json',
            data: newData,
            success: function (res) {
                // console.log(res);
                students.push(res);
                saveAndChangePage(students);

                renderList();
                tab(0);
            }
        });
    } else {
        //修改数据
        newData.id = editId;
        preCn = cn;
        $.ajax({
            url: '/edit',
            type: 'post',
            dataType: 'json',
            data: newData,
            success: function (res) {
                // console.log(res);
                students = res;
                saveAndChangePage(students, preCn);
                renderList();
                tab(0);
            }
        })
    }
});

// 清空表单
function clearForm() {
    $('#addForm')[0].reset();
    $('#addForm .submitBtn').text('提交');
    $('.regValidate').html('');
}

// 新增学生返回按钮
$('.returnBtn').click(function () {
    tab(0);
    clearForm();
})


// 删除
$('.studentTable').on('click', '.delBtn', function () {
    var id = this.dataset.id;
    if (confirm('是否确定删除该学生？')) {
        $.ajax({
            url: `/del/${id}`,
            type: 'delete',
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                students = res;
                localStorage.students = JSON.stringify(students); //把新数据存储到本地
                tn = Math.ceil(students.length / sn);   //删除后数据的个数就变化了
                if (cn > tn) {  //删除多了后数据有可能小于当前的页码
                    cn = tn;
                }
                renderList();
                tab(0);
            }
        })
    }
})
