<?php
class setting extends control
{
    public function getXXCUpdate()
    {
        $this->loadModel('chat');
        $jsonData = file_get_contents('http://chanzhi-xx.phpee.cn/index.php?m=xxbversion&f=index');

        $this->view->title    = $this->lang->chat->checkUpdate;
        $this->view->versions = json_decode($jsonData, false);
        $this->display();
    }
}