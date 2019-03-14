<?php
/**
 * The model file of upgrade module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     upgrade
 * @version     $Id: model.php 4227 2016-10-25 08:27:56Z liugang $
 * @link        http://www.ranzhi.org
 */
?>
<?php
class upgradeModel extends model
{
    /**
     * Errors.
     * 
     * @static
     * @var array 
     * @access public
     */
    static $errors = array();

    /**
     * The execute method. According to the $fromVersion call related methods.
     * 
     * @param  string $fromVersion 
     * @access public
     * @return void
     */
    public function execute($fromVersion)
    {
        $result = array();
    
        /* Delete useless file.*/
        foreach($this->config->delete as $deleteFiles)
        {
            $basePath = $this->app->getBasePath();
            foreach($deleteFiles as $file)
            {
                $fullPath = $basePath . str_replace('/', DIRECTORY_SEPARATOR, $file);
                if(is_dir($fullPath)  and !rmdir($fullPath))  $result[] = sprintf($this->lang->upgrade->deleteDir, $fullPath);
                if(is_file($fullPath) and !unlink($fullPath)) $result[] = sprintf($this->lang->upgrade->deleteFile, $fullPath);
            }
        }
        if(!empty($result)) return array('' => $this->lang->upgrade->deleteTips) + $result;
    
        $xuanxuanVersion = $this->getXuanxuanVersion();
        $this->upgradeXuanxuan($xuanxuanVersion);

        switch($fromVersion)
        {
            case '1_0'   :
            case '1_1'   :
            case '1_2'   : $this->execSQL($this->getUpgradeFile('1.2'));
            case '2_0_0' :
            case '2_1_0' :
            case '2_2_0' :
            case '2_3_0' :
            case '2_4_0' : $this->execSQL($this->getUpgradeFile('2.4.0'));
            default: if(!$this->isError()) $this->loadModel('setting')->updateVersion($this->config->version);
        }

        $this->deletePatch();
    }

    /**
     * Create the confirm contents.
     * 
     * @param  string $fromVersion 
     * @access public
     * @return string
     */
    public function getConfirm($fromVersion)
    {
        $confirmContent = '';
        switch($fromVersion)
        {
            case '1_0'   :
            case '1_1'   :
            case '1_2'   : $confirmContent .= $this->getUpgradeFile('1.2');
            case '2_0_0' :
            case '2_1_0' :
            case '2_2_0' :
            case '2_3_0' :
            case '2_4_0' : $confirmContent .= $this->getUpgradeFile('2.4.0');
        }
        return $confirmContent;
    }

    /**
     * Get the upgrade sql file.
     * 
     * @param  string $version 
     * @access public
     * @return string
     */
    public function getUpgradeFile($version)
    {
        return $this->app->getBasepath() . 'db' . DS . 'upgrade' . $version . '.sql';
    }

    /**
     * Execute a sql.
     * 
     * @param  string  $sqlFile 
     * @access public
     * @return void
     */
    public function execSQL($sqlFile)
    {
        $mysqlVersion = $this->loadModel('install')->getMysqlVersion();
        $ignoreCode   = '|1050|1060|1062|1091|1169|';

        /* Read the sql file to lines, remove the comment lines, then join theme by ';'. */
        $sqls = explode("\n", file_get_contents($sqlFile));
        foreach($sqls as $key => $line) 
        {
            $line       = trim($line);
            $sqls[$key] = $line;
            if(strpos($line, '--') !== false or empty($line)) unset($sqls[$key]);
        }
        $sqls = explode(';', join("\n", $sqls));

        foreach($sqls as $sql)
        {
            $sql = trim($sql);
            if(empty($sql)) continue;

            if($mysqlVersion <= 4.1)
            {
                $sql = str_replace('DEFAULT CHARSET=utf8', '', $sql);
                $sql = str_replace('CHARACTER SET utf8 COLLATE utf8_general_ci', '', $sql);
            }

            /* Add table prefix. */
            if($this->config->db->prefix) $sql = str_replace('xxb_', $this->config->db->prefix, $sql);

            try
            {
                $this->dbh->exec($sql);
            }
            catch (PDOException $e) 
            {
                $errorInfo = $e->errorInfo;
                $errorCode = $errorInfo[1];
                if(strpos($ignoreCode, "|$errorCode|") === false) self::$errors[] = $e->getMessage() . "<p>The sql is: $sql</p>";
            }
        }
    }

    /**
     * Judge any error occers.
     * 
     * @access public
     * @return bool
     */
    public function isError()
    {
        return !empty(self::$errors);
    }

    /**
     * Get errors during the upgrading.
     * 
     * @access public
     * @return array
     */
    public function getError()
    {
        $errors = self::$errors;
        self::$errors = array();
        return $errors;
    }

