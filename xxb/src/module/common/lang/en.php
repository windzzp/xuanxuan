<?php
/**
 * The English file of common module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     common 
 * @version     $Id: en.php 4194 2016-10-21 09:23:53Z daitingting $
 * @link        http://www.zdoo.org
 */
$lang->colon      = ' : ';
$lang->ellipsis   = '…';
$lang->prev       = '‹';
$lang->next       = '›';
$lang->unfold     = '+';
$lang->fold       = '-';
$lang->percent    = '%';
$lang->laquo      = '&laquo;';
$lang->raquo      = '&raquo;';
$lang->minus      = ' - ';
$lang->hyphen     = '-';
$lang->slash      = ' / ';
$lang->semicolon  = ';';
$lang->RMB        = '￥';
$lang->divider    = "<span class='divider'>{$lang->raquo}</span> ";
$lang->at         = ' At ';
$lang->by         = ' By ';
$lang->ditto      = 'Ditto';
$lang->etc        = 'Etc.';
$lang->importIcon = "<i class='icon-download-alt'> </i>";
$lang->exportIcon = "<i class='icon-upload-alt'> </i>";

/* Lang items for ranzhi. */
$lang->ranzhi    = 'Zdoo';
$lang->agreement = "I have read and agreed to  <a href='http://zpl.pub/page/zplv12.html' target='_blank'>Z PUBLIC LICENSE 1.2</a>, <span class='text-danger'>and will keep the logos and links of Zdoo.</span>";
$lang->poweredBy = "<a href='http://www.zdoo.org/?v=%s' target='_blank'>{$lang->ranzhi} %s</a>";
$lang->ipLimited = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body>Sorry, your current IP is blocked. Please contact the Administrator to get privilege.</body></html>";

/* IE6 alert.  */
$lang->IE6Alert = <<<EOT
    <div class='alert alert-danger' style='margin-top:100px;'>
      <button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>
      <h2>Please use IE(>8), firefox, chrome, safari, opera to visit this site.</h2>
      <p>Stop using IE6!</p>
      <p>IE6 is too outdated that we should stop using it. <br/></p>
      <a href='https://www.google.com/intl/zh-hk/chrome/browser/' class='btn btn-primary btn-lg' target='_blank'>Chrome</a>
      <a href='http://www.firefox.com/' class='btn btn-primary btn-lg' target='_blank'>Firefox</a>
      <a href='http://www.opera.com/download' class='btn btn-primary btn-lg' target='_blank'>Opera</a>
      <p></p>
    </div>
EOT;

/* Themes. */
$lang->theme             = 'Theme';
$lang->themes['default'] = 'Default';
$lang->themes['clear']   = 'Clear';

/* Global lang items. */
$lang->home             = 'Home';
$lang->welcome          = '%s Zdoo';
$lang->aboutUs          = 'About';
$lang->about            = 'About';
$lang->logout           = 'Logout';
$lang->login            = 'Login';
$lang->account          = 'Username';
$lang->password         = 'Password';
$lang->all              = 'All';
$lang->changePassword   = 'Change password';

/* Global action items. */
$lang->reset          = 'Reset';
$lang->add            = 'Add';
$lang->edit           = 'Edit';
$lang->copy           = 'Copy';
$lang->and            = 'And';
$lang->or             = 'Or';
$lang->hide           = 'Hide';
$lang->delete         = 'Delete';
$lang->close          = 'Close';
$lang->finish         = 'Finish';
$lang->cancel         = 'Cancel';
$lang->import         = 'Import';
$lang->export         = 'Export';
$lang->setFileName    = 'File Name';
$lang->setFileNum     = 'File Number';
$lang->setFileType    = 'File Type';
$lang->setCharset     = 'Charset';
$lang->save           = 'Save';
$lang->saved          = 'Saved';
$lang->confirm        = 'Confirm';
$lang->preview        = 'Preview';
$lang->goback         = 'Back';
$lang->assign         = 'Assign';
$lang->start          = 'Start';
$lang->create         = 'Add';
$lang->forbid         = 'Forbid';
$lang->activate       = 'Activate';
$lang->ignore         = 'Ignore';
$lang->view           = 'View';
$lang->detail         = 'Details';
$lang->more           = 'More';
$lang->actions        = 'Actions';
$lang->history        = 'History';
$lang->reverse        = 'Reverse';
$lang->switchDisplay  = 'Switch Display';
$lang->feature        = 'Features';
$lang->year           = 'Year';
$lang->month          = 'Month';
$lang->week           = 'Week';
$lang->day            = 'Day';
$lang->loading        = 'Loading...';
$lang->saveSuccess    = 'Saved';
$lang->setSuccess     = 'Saved';
$lang->sendSuccess    = 'Sent';
$lang->fail           = 'Failed';
$lang->noResultsMatch = 'No match found.';
$lang->searchMore     = "More results：";
$lang->files          = 'Files';
$lang->addFiles       = 'Add Files ';
$lang->comment        = 'Comment';
$lang->selectAll      = 'All';
$lang->selectReverse  = 'Inverse';
$lang->continueSave   = 'Continue saving';
$lang->submitting     = 'Saving...';
$lang->yes            = 'YES';
$lang->no             = 'NO';
$lang->signIn         = 'Sign in';
$lang->signOut        = 'Sign out';
$lang->sort           = 'Ranking';
$lang->required       = 'Required';
$lang->custom         = 'Custom';
$lang->refresh        = 'Refresh';

