-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_community
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_basis`
--

DROP TABLE IF EXISTS `tb_basis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_basis` (
  `basis_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `basis_document_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `basis_community_id` char(32) NOT NULL,
  PRIMARY KEY (`basis_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_basis`
--

LOCK TABLES `tb_basis` WRITE;
/*!40000 ALTER TABLE `tb_basis` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_basis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_case`
--

DROP TABLE IF EXISTS `tb_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_case` (
  `case_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `case_document_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`case_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_case`
--

LOCK TABLES `tb_case` WRITE;
/*!40000 ALTER TABLE `tb_case` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_case` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_category`
--

DROP TABLE IF EXISTS `tb_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_category` (
  `category_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_category`
--

LOCK TABLES `tb_category` WRITE;
/*!40000 ALTER TABLE `tb_category` DISABLE KEYS */;
INSERT INTO `tb_category` VALUES ('129f2c1efc9d4e8a821d202bec89f288','post'),('1a5b4c52169d4228a5b1da149511e717','case'),('3284c1f1a8104b8796b4d70277b4947a','base');
/*!40000 ALTER TABLE `tb_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_channel`
--

DROP TABLE IF EXISTS `tb_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_channel` (
  `channel_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_community_id` varchar(100) NOT NULL,
  PRIMARY KEY (`channel_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_channel`
--

LOCK TABLES `tb_channel` WRITE;
/*!40000 ALTER TABLE `tb_channel` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_channel_user`
--

DROP TABLE IF EXISTS `tb_channel_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_channel_user` (
  `channel_user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`channel_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_channel_user`
--

LOCK TABLES `tb_channel_user` WRITE;
/*!40000 ALTER TABLE `tb_channel_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_channel_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_comment`
--

DROP TABLE IF EXISTS `tb_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_comment` (
  `comment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment_content` varchar(100) NOT NULL,
  `comment_create_datetime` datetime NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_comment`
--

LOCK TABLES `tb_comment` WRITE;
/*!40000 ALTER TABLE `tb_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_community`
--

DROP TABLE IF EXISTS `tb_community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_community` (
  `community_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `community_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `community_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `community_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `community_image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`community_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_community`
--

LOCK TABLES `tb_community` WRITE;
/*!40000 ALTER TABLE `tb_community` DISABLE KEYS */;
INSERT INTO `tb_community` VALUES ('01290873b68b4806aefd79eeace6c38f','sss','ss','',NULL),('6e84e48f77f84d49bd5e4620a531b8a8','3','432423142314','',NULL),('9e659f63a3ab4a1f9b2f549ee0443dbe','1','2','',NULL);
/*!40000 ALTER TABLE `tb_community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_community_user`
--

DROP TABLE IF EXISTS `tb_community_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_community_user` (
  `community_user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `community_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`community_user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_community_user`
--

LOCK TABLES `tb_community_user` WRITE;
/*!40000 ALTER TABLE `tb_community_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_community_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_document`
--

DROP TABLE IF EXISTS `tb_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_document` (
  `document_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `document_category_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `document_community_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `document_author_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `document_name` varchar(100) DEFAULT NULL,
  `document_description` varchar(255) DEFAULT NULL,
  `document_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `document_create_date` datetime NOT NULL,
  `document_update_date` datetime NOT NULL,
  `document_thumbnail_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`document_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_document`
--

LOCK TABLES `tb_document` WRITE;
/*!40000 ALTER TABLE `tb_document` DISABLE KEYS */;
INSERT INTO `tb_document` VALUES ('22f7bdf49a9b4a2eb3fbd6d5f13df77e','3284c1f1a8104b8796b4d70277b4947a','test','73AE89EE58F44DA4A59BCB047E8184E2','未命名文档','dsaljkdljlkjdlkajkljl','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.对的对的\"}]}]','2026-02-02 07:21:28','2026-02-02 07:21:28',''),('b7a50c91772341c68a6a099389b5f702','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','未命名文档','dsaljkdljlkjdlkajkljl','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.对的对的\"}]}]','2026-02-02 07:22:12','2026-02-02 07:22:12',''),('c1756139eb964ac78ae643e035482944','3284c1f1a8104b8796b4d70277b4947a','01290873b68b4806aefd79eeace6c38f','',NULL,NULL,'[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2025-01-03 21:00:00','2025-01-03 21:00:00',NULL),('e7ce6b00c1d743348a33c5ebfbaf2990','3284c1f1a8104b8796b4d70277b4947a','01290873b68b4806aefd79eeace6c38f','',NULL,NULL,'[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2025-01-03 21:00:00','2025-01-03 21:00:00',NULL);
/*!40000 ALTER TABLE `tb_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_message`
--

DROP TABLE IF EXISTS `tb_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_message` (
  `message_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message_channel_id` char(32) NOT NULL,
  `message_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message_from` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message_to` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message_create_datatime` datetime NOT NULL,
  PRIMARY KEY (`message_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_message`
--

LOCK TABLES `tb_message` WRITE;
/*!40000 ALTER TABLE `tb_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_post`
--

DROP TABLE IF EXISTS `tb_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_post` (
  `post_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `post_document_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`post_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_post`
--

LOCK TABLES `tb_post` WRITE;
/*!40000 ALTER TABLE `tb_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tag`
--

DROP TABLE IF EXISTS `tb_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_tag` (
  `tab_id` char(32) NOT NULL,
  `tag_name` varchar(100) NOT NULL,
  `tag_owner_id` char(32) NOT NULL,
  PRIMARY KEY (`tab_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tag`
--

LOCK TABLES `tb_tag` WRITE;
/*!40000 ALTER TABLE `tb_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tag_community`
--

DROP TABLE IF EXISTS `tb_tag_community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_tag_community` (
  `tag_community_id` char(32) NOT NULL,
  `tag_id` char(32) NOT NULL,
  `community_id` char(32) NOT NULL,
  PRIMARY KEY (`tag_community_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tag_community`
--

LOCK TABLES `tb_tag_community` WRITE;
/*!40000 ALTER TABLE `tb_tag_community` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_tag_community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tag_document`
--

DROP TABLE IF EXISTS `tb_tag_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_tag_document` (
  `tag_document_id` char(32) NOT NULL,
  `tag_id` char(32) NOT NULL,
  `document_id` char(32) NOT NULL,
  PRIMARY KEY (`tag_document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tag_document`
--

LOCK TABLES `tb_tag_document` WRITE;
/*!40000 ALTER TABLE `tb_tag_document` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_tag_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_community'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-02 16:26:23
