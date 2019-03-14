<?php
class setting extends control
{
    /**
     * Download xxd. 
     *
     * @param  string $backend
     * @param  string $type
     * @param  string $os
     * @access public
     * @return void
     */
    public function downloadXXD($backend = 'xxb', $type = '', $os = '')
    {
        if(in_array($type, array('config', 'package')))
        {
            $this->loadModel('chat');
            $server = $this->chat->getServer($backend);
            if(strpos($server, '127.0.0.1') !== false) die(js::alert($this->lang->chat->xxdServerError));

            $setting     = $this->config->xuanxuan;
            $setting->os = $os;
            $this->chat->downloadXXD($backend, $setting, $type);
        }
        die("Params error.");
    }
}
