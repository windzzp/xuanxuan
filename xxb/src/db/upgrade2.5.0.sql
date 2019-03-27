ALTER TABLE `xxb_block` DROP INDEX `accountAppOrder`;
ALTER TABLE `xxb_block` DROP INDEX `account`;
ALTER TABLE `xxb_config` DROP INDEX `unique`;
ALTER TABLE `xxb_lang` DROP INDEX `lang`;

ALTER TABLE `xxb_block` DROP `app`;
ALTER TABLE `xxb_config` DROP `app`;
ALTER TABLE `xxb_lang` DROP `app`;

ALTER TABLE `xxb_block` ADD UNIQUE INDEX `accountAppOrder` (`account`, `order`);
ALTER TABLE `xxb_block` ADD INDEX `account` (`account`);
ALTER TABLE `xxb_config` ADD UNIQUE INDEX `unique` (`owner`, `module`, `section`, `key`);
ALTER TABLE `xxb_lang` ADD INDEX `lang` (`lang`, `module`, `section`, `key`);

