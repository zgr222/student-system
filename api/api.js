// 数据模板
var template = {
    'id|+1': 1,
    'name': '@cname',
    'sex|1': ['男', '女'],
    'email': '@email',
    'age|20-30': 1,
    'tel': /^1[3578][1-9]\d{8}/,
    'add': '@city'
};

// 生成默认数据
Mock.mock('/getDefaultData', {
    status: 'success',
    msg: '请求成功',
    'data|5': [template]
});

// 随机生成一条数据
Mock.mock('/randomAdd', function () {
    var newData = Mock.mock(template);
    var students = JSON.parse(localStorage.students);
    newData.id = students[students.length - 1].id + 1;
    return newData;
});

// 把url字符串转成一个对象
function queryToObj(str) {
    var result = {};
    var url = new URL('http://www.steven.cn/?' + str);  //url前面部分随意写个
    // console.log(url);
    for (param of url.searchParams) {  //es6 新增for of遍历
        /*
            console.log(param); 
            打印:   ['select', 'id']
                    ['word', '2']
        */
        result[param[0]] = param[1];
    }
    return result;
}

// 搜索
Mock.mock('/search', 'post', function (options) {
    // console.log(options, options.body);  //options.body:'select=id&word=2',需要处理一下
    var searchInfo = queryToObj(options.body); //{select: 'id', word: '2'}
    var students = JSON.parse(localStorage.students);

    switch (searchInfo.select) {
        case 'id':
            return students.filter(function (item) {
                return item.id == searchInfo.word;
            });
        case 'name':
            return students.filter(function (item) {
                return item.name.indexOf(searchInfo.word) != -1;
            });
        case 'sex':
            return students.filter(function (item) {
                return item.sex == searchInfo.word;
            });
    }
});

// 编辑
Mock.mock('/getStuInfo', 'post', function (options) {
    var id = queryToObj(options.body).id;
    var students = JSON.parse(localStorage.students);
    return students.filter(function (item) {
        return item.id == id;
    });
});

// 自定义新增数据
Mock.mock('/customAdd', 'post', function (options) {
    var newData = queryToObj(options.body);
    // console.log(newData);
    var students = JSON.parse(localStorage.students);
    newData.id = students[students.length - 1].id + 1;
    return newData;
});

// 修改数据
Mock.mock('/edit', 'post', function (options) {
    var newData = queryToObj(options.body);
    var students = JSON.parse(localStorage.students);
    // 找到修改的数据在存储中索引位置
    var index = students.findIndex(function (item) {
        return item.id == newData.id;
    });
    students.splice(index, 1, newData); //splice(index, len, data); 从index开始剪切长度len的数据，并在切口插入data
    return students;
});

// 删除学生
Mock.mock(new RegExp('/del/\d*'), 'delete', function (options) {  //不习惯可用post方式
    var id = options.url.split('/')[2];
    var students = JSON.parse(localStorage.students);
    var index = students.findIndex(function (item) {
        return item.id == id;
    });
    students.splice(index, 1);
    return students;
});


