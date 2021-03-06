/**
 * Created by 路漫漫.
 * Link: ahmerry@qq.com
 * Date: 2017/5/21 14:40
 *
 */

enchant();
window.onload = wl;
var resList = {
        'tileSet': './images/assets/室内.png',
        'player1': './images/movePic/NPC (24).png',
        'tank': './images/blackTank.png',
        'select': './bgm/select.mp3',
        'player1_battle':'./images/battlePic/tank.png',
        'cannonball':'./images/battlePic/cannonball.png',
        '220Animation':'./images/battlePic/220Animation.png',
        'weapon01':'./images/weapon01.png',
        'ammo':'./images/ammo.png',
        'explosion':'./images/explosion.png',
        'music01':'./bgm/map.mp3',
        'music02':'./bgm/shop.mp3',
        'music04':'./bgm/boss.mp3',
        'music05':'./bgm/Walk Down.mp3',
        'music06':'./bgm/town.mp3',
        'music07':'./bgm/enemy.mp3',
        'music08':'./bgm/town2.mp3',
        'music09':'./bgm/battle.mp3',
        'music10':'./bgm/shop2.mp3',
        'music11':'./bgm/appear.mp3',
        'music12':'./bgm/sound_wp01.mp3',
        'music13':'./bgm/explosion.mp3',
        'music14':'./bgm/escape.mp3',
        'music15':'./bgm/collapse.mp3',
        'music16':'./bgm/cut.mp3',
        'music17':'./bgm/break.mp3',
        'NameSetting_mp3':'./Sound/Bgm/NameSetting.mp3',
        'lose':'./bgm/lose.mp3',
        'message':'./bgm/message.wav',
        'buy':'./bgm/buy.mp3',
        'cursor':'./images/system/select.png',
        'triangle_up':'./images/up.png',
        'triangle_down':'./images/down.png',
        'spBg':'./images/label.png',
        'aBtn':'./images/A.png',
        'apad':'./images/apad.png',
        'pad':'./images/pad.png',
        'tankNpc01':'./images/movePic/NPC_1.png',
        'sister':'./images/movePic/NPC_2.png',
        'dade':'./images/movePic/NPC_3.png',
        'npc05':'./images/movePic/NPC_5.png',
        'enemy00':'./images/m010.gif',
        'enemy01':'./images/m011.gif',
        'enemy02':'./images/m012.gif',
        'enemy03':'./images/m013.gif',
        'enemy04':'./images/m014.gif',
        'enemy05':'./images/T10_沙漠之舟.png'
    },
    config = {
        spriteWidth:24,
        spriteHeight:24,
        scale:1.5,
        fps:30,
        mapWidth:14*24,
        mapHeight:16*24,
        keyA:0, //用于防止按键连续触发
        keyB:0, //同上
        keyI:0, //同上
        keyE:0 //同上

    },
    key = {
        'up':87,
        'down':83,
        'left':65,
        'right':68,
        'a':70,
        'b':67,
        'i':73,
        'e':69
    },
    keyD = {
        'up':3,
        'down':0,
        'left':1,
        'right':2
    },
    tileSize = 24,
    enemySign = {
        0:'A',
        1:'B',
        2:'C',
        3:'D',
        4:'E',
        5:'F',
        6:'G',
        7:'H'
    };

