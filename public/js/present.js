if (!window.presStarted) {
    window.startPres(document, window);
    window.pres().init();
}

$(function() {
    // Catch scroll event
    $(window).scroll(function() {
        if ($(this).scrollTop() < 600) {
            $("#arrowLeft").show();
            $("#arrowRight").show();
        } else {
            $("#arrowLeft").hide();
            $("#arrowRight").hide();
        }
    });
    $('#arrowLeft').click(function(e) {
        window.pres().prev();
        e.preventDefault();
    });

    $('#arrowRight').click(function(e) {
        window.pres().next();
        e.preventDefault();
    });

    $('.navbar').addClass('hidden-sm hidden-xs');
    $('.comments').addClass('hidden-sm hidden-xs');

    var calculateHeight = function() {
        var slideHeight = $('.step').height();
        var slideWidth = $('.step').width();

        var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
        var cssTransMatrix = $('#impress').css(window.browserPrefix + 'transform');
        var matches = cssTransMatrix.match(matrixRegex);
        // matches[1] will contain scaleX and matches[2] will contain scaleY.
        // if orientation is landscape
        if (window.innerHeight < window.innerWidth) {
            $('.bg').height((slideHeight + 30) * matches[2]);
        } else { // if orientation is protrait
            $('.bg').height((slideHeight * 2) * matches[1]);
        }
    };

    calculateHeight();
    $(window).resize(calculateHeight);


    var $loveIcon = $('.loves i');
    var articleId = $('.id').text();
    $loveIcon.click(function(e) {
        $loveIcon.toggleClass('getbigger');
        $.get('/articles/' + articleId + '/love', function(data) {
            console.log(data);
            $loveIcon.text(' ' + data);
        });
    });


});
