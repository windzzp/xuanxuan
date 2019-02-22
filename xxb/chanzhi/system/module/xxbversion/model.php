<?php
/**
 * The model file of xxbversion module of chanzhiEPS.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPLV1.2 (http://zpl.pub/page/zplv12.html)
 * @author      Memory <lvtao@cnezsoft.com>
 * @package     wechat
 * @version     $Id$
 * @link        http://www.chanzhi.org
 */
class xxbversionModel extends model
{
    public function getAll($pager = null, $orderBy = 'id_desc')
    {
        return $this->dao->setAutoLang(false)->select('*')->from(TABLE_XXB_VERSION)
                   ->orderBy($orderBy)
                   ->beginIf($pager)->page($pager)->fi()
                   ->fetchAll('id');
    }
    
    public function getByID($id)
    {
        return $this->dao->setAutoLang(false)->select('*')->from(TABLE_XXB_VERSION)->where('id')->eq($id)->fetch();
    }
    
    public function create()
    {
        $version = fixer::input('post')->get();
        $version->xxcDownload = json_encode($version->xxcDownload);
        $version->xxbDownload = json_encode($version->xxbDownload);
        $version->xxdDownload = json_encode($version->xxdDownload);
        $this->dao->setAutoLang(false)->insert(TABLE_XXB_VERSION)->data($version)->exec();
        return !dao::isError();
    }

    public function edit($id)
    {
        $version = fixer::input('post')->get();
        $version->xxcDownload = json_encode($version->xxcDownload);
        $version->xxbDownload = json_encode($version->xxbDownload);
        $version->xxdDownload = json_encode($version->xxdDownload);
        $this->dao->setAutoLang(false)->update(TABLE_XXB_VERSION)->data($version)->where('id')->eq($id)->exec();
        return !dao::isError();
    }
}