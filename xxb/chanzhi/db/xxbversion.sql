CREATE TABLE `eps_xxb_version` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `xxcVersion` varchar(10) NOT NULL DEFAULT '',
  `xxcDesc` text NOT NULL,
  `xxcDownload` text NOT NULL,
  `xxdVersion` varchar(10) NOT NULL DEFAULT '',
  `xxdDesc` text NOT NULL,
  `xxdDownload` text NOT NULL,
  `xxbVersion` varchar(10) NOT NULL DEFAULT '',
  `xxbDesc` text NOT NULL,
  `xxbDownload` text NOT NULL,
  `lang` varchar(10) NOT NULL DEFAULT 'all',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;