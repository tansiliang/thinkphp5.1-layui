<?php 
namespace app\behavior;

use think\App;
use think\Controller;
use think\Db;
use think\Request;
use clt\Encryption;
use think\Log;

class Publics extends Controller{
    
    protected $user_id = null;
    protected $encryption = null;
    protected $noNeedLogin = ['admin_login'];#不需要验证的接口
    
    public function initialize()
    {
        dump($this->request->header());
        dump($this->request->action());
        #跨域处理
        header('Content-Type: text/html;charset=utf-8');
        header('Access-Control-Allow-Origin:*'); // *代表允许任何网址请求
        header('Access-Control-Allow-Methods:POST,GET,OPTIONS,DELETE'); // 允许请求的类型
        #$this->encryption = new Encryption();
        $token = $this->request->header('token');#从header中获取token
        if($this->noNeedLogin){
            #检查不需要token验证的接口
            $controlleraction = $this->request->action();
            if(in_array($controlleraction,$this->noNeedLogin)){
                return false;
            }
        }
        $this->run($token);
    }
    
    public function run($token)
    {
        try {
            if($token){
                #token存在
                $res = Db::name("user")->where(['token'=>$token])->where("expires_time",'>',time())->
                field("token,expires_time")->find();
                if($res){
                    $this->user_id = $res['id'];
                    if($res['expires_time']-time() <= 10*60){
                        #到期十分钟更新token到期时间
                        $expires_info = $res['expires_time']+7200;
                        Db::name("user")->where(array('id'=>$res['id']))->update(array("expires_time"=>$expires_info));
                    }
                }else{
                    #token已过期，请重新登录
                    return json(array('code'=>0,'msg'=>'请先登录','data'=>null));
                }
            }else{
                #token不存在，请先登录
                return json(array('code'=>0,'msg'=>'请先登录','data'=>null));
            }
        }catch (\Exception $e){
            Log::record("检查token（common/check_token）,错误：".$e->getMessage(),'error');
        }
    }
}