const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3333;

app.get('/censo', async (req, res) => {
  try {
    const allCensos = await prisma.censo.findMany({
      select: {
        year: true,
        url: true
      }
    });
    res.json(allCensos);
  } catch (error) {
    console.error('Erro ao recuperar os censos:', error);
    res.status(500).json({ error: 'Erro ao recuperar os censos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
