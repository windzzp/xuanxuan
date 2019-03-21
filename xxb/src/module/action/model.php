<?php
/**
 * The model file of action module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     action
 * @version     $Id: model.php 5028 2013-07-06 02:59:41Z wyd621@gmail.com $
 * @link        http://xuan.im
 */
?>
<?php
class actionModel extends model
{
    const BE_UNDELETED  = 0;    // The deleted object has been undeleted.
    const CAN_UNDELETED = 1;    // The deleted object can be undeleted.
    const BE_HIDDEN     = 2;    // The deleted object has been hidded.

    /**
     * Create an action.
     *
     * @param  string $objectType
     * @param  int    $objectID
     * @param  string $actionType
     * @param  string $comment
     * @param  string $extra        the extra info of this action, like customer, contact, order etc.  according to different modules and actions, can set different extra.
     * @param  string $actor
     * @param  int    $customer
     * @param  int    $contact
     * @access public
     * @return int
     */
    public function create($objectType, $objectID, $actionType, $comment = '', $extra = '', $actor = '', $customer = 0, $contact = 0)
    {
        $action = new stdclass();

        $action->objectType = strtolower($objectType);
        $action->objectID   = $objectID;
        $action->customer   = $customer;
        $action->contact    = $contact;
        $action->actor      = $actor ? $actor : $this->app->user->account;
        $action->action     = strtolower($actionType);
        $action->date       = helper::now();
        $action->comment    = trim(strip_tags($comment, "<img>")) ? trim(strip_tags($comment, $this->config->allowedTags)) : '';
        $action->extra      = $extra;
        $action->nextDate   = $this->post->nextDate;

        /* Process action. */
        $action = $this->loadModel('file')->processImgURL($action, 'comment', $this->post->uid);

        $this->dao->insert(TABLE_ACTION)
            ->data($action, $skip = 'nextDate,files,labels')
            ->batchCheckIF($actionType == 'record', 'contact, comment', 'notempty')
            ->checkIF($this->post->nextDate, 'nextDate', 'ge', helper::today())
            ->exec();

        return $this->dbh->lastInsertID();
    }

    /**
     * Get actions of an object.
     *
     * @param  string $objectType
     * @param  int    $objectID
     * @param  string $action
     * @param  object $pager
     * @access public
     * @return array
     */
    public function getList($objectType, $objectID, $action = '', $pager = null, $origin = '')
    {
        $orderBy = $origin == '' ? 'id' : '`date`_desc';
        $actions = $this->dao->select('*')->from(TABLE_ACTION)
            ->where('1 = 1')
            ->beginIF($action)->andWhere('action')->eq($action)->fi()
            ->orderBy($orderBy)
            ->page($pager)
            ->fetchAll('id');

        $histories = $this->getHistory(array_keys($actions));
        $contacts  = $this->loadModel('contact', 'crm')->getPairs(0, false, '');
        $this->loadModel('file');

        foreach($actions as $actionID => $action)
        {
            $action->history = isset($histories[$actionID]) ? $histories[$actionID] : array();
            $action->files   = $this->file->getByObject('action', $actionID);
            if($action->action == 'record') $action->contact = isset($contacts[$action->contact]) ? $contacts[$action->contact] : '';
            $action = $this->file->replaceImgURL($action, 'comment');
            $actions[$actionID] = $action;
        }

        return $actions;
    }

    /**
     * Get an action record.
     *
     * @param  int    $actionID
     * @access public
     * @return object | bool
     */
    public function getById($actionID)
    {
        $action = $this->dao->findById((int)$actionID)->from(TABLE_ACTION)->fetch();
        if(!$action) return false;
        $action->files = $this->loadModel('file')->getByObject('action', $actionID);
        return $action;
    }

