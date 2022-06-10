-- MySQL dump 10.11
--
-- Host: localhost    Database: mobdub_development
-- ------------------------------------------------------
-- Server version	5.0.51a

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `areas` (
  `id` int(11) NOT NULL auto_increment,
  `video_id` int(11) default NULL,
  `title` varchar(512) default NULL,
  `href` varchar(1024) default NULL,
  `shape` varchar(50) default NULL,
  `coords` varchar(100) default NULL,
  `begin` decimal(10,3) default NULL,
  `end` decimal(10,3) default NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (5,1,'Nose',NULL,'rect','47.312%,46.681%,63.156%,62.514%','2.471','5.471','2008-05-15 20:59:17','2008-05-15 20:59:17'),(6,1,'Ear',NULL,'rect','23.875%,34.278%,35.750%,49.000%','2.183','5.183','2008-05-15 21:02:16','2008-05-15 21:02:16'),(17,1,'Shock',NULL,'rect','35.333%,16.444%,61.375%,58.111%','23.203','24.548','2008-05-16 17:02:05','2008-05-16 17:02:05'),(18,1,'Phone Salesman!',NULL,'rect','41.719%,12.583%,69.844%,57.306%','10.803','13.829','2008-05-16 17:04:40','2008-05-16 17:04:40'),(20,2,'She was more like a...',NULL,'rect','33.542%,10.278%,61.271%,46.694%','6.241','9.241','2008-05-23 16:06:35','2008-05-23 16:06:35'),(21,2,'Who will dance on the floor...',NULL,'rect','37.917%,15.833%,77.542%,63.431%','25.927','28.927','2008-05-23 16:09:55','2008-05-23 16:09:55'),(22,3,'Nice titling!',NULL,'rect','10.365%,33.833%,95.604%,70.514%','1.712','4.712','2008-05-23 17:39:41','2008-05-23 17:39:41');
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `partners` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) default NULL,
  `url` varchar(100) default NULL,
  `script` varchar(100) default NULL,
  `pattern` varchar(512) default NULL,
  `link_url` varchar(1024) default NULL,
  `embed_src` varchar(1024) default NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES (1,'Mobdub','http://www.mobdub.com','mobdub.js.erb','','/videos?video_uri={VIDEO_URI}','{VIDEO_URI}','2008-05-09 18:33:49','2008-05-16 17:13:45'),(2,'YouTube','http://www.youtube.com','youtube.js.erb','/(?:watch\\?)?v[=/]([\\w_-]+)','/watch?v={VIDEO_URI}','/v/{VIDEO_URI}&enablejsapi=1&playerapiid=ytplayer','2008-05-11 00:34:31','2008-05-23 12:35:51');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schema_info`
--

DROP TABLE IF EXISTS `schema_info`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `schema_info` (
  `version` int(11) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `schema_info`
--

LOCK TABLES `schema_info` WRITE;
/*!40000 ALTER TABLE `schema_info` DISABLE KEYS */;
INSERT INTO `schema_info` VALUES (3);
/*!40000 ALTER TABLE `schema_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `videos` (
  `id` int(11) NOT NULL auto_increment,
  `partner_id` int(11) default NULL,
  `title` varchar(512) default NULL,
  `uri` varchar(1024) default NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,1,'VideoOne','paul_potts.flv',NULL,'2008-05-15 16:54:11'),(2,2,'David Cook Sings Billie Jean','h_aiawC-9aM','2008-05-16 17:08:48','2008-05-16 17:08:48'),(3,2,'Indiana Jones and the Song of Theme','fTrK4VQG93Y','2008-05-23 17:06:06','2008-05-23 17:06:06'),(4,2,'Giant LEGO Builder','VFGVzt7c5bY','2008-05-23 17:41:57','2008-05-23 17:41:57'),(5,2,'Fantasia Summertime','4rOCwVsSW0Y','2008-05-23 17:43:44','2008-05-23 17:43:44');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2008-05-31 22:08:45
