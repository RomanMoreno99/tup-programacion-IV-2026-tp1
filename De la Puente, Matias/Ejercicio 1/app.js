const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function validarRectangulo(base, altura) {
  if (
    base === undefined ||
    altura === undefined ||
    base === null ||
    altura === null ||
    base === '' ||
    altura === '' ||
    !Number.isFinite(Number(base)) ||
    !Number.isFinite(Number(altura)) ||
    Number(base) <= 0 ||
    Number(altura) <= 0
  ) {
    return false;
  }

  return true;
}

function calcularRectangulo(base, altura) {
  const area = base * altura;
  const perimetro = 2 * (base + altura);
  const tipo = base === altura ? 'cuadrado' : 'rectangulo';

  return {
    base,
    altura,
    area,
    perimetro,
    tipo
  };
}

app.get('/api/rectangles/area', (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  if (!validarRectangulo(req.query.base, req.query.altura)) {
    return res.status(400).json({
      error: 'La base y la altura deben ser números mayores que 0'
    });
  }

  const rectangulo = calcularRectangulo(base, altura);

  res.json({
    area: rectangulo.area
  });
});

app.get('/api/rectangles/perimeter', (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  if (!validarRectangulo(req.query.base, req.query.altura)) {
    return res.status(400).json({
      error: 'La base y la altura deben ser números mayores que 0'
    });
  }

  const rectangulo = calcularRectangulo(base, altura);

  res.json({
    perimetro: rectangulo.perimetro
  });
});

app.get('/api/rectangles/classify', (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  if (!validarRectangulo(req.query.base, req.query.altura)) {
    return res.status(400).json({
      error: 'La base y la altura deben ser números mayores que 0'
    });
  }

  const rectangulo = calcularRectangulo(base, altura);

  res.json({
    tipo: rectangulo.tipo
  });
});

app.post('/api/rectangles/calculate', (req, res) => {
  const { base, altura } = req.body;

  if (!validarRectangulo(base, altura)) {
    return res.status(400).json({
      error: 'La base y la altura deben ser números mayores que 0'
    });
  }

  const rectangulo = calcularRectangulo(base, altura);

  res.json(rectangulo);
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de rectángulos funcionando'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});