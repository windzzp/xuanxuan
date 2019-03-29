<?php
/**
 * The manage privilege by group view of group module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Xiying Guan <guanxiying@xirangit.com>
 * @package     group
 * @version     $Id: managepriv.html.php 1517 2011-03-07 10:02:57Z wwccss $
 * @link        http://xuan.im
 */
?>
<div class='list'>
  <form class='form' id='ajaxForm' method='post'>
    <div class='item'>
      <div class='item-content'>
        <table class='table table-hover table-bordered table-priv'>
          <?php $i = 1;?>
          <?php foreach($lang->resource as $moduleName => $moduleActions):?>
          <?php if(!in_array($moduleName, $lang->moduleOrder)) continue;?>
          <?php if(!$this->group->checkMenuModule($menu, $moduleName)) continue;?>
          <?php
          $this->app->loadLang($moduleName);
          /* Check method in select version. */
          if($version)
          {
              $hasMethod = false;
              foreach($moduleActions as $action => $actionLabel)
              {
                  if(strpos($changelogs, ",$moduleName-$actionLabel,") !== false)
                  {
                      $hasMethod = true;
                      break;
                  }
              }
              if(!$hasMethod) continue;
          }
          ?>
          <tr>
            <th class='text-right w-120px'>
              <label class="checkbox-inline">
                <?php echo isset($this->lang->$moduleName->common) ? $this->lang->$moduleName->common : $moduleName;?>
                <input type="checkbox" class='checkModule' />
              </label>
            </th>
            <td id='<?php echo $moduleName;?>'>
              <?php
              $options = array();
              foreach($moduleActions as $action => $actionLabel)
              {
                  if(!empty($version) and strpos($changelogs, ",$moduleName-$actionLabel,") === false) continue;
                  $options[$action] = is_object($lang->$moduleName->$actionLabel) ? $lang->$moduleName->$actionLabel->common : $lang->$moduleName->$actionLabel;
              }
              echo html::checkbox("actions[$moduleName]", $options, isset($groupPrivs[$moduleName]) ? $groupPrivs[$moduleName] : '');
              ?>
            </td>
          </tr>
          <?php $i++;?>
          <?php endforeach;?>
        </table>
      </div>
    </div>
    <div class='panel'>
      <div class='panel-footer text-center'>
      <?php
      echo html::submitButton($lang->save);
      echo html::linkButton($lang->goback, $this->createLink('group', 'browse'));
      echo html::hidden('foo'); // Just a hidden var, to make sure $_POST is not empty.
      echo html::hidden('noChecked'); // Save the value of no checked.
      ?>
      </div>
    </div>
  </form>
</div>
<script type='text/javascript'>
var groupID = <?php echo $groupID?>;
var menu    = "<?php echo $menu?>";
</script>