    /**
     * Get deleted objects.
     *
     * @param  string    $type all|hidden
     * @param  string    $orderBy
     * @param  object    $pager
     * @access public
     * @return array
     */
    public function getTrashes($type, $orderBy, $pager)
    {
        $extra = $type == 'hidden' ? self::BE_HIDDEN : self::CAN_UNDELETED;
        $trashes = $this->dao->select('*')->from(TABLE_ACTION)
            ->where('action')->eq('deleted')
            ->andWhere('extra')->eq($extra)
            ->orderBy($orderBy)->page($pager)->fetchAll();
        if(!$trashes) return array();

        $this->app->loadLang('tree');
        $this->app->loadLang('user');
        $categoryTypes = $this->dao->select('DISTINCT type')->from(TABLE_CATEGORY)->fetchPairs();
        foreach($categoryTypes as $categoryType)
        {
            $objectType = $categoryType . '_category';
            $this->config->objectTables[$objectType]             = TABLE_CATEGORY;
            $this->config->action->objectNameFields[$objectType] = 'name';
            $this->config->action->objectAppNames[$objectType]   = 'sys';
            $this->lang->action->objectTypes[$objectType]        = isset($this->lang->{$categoryType}->common) ? $this->lang->{$categoryType}->common : $this->lang->tree->common;
        }

        /* Group trashes by objectType, and get there name field. */
        foreach($trashes as $object)
        {
            $object->objectType = str_replace('`', '', $object->objectType);
            $typeTrashes[$object->objectType][] = $object->objectID;
        }

        foreach($typeTrashes as $objectType => $objectIds)
        {
            $objectIds = array_unique($objectIds);
            $table     = $this->config->objectTables[$objectType];
            $field     = $this->config->action->objectNameFields[$objectType];

            if(!$table) continue;
            $objectNames[$objectType] = $this->dao->select("id, $field AS name")->from($table)->where('id')->in($objectIds)->fetchPairs();
        }

        /* Add name field to the trashes. */
        foreach($trashes as $trash) $trash->objectName = isset($objectNames[$trash->objectType][$trash->objectID]) ? $objectNames[$trash->objectType][$trash->objectID] : $trash->objectID;
        return $trashes;
    }

    /**
     * Get histories of an action.
     *
     * @param  int    $actionID
     * @access public
     * @return array
     */
    public function getHistory($actionID)
    {
        return $this->dao->select('*')->from(TABLE_HISTORY)->where('action')->in($actionID)->orderBy('id')->fetchGroup('action');
    }

    /**
     * Log histories for an action.
     *
     * @param  int    $actionID
     * @param  array  $changes
     * @access public
     * @return void
     */
    public function logHistory($actionID, $changes)
    {
        foreach($changes as $change)
        {
            $change['action'] = $actionID;
            $this->dao->insert(TABLE_HISTORY)->data($change)->exec();
        }
    }

    /**
     * Print actions of an object.
     *
     * @param  array    $action
     * @access public
     * @return void
     */
    public function printAction($action)
    {
        $objectType = $action->objectType;
        $actionType = strtolower($action->action);

        /**
         * Set the desc string of this action.
         *
         * 1. If the module of this action has defined desc of this actionType, use it.
         * 2. If no defined in the module language, search the common action define.
         * 3. If not found in the lang->action->desc, use the $lang->action->desc->common or $lang->action->desc->extra as the default.
         */
        if(isset($this->lang->$objectType->action->$actionType))
        {
            $desc = $this->lang->$objectType->action->$actionType;
        }
        elseif(isset($this->lang->action->desc->$actionType))
        {
            $desc = $this->lang->action->desc->$actionType;
        }
        else
        {
            $desc = $action->extra ? $this->lang->action->desc->extra : $this->lang->action->desc->common;
        }

        if($this->app->getViewType() == 'mhtml') $action->date = date('m-d H:i', strtotime($action->date));

        /* Cycle actions, replace vars. */
        foreach($action as $key => $value)
        {
            if($key == 'history' or $key == 'files') continue;

            /* Desc can be an array or string. */
            if(is_array($desc))
            {
                if($key == 'extra') continue;
                $desc['main'] = str_replace('$' . $key, $value, $desc['main']);
            }
            else
            {
                $desc = str_replace('$' . $key, $value, $desc);
            }
        }

        /* If the desc is an array, process extra. Please bug/lang. */
        if(is_array($desc))
        {
            $extra = strtolower($action->extra);
            if(isset($desc['extra'][$extra]))
            {
                echo str_replace('$extra', $desc['extra'][$extra], $desc['main']);
            }
            else
            {
                echo str_replace('$extra', $action->extra, $desc['main']);
            }
        }
        else
        {
            echo $desc;
        }
    }

