/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆███▄▄▃▂
 *  █████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 游戏客户端按键响应库
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/02/10 初版
 */
(()=>{
    let pressedKeys = {};

    function setKey(event, status) {
        let code = event.keyCode;
        let key;

        switch(code) {
            case 13:
                key = 'ENTER';
                break;
            case 32:
                key = 'SPACE';
                break;
            case 37:
                key = 'LEFT';
                break;
            case 38:
                key = 'UP';
                break;
            case 39:
                key = 'RIGHT';
                break;
            case 40:
                key = 'DOWN';
                break;
            default:
                // Convert ASCII codes to letters
                key = String.fromCharCode(code);
                break;
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();

//监听鼠标点击的canvas的坐标
function getMousePos(canvas,func) {
    canvas.addEventListener('click', function(e) {
        let rect = canvas.getBoundingClientRect();
        let clickPoint = {x: Math.ceil((e.clientX - rect.left)/tileSize)-1,y:Math.ceil((e.clientY - rect.top)/tileSize)-1};
        func(clickPoint);
    });
}
function getCanavsClickPoint(point) {
    console.log(point);
}
