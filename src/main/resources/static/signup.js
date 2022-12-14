function checkEmail() {
    const email = $('#email').val();
    if (email === '') {
        $('#emailNotAvailable').hide();
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/api/users/email',
        contentType: 'application/json; charset=utf-8',
        data: email,
        success: function (result) {
            if (result) {
                $('#emailAvailable').hide();
                $('#emailNotAvailable').show().text('이미 사용중인 이메일입니다.').append($('<br />'));
            }
        }
    });
}

function checkNickname() {
    const nickname = $('#nickname').val();
    if (nickname === "") {
        $('#nicknameNotAvailable').hide();
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/api/users/nickname',
        contentType: 'application/json; charset=utf-8',
        data: nickname,
        success: function (result) {
            if (result) {
                $('#nicknameAvailable').hide();
                $('#nicknameNotAvailable').show().text('이미 사용중인 닉네임입니다.').append($('<br />'));
            }
        }
    });
}

function click_signup() {
    let email = $('#email').val();
    let nickname = $('#nickname').val();
    let password = $('#password').val();

    let reg_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    let reg_nickname = /^[a-z0-9_-]{4,12}$/;
    let reg_password = /(?=.*\d)(?=.*[a-zA-ZS]).{4,12}/;

    if (email === '' || nickname === '' || password === '') {
        alert("내용을 입력해주세요")
        return;
    }

    if (!reg_email.test(email)) {
        alert("올바른 이메일 주소를 입력해주세요.")
        return;
    }

    if (!reg_nickname.test(nickname)) {
        alert("4~12자리의 닉네임을 입력해주세요.")
        return;
    }

    if (!reg_password.test(password)) {
        alert("문자와 숫자를 한개 이상 포함한 비밀번호를 입력해주세요.")
        return;
    }

    let data = {'email': email, 'nickname': nickname, 'password': password};
    $.ajax({
        type: "POST",
        url: "/api/users/signup",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function () {
            location.href = "/login";
        }
    });
}