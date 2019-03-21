<?php
/**
 * The control file of action module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     action
 * @version     $Id$
 * @link        http://xuan.im
 */
class action extends control
{
    /**
     * browse history actions and records. 
     * 
     * @param  string    $objectType
     * @param  int       $objectID 
     * @param  string    $action
     * @param  string    $from
     * @access public
     * @return void
     */
    public function history($objectType, $objectID, $action = '', $from = 'view')
    {
        $this->view->actions    = $this->action->getList($objectType, $objectID, $action);
        $this->view->datingList = $this->action->getDatingList($objectType, $objectID);
        $this->view->objectType = $objectType;
        $this->view->objectID   = $objectID;
        $this->view->users      = $this->loadModel('user')->getPairs();
        $this->view->contacts   = $this->loadModel('contact', 'crm')->getPairs();
        $this->view->from       = $from;
        $this->view->behavior   = $action;
        $this->display();
    }

    /**
     * Edit comment of an action.
     * 
     * @param  int    $actionID 
     * @access public
     * @return void
     */
    public function editComment($actionID)
    {
        if(!strip_tags($this->post->lastComment)) $this->send(array('result' => 'success', 'locate' => $this->server->http_referer));
        $this->action->updateComment($actionID);
        $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => $this->server->http_referer));
    }

    /**
     * Send email.
     *
     * @param  int    $actionID
     * @param  int    $nextContact
     * @param  string $nextDate
     * @access public
     * @return void
     */
    public function sendmail($actionID, $nextContact, $nextDate)
    {
        /* Reset $this->output. */
        $this->clear();

        /* Get action info. */
        $action = $this->loadModel('action')->getById($actionID);
        if($action->action != 'dating') return false;

        $history = $this->action->getHistory($actionID);
        $action->history = isset($history[$actionID]) ? $history[$actionID] : array();

        /* Set toList and ccList. */
        $users    = $this->loadModel('user')->getPairs();
        $customer = $this->loadModel('customer')->getById($action->customer);
        $contact  = $this->loadModel('contact', 'crm')->getById($nextContact);
        $toList   = $this->post->contactedBy;
        $subject  = $this->lang->action->record->next . '# ' . $nextDate;
        if($customer) $subject .= ' ' . $customer->name;
        if($contact)  $subject .= ' ' . $contact->realname;

        /* send notice if user is online and return failed accounts. */
        $toList = $this->loadModel('action')->sendNotice($actionID, $toList);

        if(!$toList) return true;

        $table  = $this->config->action->datingTables[$action->objectType];
        $object = $this->dao->select('*')->from($table)->where('id')->eq($action->objectID)->fetch();
        $module = $action->objectType;
        if($action->objectType == 'customer') $module = $object->relation == 'provider' ? 'provider' : 'customer';
        if($action->objectType == 'contact')  $module = $object->status == 'normal' ? 'contact' : 'leads';
        $viewUrl = commonModel::getSysURL() . helper::createLink("crm.{$module}", 'view', "id={$object->id}");

        /* Create the email content. */
        $this->view->action    = $action;
        $this->view->users     = $users;
        $this->view->mailTitle = $subject;
        $this->view->nextDate  = $nextDate;
        $this->view->customer  = $customer;
        $this->view->contact   = $contact;
        $this->view->viewUrl   = $viewUrl;

        $mailContent = $this->parse($this->moduleName, 'sendmail');

        /* Send emails. */
        $this->loadModel('mail')->send($toList, $subject, $mailContent);
        if($this->mail->isError()) trigger_error(join("\n", $this->mail->getError()));
    }

    /**
     * Trash 
     * 
     * @param  string $type all|hidden 
     * @param  string $orderBy 
     * @param  int    $recTotal 
     * @param  int    $recPerPage 
     * @param  int    $pageID 
     * @access public
     * @return void
     */
    public function trash($type = 'all', $orderBy = 'id_desc', $recTotal = 0, $recPerPage = 20, $pageID = 1)
    {
        $this->lang->menuGroups->action = 'system';
        $this->lang->action->menu       = $this->lang->system->menu;
        $this->lang->action->menuOrder  = $this->lang->system->menuOrder;

        /* Save session. */
        $uri = $this->app->getURI(true);
        $this->session->set('projectList', $uri);
        $this->session->set('taskList',    $uri);
        $this->session->set('docList',     $uri);

        /* Get deleted objects. */
        $this->app->loadClass('pager', $static = true);
        $pager = pager::init($recTotal, $recPerPage, $pageID);

        $trashes = $this->action->getTrashes($type, $orderBy, $pager);

        /* Title and position. */
        $this->view->title   = $this->lang->action->trash;
        $this->view->trashes = $trashes;
        $this->view->type    = $type;
        $this->view->orderBy = $orderBy;
        $this->view->pager   = $pager;
        $this->view->users   = $this->loadModel('user')->getPairs();
        $this->display();
    }

    /**
     * Hide an deleted object. 
     * 
     * @param  int    $actionID 
     * @access public
     * @return void
     */
    public function hideOne($actionID)
    {
        $this->action->hideOne($actionID);
        $this->send(array('result' => 'success', 'locate' => inlink('trash')));
    }

    /**
     * Hide all deleted objects.
     * 
     * @param  string $confirm 
     * @access public
     * @return void
     */
    public function hideAll($confirm = 'no')
    {
        $this->action->hideAll();
        $this->send(array('result' => 'success', 'locate' => inlink('trash', "type=hidden")));
    }

    /**
     * Undelete an object.
     * 
     * @param  int    $actionID 
     * @access public
     * @return void
     */
    public function undelete($actionID)
    {
        $this->action->undelete($actionID);
        $this->send(array('result' => 'success', 'locate' => $this->server->http_referer));
    }

    /**
     * read a notice.
     * 
     * @param  int    $actionID 
     * @param  string $type 
     * @access public
     * @return void
     */
    public function read($actionID, $type = 'action')
    {
        $this->action->read($actionID, $type);
        die('success');
    }
}
