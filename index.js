// Dependancies
const inquirer = require("inquirer");
const util = require("util");

const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);
db.query = util.promisify(db.query);

async function startMenu() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit",
      ],
    },
  ]);
  switch (answer.choice) {
    case "View all departments":
      viewDepartments();
      break;

    case "View all roles":
      viewRoles();
      break;

    case "View all employees":
      viewEmployees();
      break;

    case "Add a department":
      addDepartment();
      break;

    case "Add a role":
      addRole();
      break;

    case "Add an employee":
      addEmployee();
      break;

    case "Update an employee role":
      updateEmployee();
      break;

    default:
      quit();
  }
}
async function viewDepartments() {
  const results = await db.query("Select * from department");
  console.table(results);
  startMenu();
}

async function viewRoles() {
  const results = await db.query(
    "Select role.id, role.title, role.salary, department.name from role join department on role.department_id = department.id"
  );
  console.table(results);
  startMenu();
}

async function viewEmployees() {
  const results = await db.query(
    "Select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id from employee join role on employee.role_id = role.id join department on role.department_id = department.id"
  );
  console.table(results);
  startMenu();
}

async function addDepartment() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the department name",
    },
  ]);
  await db.query("INSERT INTO department SET ?", answer);
  console.log("Department added!");
  console.table(answer);
  startMenu();
}

async function addRole() {
  const departments = await db.query("Select * from department");
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the role title",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the role salary",
    },
    {
      type: "list",
      name: "department_id",
      message: "Select the department",
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);
  await db.query("INSERT INTO role SET ?", answer);
  console.log("Role added!");
  console.table(answer);
  startMenu();
}

async function addEmployee() {
  const roles = await db.query("Select * from role");
  const employees = await db.query("Select * from employee");
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the employee's first name",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employee's last name",
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the employee's role",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Select the employee's manager",
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    }
  ]);
  await db.query("INSERT INTO employee SET ?", answer);
  console.log("Employee added!");
  console.table(answer);
  startMenu();
}
  

async function updateEmployee() {
  const employees = await db.query("Select * from employee");
  const roles = await db.query("Select * from role");
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Select the employee to update",
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the employee's new role",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);
  await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
    answer.role_id,
    answer.employee_id,
  ]);
  console.log("Employee updated!");
  startMenu();
}

startMenu();