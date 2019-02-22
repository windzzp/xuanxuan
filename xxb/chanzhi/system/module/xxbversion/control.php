<?php
/**
 * The control file of xxbversion module of chanzhiEPS.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPLV1.2 (http://zpl.pub/page/zplv12.html)
 * @author      Memory <lvtao@cnezsoft.com>
 * @package     index
 * @version     $Id$
 * @link        http://www.chanzhi.org
 */
class xxbversion extends control
{

    public function index()
    {
        $versions = $this->xxbversion->getAll();
        foreach($versions as $version)
        {
            $version->xxcDownload = json_decode($version->xxcDownload);
            $version->xxbDownload = json_decode($version->xxbDownload);
            $version->xxdDownload = json_decode($version->xxdDownload);
            unset($version->lang);
        }
        echo json_encode($versions);
    }
    
    public function browser($recPerPage = 10, $pageID = 1)
    {
        $this->app->loadClass('pager', $static = true);
        $pager = new pager($recTotal = 0, $recPerPage, $pageID);
        
        $this->view->title    = $this->lang->xxbversion->common;
        $this->view->pager    = $pager;
        $this->view->versions = $this->xxbversion->getAll($pager);
        $this->display();
    }
    
    public function create()
    {
        if($_POST)
        {
            $this->xxbversion->create();
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browser')));
        }
        $this->display();
    }
    
    public function edit($id)
    {
        if($_POST)
        {
            $this->xxbversion->edit($id);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browser')));
        }
        $version = $this->xxbversion->getByID($id);
        $version->xxcDownload = json_decode($version->xxcDownload);
        $version->xxbDownload = json_decode($version->xxbDownload);
        $version->xxdDownload = json_decode($version->xxdDownload);
        
        $this->view->version = $version;
        $this->display();
    }
    
    public function delete($id)
    {
        $this->dao->setAutolang(false)->delete()->from(TABLE_XXB_VERSION)->where('id')->eq($id)->exec();
        if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
        $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browser')));
    }
}