function wl() {
    // console.log(Global.mobile,Global.os,Global.width,Global.height);
    // if (Global.mobile) {
    //     window.game = new Game(Global.width,Global.height);
    // } else {
        window.game = new Game(400, 240);
    // }
    //初始设定
    gameInit();
    //预加载资源
    game.preload(resList);
    game.onload = () => {
        game.playerList.push(new Player({
            startingX:4,
            startingY:8,
            playerImage:'tank',
            defaultAttributes:Player.p1Attributes
        }));
        window.p1 = game.playerList[0];
        game.gp = p1.player.gp;    //金钱
        game.exp = p1.player.exp;  //经验值
        game.hp = p1.maxHp = p1.getHp();
        game.item_p1 = p1.player.items;    //角色一物品
        game.encounter = false; //遇敌开关
        //实例化地图
        let map = setHome2Map();
        p1.map = map[0];
        //dade
        let npc01 = createNPC({
            tileX: 6,
            tileY: 8,
            imageName: 'dade',
            direction: 2,
            standing : true,   //是否站立
            face: 0,
            sells:'item',
            action: function () {
                //创建对话场景
                let msgScene = createDialogScene(this.tempScene, this);
                game.pushScene(msgScene[0]);

                //处理对话逻辑
                if (this.dialogID !== null) {
                    displayDialog(this.dialogID, 'dialogID', this, msgScene);
                } else {
                    Deal('dade', 'npcID', this, msgScene,game.npcList.home1.commodity2);
                }
            }
        });
        //sister
        let npc02 = createNPC({
            tileX: 8,
            tileY: 8,
            imageName: 'sister',
            canPush: true,
            direction: 1,
            face: 0,
            action: function () {
                //创建对话场景
                let msgScene = createDialogScene(this.tempScene, this);
                game.pushScene(msgScene[0]);

                //处理对话逻辑
                if (this.dialogID !== null) {
                    displayDialog(this.dialogID, 'dialogID', this, msgScene);
                } else {
                    displayDialog('sister', 'npcID', this, msgScene);
                }
            }
        });
        game.npcList[game.mapCode].npc.push(npc01);
        game.npcList[game.mapCode].npc.push(npc02);
        //播放背景音乐
        game.curBGM = 'NameSetting_mp3';
        new SoundManage('',true);
        let scene = new enchant.Scene();
        let controller = new enchant.ui.Pad();
        controller.x = 20;
        controller.y = 100;
        window.stage = addToStage([map[0],map[1],map[2],p1.player,npc01,npc02,map[3],controller]);
        scene.addChild(stage);
        // scene.addChild();
        game.replaceScene(scene);
        // game.currentScene.addChild();
        // game.rootScene.addChild();
        let button = new enchant.ui.Button("Press me");
        button.addEventListener("touchstart", function(){
            console.log('xxxxxx');
        });
        game.rootScene.addEventListener(button);

        p1.player.on('enterframe',function() {
            if(this.stop) return;
            p1.move();
            let playerPos = {
                x:p1.square().x * config.spriteWidth,
                y:p1.square().y * config.spriteHeight,
                tileX: p1.square().x,
                tileY: p1.square().y,
                face:p1.facingSquare()
            };
            //场景切换检测
            if(game.mapCode === mapCode['home2']) {
                //TODO： 后期需要优化，现在是很野蛮的每帧都检测
                //不断检测脚下是否有事件
                //进出场景
                let enterEvent = gameEv.findTile(playerPos.tileX,playerPos.tileY,game.mapCode);
                if(enterEvent && !enterEvent.hasOwnProperty("lock") && p1.player.x % tileSize === 0 && p1.player.y % tileSize === 0) {
                    enterEvent.action();
                }
            }

            if(game.mapCode === mapCode['home1']) {
                if(game.npcList.home1.npc.length) {
                    let hasObstacle = hasObstacleAround(p1).filter(function(o){
                        return typeof o === 'string';
                    });
                    let obstacleLen = hasObstacle.length;

                    for(let i in game.dirDeny) {
                        if(game.dirDeny.hasOwnProperty(i)) game.dirDeny[i] = false;
                    }
                    while(obstacleLen--) {
                        game.dirDeny[hasObstacle[obstacleLen]] = true;
                    }
                }
            }

            //处理按下A键的情况
            if(game.input.a){
                config.keyA++;
            } else {
                config.keyA = 0;
            }

            if(config.keyA === 1) {//仅当值为1时触发
                new SoundManage('select');
                // let item = new Item();
                // item.show();
                Item.show();
            }

            //处理按下e键的情况
            /*if(game.input.e){
                config.keyE++;
            } else {
                config.keyE = 0;
            }

            if(config.keyE === 1) {//仅当值为1时触发
                new SoundManage('select');
                let item = new Item();
                item.show();

            }*/

            //镜头跟随角色
            setCamera(map[0].width,map[0].height,game.playerList,stage);
        });
    };
    game.start();
}

