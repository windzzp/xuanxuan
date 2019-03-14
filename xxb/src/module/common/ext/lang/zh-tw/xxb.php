<?php
$lang->welcome   = '喧喧後台管理系統';
$lang->ranzhi    = '喧喧';
$lang->agreement = "已閲讀並同意<a href='http://zpl.pub/page/zplv12.html' target='_blank'>《Z PUBLIC LICENSE授權協議1.2》</a>。<span class='text-danger'>未經許可，不得去除、隱藏或遮掩喧喧系統的任何標誌及連結。</span>";
$lang->poweredBy = "<a href='http://www.xuan.im/?v=%s' data-toggle='tooltip' title='{$this->config->buildDate}' target='_blank'>{$lang->ranzhi}%s</a>";

$lang->menu->dashboard = new stdclass();
$lang->menu->dashboard->user    = '組織|user|admin|';
$lang->menu->dashboard->group   = '權限|group|browse|';
$lang->menu->dashboard->entry   = '應用|entry|admin|';
$lang->menu->dashboard->setting = '設置|setting|xuanxuan|';

$lang->menu->sys = $lang->menu->dashboard;

$lang->sys->dashboard->menuOrder[10] = 'user';

unset($lang->entry->menu->webapp);