/* Items for lifetime. */
$lang->lifetime = new stdclass();
$lang->lifetime->createdBy    = 'Created By';
$lang->lifetime->assignedTo   = 'Assign to';
$lang->lifetime->signedBy     = 'Signed By';
$lang->lifetime->closedBy     = 'Closed By';
$lang->lifetime->closedReason = 'Closed Reason';
$lang->lifetime->lastEdited   = 'Last Edited';

$lang->setOkFile = <<<EOT
<h5>For security reason, please do these steps. </h5>
<p>Create %s file. If this file exists already, reopen it and save again.</p>
EOT;

/* Items for javascript. */
$lang->js = new stdclass();
$lang->js->confirmDelete         = 'Do you want to delete it?';
$lang->js->confirmFinish         = 'Do you want to finish it?';
$lang->js->deleteing             = 'Deleting...';
$lang->js->doing                 = 'Processing...';
$lang->js->timeout               = 'Timeout';
$lang->js->confirmDiscardChanges = 'Cancel changes?';
$lang->js->yes                   = 'Yes';
$lang->js->no                    = 'No';

/* The main menus. */
$lang->menu = new stdclass();
$lang->menu->user    = 'User|user|admin|';
$lang->menu->group   = 'Group|group|browse|';
$lang->menu->entry   = 'Entry|entry|admin|';
$lang->menu->setting = 'Setting|setting|xuanxuan|';

$lang->index   = new stdclass();
$lang->user    = new stdclass();
$lang->file    = new stdclass();
$lang->tree    = new stdclass();
$lang->mail    = new stdclass();
$lang->dept    = new stdclass();
$lang->block   = new stdclass();
$lang->action  = new stdclass();
$lang->setting = new stdclass();

$lang->group   = new stdclass(); 

/* Menu entry. */
$lang->entry       = new stdclass();
$lang->entry->menu = new stdclass();
$lang->entry->menu->admin    = array('link' => 'API|entry|admin|', 'alias' => 'edit, integration, style, zentaoAdmin');
$lang->entry->menu->create   = array('link' => 'Create|entry|create|');
$lang->entry->menu->category = 'Category|entry|category|';

/* Menu system. */
$lang->system       = new stdclass();
$lang->system->menu = new stdclass();
$lang->system->menu->mail   = array('link' => 'EMail|mail|admin|', 'alias' => 'detect,edit,save,test');
$lang->system->menu->trash  = array('link' => 'Trash|action|trash|');
$lang->system->menu->cron   = 'Cron|cron|index|';
$lang->system->menu->backup = 'Backup|backup|index|';

$lang->menuGroups = new stdclass();

/* Menu of mail module. */
$lang->mail = new stdclass();
$lang->mail->menu = $lang->system->menu;
$lang->menuGroups->mail = 'system';

/* Menu of action module. */
$lang->action = new stdclass();
$lang->action->menu = $lang->system->menu;
$lang->menuGroups->action = 'system';

/* Menu of cron module. */
$lang->cron = new stdclass();
$lang->cron->menu = $lang->system->menu;
$lang->menuGroups->cron = 'system';

/* Menu of backup module. */
$lang->backup = new stdclass();
$lang->backup->menu = $lang->system->menu;
$lang->menuGroups->backup = 'system';

/* The error messages. */
$lang->error = new stdclass();
$lang->error->length       = array("<strong>%s</strong> length should be <strong>%s</strong>", "<strong>%s</strong> length should between <strong>%s</strong> and <strong>%s</strong>.");
$lang->error->reg          = "<strong>%s</strong> should like <strong>%s</strong>";
$lang->error->unique       = "<strong>%s</strong> has <strong>%s</strong> already. If you are sure this record has been deleted, you can restore it in admin panel, trash page.";
$lang->error->notempty     = "<strong>%s</strong> can not be empty.";
$lang->error->empty        = "<strong>%s</strong> must be empty.";
$lang->error->equal        = "<strong>%s</strong> must be <strong>%s</strong>.";
$lang->error->gt           = "<strong>%s</strong> should be greater than <strong>%s</strong>.";
$lang->error->ge           = "<strong>%s</strong> should be not less than <strong>%s</strong>.";
$lang->error->lt           = "<strong>%s</strong> should be less than <strong>%s</strong>";
$lang->error->le           = "<strong>%s</strong> should be no greater than <strong>%s</strong>.";
$lang->error->in           = '<strong>%s</strong> must in<strong>%s</strong>。';
$lang->error->int          = array("<strong>%s</strong> should be interger", "<strong>%s</strong> should between <strong>%s - %s</strong>.");
$lang->error->float        = "<strong>%s</strong> should be a interger or float.";
$lang->error->email        = "<strong>%s</strong> should be email.";
$lang->error->URL          = "<strong>%s</strong> should be url.";
$lang->error->date         = "<strong>%s</strong> should be date";
$lang->error->code         = '<strong>%s</strong> should be a combination of letters or numbers.';
$lang->error->account      = "<strong>%s</strong> should be a valid account.";
$lang->error->passwordsame = "Passwords must be the same";
$lang->error->passwordrule = "Password should 6 characters at least.";
$lang->error->captcha      = 'Captcah error.';
$lang->error->noWritable   = '%s cannot write. Please modify permissions!';
$lang->error->noConvertFun = 'Iconv and mb_convert_encoding do not exist. You cannot convert data into the desired coding!';
$lang->error->noCurlExt    = 'No curl extension.';
$lang->error->notInt       = '<strong>%s</strong> should be not a interger.';
$lang->error->pasteImg     = 'Your browser does not support paste pictures.';
$lang->error->accessDenied = 'Access Denied';
$lang->error->deny         = "Sorry, you don't have the permission to access <b>%s</b>'s <b>%s</b>. Please contact the administrator.";

