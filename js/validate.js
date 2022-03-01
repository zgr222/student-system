// 验证名字
$('#name').blur(function () {
    if (!$(this).val()) {
        $('#validateName').html('* 姓名不能为空');
        return;
    }
    $('#validateName').html('');
});

// 验证邮箱
$('#email').blur(function () {
    if (!$(this).val()) {
        $('#validateEmail').html('* 邮箱不能为空');
        return;
    }
    if (!/^[\w\.-]+@[\w-]+\.[a-z]+$/.test($(this).val())) {
        $('#validateEmail').html('* 邮箱格式不正确');
        return;
    }
    $('#validateEmail').html('');
});

// 验证年龄
$('#age').blur(function () {
    if (!$(this).val()) {
        $('#validateAge').html('* 年龄不能为空');
        return;
    }
    if (isNaN($(this).val())) {
        $('#validateAge').html('* 年龄需为数字');
        return;
    }
    if ($(this).val() < 10 || $(this).val() > 100) {
        $('#validateAge').html('* 年龄范围不合适(10-100)');
        return;
    }
    $('#validateAge').html('');
});

// 验证手机号
// $('#tel').blur(function () {
//     if (!$(this).val()) {
//         $('#validateTel').html('* 手机号不能为空');
//         return;
//     }
//     if (isNaN($(this).val())) {
//         $('#validateTel').html('* 手机号需为数字');
//         return;
//     }
//     if ([...$(this).val()].length != 11) {
//         $('#validateTel').html('* 手机号需为11个数字');
//         return;
//     }
//     $('#validateTel').html('');
// });

// 验证地址
// $('#address').blur(function () {
//     if (!$(this).val()) {
//         $('#validateAddress').html('* 地址不能为空');
//         return;
//     }
//     $('#validateAddress').html('');
// });