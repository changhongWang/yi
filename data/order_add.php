<?php

//接收客户端提交的订单信息，保存订单，生成订单号，输出执行的结果，以JSON格式
header('Content-Type:application/json');
//接受客户端提交的数据
//$start = $_REQUEST['start'];
@$user_name = $_REQUEST['user_name'];
@$sex = $_REQUEST['sex']; //性别 格式为1或2
@$phone = $_REQUEST['phone'];
@$addr = $_REQUEST['addr'];
@$did = $_REQUEST['did'];
$order_time = time()*1000; //以毫秒为单位的当前系统时间

if( !isset($user_name) ||!isset($sex) ||!isset($phone) ||!isset($addr) ||!isset($did)){
    echo '{"status":"error","msg":"客户端提交的请求数据不足！"}';
    return;
}

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "INSERT INTO kf_order(oid,user_name,sex,phone,addr,did,order_time) VALUES(NULL,'$user_name','$sex','$phone','$addr','$did','$order_time')";
$result = mysqli_query($conn,$sql);

$output = [];
if($result){
    $output['status']='success';
    $output['oid']=mysqli_insert_id($conn);
    //mysqli_insert_id获取最近的一条INSERT语句所生成的自增主键

}else{
    $output['status']='error';
    $output['msg']="数据库访问失败！SQL：$sql";
}

//向客户端输出响应消息主体

$jsonString = json_encode($output);
echo $jsonString;
//根据电话号码查询用户的所有订单
?>

