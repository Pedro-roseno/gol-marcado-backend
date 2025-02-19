const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📥 [${req.method}] ${req.url}`);
  next();
});

const reservasRoutes = require('./routes/reservas');
app.use('/api/reservas', reservasRoutes);


const userRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', userRoutes);


app.get('/', (req, res) => {
  res.send('API Gol Marcado funcionando!');
});


app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});


app.use((err, req, res, next) => {
  console.error('🔥 Erro no servidor:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