    /**
     * Change system application logo path to relative path.
     * 
     * @access public
     * @return bool
     */
    public function upgradeEntryLogo()
    {
        $entryList = array('crm', 'cash', 'oa', 'team');
        foreach($entryList as $entry)
        {
            $entryObj = $this->dao->select('*')->from(TABLE_ENTRY)->where('code')->eq($entry)->fetch();
            $path     = substr($entryObj->logo, strpos($entryObj->logo, 'theme'));
            $this->dao->update(TABLE_ENTRY)->set('logo')->eq($path)->where('code')->eq($entry)->exec();
        }
        return !dao::isError();
    }

    /**
     * Update return records.
     * 
     * @access public
     * @return bool
     */
    public function upgradeReturnRecords()
    {
        $contracts = $this->dao->select('*')->from(TABLE_CONTRACT)->where('`return`')->eq('done')->fetchAll();
        if(empty($contracts)) return false;

        foreach($contracts as $contract)
        {
            $data = new stdclass();
            $data->contract     = $contract->id;
            $data->amount       = $contract->amount;
            $data->returnedBy   = $contract->returnedBy;
            $data->returnedDate = $contract->returnedDate;

            $this->dao->insert(TABLE_PLAN)->data($data)->autoCheck()->exec();
        }

        return !dao::isError();
    }

    /**
     * Update delivery records.
     * 
     * @access public
     * @return bool
     */
    public function upgradeDeliveryRecords()
    {
        $contracts = $this->dao->select('*')->from(TABLE_CONTRACT)->where('`delivery`')->eq('done')->fetchAll();
        if(empty($contracts)) return false;

        foreach($contracts as $contract)
        {
            $data = new stdclass();
            $data->contract      = $contract->id;
            $data->deliveredBy   = $contract->deliveredBy;
            $data->deliveredDate = $contract->deliveredDate;

            $this->dao->insert(TABLE_DELIVERY)->data($data)->autoCheck()->exec();
        }

        return !dao::isError();
    }

    /**
     * Add search priv when upgrade 1.5.beta.
     * 
     * @access public
     * @return bool
     */
    public function addSearchPriv()
    {
        $groups = $this->dao->select('id')->from(TABLE_GROUP)->fetchAll('id');
        foreach($groups as $group)
        {
            $priv = new stdclass();
            $priv->group  = $group->id;
            $priv->module = 'search';
            $priv->method = 'buildForm';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'buildQuery';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'saveQuery';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'deleteQuery';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();
        }

        return !dao::isError();
    }

    /**
     * Safe drop columns.
     * 
     * @param string $table 
     * @param string $columns 
     * @access public
     * @return bool
     */
    public function safeDropColumns($table, $columns)
    {
        if($columns == '') return false;

        $fieldsOBJ = $this->dao->query('desc ' . TABLE_PROJECT);
        while($field = $fieldsOBJ->fetch())
        {
            $fields[$field->Field] = $field->Field;
        }

        $columns = explode(',', $columns);
        foreach($columns as $column)
        {
            if($column == '') continue;
            if(isset($fields[$column]))
            {
                $this->dao->query("ALTER TABLE $table DROP $column;");
            }
        }

        return true;
    }

    /**
     * Add app priv when upgrade from 1.6.
     * 
     * @access public
     * @return bool
     */
    public function addPrivs()
    {
        $groups = $this->dao->select('id')->from(TABLE_GROUP)->fetchAll('id');

        foreach($groups as $group)
        {
            if($group->id == 1)
            {
                $privs = array('balance', 'depositor', 'order', 'product', 'project', 'schema', 'setting', 'task', 'trade');

                $modules['balance']   = array('browse', 'create', 'delete', 'edit');
                $modules['depositor'] = array('activate', 'browse', 'check', 'create', 'delete', 'edit', 'forbid', 'savebalance');
                $modules['order']     = array('delete');
                $modules['product']   = array('view');
                $modules['project']   = array('activate', 'suspend');
                $modules['schema']    = array('browse', 'create', 'delete', 'edit', 'view');
                $modules['setting']   = array('lang', 'reset');
                $modules['task']      = array('kanban', 'outline', 'start');
                $modules['trade']     = array('batchCreate', 'batchEdit', 'browse', 'create', 'delete', 'detail', 'edit', 'import', 'showimport', 'transfer');

                foreach($privs as $module)
                {
                    $priv = new stdclass();
                    $priv->group  = 1;
                    $priv->module = $module;

                    foreach($modules[$module] as $method)
                    {
                        $priv->method = $method;
                        $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();
                    }
                }
            }

            if($group->id == 2)
            {
                $priv = new stdclass();
                $priv->group  = 2;
                $priv->module = 'depositor';
                $priv->method = 'delete';
                $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

                $priv->method = 'savabalance';
                $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();
            }

            if($group->id == 3)
            {
                $priv = new stdclass();
                $priv->group  = 3;
                $priv->module = 'project';

                $methods = array('activate', 'finish', 'index', 'suspend');
                foreach($methods as $method)
                {
                    $priv->method = $method;
                    $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();
                }
            }

            $priv = new stdclass();
            $priv->group  = $group->id;
            $priv->module = 'apppriv';
            $priv->method = 'crm';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'cash';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'oa';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();

            $priv->method = 'team';
            $this->dao->replace('`sys_groupPriv`')->data($priv)->exec();
        }

        return !dao::isError();
    }

