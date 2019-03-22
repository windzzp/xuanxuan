<?php
/**
 * The control file of group module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Xiying Guan <guanxiying@xirangit.com>
 * @package     group
 * @version     $Id: control.php 4648 2013-04-15 02:45:49Z chencongzhi520@gmail.com $
 * @link        http://xuan.im
 */
class group extends control
{
    /**
     * Construct function.
     * 
     * @access public
     * @return void
     */
    public function __construct($moduleName = '', $methodName = '', $appName = '')
    {
        parent::__construct($moduleName, $methodName, $appName);
        $this->loadModel('user');
    }

    /**
     * Browse groups.
     * 
     * @param  int    $companyID 
     * @access public
     * @return void
     */
    public function browse($companyID = 0)
    {
        $groups = $this->group->getList($companyID);
        $groupUsers = array();
        foreach($groups as $group) $groupUsers[$group->id] = $this->group->getUserPairs($group->id);

        $this->view->title      = $this->lang->group->browse;
        $this->view->groups     = $groups;
        $this->view->groupUsers = $groupUsers;

        $this->display();
    }

    /**
     * Create a group.
     * 
     * @access public
     * @return void
     */
    public function create()
    {
        if(!empty($_POST))
        {
            $this->group->create();
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browse')));
        }

        $this->view->title      = $this->lang->group->create;
        $this->view->position[] = $this->lang->group->create;
        $this->display();
    }

    /**
     * Edit a group.
     * 
     * @param  int    $groupID 
     * @access public
     * @return void
     */
    public function edit($groupID)
    {
       if(!empty($_POST))
        {
            $this->group->update($groupID);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browse')));
        }

        $this->view->title      = $this->lang->group->edit;
        $this->view->position[] = $this->lang->group->edit;
        $this->view->group      = $this->group->getById($groupID);

        $this->display();
    }

    /**
     * Copy a group.
     * 
     * @param  int    $groupID 
     * @access public
     * @return void
     */
    public function copy($groupID)
    {
       if(!empty($_POST))
        {
            $this->group->copy($groupID);
            if(dao::isError()) die(js::error(dao::getError()));
            if(isonlybody()) die(js::closeModal('parent.parent', 'this'));
            die(js::locate($this->createLink('group', 'browse'), 'parent'));
        }

        $this->view->title      = $this->lang->group->copy;
        $this->view->position[] = $this->lang->group->copy;
        $this->view->group      = $this->group->getById($groupID);
        $this->display();
    }
    
    /**
     * Manage privleges of a group. 
     * 
     * @param  string $type 
     * @param  mix    $param 
     * @param  string $menu 
     * @param  string $version 
     * @param  string $app 
     * @access public
     * @return void
     */
    public function managePriv($type = 'byGroup', $param = 0, $menu = '', $version = '', $app = '')
    {
        if($type == 'byGroup') $groupID = $param;
        $this->view->type = $type;
        foreach($this->lang->resource as $moduleName => $action)
        {
            if($this->group->checkMenuModule($menu, $moduleName) or $type != 'byGroup') $this->app->loadLang($moduleName);
        }

        if(!empty($_POST))
        {
            if($type == 'byGroup')  $result = $this->group->updatePrivByGroup($groupID, $menu, $version);
            if($type == 'byModule') $result = $this->group->updatePrivByModule();
            if($result)
            {
                if($type == 'byGroup') $this->group->updateAccounts($groupID);
                $this->send(array('result' => 'success', 'message' => $this->lang->group->successSaved, 'locate'=>inlink('browse')));
            }
            $this->send(array('result' => 'fail', 'message' => $this->lang->group->errorNotSaved));
        }

        if($type == 'byGroup')
        {
            $this->group->sortResource();
            $group      = $this->group->getById($groupID);
            $groupPrivs = $this->group->getPrivs($groupID);

            $this->view->title      = $group->name . $this->lang->group->managePriv;
            $this->view->position[] = $group->name;
            $this->view->position[] = $this->lang->group->managePriv;

            /* Join changelog when be equal or greater than this version.*/
            $realVersion = str_replace('_', '.', $version);
            $changelog = array();
            foreach($this->lang->changelog as $currentVersion => $currentChangeLog)
            {
                if(version_compare($currentVersion, $realVersion, '>=')) $changelog[] = join($currentChangeLog, ',');
            }

            $this->view->group      = $group;
            $this->view->changelogs = ',' . join($changelog, ',') . ',';
            $this->view->groupPrivs = $groupPrivs;
            $this->view->groupID    = $groupID;
            $this->view->menu       = $menu;
            $this->view->version    = $version;
        }
        elseif($type == 'byModule')
        {
            $this->group->sortResource();
            $this->view->title      = $this->lang->group->managePriv;
            $this->view->position[] = $this->lang->group->managePriv;

            foreach($this->lang->resource as $module => $moduleActions)
            {
                $modules[$module] = $this->lang->$module->common;
                foreach($moduleActions as $action)
                {
                    $actions[$module][$action] = $this->lang->$module->$action;
                }
            }
            $this->view->groups  = $this->group->getPairs();
            $this->view->modules = $modules;
            $this->view->actions = $actions;
        }
        $this->display();
    }

    /**
     * Manage members of a group.
     * 
     * @param  int    $groupID 
     * @access public
     * @return void
     */
    public function manageMember($groupID)
    {
        if(!empty($_POST))
        {
            $this->group->updateUser($groupID);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->group->updateAccounts($groupID);
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('browse')));
        }
        $group      = $this->group->getById($groupID);
        $groupUsers = $this->group->getUserPairs($groupID);
        $allUsers   = $this->user->getPairs('nodeleted,noforbidden,noclosed,noempty');
        $otherUsers = array_diff_assoc($allUsers, $groupUsers);

        $title      = $group->name . $this->lang->group->manageMember;
        $position[] = $group->name;
        $position[] = $this->lang->group->manageMember;

        $this->view->title      = $title;
        $this->view->position   = $position;
        $this->view->group      = $group;
        $this->view->groupUsers = $groupUsers;
        $this->view->otherUsers = $otherUsers;

        $this->display();
    }

    /**
     * Delete a group.
     * 
     * @param  int    $groupID 
     * @param  string $confirm  yes|no
     * @access public
     * @return void
     */
    public function delete($groupID)
    {
        $this->group->updateAccounts($groupID);

        $this->group->delete($groupID);
        if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
        $this->send(array('result' => 'success'));
    }
}
