<?php 
namespace app\admin\controller;

use think\Controller;
use think\facade\Log;
use think\Db;
use app\admin\controller\Publics;
use think\Request;

class Login extends Controller{
    
    private $publics;#登录信息
    
    public function initialize()
    {
        $this->publics = new Publics();
        $tokeninfo = $this->publics->checkToken();
        #登录状态失效请重新登录
        if($tokeninfo['code'] == 100){
            return json($tokeninfo);
        }
    }
    
    /**
     * 后台登录
     * @return unknown
     */
    public function admin_login()
    {
        try {
            $username = $this->request->param("username");
            $password = $this->request->param("password");
            $info = Db::name("user")->where(array('user_login'=>$username))->find();
            if($info){
                //已存在，验证密码是否正确
                $pass = MD5($password.(MD5($info['salt'])));
                if($pass == $info['user_pass']){
                    //密码正确
                    #$publics = new Publics();
                    $token = $this->publics->make_token($info['id'],$password,$username);
                    $last_ip = request()->ip();
                    $user_logintime = time();
                    $data = array(
                        'access_token'=>$token,
                        'expires_time'=>config('jwt.exp'),
                        'user_logintime'=>$user_logintime,
                        'last_ip'=>$last_ip
                    );
                    
                    #header("access_token:$token");
                    #header("Set-Cookie:access_token=$token");
                    $this->request->header(['access_token'=>$token]);
                    Db::name("user")->where(array('id'=>$info['id']))->update($data);
                    $infocontent = Db::name("user")->where(array('id'=>$info['id']))->
                    field("id,user_mobile,user_type,user_login,user_nickname,user_email,user_logintime,last_ip,avatar,signature,user_status,user_sign,create_time,access_token,expires_time")
                    ->find();
                    
                    return json(array('code'=>200,'msg'=>'登录成功','data'=>$infocontent));
                }else{
                    //密码错误
                    return json(array('code'=>0,'msg'=>'密码错误,请重试'));
                }
            }else{
                //不存在，登录失败
                return json(array('code'=>0,'msg'=>'登录失败，请重试'));
            }
        } catch (\Exception $e) {
            Log::record("后台登录接口，(admin/Login/admin_login),异常".$e->getMessage(),"error");
        }
    }
    