    /**
     * To lower table.
     * 
     * @access public
     * @return bool
     */
    public function toLowerTable()
    {
        $results    = $this->dbh->query("show Variables like '%table_names'")->fetchAll();
        $hasLowered = false;
        foreach($results as $result)
        {
            if(strtolower($result->Variable_name) == 'lower_case_table_names' and $result->Value == 1)
            {
                $hasLowered = true;
                break;
            }
        }
        if($hasLowered) return true;

        $tables2Rename = $this->config->upgrade->lowerTables;
        if(!isset($tables2Rename)) return false;

        $tablesExists = $this->dbh->query('SHOW TABLES')->fetchAll();
        foreach($tablesExists as $key => $table) $tablesExists[$key] = current((array)$table);
        $tablesExists = array_flip($tablesExists);

        foreach($tables2Rename as $oldTable => $newTable)
        {
            if(!isset($tablesExists[$oldTable])) continue;
            
            $upgradebak = $newTable . '_othertablebak';
            if(isset($tablesExists[$upgradebak])) $this->dbh->query("DROP TABLE `$upgradebak`");
            if(isset($tablesExists[$newTable])) $this->dbh->query("RENAME TABLE `$newTable` TO `$upgradebak`");

            $tempTable = $oldTable . '_ranzhitmp';
            $this->dbh->query("RENAME TABLE `$oldTable` TO `$tempTable`");
            $this->dbh->query("RENAME TABLE `$tempTable` TO `$newTable`");
        }

        return true;
    }

    /**
     * Update app orders.
     * 
     * @access public
     * @return bool
     */
    public function updateAppOrder()
    {
        $entries = $this->dao->select('*')->from(TABLE_ENTRY)->orderBy('`order`, id')->fetchAll();
        $order   = 10;
        foreach($entries as $entry)
        {
            $this->dao->update(TABLE_ENTRY)->set('`order`')->eq($order)->where('id')->eq($entry->id)->exec();
            $order += 10;
        }
        return !dao::isError();
    }

    /**
     * Set assignedTo is closed if the task is closed when upgrade from 2.0.
     * 
     * @access public
     * @return bool
     */
    public function fixClosedTask()
    {
        $this->dao->update(TABLE_TASK)->set('assignedTo')->eq('closed')->where('status')->eq('closed')->exec();

        return !dao::isError();
    }

    /**
     * Set default salesGroup when upgrade from 2.0.
     * 
     * @access public
     * @return bool
     */
    public function setSalesGroup()
    {
        $sales = $this->dao->select('DISTINCT createdBy')->from(TABLE_CUSTOMER)->fetchPairs();

        $manageAllUsers = $this->dao->select('t1.account, t1.group, t2.group, t2.method')
            ->from(TABLE_USERGROUP)->alias('t1')
            ->leftJoin(TABLE_GROUPPRIV)->alias('t2')->on('t1.group=t2.group')
            ->where('t2.method')->eq('manageAll')
            ->fetchAll();

        if(!empty($manageAllUsers))
        {
            foreach($manageAllUsers as $manageAllUser)
            {
                if(isset($sales[$manageAllUser->account])) continue;
                $sales[$manageAllUser->account] = $manageAllUser->account;
            }
        }

        $users = ',' . implode(',', $sales) . ',';

        $group = new stdclass(); 
        $group->name  = '销售人员';
        $group->desc  = '';
        $group->users = $users;

        $this->dao->insert(TABLE_SALESGROUP)->data($group)->exec();

        $groupID = $this->dao->lastInsertID();

        if(!empty($manageAllUsers))
        {
            foreach($manageAllUsers as $manageAllUser)
            {
                $data['salesgroup'] = $groupID;
                $data['account']    = $manageAllUser->account;
                $data['priv']       = 'view';
                $this->dao->insert(TABLE_SALESPRIV)->data($data)->exec();

                $data['priv'] = 'edit';
                $this->dao->insert(TABLE_SALESPRIV)->data($data)->exec();
            }
        }

        $this->dao->delete()->from(TABLE_GROUPPRIV)->where('method')->eq('manageAll')->exec();

        return !dao::isError();
    }

    /**
     * Format product for order when upgrade from 2.0.
     * 
     * @access public
     * @return bool
     */
    public function fixOrderProduct()
    {
        $orders = $this->dao->select('*')->from(TABLE_ORDER)->fetchAll();

        foreach($orders as $order) 
        {
            $this->dao->update(TABLE_ORDER)->set('product')->eq(',' . $order->product . ',')->where('id')->eq($order->id)->exec();
        }

        return !dao::isError();
    }

