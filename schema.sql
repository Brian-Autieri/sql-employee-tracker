-- Drops the employee database if it exists currently
DROP DATABASE IF EXISTS employee_db;
-- Creates the employee database
CREATE DATABASE employee_db;
-- Uses the employee database
USE employee_db;
-- Creates the department table
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);
-- Creates the role table
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);
-- Creates the employee table
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

