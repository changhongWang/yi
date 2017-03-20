<?php

header('Content-Type:application/json');

//接收客户端提交的数据
@$user_name = $_REQUEST['user_name'];
@$user_password = $_REQUEST['pwd'];
@$email = $_REQUEST['email'];
//用户注册时间
$register_time = time()*1000;

//建立连接
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "INSERT INTO yi_user(user_name,user_password,email,register_time) VALUES('$user_name','$user_password','$email','$register_time')";
$result = mysqli_query($conn,$sql);

$output = [];
if($result){
    $output['status']='success';
    $output['oid']=mysqli_insert_id($conn);
    //mysqli_insert_id获取最近的一条INSERT语句所生成的自增主键

}else{
    $output['status']='error';
    $output['msg']="Failed to connect the Database！SQL：$sql";
}

$jsonString = json_encode($output);
echo $jsonString;

?>