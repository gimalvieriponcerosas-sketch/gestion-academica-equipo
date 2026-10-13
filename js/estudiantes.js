const formulario = document.getElementById("formEstudiante");
const lista = document.getElementById("listaEstudiantes");
const buscador = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");

let estudiantes = [];

try {
  estudiantes = JSON.parse(
    localStorage.getItem("estudiantes") || "[]"
  );

  if (!Array.isArray(estudiantes)) {
    estudiantes = [];
  }
} catch {
  estudiantes = [];
}

function guardarEstudiantes() {
  try {
    localStorage.setItem(
      "estudiantes",
      JSON.stringify(estudiantes)
    );
    return true;
  } catch {
    mensaje.textContent = "No se pudieron guardar los datos.";
    return false;
  }
}

function crearCelda(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  fila.appendChild(celda);
}

function mostrarEstudiantes(filtro = "") {
  lista.replaceChildren();

  const consulta = filtro.trim().toLowerCase();

  const resultados = estudiantes.filter((estudiante) =>
    [estudiante.codigo, estudiante.nombres,
      estudiante.apellidos, estudiante.correo]
      .some((dato) => dato.toLowerCase().includes(consulta))
  );

  resultados.forEach((estudiante) => {
    const fila = document.createElement("tr");

    crearCelda(fila, estudiante.codigo);
    crearCelda(fila, estudiante.nombres);
    crearCelda(fila, estudiante.apellidos);
    crearCelda(fila, estudiante.correo);

    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "eliminar";

    botonEliminar.addEventListener("click", () => {
      const confirmar = window.confirm(
        `¿Eliminar al estudiante ${estudiante.nombres}?`
      );

      if (!confirmar) return;

      const anteriores = estudiantes;
      estudiantes = estudiantes.filter(
        (e) => e.codigo !== estudiante.codigo
      );

      if (!guardarEstudiantes()) {
        estudiantes = anteriores;
        return;
      }

      mostrarEstudiantes(buscador.value);
      mensaje.textContent = "Estudiante eliminado.";
    });

    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);
    lista.appendChild(fila);
  });

  total.textContent =
    `Total de estudiantes: ${estudiantes.length}`;

  if (resultados.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 5;
    celda.textContent = "No se encontraron estudiantes.";
    fila.appendChild(celda);
    lista.appendChild(fila);
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const codigo = document.getElementById("codigo").value.trim();
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (!codigo || !nombres || !apellidos || !correo) {
    mensaje.textContent = "Completa todos los campos.";
    return;
  }

  const duplicado = estudiantes.some(
    (e) => e.codigo.toLowerCase() === codigo.toLowerCase()
  );

  if (duplicado) {
    mensaje.textContent = "Ese código estudiantil ya existe.";
    return;
  }

  const nuevoEstudiante = { codigo, nombres, apellidos, correo };
  estudiantes.push(nuevoEstudiante);

  if (!guardarEstudiantes()) {
    estudiantes.pop();
    return;
  }

  formulario.reset();
  mostrarEstudiantes(buscador.value);
  mensaje.textContent = "Estudiante registrado correctamente.";
});

buscador.addEventListener("input", () => {
  mostrarEstudiantes(buscador.value);
});

mostrarEstudiantes();