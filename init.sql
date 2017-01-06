SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS  `engine_config`;
CREATE TABLE `engine_config` (
  `name` varchar(32) NOT NULL,
  `config` text NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  `engine_test_cpu_10s`;
CREATE TABLE `engine_test_cpu_10s` (
  `time_bucket` int(11) NOT NULL,
  `iowait` double(8,0) NOT NULL,
  `usage` double(8,2) NOT NULL,
  `engine_name` varchar(20) NOT NULL,
  PRIMARY KEY (`time_bucket`,`engine_name`),
  KEY `timebucketindex` (`time_bucket`) USING BTREE,
  KEY `enginenameindex` (`engine_name`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  `engine_test_dbsize_10s`;
CREATE TABLE `engine_test_dbsize_10s` (
  `time_bucket` int(11) NOT NULL,
  `dbsize` int(11) NOT NULL,
  `engine_name` varchar(20) NOT NULL,
  PRIMARY KEY (`time_bucket`,`engine_name`),
  KEY `engine_name` (`engine_name`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  `engine_test_diskinfo_10s`;
CREATE TABLE `engine_test_diskinfo_10s` (
  `time_bucket` int(11) NOT NULL,
  `diskinfo` text,
  `engine_name` varchar(20) NOT NULL,
  PRIMARY KEY (`time_bucket`,`engine_name`),
  KEY `enginename` (`engine_name`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  `engine_test_memory_10s`;
CREATE TABLE `engine_test_memory_10s` (
  `time_bucket` int(11) NOT NULL,
  `free_memory` int(11) NOT NULL COMMENT 'MB',
  `cached_memory` int(11) NOT NULL COMMENT 'MB',
  `used_memory` int(11) NOT NULL COMMENT 'MB',
  `engine_name` varchar(20) NOT NULL,
  `total_memory` int(11) NOT NULL COMMENT 'MB',
  PRIMARY KEY (`time_bucket`,`engine_name`),
  KEY `time_bucket` (`time_bucket`) USING BTREE,
  KEY `engine_name` (`engine_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  `engine_test_ops_10s`;
CREATE TABLE `engine_test_ops_10s` (
  `time_bucket` int(11) NOT NULL,
  `ops` int(11) NOT NULL,
  `ops_type` int(11) NOT NULL,
  `engine_name` varchar(20) NOT NULL,
  PRIMARY KEY (`time_bucket`,`ops_type`,`engine_name`),
  KEY `engine_name` (`engine_name`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