    /**
     * Get actions as dynamic.
     *
     * @param  string $account
     * @param  string $period
     * @param  string $orderBy
     * @param  object $pager
     * @access public
     * @return array
     */
    public function getDynamic($account = 'all', $period = 'all', $orderBy = 'date_desc', $pager = null)
    {
        if($this->session->myQuery == false) $this->session->set('myQuery', ' 1 = 1');
        $myQuery = $this->loadModel('search')->replaceDynamic($this->session->myQuery);

        /* Computer the begin and end date of a period. */
        $beginAndEnd = $this->computeBeginAndEnd($period);
        extract($beginAndEnd);

        /* Get actions. */
        $actions = $this->dao->select('*')->from(TABLE_ACTION)
            ->where(1)
            ->andWhere('objectType')->ne('action')
            ->beginIF($period != 'bysearch' && $period  != 'all')->andWhere('date')->gt($begin)->fi()
            ->beginIF($period != 'bysearch' && $period  != 'all')->andWhere('date')->lt($end)->fi()
            ->beginIF($period != 'bysearch' && $account != 'all')->andWhere('actor')->eq($account)->fi()
            ->beginIF($period == 'bysearch')->andWhere($myQuery)->fi()
            ->orderBy($orderBy)
            ->fetchAll();

        if(!$actions) return array();
        $actions = $this->transformActions($actions);

        $idList = array();
        foreach($actions as $key => $action)
        {
            if($this->checkPriv($action)) $idList[] = $action->id;
        }
        /* Fix pager. */
        $actionIDList = $this->dao->select('id')->from(TABLE_ACTION)->where('id')->in($idList)->orderBy($orderBy)->page($pager)->fetchAll('id');
        foreach($actions as $key => $action)
        {
            if(!isset($actionIDList[$action->id])) unset($actions[$key]);
        }

        return $actions;
    }

    /**
     * Transform the actions for display.
     *
     * @param  int    $actions
     * @access public
     * @return void
     */
    public function transformActions($actions)
    {
        /* Group actions by objectType, and get there name field. */
        foreach($actions as $object) $objectTypes[$object->objectType][] = $object->objectID;
        foreach($objectTypes as $objectType => $objectIds)
        {
            if(!isset($this->config->objectTables[$objectType])) continue;    // If no defination for this type, omit it.

            $objectIds = array_unique($objectIds);
            $table     = $this->config->objectTables[$objectType];
            $field     = $this->config->action->objectNameFields[$objectType];
            $objectNames[$objectType] = $this->dao->select("id, $field AS name")->from($table)->where('id')->in($objectIds)->fetchPairs();
        }
        $objectNames['user'][0] = 'guest';    // Add guest account.

        foreach($actions as $action)
        {
            /* Add name field to the actions. */
            $action->objectName = isset($objectNames[$action->objectType][$action->objectID]) ? $objectNames[$action->objectType][$action->objectID] : '';

            $actionType = strtolower($action->action);
            $objectType = strtolower($action->objectType);
            $action->date        = date(DT_MONTHTIME2, strtotime($action->date));
            $action->actionLabel = isset($this->lang->action->label->$actionType) ? $this->lang->action->label->$actionType : $action->action;
            $action->objectLabel = $objectType;
            if(isset($this->lang->action->label->$objectType))
            {
                $objectLabel = $this->lang->action->label->$objectType;
                if(is_array($objectLabel))
                {
                    if(isset($objectLabel['common']))    $action->objectLabel = $objectLabel['common'];
                    if(isset($objectLabel[$actionType])) $action->objectLabel = $objectLabel[$actionType];
                }
                else
                {
                    $action->objectLabel = $objectLabel;
                }
            }

            /* app name. */
            $action->appName = '';
            if(isset($this->config->action->objectAppNames[$objectType])) $action->appName = $this->config->action->objectAppNames[$objectType];

            /* Open object by modal or not. */
            $action->toggle = '';
            if(strpos($this->config->action->objectModalLinks, ",{$objectType},") !== false) $action->toggle = "data-toggle = 'modal'";

            /* Other actions, create a link. */
            if(strpos($action->objectLabel, '|') !== false)
            {
                list($objectLabel, $moduleName, $methodName, $vars) = explode('|', $action->objectLabel);
                $vars = empty($vars) ? '' : sprintf($vars, $action->objectID);
                if(!empty($action->appName)) $moduleName = "{$action->appName}.{$moduleName}";
                $action->objectLink  = helper::createLink($moduleName, $methodName, $vars);
                $action->objectLabel = $objectLabel;
            }
            else
            {
                $action->objectLink = '';
            }
        }
        return $actions;
    }

