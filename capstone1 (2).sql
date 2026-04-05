-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2025 at 05:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone1`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `ID` int(11) NOT NULL,
  `USERNAME` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`ID`, `USERNAME`, `PASSWORD`) VALUES
(1, 'nfsdk', '$2a$10$1i3q3V63UclAex14Xt/nfO1Kn0T6a.XYw.ioZF6vUUKMLxbPU7NCa'),
(2, 'Karen', '$2a$10$px2.sSmZpu3i1nWki99hT.nJlg9i7pxW61GydtNjR.kDXQxnqSKXG');

-- --------------------------------------------------------

--
-- Table structure for table `corporation`
--

CREATE TABLE `corporation` (
  `ID` int(11) NOT NULL,
  `PLACE_ISSUED` varchar(11) NOT NULL,
  `DATE_ISSUED` int(11) NOT NULL,
  `COMPANY_NAME` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `PLACE_INCORPORATION` varchar(255) DEFAULT NULL,
  `DATE_REGISTRATION` date DEFAULT NULL,
  `ORGANIZATION` varchar(255) DEFAULT NULL,
  `TIN` varchar(255) DEFAULT NULL,
  `REAL_PROPERTY` int(11) DEFAULT NULL,
  `GROSS_RECEIPT` int(11) DEFAULT NULL,
  `TOTAL_TAXABLE` int(11) DEFAULT NULL,
  `CTC_AMOUNT` int(11) DEFAULT NULL,
  `USER_ID` int(11) NOT NULL,
  `STATUS` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `corporation`
--

INSERT INTO `corporation` (`ID`, `PLACE_ISSUED`, `DATE_ISSUED`, `COMPANY_NAME`, `ADDRESS`, `PLACE_INCORPORATION`, `DATE_REGISTRATION`, `ORGANIZATION`, `TIN`, `REAL_PROPERTY`, `GROSS_RECEIPT`, `TOTAL_TAXABLE`, `CTC_AMOUNT`, `USER_ID`, `STATUS`) VALUES
(5, 'LEON', 2025, 'phinma univesity', 'rizal st', 'iloilo', '2000-02-02', 'Corporation', '4757', 4545, 454, 4, 504, 0, 'Pending'),
(6, 'LEON', 2025, 'phinma univesity', 'rizal st', 'iloilo', '2000-02-02', 'Partnership', '577458', 4545, 454, 4, 504, 0, 'Pending'),
(7, 'LEON', 2025, 'YG INCORPORATION', 'ILOILO CITY', 'ILOILO', '2000-04-08', 'Corporation', '787564', 1000000, 1100000, 2, 2, 0, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `form`
--

CREATE TABLE `form` (
  `id` int(11) NOT NULL,
  `LAST_NAME` varchar(100) NOT NULL,
  `FIRST_NAME` varchar(100) NOT NULL,
  `MIDDLE_NAME` varchar(100) NOT NULL,
  `CITIZENSHIP` varchar(50) NOT NULL,
  `ADDRESS` text NOT NULL,
  `GENDER` enum('Male','Female','Other') NOT NULL,
  `CIVIL_STATUS` enum('Single','Married','Divorced','Widowed') NOT NULL,
  `PLACE_BIRTH` varchar(255) NOT NULL,
  `DATE_BIRTH` date NOT NULL,
  `HEIGHT` decimal(5,2) DEFAULT NULL,
  `WEIGHT` decimal(5,2) DEFAULT NULL,
  `PBO` varchar(100) DEFAULT NULL,
  `TIN_NUMBER` varchar(20) DEFAULT NULL,
  `GRB` decimal(10,2) DEFAULT NULL,
  `AGI` decimal(10,2) DEFAULT NULL,
  `RPI` decimal(10,2) DEFAULT NULL,
  `TTA` decimal(10,2) DEFAULT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `PLACE_ISSUE` varchar(255) NOT NULL,
  `DATE_ISSUE` date NOT NULL,
  `STATUS` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `USER_ID` int(11) NOT NULL,
  `YEAR_MONTH_STR` char(7) DEFAULT NULL,
  `reference_number` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form`