    /**
     * Process desc of trade when upgrade from 2.2.
     * 
     * @access public
     * @return bool
     */
    public function processTradeDesc()
    {
        $trades = $this->dao->select('id, `desc`')->from(TABLE_TRADE)->fetchPairs();

        foreach($trades as $id => $trade)
        {
            $desc = strip_tags(htmlspecialchars_decode($trade));
            $this->dao->update(TABLE_TRADE)->set('desc')->eq($desc)->where('id')->eq($id)->exec();
        }

        return !dao::isError();
    }

    /**
     * Process customer edited date when upgrade from 2.3.
     * 
     * @access public
     * @return bool
     */
    public function processCustomerEditedDate()
    {
        $customers = $this->dao->select('*')->from(TABLE_CUSTOMER)->fetchAll('id');
        foreach($customers as $customer)
        {
            $editedDate = $customer->editedDate;
            $this->app->loadLang('order', 'crm');
            $orders = $this->dao->select('*')->from(TABLE_ORDER)->where('customer')->eq($customer->id)->fetchAll('id');
            foreach($orders as $order) 
            {
                if(!empty($order) and strtotime($order->editedDate) > strtotime($editedDate))  $editedDate = $order->editedDate;
                if(!empty($order) and strtotime($order->createdDate) > strtotime($editedDate)) $editedDate = $order->createdDate;
            }

            $contracts = $this->dao->select('*')->from(TABLE_CONTRACT)->where('customer')->eq($customer->id)->fetchAll('id');
            foreach($contracts as $contract) 
            {
                if(!empty($contract) and strtotime($contract->editedDate) > strtotime($editedDate))  $editedDate = $contract->editedDate;
                if(!empty($contract) and strtotime($contract->createdDate) > strtotime($editedDate)) $editedDate = $contract->createdDate;
            }

            $this->app->loadLang('contact', 'crm');
            $this->app->loadModuleConfig('contact', 'crm');
            $contacts = $this->dao->select('*')->from(TABLE_CONTACT)->where('customer')->eq($customer->id)->fetchAll('id');
            foreach($contacts as $contact) 
            {
                if(!empty($contact) and strtotime($contact->editedDate) > strtotime($editedDate))  $editedDate = $contact->editedDate;
                if(!empty($contact) and strtotime($contact->createdDate) > strtotime($editedDate)) $editedDate = $contact->createdDate;
            }

            if($editedDate != $customer->editedDate) $this->dao->update(TABLE_CUSTOMER)->set('editedDate')->eq($editedDate)->where('id')->eq($customer->id)->exec();
        }
        return !dao::isError();
    }

    /**
     * Add attend holiday leave trip privilages. when upgrade from 2.4.
     * 
     * @access public
     * @return bool
     */
    public function addAttendPriv()
    {
        $groups = $this->dao->select('id')->from(TABLE_GROUP)->fetchAll('id');
        $privs = array();
        $privs['attend']['personal'] = 'personal';
        $privs['attend']['edit']     = 'edit';
        $privs['leave']['personal']  = 'personal';
        $privs['leave']['create']    = 'create';
        $privs['leave']['edit']      = 'edit';
        $privs['leave']['delete']    = 'delete';
        $privs['trip']['personal']   = 'personal';
        $privs['trip']['create']     = 'create';
        $privs['trip']['edit']       = 'edit';
        $privs['trip']['delete']     = 'delete';
        foreach($groups as $group)
        {
            $priv = new stdclass();
            $priv->group  = $group->id;
            foreach($privs as $module => $modulePriv)
            {
                $priv->module = $module;
                foreach($modulePriv as $method => $methodPriv)
                {
                    $priv->method = $method;
                    $this->dao->replace(TABLE_GROUPPRIV)->data($priv)->exec();
                }
            }
        }

        return !dao::isError();
    }

    /**
     * Process block type.
     * 
     * @access public
     * @return bool
     */
    public function processBlockType()
    {
        $blocksHasType = 'order,contract,customer,task,project,thread';
        $blocks = $this->dao->select('*')->from(TABLE_BLOCK)->where('block')->in($blocksHasType)->fetchAll();
        foreach($blocks as $block)
        {
            $block->params = json_decode($block->params);
            if($block->block == 'project')
            {
                if(!isset($block->params->status))
                {
                    $block->params->status = 'doing';
                    $params = helper::jsonEncode($block->params);
                    $this->dao->update(TABLE_BLOCK)->set('params')->eq($params)->where('id')->eq($block->id)->exec();
                }
            }
            else
            {
                if(!isset($block->params->type))
                {
                    if($block->block == 'order')    $block->params->type = 'assignedTo';
                    if($block->block == 'contract') $block->params->type = 'returnedBy';
                    if($block->block == 'customer') $block->params->type = 'today';
                    if($block->block == 'task')     $block->params->type = 'assignedTo';
                    if($block->block == 'thread')   $block->params->type = 'new';

                    $params = helper::jsonEncode($block->params);
                    $this->dao->update(TABLE_BLOCK)->set('params')->eq($params)->where('id')->eq($block->id)->exec();
                }
            }
        }

        return !dao::isError();
    }

