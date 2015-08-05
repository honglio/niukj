$(function() {
    var $searchIcon = $('#search-deck i');
    $searchIcon.click(function(e) {
        $('#search-deck').submit();
    });

    // flex font size
    $('body').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h1').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h2').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h3').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h4').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h5').flowtype({
        minimum: 500,
        maximum: 1200
    });
    $('h6').flowtype({
        minimum: 500,
        maximum: 1200
    });
});

var agent = window.navigator.userAgent;
if (agent.indexOf('WebKit/') >= 0) {
    window.browserPrefix = "-webkit-";
} else if (agent.indexOf('Presto/') >= 0) {
    window.browserPrefix = "-o-";
} else if (agent.indexOf('Gecko/') >= 0) {
    window.browserPrefix = "-moz-";
} else if (agent.indexOf('Trident/') >= 0) {
    window.browserPrefix = "-ms-";
} else {
    window.browserPrefix = "";
}

// validation
function validateForm(form) {
    var $email = $('#email');
    var $password = $('#password');
    var $confirmPassword = $('#confirmPassword');

    if ($email.length > 0 && !validator.isEmail(form.email.value)) {
        $email.popover({
            trigger: "manual",
            placement: "top",
            content: "Email格式错误"
        });
        $email.popover('show');
        $email.addClass('invalid');
        $email.focus();
        //- $email.select();
        $email.change(function() {
            $email.removeClass('invalid');
            $email.popover('hide');
        });
        return false;
    }

    if ($password.length > 0 && (!validator.isAlphanumeric(form.password.value) || !validator.isLength(form.password.value, 6, 14))) {
        $password.popover({
            trigger: "manual",
            placement: "top",
            content: "密码格式错误"
        });
        $password.popover('show');
        $password.addClass('invalid');
        $password.focus();
        //- $password.select();
        $password.change(function() {
            $password.removeClass('invalid');
            $password.popover('hide');
        });
        return false;
    }

    if ($confirmPassword.length > 0 && form.confirmPassword.value !== form.password.value) {
        $confirmPassword.popover({
            trigger: "manual",
            placement: "top",
            content: "密码不一致"
        });
        $confirmPassword.popover('show');
        $confirmPassword.addClass('invalid');
        $confirmPassword.focus();
        //- $confirmPassword.select();
        $confirmPassword.change(function() {
            $confirmPassword.removeClass('invalid');
            $confirmPassword.popover('hide');
        });

        return false;
    }

    return true;
}
