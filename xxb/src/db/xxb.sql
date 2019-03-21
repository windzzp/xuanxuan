-- DROP TABLE IF EXISTS `xxb_action`;
CREATE TABLE IF NOT EXISTS `xxb_action` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `customer` mediumint(8) unsigned DEFAULT NULL,
  `contact` mediumint(8) unsigned DEFAULT NULL,
  `objectType` varchar(30) NOT NULL DEFAULT '',
  `objectID` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `actor` varchar(30) NOT NULL DEFAULT '',
  `action` varchar(30) NOT NULL DEFAULT '',
  `date` datetime NOT NULL,
  `comment` text NOT NULL,
  `extra` varchar(255) NOT NULL,
  `read` enum('0', '1') NOT NULL DEFAULT '0',
  `reader` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customer` (`customer`),
  KEY `contact` (`contact`),
  KEY `objectType` (`objectType`),
  KEY `objectID` (`objectID`),
  KEY `date` (`date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_block`;
CREATE TABLE IF NOT EXISTS `xxb_block` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `account` char(30) NOT NULL,
  `title` varchar(100) NOT NULL,
  `source` varchar(20) NOT NULL,
  `block` varchar(20) NOT NULL,
  `params` text NOT NULL,
  `order` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `grid` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `height` smallint(5) unsigned NOT NULL DEFAULT '0',
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `accountAppOrder` (`account`, `order`),
  KEY `account` (`account`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_category`;
