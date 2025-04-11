/*
 * Author: ArtStyles (ArtTemplate)
 * Template Name: vCard
 * Version: 1.0.0
 * Updated for Works Tab functionality
*/

$(document).ready(function() {
    'use strict';

    /*-----------------------------------------------------------------
      Detect device mobile
    -------------------------------------------------------------------*/
    var isMobile = false; 
    if(/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('html').addClass('touch');
        isMobile = true;
    } else {
        $('html').addClass('no-touch');
        isMobile = false;
    }
    
    //IE, Edge
    var isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent);

    /*-----------------------------------------------------------------
      Loaded
    -------------------------------------------------------------------*/
    anime({
        targets: 'body',
        opacity: 1,
        delay: 400,
        complete: function(anim) {
            progressBar();
        }
    });
    
    $('body, .js-img-load').imagesLoaded({ background: !0 }).always(function(instance) {
        preloader();
    });

    function preloader() {
        var tl = anime.timeline({}); 
        tl
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
        },'+=500')
        .add({
            targets: '.preloader__progress span',
            duration: 500,
            width: '100%',
            easing: 'easeInOutQuart'
        },'-=500')
        .add({
            targets: '.preloader',
            duration: 500,
            opacity: 0,
            zIndex: '-1',
            easing: 'easeInOutQuart'
        });
    };

    /*-----------------------------------------------------------------
      Carousel
    -------------------------------------------------------------------*/    
    // Testimonials
    $('.js-carousel-review').each(function() {
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
                580: {
                    spaceBetween: 20
                }
            }
        });
    });
    
    // Clients
    $('.js-carousel-clients').each(function() {
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
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },              
                580: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },              
                991: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    });
    
    /*-----------------------------------------------------------------
      Sticky sidebar
    -------------------------------------------------------------------*/
    setTimeout(function() { 
        function activeStickyKit() {
            $('.sticky-column').stick_in_parent({
                parent: '.sticky-parent'
            });

            $('.sticky-column')
            .on('sticky_kit:bottom', function(e) {
                $(this).parent().css('position', 'static');
            })
            .on('sticky_kit:unbottom', function(e) {
                $(this).parent().css('position', 'relative');
            });
        };

        function detachStickyKit() {
            $('.sticky-column').trigger("sticky_kit:detach");
        };

        var screen = 1200;
        var windowWidth = $(window).width();
        if ((windowWidth < screen)) {
            detachStickyKit();
        } else {
            activeStickyKit();
        }

        function windowSize() {
            windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
            windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
        }
        windowSize();

        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        $(window).resize(debounce(function(){
            windowSize();
            $(document.body).trigger("sticky_kit:recalc");
            if (windowWidth < screen) {
                detachStickyKit();
            } else {
                activeStickyKit();
            }
        }, 250));
    }, 10);

    /*-----------------------------------------------------------------
      Progress bar
    -------------------------------------------------------------------*/
    function progressBar() {
        $('.progress').each(function() {
            var ctrl = new ScrollMagic.Controller();
            new ScrollMagic.Scene({
                triggerElement: '.progress',
                triggerHook: 'onEnter',
                duration: 300
            })
            .addTo(ctrl)
            .on("enter", function (e) {
                var progressBar = $('.progress-bar');
                progressBar.each(function(indx){
                    $(this).css({'width': $(this).attr('aria-valuenow') + '%', 'z-index': '2'});
                });
            });
        });
    }
    
    /*-----------------------------------------------------------------
      Scroll indicator
    -------------------------------------------------------------------*/
    function scrollIndicator() {
        $(window).on('scroll', function() {
            var wintop = $(window).scrollTop(), 
                docheight = $(document).height(), 
                winheight = $(window).height();
            var scrolled = (wintop/(docheight-winheight))*100;
            $('.scroll-line').css('width', (scrolled + '%'));
        });
    }
    scrollIndicator();
    
    /*-----------------------------------------------------------------
      Jarallax
    -------------------------------------------------------------------*/        
    function parallax() {
        $('.js-parallax').jarallax({
            disableParallax: function () {
                return isIE
            },
            speed: 0.65,
            type: 'scroll'
        });
    };
    parallax();
    
    /*-----------------------------------------------------------------
      ScrollTo
    -------------------------------------------------------------------*/
    function scrollToTop() {
        var $backToTop = $('.back-to-top'),
            $showBackTotop = $(window).height();
            
        $backToTop.hide();

        $(window).scroll(function() {
            var windowScrollTop = $(window).scrollTop();
            if(windowScrollTop > $showBackTotop) {
                $backToTop.fadeIn('slow');
            } else {
                $backToTop.fadeOut('slow');
            }
        });
        
        $backToTop.on('click', function (e) {
            e.preventDefault();
            $('body, html').animate({scrollTop: 0}, 'slow');
        });
    }
    scrollToTop();
    
    /*-----------------------------------------------------------------
      Autoresize textarea
    -------------------------------------------------------------------*/    
    $('textarea').each(function(){
        autosize(this);
    });

    /*-----------------------------------------------------------------
      Tabs
    -------------------------------------------------------------------*/    
    $('.js-tabs').each(function(){
        $('.content .tabcontent').hide();
        $('.content .tabcontent:first').show();
        $('.nav__item a').on('click', function() {
            $('.nav__item a').removeClass('active');
            $(this).addClass('active');
            var currentTab = $(this).attr('href');
            $('.content .tabcontent').hide();            
            $(currentTab).show();
            
            // Reinitialize Works tab if needed
            if(currentTab === '#works-tab') {
                setTimeout(function() {
                    initPortfolioFilter();
                    initImageZoom();
                }, 300);
            }
            
            return false;
        });
        
        // Mobile close menu
        var screenMobile = 580;
        var windowWidth = $(window).width();
        if ((windowWidth < screenMobile)) {    
            $(".nav__item a").click(function(e) {
                e.preventDefault();
                var offset = -35;
                $('html, body').animate({
                    scrollTop: $("#content").offset().top + offset
                }, 0);
            });            
        }
    });
    
    /*-----------------------------------------------------------------
      Tooltip
    -------------------------------------------------------------------*/
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });

    /*-----------------------------------------------------------------
      Portfolio Filter and Masonry - WORKING IMPLEMENTATION
    -------------------------------------------------------------------*//*-----------------------------------------------------------------
  Portfolio Filter - Fixed Implementation
------------------------------------------------------------------*/
function initPortfolioFilter() {
    // Mobile filter toggle
    $('.select-header').on('click', function(e) {
        e.stopPropagation();
        $('.filter-options').toggleClass('show');
    });
    
    // Filter selection
    $('.filter-option').on('click', function() {
        const filterValue = $(this).data('filter');
        $('.selected-option').text($(this).text());
        $('.filter-option').removeClass('active');
        $(this).addClass('active');
        $('.filter-options').removeClass('show');
        
        $('.js-filter-container').isotope({ filter: filterValue });
    });
    
    // Close when clicking outside
    $(document).on('click', function() {
        $('.filter-options').removeClass('show');
    });
    
    // Initialize Isotope
    const $grid = $('.js-filter-container').isotope({
        itemSelector: '.gallery-grid__item',
        percentPosition: true,
        masonry: {
            columnWidth: '.gutter-sizer'
        }
    });
    
    // Layout after images load
    $grid.imagesLoaded().progress(function() {
        $grid.isotope('layout');
    });
}

