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
  `channel_community_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`channel_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_channel`
--

LOCK TABLES `tb_channel` WRITE;
/*!40000 ALTER TABLE `tb_channel` DISABLE KEYS */;
INSERT INTO `tb_channel` VALUES ('79e3d0a0a9254b038b3b373cbf62653b','01290873b68b4806aefd79eeace6c38f','default','默认');
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
  `community_user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`channel_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_channel_user`
--

LOCK TABLES `tb_channel_user` WRITE;
/*!40000 ALTER TABLE `tb_channel_user` DISABLE KEYS */;
INSERT INTO `tb_channel_user` VALUES ('8063c01969aa4524957e58170ff7600c','79e3d0a0a9254b038b3b373cbf62653b','f50fd5c0c7b84e4b9e7f850f3641429a');
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
INSERT INTO `tb_community` VALUES ('01290873b68b4806aefd79eeace6c38f','sss','数学相关内容','',NULL),('6e84e48f77f84d49bd5e4620a531b8a8','3','物理相关内容','',NULL),('9e659f63a3ab4a1f9b2f549ee0443dbe','1','2','',NULL);
/*!40000 ALTER TABLE `tb_community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_community_role`
--

DROP TABLE IF EXISTS `tb_community_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_community_role` (
  `community_role_id` char(32) NOT NULL,
  `community_role_name` varchar(100) NOT NULL,
  `community_role_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`community_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_community_role`
--

LOCK TABLES `tb_community_role` WRITE;
/*!40000 ALTER TABLE `tb_community_role` DISABLE KEYS */;
INSERT INTO `tb_community_role` VALUES ('7cbe3cf3700147428fe918f559f9b8a2','member','普通成员'),('85d72171525043299b9189d91406cc7b','owner','拥有者'),('f8160313d8cd4c88ad340485e46fd2c3','admin','管理员');
/*!40000 ALTER TABLE `tb_community_role` ENABLE KEYS */;
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
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外界用户系统的id',
  `community_role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`community_user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_community_user`
--

LOCK TABLES `tb_community_user` WRITE;
/*!40000 ALTER TABLE `tb_community_user` DISABLE KEYS */;
INSERT INTO `tb_community_user` VALUES ('f50fd5c0c7b84e4b9e7f850f3641429a','01290873b68b4806aefd79eeace6c38f','73AE89EE58F44DA4A59BCB047E8184E2','85d72171525043299b9189d91406cc7b');
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
INSERT INTO `tb_document` VALUES ('0e4794e2fe90435388d8456b7b27f93f','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 08:55:30','2026-02-02 08:55:30',''),('12c8005f8a3d4adbbcf9c6edf408d02c','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 09:13:14','2026-02-02 09:13:14',''),('22f7bdf49a9b4a2eb3fbd6d5f13df77e','3284c1f1a8104b8796b4d70277b4947a','test','73AE89EE58F44DA4A59BCB047E8184E2','未命名文档','dsaljkdljlkjdlkajkljl','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.对的对的\"}]}]','2026-02-02 07:21:28','2026-02-02 07:21:28',''),('2455a0be3302498ca16af402958d32c3','3284c1f1a8104b8796b4d70277b4947a','test','73AE89EE58F44DA4A59BCB047E8184E2','未命名文档','dsaljkdljlkjdlkajkljl','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 08:50:03','2026-02-02 08:50:03',''),('259b847553d14190b831a1940d2a53ab','3284c1f1a8104b8796b4d70277b4947a','01290873b68b4806aefd79eeace6c38f','73AE89EE58F44DA4A59BCB047E8184E2','网关','网关','[{\"type\":\"block-quote\",\"children\":[{\"text\":\"\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"# 多租户\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"流量接入层：身份识别与路由\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"七层网关\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"- **租户上下文提取**：网关解析 JWT 或 Cookie，提取 `tenant_id`。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"- **染色与透传**：网关会将租户信息放入 HTTP Header（如 `X-Tenant-Id`）或分布式链路追踪（Trace）上下文中。后续所有的微服务调用都会“染色”，确保下游知道自己在为哪个租户服务。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"- **动态路由**：对于 VIP 租户，网关直接将其流量路由到专属的物理集群（Cluster Isolation），而普通租户则进入共享集群。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"计算层\"}]}]','2026-02-10 08:02:49','2026-02-10 08:02:49',''),('43f4794ac6634e0285575d48319d0db7','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 09:08:30','2026-02-02 09:08:30',''),('44fd75a5075940de9905d54a4a9f7101','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 08:52:37','2026-02-02 08:52:37',''),('82d1fe2595ba479c90736ffc07b2f11d','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 08:55:36','2026-02-02 08:55:36',''),('9f71442da63a40f8831210aefdfeb9d8','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 09:10:07','2026-02-02 09:10:07',''),('a8ac03424b044b15acbc6ee292c1ac37','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','测试文档','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 09:10:21','2026-02-02 09:10:21',''),('b7a50c91772341c68a6a099389b5f702','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','未命名文档','dsaljkdljlkjdlkajkljl','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.对的对的\"}]}]','2026-02-02 07:22:12','2026-02-02 07:22:12',''),('c1756139eb964ac78ae643e035482944','3284c1f1a8104b8796b4d70277b4947a','01290873b68b4806aefd79eeace6c38f','',NULL,NULL,'[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2025-01-03 21:00:00','2025-01-03 21:00:00',NULL),('d7c29a01032446098417ea361e0303cd','1a5b4c52169d4228a5b1da149511e717','test','73AE89EE58F44DA4A59BCB047E8184E2','TEST','123','[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2026-02-02 09:14:27','2026-02-02 09:14:27',''),('e7ce6b00c1d743348a33c5ebfbaf2990','3284c1f1a8104b8796b4d70277b4947a','01290873b68b4806aefd79eeace6c38f','',NULL,NULL,'[{\"type\":\"paragraph\",\"children\":[{\"text\":\"欢迎来到 SlateJS 世界！这是一个简单的示例文章。\"}]},{\"type\":\"heading\",\"level\":1,\"children\":[{\"text\":\"第一部分：介绍\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Since it\'s rich text, you can do things like turn a selection of text \"},{\"text\":\"bold\",\"bold\":true},{\"text\":\", or add a semantically rendered block quote in the middle of the page, like this:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"SlateJS 是一个强大的编辑器框架，它允许开发者构建高度可定制的编辑器。\"}]},{\"type\":\"heading\",\"level\":2,\"children\":[{\"text\":\"主要特点\"}]},{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"灵活的文档模型\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"丰富的插件系统\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"强大的扩展性\"}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"总之，SlateJS 是一个非常灵活且功能丰富的工具，适合用于构建各种类型的编辑器应用。\"}]},{\"type\":\"block-quote\",\"children\":[{\"text\":\"A wise quote.\"}]}]','2025-01-03 21:00:00','2025-01-03 21:00:00',NULL);
/*!40000 ALTER TABLE `tb_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_invitation`
--

DROP TABLE IF EXISTS `tb_invitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_invitation` (
  `id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `inviter_code` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邀请方身份代码',
  `invitee_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id',
  `invitation_type_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `community_role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` tinyint NOT NULL,
  `expired_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='邀请信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_invitation`