    /**
     * Remove old todo module files. 
     * 
     * @access public
     * @return bool
     */
    public function removeOldTodoFile()
    {
        $dir = $this->app->getBasePath() . "app/oa/todo/";
        if(!file_exists($dir)) return true;
        return $this->app->loadClass('zfile')->removeDir($dir);
    }

    /**
     * Process status for contact when upgrade from 3.1.
     * 
     * @access public
     * @return bool
     */
    public function processStatusForContact()
    {
        $contactList = $this->dao->select('*')->from(TABLE_CONTACT)->fetchAll('id');
        foreach($contactList as $id => $contact)
        {
            $this->dao->update(TABLE_CONTACT)->set('status')->eq('normal')->where('id')->eq($id)->exec();
        }

        return !dao::isError();
    }

    /**
     * Update trade categories.
     * 
     * @access public
     * @return bool
     */
    public function updateTradeCategories() 
    {
        $this->app->loadLang('tree');

        $majorIncomeCategories = $this->dao->select('*')->from(TABLE_CATEGORY)
            ->where('major')->eq('1')
            ->andWhere('type')->eq('in')
            ->andWhere('grade')->eq('1')
            ->fetchAll();

        $majorExpenseCategories = $this->dao->select('*')->from(TABLE_CATEGORY)
            ->where('major')->eq('1')
            ->andWhere('type')->eq('out')
            ->andWhere('grade')->eq('1')
            ->fetchAll();

        $this->dao->update(TABLE_CATEGORY)->set('major')->eq(0)->where('type')->in('in,out')->andWhere('grade')->ne('1')->exec();

        foreach($this->lang->upgrade->majorList['3_5'] as $key => $major)
        {
            $data = new stdclass();
            $data->name  = $major;
            $data->major = $key;
            $data->type  = $key < 3 ? 'in' : 'out';
            $data->grade = '1';

            $this->dao->insert(TABLE_CATEGORY)->data($data)->exec();
            $newCategoryID = $this->dao->lastInsertID();
            $this->dao->update(TABLE_CATEGORY)->set('path')->eq(',' . $newCategoryID . ',')->where('id')->eq($newCategoryID)->exec();
            
            if($key == '1' or $key == '3')
            {
                $categories = $key == '1' ? $majorIncomeCategories : $majorExpenseCategories;
                foreach($categories as $category)
                {
                    $children = $this->dao->select('*')->from(TABLE_CATEGORY)->where('path')->like($category->path . '%')->fetchAll();
                    foreach($children as $child)
                    {
                        $path  = ',' . $newCategoryID . $child->path;
                        $grade = $child->grade + 1;
                        if($grade == 2) $this->dao->update(TABLE_CATEGORY)->set('major')->eq(0)->set('path')->eq($path)->set('grade')->eq($grade)->set('parent')->eq($newCategoryID)->where('id')->eq($child->id)->exec();
                        if($grade != 2) $this->dao->update(TABLE_CATEGORY)->set('major')->eq(0)->set('path')->eq($path)->set('grade')->eq($grade)->where('id')->eq($child->id)->exec();
                    }
                }
            }
        }

        return !dao::isError();
    }

    /**
     * Set system category.
     * 
     * @access public
     * @return bool
     */
    public function setSystemCategories()
    {
        $this->app->loadLang('tree');
        foreach($this->lang->upgrade->majorList['3_6'] as $key => $major)
        {
            if($key < 5) continue;

            $data = new stdclass();
            $data->name  = $major;
            $data->major = $key;
            $data->type  = $key == 5 ? 'in' : 'out';
            $data->grade = '1';

            $this->dao->insert(TABLE_CATEGORY)->data($data)->exec();
            $newCategoryID = $this->dao->lastInsertID();
            $this->dao->update(TABLE_CATEGORY)->set('path')->eq(',' . $newCategoryID . ',')->where('id')->eq($newCategoryID)->exec();

            if($key == 5) $this->dao->update(TABLE_TRADE)->set('category')->eq($newCategoryID)->where('category')->eq('profit')->exec();
            if($key == 6) $this->dao->update(TABLE_TRADE)->set('category')->eq($newCategoryID)->where('category')->eq('loss')->exec();
            if($key == 7) $this->dao->update(TABLE_TRADE)->set('category')->eq($newCategoryID)->where('category')->eq('fee')->exec();
        }

        return !dao::isError();
    }

    /**
     * Set sales admin privileges.
     * 
     * @access public
     * @return bool
     */
    public function setSalesAdminPrivileges()
    {
        $groups = $this->dao->select('`group`')->from(TABLE_GROUPPRIV)->where('module')->eq('sales')->andWhere('method')->eq('browse')->fetchPairs();
        $grouppriv = new stdclass();
        $grouppriv->module = 'sales';
        $grouppriv->method = 'admin';
        foreach($groups as $group)
        {
            $grouppriv->group = $group;
            $this->dao->insert(TABLE_GROUPPRIV)->data($grouppriv)->exec();
        }
        return !dao::isError();
    }

