const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatch;
}

module.exports = { hashPassword, comparePassword };
