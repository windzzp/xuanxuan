<?php
/**
 * The configure xxbversion view file of setting module of RanZhi.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Memory <lvtao@cnezsoft.com>
 * @package     setting
 * @version     $Id$
 * @link        http://www.ranzhico.com
 */
?>
<?php include '../../common/view/header.html.php';?>
<div class="panel">
  <div class="panel-heading">
    <strong><?php echo $lang->chat->version;?></strong>
    <div class="panel-actions pull-right">
      <a href="<?php echo helper::createLink('chat', 'getXXCUpdate');?>" class="btn btn-primary" data-toggle='modal'><?php echo $lang->chat->checkUpdate?></a>
      <a href="<?php echo helper::createLink('chat', 'createXXCVersion');?>" class="btn btn-primary"><?php echo $lang->add;?></a>
    </div>
  </div>
  <table class='table table-hover table-border'>
    <thead>
    <tr class="text-center">
      <th class="w-80px"><?php echo $lang->chat->id?></th>
      <th class="w-150px"><?php echo $lang->chat->xxcVersion?></th>
      <th class="text-left"><?php echo $lang->chat->xxcDesc?></th>
      <th class="w-150px"><?php echo $lang->chat->strategy?></th>
      <th class="w-150px"><?php echo $lang->actions?></th>
    </tr>
    </thead>
    <tbody>
    <?php foreach($versions as $version):?>
    <tr class="text-center">
      <td><?php echo $version->id?></td>
      <td><?php echo $version->version?></td>
      <td class="text-left"><?php echo $version->readme?></td>
      <td><?php echo $lang->chat->strategies[$version->strategy]?></td>
      <td>
        <?php
        commonModel::printLink('sys.chat', 'editXXCVersion', "id={$version->id}", $lang->edit);
        commonModel::printLink('sys.chat', 'deleteXXCVersion', "id={$version->id}", $lang->delete, "class='deleter'");
        ?>
      </td>
    </tr>
    <?php endforeach;?>
    </tbody>
  </table>
</div>
<?php include '../../common/view/footer.html.php';?>
