<?php
$config->menus->content .= ',xxbversion';
$config->rights->guest['xxbversion']['index']  = 'index';
if(!defined('TABLE_XXB_VERSION')) define('TABLE_XXB_VERSION', '`' . $config->db->prefix . 'xxb_version`');