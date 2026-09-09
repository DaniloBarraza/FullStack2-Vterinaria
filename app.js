const USUARIOS = [
  {
    usuario: "recepcion",
    clave: "recepcion123",
    nombre: "Camila Vidal",
    rol: "Recepcionista",
    modulos: ["inicio", "citas", "fichas"]
  },
  {
    usuario: "veterinario",
    clave: "veterinario123",
    nombre: "Dr. Andrés Soto",
    rol: "Médico Veterinario",
    modulos: ["inicio", "fichas", "vacunacion"]
  },
  {
    usuario: "admin",
    clave: "admin123",
    nombre: "Marcela Rivas",
    rol: "Administradora",
    modulos: ["inicio", "citas", "fichas", "vacunacion", "reportes"]
  }
];

function mostrarAdvertencia(mensaje) {
  Swal.fire({
    icon: "warning",
    title: "Faltan datos",
    text: mensaje,
    confirmButtonColor: "#1d6fa5"
  });
}

function mostrarError(mensaje) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje,
    confirmButtonColor: "#1d6fa5"
  });
}

function mostrarExito(mensaje) {
  Swal.fire({
    icon: "success",
    title: "Listo",
    text: mensaje,
    confirmButtonColor: "#1d6fa5"
  });
}

function campoVacio(id) {
  const elemento = document.getElementById(id);
  return !elemento.value || elemento.value.trim() === "";
}

function valorDe(id) {
  return document.getElementById(id).value;
}

function validarFormularioCitas() {
  if (campoVacio("citaDueno") || campoVacio("citaMascota") || campoVacio("citaTipo") || campoVacio("citaMotivo") || campoVacio("citaFecha") || campoVacio("citaHorario")) {
    mostrarAdvertencia("Completa todos los campos para agendar la cita.");
    return;
  }

  mostrarExito("Cita agendada correctamente para " + valorDe("citaMascota") + " el " + valorDe("citaFecha") + " a las " + valorDe("citaHorario") + ".");
  document.getElementById("formCitas").reset();
}

function validarFormularioFicha() {
  if (campoVacio("fichaDiagnostico") || campoVacio("fichaMedicamentos") || campoVacio("fichaProximoControl")) {
    mostrarAdvertencia("Completa el diagnóstico, los medicamentos y el próximo control.");
    return;
  }

  mostrarExito("Ficha clínica actualizada correctamente.");
  document.getElementById("formFicha").reset();
}

function validarFormularioVacunacion() {
  if (campoVacio("vacunaMascota") || campoVacio("vacunaTipo") || campoVacio("vacunaFechaAplicacion") || campoVacio("vacunaProximaDosis")) {
    mostrarAdvertencia("Completa todos los campos para registrar la vacuna.");
    return;
  }

  mostrarExito("Vacuna registrada correctamente para " + valorDe("vacunaMascota") + ".");
  document.getElementById("formVacunacion").reset();
}

function validarFormularioReportes() {
  if (campoVacio("reporteDesde") || campoVacio("reporteHasta") || campoVacio("reporteTipo")) {
    mostrarAdvertencia("Completa las fechas y el tipo de reporte.");
    return;
  }

  if (valorDe("reporteDesde") > valorDe("reporteHasta")) {
    mostrarAdvertencia("La fecha de término debe ser posterior a la fecha de inicio.");
    return;
  }

  mostrarExito("Reporte de \"" + valorDe("reporteTipo") + "\" generado correctamente.");
}


function iniciarSesion() {
  if (campoVacio("usuario") || campoVacio("password")) {
    mostrarAdvertencia("Ingresa tu usuario y contraseña.");
    return;
  }

  const usuarioIngresado = valorDe("usuario").trim();
  const claveIngresada = valorDe("password").trim();

  const usuarioEncontrado = USUARIOS.find(function (u) {
    return u.usuario === usuarioIngresado && u.clave === claveIngresada;
  });

  if (!usuarioEncontrado) {
    mostrarError("Usuario o contraseña incorrectos.");
    return;
  }

  sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
  window.location.href = "veterinaria.html";
}


function protegerPagina(moduloActual) {
  const datos = sessionStorage.getItem("usuarioActivo");

  if (!datos) {
    window.location.href = "index.html";
    return;
  }

  const usuarioActivo = JSON.parse(datos);

  if (moduloActual && usuarioActivo.modulos.indexOf(moduloActual) === -1) {
    window.location.href = "veterinaria.html";
    return;
  }

  document.querySelectorAll("[data-modulo]").forEach(function (enlace) {
    const modulo = enlace.getAttribute("data-modulo");
    if (usuarioActivo.modulos.indexOf(modulo) === -1) {
      enlace.closest(".nav-item").classList.add("d-none");
    }
  });

  document.getElementById("nombreUsuario").textContent = usuarioActivo.nombre;
  document.getElementById("rolUsuario").textContent = usuarioActivo.rol;
}

function cerrarSesion() {
  sessionStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
}