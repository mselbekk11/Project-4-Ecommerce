import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10), // hash the password
    isAdmin: true, // admin user
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10), // hash the password
    isAdmin: false, // admin user
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10), // hash the password
    isAdmin: false, // admin user
  },
];

export default users;
