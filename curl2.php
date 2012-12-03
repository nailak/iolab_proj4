<?php
$ch = curl_init("http://www.ischool.berkeley.edu/people/students");
$html = curl_exec($ch);
echo $html;
?>