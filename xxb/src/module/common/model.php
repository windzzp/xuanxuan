<?php
/**
 * The model file of common module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     common
 * @version     $Id: model.php 4150 2016-10-17 08:06:43Z liugang $
 * @link        http://www.ranzhi.org
 */
class commonModel extends model
{
    /**
     * Do some init functions.
     * 
     * @access public
     * @return void
     */
    public function __construct($appName = '')
    {
        parent::__construct($appName);
        $this->startSession();
        $this->setUser();
        $this->loadConfigFromDB();
        if(!$this->checkIP()) die($this->lang->ipLimited);
        $this->loadLangFromDB();
    }

    /**
     * Load configs from database and save it to config->system and config->personal.
     * 
     * @access public
     * @return void
     */
    public function loadConfigFromDB()
    {
        /* Get configs of system and current user. */
        $account = isset($this->app->user->account) ? $this->app->user->account : '';
        if(!empty($this->config->db->name)) $config = $this->loadModel('setting')->getSysAndPersonalConfig($account);
        $this->config->system   = isset($config['system']) ? $config['system'] : new stdclass();
        $this->config->personal = isset($config[$account]) ? $config[$account] : new stdclass();

        foreach($this->config->system as $module => $records)
        {
            /* Overide the items defined in config/config.php and config/my.php. */
            if(!isset($this->config->$module)) $this->config->$module = new stdclass();
            if(isset($this->config->system->$module)) helper::mergeConfig($this->config->system->$module, $module);
        }

        foreach($this->config->personal as $module => $records)
        {
            /* Overide the items defined in config/config.php and config/my.php. */
            if(!isset($this->config->$module)) $this->config->$module = new stdclass();
            if(isset($this->config->personal->$module)) helper::mergeConfig($this->config->personal->$module, $module);
        }
        /* Overide the items defined in config/config.php and config/my.php. */
        if(isset($this->config->system->common)) helper::mergeConfig($this->config->system->common, 'common');
        if(isset($this->config->personal->common)) helper::mergeConfig($this->config->personal->common, 'common');
    }

    /**
     * Load custom lang from DB.
     * 
     * @access public
     * @return void
     */
    public function loadLangFromDB()
    {   
        if(!$this->config->db->name) return;
        $records = $this->loadModel('setting')->getAllLang();
        if(!$records) return;
        $this->lang->db = new stdclass();
        $this->lang->db->custom = $records;
    }   

    /**
     * Start the session.
     * 
     * @access public
     * @return void
     */
    public function startSession()
    {
        if(!defined('SESSION_STARTED'))
        {
            $sessionName = $this->config->sessionVar;
            if(isset($_GET[$sessionName])) session_id($_GET[$sessionName]);
            session_name($sessionName);
            session_start();
            define('SESSION_STARTED', true);
        }
    }

    /**
     * Check the Privilege.
     * 
     * @access public
     * @return void
     */
    public function checkPriv()
    {
        if(!empty($this->config->group->unUpdatedAccounts) and strpos($this->config->group->unUpdatedAccounts, $this->app->user->account) !== false)
        {
            $user = $this->app->user;
            $user->rights = $this->loadModel('user')->authorize($user);
            $this->session->set('user', $user);
            $this->app->user = $this->session->user;

            $unUpdatedAccounts = str_replace($this->app->user->account, '', $this->config->group->unUpdatedAccounts);
            if(str_replace(',', '', $unUpdatedAccounts) == '') $unUpdatedAccounts = '';
            $this->loadModel('setting')->setItem("system.sys.group.unUpdatedAccounts", $unUpdatedAccounts);
        }

        $module = $this->app->getModuleName();
        $method = $this->app->getMethodName();

        if($this->isOpenMethod($module, $method)) return true;

        /* Try to identify by cookie if not login. */
        if(!$this->loadModel('user')->isLogon() and $this->cookie->keepLogin == 'on') $this->user->identifyByCookie();

        /* If no $app->user yet, go to the login pae. */
        if($this->app->user->account == 'guest')
        {
            $referer  = helper::safe64Encode($this->app->getURI(true));
            die(js::locate(helper::createLink('user', 'login', "referer=$referer")));
        }

        /* Check the Privilege. */
        if(!commonModel::hasPriv($module, $method)) $this->deny($module, $method);
    }

    /**
     * Check current user has Privilege to the module's method or not.
     * 
     * @param mixed $module     the module
     * @param mixed $method     the method
     * @static
     * @access public
     * @return bool
     */
    public static function hasPriv($module, $method)
    {
        global $app, $config, $lang;

        if($app->user->admin == 'super') return true;

        if(RUN_MODE == 'admin')
        {
            if($app->user->admin != 'super') return false;
        }

        $rights = $app->user->rights;
        if(isset($rights[strtolower($module)][strtolower($method)])) return true;

        return false;
    }

