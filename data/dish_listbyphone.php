<?php

//根据客户端提交的电话号码，返回其所下的所有订单，以JSON格式
//header('Content-Type':'application/json');
//接受客户端提交的数据
//$start = $_REQUEST['start'];
@$phone=$_REQUEST['phone'];
if( !isset($phone)){
    echo '[]';
    return;
}

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "SELECT oid,user_name,order_time,img_sm FROM kf_order,kf_dish WHERE phone='$phone' AND kf_order.did=kf_dish.did";
$result = mysqli_query($conn,$sql);
$output=[];
while(($row=mysqli_fetch_assoc($result))!==NULL){
    $output[] = $row;
}

//向客户端输出响应消息主体

$jsonString = json_encode($output);
echo $jsonString;
//根据电话号码查询用户的所有订单
?>

