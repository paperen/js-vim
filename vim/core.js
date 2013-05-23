/**
 * js-vim
 * @author paperen<paperen@gmail.com>
 * @link http://iamlze.cn
 */

(function($){
    $.fn.vim = function(options) {
        var defaults = {
            'debug' : true
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
            'r' : 82
        },
        // 命令组合
        commandArr = [
            'y+y',
            'r'
        ],
        // 命令解析
        commandTxt = {
            'yy' : '复制当前标签页链接到剪切板',
            'r' : '重新载入当前页面'
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
    }
})(jQuery);
