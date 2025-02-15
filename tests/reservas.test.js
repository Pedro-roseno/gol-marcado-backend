const request = require('supertest');
const app = require('../server');


beforeAll(async () => {
  const db = require('../config/db');
  await new Promise((resolve, reject) => {
    db.query('DELETE FROM reservas', (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});


describe('Testes de Reserva', () => {
  it('Deve permitir a primeira reserva normalmente', async () => {
    const res = await request(app).post('/api/reservas/reservar').send({
      cliente_id: 1,
      horario: "2025-02-15 19:00:00"
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Reserva realizada com sucesso!');
  });

  it('Deve impedir reservas duplicadas para o mesmo horário', async () => {


    const res = await request(app).post('/api/reservas/reservar').send({
      cliente_id: 2,
      horario: "2025-02-15 19:00:00"
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Horário já reservado');
  });

  it('Deve listar apenas horários disponíveis', async () => {
    const res = await request(app).get('/api/reservas/horarios-disponiveis');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    console.log('Horários disponíveis:', res.body);
  });
});
afterAll(async () => {
  const db = require('../config/db');
  await new Promise((resolve, reject) => {
    db.end(err => {
      if (err) reject(err);
      console.log(' Conexão com MySQL fechada após os testes.');
      resolve();
    });
  });
});
