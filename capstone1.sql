-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2025 at 03:11 PM
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
(15, 'kjfh', 'jkhsfhj', 'jahskfdjh', 'hsdkfhjkaj', 'khsdfkjhsk', 'Female', 'Married', 'ajshdk', '2001-03-09', 156.00, 67.00, 'asdklj', '21315', 73168.00, 876876.00, 78587.00, 1.00, 10.00, 'LEON', '2025-03-06', 'Approved', '2025-03-06 07:07:26', 41, NULL, 'CTC-362325'),
(17, 'Gayuna', 'Ma Lyn', 'Saglario', 'Filipino', 'Brgy. Ambut, Leon, Iloilo', 'Female', 'Single', 'San Miguel, Iloilo', '2001-02-11', 150.00, 45.00, 'Business Owner', '123456', 3000.00, 3000.00, 3000.00, 9.00, 95.00, 'LEON', '2025-03-06', 'Approved', '2025-03-06 08:21:47', 42, NULL, 'CTC-646875'),
(18, 'Baricuatro', 'Jane', 'Cabarse', 'Filipino', 'Brgy. Ambut, Leon, Iloilo', 'Female', 'Single', 'Pavia, Iloilo', '2000-04-12', 150.00, 50.00, 'Business Owner', '123456', 2000.00, 2000.00, 2000.00, 6.00, 65.00, 'LEON', '2025-03-06', 'Rejected', '2025-03-06 09:00:59', 38, NULL, 'CTC-764027'),
(19, 'Gayuna', 'Den', 'Saglario', 'Filipino', 'Brgy. Buga, Leon, Iloilo ', 'Female', 'Single', 'San Miguel, Iloilo', '2000-02-01', 150.00, 45.00, 'Crew', '123456', 2000.00, 2000.00, 2000.00, 6.00, 65.00, 'LEON', '2025-03-06', 'Approved', '2025-03-06 09:38:28', 43, NULL, 'CTC-718761');

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

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`ID`, `EMAIL_ADDRESS`, `PASSWORD`, `TIME_DATE`) VALUES
(41, 'karenallones03@gmail.com', '$2a$10$zf6Xwi3piJJzAwo2JT4QxO.4uVBQQZRKbUGo0YQAUZ1VcBf36jnj2', '2025-02-27 16:01:52');

-- --------------------------------------------------------

--
-- Table structure for table `perinfo`
--

CREATE TABLE `perinfo` (
  `ID` int(11) NOT NULL,
  `FIRST_NAME` varchar(255) DEFAULT NULL,
  `MIDDLE_NAME` varchar(255) NOT NULL,
  `LAST_NAME` varchar(255) NOT NULL,
  `MOBILE` varchar(15) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `DATE_TIME` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `CONFIRM_PASSWORD` varchar(255) DEFAULT NULL,
  `TIME_DATE` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDRESS`, `PASSWORD`, `CONFIRM_PASSWORD`, `TIME_DATE`) VALUES
(22, 'gd', '', 'jwoo@gmail.com', 'asdfghjk', 'asdfghjk', '2025-02-18 03:26:47'),
(32, 'karen', 'allones', 'kira@gmail.com', '$2a$10$uUv4zQIFd3t/LDRorMuTfOjQE6.KJBhpCuXiI5P8gMDQKF2nmorCi', NULL, '2025-02-24 14:33:06'),
(33, 'karen', 'Allones', 'karenallones03@gmail.com', '$2a$10$uEC.V1/elCvuInLFJPVqiuc4wd8AqsVNwOdk7y2wzBBG2UFV4E.my', NULL, '2025-02-24 15:14:06'),
(38, 'Alh Jane', 'Baricuatro', 'alhjanebaricuatro@gmail.com', '$2a$10$GCwGxJeqUwwKZCbnq.uDmOb4aZCn4lZR7GYc2yFOdnktTp7ZJu5Wq', NULL, '2025-03-02 22:00:13'),
(40, 'Valerie', 'Martinez', 'corn09222001@gmail.com', '$2a$10$iymbOlh8jzX0s/IO0RPqVuHTLjQhX21CTvCvxI0uGkQ07uFjqS28C', NULL, '2025-03-05 14:47:41'),
(41, 'corn', 'martinez', 'valeriemartinez466@gmail.com', '$2a$10$VzZwVQ2.9OXCi4oEcyIw/evLrfxwhXmXFYetogu1SISptV/JLSB.a', NULL, '2025-03-05 16:40:40'),
(42, 'Malyn', 'Gayuna', 'masa.gayuna.ui@phinmaed.com', '$2a$10$mNftQ8p5Z8dzfZdboRUYC.VvoN/65hqTSCXHRwAj5MQu14hL9v5xm', NULL, '2025-03-06 15:39:36'),
(43, 'Lyn', 'Gays', 'lyngayuna2001@gmail.com', '$2a$10$XxyFl37odL70GydoT/CtaeMfmPiUm.232UMWtdzaQK/gXCQ5A2cEC', NULL, '2025-03-06 17:35:23');

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
-- Indexes for table `perinfo`
--
ALTER TABLE `perinfo`
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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `form`
--
ALTER TABLE `form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `perinfo`
--
ALTER TABLE `perinfo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
