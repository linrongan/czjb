<?php
/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆███▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * PHP框架,有了路由就有了一切
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/01/09  增加该路由防御体系(cookie,get,post),若不想防御过滤,增加第三个参数为false
 * v2017/03/09  初版
 */
use Base\Lib\Macaw;
//路由分发
Macaw::get('fuck', function() {
    echo "成功！";
});
Macaw::any('',function (){
    echo "welcome to routes";
});

Macaw::any('Item/(:all)',function ($p){
    $c = new App\C\Admin\ItemC();
    $c->method = $p;
    $c->$p();
});
Macaw::any('Map/(:all)',function ($p){
    $c = new App\C\Admin\MapC();
    $c->method = $p;
    $c->$p();
});
Macaw::any('Event/(:all)',function ($p){
    $c = new App\C\Admin\EventC();
    $c->method = $p;
    $c->$p();
});
Macaw::any('Job/(:all)',function ($p){
    $c = new App\C\Admin\JobC();
    $c->method = $p;
    $c->$p();
});
Macaw::any('Enemy/(:all)',function ($p){
    $c = new App\C\Admin\EnemyC();
    $c->method = $p;
    $c->$p();
});


Macaw::any('Public/(:all)',function ($p){
    $c = new App\C\PublicC();
    $c->method = $p;
    $c->$p();
});