function gameInit() {
    //地图标识
    game.mapCode = 'home2';
    game.spriteWidth = config.spriteWidth;
    game.spriteHeight = config.spriteHeight;
    game.inTank = true;
    game.playerImg = 'player1';
    game.tankImg = 'tank';

    // game.fps = config.fps;
    game.playerList = [];
    //npc清单
    game.npcList = {
        "home2":{
            "npc":[]

        },
        "home1":{
            "npc":[],
            //商品列表
            "commodity":[
                {name:'装甲包',cost:'100G',description:'补充少量装甲',scene:'battle'},
                {name:'中装甲药',cost:'300G',description:'补充部分量装甲',scene:'battle'},
                {name:'大装甲药',cost:'600G',description:'补充大量装甲',scene:'battle'},
                {name:'传真',cost:'2000G',description:'传送到各地方的装置'}
            ],
            "commodity2":[
                {name:'55炮',cost:'1000G',attack:50,description:'55mm口径主炮，一炮把你秒成渣'},
                {name:'85炮',cost:'1500G',attack:70,description:'85mm口径主炮，一炮把你秒成渣'},
                {name:'105加农炮',cost:'2000G',attack:100,description:'105mm口径主炮，一炮把你秒成渣'},
                {name:'125加农炮',cost:'2500G',attack:120,description:'125mm口径主炮，一炮把你秒成渣'},
                {name:'155加农炮',cost:'5000G',attack:150,description:'155mm口径主炮，一炮把你秒成渣'},
                {name:'165滑膛炮',cost:'7000G',attack:160,description:'165mm口径主炮，一炮把你秒成渣'},
                {name:'185滑膛炮',cost:'10000G',attack:200,description:'185mm口径主炮，一炮把你秒成渣'},
                {name:'205加农炮',cost:'12000G',attack:250,description:'205mm口径主炮，一炮把你秒成渣'},
                {name:'220炮',cost:'15000G',attack:300,description:'220mm口径主炮，一炮把你秒成渣'},
                {name:'225炮',cost:'2000000G',attack:500,description:'225mm口径主炮，一炮把你秒成渣'}
            ]
        }
    };
    //在某方向上停止行动
    game.dirDeny = {
        'up':false,
        'right':false,
        'down':false,
        'left':false
    };
    //地图清单
    game.mapList = {
        "home1":[],
        "home2":[]
    };

    //按键绑定
    game.keybind(key['a'],'a');
    game.keybind(key['b'],'b');
    game.keybind(key['i'],'i');
    game.keybind(key['e'],'e');
    game.keybind(key['up'],'up');
    game.keybind(key['down'],'down');
    game.keybind(key['left'],'left');
    game.keybind(key['right'],'right');

}

//主角屋子2楼
function setHome2Map() {
    let mapArr = [];
    for (let i = 0; i < home2MapData.length; i++) {
        mapArr[i] = new enchant.Map(24,24);
        mapArr[i].image = game.assets['tileSet'];
        mapArr[i].loadData(home2MapData[i]);
    }

    mapArr[0].collisionData = home2PassMap;
    game.mapList.home2 = mapArr;
    return mapArr;
}

//主角屋子1楼
function setHome1Map() {
    let mapArr = [];
    for (let i = 0; i < home1MapData.length; i++) {
        mapArr[i] = new enchant.Map(24,24);
        mapArr[i].image = game.assets['tileSet'];
        mapArr[i].loadData(home1MapData[i]);
    }
    mapArr[0].collisionData = home1PassMap;
    game.mapList.home1 = mapArr;
    return mapArr;
}

/**
 * 添加场景
 * @param obj {Object} 单个场景或一组场景
 */
function addToStage(obj) {
    let stage = new enchant.Group();
    if(!obj.length) {
        stage.addChild(obj);
    } else {
        for(let i = 0; i < obj.length; i++) {
            stage.addChild(obj[i]);
        }
    }
    return stage;
}

function rand(n) {
    return (Math.random() * n) >> 0;
}

function rangeRand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 创建提示路标
 * @type {Sprite}
 */
var SignPostLabel = enchant.Class.create(enchant.Sprite, {
    initialize: function (text, callback) {
        enchant.Sprite.call(this, 300, 35);

        this.spAge = this.age + 30;
        this.callback = callback;
        this.x = (game.width - this.width) / 2;
        this.y = (game.height - this.height) / 2;

        let surface = new enchant.Surface(300, 35);
        this.image = surface;
        //绘制背景图片
        // surface.draw(game.assets["spBg"]);

        let ctx = surface.context;

        //设置文字样式
        ctx.fillStyle = '#fff';
        ctx.shadowColor = "#707070";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.font = '24px 黑体';

        let w = surface.context.measureText(text).width,
            x = (surface.width - w) / 2;

        ctx.fillText(text, x, 26);

        let scene = new enchant.Scene();
        scene.addChild(this);
        game.pushScene(scene);

        return this;
    },
    onenterframe: function () {
        if (this.age > this.spAge) {
            if (this.opacity > 0.3) {
                this.opacity -= 0.03;
                if (this.opacity < 0.8) this.y += 2;
            } else {
                game.popScene();
                this.callback && this.callback.apply(this, arguments);
            }
        }
    }
});