    /**
     * Check whether IP in white list.
     *
     * @access public
     * @return bool
     */
    public function checkIP()
    {
        $ip = $this->server->remote_addr;

        $ipWhiteList = $this->config->ipWhiteList;

        /* If the ip white list is '*'. */
        if($ipWhiteList == '*') return true;

        /* The ip is same as ip in white list. */
        if($ip == $ipWhiteList) return true;

        /* If the ip in white list is like 192.168.1.1-192.168.1.10. */
        if(strpos($ipWhiteList, '-') !== false)
        {
            list($min, $max) = explode('-', $ipWhiteList);
            $min = ip2long(trim($min));
            $max = ip2long(trim($max));
            $ip  = ip2long(trim($ip));

            return $ip >= $min and $ip <= $max;
        }

        /* If the ip in white list is in IP/CIDR format eg 127.0.0.1/24. Thanks to zcat. */
        if(strpos($ipWhiteList, '/') == false) $ipWhiteList .= '/32';
        list($ipWhiteList, $netmask) = explode('/', $ipWhiteList, 2);

        $ip          = ip2long($ip);
        $ipWhiteList = ip2long($ipWhiteList);
        $wildcard    = pow(2, (32 - $netmask)) - 1;
        $netmask     = ~ $wildcard;

        return (($ip & $netmask) == ($ipWhiteList & $netmask));
    }

    /**
     * Show the deny info.
     * 
     * @param mixed $module     the module
     * @param mixed $method     the method
     * @access public
     * @return void
     */
    public function deny($module, $method)
    {
        if(helper::isAjaxRequest())
        {
            $this->app->loadLang($module);
            $this->app->loadLang('user');
            $moduleName = isset($this->lang->$module->common)  ? $this->lang->$module->common:  $module;
            $methodName = isset($this->lang->$module->$method) ? $this->lang->$module->$method: $method;
            $data = sprintf($this->lang->error->deny, $moduleName, $methodName);
            print(json_encode($data)) and die(helper::removeUTF8Bom(ob_get_clean()));
        }

        /* Get authorize again. */
        $user = $this->app->user;
        $user->rights = $this->loadModel('user')->authorize($user);
        $this->session->set('user', $user);
        $this->app->user = $this->session->user;
        if(commonModel::hasPriv($module, $method)) return true;

        $vars = "module=$module&method=$method";
        if(isset($_SERVER['HTTP_REFERER']))
        {
            $referer  = helper::safe64Encode($_SERVER['HTTP_REFERER']);
            $vars .= "&referer=$referer";
        }
        $denyLink = helper::createLink('user', 'deny', $vars);
        die(js::locate($denyLink));
    }

    /** 
     * Judge a method of one module is open or not?
     * 
     * @param  string $module 
     * @param  string $method 
     * @access public
     * @return bool
     */
    public function isOpenMethod($module, $method)
    {   
        if($module == 'user' and strpos(',login|logout|deny|control', $method)) return true;
        if($module == 'api'  and $method == 'getsessionid') return true;
        if($module == 'misc' and $method == 'ping') return true;
        if($module == 'misc' and $method == 'ignorenotice') return true;
        if($module == 'action' and $method == 'read') return true;
        if($module == 'block') return true;
        if($module == 'notice') return true;
        if($module == 'sso' and strpos(',auth|check|gettodolist|leaveusers', $method)) return true;
        if($module == 'file'   and $method == 'read') return true;
        if($module == 'file'   and $method == 'download') return true;

        if($this->loadModel('user')->isLogon() and stripos($method, 'ajax') !== false) return true;

        return false;
    }   

