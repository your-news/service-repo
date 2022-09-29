function click_login() {
    // 로그인용 data 준비
    let payload = {email: $('#email').val(), password: $('#password').val()};
    // 로그인 통신
    $.ajax({
        type: 'POST',
        url: '/api/users/login',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        success: function (result) {
            console.log(result)
            // 성공
            sessionStorage.setItem("accessToken", result.accessToken)
            sessionStorage.setItem("email", result.email)
            sessionStorage.setItem("nickname", result.nickname)
            sessionStorage.setItem("imageUrl", result.imageUrl)
        }, complete: function () {
            // 성공 후 로직
            location.href = "/";
        }
    }).fail(function (error) {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    });
}