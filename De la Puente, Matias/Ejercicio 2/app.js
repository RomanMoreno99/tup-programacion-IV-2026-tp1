const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let alumnos = [
  {
    nombre: 'Ana',
    notas: [8, 9, 10]
  },
  {
    nombre: 'Luis',
    notas: [6, 7, 5]
  }
];

function normalizarNombre(nombre) {
  return String(nombre || '').trim().toLowerCase();
}

function validarNombre(nombre) {
  if (typeof nombre !== 'string') return false;
  const nombreNormalizado = nombre.trim();
  return nombreNormalizado.length > 0;
}

function validarNotas(notas) {
  if (!Array.isArray(notas)) return false;
  if (notas.length !== 3) return false;

  return notas.every((nota) => {
    return Number.isFinite(Number(nota)) && Number(nota) >= 0 && Number(nota) <= 10;
  });
}

function calcularPromedio(notas) {
  const suma = notas.reduce((acc, nota) => acc + Number(nota), 0);
  return suma / notas.length;
}

function obtenerCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio >= 6 && promedio <= 7) return 'aprobado';
  return 'promocionado';
}

function obtenerAlumno(nombre) {
  return alumnos.find((alumno) => normalizarNombre(alumno.nombre) === normalizarNombre(nombre));
}

function validarAlumnoCompleto({ nombre, notas }) {
  if (!validarNombre(nombre)) {
    return { ok: false, message: 'El nombre es obligatorio.' };
  }

  if (!validarNotas(notas)) {
    return {
      ok: false,
      message: 'Debe enviar exactamente 3 notas numéricas entre 0 y 10.'
    };
  }

  return { ok: true };
}

function serializarAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: Number(promedio.toFixed(2)),
    condicion: obtenerCondicion(promedio)
  };
}

app.get('/api/alumnos', (req, res) => {
  const respuesta = alumnos.map(serializarAlumno);
  res.json(respuesta);
});

app.get('/api/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;
  const alumno = obtenerAlumno(nombre);

  if (!alumno) {
    return res.status(404).json({ error: `No existe el alumno ${nombre}.` });
  }

  res.json(serializarAlumno(alumno));
});

app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  const validacion = validarAlumnoCompleto({ nombre, notas });
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.message });
  }

  const existe = alumnos.some((alumno) => normalizarNombre(alumno.nombre) === normalizarNombre(nombre));
  if (existe) {
    return res.status(409).json({
      error: `Ya existe un alumno con el nombre "${nombre.trim()}".`
    });
  }

  const nuevoAlumno = {
    nombre: nombre.trim(),
    notas: notas.map((n) => Number(n))
  };

  alumnos.push(nuevoAlumno);

  res.status(201).json(serializarAlumno(nuevoAlumno));
});

app.put('/api/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;
  const { nombre: nuevoNombre, notas } = req.body;

  const alumno = obtenerAlumno(nombre);
  if (!alumno) {
    return res.status(404).json({ error: `No existe el alumno ${nombre}.` });
  }

  const nombreFinal = nuevoNombre ?? alumno.nombre;
  const notasFinales = notas ?? alumno.notas;

  const validacion = validarAlumnoCompleto({
    nombre: nombreFinal,
    notas: notasFinales
  });

  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.message });
  }

  const nombreDuplicado = alumnos.some((item) => {
    if (item.nombre === alumno.nombre) return false;
    return normalizarNombre(item.nombre) === normalizarNombre(nombreFinal);
  });

  if (nombreDuplicado) {
    return res.status(409).json({
      error: `Ya existe un alumno con el nombre "${nombreFinal.trim()}".`
    });
  }

  alumno.nombre = nombreFinal.trim();
  alumno.notas = notasFinales.map((n) => Number(n));

  res.json(serializarAlumno(alumno));
});

app.delete('/api/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;
  const indice = alumnos.findIndex((alumno) => normalizarNombre(alumno.nombre) === normalizarNombre(nombre));

  if (indice === -1) {
    return res.status(404).json({ error: `No existe el alumno ${nombre}.` });
  }

  const alumnoEliminado = alumnos.splice(indice, 1)[0];
  res.json({
    message: `Alumno "${alumnoEliminado.nombre}" eliminado correctamente.`,
    alumno: serializarAlumno(alumnoEliminado)
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'API de alumnos activa',
    endpoints: [
      'GET /api/alumnos',
      'GET /api/alumnos/:nombre',
      'POST /api/alumnos',
      'PUT /api/alumnos/:nombre',
      'DELETE /api/alumnos/:nombre'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});