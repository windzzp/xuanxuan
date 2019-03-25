UPDATE `xxb_config` SET `key` = 'backendLang' WHERE `owner` = 'system' AND `module` = 'common' AND `section` = 'xuanxuan' AND `key` = 'xxbLang';

UPDATE `xxb_grouppriv` SET `module` = 'client', `method` = 'browse' WHERE `module` = 'setting' AND `method` = 'xxcversion';
UPDATE `xxb_grouppriv` SET `module` = 'client', `method` = 'create' WHERE `module` = 'setting' AND `method` = 'createxxcversion';
UPDATE `xxb_grouppriv` SET `module` = 'client', `method` = 'edit'   WHERE `module` = 'setting' AND `method` = 'editxxcversion';
UPDATE `xxb_grouppriv` SET `module` = 'client', `method` = 'delete' WHERE `module` = 'setting' AND `method` = 'deletexxcversion';

RENAME TABLE `im_xxcversion` TO `im_client`;

ALTER TABLE `im_client` CHANGE `readme` `changeLog` text NOT NULL;
ALTER TABLE `im_client` ADD `status` ENUM('release','notRelease')  NOT NULL  DEFAULT 'notRelease'  AFTER `editedBy`;
