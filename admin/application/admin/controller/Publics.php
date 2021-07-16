<?php 
namespace app\admin\controller;

use think\App;
use think\Controller;
use think\Db;
use think\Request;
use think\Response;
use clt\Encryption;
use think\facade\Log;
use \Firebase\JWT\JWT;

class Publics extends Controller{
    
    protected $user_id = null;
    protected $encryption = null;
    protected $noNeedLogin = ['admin_login'];#不需要验证的接口
    protected $token;
    
    public function initialize()
    {
        #dump($this->request->param());
        #dump($this->request->action());
        #跨域处理
        #header('Content-Type: text/html;charset=utf-8');
        header('Access-Control-Allow-Origin:*'); // *代表允许任何网址请求
        #header('Access-Control-Allow-Methods:POST,GET,OPTIONS,DELETE'); // 允许请求的类型
        #$this->encryption = new Encryption();
        $this->token = $this->request->header('access_token')?$this->request->header('access_token'):$this->request->param('access_token');#从header中获取token
        
        Log::record("结果:".$_SERVER['REQUEST_METHOD']."---token内容：".$this->token,'error');
        if($this->noNeedLogin){
            #检查不需要token验证的接口
            $controlleraction = $this->request->action();
            if(in_array($controlleraction,$this->noNeedLogin)){
                return false;
            }
        }
        if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
            
            header("Status Code: 200 OK");
            return;
        }
        
        $this->checkToken();
    }
    
    /**
     * 创建token
     * @return unknown
     */
    public function make_token($uid,$password,$username){
        $key = config('jwt.key');
        $jwtdata = [
            'iss'=>'',// 签发者
            'aud'=>'',//面向用户
            'lat'=>config('jwt.lat'),//签发时间
            'nbf'=>config('jwt.nbf'),//生效时间
            'exp'=>config('jwt.exp'),//token过期时间
            'uid'=>$uid,//记录用户id的信息
            'password'=>$password,
            'mobile'=>$username
        ];
        $jwtToken = JWT::encode($jwtdata,$key,'HS256');
        #$str = MD5(uniqid(MD5(microtime(true),true)));#创建唯一token
        #$str = sha1($str);
        
        Log::record("生成token吗？".$jwtToken,'error');
        return $jwtToken;
    }
    
    /**
     * 验证token
     * @param unknown $token
     * @return number|number[]|string[]
     */
    public function checkToken(){
        $token = $this->token;
        $key = config('jwt.key');
        $status=array("code"=>100);
        try {
            JWT::$leeway = 60;//当前时间减去60，把时间留点余地
            $decoded = JWT::decode($token, $key, array('HS256')); //HS256方式，这里要和签发的时候对应
            $arr = (array)$decoded;
            #dump($decoded);
            #dump($arr);
            $res['code']=200;
            $res['data']=$arr;
            return $res;
            
        } catch(\Firebase\JWT\SignatureInvalidException $e) { //签名不正确
            $status['msg']="签名不正确";
            return $status;
        }catch(\Firebase\JWT\BeforeValidException $e) { // 签名在某个时间点之后才能用
            $status['msg']="token失效";
            return $status;
        }catch(\Firebase\JWT\ExpiredException $e) { // token过期
            $status['msg']="token失效";
            return $status;
        }catch(\Exception $e) { //其他错误
            $status['msg']="未知错误";
            return $status;
        }
    }
    
    /**
     * 验证token
     * @param unknown $token
     */
    public function check_token($token)
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
                    Response::create(array('code'=>100,'msg'=>'请先登录','data'=>null),'json')->send();
                    exit;
                }
            }else{
                #dump($token);
                #token不存在，请先登录
                Response::create(array('code'=>100,'msg'=>'请先登录','data'=>null),'json')->send();
                exit;
            }
        }catch (\Exception $e){
            Log::record("检查token（common/check_token）,错误：".$e->getMessage(),'error');
        }
    }
}