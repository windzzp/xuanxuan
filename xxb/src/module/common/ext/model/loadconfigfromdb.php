<?php
/**
 * Upgrade to 2.5.1 rename table.
 */
public function loadConfigFromDB()
{
    if(version_compare($this->config->version, '2.5.1', '<='))
    {
        $prefix = $this->config->db->prefix;
        $row    = $this->dbh->query("show tables like '{$prefix}sys_config'")->fetch();
        if(!empty($row))
        {
            $ssoTable = $this->dbh->query("show tables like '{$prefix}sys_sso'")->fetch();
            $this->dbh->query("RENAME TABLE `{$prefix}sys_action` TO `{$prefix}action`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_block` TO `{$prefix}block`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_category` TO `{$prefix}category`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_config` TO `{$prefix}config`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_entry` TO `{$prefix}entry`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_file` TO `{$prefix}file`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_group` TO `{$prefix}group`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_grouppriv` TO `{$prefix}grouppriv`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_history` TO `{$prefix}history`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_lang` TO `{$prefix}lang`");
            if(!empty($ssoTable)) $this->dbh->query("RENAME TABLE `{$prefix}sys_sso` TO `{$prefix}sso`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_user` TO `{$prefix}user`");
            $this->dbh->query("RENAME TABLE `{$prefix}sys_usergroup` TO `{$prefix}usergroup`");
            $this->dbh->query("DROP TABLE IF EXISTS `{$prefix}sys_package`");
            $this->dbh->query("DROP TABLE IF EXISTS `{$prefix}oa_attend`");
            $this->dbh->query("DROP TABLE IF EXISTS `{$prefix}oa_holiday`");
            $this->dbh->query("DROP TABLE IF EXISTS `{$prefix}oa_leave`");
            $this->dbh->query("DROP TABLE IF EXISTS `{$prefix}oa_lieu`");
        }
    }
    parent::loadConfigFromDB();
}
