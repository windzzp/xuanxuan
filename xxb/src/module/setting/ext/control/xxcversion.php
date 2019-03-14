<?php
class setting extends control
{
    public function xxcVersion()
    {
        $this->loadModel('chat');
        $this->lang->menuGroups->setting = 'system';
        $this->lang->setting->menu       = $this->lang->system->menu;
        $this->lang->setting->menuOrder  = $this->lang->system->menuOrder;

        $this->view->title    = $this->lang->chat->version;
        $this->view->versions = $this->chat->getVersions();
        $this->display();
    }
}