--

INSERT INTO `form` (`id`, `LAST_NAME`, `FIRST_NAME`, `MIDDLE_NAME`, `CITIZENSHIP`, `ADDRESS`, `GENDER`, `CIVIL_STATUS`, `PLACE_BIRTH`, `DATE_BIRTH`, `HEIGHT`, `WEIGHT`, `PBO`, `TIN_NUMBER`, `GRB`, `AGI`, `RPI`, `TTA`, `AMOUNT`, `PLACE_ISSUE`, `DATE_ISSUE`, `STATUS`, `CREATED_AT`, `USER_ID`, `YEAR_MONTH_STR`, `reference_number`) VALUES
(47, 'Park', 'Jeongwoo', 'Serado', 'Filipino', 'Buga,Leon,Iloilo', 'Female', 'Single', 'Leon', '2004-09-28', 185.00, 60.00, 'Student', '', 0.00, 10000.00, 0.00, 10.00, 15.00, 'LEON', '2025-05-02', 'Approved', '2025-05-02 05:44:22', 60, NULL, 'CTC-120127'),
(49, 'Kwon', 'Jiyong', 'Kwon', 'Filipino', 'Bobon,Leon,Iloilo', 'Male', 'Single', 'Leon', '1988-08-18', 180.00, 68.00, 'student', '', 0.00, 120000.00, 0.00, 120.00, 125.00, 'LEON', '2025-05-05', 'Rejected', '2025-05-05 02:57:34', 59, NULL, 'CTC-356113'),
(50, 'Allones', 'Karen', 'Serado', 'Filipino', 'Buga,Leon,Iloilo', 'Female', 'Single', 'Leon', '2003-03-16', 150.00, 42.00, 'student', '', 0.00, 200000.00, 0.00, 200.00, 205.00, 'LEON', '2025-05-27', 'Approved', '2025-05-26 22:52:20', 81, NULL, 'CTC-155878'),
(52, 'Allones', 'Karen', 'Serado', 'Filipino', 'Buga,Leon,Iloilo', 'Female', 'Single', 'leon', '2003-03-16', 150.00, 40.00, 'student', '', 100000.00, 0.00, 0.00, 100.00, 105.00, 'LEON', '2025-07-30', 'Pending', '2025-07-30 05:28:37', 81, NULL, 'CTC-407204');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `ID` int(11) NOT NULL,
  `EMAIL_ADDRESS` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `TIME_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ptrform`
--

