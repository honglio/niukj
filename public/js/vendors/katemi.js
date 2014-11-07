// jQuery for Katemi Landing Page
jQuery(document).ready(function($) {
    // jQuery OnePageNav ------------------------------------------------------ //
    $('.annotation-link').tooltip()

    // jQuery OnePageNav ------------------------------------------------------ //
    $('.katemi-nav').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 750,
        scrollOffset: 75,
        filter: ':not(.unscroll)'
    });

    // jQuery Flexslider ------------------------------------------------------ //

    $('.flexslider-featurettes').flexslider({
        animation: "fade",
        slideshowSpeed: 3000,
        animationSpeed: 700,
        controlNav: false,
        directionNav: false
    });

    // jQuery PrettyPhoto ------------------------------------------------------ //
    $("a[rel^='prettyPhoto']").prettyPhoto({
        social_tools: '',
        default_width: 800,
        default_height: 488
    });

    // jQuery ToTop ------------------------------------------------------ //

});

// close
