(function($) {

    $.fn.darkbox = function(options) {
        
        /** The main settings of Darkbox */
        var settings = $.extend({
            bookname    : null,
            path        : "pages/",
            extension   : ".jpg",
            numPages    : 11,
            
            //keyboard shortcuts:
            keyHide     : 27,   //esc
            keyNext     : 39,   //right arrow
            keyPrev     : 37,   //left arrow
            keySkipNext : 38,   //up arrow
            keySkipPrev : 40,   //down arrow
            
            //images:
            imgNext     : 'img/forward.png',
            imgPrev     : 'img/backward.png',
            imgLoading  : 'img/loading.png',
            imgFirst    : 'img/first.png',
            imgLast     : 'img/last.png',
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
        
        var currentPage = 1;
        
        
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
            
            //event bindings:
            $(settings.first).click(function() { showPage(1); });
            $(settings.last).click( function() { showPage(settings.numPages); });
            $(settings.prev).click( function() { showPage(currentPage-1); });
            $(settings.next).click( function() { showPage(currentPage+1); });
            $(settings.close).click(hide);
            
            currentPage = 1;
            showPage(currentPage);
            return elem;
        } 
        
        /**
         * Hides the Darkbox overlay.
         */
        function hide() {
            $(settings.overlay).css("display", "none");
        }
        
        /**
         * Swaps the page with the number pageNum as the currently viewed
         * page.
         */
        function showPage(pageNum) {
            currentPage = pageNum;
            $(settings.currentPage).text(pageNum);    
        
        
        }
        
        
    };
})(jQuery);
