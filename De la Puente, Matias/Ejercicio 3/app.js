const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tareas = [
  { nombre: 'Revisar documento', completada: true },
  { nombre: 'Preparar presentación', completada: false }
];

function normalizarNombre(nombre) {
  return String(nombre || '').trim().toLowerCase();
}

function validarNombre(nombre) {
  if (typeof nombre !== 'string') return false;
  return nombre.trim().length > 0;
}

function validarCompletada(valor) {
  return valor === true || valor === false || valor === 'true' || valor === 'false';
}

function obtenerTarea(nombre) {
  return tareas.find((tarea) => normalizarNombre(tarea.nombre) === normalizarNombre(nombre));
}

function serializarTarea(tarea) {
  return {
    nombre: tarea.nombre,
    completada: tarea.completada
  };
}

function validarTarea({ nombre, completada }) {
  if (!validarNombre(nombre)) {
    return { ok: false, message: 'El nombre de la tarea es obligatorio.' };
  }

  if (!validarCompletada(completada)) {
    return { ok: false, message: 'El estado completada debe ser booleano.' };
  }

  return { ok: true };
}

app.get('/api/tareas', (req, res) => {
  res.json(tareas.map(serializarTarea));
});

app.get('/api/tareas/completadas', (req, res) => {
  const completadas = tareas.filter((tarea) => tarea.completada === true);
  res.json(completadas.map(serializarTarea));
});

app.get('/api/tareas/pendientes', (req, res) => {
  const pendientes = tareas.filter((tarea) => tarea.completada === false);
  res.json(pendientes.map(serializarTarea));
});

app.get('/api/tareas/:nombre', (req, res) => {
  const { nombre } = req.params;
  const tarea = obtenerTarea(nombre);

  if (!tarea) {
    return res.status(404).json({ error: `No existe la tarea "${nombre}".` });
  }

  res.json(serializarTarea(tarea));
});

app.post('/api/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  const validacion = validarTarea({ nombre, completada });
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.message });
  }

  const existe = tareas.some((tarea) => normalizarNombre(tarea.nombre) === normalizarNombre(nombre));
  if (existe) {
    return res.status(409).json({
      error: `Ya existe una tarea con el nombre "${nombre.trim()}".`
    });
  }

  const nuevaTarea = {
    nombre: nombre.trim(),
    completada: Boolean(completada)
  };

  tareas.push(nuevaTarea);

  res.status(201).json(serializarTarea(nuevaTarea));
});

app.put('/api/tareas/:nombre', (req, res) => {
  const { nombre } = req.params;
  const { nombre: nuevoNombre, completada } = req.body;

  const tarea = obtenerTarea(nombre);
  if (!tarea) {
    return res.status(404).json({ error: `No existe la tarea "${nombre}".` });
  }

  const nombreFinal = nuevoNombre ?? tarea.nombre;
  const estadoFinal = completada ?? tarea.completada;

  const validacion = validarTarea({
    nombre: nombreFinal,
    completada: estadoFinal
  });

  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.message });
  }

  const nombreDuplicado = tareas.some((item) => {
    if (item.nombre === tarea.nombre) return false;
    return normalizarNombre(item.nombre) === normalizarNombre(nombreFinal);
  });

  if (nombreDuplicado) {
    return res.status(409).json({
      error: `Ya existe una tarea con el nombre "${nombreFinal.trim()}".`
    });
  }

  tarea.nombre = nombreFinal.trim();
  tarea.completada = Boolean(estadoFinal);

  res.json(serializarTarea(tarea));
});

app.delete('/api/tareas/:nombre', (req, res) => {
  const { nombre } = req.params;
  const indice = tareas.findIndex((tarea) => normalizarNombre(tarea.nombre) === normalizarNombre(nombre));

  if (indice === -1) {
    return res.status(404).json({ error: `No existe la tarea "${nombre}".` });
  }

  const tareaEliminada = tareas.splice(indice, 1)[0];

  res.json({
    message: `Tarea "${tareaEliminada.nombre}" eliminada correctamente.`,
    tarea: serializarTarea(tareaEliminada)
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'API de tareas activa',
    endpoints: [
      'GET /api/tareas',
      'GET /api/tareas/completadas',
      'GET /api/tareas/pendientes',
      'GET /api/tareas/:nombre',
      'POST /api/tareas',
      'PUT /api/tareas/:nombre',
      'DELETE /api/tareas/:nombre'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});