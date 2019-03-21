<?php
/**
 * The control file of index module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     index 
 * @version     $Id: control.php 4205 2016-10-24 08:19:13Z liugang $
 * @link        http://www.ranzhi.org
 */
class index extends control
{
    /**
     * The construct method.
     * 
     * @access public
     * @return void
     */
    public function __construct($moduleName = '', $methodName = '', $appName = '')
    {
        parent::__construct($moduleName, $methodName, $appName);
    }

    /**
     * Index page.
     * 
     * @access public
     * @return void
     */
    public function index()
    {
        $blocks = $this->loadModel('block')->getBlockList();

        /* Init block when vist index first. */
        if(empty($blocks) and empty($this->config->blockInited))
        {
            if($this->loadModel('block')->initBlock('sys')) die(js::reload());
        }

        foreach($blocks as $key => $block)
        {
            $block->params = json_decode($block->params);
            if(empty($block->params)) $block->params = new stdclass();

            if(strpos('dynamic, allEntries, html, rss', $block->block) !== false) continue;

            if($block->source == 'zentao')
            {
                $block->moreLink = '';
                $block->appid    = 'zentao';
            }
            else
            {
                $moduleName = $block->block;
                if((isset($block->params->type) or isset($block->params->status)) and isset($this->lang->block->moreLinkList->$moduleName) and is_array($this->lang->block->moreLinkList->{$moduleName}))
                {
                    $type = isset($block->params->type) ? $block->params->type : $block->params->status;
                    if(isset($this->lang->block->moreLinkList->{$moduleName}[$type]))
                    {
                        list($label, $app, $module, $method, $vars) = explode('|', $this->lang->block->moreLinkList->{$moduleName}[$type]);
                        $block->moreLink = $this->createLink($app . '.' . $module, $method, $vars);
                        $block->appid    = $app == 'sys' ? 'dashboard' : $app;
                    }
                }
                else
                {
                    if(isset($this->lang->block->moreLinkList->{$moduleName}) and !is_array($this->lang->block->moreLinkList->{$moduleName}))
                    {
                        list($label, $app, $module, $method, $vars) = explode('|', $this->lang->block->moreLinkList->{$moduleName});
                        $block->moreLink = $this->createLink($app . '.' . $module, $method, $vars);
                        $block->appid    = $app == 'sys' ? 'dashboard' : $app;
                    }
                }
            }
        }

        /* Get custom setting about superadmin */
        $customApp = isset($this->config->personal->common->customApp) ? json_decode($this->config->personal->common->customApp->value) : new stdclass();
        if(isset($customApp->superadmin)) $this->view->superadmin = $customApp->superadmin;
        if(isset($customApp->dashboard))  $this->view->dashboard  = $customApp->dashboard;

        $this->view->allEntries = $allEntries;
        $this->view->blocks     = $blocks;
        $this->display();
    }
}