    /**
     * Create the main menu.
     * 
     * @param  string $currentModule 
     * @static
     * @access public
     * @return string
     */
    public static function createMainMenu($currentModule)
    {
        global $app, $lang, $config;

        /* Set current module. */
        if(isset($lang->menuGroups->$currentModule)) $currentModule = $lang->menuGroups->$currentModule;

        $isMobile = $app->viewType === 'mhtml';
        $string   = !$isMobile ? "<ul class='nav navbar-nav'>\n" : '';

        /* Print all main menus. */
        foreach($lang->menu as $moduleName => $moduleMenu)
        {
            $class = $moduleName == $currentModule ? " class='active'" : '';
            list($label, $module, $method, $vars) = explode('|', $moduleMenu);

            if(strpos(',tree,setting,', ',' . $module . ',') != false and isset($lang->setting->menu)) 
            {
                foreach($lang->setting->menu as $settingMenu)
                {
                    $class = $currentModule == 'setting' ? " class='active'" : '';
                    if(is_array($settingMenu)) $settingMenu = $settingMenu['link'];
                    list($settingLabel, $moduleName, $methodName, $settingVars) = explode('|', $settingMenu);

                    if(commonModel::hasPriv($moduleName, $methodName))
                    {
                        $link  = helper::createLink($moduleName, $methodName, $settingVars);
                        $string .= !$isMobile ? "<li$class><a href='$link'>$label</a></li>\n" : "<a$class href='$link'>$label</a>";
                        break;
                    }
                }
            }
            else
            {
                if(commonModel::hasPriv($module, $method))
                {
                    $link = helper::createLink($module, $method, $vars);
                }
                else
                {
                    $link = self::getLinkFromSubmenu($moduleName);
                }
                if($link) $string .= !$isMobile ? "<li$class><a href='$link'>$label</a></li>\n" : "<a$class href='$link'>$label</a>";
            }
        }

        if(!$isMobile)
        {
            $string .= "<li class='moreMenu hidden'><a href='javascript:;' class='dropdown-toggle' data-toggle='dropdown'>{$lang->more} <span class='caret'></span></a><ul class='dropdown-menu'></ul></li>";
        }

        $string .= !$isMobile ? "</ul>\n" : '';
        return $string;
    }

    /**
     * Create the module menu.
     * 
     * @param  string $currentModule 
     * @static
     * @access public
     * @return void
     */
    public static function createModuleMenu($currentModule)
    {
        global $lang, $app, $config;

        /* Get current method. */
        $currentMethod = $app->getMethodName();

        if(!isset($lang->$currentModule->menu)) return false;
        if(isset($config->attend->noAttendUsers) and strpos(",{$config->attend->noAttendUsers},", ",{$app->user->account},") !== false and isset($lang->attend->menu->personal))
        {
            unset($lang->attend->menu->personal);
        }

        $isMobile = $app->viewType === 'mhtml';
        $string   = !$isMobile ? "<nav id='menu'><ul class='nav'>\n" : '';
        if(!$isMobile && strpos(',setting,tree,group,', ",$currentModule,") !== false) 
        {
            $string = "<nav class='menu leftmenu affix'><ul class='nav nav-primary'>\n";
            if($currentModule == 'setting' && strpos(',xuanxuan,xxcversion,', ",$currentMethod,") !== false)
            {
                $string = "<nav id='menu'><ul class='nav'>\n";
            }
        }

        $menuOrder = isset($lang->{$currentModule}->menuOrder) ? $lang->{$currentModule}->menuOrder : array();  

        /* Get menus of current module. */
        $moduleMenus = new stdclass(); 
        if(!empty($menuOrder))
        {
            ksort($menuOrder);
            foreach($menuOrder as $name)
            {
                if(isset($lang->{$currentModule}->menu->$name)) $moduleMenus->$name = $lang->{$currentModule}->menu->$name;
            }

            foreach($lang->{$currentModule}->menu as $key => $value)
            {
                if(!isset($moduleMenus->$key)) $moduleMenus->$key = $value;
            }
        }
        else
        {
            $moduleMenus = $lang->$currentModule->menu;  
        }

        /* Cycling to print every menus of current module. */
        foreach($moduleMenus as $methodName => $methodMenu)
        {
            if(is_array($methodMenu)) 
            {
                $methodAlias = isset($methodMenu['alias']) ? $methodMenu['alias'] : '';
                $methodLink  = $methodMenu['link'];
            }
            else
            {
                $methodAlias = '';
                $methodLink  = $methodMenu;
            }

            /* Split the methodLink to label, module, method, vars. */
            list($label, $module, $method, $vars) = explode('|', $methodLink);

            /* If has no privilege to access the method but the alias, change method to alias. */
            if(!commonModel::hasPriv($module, $method) && $methodAlias != '')
            {
                $aliases = explode(',', trim($methodAlias, ','));
                foreach($aliases as $alias)
                {
                    if(commonModel::hasPriv($module, trim($alias)))
                    {
                        $method = trim($alias);
                        break;
                    }
                }
            }

            if(commonModel::hasPriv($module, $method))
            {
                $class = '';
                if($module == $currentModule && strtolower($method) == $currentMethod) $class = " class='active'";
                if($module == $currentModule && stripos($methodAlias, $currentMethod) !== false) $class = " class='active'";
                $url  = helper::createLink($module, $method, $vars);
                $link = html::a($url, $label);
                if(strpos($string, "class='active'") != false)
                {

                    $string .= !$isMobile ? ("<li>$link</li>\n") : $link;
                }
                else
                {
                    $string .= !$isMobile ? "<li{$class}>$link</li>\n" : html::a($url, $label, $class);
                }
            }
        }

        $string .= !$isMobile ? "</ul></nav>\n" : '';
        return $string;
    }

