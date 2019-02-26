<?php
class setting extends control
{
    public function createXXCVersion()
    {
        $this->loadModel('chat');
        if($_POST)
        {
            $this->chat->createXXCVersion();
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('xxcVersion')));
        }

        $this->view->title = $this->lang->create;
        $this->display();
    }
}