<?php
/**
 * The control file of user module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     user
 * @version     $Id: control.php 4219 2016-10-25 05:45:16Z daitingting $
 * @link        http://www.ranzhi.org
 */
class user extends control
{
    /**
     * The referer
     *
     * @var string
     * @access private
     */
    private $referer;

    /**
     * Login.
     *
     * @param string $referer
     * @access public
     * @return void
     */
    public function login($referer = '')
    {
        $this->setReferer($referer);

        /* Load mail config for reset password. */
        $this->app->loadModuleConfig('mail');

        $loginLink = $this->createLink('user', 'login');
        $denyLink  = $this->createLink('user', 'deny');

        /* Reload lang by lang of get when viewType is json. */
        if($this->app->getViewType() == 'json' and $this->get->lang and $this->get->lang != $this->app->getClientLang())
        {
            $this->app->setClientLang($this->get->lang);
            $this->app->loadLang('user');
        }

        /* If the user logon already, goto the pre page. */
        if($this->user->isLogon())
        {
            if($this->app->getViewType() == 'json')
            {
                $data = $this->user->getDataInJSON($this->app->user);
                die(helper::removeUTF8Bom(json_encode(array('status' => 'success') + $data)));
            }

            if($this->referer and strpos($loginLink . $denyLink, $this->referer) !== false) $this->locate($this->referer);
            $this->locate($this->createLink($this->config->default->module));
            exit;
        }

        /* If the user sumbit post, check the user and then authorize him. */
        if(!empty($_POST))
        {
            $user = $this->user->login($this->post->account, $this->post->password);
            if($this->app->getViewType() == 'json')
            {
                if($user)
                {
                    $data = $this->user->getDataInJSON($user);
                    die(helper::removeUTF8Bom(json_encode(array('status' => 'success') + $data)));
                }
                else
                {
                    die(helper::removeUTF8Bom(json_encode(array('status' => 'failed', 'reason' => $this->lang->user->loginFailed))));
                }
            }
            else
            {
                if(!$user) $this->send(array('result'=>'fail', 'message' => $this->lang->user->loginFailed));
            }

            /* Goto the referer or to the default module */
            if($this->post->referer != false and strpos($loginLink . $denyLink, $this->post->referer) === false)
            {
                if($this->config->requestType == 'PATH_INFO')
                {
                    $path = substr($this->post->referer, strrpos($this->post->referer, '/') + 1);
                    $path = rtrim($path, '.html');
                    if(empty($path) or strpos($path, $this->config->requestFix) === false) $path = $this->config->requestFix;
                    list($module, $method) = explode($this->config->requestFix, $path);
                }
                else
                {
                    $url   = html_entity_decode($this->post->referer);
                    $param = substr($url, strrpos($url, '?') + 1);

                    $module = $this->config->default->module;
                    $method = $this->config->default->method;
                    if(strpos($param, '&') !== false) list($module, $method) = explode('&', $param);
                    $module = str_replace('m=', '', $module);
                    $method = str_replace('f=', '', $method);
                }

                if(commonModel::hasPriv($module, $method))
                {
                    $this->send(array('result'=>'success', 'locate' => $this->post->referer));
                }
                else
                {
                    $this->send(array('result'=>'success', 'locate' => $this->createLink('index', 'index')));
                }
            }
            else
            {
                $this->send(array('result'=>'success', 'locate' => $this->createLink('index', 'index')));
            }
        }
        else if($this->app->getViewType() == 'json')
        {
            die(helper::removeUTF8Bom(json_encode(array('status' => 'failed', 'reason' => $this->lang->user->loginFailed))));
        }

        if(!$this->session->random) $this->session->set('random', md5(time() . mt_rand()));

        $ignoreNotice = isset($this->config->global->ignoreNotice) ? json_decode($this->config->global->ignoreNotice) : array();
        $this->view->ignoreNotice = $ignoreNotice;

        $this->view->title   = $this->lang->user->login->common;
        $this->view->referer = $this->referer;

        $this->display();
    }

    /**
     * logout
     *
     * @param int $referer
     * @access public
     * @return void
     */
    public function logout($referer = 0)
    {
        if($this->app->user->account != 'guest') $this->loadModel('action')->create('user', $this->app->user->id, 'logout');

        session_destroy();
        setcookie('keepLogin', 'false', $this->config->cookieLife, $this->config->webRoot);
        $vars = !empty($referer) ? "referer=$referer" : '';
        $this->locate($this->createLink('user', 'login', $vars));
    }

