<?php
class setting extends control
{
    public function xxcVersion()
    {
        $this->loadModel('chat');

        $this->view->title    = $this->lang->chat->version;
        $this->view->versions = $this->chat->getVersions();
        $this->display();
    }
}