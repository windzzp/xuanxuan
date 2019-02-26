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
<?php include '../../../common/view/header.modal.html.php';?>
<form id='ajaxForm' method='post' action="<?php echo $this->createLink('sys.setting', 'editxxcversion', 'id=' . $version->id)?>">
  <table class='table table-form table-condensed'>
    <tbody>
    <tr>
      <th class='w-120px'><?php echo $lang->chat->xxcVersion?></th>
      <td class="w-p70"><?php echo html::input('version', $version->version, "class='form-control'")?></td>
      <td></td>
    </tr>
    <tr>
      <th><?php echo $lang->chat->xxcDesc?></th>
      <td><?php echo html::input('desc', $version->desc, "class='form-control'")?></td>
      <td></td>
    </tr>
    <tr>
      <th><?php echo $lang->chat->xxcReadme?></th>
      <td><?php echo html::textarea('readme', $version->readme, "class='form-control'")?></td>
      <td></td>
    </tr>
    <tr>
      <th><?php echo $lang->chat->strategy?></th>
      <td><?php echo html::radio('strategy', $lang->chat->strategies, $version->strategy)?></td>
      <td></td>
    </tr>
    <tr>
      <th><?php echo $lang->chat->download?></th>
      <td>
        <?php foreach($lang->chat->osList as $system => $desc):?>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon w-130px"><?php echo $system?>：</span>
            <?php echo html::input("downloads[{$system}]", zget($version->downloads, $system, ''), "class='form-control'")?>
          </div>
        </div>
        <?php endforeach;?>
      </td>
      <td></td>
    </tr>
    <tr>
      <th></th>
      <td><?php echo html::submitButton();?></td>
      <td></td>
    </tr>
    </tbody>
  </table>
</form>
</body>
</html>