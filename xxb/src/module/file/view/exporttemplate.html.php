<?php
/**
 * The export template view file of file module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Gang Liu <liugang@cnezsoft.com>
 * @package     file 
 * @version     $Id$
 * @link        http://xuan.im
 */
?>
<?php include '../../../common/view/header.lite.html.php';?>
<script>
function setDownloading()
{
    if(/opera/.test(navigator.userAgent.toLowerCase())) return true;   // Opera don't support, omit it.

    $.cookie('downloading', 0);
    time = setInterval("closeWindow()", 300);
    return true;
}

function closeWindow()
{
    if($.cookie('downloading') == 1)
    {
        parent.$.zui.closeModal();
        $.cookie('downloading', null);
        clearInterval(time);
    }
}
<?php if(!class_exists('ZipArchive')):?>
$().ready(function()
{
    $('#fileType').change(function()
    {
        if($(this).val() == 'xlsx')
        {
            $(this).val('xls');
            $('#phpZipNotice').html(v.lang.installZipExtension).show().fadeOut(10000);
        }
    });
});
<?php endif;?>
</script>
<form class='form-condensed' method='post' target='hiddenwin' onsubmit='setDownloading();' style='padding: 0 5% 30px'>
  <table class='w-p100'>
    <tr>
      <td>
        <div class='input-group'>
          <span class='input-group-addon'><?php echo $lang->setFileNum;?></span>
          <?php echo html::input('num', '10', 'class=form-control');?>
          <span class='input-group-addon fix-border'><?php echo $lang->setFileType;?></span>
          <?php echo html::select('fileType', array('xls' => 'xls', 'xlsx' => 'xlsx'), 'xls', "class='form-control'");?>
        </div>
      </td>
      <td><?php echo html::submitButton($lang->export);?></td>
    </tr>
    <tr>
      <td>
        <?php if(!class_exists('ZipArchive')):?> <div class='text-danger' id="phpZipNotice"></div> <?php endif;?>
      </td>
    </tr>
  </table>
</form>
<iframe id='hiddenwin' name='hiddenwin' class='hidden'></iframe>
<?php include '../../../common/view/footer.html.php';?>