/**
 * 创建对话场景
 * @param scene 场景
 * @param npc npc对象
 */
var dialogDirection = {
    0:3,    //下
    1:2,    //左
    2:1,    //右
    3:0     //上
};
function createDialogScene(scene,npc) {
    //对话时改变npc的朝向，使其面向玩家
    npc.frame = dialogDirection[p1.player.direction] * 4;
    //如果场景存在，则退出场景
    if(scene) game.popScene();
    //新建场景
    let dialogScene = new enchant.Scene();
    //对话文字背景
    let msgBg = new backSprite(game.width,70,0,game.height-70);
    //文本容器
    let label = new textLabel('',10,game.height-60,game.width-50,50);
    //按键闪烁
    let aBtn = new confirmBtn();

    dialogScene.addChild(msgBg);
    dialogScene.addChild(aBtn);
    dialogScene.addChild(label);
    return [dialogScene,label,aBtn];
}
function showDialog(text,scene) {
    if (scene) game.popScene(scene);
    //新建场景
    let dialogScene = new enchant.Scene();
    //对话文字背景
    let msgBg = new backSprite(game.width,70,0,game.height-70);
    //文本容器
    let label = new textLabel(text,10,game.height-60,game.width-50,50);

    dialogScene.addChild(msgBg);
    dialogScene.addChild(label);
    game.pushScene(dialogScene);
    return [dialogScene,label];
}

/**
 * 处理npc对话
 * @param dialogID npcID npc01、npc02、npc03
 * @param type 查找类型 (根据dialogID查找，根据npcID查找)
 * @param npc this
 * @param scene tempScene
 */