    /**
     * Get Link From Submenu.
     * 
     * @param  string    $menuGroup 
     * @access public
     * @return string
     */
    public static function getLinkFromSubmenu($menuGroup)
    {
        global $lang, $config;

        if(!isset($lang->$menuGroup->menu)) return '';

        foreach($lang->$menuGroup->menu as $code => $menu)
        {
            if(is_array($menu)) $menu = $menu['link'];
            list($label, $moduleName, $methodName, $vars) = explode('|', $menu);

            if(commonModel::hasPriv($moduleName, $methodName)) return helper::createLink($moduleName, $methodName, $vars);
        }

        return '';
    }

    /**
     * Print position bar 
     *
     * @param   object $module 
     * @param   object $object 
     * @param   mixed  $misc    other params. 
     * @access  public
     * @return  void
     */
    public function printPositionBar($module = '', $object = '', $misc = '', $root = '')
    {
        echo '<ul class="breadcrumb">';
        if($root == '')
        {
            echo '<li>' . $this->lang->currentPos . $this->lang->colon . html::a(helper::createLink('index'), strtoupper($this->app->appName)) . '</li>';
        }
        else
        {
            echo $root;
        }

        $moduleName = $this->app->getModuleName();
        $moduleName = $moduleName == 'reply' ? 'thread' : $moduleName;
        $funcName = "print$moduleName";
        if(method_exists('commonModel', $funcName)) echo $this->$funcName($module, $object, $misc);
        echo '</ul>';
    }

    /**
     * Print the link contains orderBy field.
     *
     * This method will auto set the orderby param according the params. For example, if the order by is desc,
     * will be changed to asc.
     *
     * @param  string $fieldName    the field name to sort by
     * @param  string $orderBy      the order by string
     * @param  string $vars         the vars to be passed
     * @param  string $label        the label of the link
     * @param  string $module       the module name
     * @param  string $method       the method name
     * @static
     * @access public
     * @return void
     */
    public static function printOrderLink($fieldName, $orderBy, $vars, $label, $module = '', $method = '', $print = true)
    {
        global $lang, $app;
        if(empty($module)) $module = $app->getModuleName();
        if(empty($method)) $method = $app->getMethodName();
        $className = '';
        $isMobile  = $app->viewType === 'mhtml';

        if(strpos($orderBy, $fieldName) !== false)
        {
            if(stripos($orderBy, 'desc') !== false)
            {
                $orderBy   = str_ireplace('desc', 'asc', $orderBy);
                $className = 'SortDown';
            }
            elseif(stripos($orderBy, 'asc')  !== false)
            {
                $orderBy = str_ireplace('asc', 'desc', $orderBy);
                $className = 'SortUp';
            }
        }
        else
        {
            $orderBy   = $fieldName . '_' . 'asc';
            $className = '';
        }

        $link = helper::createLink($module, $method, sprintf($vars, $orderBy));

        $html = '';
        if(!$isMobile) $html = "<div class='header$className'>" . html::a($link, $label) . '</div>';
        else $html = html::a($link, $label, "class='$className'");

        if(!$print) return $html;

        echo$html;
    }
 
    /**
     * Set the user info.
     * 
     * @access public
     * @return void
     */
    public function setUser()
    {
        if($this->session->user) return $this->app->user = $this->session->user;

        /* Create a guest account. */
        $user           = new stdclass();
        $user->id       = 0;
        $user->dept     = 0;
        $user->account  = 'guest';
        $user->realname = 'guest';
        $user->admin    = RUN_MODE == 'cli' ? 'super' : 'no';
        $user->rights   = array();

        $this->session->set('user', $user);
        $this->app->user = $this->session->user;
    }

    /**
     * Get the run info.
     * 
     * @param mixed $startTime  the start time of this execution
     * @access public
     * @return array    the run info array.
     */
    public function getRunInfo($startTime)
    {
        $info['timeUsed'] = round(getTime() - $startTime, 4) * 1000;
        $info['memory']   = round(memory_get_peak_usage() / 1024, 1);
        $info['querys']   = count(dao::$querys);
        return $info;
    }

    /**
     * Print top bar.
     * 
     * @static
     * @access public
     * @return void
     */
    public static function printTopBar()
    {
        global $lang, $app;

        printf($lang->todayIs, date(DT_DATE4));
        if(isset($app->user)) echo $app->user->realname . ' ';
        if(isset($app->user) and $app->user->account != 'guest')
        {
            echo html::a(helper::createLink('user', 'logout'), $lang->logout);
        }
        else
        {
            echo html::a(helper::createLink('user', 'login'), $lang->login);
        }

        echo '&nbsp;|&nbsp; ';
        echo html::a(helper::createLink('misc', 'about'), $lang->about, '', "class='about'");

        echo '&nbsp;|&nbsp;';
        echo html::select('', $app->config->langs, $app->cookie->lang,  'onchange="selectLang(this.value)"');
    }

