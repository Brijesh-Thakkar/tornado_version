--
-- To create the database:
--   CREATE DATABASE aspiringinvestments;
--   GRANT ALL PRIVILEGES ON aspiringinvestments.* TO 'ai'@'localhost' IDENTIFIED BY 'ai';
--
-- To reload the tables:
--   mysql --user=ai --password=ai --database=aspiringinvestments < schema.sql

SET SESSION storage_engine = "InnoDB";
SET SESSION time_zone = "+0:00";
ALTER DATABASE CHARACTER SET "utf8";

DROP TABLE IF EXISTS StockTemplates;
CREATE TABLE StockTemplates (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    user VARCHAR(512) NOT NULL,
    data LONGBLOB
);

DROP TABLE IF EXISTS UserSheets;
CREATE TABLE UserSheets (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    user VARCHAR(512) NOT NULL,
    data LONGBLOB
);

DROP TABLE IF EXISTS SharedSheets;
CREATE TABLE SharedSheets (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    user VARCHAR(512) NOT NULL,
    data LONGBLOB
);

DROP TABLE IF EXISTS TickerAnnualData;
CREATE TABLE TickerAnnualData (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(20) NOT NULL,
    year VARCHAR(20) NOT NULL,
    data LONGBLOB
);