function displayDialog(id,type,npc,scene) {
    let dialog = findDialogByID(id,type),  //获取相应的对话
        start = dialog.startIndex,  //对话从哪个索引开始
        i = start,
        tmpText = '',   //每帧显示的临时文本
        keyCount = 0,   //防止连发
        face = npc.direction,
        op;

    scene[0].addEventListener('enterframe',function() {
        let message = 'dialog_'+ i,
            text = dialog[message].text;
        //若文本未显示完
        if(tmpText.length < text.length) {
            //如果按下了A键并且文本长度大于1
            if((game.input.a || game.input.b) && tmpText.length > 1) {
                if(keyCount++ === 1) {
                    //瞬间显示文本
                    tmpText = text;
                    scene[1].text = (dialog.name.length ? (dialog.name + '：<br/>') : '') + tmpText;
                }
            } else {
                keyCount = 0;
            }
            //若没有按下A键，则逐帧显示文本(打字机效果)
            if(this.age % 2 === 0 && !(game.input.a || game.input.b) && tmpText.length < text.length) {
                tmpText = text.substr(0, tmpText.length + 1);
                scene[1].text = (dialog.name.length ? (dialog.name + '：<br/>') : '') + tmpText;
                //文本显示时播放声音
                new SoundManage('message');
            }
        } else {//文本已完全显示，则进入下一段对话
            if(!dialog[message].options) {//无对话选项
                if (dialog[message].nextDialog !== -1) {
                    if (game.input.a) {
                        if (keyCount++ === 1) {
                            tmpText = '';
                            i = dialog[message].nextDialog;
                        }
                    } else {
                        keyCount = 0;
                    }
                } else {//若没有下一段对话了
                    if (game.input.a || game.input.b) {
                        if (keyCount++ === 1) {
                            game.popScene();   //退出场景
                            //根据设置随机选取对话
                            if(dialog[message].random) {
                                dialog.startIndex = dialog[message].random[Math.random()*dialog[message].random.length>>0];
                            } else {
                                i = start;  //重置段落计数器
                            }
                            tmpText = '';   //重置临时文本
                            scene[0] = null;   //重置场景
                            npc.frame = face * 4;   //将npc朝向还原为之前的状态
                        }
                    } else keyCount = 0;
                }
            } else {//有对话选项
                if(!scene.choice) {//首次运行时添加场景
                    op = dialog[message].options;
                    //创建选项
                    scene.choice = new choiceText(op, 20, 20);
                    game.currentScene.addChild(scene.choice);
                } else {//再次运行时监听是否按下确认键
                    if (game.input.a) {
                        if(keyCount++ === 1) {
                            //得到玩家的回答
                            let select = scene.choice.cursor.selected;

                            //满足条件
                            if(op[select].nextDialog !== -1) {
                                if(op[select].condition) {
                                    if(eval(op[select].condition)) {//判断是否满足条件
                                        tmpText = '';
                                        i = op[select].nextDialog;
                                        game.currentScene.removeChild(scene.choice);
                                        scene.choice = null;
                                        op[select].callback && op[select].callback();
                                    } else {
                                        tmpText = '';
                                        i = op[select].failDialog;
                                        game.currentScene.removeChild(scene.choice);
                                        scene.choice = null;
                                    }
                                } else {
                                    tmpText = '';
                                    i = op[select].nextDialog;
                                    game.currentScene.removeChild(scene.choice);
                                    scene.choice = null;
                                }
                            }
                        }
                    } else keyCount = 0;
                }
            }
        }
    });
}
//选项类对话
function Deal(npcID,type,npc,scene,itemList) {
    let dialog = findDialogByID(npcID,type),
        start = dialog.startIndex,
        i = start,
        tmpText = '',
        keyCount = 0,   //防止连发
        face = npc.direction,
        op;

    scene[0].addEventListener('enterframe',function() {
        //显示钱钱
        disPlayGold();
        let message = 'dialog_' + i,
            text = dialog[message].text;

        if(tmpText.length < text.length) {
            if(game.input.a && tmpText.length > 1) {
                if(keyCount++ === 1) {
                    //瞬间显示文本
                    tmpText = text;
                    scene[1].text = tmpText;
                }
            } else {
                keyCount = 0;
            }
            //若没有按下A键，则逐帧显示文本(打字机效果)
            if(this.age % 2 === 0 && !game.input.a && tmpText.length < text.length) {
                tmpText = text.substr(0, tmpText.length + 1);
                scene[1].text = tmpText;
                //文本显示时播放声音
                new SoundManage('message');
            }
        } else {//文本已完全显示

            if (!dialog[message].options) {//无对话选项
                if (scene.callback) {//买
                    dialog["dialog_" + i].callback(itemList, scene, dialog);
                    scene.callback = false;
                    tmpText = '';
                    i = dialog["dialog_" + i].failDialog;
                }
                if (scene.callback2) {//卖
                    dialog["dialog_" + i].callback(itemList, scene, dialog);
                    scene.callback2 = false;
                    tmpText = '';
                    i = dialog["dialog_" + i].failDialog;
                }
                if (dialog[message].nextDialog === -1) {
                    scene[2].visible = true;    //恢复显示闪烁的A按键
                    if (game.input.a) {
                        if (keyCount++ === 1) {
                            game.popScene();
                            i = start;
                            tmpText = '';   //重置临时文本
                            scene[0] = null;   //重置场景
                            npc.frame = face * 4;   //将npc朝向还原为之前的状态
                        }
                    } else keyCount = 0;
                }
            } else {
                if (!scene.choice) {//首次创建选项
                    op = dialog[message].options;
                    //创建选项 内容，内容坐标
                    scene.choice = new choiceText2(op, 25, 5);
                    scene[2].visible = false;//隐藏闪烁的A按键
                    game.currentScene.addChild(scene.choice);
                } else {//再次进入则监听按键
                    let select; //玩家选择
                    if (game.input.b) {//按B键退出
                        if (keyCount++ === 1) {

                            select = op.length - 1;
                            tmpText = '';
                            i = op[select].failDialog;
                            game.currentScene.removeChild(scene.choice);
                            scene.choice = null;
                            setTimeout(() => {
                                game.popScene();
                            }, 1000)
                        }
                    } else if (game.input.a) {
                        if (keyCount++ === 1) {
                            select = scene.choice.cursor.selected;
                            if (op[select].nextDialog !== -1) {
                                tmpText = '';
                                i = op[select].nextDialog;
                                scene.choice.cursor.visible = false;

                                if (select === 0) scene.callback = true;
                                if (select === 1) scene.callback2 = true;

                            }
                        }
                    } else keyCount = 0;
                }
            }
        }
    });
}

//查找对话id
function findDialogByID(id,type) {
    let data = null;
    if(type === 'npcID') {
        dialogue.some(function(o) {
            if(o.npcID === id) {
                data = o;
                return false;
            }
        });
        return data;
    }
    if(type === 'dialogID') {
        dialogue.some(function(o) {
            if(o.dialogID === id) {
                data = o;
                return false;
            }
        });
        return data;
    }
}

