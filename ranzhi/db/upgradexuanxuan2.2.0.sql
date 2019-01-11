ALTER TABLE `sys_user` CHANGE `status` `clientStatus` enum('online', 'away', 'busy', 'offline') NOT NULL DEFAULT 'offline';

ALTER TABLE `im_message` ADD `deleted` enum('0','1') COLLATE 'utf8_general_ci' NOT NULL;