    /**
     * Print changes of every action.
     *
     * @param  string    $objectType
     * @param  array     $histories
     * @param  string    $action
     * @access public
     * @return void
     */
    public function printChanges($objectType, $histories, $action)
    {
        if(empty($histories)) return;

        $maxLength            = 0;          // The max length of fields names.
        $historiesWithDiff    = array();    // To save histories without diff info.
        $historiesWithoutDiff = array();    // To save histories with diff info.

        /* Diff histories by hasing diff info or not. Thus we can to make sure the field with diff show at last. */
        foreach($histories as $history)
        {
            if($history->field == 'assignedTo')
            {
                $users = $this->loadModel('user')->getPairs();
                $history->old = $users[$history->old];
                $history->new = $users[$history->new];
            }

            $fieldName = $history->field;
            $history->fieldLabel = isset($this->lang->$objectType->$fieldName) ? $this->lang->$objectType->$fieldName : $fieldName;
            if(isset($this->config->action->actionModules[$action]))
            {
                $module = $this->config->action->actionModules[$action];
                $history->fieldLabel = isset($this->lang->$module->$fieldName) ? $this->lang->$module->$fieldName : $fieldName;
            }
            if(($length = strlen($history->fieldLabel)) > $maxLength) $maxLength = $length;
            $history->diff ? $historiesWithDiff[] = $history : $historiesWithoutDiff[] = $history;
        }
        $histories = array_merge($historiesWithoutDiff, $historiesWithDiff);

        foreach($histories as $history)
        {
            $history->fieldLabel = str_pad($history->fieldLabel, $maxLength, $this->lang->action->label->space);
            if($history->diff != '')
            {
                $history->diff      = str_replace(array('<ins>', '</ins>', '<del>', '</del>'), array('[ins]', '[/ins]', '[del]', '[/del]'), $history->diff);
                $history->diff      = ($history->field != 'subversion' and $history->field != 'git') ? htmlspecialchars($history->diff) : $history->diff;   // Keep the diff link.
                $history->diff      = str_replace(array('[ins]', '[/ins]', '[del]', '[/del]'), array('<ins>', '</ins>', '<del>', '</del>'), $history->diff);
                $history->diff      = nl2br($history->diff);
                $history->noTagDiff = preg_replace('/&lt;\/?([a-z][a-z0-9]*)[^\/]*\/?&gt;/Ui', '', $history->diff);
                printf($this->lang->action->desc->diff2, $history->fieldLabel, $history->noTagDiff, $history->diff);
            }
            else
            {
                printf($this->lang->action->desc->diff1, $history->fieldLabel, $history->old, $history->new);
            }
        }
    }

    /**
     * Undelete a record.
     *
     * @param  int      $actionID
     * @access public
     * @return void
     */
    public function undelete($actionID)
    {
        $action = $this->loadModel('action')->getById($actionID);
        if($action->action != 'deleted') return;

        $categoryTypes = $this->dao->select('DISTINCT type')->from(TABLE_CATEGORY)->fetchPairs();
        foreach($categoryTypes as $categoryType)
        {
            $objectType = $categoryType . '_category';
            $this->config->objectTables[$objectType] = TABLE_CATEGORY;
        }

        /* Update deleted field in object table. */
        $table = $this->config->objectTables[$action->objectType];
        $this->dao->update($table)->set('deleted')->eq(0)->where('id')->eq($action->objectID)->exec();

        /* Update action record in action table. */
        $this->dao->update(TABLE_ACTION)->set('extra')->eq(ACTIONMODEL::BE_UNDELETED)->where('id')->eq($actionID)->exec();
        $this->action->create($action->objectType, $action->objectID, 'undeleted');
    }

