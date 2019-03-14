<?php
class setting extends control
{
    public function getXXCUpdate()
    {
        $this->loadModel('chat');
        $jsonData = file_get_contents('https://xuan.im/xxbversion-api.json');

        $this->view->title    = $this->lang->chat->checkUpdate;
        $this->view->versions = json_decode($jsonData, false);
        $this->display();
    }
}
