function hide_loading_bar() {
    var $ = jQuery,
        $loading_bar = $(".neon-loading-bar"),
        $pct = $loading_bar.find('span');

    $loading_bar.addClass('progress-is-hidden');
    $pct.width(0).data('pct');
}

function show_loading_bar(options) {
    var defaults = {
        pct: 0,
        delay: 1.3,
        wait: 0,
        before: function() {},
        finish: function() {},
        resetOnEnd: true
    };

    if (typeof options === 'object') {
        defaults = jQuery.extend(defaults, options);
    } else if (typeof options === 'number') {
        defaults.pct = options;
    }

    if (defaults.pct > 100) {
        defaults.pct = 100;
    } else if (defaults.pct < 0) {
        defaults.pct = 0;
    }

    var $ = jQuery,
        $loading_bar = $(".neon-loading-bar");

    if ($loading_bar.length === 0) {
        $loading_bar = $('<div class="neon-loading-bar progress-is-hidden"><span data-pct="0"></span></div>');
        $('body').append($loading_bar);
    }

    var $pct = $loading_bar.find('span'),
        current_pct = $pct.data('pct'),
        is_regress = current_pct > defaults.pct;


    defaults.before(current_pct);
}

$(document).ready(function($) {
    $(".nav li a[href='/articles/explore']").click(function(ev) {
        show_loading_bar({
            pct: 20,
            delay: 0.1,
            finish: function(pct) {
                show_loading_bar({
                    pct: 100
                });
            }
        });
    });
    $(".nav li a[href='/articles/new']").click(function(ev) {
        show_loading_bar({
            pct: 20,
            delay: 0.1,
            finish: function(pct) {
                show_loading_bar({
                    pct: 100
                });
            }
        });
    });
    $(".nav li a[href='/articles/my']").click(function(ev) {
        show_loading_bar({
            pct: 20,
            delay: 0.1,
            finish: function(pct) {
                show_loading_bar({
                    pct: 100
                });
            }
        });
    });
});
