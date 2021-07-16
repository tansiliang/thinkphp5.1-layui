<?php 
namespace app\admin\controller;

use think\Controller;
use think\facade\Log;

class Oauth extends Controller{
    
    
    public function authorize()
    {
        try {
            
            global $server;
            #$dsn = 'mysql:dbname=XXX;host=127.0.0.1';
            #$username = 'root';
            #$password = 'root';
            $dsn = config("database.dsn");
            $username = config("database.username");
            $password = config("database.password");
            \OAuth2\Autoloader::register();
            // $dsn is the Data Source Name for your database, for exmaple "mysql:dbname=my_oauth2_db;host=localhost"
            $storage = new \OAuth2\Storage\Pdo(array('dsn' => $dsn, 'username' => $username, 'password' => $password));
            // Pass a storage object or array of storage objects to the OAuth2 server class
            $server = new \OAuth2\Server($storage);
            // Add the "Client Credentials" grant type (it is the simplest of the grant types)
            $server->addGrantType(new \OAuth2\GrantType\ClientCredentials($storage));
            // Add the "Authorization Code" grant type (this is where the oauth magic happens)
            $server->addGrantType(new \OAuth2\GrantType\AuthorizationCode($storage));
            $request = \OAuth2\Request::createFromGlobals();
            $response = new \OAuth2\Response();
            // validate the authorize request
            if (!$server->validateAuthorizeRequest($request, $response)) {
                die;
            }
            // display an authorization form
            if (empty($_POST)) {
                exit('
            <form method="post">
              <label>Do You Authorize TestClient?</label><br />
              <input type="submit" name="authorized" value="yes">
              <input type="submit" name="authorized" value="no">
            </form>');
            }
            
            // print the authorization code if the user has authorized your client
            $is_authorized = ($_POST['authorized'] === 'yes');
            $server->handleAuthorizeRequest($request, $response, $is_authorized);
            if ($is_authorized) {
                
                // this is only here so that you get to see your code in the cURL request. Otherwise, we'd redirect back to the client
                
                $code = substr($response->getHttpHeader('Location'), strpos($response->getHttpHeader('Location'), 'code=')+5, 40);
                exit("SUCCESS! Authorization Code: $code");
            }
            
            $response->send();
        }catch (\Exception $e){
            Log::record("oauth->获取authorize，错误：".$e->getMessage(),'error');
        }
  }
  
  /**
   * 获取token
   */
  public function token()
  {
      try {
          
          global $server;
          #$dsn = 'mysql:dbname=XXX;host=127.0.0.1';
          #$username = 'root';
          #$password = '';
          $dsn = config("database.dsn");
          $username = config("database.username");
          $password = config("database.password");
          \OAuth2\Autoloader::register();
          // $dsn is the Data Source Name for your database, for exmaple "mysql:dbname=my_oauth2_db;host=localhost"
          $storage = new \OAuth2\Storage\Pdo(array('dsn' => $dsn, 'username' => $username, 'password' => $password));
          // Pass a storage object or array of storage objects to the OAuth2 server class
          $server = new \OAuth2\Server($storage);
          // Add the "Client Credentials" grant type (it is the simplest of the grant types)
          $server->addGrantType(new \OAuth2\GrantType\ClientCredentials($storage));
          // Add the "Authorization Code" grant type (this is where the oauth magic happens)
          $server->addGrantType(new \OAuth2\GrantType\AuthorizationCode($storage));
          // Handle a request for an OAuth2.0 Access Token and send the response to the client
          $server->handleTokenRequest(\OAuth2\Request::createFromGlobals())->send();
      }catch (\Exception $e){
          Log::record("oauth->获取token，错误：".$e->getMessage(),'error');
      }
  }
      
               
}