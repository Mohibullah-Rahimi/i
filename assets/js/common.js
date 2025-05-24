/*
 * vCard JS (Fixed for Blog Deep-Linking)
 * Author: Mohibullah Rahimi
 * Original: ArtStyles (ArtTemplate)
 * Version: 2.1.1
 * Deep-linking and tab/blog routing fixed by Copilot
 */

$(document).ready(function () {
    'use strict';

    // Cache selectors
    const $window = $(window);
    const $document = $(document);
    const $html = $('html');
    const $body = $('body');

    // Device detection
    const isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    $html.addClass(isMobile ? 'touch' : 'no-touch');

    /*----------------------------------------
      Tabs & Blog Routing (Deep-Link Fix)
    ----------------------------------------*/
    // Tab slug to DOM id
    const tabMap = {
        'about': 'about-tab',
        'resume': 'resume-tab',
        'portfolio': 'works-tab',
        'works': 'works-tab',
        'blog': 'blog-tab',
        'contact': 'contact-tab'
    };

    // Show a tab by slug (e.g. 'about' or 'blog')
    function showTab(tabSlug) {
        let baseSlug = tabSlug.split('/')[0];
        let tabId = tabMap[baseSlug] || 'about-tab';

        // Hide all, show one
        $('.tabcontent').hide().removeClass('active');
        $('#' + tabId).show().addClass('active');

        // Update nav active state
        $('.nav__item a').removeClass('active');
        $(`.nav__item a[href="#${baseSlug}"]`).addClass('active');

        // If works tab, re-init grid/zoom after rendering
        if (tabId === 'works-tab') setTimeout(initWorksTab, 200);
    }

    // Show blog post or blog list if hash matches
    function handleBlogHash() {
        let hash = window.location.hash;
        if (hash.startsWith('#blog/')) {
            // Always show the Blog tab
            showTab('blog');
            // Extract post slug
            let postSlug = hash.replace('#blog/', '');
            let $link = $(`.load-blog-post[href="#blog/${postSlug}"]`);
            if ($link.length) {
                loadBlogPost($link);
            } else {
                showBlogList();
            }
        } else if (hash === '#blog') {
            showTab('blog');
            showBlogList();
        }
    }

    // Main hash routing: decides which tab to show, and blog post if needed
    function handleHashRouting() {
        let hash = window.location.hash.replace(/^#/, '');
        if (hash.startsWith('blog/')) {
            handleBlogHash();
        } else if (tabMap[hash]) {
            showTab(hash);
            if (hash === 'blog') showBlogList();
        } else if (hash === '') {
            showTab('about');
        } else {
            // Unknown tab, default to about
            showTab('about');
        }
    }

    // Navigation link clicks
    $('.nav__item a').on('click', function (e) {
        e.preventDefault();
        let tabSlug = $(this).attr('href').replace(/^#/, '');
        window.location.hash = `#${tabSlug}`;
        // Routing will update via onhashchange
    });

    // Listen for hash changes (user navigation, browser back/forward)
    window.addEventListener('hashchange', handleHashRouting);

    // Initial load
    handleHashRouting();

    /*----------------------------------------
      Blog Post Logic
    ----------------------------------------*/
    function loadBlogPost($link) {
        // Only load if not already loaded
        if ($('#single-post-container').is(':visible') && $('#single-post-container .post-content').data('current') === $link.attr('href')) return;

        let postFile = $link.data('post');
        let postTitle = $link.data('title');

        // Loading UI
        $('#blog-posts-container').hide();
        $('#single-post-container').show();
        $('#back-to-blog').show();
        $('#single-post-container .post-content').html('<div class="loading-spinner">Loading post...</div>');
        $('#single-post-container .post-content').data('current', $link.attr('href'));

        // Load
        $('#single-post-container .post-content').load(postFile, function () {
            document.title = postTitle + " | Mohibullah Rahimi";
            // Scroll to top of post
            $('html, body').animate({
                scrollTop: $('#blog-tab').offset().top - 20
            }, 200);
        });
    }

    // Click on blog posts
    $(document).on('click', '.load-blog-post', function (e) {
        e.preventDefault();
        let href = $(this).attr('href');
        // Change hash, this will trigger hashchange and load logic
        window.location.hash = href;
    });

    // Back to blog list button
    $('#back-to-blog').on('click', function () {
        window.location.hash = '#blog';
    });

    function showBlogList() {
        $('#single-post-container').hide();
        $('#blog-posts-container').show();
        $('#back-to-blog').hide();
        document.title = "Blog | Mohibullah Rahimi";
        $('#single-post-container .post-content').data('current', '');
    }

    /*----------------------------------------
      Other UI Initializers (as in your original)
    ----------------------------------------*/
    function initializePage() {
        anime({ targets: 'body', opacity: 1, delay: 400, complete: progressBar });
        $('body, .js-img-load').imagesLoaded({ background: true }).always(preloader);
    }
    function preloader() {
        anime.timeline({})
            .add({ targets: '.preloader', duration: 1, opacity: 1 })
            .add({ targets: '.circle-pulse', duration: 300, opacity: 1, zIndex: '-1', easing: 'easeInOutQuart' }, '+=500')
            .add({ targets: '.preloader__progress span', duration: 500, width: '100%', easing: 'easeInOutQuart' }, '-=500')
            .add({ targets: '.preloader', duration: 500, opacity: 0, zIndex: '-1', easing: 'easeInOutQuart' });
    }
    function progressBar() {
        const ctrl = new ScrollMagic.Controller();
        new ScrollMagic.Scene({
            triggerElement: '.progress',
            triggerHook: 'onEnter',
            duration: 300
        })
            .on("enter", function () {
                $('.progress-bar').each(function () {
                    $(this).css({ 'width': $(this).attr('aria-valuenow') + '%', 'z-index': '2' });
                });
            })
            .addTo(ctrl);
    }
    function initCarousels() {
        new Swiper('.js-carousel-review', {
            slidesPerView: 1, spaceBetween: 30, speed: 300, grabCursor: true, watchOverflow: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            autoplay: { delay: 5000 },
            breakpoints: { 580: { spaceBetween: 20 } }
        });
        new Swiper('.js-carousel-clients', {
            slidesPerView: 4, spaceBetween: 30, grabCursor: true, watchOverflow: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 0 },
                580: { slidesPerView: 2, spaceBetween: 30 },
                991: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }
    function initStickySidebar() {
        const $stickyColumn = $('.sticky-column');
        const $stickyParent = $('.sticky-parent');
        const screenBreakpoint = 1200;
        function activateSticky() {
            $stickyColumn.stick_in_parent({ parent: $stickyParent })
                .on('sticky_kit:bottom', function () { $(this).parent().css('position', 'static'); })
                .on('sticky_kit:unbottom', function () { $(this).parent().css('position', 'relative'); });
        }
        function deactivateSticky() {
            $stickyColumn.trigger("sticky_kit:detach");
        }
        function handleResize() {
            const windowWidth = $window.width();
            if (windowWidth < screenBreakpoint) { deactivateSticky(); } else { activateSticky(); }
            $document.body.trigger("sticky_kit:recalc");
        }
        if ($window.width() >= screenBreakpoint) activateSticky();
        $window.on('resize', debounce(handleResize, 250));
    }
    function initScrollIndicator() {
        $window.on('scroll', function () {
            const scrollPercent = ($window.scrollTop() / ($document.height() - $window.height())) * 100;
            $('.scroll-line').css('width', scrollPercent + '%');
        });
    }
    function initParallax() {
        $('.js-parallax').jarallax({ disableParallax: /MSIE|Trident|Edge/.test(navigator.userAgent), speed: 0.65, type: 'scroll' });
    }
    function initScrollToTop() {
        const $backToTop = $('.back-to-top');
        const showHeight = $window.height();
        $backToTop.hide();
        $window.on('scroll', function () { $backToTop.toggle($window.scrollTop() > showHeight); });
        $backToTop.on('click', function (e) { e.preventDefault(); $('html, body').animate({ scrollTop: 0 }, 'slow'); });
    }
    function initTextareaResize() {
        $('textarea').each(function () { autosize(this); });
    }
    function initPortfolioFilter() {
        const $gallery = $('.gallery-grid');
        const $filterOptions = $('.filter-options');
        const $selectHeader = $('.select-header');
        const $filterOption = $('.filter-option');
        $selectHeader.on('click', function (e) { e.stopPropagation(); $filterOptions.toggleClass('show'); });
        $filterOption.on('click', function () {
            const filterValue = $(this).data('filter');
            $('.selected-option').text($(this).text());
            $filterOption.removeClass('active');
            $(this).addClass('active');
            $filterOptions.removeClass('show');
            $gallery.isotope({ filter: filterValue });
        });
        $document.on('click', function () { $filterOptions.removeClass('show'); });
        $gallery.isotope({
            itemSelector: '.gallery-grid__item',
            percentPosition: true,
            masonry: { columnWidth: '.gutter-sizer' }
        });
        $gallery.imagesLoaded().progress(function () {
            $gallery.isotope('layout').addClass('is-loaded');
        });
    }
    let zoomInstance = null;
    function initImageZoom() {
        if ($window.width() <= 768) return;
        if (zoomInstance) { zoomInstance.detach(); zoomInstance = null; }
        try {
            zoomInstance = mediumZoom('[data-zoom]', {
                margin: 40,
                background: 'rgba(0, 0, 0, 0.9)',
                onOpen: () => $body.addClass('no-scroll'),
                onClose: () => $body.removeClass('no-scroll')
            });
        } catch (e) { }
    }
    function initWorksTab() {
        initPortfolioFilter();
        initImageZoom();
    }
    function initLazyLoad() { lazySizes.init(); }
    function initObjectFit() { objectFitImages($('img.cover')); }
    function initContactForm() {
        const $form = $("#contact-form");
        const $validatorContact = $("#validator-contact");
        $form.validator().on("submit", function (event) {
            if (event.isDefaultPrevented()) {
                showFormError("Please fill out all required fields");
            } else {
                event.preventDefault();
                submitContactForm();
            }
        });
        function submitContactForm() {
            const formData = $form.serialize();
            $.ajax({
                type: "POST",
                url: "assets/php/form-contact.php",
                data: formData,
                success: function (response) {
                    if (response === "success") { showFormSuccess(); } else { showFormError(response); }
                },
                error: function () { showFormError("An error occurred. Please try again"); }
            });
        }
        function showFormSuccess() {
            $form[0].reset();
            $("#form-success").show();
            setTimeout(() => $("#form-success").hide(), 5000);
        }
        function showFormError(message) {
            $form.removeClass().addClass('shake animated').one('animationend', function () { $(this).removeClass(); });
            $validatorContact.removeClass().addClass('validation-danger').text(message);
        }
    }
    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /*----------------------------------------
      Init All
    ----------------------------------------*/
    function initAll() {
        initializePage();
        initCarousels();
        initStickySidebar();
        initScrollIndicator();
        initParallax();
        initScrollToTop();
        initTextareaResize();
        initLazyLoad();
        initObjectFit();
        initContactForm();
        // Blog and tab routing are now handled globally above!
        // Initialize Works tab if active
        if ($('#works-tab').hasClass('active')) setTimeout(initWorksTab, 200);
        // Handle window resize for zoom
        $window.on('resize', debounce(function () {
            if ($('#works-tab').hasClass('active')) { initImageZoom(); }
        }, 250));
    }

    // Start
    initAll();
});