    /**
     * Print the main menu.
     * 
     * @param  string $moduleName 
     * @static
     * @access public
     * @return void
     */
    public static function printMainmenu($moduleName, $methodName = '')
    {
        global $app, $lang;
        echo "<ul>\n";
 
        /* Set the main main menu. */
        $mainMenu = $moduleName;
        if(isset($lang->menuGroups->$moduleName)) $mainMenu = $lang->menuGroups->$moduleName;

        $activeName = $app->getViewType() == 'mhtml' ? 'ui-btn-active' : 'active';

        /* Print all main menus. */
        foreach($lang->menu as $menuKey => $menu)
        {
            $active = $menuKey == $mainMenu ? "class='$activeName'" : '';
            $link = explode('|', $menu);
            list($menuLabel, $module, $method) = $link;
            $vars = isset($link[3]) ? $link[3] : '';

            if(commonModel::hasPriv($module, $method))
            {
                $link  = helper::createLink($module, $method, $vars);
                echo "<li $active><a href='$link' $active id='menu$menuKey'>$menuLabel</a></li>\n";
            }
        }

    }

    /**
     * Print the module menu.
     * 
     * @param  string $moduleName 
     * @static
     * @access public
     * @return void
     */
    public static function printModuleMenu($moduleName)
    {
        global $lang, $app;

        if(!isset($lang->$moduleName->menu)) {echo "<ul></ul>"; return;}

        /* Get the sub menus of the module, and get current module and method. */
        $submenus      = $lang->$moduleName->menu;  
        $currentModule = $app->getModuleName();
        $currentMethod = $app->getMethodName();

        /* Sort the subMenu according to menuOrder. */
        if(isset($lang->$moduleName->menuOrder))
        {
            $menus = $submenus;
            $submenus = new stdclass();

            ksort($lang->$moduleName->menuOrder, SORT_ASC);
            if(isset($menus->list)) 
            {
                $submenus->list = $menus->list; 
                unset($menus->list);
            }
            foreach($lang->$moduleName->menuOrder as $order)  
            {
                if(($order != 'list') && isset($menus->$order))
                {
                    $subOrder = $menus->$order;
                    unset($menus->$order);
                    $submenus->$order = $subOrder;
                }
            }
            foreach($menus as $key => $menu)
            {
                $submenus->$key = $menu; 
            }
        }

        /* The beginning of the menu. */
        echo "<ul>\n";

        /* Cycling to print every sub menus. */
        foreach($submenus as $subMenuKey => $submenu)
        {
            /* Init the these vars. */
            $link      = $submenu;
            $subModule = '';
            $alias     = '';
            $float     = '';
            $active    = '';
            $target    = '';

            if(is_array($submenu)) extract($submenu);   // If the sub menu is an array, extract it.

            /* Print the menu. */
            if(strpos($link, '|') === false)
            {
                echo "<li>$link</li>\n";
            }
            else
            {
                $link = explode('|', $link);
                list($label, $module, $method) = $link;
                $vars = isset($link[3]) ? $link[3] : '';
                if(commonModel::hasPriv($module, $method))
                {
                    /* Is the currentModule active? */
                    $subModules = explode(',', $subModule);
                    if(in_array($currentModule,$subModules) and $float != 'right') $active = 'active';
                    if($module == $currentModule and ($method == $currentMethod or strpos(",$alias,", ",$currentMethod,") !== false) and $float != 'right') $active = 'active';
                    echo "<li class='$float $active'>" . html::a(helper::createLink($module, $method, $vars), $label, $target, "id=submenu$subMenuKey") . "</li>\n";
                }
            }
        }
        echo "</ul>\n";
    }

    /**
     * Print the bread menu.
     * 
     * @param  string $moduleName 
     * @param  string $position 
     * @static
     * @access public
     * @return void
     */
    public static function printBreadMenu($moduleName, $position)
    {
        global $lang;
        $mainMenu = $moduleName;
        if(isset($lang->menuGroups->$moduleName)) $mainMenu = $lang->menuGroups->$moduleName;
        echo html::a(helper::createLink('my', 'index'), $lang->ranzhi);
        if($moduleName != 'index')
        {
            if(!isset($lang->menu->$mainMenu)) return;
            list($menuLabel, $module, $method) = explode('|', $lang->menu->$mainMenu);
            echo html::a(helper::createLink($module, $method), $menuLabel);
        }
        else
        {
            echo $lang->index->common;
        }
        if(empty($position)) return;
        echo $lang->arrow;
        foreach($position as $key => $link)
        {
            echo $link;
            if(isset($position[$key + 1])) echo $lang->arrow;
        }
    }

