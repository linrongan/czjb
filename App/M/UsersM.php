<?php
namespace App\M;
/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆███▄▄▃▂
 *  █████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 游戏用户模型
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/04/11     完善逻辑，增加事务处理
 * v2017/03/18     初版
 */
class UsersM extends AppModel {
    protected $tables = null;
    protected $uid = null;

    public function userInfo($id,$field='*') {
        return $this->find($id,$field);

    }

    public function logout() {

    }

    public function login() {
        if ( !empty($_POST['name']) && !empty($_POST['password']) ) {
            $this->name = $_POST['name'];
            $sql = "SELECT id,salt,password FROM $this->table WHERE `name` = ?";
            $result = $this->executeSql($sql, [$_POST['name']]);
            if ($result) {
                if ($this->checkPwd()) {
                    return $this->loginFollow($result['id']);
                }else{
                    return ['code' => -1, 'msg' => '密码错误'];
                }
            } else {
                return ['code' => -1, 'msg' => '无效数据'];
            }
        }
    }

    public function register() {
        $this->name = $_POST['name'];
        $this->email = $_POST['email'];
        $sql = "SELECT id FROM $this->table WHERE `name` = ? OR email = ?";

        if ($this->executeSql($sql, [$this->name,$this->email])) return ['code' => 1, 'msg' => '数据已存在'];
        $this->salt = RandStr();
        $this->jobId = $_POST['jobId'];
        $this->password = md5($_POST['password'] . $this->salt);
        $this->name = $_POST['name'];
        $this->email = $_POST['email'];
        $this->beginTransaction();
        if ($this->uid = $this->add()) {
            if ($this->registerFollow($this->uid)){
                $result = $this->loginFollow($this->uid);
                if ($result['code']){
                    $this->commit();
                }else{
                    $this->rollback();
                }
                return $result;

            }else{
                $this->rollback();
                return ['code' => -1, 'msg' => 'mysql error'];
            }

        }else{
            $this->rollback();
            return ['code' => -1, 'msg' => 'mysql error'];
        }
    }

    private function loginFollow($id){
        $result = $this->find($id);
        if ($result) {
            if( in_array($result['id'],[1,2,3,4,5,6,7,8,9]) ) {
                Session('admin',$result['id']);
            }
            unset($result['password'],$result['salt']);
            return ['code' => 1, 'msg' => '', 'data' => $result];
        } else {
            return ['code' => -1, 'msg' => 'mysql error'];
        }
    }

    private function registerFollow($id){
        $jobs = new JobsM();
        $field = '`name`,movePic,fightPic';
        $result = $jobs->find($_POST['jobId'],$field);
        if ($result){
            $class = $result;
        }else{
            return $result;
        }

        $config = new ConfigM();
        $result = $config->find(1);
        if ($result){
            list($mapId, $mapX, $mapY, $mapDir) = explode(',', $result['defaultLocation']);
        }else{
            return $result;
        }
        $sql = "UPDATE $this->table SET movePic=?, fightPic=?, mapId=?, mapX=?, mapY=?, mapDir=? WHERE id=?";
        $result = $this->executeSql($sql,[$class['movePic'], $class['fightPic'],$mapId, $mapX, $mapY, $mapDir ,$id]);
        return $result;
    }

    private function checkPwd() {
        return md5($_POST['password'] . $this->salt) === $this->password;
    }


    public function setVar($key, $val) {
        $this->vars[$key] = $val;
    }

    public function update($sql,$data) {
        $sql = "UPDATE $this->table SET ".$sql;
        return $this->executeSql($sql,$data);
    }

    public function checkExp($gain_exp) {

        $this->exp += $gain_exp;
        $level = $this->level + 1;
        $exp_next_level = str_replace('X', $level, $this->exp_curve);

        $gain_hp = 0;
        $gain_mp = 0;
        $gain_attack = 0;
        $gain_defense = 0;
        $gain_mind = 0;
        $gain_agility = 0;

        while ($this->exp >= $exp_next_level) {

            eval('$gain_hp += ceil((' . str_replace('X', $level, $this->hp_curve) . ') - (' . str_replace('X', ($level - 1), $this->hp_curve) . '));');

            eval('$gain_mp += ceil((' . str_replace('X', $level, $this->mp_curve) . ') - (' . str_replace('X', ($level - 1), $this->mp_curve) . '));');

            eval('$gain_attack += ceil((' . str_replace('X', $level, $this->attack_curve) . ') - (' . str_replace('X', ($level - 1), $this->attack_curve) . '));');

            eval('$gain_defense += ceil((' . str_replace('X', $level, $this->defense_curve) . ') - (' . str_replace('X', ($level - 1), $this->defense_curve) . '));');

            eval('$gain_mind += ceil((' . str_replace('X', $level, $this->mind_curve) . ') - (' . str_replace('X', ($level - 1), $this->mind_curve) . '));');

            eval('$gain_agility += ceil((' . str_replace('X', $level, $this->agility_curve) . ') - (' . str_replace('X', ($level - 1), $this->agility_curve) . '));');

            $level++;
            eval('$exp_next_level = ceil(' . str_replace('X', $level, $this->exp_curve) . ');');
        }

        $gain_level = $level - $this->level - 1;

        if ($gain_level > 0) {
            $this->hp += $gain_hp;
            $this->mp += $gain_mp;
            $this->attack += $gain_attack;
            $this->defend += $gain_defense;
            $this->mind += $gain_mind;
            $this->speed += $gain_hp;
            $this->level += $gain_level;
            $this->exp += $gain_exp;

        } else {
            $this->exp += $gain_exp;
        }
        $this->save();
    }

}