<?php

//根据菜名/原料中的关键字查询菜品，以JSON格式
//header('Content-Type':'application/json');
//接受客户端提交的数据

@$kw = $_REQUEST['kw'];
if( !isset($kw)){
    echo '[]';
    return;
}

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
$sql = "SELECT did,name,price,material,img_sm FROM kf_dish WHERE name LIKE '%$kw%' OR material LIKE '%$kw%'";
$result = mysqli_query($conn,$sql);
$output=[];
while(($row=mysqli_fetch_assoc($result))!==NULL){
    $output[] = $row;
}

//向客户端输出响应消息主体

$jsonString = json_encode($output);
echo $jsonString;
?>