    /**
     * The deny page.
     *
     * @param mixed $module             the denied module
     * @param mixed $method             the deinied method
     * @param string $refererBeforeDeny the referer of the denied page.
     * @access public
     * @return void
     */
    public function deny($module, $method, $refererBeforeDeny = '')
    {
        $this->app->loadLang($module);
        $this->app->loadLang('index');

        $this->setReferer();

        $this->view->title             = $this->lang->user->deny;
        $this->view->module            = $module;
        $this->view->method            = $method;
        $this->view->denyPage          = $this->referer;
        $this->view->refererBeforeDeny = $refererBeforeDeny;

        die($this->display());
    }

    /**
     * The user control panel of the front
     *
     * @access public
     * @return void
     */
    public function control()
    {
        if($this->app->user->account == 'guest') $this->locate(inlink('login'));
        $this->display();
    }

    /**
     * View current user's profile.
     *
     * @access public
     * @return void
     */
    public function profile()
    {
        if($this->app->user->account == 'guest') $this->locate(inlink('login'));
        $this->view->title = $this->lang->user->profile;
        $this->view->user  = $this->user->getByAccount($this->app->user->account);
        $this->display();
    }

    /**
     * Create user
     *
     * @access public
     * @return void
     */
    public function create()
    {
        if(!empty($_POST))
        {
            if(in_array(strtolower(trim($this->post->account)), $this->config->user->retainAccount)) $this->send(array('result' => 'fail', 'message' => array('account' => sprintf($this->lang->user->retainAccount, trim($this->post->account)))));

            $this->user->create();
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            /* Go to the referer. */
            $this->send( array('result' => 'success', 'message' => $this->lang->saveSuccess, 'locate'=>inlink('admin')) );
        }

        $this->view->treeMenu = $this->loadModel('tree')->getTreeMenu('dept', 0, array('treeModel', 'createDeptAdminLink'));
        $this->view->depts    = $this->tree->getOptionMenu('dept');
        $this->display();
    }

    /**
     * Edit a user.
     *
     * @param  string    $account
     * @access public
     * @return void
     */
    public function edit($account = '', $from = '')
    {
        if(!commonModel::hasPriv('user', 'edit')) die(js::locate($this->createLink('user', 'deny', "module=user&method=edit")));

        die($this->fetch('user', 'editself', "account={$account}&from={$from}"));
    }

