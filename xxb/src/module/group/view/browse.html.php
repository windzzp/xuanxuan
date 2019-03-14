<?php
/**
 * The browse view file of group module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Xiying Guan <guanxiying@xirangit.com>
 * @package     group
 * @version     $Id: browse.html.php 4769 2013-05-05 07:24:21Z wwccss $
 * @link        http://www.ranzhi.org
 */
?>
<?php include '../../common/view/header.html.php';?>
<div class='panel'>
  <div class='panel-heading'>
    <strong><i class='icon-group'></i> <?php echo $lang->group->browse;?></strong>
    <span class='panel-actions pull-right'><?php echo html::a($this->inlink('create'), $lang->group->create, "class='btn btn-primary' data-toggle='modal'");?></span>
  </div>
  <table class='table table-hover table-striped'>
    <thead>
      <tr>
       <th class='w-50px'><?php echo $lang->group->id;?></th>
       <?php $class = $this->app->clientLang == 'en' ? 'w-130px' : 'w-100px';?>
       <th class='<?php echo $class;?>'><?php echo $lang->group->name;?></th>
       <th class='w-200px visible-lg'><?php echo $lang->group->desc;?></th>
       <th><?php echo $lang->group->users;?></th>
       <?php $class = $this->app->clientLang == 'en' ? 'w-280px' : 'w-240px';?>
       <th class='<?php echo $class;?> text-center'><?php echo $lang->actions;?></th>
      </tr>
    </thead>
    <tbody>
    <?php foreach($groups as $group):?>
    <?php $users = implode(' ', $groupUsers[$group->id]);?>
    <tr>
      <td class='text-center'><?php echo $group->id;?></td>
      <td><?php echo $group->name;?></td>
      <td class='visible-lg'><?php echo $group->desc;?></td>
      <td class='user-list' title='<?php echo $users;?>'>
        <div>
          <?php echo $users;?>
          <a class ="hide-list" href="javascript:#"><?php echo $lang->group->hide;?></a>
        </div>
        <a class ="more-list" href="javascript:#"><?php echo $lang->group->show;?></a> 
      </td>
      <td class='text-center'>
        <?php echo html::a(inlink('manageAppPriv', "type=byGroup&param={$group->id}"), $lang->group->manageAppPriv);?>
        <?php echo html::a(inlink('manageMember', "groupID={$group->id}"), $lang->group->manageMember);?>
        <?php echo html::a(inlink('managePriv', "type=byGroup&param={$group->id}"), $lang->group->managePriv);?>
        <?php echo html::a(inlink('edit', "groupID={$group->id}"), $lang->edit, "data-toggle='modal'");?>
        <?php echo html::a(inlink('delete', "groupID={$group->id}"), $lang->delete, "class='deleter'");?>
      </td>
    </tr>
    <?php endforeach;?>
    </tbody>
  </table>
</div>
<?php include '../../common/view/footer.html.php';?>
