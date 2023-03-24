-- at workbench run: CREATE DATABASE `my_camp`;
-- @block
SHOW DATABASES;

-- @block
USE `my_camp`;

-- @block
CREATE TABLE `users` (
    `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `hash` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL
);

CREATE TABLE `campgrounds` (
    `campground_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `description` TEXT,
    `location` VARCHAR(255) NOT NULL,
    `author_id` INT DEFAULT 1,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL
);

CREATE TABLE `reviews` (
    `review_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `rating` TINYINT DEFAULT 1,
    `body` TEXT,
    `author_id` INT,
    `campground_id` INT,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
    FOREIGN KEY (`campground_id`) REFERENCES `campgrounds`(`campground_id`) ON DELETE CASCADE
);

CREATE TABLE `images` (
    `image_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255),
    `url` VARCHAR(2048) NOT NULL,
    `campground_id` INT,
    FOREIGN KEY (`campground_id`) REFERENCES `campgrounds`(`campground_id`) ON DELETE CASCADE
);

-- check tables
-- @block
SHOW TABLES;

-- @block
DESCRIBE `campgrounds`;

-- @block
DESCRIBE `users`;

-- @block
DESCRIBE `reviews`;

-- @block
DESCRIBE `images`;
