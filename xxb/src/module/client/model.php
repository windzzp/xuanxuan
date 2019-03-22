<?php
/**
 * The model file of client module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Gang Liu <liugang@cnezsoft.com>
 * @package     client
 * @version     $Id$
 * @link        http://www.ranzhi.org
 */
class clientModel extends model
{
    /**
     * Get a client by id.
     *
     * @param  int    $clientID
     * @access public
     * @return object
     */
    public function getByID($clientID)
    {
        $client = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('id')->eq($clientID)->fetch();
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
     *
     * @access public
     * @return bool
     */
    public function create()
    {
        $client = fixer::input('post')
            ->add('createdBy', $this->app->user->account)
            ->add('createdDate', helper::now())
            ->get();

        if(empty($client->version)) dao::$errors['version'][] = sprintf($this->lang->error->notempty, $this->lang->client->version); 
        if($client->version && !preg_match("/^[0-9.]*$/", $client->version)) dao::$errors['version'][] = $this->lang->client->wrongVersion;
        foreach($client->downloads as $os => $url)
        {
            if(empty($url)) dao::$errors[$os][] = sprintf($this->lang->error->notempty, zget($this->lang->client->osList, $os) . $this->lang->client->download);
            if($url && !validater::checkURL($url)) dao::$errors[$os][] = sprintf($this->lang->error->URL, zget($this->lang->client->osList, $os) . $this->lang->client->download);
        }
        if(dao::isError()) return false;

        $client->downloads = helper::jsonEncode($client->downloads);
        $this->dao->insert(TABLE_IM_CLIENT)->data($client)->autoCheck()->exec();

        return !dao::isError();
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
            if(empty($url)) dao::$errors[$os][] = sprintf($this->lang->error->notempty, zget($this->lang->client->osList, $os) . $this->lang->client->download);
            if($url && !validater::checkURL($url)) dao::$errors[$os][] = sprintf($this->lang->error->URL, zget($this->lang->client->osList, $os) . $this->lang->client->download);
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
        $lastForce = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('strategy')->eq('force')->orderBy('id_desc')->limit(1)->fetch();
        if($lastForce && version_compare($version, $lastForce->version) == -1)
        {
            return $lastForce;
        }
        else
        {
            $last = $this->dao->select('*')->from(TABLE_IM_CLIENT)->where('strategy')->eq('optional')->orderBy('id_desc')->limit(1)->fetch();
            if($last && version_compare($version, $last->version) == -1)
            {
                return $last;
            }
        }
        return false;
    }
}
