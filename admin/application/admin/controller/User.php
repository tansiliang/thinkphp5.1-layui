<?php 
namespace app\admin\controller;

use think\Controller;
use think\facade\Log;
use think\Db;
use think\Request;
use app\admin\controller\Publics;

class User extends Controller{
    
    private $publics;
    
    public function initialize(){
        
        $this->publics = new Publics();
        #判断token
        $inchaecktoken = $this->publics->checkToken();
        if($inchaecktoken['code'] == 100){
            return json($inchaecktoken);
        }
    }
    
    /**
     * 后台管理员列表
     * @return unknown
     */
    public function administrators_list(){
        try {
            #需要删除字段
            #$unField  = ['user_pass','salt','create_time','update_time','openid','unionId'];
            $page = $this->request->param('page')?$this->request->param('page'):1;//当前页数
            $limit = $this->request->param('limit')?$this->request->param('limit'):10;//每页显示多少条数据
            
            $where['user_type'] = 1;
            $list = Db::name("user")->where($where)
            ->field("id,user_login,user_email,user_logintime,user_mobile,user_status,last_ip,user_nickname")
            ->page($page,$limit)->select();
            $total = Db::name("user")->where($where)->count();
            foreach ($list as $k=>$v){
                $list[$k]['user_logintime'] = date('Y-m-d H:i:s',$v['user_logintime']);
                if($v['user_status'] == 1){
                    $list[$k]['user_status'] = '正常';
                }else if($v['user_status'] == 0){
                    $list[$k]['user_status'] = '禁用';
                }
            }
            if($list){
                return json(array('code'=>200,'msg'=>"后台管理员列表",'total'=>$total,'data'=>$list));
            }else{
                return json(array('code'=>0,'msg'=>'获取失败或者没数据'));
            }
        }catch (\Exception $e){
            Log::record("后台管理员列表（admin/user/administrators_list）,异常:".$e->getMessage(),"error");
        }
    }
    
