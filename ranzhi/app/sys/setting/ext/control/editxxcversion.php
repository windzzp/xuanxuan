<?php
class setting extends control
{
    public function editXXCVersion($versionID = 0)
    {
        $this->loadModel('chat');
        if($_POST)
        {
            $this->chat->editXXCVersion($versionID);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('xxcVersion')));
        }

        $version = $this->dao->select('*')->from(TABLE_IM_XXCVERSION)->where('id')->eq($versionID)->fetch();
        $version->downloads  = json_decode($version->downloads, true);
        $this->view->title   = $this->lang->edit;
        $this->view->version = $version;
        $this->display();
    }
}