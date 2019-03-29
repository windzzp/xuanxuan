<?php
/**
 * The control file of upgrade module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     upgrade
 * @version     $Id: control.php 4227 2016-10-25 08:27:56Z liugang $
 * @link        http://xuan.im
 */
class upgrade extends control
{
    /**
     * The index page.
     * 
     * @access public
     * @return void
     */
    public function index()
    {
        $this->locate(inlink('backup'));
    }

    /**
     * The backup page.
     * 
     * @access public
     * @return void
     */
    public function backup()
    {
        $this->view->title = $this->lang->upgrade->backup;
        $this->view->db    = $this->config->db;
        $this->display();
    }

    /**
     * Select the version of old xxb.
     * 
     * @access public
     * @return void
     */
    public function selectVersion()
    {
        $version = str_replace(array(' ', '.'), array('', '_'), $this->loadModel('setting')->getVersion());
        $version = strtolower($version);

        $this->view->title   = $this->lang->upgrade->common . $this->lang->colon . $this->lang->upgrade->selectVersion;
        $this->view->version = $version;
        $this->display();
    }

    /**
     * Confirm the version.
     * 
     * @access public
     * @return void
     */
    public function confirm()
    {
        $confirmContent = $this->upgrade->getConfirm($this->post->fromVersion);
        if(empty($confirmContent)) $this->locate(inlink('execute', "fromVersion={$this->post->fromVersion}"));

        $this->view->title       = $this->lang->upgrade->confirm;
        $this->view->confirm     = $confirmContent;
        $this->view->fromVersion = $this->post->fromVersion;

        $this->display();
    }

    /**
     * Execute the upgrading.
     * 
     * @param  string  $fromVersion
     * @access public
     * @return void
     */
    public function execute($fromVersion)
    {
        $fromVersion = isset($_POST['fromVersion']) ? $this->post->fromVersion : $fromVersion;
        $result = $this->upgrade->execute($fromVersion);

        $this->view->title = $this->lang->upgrade->result;

        if(!empty($result))
        {
            $result[] = $this->lang->upgrade->afterDeleted; 

            $this->view->result = 'fail';
            $this->view->errors  = $result;
        }
        else
        {
            if(!$this->upgrade->isError())
            {
                $this->view->result = 'success';
            }
            else
            {
                $this->view->result = 'fail';
                $this->view->errors = $this->upgrade->getError();
            }
        }
        $this->display();
    }
}
