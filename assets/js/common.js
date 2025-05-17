/*
 * Optimized vCard JS
 * Author: Mohibullah Rahimi
 * Original Author: ArtStyles (ArtTemplate)
 * Version: 2.1.0
 * Optimized for performance and reliability with URL support
 */

$(document).ready(function () {
    'use strict';

    // Cache frequently used elements
    const $window = $(window);
    const $document = $(document);
    const $html = $('html');
    const $body = $('body');

    /*-----------------------------------------------------------------
      Device Detection
    -------------------------------------------------------------------*/
    const isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIE = /MSIE|Trident|Edge/.test(navigator.userAgent);

    $html.addClass(isMobile ? 'touch' : 'no-touch');

    /*-----------------------------------------------------------------
      Page Load Initialization
    -------------------------------------------------------------------*/
    function initializePage() {
        // Initial animations
        anime({
            targets: 'body',
            opacity: 1,
            delay: 400,
            complete: progressBar
        });

        // Preloader
        $('body, .js-img-load').imagesLoaded({ background: true }).always(preloader);
    }

    function preloader() {
        anime.timeline({})
            .add({
                targets: '.preloader',
                duration: 1,
                opacity: 1
            })
            .add({
                targets: '.circle-pulse',
                duration: 300,
                opacity: 1,
                zIndex: '-1',
                easing: 'easeInOutQuart'
            }, '+=500')
            .add({
                targets: '.preloader__progress span',
                duration: 500,
                width: '100%',
                easing: 'easeInOutQuart'
            }, '-=500')
            .add({
                targets: '.preloader',
                duration: 500,
                opacity: 0,
                zIndex: '-1',
                easing: 'easeInOutQuart'
            });
    }

    /*-----------------------------------------------------------------
      Carousels
    -------------------------------------------------------------------*/
    function initCarousels() {
        // Testimonials Carousel
        new Swiper('.js-carousel-review', {
            slidesPerView: 1,
            spaceBetween: 30,
            speed: 300,
            grabCursor: true,
            watchOverflow: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            autoplay: {
                delay: 5000,
            },
            breakpoints: {
                580: { spaceBetween: 20 }
            }
        });

        // Clients Carousel
        new Swiper('.js-carousel-clients', {
            slidesPerView: 4,
            spaceBetween: 30,
            grabCursor: true,
            watchOverflow: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 0 },
                580: { slidesPerView: 2, spaceBetween: 30 },
                991: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }

    /*-----------------------------------------------------------------
      Sticky Sidebar
    -------------------------------------------------------------------*/
    function initStickySidebar() {
        const $stickyColumn = $('.sticky-column');
        const $stickyParent = $('.sticky-parent');
        const screenBreakpoint = 1200;

        function activateSticky() {
            $stickyColumn.stick_in_parent({
                parent: $stickyParent
            }).on('sticky_kit:bottom', function () {
                $(this).parent().css('position', 'static');
            }).on('sticky_kit:unbottom', function () {
                $(this).parent().css('position', 'relative');
            });
        }

        function deactivateSticky() {
            $stickyColumn.trigger("sticky_kit:detach");
        }

        function handleResize() {
            const windowWidth = $window.width();
            if (windowWidth < screenBreakpoint) {
                deactivateSticky();
            } else {
                activateSticky();
            }
            $document.body.trigger("sticky_kit:recalc");
        }

        // Initial setup
        if ($window.width() >= screenBreakpoint) {
            activateSticky();
        }

        // Debounced resize handler
        $window.on('resize', debounce(handleResize, 250));
    }

    /*-----------------------------------------------------------------
      Progress Bar Animation
    -------------------------------------------------------------------*/
    function progressBar() {
        const ctrl = new ScrollMagic.Controller();
        new ScrollMagic.Scene({
            triggerElement: '.progress',
            triggerHook: 'onEnter',
            duration: 300
        })
            .on("enter", function () {
                $('.progress-bar').each(function () {
                    $(this).css({
                        'width': $(this).attr('aria-valuenow') + '%',
                        'z-index': '2'
                    });
                });
            })
            .addTo(ctrl);
    }

    /*-----------------------------------------------------------------
      Scroll Indicator
    -------------------------------------------------------------------*/
    function initScrollIndicator() {
        $window.on('scroll', function () {
            const scrollPercent = ($window.scrollTop() / ($document.height() - $window.height())) * 100;
            $('.scroll-line').css('width', scrollPercent + '%');
        });
    }

    /*-----------------------------------------------------------------
      Parallax Effect
    -------------------------------------------------------------------*/
    function initParallax() {
        $('.js-parallax').jarallax({
            disableParallax: isIE,
            speed: 0.65,
            type: 'scroll'
        });
    }

    /*-----------------------------------------------------------------
      Scroll To Top
    -------------------------------------------------------------------*/
    function initScrollToTop() {
        const $backToTop = $('.back-to-top');
        const showHeight = $window.height();

        $backToTop.hide();

        $window.on('scroll', function () {
            $backToTop.toggle($window.scrollTop() > showHeight);
        });

        $backToTop.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    }

    /*-----------------------------------------------------------------
      Auto-resize Textarea
    -------------------------------------------------------------------*/
    function initTextareaResize() {
        $('textarea').each(function () {
            autosize(this);
        });
    }

    /*-----------------------------------------------------------------
      Tabs System with URL Support
    -------------------------------------------------------------------*/
    function initTabs() {
        const $tabContents = $('.content .tabcontent');
        const $tabLinks = $('.nav__item a');
        const mobileBreakpoint = 580;

        // Map simple URLs to actual tab IDs
        const tabMap = {
            'about': 'about-tab',
            'resume': 'resume-tab',
            'portfolio': 'works-tab',
            'blog': 'blog-tab',
            'contact': 'contact-tab'
        };

        // Function to show a tab
        function showTab(tabId) {
            const actualTabId = tabMap[tabId] || 'about-tab';
            
            // Hide all tabs
            $tabContents.hide().removeClass('active');
            // Show selected tab
            $(`#${actualTabId}`).show().addClass('active');
            
            // Update active nav item
            $tabLinks.removeClass('active');
            $(`.nav__item a[href="#${tabId}"]`).addClass('active');
            
            // Special handling for Works tab
            if (actualTabId === 'works-tab') {
                setTimeout(initWorksTab, 300);
            }
        }

        // Check URL on page load
        function checkUrl() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                showTab(hash);
            } else {
                // Default to About tab if no hash
                showTab('about');
            }
        }

        // Handle tab clicks
        $tabLinks.on('click', function(e) {
            e.preventDefault();
            const tabId = $(this).attr('href').substring(1);
            window.history.pushState(null, null, `#${tabId}`);
            showTab(tabId);

            // Mobile behavior
            if ($window.width() < mobileBreakpoint) {
                $('html, body').animate({
                    scrollTop: $("#content").offset().top - 35
                }, 0);
            }
        });

        // Handle browser back/forward
        $(window).on('popstate', checkUrl);

        // Initial setup
        checkUrl();
    }

    /*-----------------------------------------------------------------
      Portfolio Filter and Masonry
    -------------------------------------------------------------------*/
    function initPortfolioFilter() {
        const $gallery = $('.gallery-grid');
        const $filterOptions = $('.filter-options');
        const $selectHeader = $('.select-header');
        const $filterOption = $('.filter-option');

        // Mobile filter toggle
        $selectHeader.on('click', function (e) {
            e.stopPropagation();
            $filterOptions.toggleClass('show');
        });

        // Filter selection
        $filterOption.on('click', function () {
            const filterValue = $(this).data('filter');
            $('.selected-option').text($(this).text());
            $filterOption.removeClass('active');
            $(this).addClass('active');
            $filterOptions.removeClass('show');

            $gallery.isotope({ filter: filterValue });
        });

        // Close when clicking outside
        $document.on('click', function () {
            $filterOptions.removeClass('show');
        });

        // Initialize Isotope
        $gallery.isotope({
            itemSelector: '.gallery-grid__item',
            percentPosition: true,
            masonry: { columnWidth: '.gutter-sizer' }
        });

        // Layout after images load
        $gallery.imagesLoaded().progress(function () {
            $gallery.isotope('layout').addClass('is-loaded');
        });
    }

    /*-----------------------------------------------------------------
      Image Zoom
    -------------------------------------------------------------------*/
    let zoomInstance = null;

    function initImageZoom() {
        // Only initialize on desktop
        if ($window.width() <= 768) return;

        // Clean up previous instance
        if (zoomInstance) {
            zoomInstance.detach();
            zoomInstance = null;
        }

        // Initialize new zoom
        try {
            zoomInstance = mediumZoom('[data-zoom]', {
                margin: 40,
                background: 'rgba(0, 0, 0, 0.9)',
                onOpen: () => $body.addClass('no-scroll'),
                onClose: () => $body.removeClass('no-scroll')
            });
        } catch (e) {
            console.error("Zoom initialization failed:", e);
        }
    }

    /*-----------------------------------------------------------------
      Works Tab Initialization
    -------------------------------------------------------------------*/
    function initWorksTab() {
        initPortfolioFilter();
        initImageZoom();
    }

    /*-----------------------------------------------------------------
      Lazy Loading
    -------------------------------------------------------------------*/
    function initLazyLoad() {
        lazySizes.init();
    }

    /*-----------------------------------------------------------------
      Object-fit Polyfill
    -------------------------------------------------------------------*/
    function initObjectFit() {
        objectFitImages($('img.cover'));
    }

    /*-----------------------------------------------------------------
      Contact Form
    -------------------------------------------------------------------*/
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
                    if (response === "success") {
                        showFormSuccess();
                    } else {
                        showFormError(response);
                    }
                },
                error: function () {
                    showFormError("An error occurred. Please try again");
                }
            });
        }

        function showFormSuccess() {
            $form[0].reset();
            $("#form-success").show();
            setTimeout(() => $("#form-success").hide(), 5000);
        }

        function showFormError(message) {
            $form.removeClass().addClass('shake animated').one('animationend', function () {
                $(this).removeClass();
            });
            $validatorContact.removeClass().addClass('validation-danger').text(message);
        }
    }

    /*-----------------------------------------------------------------
      Blog Post Handling with URL Support
    -------------------------------------------------------------------*/
    function initBlogPosts() {
        // Handle blog post clicks
        $(document).on('click', '.load-blog-post', function (e) {
            e.preventDefault();
            const postUrl = $(this).attr('href');
            const postFile = $(this).data('post');
            const postTitle = $(this).data('title');

            // Update URL
            window.history.pushState(null, null, postUrl);
            
            // Show loading state
            $('#blog-posts-container').hide();
            $('#single-post-container').show();
            $('#back-to-blog').show();
            $('#single-post-container .post-content').html('<div class="loading-spinner">Loading post...</div>');

            // Load the post content
            $('#single-post-container .post-content').load(postFile, function () {
                // Update the page title
                document.title = postTitle + " | Mohibullah Rahimi";

                // Scroll to top of post
                $('html, body').animate({
                    scrollTop: $('#blog-tab').offset().top - 20
                }, 300);
            });
        });

        // Handle back button
        $('#back-to-blog').on('click', function () {
            window.history.pushState(null, null, '#blog');
            $('#single-post-container').hide();
            $('#blog-posts-container').show();
            $(this).hide();
            document.title = "Mohibullah Rahimi | Cloud & Network Engineer";
        });

        // Check URL for blog posts on page load
        function checkBlogUrl() {
            const hash = window.location.hash;
            
            if (hash.startsWith('#blog/')) {
                const postSlug = hash.split('/')[1];
                const link = $(`.load-blog-post[href="#blog/${postSlug}"]`);
                
                if (link.length) {
                    link.trigger('click');
                } else {
                    showBlogList();
                }
            } else if (hash === '#blog') {
                showBlogList();
            }
        }

        function showBlogList() {
            $('#single-post-container').hide();
            $('#blog-posts-container').show();
            $('#back-to-blog').hide();
            document.title = 'Blog | Mohibullah Rahimi';
        }

        // Handle browser back/forward for blog
        $(window).on('popstate', checkBlogUrl);
        
        // Initial check
        checkBlogUrl();
    }

    /*-----------------------------------------------------------------
      Utility Functions
    -------------------------------------------------------------------*/
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

    /*-----------------------------------------------------------------
      Main Initialization
    -------------------------------------------------------------------*/
    function initAll() {
        initializePage();
        initCarousels();
        initStickySidebar();
        initScrollIndicator();
        initParallax();
        initScrollToTop();
        initTextareaResize();
        initTabs();
        initLazyLoad();
        initObjectFit();
        initContactForm();
        initBlogPosts();

        // Initialize Works tab if active
        if ($('#works-tab').hasClass('active')) {
            initWorksTab();
        }

        // Handle window resize for zoom
        $window.on('resize', debounce(function () {
            if ($('#works-tab').hasClass('active')) {
                initImageZoom();
            }
        }, 250));
    }

    // Start everything
    initAll();
});