/*-----------------------------------------------------------------
  Image Zoom - Fixed Implementation (single click)
------------------------------------------------------------------*/
function initImageZoom() {
    if ($(window).width() > 768) {
        mediumZoom('[data-zoom]', {
            margin: 40,
            background: 'rgba(0, 0, 0, 0.9)',
            template: '#zoom-template',
            onOpen: function() {
                document.body.style.overflow = 'hidden';
            },
            onClose: function() {
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize on Works tab load
$('.nav__item a[href="#works-tab"]').on('click', function() {
    setTimeout(function() {
        initPortfolioFilter();
        initImageZoom();
    }, 300);
});

// Initialize if Works tab is active on page load
if ($('#works-tab').hasClass('active')) {
    initPortfolioFilter();
    initImageZoom();
}

    /*-----------------------------------------------------------------
      Image Zoom - WORKING IMPLEMENTATION
    -------------------------------------------------------------------*/
    function initImageZoom() {
        // Only initialize on desktop
        if ($(window).width() > 768 && typeof mediumZoom !== 'undefined') {
            mediumZoom('[data-zoom]', {
                margin: 40,
                background: 'rgba(0, 0, 0, 0.9)'
            });
        }
    }

    /*-----------------------------------------------------------------
      Initialize Works Tab Features
    -------------------------------------------------------------------*/
    function initWorksTab() {
        initPortfolioFilter();
        initImageZoom();
    }

    // Initialize if Works tab is active on page load
    if ($('#works-tab').hasClass('active')) {
        initWorksTab();
    }

    // Initialize when switching to Works tab
    $('.nav__item a[href="#works-tab"]').on('click', function() {
        setTimeout(initWorksTab, 300);
    });

    /*-----------------------------------------------------------------
      Lazyload
    -------------------------------------------------------------------*/
    lazySizes.init();

    /*-----------------------------------------------------------------
      Polyfill object-fit
    -------------------------------------------------------------------*/    
    var $someImages = $('img.cover');
    objectFitImages($someImages);
    
    /*-----------------------------------------------------------------
      Contacts form
    -------------------------------------------------------------------*/
    $("#contact-form").validator().on("submit", function(event) {
        if (event.isDefaultPrevented()) {
            formError();
            submitMSG(false, "Please fill in the form...");
        } else {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        var name = $("#nameContact").val(),
            email = $("#emailContact").val(),
            message = $("#messageContact").val();
            
        var url = "assets/php/form-contact.php";
        
        $.ajax({
            type: "POST",
            url: url,
            data: "name=" + name + "&email=" + email + "&message=" + message,
            success: function(text) {
                if (text == "success") {
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false, text);
                }
            }
        });
    }

    function formSuccess() {
        $("#contact-form")[0].reset();
        submitMSG(true, "Thanks! Your message has been sent.");
    }
  
    function formError() {
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
    }  
  
    function submitMSG(valid, msg) {
        var msgClasses;
        if(valid) {
            msgClasses = "validation-success";
        } else {
            msgClasses = "validation-danger";
        }
        $("#validator-contact").removeClass().addClass(msgClasses).text(msg);
    }
});

    /*-----------------------------------------------------------------
      Contacts form - Fetch API or works with sparcecode 
    -------------------------------------------------------------------*/
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            document.getElementById('form-success').style.display = 'block';
            this.reset();
            setTimeout(() => {
                document.getElementById('form-success').style.display = 'none';
            }, 5000);
        }
    });
});