/* The pager items. */
$lang->pager = new stdclass();
$lang->pager->noRecord     = "No records yet.";
$lang->pager->digest       = "<strong>%s</strong> records, <strong>%s</strong> per page, <strong>%s/%s</strong> ";
$lang->pager->recPerPage   = "<strong>%s</strong> per page";
$lang->pager->first        = " First";
$lang->pager->pre          = " Prev";
$lang->pager->next         = " Next";
$lang->pager->last         = " Last";
$lang->pager->locate       = "GO!";
$lang->pager->showMore     = 'Show more <i class="icon icon-double-angle-down"></i>';
$lang->pager->noMore       = 'No more';
$lang->pager->showTotal    = 'Show <strong>%s</strong> of <strong>%s</strong>';
$lang->pager->previousPage = "Previous";
$lang->pager->nextPage     = "Next";
$lang->pager->summery      = "<strong>%s-%s</strong> of <strong>%s</strong>.";

$lang->date = new stdclass();
$lang->date->minute = 'minute';
$lang->date->day    = 'day';

$lang->genderList = new stdclass();
$lang->genderList->m = 'Male';
$lang->genderList->f = 'Female';
$lang->genderList->u = '';

/* datepicker 时间*/
$lang->datepicker = new stdclass();

$lang->datepicker->dpText = new stdclass();
$lang->datepicker->dpText->TEXT_OR          = 'Or ';
$lang->datepicker->dpText->TEXT_PREV_YEAR   = 'Last Year';
$lang->datepicker->dpText->TEXT_PREV_MONTH  = 'Last Month';
$lang->datepicker->dpText->TEXT_PREV_WEEK   = 'Last Week';
$lang->datepicker->dpText->TEXT_YESTERDAY   = 'Yesterday';
$lang->datepicker->dpText->TEXT_THIS_YEAR   = 'This Year';
$lang->datepicker->dpText->TEXT_THIS_MONTH  = 'This Month';
$lang->datepicker->dpText->TEXT_THIS_WEEK   = 'This Week';
$lang->datepicker->dpText->TEXT_TODAY       = 'Today';
$lang->datepicker->dpText->TEXT_NEXT_YEAR   = 'Next Year';
$lang->datepicker->dpText->TEXT_NEXT_MONTH  = 'Next Month';
$lang->datepicker->dpText->TEXT_CLOSE       = 'Close';
$lang->datepicker->dpText->TEXT_DATE        = 'Time Frame';
$lang->datepicker->dpText->TEXT_CHOOSE_DATE = 'Choose date';

$lang->datepicker->dayNames     = array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
$lang->datepicker->abbrDayNames = array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
$lang->datepicker->monthNames   = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

/* Date times. */
if(!defined('DT_DATETIME1'))  define('DT_DATETIME1',  'Y-m-d H:i:s');
if(!defined('DT_DATETIME2'))  define('DT_DATETIME2',  'Y-m-d H:i');
if(!defined('DT_DATETIME3'))  define('DT_DATETIME3',  'y-m-d H:i');
if(!defined('DT_MONTHTIME1')) define('DT_MONTHTIME1', 'n/d H:i');
if(!defined('DT_MONTHTIME2')) define('DT_MONTHTIME2', 'F j, H:i');
if(!defined('DT_DATE1'))      define('DT_DATE1',      'Y-m-d');
if(!defined('DT_DATE2'))      define('DT_DATE2',      'Ymd');
if(!defined('DT_DATE3'))      define('DT_DATE3',      'F j, Y ');
if(!defined('DT_DATE4'))      define('DT_DATE4',      'M j');
if(!defined('DT_DATE5'))      define('DT_DATE5',      'M Y');
if(!defined('DT_TIME1'))      define('DT_TIME1',      'H:i:s');
if(!defined('DT_TIME2'))      define('DT_TIME2',      'H:i');

include (dirname(__FILE__) . '/menuOrder.php');