    /**
     * Update an action.
     *
     * @param  object    $action
     * @param  int       $actionID
     * @access public
     * @return void
     */
    public function update($action, $actionID)
    {
        $this->dao->update(TABLE_ACTION)->data($action, $skip = 'referer')->autoCheck()->where('id')->eq($actionID)->exec();
        return !dao::isError();
    }

    /**
     * Update comment of a action.
     *
     * @param  int    $actionID
     * @access public
     * @return bool
     */
    public function updateComment($actionID)
    {
        $action = new stdclass();
        $action->comment = trim(strip_tags($this->post->lastComment, $this->config->allowedTags));

        /* Process action. */
        $action = $this->loadModel('file')->processImgURL($action, 'comment', $this->post->uid);

        $this->dao->update(TABLE_ACTION)
            ->set('date')->eq(helper::now())
            ->set('comment')->eq($action->comment)
            ->where('id')->eq($actionID)
            ->exec();

        return !dao::isError();
    }

    /**
     * Hide an object.
     *
     * @param  int    $actionID
     * @access public
     * @return void
     */
    public function hideOne($actionID)
    {
        $action = $this->getById($actionID);
        if($action->action != 'deleted') return;

        $this->dao->update(TABLE_ACTION)->set('extra')->eq(self::BE_HIDDEN)->where('id')->eq($actionID)->exec();
        $this->create($action->objectType, $action->objectID, 'hidden');
    }

    /**
     * Hide all deleted objects.
     *
     * @access public
     * @return void
     */
    public function hideAll()
    {
        $this->dao->update(TABLE_ACTION)
            ->set('extra')->eq(self::BE_HIDDEN)
            ->where('action')->eq('deleted')
            ->andWhere('extra')->eq(self::CAN_UNDELETED)
            ->exec();
    }

    /**
     * update a action read status to read.
     *
     * @param  int    $actionID
     * @param  string $type
     * @access public
     * @return bool
     */
    public function read($actionID, $type = 'action')
    {
        /* Save read status to session if type isn't action. */
        if($type != 'action')
        {
            if(!isset($this->app->user->readNotices)) $this->app->user->readNotices = array();
            $this->app->user->readNotices[$actionID] = $actionID;
            return true;
        }

        /* Update action data. */
        $account = $this->app->user->account;
        $reader = $this->dao->select('reader')->from(TABLE_ACTION)->where('id')->eq($actionID)->fetch('reader');
        $readers = explode(',', trim($reader, ','));
        foreach($readers as $key => $value) if($value == $account or $value == '') unset($readers[$key]);

        $read = empty($readers) ? 1 : 0;
        $reader = empty($readers) ? '' : ',' . join(',', $readers) . ',';

        $this->dao->update(TABLE_ACTION)->set('read')->eq($read)->set('reader')->eq($reader)->where('id')->eq($actionID)->exec();
        return !dao::isError();
    }

    /**
     * Send notice to user. return failed user account.
     *
     * @param  int    $actionID
     * @param  string $reader
     * @param  bool   $onlyNotice
     * @access public
     * @return string
     */
    public function sendNotice($actionID, $reader, $onlyNotice = false)
    {
        $readers = is_array($reader) ? $reader : explode(',', trim($reader, ','));
        $failedReaders = array();

        foreach($readers as $key => $account) if($account == '' or $account == $this->app->user->account) unset($readers[$key]);
        foreach($readers as $key => $account)
        {
            if(!$onlyNotice and !$this->loadModel('user')->isOnline($account))
            {
                unset($readers[$key]);
                $failedReaders[] = $account;
            }
        }

        if(!empty($readers))
        {
            $reader = ',' . join(',', $readers) . ',';
            $oldReader = $this->dao->select('reader')->from(TABLE_ACTION)->where('id')->eq($actionID)->fetch('reader');
            if(!empty($oldReader)) $reader .= $oldReader;
            $this->dao->update(TABLE_ACTION)->set('read')->eq(0)->set('reader')->eq($reader)->where('id')->eq($actionID)->exec();
        }

        return join(',', $failedReaders);
    }