CREATE TABLE `ptrform` (
  `ID` int(11) NOT NULL,
  `PLACE_ISSUED` varchar(255) DEFAULT NULL,
  `DATE_ISSUED` date DEFAULT NULL,
  `LAST_NAME` varchar(255) DEFAULT NULL,
  `FIRST_NAME` varchar(255) DEFAULT NULL,
  `MIDDLE_NAME` varchar(255) DEFAULT NULL,
  `SUFFIX` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `CONTACT_NUM` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `PROFESSION` varchar(255) DEFAULT NULL,
  `REGISTERED_DATE` date DEFAULT NULL,
  `EX_DATE` date DEFAULT NULL,
  `PRC_NUM` varchar(50) DEFAULT NULL,
  `IMAGE` longblob DEFAULT NULL,
  `STATUS` varchar(255) NOT NULL,
  `USER_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ptrform`
--

INSERT INTO `ptrform` (`ID`, `PLACE_ISSUED`, `DATE_ISSUED`, `LAST_NAME`, `FIRST_NAME`, `MIDDLE_NAME`, `SUFFIX`, `ADDRESS`, `CONTACT_NUM`, `EMAIL`, `PROFESSION`, `REGISTERED_DATE`, `EX_DATE`, `PRC_NUM`, `IMAGE`, `STATUS`, `USER_ID`) VALUES
(9, 'LEON', '2025-08-02', 'Kwon', 'jiyong', 'kwon', '', 'Avanzada,Leon,Iloilo', '965574459', 'jyong@gmail.com', 'Civil Engineer', '2020-02-26', '2025-08-08', '45896545', 0x313735343130303032333034322e706e67, 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE `register` (
  `ID` int(11) NOT NULL,
  `FIRST_NAME` varchar(255) DEFAULT NULL,
  `LAST_NAME` varchar(255) NOT NULL,
  `EMAIL_ADDRESS` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `id_file` blob NOT NULL,
  `id_number` int(11) NOT NULL,
  `TIME_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDRESS`, `PASSWORD`, `id_file`, `id_number`, `TIME_DATE`) VALUES
(38, 'Alh Jane', 'Baricuatro', 'alhjanebaricuatro@gmail.com', '$2a$10$GCwGxJeqUwwKZCbnq.uDmOb4aZCn4lZR7GYc2yFOdnktTp7ZJu5Wq', '', 0, '2025-03-02 22:00:13'),
(42, 'Malyn', 'Gayuna', 'masa.gayuna.ui@phinmaed.com', '$2a$10$mNftQ8p5Z8dzfZdboRUYC.VvoN/65hqTSCXHRwAj5MQu14hL9v5xm', '', 0, '2025-03-06 15:39:36'),
(43, 'Lyn', 'Gays', 'lyngayuna2001@gmail.com', '$2a$10$XxyFl37odL70GydoT/CtaeMfmPiUm.232UMWtdzaQK/gXCQ5A2cEC', '', 0, '2025-03-06 17:35:23'),
(45, 'Janreb', 'Piad', 'piad@gmail.com', '$2a$10$U4A0u9enjkLRcO4qXaSfv.hE2LNHz26yTAhWJ.Hnb9Fum8YItMKBq', '', 0, '2025-03-21 12:16:48'),
(48, 'Karen', 'Allones', 'karen16allones@gmail.com', '$2a$10$a4kriUXF3jzxVk9H8o0I2u.fLRM4ztV./HYOm2CivmtEUcFR3E0xe', '', 0, '2025-03-24 09:07:49'),
(59, 'Jiyong', 'Kwon', 'xxx.vvip234@gmail.com', '$2a$10$7HwfAz5HqsO01oRacC2LDustAKaZdjp0qtZ02dRB35q3wHQa9tTV6', 0x313734363039303737373830362e6a7067, 0, '2025-05-01 17:12:57'),
(60, 'Jeongwoo', 'Park', 'xxx.gd234@gmail.com', '$2a$10$dhcycj1OG3v47mWpfWMYie23JUaLXTP6kXfGXSWLdmzgeUe/ffpiu', 0x313734363136343530333239372e6a7067, 0, '2025-05-02 13:41:43'),
(81, 'Karen', 'Allones', 'karenallones03@gmail.com', '$2a$10$O4lMaDkQt6x.rB89PC.qPeaW.GaOgGF7Bgrjqg0XtbBEb.waH5QHm', 0x313734383239313630353237342e6a7067, 0, '2025-05-27 04:33:27');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('CBo2AizgLTTCoAvu3N8iS7Rv1BX8yLZb', 1740938810, '{\"cookie\":{\"originalMaxAge\":300000,\"expires\":\"2025-03-02T18:06:31.949Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"otp\":{\"code\":\"195417\",\"expires\":1740938788715},\"user\":{\"email\":\"corn09222001@gmail.com\"}}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `corporation`
--
ALTER TABLE `corporation`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `form`
--
ALTER TABLE `form`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_number` (`reference_number`),
  ADD KEY `USER_ID` (`USER_ID`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ptrform`
--
ALTER TABLE `ptrform`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `corporation`
--
ALTER TABLE `corporation`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `form`
--
ALTER TABLE `form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `ptrform`
--
ALTER TABLE `ptrform`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `form`
--
ALTER TABLE `form`
  ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `register` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
