<?php
/**
 * The debug view file of chat module of XXB.
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
<div class="panel-group" id="accordionPanels" aria-multiselectable="true">
  <?php if($versions) foreach($versions as $version):?>
  <div class="panel panel-default">
    <div class="panel-heading" id="headingOne">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordionPanels" href="#collapse_<?php echo $version->id;?>"><?php echo $version->xxcVersion?></a>
      </h4>
    </div>
    <div id="collapse_<?php echo $version->id;?>" class="panel-collapse collapse">
      <div class="panel-body">
        <div class="panel panel-default">
          <div class="panel-heading"><?php echo $lang->client->xxcVersion;?> <?php echo $version->xxcVersion;?></div>
          <table class="table table-form">
            <tr>
              <th class="w-100px"><?php echo $lang->client->changeLog;?>：</th>
              <td><?php echo $version->xxcDesc;?></td>
            </tr>
            <?php if($version->xxcDownload) foreach($version->xxcDownload as $system => $link):?>
            <tr>
              <th><?php echo $system;?>：</th>
              <td><?php echo $link;?></td>
            </tr>
            <?php endforeach;?>
          </table>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading"><?php echo $lang->client->xxdVersion;?> <?php echo $version->xxdVersion;?></div>
          <table class="table table-form">
            <tr>
              <th class="w-100px"><?php echo $lang->client->changeLog;?>：</th>
              <td><?php echo $version->xxdDesc;?></td>
            </tr>
              <?php if($version->xxdDownload) foreach($version->xxdDownload as $system => $link):?>
              <tr>
                <th><?php echo $system;?>：</th>
                <td><?php echo $link;?></td>
              </tr>
              <?php endforeach;?>
          </table>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading"><?php echo $lang->client->xxbVersion;?> <?php echo $version->xxbVersion;?></div>
          <table class="table table-form">
            <tr>
              <th class="w-100px"><?php echo $lang->client->changeLog;?>：</th>
              <td><?php echo $version->xxbDesc;?></td>
            </tr>
              <?php if($version->xxbDownload) foreach($version->xxbDownload as $system => $link):?>
              <tr>
                <th><?php echo $system;?>：</th>
                <td><?php echo $link;?></td>
              </tr>
              <?php endforeach;?>
          </table>
        </div>
      </div>
    </div>
  </div>
  <?php endforeach;?>
</div>
<?php include '../../common/view/footer.modal.html.php';?>