    /**
     * Get unread notice for user.
     *
     * @param  string $account
     * @param  string $skipNotice
     * @access public
     * @return array
     */
    public function getUnreadNotice($account = '', $skipNotice = '')
    {
        if($account == '') $account = $this->app->user->account;
        $users = $this->loadModel('user')->getPairs();

        $actions = $this->dao->select('*')->from(TABLE_ACTION)
            ->where('`read`')->eq('0')
            ->andWhere('reader')->like("%,$account,%")
            ->beginIf($skipNotice != '')->andWhere('id')->notin($skipNotice)->fi()
            ->orderBy('id_desc')
            ->fetchAll('id');

        if(!empty($actions)) $actions = $this->transformActions($actions);

        /* Create action notices. */
        $notices = array();
        foreach($actions as $action)
        {
            $notice = new stdclass();
            $notice->id    = $action->id;
            $notice->title = sprintf($this->lang->action->noticeTitle, $action->objectLabel, $action->objectLink, $action->appName, $action->objectName);
            $notice->type  = 'success';
            $notice->read  = helper::createLink('action', 'read', "actionID={$notice->id}");
            if(isset($users[$action->actor])) $action->actor = $users[$action->actor];

            /* Get contents. */
            ob_start();
            $this->printAction($action);
            $notice->content = ob_get_contents();
            ob_end_clean();

            $notices[$action->id] = $notice;
        }

        return $notices;
    }

    /**
     * Compute the begin date and end date of a period.
     *
     * @param  string    $period   all|today|yesterday|twodaysago|latest2days|thisweek|lastweek|thismonth|lastmonth
     * @access public
     * @return array
     */
    public function computeBeginAndEnd($period)
    {
        $this->app->loadClass('date');

        $today      = date::today();
        $tomorrow   = date::tomorrow();
        $yesterday  = date::yesterday();
        $twoDaysAgo = date::twoDaysAgo();

        $period = strtolower($period);

        if($period == 'all')        return array('begin' => '1970-1-1',  'end' => '2109-1-1');
        if($period == 'today')      return array('begin' => $today,      'end' => $tomorrow);
        if($period == 'yesterday')  return array('begin' => $yesterday,  'end' => $today);
        if($period == 'twodaysago') return array('begin' => $twoDaysAgo, 'end' => $yesterday);
        if($period == 'latest3days')return array('begin' => $twoDaysAgo, 'end' => $tomorrow);

        /* If the period is by week, add the end time to the end date. */
        if($period == 'thisweek' or $period == 'lastweek')
        {
            $func = "get$period";
            extract(date::$func());
            return array('begin' => $begin, 'end' => $end . ' 23:59:59');
        }

        if($period == 'thismonth')  return date::getThisMonth();
        if($period == 'lastmonth')  return date::getLastMonth();
    }

    /**
     * Check privilege for action.
     *
     * @param  object    $action
     * @access public
     * @return bool
     */
    public function checkPriv($action)
    {
        $canView = true;

        $objectType = $action->objectType;
        $actionType = $action->action;
        if(isset($this->lang->action->label->$objectType))
        {
            $objectLabel = $this->lang->action->label->$objectType;
            if(!is_array($objectLabel)) $action->objectLabel = $objectLabel;
            if(is_array($objectLabel) and isset($objectLabel[$actionType])) $action->objectLabel = $objectLabel[$actionType];

            if(strpos($action->objectLabel, '|') !== false)
            {
                list($objectLabel, $moduleName, $methodName, $vars) = explode('|', $action->objectLabel);
                $action->objectLabel = $objectLabel;
                if((!$this->loadModel('common')->isOpenMethod($moduleName, $methodName)) and (!commonModel::hasPriv($moduleName, $methodName))) $canView = false;
            }
        }

        return $canView;
    }
}
