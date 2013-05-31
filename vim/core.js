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
            'a' : 65,
            'b' : 66,
            'c' : 67,
            'd' : 68,
            'e' : 69,
            'f' : 70,
            'g' : 71,
            'h' : 72,
            'i' : 73,
            'j' : 74,
            'k' : 75,
            'l' : 76,
            'm' : 77,
            'n' : 78,
            'o' : 79,
            'p' : 80,
            'q' : 81,
            'r' : 82,
            's' : 83,
            't' : 84,
            'u' : 85,
            'v' : 86,
            'w' : 87,
            'x' : 88,
            'y' : 89,
            'z' : 90,
            'ESC' : 27,
            '0' : 48,
            '1' : 49,
            '2' : 50,
            '3' : 51,
            '4' : 52,
            '5' : 53,
            '6' : 54,
            '7' : 55,
            '8' : 56,
            '9' : 57
        },
        // 命令组合
        commandArr = [
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
        commandStack = [],
        // baseurl
        root,
        clip;

        /**
         * init
         */
        function init() {
            //获取该js所在路径
            $('script').each(function(){
                var src = $(this).attr('src');
                if ( typeof( src ) != 'undefined' ) {
                    var pos = src.indexOf('core.js');
                    if ( pos != -1 ) {
                        root = src.substr(0,pos);
                        return;
                    }
                }
            });

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
         * create hash
         * @param int len
         */
        function createHash(len) {
            if ( typeof( len ) == 'undefined' ) len = 2;
            var hash = [];
            for(k in keyMap) if ( keyMap[k] >= 48 && keyMap[k] <= 90 ) hash.push(k);
            var str = '',
            hashLen = hash.length;
            for( var i=0;i<len;i++ ) {
                str += hash[Math.floor( ( Math.random()*hashLen ) )];
            }
            return str;
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
            $('a').each(function(){
                var index = createHash();
                var offset = $(this).offset();
                $(hint).clone()
                .html(index)
                .offset({top: offset.top, left: offset.left})
                .data('target', $(this))
                .appendTo('body');
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
            } else if ( e.keyCode >= 48 && e.keyCode <= 90 ) {
                // record number
                fkeyStack.push( code2Key( e.keyCode ) );
                var currentIndex = fkeyStack.join('');
                $('.js-vim-hint').each(function(){
                    if ( currentIndex == $(this).html() ) {
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