    /**
     * Print the link for notify file.
     * 
     * @static
     * @access public
     * @return void
     */
    public static function printNotifyLink()
    {
        if(strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows') !== false)
        {
            global $app, $lang;
            $notifyFile = $app->getBasePath() . 'www/data/notify/notify.zip';

            if(!file_exists($notifyFile)) return false;
            echo html::a(helper::createLink('misc', 'downNotify'), $lang->downNotify);
        }
    }

    /**
     * Get the full url of the system.
     * 
     * @static
     * @access public
     * @return string
     */
    public static function getSysURL()
    {
        $httpType = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == 'on' ? 'https' : 'http';
        $httpHost = $_SERVER['HTTP_HOST'];
        return "$httpType://$httpHost";
    }

    /**
     * Get client IP.
     * 
     * @access public
     * @return void
     */
    public function getIP()
    {
        if(getenv("HTTP_CLIENT_IP"))
        {
            $ip = getenv("HTTP_CLIENT_IP");
        }
        elseif(getenv("HTTP_X_FORWARDED_FOR"))
        {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        }
        elseif(getenv("REMOTE_ADDR"))
        {
            $ip = getenv("REMOTE_ADDR");
        }
        else
        {
            $ip = "Unknow";
        }

        return $ip;
    }

    /**
     * Create changes of one object.
     * 
     * @param mixed $old    the old object
     * @param mixed $new    the new object
     * @static
     * @access public
     * @return array
     */
    public static function createChanges($old, $new)
    {   
        global $config;
        $changes    = array();
        $magicQuote = get_magic_quotes_gpc();
        foreach($new as $key => $value)
        {   
            if(!isset($old->$key))                   continue;
            if(strtolower($key) == 'lastediteddate') continue;
            if(strtolower($key) == 'lasteditedby')   continue;
            if(strtolower($key) == 'assigneddate')   continue;
            if(strtolower($key) == 'editedby')       continue;
            if(strtolower($key) == 'editeddate')     continue;

            if(is_array($value))
            {
                if(is_string(reset($value))) $value = join(',', $value);
                else $value = join(',', array_keys($value)); 
            }
            if(is_array($old->$key)) 
            {
                if(is_string(reset($old->$key))) $old->$key = join(',', $old->$key);
                else $old->$key = join(',', array_keys($old->$key)); 
            }

            if($magicQuote) $value = stripslashes($value);
            if($value != stripslashes($old->$key))
            {
                $diff = '';
                if(substr_count($value, "\n") > 1     or
                   substr_count($old->$key, "\n") > 1 or
                   strpos(',name,title,desc,content,summary,', ',' . strtolower($key) . ',') !== false)
                {
                    $diff = commonModel::diff($old->$key, $value);
                }
                $changes[] = array('field' => $key, 'old' => $old->$key, 'new' => $value, 'diff' => $diff);
            }
        }
        return $changes;
    }

    /**
     * Diff two string. (see phpt)
     * 
     * @param string $text1 
     * @param string $text2 
     * @static
     * @access public
     * @return string
     */
    public static function diff($text1, $text2)
    {
        $text1 = str_replace('&nbsp;', '', trim($text1));
        $text2 = str_replace('&nbsp;', '', trim($text2));
        $w  = explode("\n", $text1);
        $o  = explode("\n", $text2);
        $w1 = array_diff_assoc($w,$o);
        $o1 = array_diff_assoc($o,$w);
        $w2 = array();
        $o2 = array();
        foreach($w1 as $idx => $val) $w2[sprintf("%03d<",$idx)] = sprintf("%03d- ", $idx+1) . "<del>" . trim($val) . "</del>";
        foreach($o1 as $idx => $val) $o2[sprintf("%03d>",$idx)] = sprintf("%03d+ ", $idx+1) . "<ins>" . trim($val) . "</ins>";
        $diff = array_merge($w2, $o2);
        ksort($diff);
        return implode("\n", $diff);
    }

    /**
     * Print link to an modules' methd.
     *
     * Before printing, check the privilege first. If no privilege, return fasle. Else, print the link, return true.
     * 
     * @param  string $module   the module name
     * @param  string $method   the method
     * @param  string $vars     vars to be passed
     * @param  string $label    the label of the link
     * @param  string $misc     others
     * @param  bool   $print 
     * @param  bool   $onlyBody 
     * @param  string $type     li
     * @static
     * @access public
     * @return bool
     */
    public static function printLink($module, $method, $vars = '', $label, $misc = '', $print = true, $onlyBody = false, $type = '')
    {
        if(!commonModel::hasPriv($module, $method)) return false;

        $content  = '';
        $canClick = commonModel::checkPrivByVars($module, $method, $vars);
        $link     = helper::createLink($module, $method, $vars, '', $onlyBody);
        if(!$canClick)
        {
            $misc = str_replace("class='", "disabled='disabled' class='disabled ", $misc);
            $misc = str_replace("data-toggle='modal'", ' ', $misc);
            $misc = str_replace("deleter", ' ', $misc);
            if(strpos($misc, "class='") === false) $misc .= " class='disabled' disabled='disabled'";
        }
        if($type == 'li') $content .= '<li' . ($canClick ? '' : " disabled='disabled' class='disabled'") . '>';
        $content .= html::a($canClick ? $link : 'javascript:void(0)', $label, $misc);
        if($type == 'li') $content .= '</li>';

        if($print !== false) echo $content;
        return $content;
    }

    /**
     * Check privilege by vars. 
     * 
     * @param  string $module 
     * @param  string $method 
     * @param  string|array $vars 
     * @static
     * @access public
     * @return void
     */
    public static function checkPrivByVars($module, $method, $vars)
    {
        global $app;
        if(!is_array($vars)) parse_str($vars, $vars);
        if(strpos($module, '.') !== false) $module = substr($module, strpos($module, '.') + 1);
        $method = strtolower($method);

        /* Check priv by {$moduleName}ID. */
        $checkByID['customer'] = ',assign,edit,delete,linkcontact,';
        $checkByID['order']    = ',assign,edit,delete,close,activate,';
        $checkByID['contract'] = ',receive,delivery,edit,delete,finish,cancel,';
        $checkByID['resume']   = ',edit,delete,';
        $checkByID['address']  = ',edit,delete,';

        $funcName = 'check' . ucfirst($module) . 'Priv';
        if(method_exists('extcommonModel', $funcName)) $checkByID = extcommonModel::$funcName($checkByID);

        foreach($checkByID as $moduleName => $methodName)
        {
            if($module == $moduleName and strpos($methodName, ",$method,") !== false)
            {
                $idName     = "{$moduleName}ID";
                $idListName = 'canEdit' . ucwords($moduleName) . 'IdList';
                if(!isset($vars[$idName])) return false;
                $idList = isset($app->user->$idListName) ? $app->user->$idListName : '';
                if(strpos($idList, ",{$vars[$idName]},") === false) return false;
            }
        }

        /* Check priv by objectType and objectID. */
        $checkByType['action']  = ',createrecord,';
        $checkByType['address'] = ',create,';
        foreach($checkByType as $moduleName => $methodName)
        {
            if($module == $moduleName and strpos($methodName, ",$method,") !== false)
            {
                if(!isset($vars['objectType']) or !isset($vars['objectID'])) return false;
                $idName     = $vars['objectType'] . 'ID';
                $idListName = 'canEdit' . ucwords($vars['objectType']) . 'IdList';
                $idList     = isset($app->user->$idListName) ? $app->user->$idListName : '';
                return commonModel::checkPrivByVars($vars['objectType'], 'edit', "{$idName}={$vars['objectID']}");
            }
        }

        /* Check priv use another method. module|method */
        $checkByGroup['resume']['create'] = 'contact|edit';
        foreach($checkByGroup as $moduleName => $methodNames)
        {
            foreach($methodNames as $methodName => $settings)
            {
                list($newModuleName, $newMethodName) = explode('|', $settings);
                if($module == $moduleName and $method == $methodName)
                {
                    return commonModel::checkPrivByVars($newModuleName, $newMethodName, $vars);
                }
            }
        }

        return true;
    }

    /**
     * Check an entry.
     *
     * @access public
     * @return void
     */
    public function checkEntry()
    {
        $this->loadModel('entry');

        if($this->session->validEntry)
        {
            if(!$this->session->entryCode) $this->response('SESSION_CODE_MISSING');
            if($this->session->validEntry != md5(md5($this->get->code) . $this->server->remote_addr)) $this->response('SESSION_VERIFY_FAILED');
            return true;
        }

        if(!$this->get->code)  $this->response('PARAM_CODE_MISSING');
        if(!$this->get->token) $this->response('PARAM_TOKEN_MISSING');

        $entry = $this->entry->getByCode($this->get->code);
        if(!$entry)                              $this->response('EMPTY_ENTRY');
        if(!$entry->key)                         $this->response('EMPTY_KEY');
        if(!$this->checkIP($entry->ip))          $this->response('IP_DENIED');
        if(!$this->checkEntryToken($entry->key)) $this->response('INVALID_TOKEN');

        /* Set super rights. */
        $this->loadModel('user');
        $user = $this->dao->select('*')->from(TABLE_USER)->where('admin')->eq('super')->limit(1)->fetch();
        $groups = $this->loadModel('group')->getByAccount($user->account);
        $user->groups = array_keys($groups);
        $user->rights = $this->user->authorize($user);
        $this->session->set('user', $user);
        $this->app->user = $this->session->user;

        $this->session->set('entryCode', $this->get->code);
        $this->session->set('validEntry', md5(md5($this->get->code) . $this->server->remote_addr));
        //$this->loadModel('entry')->saveLog($entry->id, $this->server->request_uri);

        unset($_GET['code']);
        unset($_GET['token']);
    }

    /**
     * Response.
     *
     * @param  string $code
     * @access public
     * @return void
     */
    public function response($code)
    {
        $response = new stdclass();
        $response->errcode = $this->config->entry->errcode[$code];
        $response->errmsg  = $this->lang->entry->errmsg[$code];

        die(helper::jsonEncode($response));
    }

    /**
     * Check token of an entry.
     *
     * @param  string $key
     * @access public
     * @return void
     */
    public function checkEntryToken($key)
    {
        parse_str($this->server->query_String, $queryString);
        unset($queryString['token']);
        $queryString = http_build_query($queryString);
        return $this->get->token == md5(md5($queryString) . $key);
    }

    /**
     * Sort entry by order. 
     * 
     * @param  object $a 
     * @param  object $b 
     * @access private
     * @return bool
     */
    public static function sortEntryByOrder($a, $b)
    {
        if($a->order == $b->order)
        {
            return $a->id > $b->id ? 1 : -1;
        }
        return $a->order > $b->order ? 1 : -1;
    }

    /**
     * Http.
     * 
     * @param  string    $url 
     * @param  string    $data 
     * @static
     * @access public
     * @return string
     */
    public static function http($url, $data = null)
    {
        global $lang;
        if(!extension_loaded('curl')) return json_encode(array('result' => 'fail', 'message' => $lang->error->noCurlExt));

        $ci = curl_init();
        curl_setopt($ci, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
        curl_setopt($ci, CURLOPT_USERAGENT, 'Sae T OAuth2 v0.1');
        curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ci, CURLOPT_TIMEOUT, 30);
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ci, CURLOPT_ENCODING, '');
        curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ci, CURLOPT_HEADER, false);

