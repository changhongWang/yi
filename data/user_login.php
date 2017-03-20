<?php

header('Content-Type:application/json');

//接收客户端提交的数据
@$user_name = $_REQUEST['user_name'];
@$user_password = $_REQUEST['pwd'];

//建立连接
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "SELECT user_name,user_password FROM yi_user WHERE user_name = '$user_name'";
$result = mysqli_query($conn,$sql);
$output=[];
while(($row=mysqli_fetch_assoc($result))!==NULL){
    $output[] = $row;
}



$jsonString = json_encode($output);
echo $jsonString;

?>