    /**
     * 添加管理员
     * @return unknown
     */
    public function administrators_add()
    {
        try {
            $data = $this->request->param();
            #unset($data['access_token']);
            $data['user_type'] = 1;
            $password = $data["user_pass"];
            $data['salt'] = mt_rand(000000,999999);
            $data['user_pass'] = MD5($password.(MD5($data['salt'])));
            $data['user_logintime'] = time();
            $data['last_ip'] = request()->ip();
            $data['create_time'] = time();
            #dump($data);
            $usercount = Db::name("user")->where(array('user_login'=>$data['user_login']))->count();
            if($usercount > 0){
                return json(array('code'=>0,'msg'=>'该账号已存在'));
            }
            $user_id = Db::name("user")->insertGetId($data);#添加管理员
            $ru_data['user_id'] = $user_id;
            $ru_data['role_id'] = $data['user_sign'];
            $ru_data['create_time'] = time();
            $info = Db::name("role_user")->insert($ru_data);#管理员角色关系
            
            if($info){
                return json(array('code'=>200,'msg'=>'添加成功'));
            }else{
                return json(array('code'=>0,'msg'=>'添加失败'));
            }
        }catch (\Exception $e){
            Log::record("添加后台管理员（admin/user/administrators_add），异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 编辑管理员数据-当前管理员数据
     * @return \think\response\Json
     */
    public function administrators_edit()
    {
        try{
            $id = $this->request->param('id');
            $info = Db::name("user")->where(array('id'=>$id))->find();
            if($info){
                unset($info['password']);
                unset($info['salt']);
                return json(array('code'=>200,'msg'=>'管理员数据','data'=>$info));
            }else{
                return json(array('code'=>0,'msg'=>'没有数据，请联系管理员'));
            }
        }catch (\Exception $e){
            Log::record("编辑管理员信息(admin/User/administrators_edit),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 修改管理员信息和密码
     * @return unknown
     */
    public function administrators_editpost()
    {
        try {
            $data = $this->request->param();
            $id = $data["id"];
            unset($data['id']);
            unset($data['access_token']);
            unset($data['pass']);
            $password = $data["user_pass"];
            if(!empty($password)){
                $data['salt'] = mt_rand(000000,999999);
                $data['user_pass'] = MD5($password.(MD5($data['salt'])));
            }else{
                unset($data['user_pass']);
            }
            $data['user_logintime'] = time();
            #$usercount = Db::name("user")->where(array('id'=>$id))->count();
            #if($usercount > 0){
            #    return json(array('code'=>0,'msg'=>'该账号已存在'));
            #}
            #dump($data);
            Db::name("user")->where(array("id"=>$id))->update($data);#添加管理员
            $ru_data['user_id'] = $id;
            $ru_data['role_id'] = $data["user_sign"];
            $ru_data['create_time'] = time();
            $info = Db::name("role_user")->where(array('user_id'=>$id))->update($ru_data);#管理员角色关系
            
            if($info){
                return json(array('code'=>200,'msg'=>'保存成功'));
            }else{
                return json(array('code'=>0,'msg'=>'保存失败'));
            }
        }catch (\Exception $e){
            Log::record("编辑后台管理员（admin/user/administrators_editpost）,异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 删除管理员
     * @return unknown
     */
    public function administrators_delete()
    {
        try {
            $id = $this->request->param("id");
            $info = Db::name("user")->where(array('id'=>$id))->update(array('user_status'=>-1));
            if($info){
                return json(array('code'=>200,'msg'=>'删除成功'));
            }else{
                return json(array('code'=>0,'msg'=>'删除失败'));
            }
        }catch (\Exception $e){
            Log::record("删除后台管理员（admin/user/administrators_delete),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 角色列表
     */
    public function role_list()
    {
        try {
            $page = $this->request->param('page')?$this->request->param('page'):1;//当前页数
            $limit = $this->request->param('limit')?$this->request->param('limit'):10;//每页显示多少条数据
            $where['role_status'] = 1;
            $info =Db::name("role")->where($where)->page($page,$limit)->select();
            $total = Db::name("role")->where($where)->count();
            foreach ($info as $k=>$v){
                $info[$k]['create_time'] = date("Y-m-d H:i:s",$v['create_time']);
            }
            if($info){
                return json(array('code'=>200,'msg'=>'获取角色列表','total'=>$total,'data'=>$info));
            }else{
                return json(array('code'=>0,'msg'=>"获取失败，没有数据或故障"));
            }
        }catch (\Exception $e){
            Log::record("角色列表（admin/user/role_list），异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 添加角色方法
     * @return \think\response\Json
     */
    public function role_addpost()
    {
        try {
            $data = $this->request->param();
            $data['create_time'] = time();
            $data['update_time'] = time();
            unset($data['access_token']);
            $info = Db::name("role")->insert($data);
            if($info){
                return json(array('code'=>200,'msg'=>'添加成功'));
            }else{
                return json(array('code'=>0,'msg'=>'添加失败'));
            }
        }catch (\Exception $e){
            Log::record("添加角色（admin/user/role_addpost),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 修改角色页面数据
     * @return \think\response\Json
     */
    public function role_edit()
    {
        try {
            
            $id = $this->request->param('id');
            $info = Db::name("role")->where(array('role_id'=>$id))->find();
            if($info){
                return json(array('code'=>200,'msg'=>'角色内容','data'=>$info));
            }else{
                return json(array('code'=>0,'msg'=>'没有角色内容'));
            }
        }catch (\Exception $e){
            Log::record("编辑角色页面(admin/user/role_edit),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 修改角色方法
     * @return \think\response\Json
     */
    public function role_editpost()
    {
        try {
            $data = $this->request->param();
            $id = $data["id"];
            unset($data['id']);
            unset($data['access_token']);
            $data['update_time'] = time();
            $info = Db::name("role")->where(array('role_id'=>$id))->update($data);
            if($info){
                return json(array('code'=>200,'msg'=>'修改成功'));
            }else{
                return json(array('code'=>0,'msg'=>'修改失败'));
            }
        }catch (\Exception $e){
            Log::record("编辑角色（admin/user/role_edit),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 删除角色
     * @return unknown
     */
    public function role_delete()
    {
        try {
            $id = $this->request->param("id");
            $info = Db::name("role")->where(array("role_id"=>$id))->update(array('role_status'=>'-1'));
            if($info){
                return json(array('code'=>200,'msg'=>'删除成功'));
            }else{
                return json(array('code'=>0,'msg'=>'删除失败'));
            }
        }catch (\Exception $e){
            Log::record("删除角色（admin/user/role_delete),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 获取菜单列表
     * @return unknown
     */
    public function menuinfo_list()
    {
        try {
            $page = $this->request->param('page')?$this->request->param('page'):1;//当前页数
            $limit = $this->request->param('limit')?$this->request->param('limit'):10;//每页显示多少条数据
            $info = Db::name("menuinfo")->where(array("starts"=>1))
            ->page($page,$limit)->select();
            $total = Db::name("menuinfo")->where(array("starts"=>1))->count();
            foreach ($info as $k=>$v){
                $info[$k]['createtime'] = date("Y-m-d H:i:s",$v['createtime']);
                if($v['starts'] == 1){
                    $info[$k]['starts'] = '正常';
                }else{
                    $info[$k]['starts'] = '禁用';
                }
            }
            if($info){
                return json(array('code'=>200,'msg'=>"菜单列表","data"=>$info,"total"=>$total));
            }else{
                return json(array('code'=>0,'msg'=>'没有数据'));
            }
        }catch (\Exception $e){
            Log::record("菜单列表（admin/user/menuinfo_list),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 菜单列表数据-用于编辑和添加页面使用
     * @return \think\response\Json
     */
    public function menuinfo_add()
    {
        try {
            $list = Db::name("menuinfo")->where(array("starts"=>1))->select();
            if($list){
                return json(array('code'=>200,'msg'=>'上级菜单列表','data'=>$list));
            }else{
                return json(array('code'=>0,'msg'=>'上级菜单列表'));
            }
        }catch (\Exception $e){
            Log::record("上级菜单列表(admin/User/menuinfo_add),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 添加菜单
     * @return unknown
     */
    public function menuinfo_addpost()
    {
        try {
            $data = $this->request->param();
            unset($data['access_token']);
            $data['createtime'] = time();
            $info = Db::name("menuinfo")->insert($data);
            if($info){
                return json(array('code'=>200,'msg'=>'添加成功'));
            }else{
                return json(array('code'=>0,'msg'=>'添加失败'));
            }
        } catch (\Exception $e) {
            Log::record("添加菜单（admin/user/menuinfo_add),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 菜单编辑数据
     * @return \think\response\Json
     */
    public function menuinfo_edit()
    {
        try{
            $id = $this->request->param('id');
            $info = Db::name("menuinfo")->where(array('id'=>$id))->find();
            if($info){
                return json(array('code'=>200,'msg'=>'菜单编辑数据','data'=>$info));
            }else{
                return json(array('code'=>0,'msg'=>'菜单编辑信息'));
            }
        }catch (\Exception $e){
            Log::record("编辑菜单数据（admin/User/menuinfo_edit),异常:".$e->getMessage(),'error');
        }
    }
    
    /**
     * 编辑菜单
     * @return unknown
     */
    public function menuinfo_editpost()
    {
        try {
            $data = $this->request->param();
            $id = $data["id"];
            unset($data['access_token']);
            unset($data['id']);
            $info = Db::name("menuinfo")->where(array('id'=>$id))->update($data);
            if($info){
                return json(array('code'=>200,'msg'=>'修改成功'));
            }else{
                return json(array('code'=>0,'msg'=>'修改失败'));
            }
        }catch (\Exception $e){
            Log::record("编辑菜单（admin/user/menuinfo_edit),异常：".$e->getMessage(),'error');
        }
    }
    
    /**
     * 删除菜单
     * @return unknown
     */
    public function menuinfo_delete()
    {
        try {
            $id = $this->request->param('id');
            $info = Db::name("menuinfo")->where(array('id'=>$id))->delete();
            if($info){
                return json(array('code'=>200,'msg'=>'删除成功'));
            }else{
                return json(array('code'=>0,'msg'=>'删除失败'));
            }
        } catch (\Exception $e) {
            Log::record("删除菜单（admin/user/menuinfo_delete),异常：".$e->getMessage(),'error');
        }
    }
}