    /**
     * Set doc entry privileges when upgrade from 3.7.
     * 
     * @access public
     * @return bool
     */
    public function updateDocPrivileges()
    {
        $groups = $this->dao->select('`group`')->from(TABLE_GROUPPRIV)->where('module')->eq('doc')->fetchPairs();
        foreach($groups as $group)
        {
            $data = new stdclass();
            $data->group = $group;
            $data->module = 'apppriv';
            $data->method = 'doc';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();

            $data->module = 'doc';
            $data->method = 'index';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();

            $data->method = 'allLibs';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();

            $data->method = 'showFiles';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();

            $data->method = 'projectLibs';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();

            $data->method = 'sort';
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();
        }

        return !dao::isError();
    }

    /**
     * Move doc content to table oa_doccontent.
     * 
     * @access public
     * @return bool
     */
    public function moveDocContent()
    {
        $descDoc = $this->dao->query('DESC ' .  TABLE_DOC)->fetchAll();
        $processFields = 0;
        foreach($descDoc as $field)
        {
            if($field->Field == 'content' or $field->Field == 'digest' or $field->Field == 'url') $processFields ++; 
        }
        if($processFields < 3) return true;

        $this->dao->exec('TRUNCATE TABLE ' . TABLE_DOCCONTENT);
        $stmt = $this->dao->select('id,title,digest,content,url')->from(TABLE_DOC)->query();
        $fileGroups = $this->dao->select('id,objectID')->from(TABLE_FILE)->where('objectType')->eq('doc')->fetchGroup('objectID', 'id');
        while($doc = $stmt->fetch())
        {
            $url = empty($doc->url) ? '' : urldecode($doc->url);
            $docContent = new stdclass();
            $docContent->doc      = $doc->id;
            $docContent->title    = $doc->title;
            $docContent->digest   = $doc->digest;
            $docContent->content  = $doc->content;
            $docContent->content .= empty($url) ? '' : $url;
            $docContent->version  = 1;
            $docContent->type     = 'html';
            if(isset($fileGroups[$doc->id])) $docContent->files = join(',', array_keys($fileGroups[$doc->id]));
            $this->dao->insert(TABLE_DOCCONTENT)->data($docContent)->exec();
        }
        $this->dao->exec('ALTER TABLE ' . TABLE_DOC . ' DROP `digest`');
        $this->dao->exec('ALTER TABLE ' . TABLE_DOC . ' DROP `content`');
        $this->dao->exec('ALTER TABLE ' . TABLE_DOC . ' DROP `url`');
        return true;
    }

    /**
     * Add project default doc.
     * 
     * @access public
     * @return bool
     */
    public function addProjectDoc()
    {
        set_time_limit(0);
        $this->app->loadLang('doc', 'doc');

        $allProjectIdList  = $this->dao->select('id,name,whitelist')->from(TABLE_PROJECT)->where('deleted')->eq('0')->fetchAll('id');
        foreach($allProjectIdList as $projectID => $project)
        {
            $this->dao->delete()->from(TABLE_DOCLIB)->where('project')->eq($projectID)->exec();

            $lib = new stdclass();
            $lib->project = $projectID;
            $lib->name    = $this->lang->doc->projectMainLib;
            $lib->main    = 1;
            $lib->private = 0;
            $lib->createdDate = helper::now();

            $teams = $this->dao->select('account')->from(TABLE_TEAM)->where('type')->eq('project')->andWhere('id')->eq($projectID)->fetchPairs('account', 'account');
            $lib->users = join(',', $teams);
            $lib->groups = isset($project->whitelist) ? $project->whitelist : '';
            $this->dao->insert(TABLE_DOCLIB)->data($lib)->exec();
        }

        return !dao::isError();
    }

    /**
     * Add privilege of proj app when upgrade from 4.0.
     * 
     * @access public
     * @return bool
     */
    public function addProjPrivilege()
    {
        $groups = $this->dao->select('*')->from(TABLE_GROUP)->fetchAll();

        $data = new stdclass();
        $data->module = 'apppriv';
        $data->method = 'proj';

        foreach($groups as $group)
        {
            $data->group = $group->id;
            $this->dao->replace(TABLE_GROUPPRIV)->data($data)->exec();
        }

        return !dao::isError();
    }

    /**
     * Update makeup actions. 
     * 
     * @access public
     * @return bool
     */
    public function updateMakeupActions()
    {
        $makeupList = $this->dao->select('id')->from(TABLE_OVERTIME)->where('type')->eq('compensate')->fetchPairs();

        $this->dao->update(TABLE_ACTION)->set('objectType')->eq('makeup')->where('objectType')->eq('overtime')->andWhere('objectID')->in($makeupList)->exec();

        return !dao::isError();
    }

