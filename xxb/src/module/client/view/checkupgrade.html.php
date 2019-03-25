<?php
/**
 * The checkUpgrade view file of client module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Gang Liu <liugang@cnezsoft.com>
 * @package     chat
 * @version     $Id$
 * @link        http://xuan.im
 */
?>
<?php include '../../common/view/header.modal.html.php';?>
<?php js::set('downloading', $lang->client->downloading)?>
<?php js::set('downloadFail', $lang->client->downloadFail)?>
<?php js::set('downloadSuccess', $lang->client->downloadSuccess)?>
<div class="panel-group" id="accordionPanels" aria-multiselectable="true">
  <div class="alert alert-success"><?php echo $lang->client->downloadTip;?></div>
  <?php if($versions) foreach($versions as $version):?>
  <div class="panel panel-default">
    <div class="panel-heading" id="headingOne">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordionPanels" href="#collapse_<?php echo $version->id;?>"><?php echo $version->xxcVersion?></a>
      </h4>
    </div>
    <div id="collapse_<?php echo $version->id;?>" class="panel-collapse collapse">
      <div class="panel-body">
        <table class="table table-form">
          <tr>
            <th class="w-150px"><?php echo $lang->client->changeLog;?>：</th>
            <td><?php echo $version->xxcDesc;?></td>
          </tr>
          <?php foreach($lang->client->zipList as $zip => $system):?>
          <tr>
            <th><?php echo $system;?>：</th>
            <td><?php echo zget($version->xxcDownload, $zip);?> <a class="download" href="javascript:void(0);" data-link="<?php echo zget($version->xxcDownload, $zip);?>" data-version="<?php echo $version->xxcVersion?>" data-os="<?php echo $zip?>"><?php echo $lang->client->download?></a></td>
          </tr>
          <?php endforeach;?>
        </table>
      </div>
    </div>
  </div>
  <?php endforeach;?>
</div>
<?php include '../../common/view/footer.modal.html.php';?>
