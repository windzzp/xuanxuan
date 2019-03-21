<?php
/**
 * The control file of setting module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     setting
 * @version     $Id$
 * @link        http://xuan.im
 */
class setting extends control
{
    /**
     * Set lang. 
     * 
     * @param  string    $module 
     * @param  string    $field 
     * @access public
     * @return void
     */
    public function lang($module, $field)
    {
        $clientLang = $this->app->getClientLang();

        $this->app->loadLang($module);

        if($module == 'user' and $field == 'roleList') $this->lang->menuGroups->setting = 'user';

        if(!empty($_POST))
        {
            $lang = $_POST['lang'];
            $appendField = isset($this->config->setting->appendLang[$module][$field]) ? $this->config->setting->appendLang[$module][$field] : '';

            $this->setting->deleteItems("lang=$lang&module=$module&section=$field", $type = 'lang');
            if($appendField) $this->setting->deleteItems("lang=$lang&module=$module&section=$appendField", $type = 'lang');

            foreach($_POST['keys'] as $index => $key)
            {   
                $value = $_POST['values'][$index];
                if(!$value or !$key) continue;
                $system = $_POST['systems'][$index];
                $this->setting->setItem("{$lang}.{$module}.{$field}.{$key}.{$system}", $value, $type = 'lang');

                /* Save additional item. */
                if($appendField)
                {
                    $this->setting->setItem("{$lang}.{$module}.{$appendField}.{$key}.{$system}", $_POST[$appendField][$index], $type = 'lang');
                }
            }

            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate' => inlink('lang', "module=$module&field=$field")));
        }   

        $dbFields    = $this->setting->getItems("lang=$clientLang,all&module=$module&section=$field", 'lang');
        $systemField = array();
        foreach($dbFields as $dbField) $systemField[$dbField->key] = $dbField->system;

        $this->view->fieldList   = $module == 'common' ? $this->lang->$field : $this->lang->$module->$field;
        $this->view->module      = $module;
        $this->view->field       = $field;
        $this->view->clientLang  = $clientLang;
        $this->view->systemField = $systemField;
        $this->display();
    }

    /** 
     * Restore the default lang. Delete the related items.
     * 
     * @param  string $module 
     * @param  string $field 
     * @access public
     * @return void
     */
    public function reset($module, $field)
    {   
        $this->setting->deleteItems("module=$module&section=$field", $type = 'lang');
        if(isset($this->config->setting->appendLang[$module][$field]))
        {
            $appendField = $this->config->setting->appendLang[$module][$field];
            $this->setting->deleteItems("module=$module&section=$appendField", $type = 'lang');
        }

        $this->send(array('result' => 'success'));
    }   
}