    /**
     * Process addresses of contracts. 
     * 
     * @access public
     * @return bool
     */
    public function processContractAddress()
    {
        $address = new stdclass();
        $address->objectType = 'customer';
    
        $this->app->loadLang('contract', 'crm');
        $contracts = $this->dao->select('*')->from(TABLE_CONTRACT)->where('address')->ne('')->fetchAll();
        foreach($contracts as $contract)
        {
            $address->objectID = $contract->customer;
            $address->title    = $this->lang->contract->address;
            $address->location = $contract->address;

            $this->dao->insert(TABLE_ADDRESS)->data($address)->exec();
            $addressID = $this->dao->lastInsertId();

            $this->dao->update(TABLE_CONTRACT)->set('address')->eq($addressID)->where('id')->eq($contract->id)->exec();
        }
        return !dao::isError();
    }

    /**
     * Rename category to lastCategory for trade settings when upgrade from 4.5.
     * 
     * @access public
     * @return bool
     */
    public function renameLastCategory()
    {
        if(isset($this->config->cash->trade->settings->category))
        {
            $this->dao->update(TABLE_CONFIG)->set('`key`')->eq('lastCategory')
                ->where('app')->eq('cash')
                ->andWhere('module')->eq('trade')
                ->andWhere('section')->eq('settings')
                ->andWhere('`key`')->eq('category')
                ->exec();

            return !dao::isError();
        }

        return true;
    }

    /**
     * Upgrade product line function.
     * 
     * @access public
     * @return bool
     */
    public function upgradeProductLine()
    {
        $fields = $this->dao->query('DESC ' .  TABLE_PRODUCT)->fetchAll();
        $hasCategory = false;
        foreach($fields as $field)
        {
            if($field->Field == 'category') 
            {
                $hasCategory = true;
                break;
            }
        }

        if(!$hasCategory) $this->dbh->exec("ALTER TABLE " . TABLE_PRODUCT  . " CHANGE `line` `category` mediumint(8) UNSIGNED NOT NULL DEFAULT 0 AFTER `id`");

        return true;
    }

    /**
     * Process dating;
     *
     * @access public
     * @return bool
     */
    public function processDating()
    {
        /* Process order's next contact. */
        $orders = $this->dao->select('id, nextDate')->from(TABLE_ORDER)
            ->where('deleted')->eq('0')
            ->andWhere('nextDate')->ne('0000-00-00')
            ->fetchPairs();

        $actions = $this->dao->select('id, objectID, contact, actor, date')->from(TABLE_ACTION)
            ->where('objectType')->eq('order')
            ->andWhere('objectID')->in(array_keys($orders))
            ->andWhere('action')->eq('record')
            ->andWhere('contact')->ne(0)
            ->orderBy('id_desc')
            ->fetchGroup('objectID');

        $dating = new stdclass();
        $dating->objectType = 'order';
        foreach($orders as $order => $nextDate)
        {
            if(!isset($actions[$order])) continue;

            $action = reset($actions[$order]);

            $dating->objectID    = $order;
            $dating->action      = $action->id;
            $dating->contact     = $action->contact;
            $dating->account     = $action->actor;
            $dating->date        = $nextDate;
            $dating->createdBy   = $action->actor;
            $dating->createdDate = $action->date;

            $this->dao->insert(TABLE_DATING)->data($dating)->autoCheck()->exec();
        }

        /* Process contract's next contact. */
        $contracts = $this->dao->select('id, nextDate')->from(TABLE_CONTRACT)
            ->where('deleted')->eq('0')
            ->andWhere('nextDate')->ne('0000-00-00')
            ->fetchPairs();

        $actions = $this->dao->select('id, objectID, contact, actor, date')->from(TABLE_ACTION)
            ->where('objectType')->eq('contract')
            ->andWhere('objectID')->in(array_keys($contracts))
            ->andWhere('action')->eq('record')
            ->andWhere('contact')->ne(0)
            ->orderBy('id_desc')
            ->fetchGroup('objectID');

        $dating = new stdclass();
        $dating->objectType = 'contract';
        foreach($contracts as $contract => $nextDate)
        {
            if(!isset($actions[$contract])) continue;

            $action = reset($actions[$contract]);

            $dating->objectID    = $contract;
            $dating->action      = $action->id;
            $dating->contact     = $action->contact;
            $dating->account     = $action->actor;
            $dating->date        = $nextDate;
            $dating->createdBy   = $action->actor;
            $dating->createdDate = $action->date;

            $this->dao->insert(TABLE_DATING)->data($dating)->autoCheck()->exec();
        }

        /* Process customer's next contact. */
        $customers = $this->dao->select('id, nextDate')->from(TABLE_CUSTOMER)
            ->where('deleted')->eq('0')
            ->andWhere('nextDate')->ne('0000-00-00')
            ->fetchPairs();

        $actions = $this->dao->select('id, customer, contact, actor, date')->from(TABLE_ACTION)
            ->where('objectType')->in('order, contract, customer')
            ->andWhere('customer')->in(array_keys($customers))
            ->andWhere('action')->eq('record')
            ->andWhere('contact')->ne(0)
            ->orderBy('customer,id_desc')
            ->fetchGroup('customer');

        $dating = new stdclass();
        $dating->objectType = 'customer';
        foreach($customers as $customer => $nextDate)
        {
            if(!isset($actions[$customer])) continue;

            $action = reset($actions[$customer]);

            $dating->objectID    = $customer;
            $dating->action      = $action->id;
            $dating->contact     = $action->contact;
            $dating->account     = $action->actor;
            $dating->date        = $nextDate;
            $dating->createdBy   = $action->actor;
            $dating->createdDate = $action->date;

            $this->dao->insert(TABLE_DATING)->data($dating)->autoCheck()->exec();
        }

        /* Process contact's next contact. */
        $contacts = $this->dao->select('id, nextDate')->from(TABLE_CONTACT)
            ->where('deleted')->eq('0')
            ->andWhere('nextDate')->ne('0000-00-00')
            ->fetchPairs();

        $actions = $this->dao->select('id, objectID, contact, actor, date')->from(TABLE_ACTION)
            ->where('objectType')->eq('contact')
            ->andWhere('objectID')->in(array_keys($contacts))
            ->andWhere('action')->eq('record')
            ->andWhere('contact')->ne(0)
            ->orderBy('id_desc')
            ->fetchGroup('objectID');

        $dating = new stdclass();
        $dating->objectType = 'contact';
        foreach($contacts as $contact => $nextDate)
        {
            if(!isset($actions[$contact])) continue;

            $action = reset($actions[$contact]);

            $dating->objectID    = $contact;
            $dating->action      = $action->id;
            $dating->contact     = $action->contact;
            $dating->account     = $action->actor;
            $dating->date        = $nextDate;
            $dating->createdBy   = $action->actor;
            $dating->createdDate = $action->date;

            $this->dao->insert(TABLE_DATING)->data($dating)->autoCheck()->exec();
        }

        return !dao::isError();
    }

