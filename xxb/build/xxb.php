<?php
include dirname(__DIR__) . '/config/xxb.php';

$ranzhiSQL = file_get_contents(dirname(__DIR__) . '/zdoo/db/ranzhi.sql');
preg_match_all('/(--(.*)CREATE (.*));/isU', $ranzhiSQL, $matches);

$sql = '';
foreach($matches[0] as $match)
{
    preg_match('/EXISTS `(.*)`/', $match, $table);
    if(empty($table[1]) || !in_array($table[1], $tables)) continue;
    $sql .= $match . "\r";
}

file_put_contents(dirname(__DIR__) . '/xxb/db/xxb.sql', $sql);

$str = <<<EOT
$("#entryForm #visible").parent().parent().addClass('hidden');
$(".entry-version, .entry-files").show();
$("#platformxuanxuan").selected().parent().parent().parent().hide();
EOT;
file_put_contents('xxb/app/sys/entry/js/common.js', $str, FILE_APPEND);

`sed -i '1a\$lang->system->menu = new stdClass();' xxb/app/sys/common/ext/lang/zh-cn/xuanxuan.php`;
`sed -i '1a\$lang->system->menu = new stdClass();' xxb/app/sys/common/ext/lang/en/xuanxuan.php`;
