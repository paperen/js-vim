/**
 * js-vim
 * @author paperen<paperen@gmail.com>
 * @link http://iamlze.cn
 */

(function($){
    $.fn.vim = function(options) {
        var defaults = {
            'debug' : true,
            'scrollpx' : 50
        },
        // 键值映射
        keyMap = {
            'CTRL' : 17,
            'SHIFT' : 16,
            'FSLASH' : 191,
            'p' : 80,
            'y' : 89,
            'f' : 70,
            'h' : 72,
            'l' : 76,
            'g' : 71,
            'h' : 72,
            'j' : 74,
            'k' : 75,
            'd' : 68,
            'u' : 85,
            'r' : 82,
            'ESC' : 27,
            '0' : 48,
            '9' : 57
        },
        // 命令组合
        commandArr = [
            'y+y',
            'r',
            'j',
            'k',
            'd',
            'u',
            'gg',
            'SHIFTg',
            'SHIFTh',
            'SHIFTl',
            'f',
            'F'
        ],
        // 命令解析
        commandTxt = {
            'yy' : '复制当前标签页链接到剪切板',
            'r' : '重新载入当前页面',
            'j' : '向下滚动',
            'k' : '向上滚动',
            'd' : '向下滚动半页',
            'u' : '向上滚动半页',
            'gg' : '滚动到页面顶部',
            'SHIFTg' : '滚动到页面底部',
            'SHIFTh' : '后退',
            'SHIFTl' : '前进',
            'f' : '打开当前页面上某个链接',
            'F' : '在新标签页中打开当前页面上某个链接'
        },
        // 按键堆栈
        keyStack = [],
        // 设置
        settings = $.extend({}, defaults, options),
        // 命令堆栈
        commandStack = [];

        /**
         * init
         */
        function init() {
            for ( var i=0; i<commandArr.length; i++ ) {
                commandStack.push( commandArr[i].replace('+', '') );
            }
            if ( settings.debug ) console.log( '所有命令组合：' + commandStack + "\n\r" );
        }
        init();

        /**
         * code2key
         * @param keyCode int
         * @return string
         */
        function code2Key( keyCode ) {
            for ( var k in keyMap ) {
                if ( keyMap[k] == keyCode ) return k;
            }
            return null;
        }

        /**
         * push key into stack
         * @param key string
         */
        function pushKeyStack( key ) {
            keyStack.push( key );
            if ( settings.debug ) console.log( '按键堆栈为：' + keyStack + "\n\r" );
        }

        /**
         * clear keyStack
         */
        function clearKeyStack() {
            keyStack = [];
        }

        /**
         * exec command
         */
        function exec() {
            var keyStackStr = keyStack.join('');
            for( var i=0; i<commandStack.length; i++ ) {
                if ( keyStackStr.indexOf( commandStack[i] ) != -1 ) {
                    try {
                        eval( commandStack[i] + '()' );
                        if ( settings.debug ) console.log('exec ' + commandStack[i] + ':' + commandTxt[commandStack[i]] + "\n\r");
                        //clear keyStack
                        clearKeyStack();
                        break;
                    } catch( e ) {
                        //exception
                        if ( settings.debug ) console.log( e.message );
                    }
                }
            }
        }

        // keydown
        $(this).keydown(function(e){
            var key = code2Key( e.keyCode );
            if ( key != null ) {
                pushKeyStack( key );
                exec();
            }
        });


        // ---------------- command start ----------- //
        function yy() {
            alert('copy page URL');
        }

        function r() {
            window.location.reload();
        }

        function j() {
            $('body').scrollTop( $('body').scrollTop() + settings.scrollpx );
        }

        function k() {
            $('body').scrollTop( $('body').scrollTop() - settings.scrollpx );
        }

        function u() {
            var offset = $(window).height() / 2;
            $('body').scrollTop( $('body').scrollTop() - offset );
        }

        function d() {
            var offset = $(window).height() / 2;
            $('body').scrollTop( $('body').scrollTop() + offset );
        }

        function gg() {
            $('body').scrollTop(0);
        }

        function SHIFTg() {
            var offset = $('body').height();
            $('body').scrollTop(offset);
        }

        function SHIFTh() {
            window.history.go(-1);
        }

        function SHIFTl() {
            window.history.go(1);
        }

        function f() {
            if ( $('.js-vim-hint').length > 0 ) return;
            var hint = $('<span>').css({
                'color' : '#000',
                'font-weight' : 'bold',
                'font-size' : '12px',
                'font-family' : 'Vendana',
                'padding' : '2px',
                'background' : '#FFD76E',
                'position' : 'absolute',
                'border-radius' : '4px',
                'opacity' : '0.8',
            }).attr('class', 'js-vim-hint');
            var index = 10;
            $('a').each(function(){
                var offset = $(this).offset();
                $(hint).clone()
                .html(index)
                .offset({top: offset.top, left: offset.left})
                .data('target', $(this))
                .appendTo('body');
                index++;
            });
            // bind
            $(document).bind('keydown', fKeydown);
        }

        //only for f
        var fkeyStack = [];
        function fKeydown(e) {
            if ( e.keyCode == keyMap.ESC ) {
                // over find mode
                $(document).unbind('keydown', fKeydown);
                // remove all hint
                $('.js-vim-hint').remove();
                //clear fkeyStack
                fkeyStack = [];
                return;
            } else if( e.keyCode >= keyMap['0']  && e.keyCode <= keyMap['9'] ) {
                // record number
                fkeyStack.push( e.keyCode - keyMap['0'] );
                var currentIndex = parseInt( fkeyStack.join('') );
                $('.js-vim-hint').each(function(){
                    if ( currentIndex == parseInt( $(this).html() ) ) {
                        //trigger click
                        var evt = document.createEvent("MouseEvents");
                        evt.initEvent("click", true, true);
                        $(this).data('target').get(0).dispatchEvent(evt);
                    } else {
                        //filter
                        var regx = new RegExp('^' + currentIndex);
                        if ( !regx.test( $(this).html() ) ) $(this).remove();
                    }
                });
            }
        }

    }
})(jQuery);
