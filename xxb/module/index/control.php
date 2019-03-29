<?php
/**
 * The control file of index module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     index 
 * @version     $Id: control.php 4205 2016-10-24 08:19:13Z liugang $
 * @link        http://xuan.im
 */
class index extends control
{
    /**
     * The construct method.
     * 
     * @access public
     * @return void
     */
    public function __construct($moduleName = '', $methodName = '', $appName = '')
    {
        parent::__construct($moduleName, $methodName, $appName);
    }

    /**
     * Index page.
     * 
     * @access public
     * @return void
     */
    public function index()
    {
        $this->locate($this->createLink('user', 'admin'));
    }
}