        $headers[] = "API-RemoteIP: " . $_SERVER['REMOTE_ADDR'];
        curl_setopt($ci, CURLOPT_URL, $url);
        curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ci, CURLINFO_HEADER_OUT, true);
        if(!empty($data)) 
        {
            curl_setopt($ci, CURLOPT_POST, true);
            curl_setopt($ci, CURLOPT_POSTFIELDS, $data);
        }

        $results = curl_exec($ci);
        $errors  = curl_error($ci);
        curl_close ($ci);

        commonModel::log($url, $data, $results, $errors);
        return $results;
    }

    /**
     * Convert items to Pinyin.
     * 
     * @param  array    $items 
     * @static
     * @access public
     * @return array
     */
    public static function convert2Pinyin($items)
    {
        global $app;
        static $allConverted = array();
        static $pinyin;
        if(empty($pinyin)) $pinyin = $app->loadClass('pinyin');

        $sign = ' aNdAnD ';
        $notConvertedItems = array_diff($items, array_keys($allConverted));

        if($notConvertedItems)
        {
            $convertedPinYin = $pinyin->romanize(join($sign, $notConvertedItems));
            $itemsPinYin     = explode(trim($sign), $convertedPinYin);
            foreach($notConvertedItems as $item)
            {
                $itemPinYin  = array_shift($itemsPinYin);
                $wordsPinYin = explode("\t", trim($itemPinYin));

                $abbr = '';
                foreach($wordsPinYin as $i => $wordPinyin)
                {
                    if($wordPinyin) $abbr .= $wordPinyin[0];
                }

                $allConverted[$item] = strtolower(join($wordsPinYin) . ' ' . $abbr);
            }
        }

        $convertedItems = array();
        foreach($items as $item) $convertedItems[$item] = zget($allConverted, $item, null);

        return $convertedItems;
    }

    /**
     * Log.
     * 
     * @param  string $url 
     * @param  mixed  $data     string | array
     * @param  string $results 
     * @param  string $errors
     * @param  string $logFile
     * @static
     * @access public
     * @return void
     */
    public static function log($url, $data, $results, $errors, $logFile = 'saas')
    {
        global $app, $config;
        if(empty($config->debug)) return false;

        $logFile = $app->getLogRoot() . $logFile . '.'. date('Ymd') . '.log';
        $fh = @fopen($logFile, 'a');
        if(!$fh) return false;

        fwrite($fh, date('Ymd H:i:s') . ": " . $app->getURI() . "\n");
        fwrite($fh, "url:    " . $url . "\n");
        if(!empty($data)) fwrite($fh, "data:   " . print_r($data, true) . "\n");
        fwrite($fh, "results:" . print_r($results, true) . "\n");
        if(!empty($errors)) fwrite($fh, "errors: " . $errors . "\n");
        fclose($fh);
    }
}
