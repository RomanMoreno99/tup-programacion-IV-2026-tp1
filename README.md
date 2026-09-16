# Trabajo Práctico N.° 1 - Programación IV

En este trabajo práctico desarrollé tres APIs utilizando Node.js y Express.js.

## Ejercicio 1: Rectángulos

Se desarrolló una API para:

- Calcular el área.
- Calcular el perímetro.
- Identificar si una figura es un rectángulo o un cuadrado.
- Validar que la base y la altura sean mayores que cero.

Archivo de pruebas: `rectangles.http`

## Ejercicio 2: Alumnos

Se desarrolló una API para administrar alumnos y sus calificaciones.

Permite:

- Consultar todos los alumnos.
- Consultar un alumno específico.
- Crear, modificar y eliminar alumnos.
- Calcular el promedio.
- Determinar si el alumno está reprobado, aprobado o promocionado.
- Validar que cada alumno tenga tres notas entre 0 y 10.
- Evitar nombres de alumnos duplicados.

Archivo de pruebas: `alumnos.http`

## Ejercicio 3: Tareas

Se desarrolló una API para administrar tareas.

Permite:

- Consultar todas las tareas.
- Consultar tareas completadas y pendientes.
- Consultar una tarea específica.
- Crear, modificar y eliminar tareas.
- Validar los datos ingresados.
- Evitar tareas con nombres duplicados.

Archivo de pruebas: `tareas.http`

## Ejecución

Para ejecutar cada ejercicio:

```bash
npm install
node app.js
```

Las APIs se ejecutan por defecto en:

```text
http://localhost:3000
```

Los archivos `.http` contienen ejemplos para probar los distintos endpoints.
