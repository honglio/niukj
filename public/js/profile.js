function BtnToggle(anchor) {
    $(anchor + ' .edit').click(function(){
        $(anchor + ' input').removeClass('hidden');
        $(anchor + ' .save').removeClass('hidden');
        $(anchor + ' p').hide();
        $(this).hide();
    });

    $(anchor + ' .save').click(function() {
        var $input = $(anchor + ' input');
        var $p = $(anchor + ' p');
        $input.addClass('hidden');
        $p.text($input.val());
        $(this).addClass('hidden');
        $p.show();
        $(anchor + ' .edit').show();
    });
}

BtnToggle('#email');
BtnToggle('#name');


$('.submit-profile').click(function(e) {
    $('#profile').submit();
});

if (!WebUploader.Uploader.support()) {
    alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
    throw new Error('WebUploader does not support the browser you are using.');
}
// 初始化Web Uploader
var uploader = WebUploader.create({
    // 选完文件后，是否自动上传。
    auto: true,

    // swf文件路径
    swf: '/js/vendors/Uploader.swf',

    // 文件接收服务端。
    server: '/account/uploadProfileImg',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: {
        id: '#filePicker',
        multiple: false
    },

    // 限制选择图片文件格式。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});

var $list = $('#filelist');
// 当有文件添加进来的时候
uploader.on('fileQueued', function(file) {
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img class="profile">' +
            '</div>'
        ),
        $img = $li.find('img');


    // $list为容器jQuery实例
    $list.append($li);

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb(file, function(error, src) {
        if (error) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr('src', src);
    }, 100, 100);
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on('uploadSuccess', function(file) {
    $('#' + file.id).addClass('upload-state-done');
});

// 文件上传失败，显示上传出错。
uploader.on('uploadError', function(file) {
    var $li = $('#' + file.id),
        $error = $li.find('div.error');

    // 避免重复创建
    if (!$error.length) {
        $error = $('<div class="error"></div>').appendTo($li);
    }

    $error.text('上传失败');
});