//玩家菜单
class Item{
    // constructor(){
    //     this.show();
    // }

    static show(){
        /*
         -----------------------1--------------------------
         |           | ------------------------ |         |
         |----3------| ------------------------ |         |
         |           | ------------------------ |         |
         -----------------6--------------------------------
         */
        let itemH = 90;
        let line1 = new whiteSprite(0,game.height-itemH,game.width,1);
        let line3 = new whiteSprite(0,game.height-65,100,1);
        let line6 = new whiteSprite(0,game.height-1,game.width,1);
        let line2 = new whiteSprite(100,game.height-itemH,1,itemH);
        let line4 = new whiteSprite(game.width-1,game.height-itemH,1,itemH);
        let line5 = new whiteSprite(0,game.height-itemH,1,itemH);
        let line7 = new whiteSprite(game.width-71,game.height-itemH,1,itemH);

        let opLabel = new textLabel('对话',20,game.height-60);
        let opLabel2 = new textLabel('道具',70,game.height-60);
        let opLabel3 = new textLabel('装备',20,game.height-40);
        let opLabel4 = new textLabel('乘降',70,game.height-40);
        let opLabel5 = new textLabel('调查',20,game.height-20);
        let opLabel6 = new textLabel('强度',70,game.height-20);

        //x,y,number,verticalStep,horizonalStep
        let choice = new cursor2(3,game.height-60,6,20,48);
        //玩家信息
        let playerName = new textLabel(p1.player.name,5,game.height-itemH+5);
        let p1Hp = new textLabel('HP '+p1.player.hp,game.width-70,game.height-itemH+1);
        let group = addToStage([line1,line2,line3,line4,line5,line6,line7,opLabel,opLabel2,opLabel3,opLabel4,opLabel5,opLabel6,choice,playerName,p1Hp]);
        let scene = new enchant.Scene();
        scene.addChild(group);
        game.pushScene(scene);
        //显示money
        disPlayGold();
        let keyCount = 0;
        scene.on('enterframe',()=>{
            if(choice.visible && game.input.a) {
                if( (++keyCount) === 1) {
                    new SoundManage('select');
                    switch (choice.selected) {
                        case 0://对话
                            // let a = new InputA();
                            this.findEvent();
                            break;
                        case 1://道具
                            break;
                        case 2://装备
                            break;
                        case 3://乘降
                            if (!game.tank) {
                                game.tank = new animationSprite(game.tankImg,p1.player.x,p1.player.y,24,24);
                            }
                            if (game.inTank) {
                                game.inTank = false;
                                p1.player.image = game.assets[game.playerImg];
                                window.stage.insertBefore(game.tank,p1.player);
                                game.tank.x = p1.player.x;
                                game.tank.y = p1.player.y;
                            } else {
                                console.log(game.inTank);
                                game.inTank = true;
                                p1.player.image = game.assets[game.tankImg];
                                window.stage.removeChild(game.tank);
                            }
                            game.popScene();
                            break;
                        case 4://调查
                            break;
                        case 5://强度
                            break;
                    }
                }else keyCount=0;
            }else if (game.input.b) {
                new SoundManage('select');
                game.popScene();

            }
        })
    }

    static findEvent(){
        let facingSquare = p1.facingSquare();
        if(facingSquare) {
            //找玩家附近是否有事件
            let evTile = gameEv.findTile(facingSquare.x,facingSquare.y,game.mapCode);
            console.log(evTile);
            evTile && evTile.action();

            let npc = game.npcList[game.mapCode].npc;

            npc.forEach(function(o) {
                if(o.tileX === facingSquare.x &&
                    o.tileY === facingSquare.y &&
                    o.x % tileSize === 0 && o.y % tileSize === 0 &&
                    p1.player.isMoving === false) {
                    o.action();
                } else if(p1.map.hitTest(facingSquare.x * tileSize,facingSquare.y * tileSize) &&
                    o.facingSquare().x === facingSquare.x &&
                    o.facingSquare().y === facingSquare.y &&
                    o.x % tileSize === 0 && o.y % tileSize === 0 &&
                    p1.player.isMoving === false &&
                    (p1.player.x === o.x || p1.player.y === o.y)) {
                    //隔着障碍物也能对话
                    o.action();
                }
            });
        }
    }
}

class ItemInput{


}