    /**
     * 退出登录
     * @return \think\response\Json
     */
    public function logout_info()
    {
        try {
            $u_id = $this->request->param('u_id');
            
            $data['expires_time'] = time()-10;
            $info = Db::name("user")->where(array('id'=>$u_id))->update($data);
            if($info){
                return json(array('code'=>200,'msg'=>'退出登录','data'=>null));
            }else{
                return json(array('code'=>0,'msg'=>'退出失败','data'=>null));
            }
        }catch (\Exception $e){
            Log::record("后台登录退出，（admin/Login/logout_info),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 通过token获取用户数据
     * @return \think\response\Json
     */
    public function token_login()
    {
        try {
            $token = $this->request->param('token');
            $info = Db::name("user")->where(array('access_token'=>$token))->where("expires_time",'>',time())->find();
            if($info){
                return json(['code'=>200,'msg'=>'用户数据','data'=>$info]);
            }else{
                return json(['code'=>0,'msg'=>'请县登录','data'=>null]);
            }
        }catch (\Exception $e){
            Log::record("通过token获取用户信息，（admin/Login/token_login),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 后台菜单列表
     * @return \think\response\Json
     */
    public function menu_list()
    {
        try {
            $u_id = $this->request->param('u_id');
            
            if(empty($u_id)){
                return json(array('code'=>0,'msg'=>'请先登录'));
            }
            $userinfo = Db::name("user")->where(array('id'=>$u_id))->find();
            if($userinfo['user_sign'] == 1){
                #超级管理员，获取菜单列表
                $info = $this->getadmin_auth();
            }else{
                #其他管理员，获取菜单列表
                $info = $this->get_auth($userinfo['user_sign']);#参数角色ID
            }
            if($info){
                return json(array('code'=>200,'msg'=>'菜单列表','data'=>$info));
            }else{
                return json(array('code'=>0,'msg'=>'菜单列表，没有数据！ ','data'=>$info));
            }
        }catch (\Exception $e){
            Log::record("后台菜单列表，（admin/Login/menu_list),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 分配菜单
     * @return \think\response\Json
     */
    public function menuinfo_rbct()
    {
        try{
            $id = $this->request->param('r_id');#角色ID
            $info = $this->getadmin_auth();
            $selecroleinfo = Db::name("role_menu")->where(array('role_id'=>$id))->select();
            $seleectmenuids = array();
            foreach ($selecroleinfo as $k=>$v){
                array_push($seleectmenuids, $v['menu_id']);
            }
            $uninfo = array('createtime','icon','jump','p_id','sort','starts','types','name');
            foreach ($info as $k=>$v){
                $info[$k]['field'] = $v['name'];
                $info[$k]['checked'] = in_array($v['id'], $seleectmenuids);
                $twolist = $v['list'];
                foreach ($twolist as $ks=>$vs){
                    $twolist[$ks]['field'] = $vs['name'];
                    $twolist[$ks]['checked'] = in_array($vs['id'], $seleectmenuids);
                    $threelist = $vs['list'];
                    foreach ($threelist as $kss=>$vss){
                        $threelist[$kss]['field'] = $vss['name'];
                        $threelist[$kss]['checked'] = in_array($vss['id'], $seleectmenuids);
                        foreach ($uninfo as $sk=>$sv){
                            unset($threelist[$kss][$sv]);
                        }
                        unset($threelist[$kss]['list']);
                    }
                    $twolist[$ks]['children'] = $threelist;
                    foreach ($uninfo as $sk=>$sv){
                        unset($twolist[$ks][$sv]);
                    }
                    unset($twolist[$ks]['list']);
                }
                $info[$k]['children'] = $twolist;
                foreach ($uninfo as $sk=>$sv){
                    unset($info[$k][$sv]);
                }
                unset($info[$k]['list']);
            }
            #dump($info);
            if($info){
                return json(array('code'=>200,'msg'=>'分配权限列表','data'=>$info));
            }else{
                return json(array('code'=>0,'msgg'=>'有没菜单数据，请先添加菜单'));
            }
        }catch (\Exception $e){
            Log::record("分配权限(admin/Login/menuinfo_rbct),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 保存分配权限数据
     * @return \think\response\Json
     */
    public function menuinfo_rbctpost()
    {
        try {
            $role_id = $this->request->param('r_id');
            Db::name("role_menu")->where(array('role_id'=>$role_id))->delete();
            $ids = $this->request->param('ids');
            $idinfo = explode(',', $ids);
            foreach ($idinfo as $k=>$v){
                $data['menu_id'] = $v;
                $data['role_id'] = $role_id;
                $data['create_time'] = time();
                $info = Db::name("role_menu")->insert($data);
            }
            if($info){
                return json(array('code'=>200,'msg'=>'保存成功'));
            }else{
                return json(array('code'=>0,'msg'=>'保存失败'));
            }
        }catch (\Exception $e){
            Log::record("保存分配权限数据（admin/Login/menuinfo_rbct),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 获取超级管理员菜单
     * @return array|unknown
     */
    public function getadmin_auth()
    {
        try {
            $action_list = Db::name("menuinfo")->where(array("starts"=>1))->select();
            if($action_list){
                #$action = $action_list->toArray();
                $menuinfo = $this->getmenu_url($action_list);
            }
            return $menuinfo?$menuinfo:[];
        }catch (\Exception $e){
            Log::record("获取超级管理员菜单列表（admin/Login/getadmin_auth),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 获取普通管理员权限
     * @param unknown $r_id
     * @return array|\app\admin\controller\unknown[]
     */
    public function get_auth($r_id)
    {
        try {
            $prefix = config("database.prefix");//数据库表前缀
            
            $action = Db::name("role_menu")->alias("rm")->
            join($prefix."menuinfo m","m.id=rm.menu_id")->where(array('rm.role_id'=>$r_id,'m.starts'=>1))
            ->field("m.*")->select();
            $menuurl = array();
            if($action){
                $menuurl = $this->getmenu_url($action);
            }
            return $menuurl?$menuurl:[];
        }catch (\Exception $e){
            Log::record("获取普通管理员权限，(admin/login/get_auth),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 获取菜单树和URL列表
     * @param unknown $action
     * @return array[]|unknown[]|unknown[][]
     */
    private function getmenu_url($action)
    {
        try {
            $menu = array();// 主菜单数组
            $sort = array();// 排序数组
            $url = array();// 权限URL数组
            foreach ($action as $k => $v){
                if($v['types'] == 1 && $v['p_id'] == 0){
                    $sort[] = $v['sort'];
                    $menu[] = $v;
                }
                $url[] = $v['jump'];
            }
            #menu跟随sort升序
            array_multisort($sort,SORT_ASC,$menu);
            foreach ($menu as $ks => $vs){
                $menu[$ks]['title'] = $vs['title'];
                $menu[$ks]['name'] = $vs['name'];
                $menu[$ks]['icon'] = $vs['icon'];
                $menu[$ks]['list'] = $this->get_tree($action,$vs['id']);
            }
            return $menu;
        }catch (\Exception $e){
            Log::record("获取菜单树和URL列表（admin/Login/getmenu_url),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 递归查询主菜单的子菜单
     * @param unknown $action
     * @param unknown $p_id
     * @return unknown[]
     */
    private function get_tree($action,$p_id)
    {
        try {
            $tree = array();//子菜单树
            $sort = array();//
            foreach ($action as $k => $v){
                if($v['id'] != $v['p_id'] && $v['p_id'] == $p_id && $v['types'] == 1){
                    $v['list'] = $this->get_tree($action, $v['id']);
                    $v['name'] = $v['name'];
                    $v['title'] = $v['title'];
                    $v['jump'] = $v['jump'];
                    
                    $sort[] = $v['sort'];
                    $tree[] = $v;
                }
            }
            #排序
            array_multisort($sort,SORT_ASC,$tree);
            return $tree;
        }catch (\Exception $e){
            Log::record("递归查询主菜单的子菜单，（admin/Login/get_tree),错误：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 添加后台管理员账号
     * @return unknown
     */
    public function create_accountnumber()
    {
        try {
            $data['user_login'] = $this->request->param("username");
            #$data['user_login'] = 'admin';
            $password = $this->request->param("password");
            #$password = 'admin123';
            #user_pass 
            $data['salt'] = mt_rand(000000,999999);
            $data['user_pass'] = MD5($password.(MD5($data['salt'])));
            $data['user_type'] = 1;
            $infos = Db::name("user")->insert($data);
            if($infos){
                $infocontent = Db::name("user")->where(array('id'=>$infos))->
                field("id,user_mobile,user_type,user_login,user_nickname,user_email,user_logintime,last_ip,avatar,signature,user_status,user_sign,create_time,access_token,expires_time")->find();
                return json(array('code'=>1,'msg'=>'注册成功','info'=>$infocontent));
            }else{
                return json(array('code'=>0,'msg'=>'注册失败'));
            }
        }catch (\Exception $e){
            Log::record("注册后台账号，(admin/Login/create_accountnumber),异常：".$e->getMessage(),'error');
        }
    }
    
    
    
}