<?php
$config->client->require = new stdclass();
$config->client->require->creat = 'version, strategy, downloads';
$config->client->require->edit  = 'version, strategy, downloads';

$config->client->upgradeApi = 'https://xuan.im/xxbversion-api.json';