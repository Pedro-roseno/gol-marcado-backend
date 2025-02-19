const db = require('../config/db');

const User = {
  create: (nome, email, senha, tipo, callback) => {
    const sql = 'INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, email, senha, tipo], callback);
  },
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  },
  findById: (id, callback) => {
    const sql = 'SELECT id, nome, email, tipo FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  },
  getAllUsers: (callback) => {
    const sql = 'SELECT id, nome, email, tipo FROM users';
    db.query(sql, [], callback);
  },
  deleteUser: (id, callback) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = User;
