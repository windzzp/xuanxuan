<?php
/**
 * The model file of client module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Gang Liu <liugang@cnezsoft.com>
 * @package     client
 * @version     $Id$
 * @link        http://xuan.im
 */
class clientModel extends model
{
    /**
     * Get a client by id.
     *
     * @param  int    $clientID
     * @access public
     * @return object | bool
     */
    public function getByID($clientID)
    {
        $client = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('id')->eq($clientID)->fetch();
        if(empty($client)) return false;
        $client->downloads = json_decode($client->downloads, true);
        return $client;
    }

    /**
     * Get a client by version.
     *
     * @param  string $version
     * @access public
     * @return object | bool
     */
    public function getByVersion($version)
    {
        $client = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('version')->eq($version)->fetch();
        if(empty($client)) return false;
        $client->downloads = json_decode($client->downloads, true);
        return $client;
    }

    /**
     * Get client list.
     *
     * @access public
     * @return array
     */
    public function getList()
    {
        return $this->dao->select('*')->from(TABLE_IM_CLIENT)->orderBy('id_desc')->fetchAll();
    }

    /**
     * Create a client.
     * @param $version
     * @param $link
     * @param $os
     * @return bool
     */
    public function create($version, $link, $os)
    {
        $client = $this->getByVersion($version);
        if($client)
        {
            $downloads = json_decode($client->downloads, true);
            $downloads[$os] = $link;
            $client->editedBy   = $this->app->user->account;
            $client->editedDate = helper::now();
            $client->downloads  = helper::jsonEncode($downloads);
            return $this->dao->update(TABLE_IM_CLIENT)->data($client)->where('id')->eq($client->id)->exec();
        }
        else
        {
            $client = new stdClass();
            $client->status      = 'notRelease';
            $client->version     = $version;
            $client->strategy    = 'optional';
            $client->downloads   = helper::jsonEncode(array($os => $link));
            $client->createdBy   = $this->app->user->account;
            $client->createdDate = helper::now();
            return $this->dao->insert(TABLE_IM_CLIENT)->data($client)->autoCheck()->exec();
        }
    }

    /**
     * Update a client.
     *
     * @param  int    $clientID
     * @access public
     * @return bool
     */
    public function update($clientID)
    {
        $client = fixer::input('post')
            ->add('editedBy', $this->app->user->account)
            ->add('editedDate', helper::now())
            ->get();

        if(empty($client->version)) dao::$errors['version'][] = sprintf($this->lang->error->notempty, $this->lang->client->version); 
        if($client->version && !preg_match("/^[0-9.]*$/", $client->version)) dao::$errors['version'][] = $this->lang->client->wrongVersion;
        foreach($client->downloads as $os => $url)
        {
            if(empty($url)) dao::$errors[$os][] = sprintf($this->lang->error->notempty, zget($this->lang->client->zipList, $os) . $this->lang->client->download);
            if($url && !validater::checkURL($url)) dao::$errors[$os][] = sprintf($this->lang->error->URL, zget($this->lang->client->zipList, $os) . $this->lang->client->download);
        }
        if(dao::isError()) return false;

        $client->downloads = helper::jsonEncode($client->downloads);
        $this->dao->update(TABLE_IM_CLIENT)->data($client)->autoCheck()->where('id')->eq($clientID)->exec();

        return !dao::isError();
    }

    /**
     * Check if a client need upgrade.
     *
     * @param  string $version
     * @access public
     * @return object | bool
     */
    public function checkUpgrade($version)
    {
        $lastForce = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('strategy')->eq('force')->andWhere('status')->eq('release')->orderBy('id_desc')->limit(1)->fetch();
        if($lastForce && version_compare($version, $lastForce->version) == -1)
        {
            return $lastForce;
        }
        else
        {
            $last = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('strategy')->eq('optional')->andWhere('status')->eq('release')->orderBy('id_desc')->limit(1)->fetch();
            if($last && version_compare($version, $last->version) == -1)
            {
                return $last;
            }
        }
        return false;
    }

    /**
     * Download zip package.
     * @param $version
     * @param $link
     * @return bool | string
     */
    public function downloadZipPackage($version, $link)
    {
        set_time_limit(0);
        if(empty($version) || empty($link)) return false;
        $dir  = "data/client/" . $version . '/';
        $file = basename($link);
        if(!is_dir($this->app->wwwRoot . $dir))
        {
            mkdir($this->app->wwwRoot . $dir, 0755, true);
        }
        if(!is_dir($this->app->wwwRoot . $dir)) return false;
        if(file_exists($this->app->wwwRoot . $dir . $file))
        {
            return commonModel::getSysURL() . $this->config->webRoot . $dir . $file;
        }
        ob_clean();
        ob_end_flush();

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$link);
        $fp =  fopen($this->app->wwwRoot . $dir . $file, 'w+');
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_exec ($ch);
        curl_close ($ch);
        fclose($fp);
        return commonModel::getSysURL() . $this->config->webRoot . $dir . $file;
        $local  = fopen($this->app->wwwRoot . $dir . $file, 'w');
        $remote = fopen($link, 'rb');
        if($remote === false) return false;
        $chunkSize = 256 * 1024;
        while(!feof($remote))
        {
            $buffer = fread($remote, $chunkSize);
            fwrite($local, $buffer);
            ob_flush();
            flush();
        }
        fclose($local);
        fclose($remote);
        return commonModel::getSysURL() . $this->config->webRoot . $dir . $file;
    }
}
