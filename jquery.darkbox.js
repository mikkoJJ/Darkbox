/**
 * Darkbox jQuery plugin
 * 
 * Copyright (c) Mikko Jakonen 2012
 * Licenced under the MIT licence, see LICENCE.txt for details.
 */
(function($) {

    $.fn.darkbox = function(options) {
        
        /** The main settings of Darkbox */
        var settings = $.extend({
            bookname    : null,
            path        : "pages/",
            numPages    : 10,
            srcPattern  : "####.jpg",
            begin       : 0,
            
            //keyboard shortcuts:
            keyHide     : 27,   //esc
            keyNext     : 39,   //right arrow
            keyPrev     : 37,   //left arrow
            keySkipNext : 38,   //up arrow
            keySkipPrev : 40,   //down arrow
            
            //images:
            imgNext     : 'img/forward.png',
            imgNextNL   : 'img/forwardNOLINK.png',
            imgPrev     : 'img/backward.png',
            imgPrevNL   : 'img/backwardNOLINK.png',
            imgLoading  : 'img/loading.png',
            imgFirst    : 'img/first.png',
            imgFirstNL  : 'img/firstNOLINK.png',
            imgLast     : 'img/last.png',
            imgLastNL   : 'img/lastNOLINK.png',
            imgClose    : 'img/close.png',
            
            //element ID names: (NOTE: these must match the ones in darkbox.css)
            overlay     : '#DarkboxOverlay',
            book        : '#DarkboxBook',
            first       : '#DarkboxFirst',
            prev        : '#DarkboxPrev',
            next        : '#DarkboxNext',
            last        : '#DarkboxLast',
            loading     : '#DarkboxLoading',
            page        : '#DarkboxPage',
            mainImage   : '#DarkboxImage',
            pagecount   : '#DarkboxPages',
            currentPage : '#DarkboxCurrent',
            totalPages  : '#DarkboxTotal',
            close       : '#DarkboxClose'
        }, options);
        
        //initialize state variables:
        var container = this;
        var currentPage = 0;
        var isVisible = true;
        var shownImage = new Image();
        var bufferImage = new Image();
        var navImages = [];
        var navImagesDisabled = [];
        bufferImage.page = 0;
        
        //begin the darkness:
        return initialize(this);
         
        
        /**
         * This function initializes the Darkbox HTML framework
         * on which the images are shown. 
         * 
         * @param elem the jQuery element to initialize as a Darkbox container.
         * @returns elem for chaining purposes.
         */
        function initialize(elem) {
            $(settings.overlay).remove();
            
            //overlay and book:
            var html = '<div id="' + settings.overlay.substring(1) + '"><div id="' + settings.book.substring(1) + '">';
            //navigation backward:
            html += '<a id="' + settings.first.substring(1) + '" href="javascript://"><img src="' + settings.imgFirst + '"></a>' +
                    '<a id="' + settings.prev.substring(1) + '" href="javascript://"><img src="' + settings.imgPrev + '"></a>';
            //shown image:
            html += '<div id="' + settings.page.substring(1) + '"><img id="' + settings.mainImage.substring(1) + '" src=""><img id="' + settings.loading.substring(1) + '" src="'+ settings.imgLoading + '"></div>';
            //navigation forward:
            html += '<a id="' + settings.next.substring(1) + '" href="javascript://"><img src="' + settings.imgNext + '"></a>' +
            '<a id="' + settings.last.substring(1) + '" href="javascript://"><img src="' + settings.imgLast + '"></a>';
            //close book:
            html += '</div>';
            //meta:
            html += '<div id="' + settings.pagecount.substring(1) + '"><span id="' + settings.currentPage.substring(1) + '"></span> / <span id="' + settings.totalPages + '">' + settings.numPages + '</span></div>';
            //close:
            html += '<a href="javascript://"><div id="' + settings.close.substring(1) + '"></div></a>';
            //close overlay:
            html += '</div>';
            
            elem.append(html);
            
            //preload link images:
            for (var i = 0; i<4; i++) {
                navImages[i] = new Image();
                navImagesDisabled[i] = new Image();
            }
            navImages[0].src = settings.imgFirst;
            navImages[1].src = settings.imgPrev;
            navImages[2].src = settings.imgNext;
            navImages[3].src = settings.imgLast;
            navImagesDisabled[0].src = settings.imgFirstNL;
            navImagesDisabled[1].src = settings.imgPrevNL;
            navImagesDisabled[2].src = settings.imgNextNL;
            navImagesDisabled[3].src = settings.imgLastNL;
            
            //event bindings:
            $(settings.first).click(function() { showPage(1); });
            $(settings.last).click(function() { showPage(settings.numPages); });
            $(settings.prev).click(function() { showPage(currentPage-1); });
            $(settings.next).click(function() { showPage(currentPage+1); });
            $(settings.close).click(hide);
            //keyboard bindings:
            $(document).keyup(function(e) {
                if(!isVisible) return;
                if(e.which == settings.keyHide) hide();
                if(e.which == settings.keyNext) showPage(currentPage+1);
                if(e.which == settings.keyPrev) showPage(currentPage-1);
                if(e.which == settings.keySkipNext) showPage(currentPage+10);
                if(e.which == settings.keySkipPrev) showPage(currentPage-10);
            });
            
            showPage(1);
            return elem;
        } 
        
        
        /**
         * Hides the Darkbox overlay.
         */
        function hide() {
            $(settings.overlay).css("display", "none");
            isVisible = false;
        }
        
        /**
         * Shows the Darkbox overlay.
         */
        function show() {
            $(settings.overlay).css("display", "block");
            isVisible = true;
        }
        
        /**
         * Activates page navigation forward or backward.
         * @param direction use 1 for forward navigation and -1 for backward.
         */ 
        function activateNav(direction) {
            if (direction > 0) {
                $(settings.next + "> img").attr("src", navImages[2].src);
                $(settings.last + "> img").attr("src", navImages[3].src);
            } else {
                $(settings.first + "> img").attr("src", navImages[0].src);
                $(settings.prev + "> img").attr("src", navImages[1].src);
            }
        }
        
        /**
         * Dectivates page navigation forward or backward.
         * @param direction use 1 for forward navigation and -1 for backward.
         */ 
        function deactivateNav(direction) {
            if (direction > 0) {
                $(settings.next + "> img").attr("src", navImagesDisabled[2].src);
                $(settings.last + "> img").attr("src", navImagesDisabled[3].src);
            } else {
                $(settings.first + "> img").attr("src", navImagesDisabled[0].src);
                $(settings.prev + "> img").attr("src", navImagesDisabled[1].src);
            }
        }
        
        
        /**
         * Starts loading the pageNum:th image onto the screen, or puts it there
         * immediately if it was already buffered.
         */
        function showPage(pageNum) {
            var newPage = Math.min(Math.max(pageNum, 1), settings.numPages);
            if(newPage == currentPage) return;
            currentPage = newPage;
            
            if (currentPage <= 1) deactivateNav(-1);
            else activateNav(-1);
            if (currentPage >= settings.numPages) deactivateNav(1);
            else activateNav(1);
            
            $(settings.currentPage).text(currentPage);
            
            if(bufferImage.page == currentPage && bufferImage.complete) {
                shownImage.src = bufferImage.src;
                readyToShow();
            } 
            else {  
                var src = getSourceFor(currentPage);
           
                shownImage.src = src;
                $(shownImage).load(readyToShow).each(function(){
                    if(this.complete) $(this).trigger("load");
                });
                $(settings.loading).css("display", "block");
            }
            
            buffer(currentPage+1);
        }
        
        
        /**
         * This function is called when an image is ready to be shown on the darkbox
         * display.
         */
        function readyToShow() {
            $(settings.loading).css("display", "none");
            $(settings.mainImage).attr("src", shownImage.src);
            fitToPage();
        }
        
        
        /**
         * Start loading the pageNum:th image into the buffer.
         */
        function buffer(pageNum) {
            if(pageNum <= 0 || pageNum > settings.numPages) return;
            src = getSourceFor(pageNum);
            
            bufferImage.page = pageNum;
            bufferImage.src = src;
            $(bufferImage).load(bufferComplete).each(function() {
                if(this.complete) $(this).trigger("load");
            });
        }
        
        
        /**
         * Called when the buffer image has finished loading. If we were waiting for
         * the buffer to load, show the image immediately.
         */
        function bufferComplete() {
            if(bufferImage.page == currentPage) {
                shownImage.src = bufferImage.src;
                readyToShow();
            }
        }
        
        
        /**
         * Returns the source string (filename) for the num:th image with current settings.
         * Eg: getSourceFor(3) -> "0003.jpg", if we are using the srcPattern "####.jpg"
         */
        function getSourceFor(num) {
            if(settings.srcPattern) {
                var pattern = settings.srcPattern.match(/(#+)/g)[0];
                var src = "" + (num + settings.begin);
                while(src.length < pattern.length) {
                    src = "0" + src;
                }
                return settings.path + settings.srcPattern.replace(pattern, src);
            }
        }
        
        
        /**
         * Adjusts the page image to fill the whole height of the parent
         * container.
         */
        function fitToPage() {
            var h = $(window).height();
            if(h > 0) $(settings.mainImage).css("height", h).css("width", "auto");
        }
        
    };
})(jQuery);
