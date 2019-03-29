ALTER TABLE `xxb_user` CHANGE `status` `clientStatus` enum('online', 'away', 'busy', 'offline') NOT NULL DEFAULT 'offline';
