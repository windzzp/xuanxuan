<?php
class setting extends control
{
    public function getXXCUpdate()
    {
        $this->loadModel('chat');
        $jsonData = file_get_contents('https://xuan.im/index.php?m=xxbversion&f=api');

        $this->view->title    = $this->lang->chat->checkUpdate;
        $this->view->versions = json_decode($jsonData, false);
        $this->display();
    }
}
