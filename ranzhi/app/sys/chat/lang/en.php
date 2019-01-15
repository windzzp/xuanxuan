<?php
$lang->chat->settings = 'Xuanxuan Settings';
$lang->chat->debug    = 'Debug';

$lang->chat->version     = 'Version';
$lang->chat->xxbLang     = 'Server Lang';
$lang->chat->key         = 'Secret';
$lang->chat->systemGroup = 'System';
$lang->chat->url         = 'URL';
$lang->chat->createKey   = 'New';
$lang->chat->connector   = ', ';
$lang->chat->viewDebug   = 'View Debug';
$lang->chat->log         = 'Log';

$lang->chat->debugStatus[0] = 'Off';
$lang->chat->debugStatus[1] = 'On';

$lang->chat->notAdmin         = 'You are not admin of chat.';
$lang->chat->notSystemChat    = 'It is not a system chat.';
$lang->chat->notGroupChat     = 'It is not a group chat.';
$lang->chat->notPublic        = 'It is not a public chat.';
$lang->chat->cantChat         = 'No rights to chat.';
$lang->chat->chatHasDismissed = 'The chat group has been dismissed.';
$lang->chat->needLogin        = 'You need login first.';
$lang->chat->notExist         = 'Chat do not exist.';
$lang->chat->changeRenameTo   = 'Rename chat to ';
$lang->chat->multiChats       = 'Messages belong to different chats.';
$lang->chat->notInGroup       = 'You are not in this chat group.';
$lang->chat->errorKey         = 'The key should be a 32 byte string including letters or numbers.';
$lang->chat->debugTips        = 'Xuanxuan is working.<br>%s with administrator to get more information.';
$lang->chat->noLogFile        = 'No log file.';

$lang->chat->broadcast = new stdclass();
$lang->chat->broadcast->createChat  = '@%s created the group **[%s](#/chats/groups/%s)**.';
$lang->chat->broadcast->joinChat    = '@%s joined.';
$lang->chat->broadcast->quitChat    = '@%s quited.';
$lang->chat->broadcast->renameChat  = '@%s renamed the group to **[%s](#/chats/groups/%s)**.';
$lang->chat->broadcast->inviteUser  = '@%s invited %s to join.';
$lang->chat->broadcast->dismissChat = '@%s dismissed the group.';