CREATE TABLE IF NOT EXISTS `xxb_category` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(30) NOT NULL DEFAULT '',
  `alias` varchar(100) NOT NULL,
  `desc` text NOT NULL,
  `keywords` varchar(150) NOT NULL,
  `root` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `parent` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `path` char(255) NOT NULL DEFAULT '',
  `grade` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `order` smallint(5) unsigned NOT NULL DEFAULT '0',
  `type` char(30) NOT NULL,
  `readonly` enum('0','1') NOT NULL DEFAULT '0',
  `moderators` varchar(255) NOT NULL,
  `threads` smallint(5) NOT NULL,
  `posts` smallint(5) NOT NULL,
  `postedBy` varchar(30) NOT NULL,
  `postedDate` datetime NOT NULL,
  `postID` mediumint(8) unsigned NOT NULL,
  `replyID` mediumint(8) unsigned NOT NULL,
  `users` text NOT NULL,
  `rights` varchar(255) NOT NULL,
  `refund` enum('0','1') NOT NULL DEFAULT '0',
  `major` enum('0','1','2','3','4','5','6','7','8') NOT NULL DEFAULT '0',
  `deleted` enum('0', '1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `order` (`order`),
  KEY `parent` (`parent`),
  KEY `path` (`path`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_config`;
CREATE TABLE IF NOT EXISTS `xxb_config` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `owner` char(30) NOT NULL DEFAULT '',
  `module` varchar(30) NOT NULL,
  `section` char(30) NOT NULL DEFAULT '',
  `key` char(30) DEFAULT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique` (`owner`,`module`,`section`,`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_entry`;
CREATE TABLE IF NOT EXISTS `xxb_entry` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `abbr` char(6) NOT NULL,
  `code` varchar(20) NOT NULL,
  `buildin` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `version` varchar(20) NOT NULL,
  `platform` varchar(255) NOT NULL DEFAULT 'ranzhi',
  `package` int(11) NOT NULL DEFAULT 0,
  `integration` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `open` varchar(20) NOT NULL,
  `key` char(32) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `logo` varchar(100) NOT NULL,
  `login` varchar(255) NOT NULL,
  `logout` varchar(255) NOT NULL,
  `block` varchar(255) NOT NULL,
  `control` varchar(10) NOT NULL DEFAULT 'simple',
  `size` varchar(50) NOT NULL DEFAULT 'max',
  `position` varchar(10) NOT NULL DEFAULT 'default',
  `visible` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `order` tinyint(5) unsigned NOT NULL DEFAULT '0',
  `zentao` enum('0', '1') NOT NULL DEFAULT '0',
  `category` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `status` enum('online','offline') NOT NULL DEFAULT 'online',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_file`;
CREATE TABLE IF NOT EXISTS `xxb_file` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `pathname` char(50) NOT NULL,
  `title` char(90) NOT NULL,
  `extension` char(30) NOT NULL,
  `size` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `objectType` char(30) NOT NULL,
  `objectID` mediumint(8) unsigned NOT NULL,
  `createdBy` char(30) NOT NULL DEFAULT '',
  `createdDate` datetime NOT NULL,
  `editor` enum('1','0') NOT NULL DEFAULT '0',
  `primary` enum('1','0') DEFAULT '0',
  `public` enum('1','0') NOT NULL DEFAULT '1',
  `downloads` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `extra` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `object` (`objectType`,`objectID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_history`;
CREATE TABLE IF NOT EXISTS `xxb_history` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `action` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `field` varchar(30) NOT NULL DEFAULT '',
  `old` text NOT NULL,
  `new` text NOT NULL,
  `diff` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `action` (`action`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_lang`;
CREATE TABLE IF NOT EXISTS `xxb_lang` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `lang` varchar(30) NOT NULL,
  `module` varchar(30) NOT NULL,
  `section` varchar(30) NOT NULL,
  `key` varchar(60) NOT NULL,
  `value` text NOT NULL,
  `system` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `lang` (`lang`,`module`,`section`,`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_sso`;
CREATE TABLE IF NOT EXISTS `xxb_sso` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `sid` char(32) NOT NULL,
  `entry` mediumint(8) unsigned NOT NULL,
  `token` char(32) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sid` (`sid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_user`;
CREATE TABLE IF NOT EXISTS `xxb_user` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `dept` mediumint(8) unsigned NOT NULL,
  `account` char(30) NOT NULL DEFAULT '',
  `password` char(32) NOT NULL DEFAULT '',
  `realname` char(30) NOT NULL DEFAULT '',
  `role` char(30) NOT NULL,
  `nickname` char(60) NOT NULL DEFAULT '',
  `admin` enum('no','common','super') NOT NULL DEFAULT 'no',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `birthday` date NOT NULL,
  `gender` enum('f','m','u') NOT NULL DEFAULT 'u',
  `email` char(90) NOT NULL DEFAULT '',
  `skype` char(90) NOT NULL,
  `qq` char(20) NOT NULL DEFAULT '',
  `weixin` char(50) NOT NULL,
  `yahoo` char(90) NOT NULL DEFAULT '',
  `gtalk` char(90) NOT NULL DEFAULT '',
  `wangwang` char(90) NOT NULL DEFAULT '',
  `site` varchar(100) NOT NULL,
  `mobile` char(11) NOT NULL DEFAULT '',
  `phone` char(20) NOT NULL DEFAULT '',
  `address` char(120) NOT NULL DEFAULT '',
  `zipcode` char(10) NOT NULL DEFAULT '',
  `visits` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `ip` char(50) NOT NULL DEFAULT '',
  `last` datetime NOT NULL,
  `ping` datetime NOT NULL,
  `fails` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `join` datetime NOT NULL,
  `locked` datetime NOT NULL,
  `deleted` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`),
  KEY `admin` (`admin`),
  KEY `accountPassword` (`account`,`password`),
  KEY `dept` (`dept`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_group`;
CREATE TABLE IF NOT EXISTS `xxb_group` (
  `id` mediumint(8) unsigned NOT NULL auto_increment,
  `name` char(30) NOT NULL,
  `desc` char(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_usergroup`;
CREATE TABLE IF NOT EXISTS `xxb_usergroup` (
  `account` char(30) NOT NULL DEFAULT '',
  `group` mediumint(8) unsigned NOT NULL DEFAULT '0',
  UNIQUE KEY `account` (`account`,`group`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- DROP TABLE IF EXISTS `xxb_grouppriv`;
CREATE TABLE IF NOT EXISTS `xxb_grouppriv` (
  `group` mediumint(8) unsigned NOT NULL default '0',
  `module` char(30) NOT NULL default '',
  `method` char(30) NOT NULL default '',
  UNIQUE KEY `group` (`group`,`module`,`method`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
