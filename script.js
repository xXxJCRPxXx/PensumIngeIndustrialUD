// Función principal para completar materias
function completarMateria(id) {
  const materia = document.getElementById(id) || document.querySelector(`[onclick*="${id}"]`);
  if (!materia.classList.contains('bloqueada')) {
    materia.classList.add('completada');
    
    // Desbloquear materias dependientes
    document.querySelectorAll('.materia').forEach(m => {
      const requisitos = m.getAttribute('requisitos');
      if (requisitos) {
        const todosRequisitosCumplidos = requisitos.split(',').every(reqId => {
          const reqMateria = document.getElementById(reqId) || document.querySelector(`[onclick*="${reqId}"]`);
          return reqMateria && reqMateria.classList.contains('completada');
        });
        
        if (todosRequisitosCumplidos && m.classList.contains('bloqueada')) {
          m.classList.remove('bloqueada');
          m.classList.add('disponible');
          m.onclick = () => completarMateria(m.id);
        }
      }
    });

    // Guardar en localStorage
    const completadas = JSON.parse(localStorage.getItem('materiasCompletadas')) || [];
    if (!completadas.includes(id)) {
      localStorage.setItem('materiasCompletadas', JSON.stringify([...completadas, id]));
    }
  }
}

// Cargar progreso al iniciar
function cargarProgreso() {
  const completadas = JSON.parse(localStorage.getItem('materiasCompletadas')) || [];
  completadas.forEach(id => {
    const materia = document.getElementById(id) || document.querySelector(`[onclick*="${id}"]`);
    if (materia) {
      materia.classList.add('completada');
    }
  });

  // Verificar requisitos para todas las materias
  document.querySelectorAll('.materia').forEach(m => {
    const requisitos = m.getAttribute('requisitos');
    if (requisitos) {
      const todosRequisitosCumplidos = requisitos.split(',').every(reqId => {
        const reqMateria = document.getElementById(reqId) || document.querySelector(`[onclick*="${reqId}"]`);
        return reqMateria && reqMateria.classList.contains('completada');
      });
      
      if (todosRequisitosCumplidos && m.classList.contains('bloqueada')) {
        m.classList.remove('bloqueada');
        m.classList.add('disponible');
        m.onclick = () => completarMateria(m.id);
      }
    }
  });
}

// Reiniciar progreso (opcional)
function reiniciarProgreso() {
  if (confirm('¿Estás seguro de reiniciar todo tu progreso?')) {
    localStorage.removeItem('materiasCompletadas');
    document.querySelectorAll('.materia').forEach(m => {
      if (m.classList.contains('completada')) {
        m.classList.remove('completada');
      }
      if (m.hasAttribute('requisitos')) {
        m.classList.remove('disponible');
        m.classList.add('bloqueada');
        m.onclick = null;
      }
    });
    // Volver a habilitar las del primer semestre
    document.querySelectorAll('.semestre:nth-child(1) .materia').forEach(m => {
      m.classList.add('disponible');
      m.onclick = () => completarMateria(m.id || m.getAttribute('onclick').match(/'([^']+)'/)[1]);
    });
  }
}

// Botón de reinicio (añadir al HTML si lo deseas)
document.addEventListener('DOMContentLoaded', () => {
  cargarProgreso();
  
  // Añadir botón de reinicio (opcional)
  const botonReinicio = document.createElement('button');
  botonReinicio.textContent = 'Reiniciar Progreso';
  botonReinicio.style.display = 'block';
  botonReinicio.style.margin = '20px auto';
  botonReinicio.style.padding = '10px 15px';
  botonReinicio.style.background = '#d32f2f';
  botonReinicio.style.color = 'white';
  botonReinicio.style.border = 'none';
  botonReinicio.style.borderRadius = '5px';
  botonReinicio.style.cursor = 'pointer';
  botonReinicio.onclick = reiniciarProgreso;
  document.body.insertBefore(botonReinicio, document.querySelector('.semestres-container'));
});
