<?php
/**
 * The model file of install module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     install 
 * @version     $Id: model.php 4029 2016-08-26 06:50:41Z liugang $
 * @link        http://www.ranzhi.org
 */
?>
<?php
class installModel extends model
{
    /**
     * Get the php version.
     * 
     * @access public
     * @return string
     */
    public function getPhpVersion()
    {
        return PHP_VERSION;
    }

    /**
     * Check php version.
     * 
     * @access public
     * @return bool
     */
    public function checkPHP()
    {
        return $result = version_compare(PHP_VERSION, '5.2.0') >= 0 ? 'ok' : 'fail';
    }

    /**
     * Check pdo extension.
     * 
     * @access public
     * @return bool
     */
    public function checkPDO()
    {
        return $result = extension_loaded('pdo') ? 'ok' : 'fail';
    }

    /**
     * Check pdo_mysql extension.
     * 
     * @access public
     * @return bool
     */
    public function checkPDOMySQL()
    {
        return $result = extension_loaded('pdo_mysql') ? 'ok' : 'fail';
    }

    /**
     * Get the temp root.
     * 
     * @access public
     * @return array
     */
    public function getTmpRoot()
    {
        $result['path']    = $this->app->getTmpRoot();
        $result['exists']  = is_dir($result['path']);
        $result['writable']= is_writable($result['path']);
        return $result;
    }

    /**
     * Check the temp root.
     * 
     * @access public
     * @return array
     */
    public function checkTmpRoot()
    {
        $tmpRoot = $this->app->getTmpRoot();

        $pathArray = $this->getDir($tmpRoot);
        if(is_dir($tmpRoot)) $pathArray[] = $tmpRoot;

        $pathResult = array();
        foreach($pathArray as $path)
        {
            if(!is_writable($path)) $pathResult[] = $path;
        }

        return $pathResult;
    }

    /**
     * Get the temp subdirectory. 
     * 
     * @param  string $dir 
     * @access public
     * @return array
     */
    public function getDir($dir)
    {
        static $arr = array();
        if(is_dir($dir))
        {
            $hadle = @opendir($dir);
            while($file = readdir($hadle))
            {
                if(!in_array($file, array('.', '..')))
                {
                    $dirr = $dir . $file . "/";
                    if(is_dir($dirr))
                    {
                        array_push($arr, $dirr);
                        $this->getDir($dirr);
                    }
                }
            }
        }

        return $arr;
    }

    /**
     * Check the session root.
     * 
     * @access public
     * @return bool
     */
    public function checkSessionRoot()
    {
        $sessionRoot = session_save_path();
        return $result = is_writable($sessionRoot) ? 'ok' : 'fail';
    }

    /**
     * Get the data root.
     * 
     * @access public
     * @return array
     */
    public function getDataRoot()
    {
        $result['path']    = $this->app->getDataRoot();
        $result['exists']  = is_dir($result['path']);
        $result['writable']= is_writable($result['path']);
        return $result;
    }

    /**
     * Check the data root.
     * 
     * @access public
     * @return bool
     */
    public function checkDataRoot()
    {
        $dataRoot = $this->app->getDataRoot();
        return $result = (is_dir($dataRoot) and is_writable($dataRoot)) ? 'ok' : 'fail';
    }

    /**
     * Get the ini file info.
     * 
     * @access public
     * @return string
     */
    public function getIniInfo()
    {
        $iniInfo = '';
        ob_start();
        phpinfo(1);
        $lines = explode("\n", strip_tags(ob_get_contents()));
        ob_end_clean();
        foreach($lines as $line) if(strpos($line, 'ini') !== false) $iniInfo .= $line . "\n";
        return $iniInfo;
    }

    /**
     * Check the user config.
     * 
     * @access public
     * @return object
     */
    public function checkConfig()
    {
        $return = new stdclass();
        $return->result = 'ok';

        /* Connect db. */
        $this->setDBParam();

        if(strpos($this->config->db->name, '.') !== false)
        {
            $return->result = 'fail';
            $return->error  = $this->lang->install->errorDBName;
            return $return;
        }

        $this->dbh = $this->connectDB();
        if(!is_object($this->dbh))
        {
            $return->result = 'fail';
            $return->error  = $this->lang->install->errorConnectDB . $this->dbh;
            return $return;
        }

        /* Get the mysql version. */
        $version = $this->getMysqlVersion();

        /* If the db don't exists, try create it. */
        if(!$this->dbExists())
        {
            if(!$this->createDB($version))
            {
                $dbhError = $this->dbh->errorInfo();

                $return->result = 'fail';
                $return->error  = $this->lang->install->errorCreateDB . $dbhError[2];
                return $return;
            }
        }
        elseif($this->post->clearDB == false)
        {
            $return->result = 'fail';
            $return->error  = $this->lang->install->errorDBExists;
            return $return;
        }

        /* Create the tables. */
        if(!$this->createTable($version))
        {
            $return->result = 'fail';
            $return->error  = $this->lang->install->errorCreateTable;
            return $return;
        }

        return $return;
    }

