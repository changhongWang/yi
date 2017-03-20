<?php

//分类显示菜品，每页最多显示5条，以JSON格式
//header('Content-Type':'application/json');
//接受客户端提交的数据
//$start = $_REQUEST['start'];
@$start=$_REQUEST['start'];
if( !isset($start)){
    $start=0;
    //客户端如果没有提交start请求参数，则设置默认值0
}
$count=10;
//$count为一次可以向客户端返回的最大的记录数

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "SELECT did,name,price,material,img_sm FROM kf_dish LIMIT $start,$count";
$result = mysqli_query($conn,$sql);
$output=[];
while(($row=mysqli_fetch_assoc($result))!==NULL){
    $output[] = $row;
}

//向客户端输出响应消息主体
$jsonString = json_encode($output);
echo $jsonString;
?>