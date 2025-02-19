const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = "seu_segredo_super_seguro";

exports.register = (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Erro ao gerar hash da senha" });

    User.create(nome, email, hash, tipo, (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao criar usuário" });
      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const user = results[0];

    bcrypt.compare(senha, user.senha, (err, match) => {
      if (!match) return res.status(401).json({ error: "Senha incorreta" });

      const token = jwt.sign({ id: user.id, tipo: user.tipo }, SECRET_KEY, { expiresIn: "2h" });
      res.json({ message: "Login realizado com sucesso", token });
    });
  });
};

exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuários" });
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteUser(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar usuário" });
    res.json({ message: "Usuário removido com sucesso!" });
  });
};
