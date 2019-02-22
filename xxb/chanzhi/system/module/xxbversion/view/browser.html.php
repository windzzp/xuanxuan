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
    <strong><i class="icon-th-large"></i> <?php echo $lang->xxbversion->browse;?></strong>
    <div class='panel-actions'>
      <?php commonModel::printLink('xxbversion', 'create', '', '<i class="icon-plus"></i> ' . $lang->xxbversion->create, 'class="btn btn-primary"');?>
    </div>
  </div>
  <table class='table table-hover table-striped tablesorter table-fixed'>
    <?php $vars = "recTotal={$pager->recTotal}&recPerPage={$pager->recPerPage}";?>
    <thead>
    <tr>
      <th class='text-center w-60px'><?php echo $lang->xxbversion->id;?></th>
      <th class='text-center'><?php echo $lang->xxbversion->xxcVersion;?></th>
      <th class='text-center'><?php echo $lang->xxbversion->xxbVersion;?></th>
      <th class='text-center'><?php echo $lang->xxbversion->xxdVersion;?></th>
      <th class='text-center actions'><?php echo $lang->actions;?></th>
    </tr>
    </thead>
    <tbody>
    <?php foreach($versions as $version):?>
    <tr>
      <td class="text-center"><?php echo $version->id?></td>
      <td class="text-center"><?php echo $version->xxcVersion?></td>
      <td class="text-center"><?php echo $version->xxbVersion?></td>
      <td class="text-center"><?php echo $version->xxdVersion?></td>
      <td class="text-center">
        <?php commonModel::printLink('xxbversion', 'edit', "id=$version->id", $lang->edit);?>
        <?php commonModel::printLink('xxbversion', 'delete', "id=$version->id", $lang->delete, 'class="deleter"');?>
      </td>
    </tr>
    <?php endforeach;?>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="5"><?php $pager->show();?></td>
    </tr>
    </tfoot>
  </table>
</div>
<?php include '../../common/view/footer.admin.html.php';?>