    /**
     * Edit login user.
     *
     * @access public
     * @return void
     */
    public function editself($account = '', $from = '')
    {
        if($this->app->user->account == 'guest') $this->locate(inlink('login'));
        if(!$account) $account = $this->app->user->account;

        if(!empty($_POST))
        {
            $this->user->update($account, $from);
            if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
            $locate = $from == 'admin' ? inlink('admin') : inlink('profile');
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess , 'locate' => $locate));
        }

        $this->view->title    = $this->lang->user->edit;
        $this->view->treeMenu = $this->loadModel('tree')->getTreeMenu('dept', 0, array('treeModel', 'createDeptAdminLink'));
        $this->view->depts    = $this->tree->getOptionMenu('dept');
        $this->view->user     = $this->user->getByAccount($account);
        if($from == 'admin')
        {
            $this->display('user', 'edit.admin');
        }
        else
        {
            $this->display('user', 'edit');
        }
    }

    /**
     * Delete a user.
     *
     * @param  string $account
     * @access public
     * @return void
     */
    public function delete($account = '')
    {
        if($this->user->delete($account)) $this->send(array('result' => 'success'));
        $this->send(array('result' => 'fail', 'message' => dao::getError()));
    }

    /**
     *  Admin users list.
     *
     * @param  int    $deptID
     * @param  string $mode
     * @param  srting $search
     * @param  srting $orderBy
     * @param  int    $recTotal
     * @param  int    $recPerPage
     * @param  int    $pagerID
     * @access public
     * @return void
     */
    public function admin($deptID = 0, $mode = 'normal', $search = '', $orderBy = 'id_asc', $recTotal = 0, $recPerPage = 10, $pageID = 1)
    {
        if($this->post->search) die($this->locate(inlink('admin', "deptID=$deptID&mode=&search={$this->post->search}&orderBy=$orderBy&recTotal=0&recPerPage=$recPerPage&pageID=1")));

        $this->app->loadClass('pager', $static = true);
        $pager = new pager($recTotal, $recPerPage, $pageID);

        $this->view->treeMenu = $this->loadModel('tree')->getTreeMenu('dept', 0, array('treeModel', 'createDeptAdminLink'));
        $this->view->depts    = $this->tree->getOptionMenu('dept');
        $this->view->users    = $this->user->getList($deptID, $mode, $accountList = '', $search, $orderBy, $pager);
        $this->view->deptID   = $deptID;
        $this->view->mode     = $mode;
        $this->view->search   = $search;
        $this->view->orderBy  = $orderBy;
        $this->view->pager    = $pager;

        $this->view->title = $this->lang->user->list;
        $this->display();
    }

    /**
     * forbid a user.
     *
     * @param  string $account
     * @return void
     */
    public function forbid($account = '')
    {
        if(!$account) $this->send(array('result'=>'fail', 'message' => $this->lang->user->actionFail));

        $result = $this->user->inTheReviewProcess($account);
        if($result !== false)
        {
            $this->send(array('result' => 'fail', 'message' => sprintf($this->lang->user->actionError, $result)));
        }

        $result = $this->user->forbid($account);
        if($result) die($this->send(array('result'=>'success', 'locate' => $this->server->http_referer)));

        $this->send(array('result' => 'fail', 'message' => dao::getError()));
    }

    /**
     * Active user
     *
     * @param  string $account
     * @access public
     * @return void
     */
    public function active($account = '')
    {
        if(!$account) $this->send(array('result'=>'fail', 'message' => $this->lang->user->actionFail));

        $result = $this->user->active($account);
        if($result) die($this->send(array('result'=>'success', 'locate' => $this->server->http_referer)));

        $this->send(array( 'result' => 'fail', 'message' => dao::getError()));
    }

    /**
     * set the referer
     *
     * @param  string $referer
     * @access public
     * @return void
     */
    public function setReferer($referer = '')
    {
        if(!empty($referer))
        {
            $this->referer = helper::safe64Decode($referer);
        }
        else
        {
            $this->referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
        }

        if(strpos($this->referer, 'entry') !== false and strpos($this->referer, 'visit') !== false)
        {
            if($this->config->requestType == 'PATH_INFO')
            {
                if(substr($this->referer, strpos($this->referer, 'entry-visit-') + strlen('entry-visit-'), strpos($this->referer, '.html')) > 4) $this->referer = '';
            }
            else
            {
                $url = parse_url($this->referer);
                parse_str($url['query'], $params);
                if($params['m'] == 'entry' and $params['f'] == 'visit' and $params['entryID'] > 4) $this->referer = '';
            }
        }
    }

    /**
     * Change password.
     *
     * @access public
     * @return void
     */
    public function changePassword()
    {
        if($this->app->user->account == 'guest') $this->locate(inlink('login'));

        if(!empty($_POST))
        {
            $this->user->updatePassword($this->app->user->account);
            if(dao::isError()) $this->send(array( 'result' => 'fail', 'message' => dao::getError() ) );
            $this->send(array('result' => 'success', 'message' => $this->lang->saveSuccess));
        }

        $this->view->user = $this->user->getByAccount($this->app->user->account);
        $this->display();
    }

    /**
     * upload avatar
     *
     * @access public
     * @return void
     */
    public function uploadAvatar()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $result = $this->user->uploadAvatar();
            $this->send($result);
        }

        $this->view->user  = $this->user->getByAccount($this->app->user->account);
        $this->view->title = $this->lang->user->uploadAvatar;
        $this->display();
    }
    /**
     * crop avatar
     *
     * @param  int    $image
     * @access public
     * @return void
     */
    public function cropAvatar($image)
    {
        $image = $this->loadModel('file')->getByID($image);

        if(!empty($_POST))
        {
            $size = fixer::input('post')->get();
            $this->loadModel('file')->cropImage($image->realPath, $image->realPath, $size->left, $size->top, $size->right - $size->left, $size->bottom - $size->top, $size->scaled ? $size->scaleWidth : 0, $size->scaled ? $size->scaleHeight : 0);
            $user = $this->user->getByAccount($this->app->user->account);
            $this->app->user->avatar = $user->avatar;
            exit('success');
        }

        $this->view->user  = $this->user->getByAccount($this->app->user->account);
        $this->view->title = $this->lang->user->cropAvatar;
        $this->view->image = $image;
        $this->display();
    }
}