    /**
     * Update contract product.
     *
     * @access public
     * @return bool
     */
    public function updateContractProduct()
    {
        $orders         = array();
        $contracts      = array();
        $contractOrders = $this->dao->select('*')->from(TABLE_CONTRACTORDER)->where('contract')->ne(0)->andWhere('`order`')->ne(0)->fetchAll();
        foreach($contractOrders as $contractOrder)
        {
            $orders[$contractOrder->order] = $contractOrder->order;
            $contracts[$contractOrder->contract][$contractOrder->order] = $contractOrder->order;
        }

        $orders = $this->dao->select('id, product')->from(TABLE_ORDER)->where('id')->in($orders)->fetchAll('id');
        foreach($orders as $order) $order->product = explode(',', trim($order->product, ','));

        foreach($contracts as $contract => $contractOrders)
        {
            $product = array();
            foreach($contractOrders as $orderID)
            {
                if(!isset($orders[$orderID])) continue;

                $order   = $orders[$orderID];
                $product = array_merge($product, $order->product);
            }

            if($product)
            {
                $product = ',' . implode(',', $product) . ',';
                $this->dao->update(TABLE_CONTRACT)->set('product')->eq($product)->where('id')->eq($contract)->exec();
            }
        }

        return !dao::isError();
    }

    /**
     * Process team.
     *
     * @access public
     * @return bool
     */
    public function processTeam()
    {
        $hasContribution = false;
        $fields = $this->dbh->query('DESC ' . TABLE_TEAM)->fetchAll();
        foreach($fields as $field)
        {
            if($field->Field == 'contribution') return true;
        }

        try
        {
            $this->dbh->exec('ALTER TABLE ' . TABLE_TEAM . ' CHANGE `rate` `contribution` decimal(6, 2) NOT NULL');
        }
        catch (PDOException $e)
        {
            return false;
        }

        return true;
    }

    /**
     * Process contract handlers to team.
     *
     * @access public
     * @return bool
     */
    public function processContractHandlers()
    {
        $teamContracts = $this->dao->select('DISTINCT id')->from(TABLE_TEAM)->where('type')->eq('contract')->fetchPairs();
        $contracts     = $this->dao->select('*')->from(TABLE_CONTRACT)
            ->where('handlers')->ne('')
            ->andWhere('id')->notin($teamContracts)
            ->fetchAll();
        foreach($contracts as $contract)
        {
            $member = new stdclass();
            $member->type = 'contract';
            $member->id   = $contract->id;

            $handlers = explode(',', trim($contract->handlers, ','));
            if(count($handlers) == 1) $member->contribution = 100;

            foreach($handlers as $account)
            {
                $member->account = $account;

                $this->dao->insert(TABLE_TEAM)->data($member)->autoCheck()->exec();
            }
        }

        return !dao::isError();
    }
}
