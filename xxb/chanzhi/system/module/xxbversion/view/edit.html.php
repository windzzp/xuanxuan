<?php
/**
 * The admin view file of xxbversion of chanzhiEPS.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPLV1.2 (http://zpl.pub/page/zplv12.html)
 * @author      Memory <lvtao@cnezsoft.com>
 * @package     wechat
 * @version     $Id$
 * @link        http://www.chanzhi.org
 */
?>
<?php include '../../common/view/header.admin.html.php';?>
<div class="panel">
  <div class="panel-heading">
    <strong><i class="icon-plus"></i> <?php echo $lang->xxbversion->create;?></strong>
  </div>
  <div class='panel-body'>
    <form method='post' role='form' id='ajaxForm'>
      <table class='table table-form w-p70'>
        <tr>
          <th><?php echo $lang->xxbversion->xxcVersion;?></th>
          <td colspan='2'>
            <div class='required required-wrapper'></div>
            <?php echo html::input('xxcVersion', $version->xxcVersion, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxcDesc;?></th>
          <td colspan='2'>
            <?php echo html::textarea('xxcDesc', $version->xxcDesc, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxcDownload;?></th>
          <td colspan='2'>
            <table class='table table-borderless'>
              <?php foreach($config->xxbversion->downloadGroup['xxc'] as $system):?>
              <tr>
                <th class="w-160px text-right"><?php echo $lang->xxbversion->system[$system]?></th>
                <td><?php echo html::input("xxcDownload[{$system}]", $version->xxcDownload->$system, "class='form-control'");?></td>
              </tr>
              <?php endforeach;?>
            </table>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxdVersion;?></th>
          <td colspan='2'>
            <div class='required required-wrapper'></div>
              <?php echo html::input('xxdVersion', $version->xxdVersion, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxdDesc;?></th>
          <td colspan='2'>
              <?php echo html::textarea('xxdDesc', $version->xxdDesc, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxdDownload;?></th>
          <td colspan='2'>
            <table class='table table-borderless'>
              <?php foreach($config->xxbversion->downloadGroup['xxd'] as $system):?>
              <tr>
                <th class="w-160px text-right"><?php echo $lang->xxbversion->system[$system]?></th>
                <td><?php echo html::input("xxdDownload[{$system}]", $version->xxdDownload->$system, "class='form-control'");?></td>
              </tr>
              <?php endforeach;?>
            </table>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxbVersion;?></th>
          <td colspan='2'>
            <div class='required required-wrapper'></div>
              <?php echo html::input('xxbVersion', $version->xxbVersion, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxbDesc;?></th>
          <td colspan='2'>
              <?php echo html::textarea('xxbDesc', $version->xxbDesc, "class='form-control'");?>
          </td>
        </tr>
        <tr>
          <th><?php echo $lang->xxbversion->xxbDownload;?></th>
          <td colspan='2'>
            <table class='table table-borderless'>
              <?php foreach($config->xxbversion->downloadGroup['xxb'] as $system):?>
              <tr>
                <th class="w-160px text-right"><?php echo $lang->xxbversion->system[$system]?></th>
                <td><?php echo html::input("xxbDownload[{$system}]", $version->xxbDownload->$system, "class='form-control'");?></td>
              </tr>
              <?php endforeach;?>
            </table>
          </td>
        </tr>
        <tr>
          <td></td>
          <td colspan='2'><?php echo html::submitButton();?></td>
        </tr>
      </table>
    </form>
  </div>
</div>
<?php include '../../common/view/footer.admin.html.php';?>