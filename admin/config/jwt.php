<?php 
return [
    'key' => 'aliang',//自定义key值
    'lat' => time(),//签发时间
    'nbf' => time()+10,//生效时间
    'exp' => time()+24*3600,//过期时间
];