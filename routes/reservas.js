const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Criar uma reserva
router.post('/reservar', (req, res) => {
  const { cliente_id, horario } = req.body;

  console.log(` Criando reserva para Cliente ${cliente_id} no horário ${horario}`);

  /*
  //  Código com erro (antes da correção) - Permitindo reservas duplicadas
  const sql = 'INSERT INTO reservas (cliente_id, horario) VALUES (?, ?)';
  db.query(sql, [cliente_id, horario], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Erro ao salvar reserva' });
      }
      res.status(201).json({ message: 'Reserva realizada com sucesso!' });
  });
  */

  //  Código corrigido (impede reservas duplicadas)
  console.log(' Verificando disponibilidade do horário...');
  const checkSql = 'SELECT * FROM reservas WHERE horario = ?';
  db.query(checkSql, [horario], (err, results) => {
    if (err) {
      console.error(' Erro ao verificar disponibilidade de horário:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length > 0) {
      console.warn(` Erro: Tentativa de reserva duplicada para ${horario}`);
      return res.status(400).json({ error: 'Horário já reservado' });
    }

    // Inserir a reserva se o horário estiver disponível
    const insertSql = 'INSERT INTO reservas (cliente_id, horario) VALUES (?, ?)';
    db.query(insertSql, [cliente_id, horario], (err, result) => {
      if (err) {
        console.error(' Erro ao salvar reserva:', err);
        return res.status(500).json({ error: 'Erro ao salvar reserva' });
      }

      res.status(201).json({ message: 'Reserva realizada com sucesso!' });
    });
  });
});

// Rota para listar apenas horários disponíveis
router.get('/horarios-disponiveis', (req, res) => {
  console.log(' Buscando horários disponíveis...');

  /*
  //  Código com erro (antes da correção) - Pode gerar erro de ambiguidade no MySQL
  const sql = `
      SELECT DISTINCT horario 
      FROM horarios 
      LEFT JOIN reservas ON horarios.horario = reservas.horario
      WHERE reservas.horario IS NULL
  `;
  */

  //  Código corrigido (evita erro de ambiguidade no MySQL)

  const sql = `
        SELECT DISTINCT h.horario 
        FROM horarios AS h
        LEFT JOIN reservas AS r ON h.horario = r.horario
        WHERE r.horario IS NULL OR r.horario IS NULL
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(' Erro ao buscar horários disponíveis:', err);
      return res.status(500).json({ error: 'Erro ao buscar horários' });
    }

    console.log(` Horários disponíveis encontrados: ${results.length}`);
    res.json(results);
  });
});

module.exports = router;