    /**
     * Set the database param.
     * 
     * @access public
     * @return void
     */
    public function setDBParam()
    {
        $this->config->db->host     = $this->post->dbHost;
        $this->config->db->name     = $this->post->dbName;
        $this->config->db->user     = $this->post->dbUser;
        $this->config->db->password = $this->post->dbPassword;
        $this->config->db->port     = $this->post->dbPort;
        $this->config->db->prefix   = $this->post->dbPrefix;
    }

    /**
     * Connect to db.
     * 
     * @access public
     * @return object
     */
    public function connectDB()
    {
        $dsn = "mysql:host={$this->config->db->host}; port={$this->config->db->port};";
        try 
        {
            $dbh = new PDO($dsn, $this->config->db->user, $this->config->db->password);
            $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $dbh->exec("SET NAMES {$this->config->db->encoding}");
            $dbh->exec("SET @@sql_mode= ''");
            return $dbh;
        }
        catch (PDOException $exception)
        {
            return $exception->getMessage();
        }
    }

    /**
     * Check the database exits or not.
     * 
     * @access public
     * @return bool
     */
    public function dbExists()
    {
        $sql = "SHOW DATABASES like '{$this->config->db->name}'";
        return $this->dbh->query($sql)->fetch();
    }

    /**
     * Get the mysql version.
     * 
     * @access public
     * @return string
     */
    public function getMysqlVersion()
    {
        $sql = "SELECT VERSION() AS version";
        $result = $this->dbh->query($sql)->fetch();
        return substr($result->version, 0, 3);
    }

    /**
     * Create database.
     * 
     * @param  string $version 
     * @access public
     * @return bool
     */
    public function createDB($version)
    {
        $sql = "CREATE DATABASE `{$this->config->db->name}`";
        if($version > 4.1) $sql .= " DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci";
        try 
        {
            return $this->dbh->query($sql);
        }
        catch(PDOException $exception)
        {
            return false;
        }
    }

    /**
     * Create tables.
     * 
     * @param  string $version 
     * @access public
     * @return bool
     */
    public function createTable($version)
    {
        $dbFile  = $this->app->getBasePath() . 'db' . DS . 'xxb.sql';
        $tables  = explode(";\n", file_get_contents($dbFile));
        $dbFile  = $this->app->getBasePath() . 'db' . DS . 'xuanxuan.sql';
        $tables += explode(";\n", file_get_contents($dbFile));
        foreach($tables as $table)
        {
            $table = trim($table);
            if(empty($table)) continue;

            if(strpos($table, 'DROP') !== false and $this->post->clearDB != false)
            {
                $table = str_replace('--', '', $table);
            }
            $table = str_replace('xxb_', $this->config->db->prefix, $table);

            if(!$this->dbh->query($table)) return false;
        }
        return true;
    }

    /**
     * Create content of my.php from the post form.
     * 
     * @access public
     * @return string
     */
    public function getConfigContent()
    {
        return <<<EOT
<?php
\$config->installed    = true;
\$config->debug        = false;
\$config->requestType  = '{$this->post->requestType}';
\$config->db->host     = '{$this->post->dbHost}';
\$config->db->port     = '{$this->post->dbPort}';
\$config->db->name     = '{$this->post->dbName}';
\$config->db->user     = '{$this->post->dbUser}';
\$config->db->password = '{$this->post->dbPassword}';
\$config->db->prefix   = '{$this->post->dbPrefix}';
EOT;
    }

    /**
     * Save my.php config file.
     * 
     * @access public
     * @return object
     */
    public function saveMyPHP()
    {
        $configRoot    = $this->app->getConfigRoot();
        $configContent = $this->getConfigContent();

        $return = new stdclass();
        $return->myPHP   = $this->app->getConfigRoot() . 'my.php';
        $return->saved   = is_writable($configRoot) && file_put_contents($return->myPHP, $configContent);
        $return->content = $configContent;

        return $return;
    }

    /**
     * Create a site and it's admin account.
     * 
     * @access public
     * @return void
     */
    public function createAdmin()
    {
        $admin = new stdclass();
        $admin->account   = $this->post->account;
        $admin->realname  = $this->post->account;
        $admin->password  = $this->loadModel('user')->createPassword($this->post->password, $admin->account);
        $admin->password1 = $this->post->password; 
        $admin->admin     = 'super';
        $admin->join      = helper::now();
        $this->lang->user->password1 = $this->lang->user->password;
        $this->dao->insert(TABLE_USER)->data($admin, $skip = 'password1')->autoCheck()->batchCheck('account,password1', 'notempty')->check('account', 'account')->exec();

        if(dao::isError()) return false;

        /* Update cron remark by lang. */
        foreach($this->lang->install->cronList as $id => $remark)
        {
            $this->dao->update(TABLE_CRON)->set('remark')->eq($remark)->where('id')->eq($id)->exec();
        }

        /* Update group name and desc on dafault lang. */
        $groups = $this->dao->select('*')->from(TABLE_GROUP)->orderBy('id')->fetchAll();
        foreach($groups as $group)
        {
            $data = zget($this->lang->install->groupList, $group->id, '');
            if($data) $this->dao->update(TABLE_GROUP)->data($data)->where('id')->eq($group->id)->exec();
        }

        return !dao::isError();
    }
}
