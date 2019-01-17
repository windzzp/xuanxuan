<?php
class setting extends control
{
    /**
     * Configuration of xuanxuan. 
     *
     * @param  string $backend
     * @param  string $type
     * @access public
     * @return void
     */
    public function xuanxuan($backend = 'xxb', $type = '')
    {
        if($this->app->user->admin != 'super') die(js::locate('back'));

        if($type != 'edit' && (!zget($this->config->xuanxuan, 'key', '') or zget($this->config->xuanxuan, 'key', '') == str_repeat(8, 32))) $this->locate(inlink('xuanxuan', 'backend=xxb&type=edit'));

        $this->app->loadLang('chat', 'sys');
        if($_POST)
        {
            $errors  = array();
            $setting = fixer::input('post')->join('staff', ',')->remove('https')->get();

            if(strlen($this->post->key) != 32 or !validater::checkREG($this->post->key, '|^[A-Za-z0-9]+$|')) $errors['key'] = $this->lang->chat->errorKey;
            if($this->post->key == str_repeat(8, 32)) $errors['key'] = $this->lang->chat->defaultKey;
            if(!is_numeric($setting->chatPort) or (int)$setting->chatPort <= 0 or (int)$setting->chatPort > 65535) $errors['chatPort'] = $this->lang->chat->xxdPortError;
            if(!is_numeric($setting->commonPort) or (int)$setting->commonPort <= 0 or (int)$setting->commonPort > 65535) $errors['commonPort'] = $this->lang->chat->xxdPortError;
            if($setting->isHttps)
            {
                if(empty($setting->sslcrt)) $errors['sslcrt'] = $this->lang->chat->errorSSLCrt;
                if(empty($setting->sslkey)) $errors['sslkey'] = $this->lang->chat->errorSSLKey;
            }

            if(strpos($setting->server, '127.0.0.1') !== false) $errors[] = $this->lang->chat->xxdServerError;
            if(strpos($setting->server, 'https://') !== 0 and strpos($setting->server, 'http://') !== 0) $errors[] = $this->lang->chat->xxdSchemeError;
            if(empty($setting->server)) $errors[] = $this->lang->chat->xxdServerEmpty;

            if($errors) $this->send(array('result' => 'fail', 'message' => $errors));

            $result = $this->loadModel('setting')->setItems('system.sys.common.xuanxuan', $setting);
            if(!$result) $this->send(array('result' => 'fail', 'message' => dao::getError()));

            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('xuanxuan', "backend=$backend")));
        }

        $this->lang->menuGroups->setting = 'system';
        $this->lang->setting->menu       = $this->lang->system->menu;
        $this->lang->setting->menuOrder  = $this->lang->system->menuOrder;

        $os = 'win';
        if(strpos(strtolower(PHP_OS), 'win') !== 0) $os = strtolower(PHP_OS);

        $this->view->title   = $this->lang->chat->settings;
        $this->view->type    = $type;
        $this->view->backend = $backend;
        $this->view->os      = $os . '_' . php_uname('m');
        $this->view->domain  = $this->loadModel('chat')->getServer($backend);
        $this->view->isHttps = isset($this->config->xuanxuan->isHttps) ? $this->config->xuanxuan->isHttps : 0;
        $this->display();
    }
}
