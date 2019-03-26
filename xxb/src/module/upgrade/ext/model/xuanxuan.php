<?php
/**
 * Get version of xuanxuan.
 *
 * @access public
 * @return string
 */
public function getXuanxuanVersion()
{
    return !empty($this->config->xuanxuan->global->version) ? $this->config->xuanxuan->global->version : '1.0';
}

/**
 * Upgrade xuanxuan.
 *
 * @param  string $fromVersion
 * @access public
 * @return void
 */
public function upgradeXuanxuan($fromVersion)
{
    switch($fromVersion)
    {
        case '1.0'   : $this->execSQL($this->getUpgradeFile('xuanxuan1.0'));
        case '1.1.0' :
        case '1.1.1' : $this->execSQL($this->getUpgradeFile('xuanxuan1.1.1'));
        case '1.3.0' : $this->execSQL($this->getUpgradeFile('xuanxuan1.3.0'));
        case '1.4.0' : $this->execSQL($this->getUpgradeFile('xuanxuan1.4.0'));
            $this->processMessageStatus();
        case '1.5.0' :
        case '1.6.0' : $this->execSQL($this->getUpgradeFile('xuanxuan1.6.0'));
        case '2.0.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.0.0'));
            $this->installSSOEntry();
        case '2.1.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.1.0'));
        case '2.2.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.2.0'));
            $this->processXuanxuanKey();
        case '2.3.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.3.0'));
        case '2.4.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.4.0'));
            $this->changeMessageStatusTable();
        case '2.5.0' : $this->execSQL($this->getUpgradeFile('xuanxuan2.5.0'));
        default : $this->loadModel('setting')->setItem('system.xuanxuan.global.version', $this->config->xuanxuan->version);
    }
}

/**
 * Process message status.
 *
 * @access public
 * @return bool
 */
public function processMessageStatus()
{
    $userMessages = array();
    $messagesList = $this->dao->select('*')->from($this->config->db->prefix . 'im_usermessage')->fetchAll();
    foreach($messagesList as $messages)
    {
        $user     = $messages->user;
        $messages = json_decode($messages->message);
        foreach($messages as $message)
        {
            if(isset($userMessages[$user][$message->gid])) continue;

            $data = new stdClass();
            $data->user   = $user;
            $data->gid    = $message->gid;
            $data->status = 'waiting';
            $this->dao->insert(TABLE_IM_MESSAGESTATUS)->data($data)->exec();

            $userMessages[$user][$message->gid] = $message->gid;
        }
    }

    return !dao::isError();
}

/**
 * Install sso entry.
 *
 * @access public
 * @return bool
 */
public function installSSOEntry()
{
    $file = new stdclass();
    $file->pathname    = '201810/f_8db2fa542a1e087d63d45d8bc1185361.zip';
    $file->title       = 'sso';
    $file->extension   = 'zip';
    $file->size        = 89674;
    $file->objectType  = 'entry';
    $file->objectID    = 0;
    $file->createdBy   = $this->app->user->account;
    $file->createdDate = helper::now();
    $file->public      = 1;
    $this->dao->insert(TABLE_FILE)->data($file)->exec();

    if(dao::isError()) return false;

    $fileID = $this->dao->lastInsertId();

    $entry = new stdclass();
    $entry->name        = 'sso';
    $entry->abbr        = 'sso';
    $entry->code        = 'sso';
    $entry->buildin     = 1;
    $entry->version     = '1.0.0';
    $entry->platform    = 'xuanxuan';
    $entry->package     = $fileID;
    $entry->integration = 1;
    $entry->open        = 'iframe';
    $entry->key         = '7a171c33d02d172fc0f1cf4cb93edfd6';
    $entry->ip          = '*';
    $entry->logo        = '';
    $entry->login       = 'http://xuan.im';
    $entry->control     = 'none';
    $entry->size        = 'max';
    $entry->position    = 'default';
    $entry->sso         = 1;

    $this->dao->insert(TABLE_ENTRY)->data($entry)->exec();

    $entryID = $this->dao->lastInsertId();

    $this->dao->update(TABLE_FILE)->set('objectID')->eq($entryID)->where('id')->eq($fileID)->exec();

    return !dao::isError();
}

/**
 * Process key of xuanxuan.
 *
 * @access public
 * @return bool
 */
public function processXuanxuanKey()
{
    $this->loadModel('setting')->setItem('system.common.xuanxuan.key', $this->config->xuanxuan->key);
    $this->setting->deleteItems('owner=system&module=xuanxuan&key=key');
    return !dao::isError();
}

/**
 * Fix the history and Change messagestatus table.
 * @return bool
 */
public function changeMessageStatusTable()
{
    $gids = $this->dao->select('gid')->from(TABLE_IM_MESSAGESTATUS)->where('status')->ne('sent')->fetchPairs('gid');
    if(!empty($gids))
    {
        $messages = $this->dao->select('gid, id')->from(TABLE_IM_MESSAGE)->where('gid')->in($gids)->fetchPairs();
        foreach($messages as $gid => $message)
        {
            $this->dao->update(TABLE_IM_MESSAGESTATUS)->set('message')->eq($message)->where('gid')->eq($gid)->exec();
        }
    }
    $this->dbh->exec('ALTER TABLE `' . TABLE_IM_MESSAGESTATUS . '` DROP INDEX `user`;');
    $this->dbh->exec('ALTER TABLE `' . TABLE_IM_MESSAGESTATUS . '` DROP `gid`;');
    $this->dbh->exec('ALTER TABLE `' . TABLE_IM_MESSAGESTATUS . '` ADD UNIQUE INDEX `user` (`user`, `message`);');
    $this->dao->delete()->from(TABLE_IM_MESSAGESTATUS)->where('status')->eq('sent')->exec();
    return !dao::isError();
}