--

LOCK TABLES `tb_invitation` WRITE;
/*!40000 ALTER TABLE `tb_invitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_invitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_invitation_type`
--

DROP TABLE IF EXISTS `tb_invitation_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_invitation_type` (
  `id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `inviter_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `inviter_description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `inviter_code` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邀请方身份代码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_invitation_type`
--

LOCK TABLES `tb_invitation_type` WRITE;
/*!40000 ALTER TABLE `tb_invitation_type` DISABLE KEYS */;
INSERT INTO `tb_invitation_type` VALUES ('5cc0e23dacea4b46923c2567e55b7988','CHANNEL','频道','0002'),('beb7de2e0dee486db1487575834103b8','COMMUNITY','社区','0001');
/*!40000 ALTER TABLE `tb_invitation_type` ENABLE KEYS */;
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
  `tag_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tag_name` varchar(100) NOT NULL,
  `tag_owner_id` char(32) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tag`
--

LOCK TABLES `tb_tag` WRITE;
/*!40000 ALTER TABLE `tb_tag` DISABLE KEYS */;
INSERT INTO `tb_tag` VALUES ('4ef8c46382864ec186c76b36fec00cda','数学','73AE89EE58F44DA4A59BCB047E8184E2'),('e61e8b8ea6c04007b9dbb7e9eda73b1d','物理','73AE89EE58F44DA4A59BCB047E8184E2');
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
INSERT INTO `tb_tag_community` VALUES ('fb524c62ae97497fabc266f3844e8fc1','e61e8b8ea6c04007b9dbb7e9eda73b1d','6e84e48f77f84d49bd5e4620a531b8a8'),('ff83ab78c2a24d48af929345a86f4da0','4ef8c46382864ec186c76b36fec00cda','01290873b68b4806aefd79eeace6c38f');
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

-- Dump completed on 2026-02-12 15:59:50
