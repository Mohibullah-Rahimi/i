/*
 * Optimized vCard JS
 * Author: Mohibullah Rahimi
 * Original Author: ArtStyles (ArtTemplate)
 * Version: 2.0.0
 * Optimized for performance and reliability
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
      Tabs System
    -------------------------------------------------------------------*/
    function initTabs() {
        const $tabContents = $('.content .tabcontent');
        const $tabLinks = $('.nav__item a');
        const mobileBreakpoint = 580;

        // Hide all tabs except first
        $tabContents.hide().first().show();

        $tabLinks.on('click', function (e) {
            e.preventDefault();

            // Update active tab
            $tabLinks.removeClass('active');
            $(this).addClass('active');

            // Show selected content
            const currentTab = $(this).attr('href');
            $tabContents.hide();
            $(currentTab).show();

            // Special handling for Works tab
            if (currentTab === '#works-tab') {
                setTimeout(initWorksTab, 300);
            }

            // Mobile behavior
            if ($window.width() < mobileBreakpoint) {
                $('html, body').animate({
                    scrollTop: $("#content").offset().top - 35
                }, 0);
            }
        });
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
                    showFormError(".");   //An error occurred. Please try again
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
      Modern Contact Form (Fetch API fallback)
    -------------------------------------------------------------------*/
    function initModernContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        document.getElementById('form-success').style.display = 'block';
                        form.reset();
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
                    }
            })
                .catch(() => {
                    showFormError("Network error. Please try again.");
            });
        });
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
        initModernContactForm();

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
    /*-----------------------------------------------------------------
  Blog Post Handling
------------------------------------------------------------------*/
    /*-----------------------------------------------------------------
      Blog Post Handling
    ------------------------------------------------------------------*/
    function initBlogPosts() {
        // Handle blog post clicks
        $(document).on('click', '.load-blog-post', function (e) {
            e.preventDefault();
            const postUrl = $(this).data('post');
            const postTitle = $(this).data('title');

            // Show loading state
            $('#blog-posts-container').hide();
            $('#single-post-container').show();
            $('#back-to-blog').show();
            $('#single-post-container .post-content').html('<div class="loading-spinner">Loading post...</div>');

            // Load the post content
            $('#single-post-container .post-content').load(postUrl, function () {
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
            $('#single-post-container').hide();
            $('#blog-posts-container').show();
            $(this).hide();
            document.title = "Mohibullah Rahimi | Cloud & Network Engineer";
        });
    }

    // Initialize blog posts when page loads
    initBlogPosts();

});

// Blog Post URL Routing
document.addEventListener('DOMContentLoaded', function() {
    // Check URL on initial load
    checkBlogUrl();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        checkBlogUrl();
    });
    
    // Handle back to blog button
    document.getElementById('back-to-blog').addEventListener('click', function() {
        window.history.pushState(null, null, '#blog');
        showBlogList();
    });
    
    // Modify existing post click handlers
    document.querySelectorAll('.load-blog-post').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const postUrl = this.getAttribute('href');
            loadBlogPost(
                this.getAttribute('data-post'),
                this.getAttribute('data-title')
            );
            
            // Update URL without reloading
            window.history.pushState(null, null, postUrl);
        });
    });
});

function checkBlogUrl() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#blog/')) {
        // Extract post slug from URL
        const postSlug = hash.split('/')[1];
        const link = document.querySelector(`.load-blog-post[href="#blog/${postSlug}"]`);
        
        if (link) {
            loadBlogPost(
                link.getAttribute('data-post'),
                link.getAttribute('data-title')
            );
        } else {
            showBlogList();
        }
    } else if (hash === '#blog') {
        showBlogList();
    }
    // If no matching hash, do nothing (default tab will show)
}

function loadBlogPost(postFile, postTitle) {
    fetch(postFile)
        .then(response => response.text())
        .then(html => {
            // Hide blog list, show single post
            document.getElementById('blog-posts-container').style.display = 'none';
            document.getElementById('single-post-container').style.display = 'block';
            document.getElementById('back-to-blog').style.display = 'block';
            
            // Load post content
            document.querySelector('#single-post-container .post-content').innerHTML = html;
            
            // Update page title
            document.title = postTitle + ' | Mohibullah Rahimi';
            
            // Ensure blog tab is active
            document.querySelector('.nav__item a[href="#blog-tab"]').click();
        })
        .catch(error => {
            console.error('Error loading blog post:', error);
            showBlogList();
        });
}

function showBlogList() {
    document.getElementById('blog-posts-container').style.display = 'block';
    document.getElementById('single-post-container').style.display = 'none';
    document.getElementById('back-to-blog').style.display = 'none';
    document.title = 'Blog | Mohibullah Rahimi';
    
    // Ensure blog tab is active
    document.querySelector('.nav__item a[href="#blog-tab"]').click();
}