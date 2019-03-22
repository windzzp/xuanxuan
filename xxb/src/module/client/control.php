<?php
/**
 * The control file of client module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Gang Liu <liugang@cnezsoft.com>
 * @package     client
 * @version     $Id$
 * @link        http://www.ranzhi.org
 */
class client extends control
{
    /**
     * Browse client list.
     *
     * @access public
     * @return void
     */
    public function browse()
    {
        $this->view->title   = $this->lang->client->version;
        $this->view->clients = $this->client->getList();
        $this->display();
    }

    /**
     * Create a client.
     *
     * @access public
     * @return void
     */
    public function create()
    {
        if($_POST)
        {
            $this->client->create();
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));

            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => 'reload'));
        }

        $this->view->title = $this->lang->client->create;
        $this->display();
    }

    /**
     * Edit a version.
     *
     * @param  int    $clientID 
     * @access public
     * @return void
     */
    public function edit($clientID)
    {
        if($_POST)
        {
            $this->client->update($clientID);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));

            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => 'reload'));
        }

        $this->view->title  = $this->lang->client->edit;
        $this->view->client = $this->client->getByID($clientID);
        $this->display();
    }

    /**
     * Delete a client.
     *
     * @param  int    $clientID 
     * @access public
     * @return void
     */
    public function delete($clientID)
    {
        $this->dao->delete()->from(TABLE_IM_CLIENT)->where('id')->eq($clientID)->exec();
        if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));

        $this->send(array('result' => 'success'));
    }

    /**
     * Check upgrade.
     *
     * @access public
     * @return void
     */
    public function checkUpgrade()
    {
        $jsonData = file_get_contents('https://xuan.im/xxbversion-api.json');

        $this->view->title    = $this->lang->client->checkUpgrade;
        $this->view->versions = json_decode($jsonData, false);
        $this->display();
    }
}
