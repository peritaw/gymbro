export const routineTemplates = [
  {
    name: 'Full Body Clásico (3 Días)',
    description: 'Ideal para principiantes. Trabaja todo el cuerpo en cada sesión con frecuencia 3.',
    days: [
      {
        dayNumber: 1,
        name: 'Día A',
        muscleGroup: 'Full Body',
        exercises: [
          { name: 'Sentadilla Libre', sets: 4, reps: 8, notes: 'Controlá la bajada', order: 0 },
          { name: 'Press de Banca Plano', sets: 4, reps: 8, notes: 'Anchura de hombros', order: 1 },
          { name: 'Remo con Barra', sets: 4, reps: 10, notes: '', order: 2 },
          { name: 'Elevaciones Laterales', sets: 3, reps: 15, notes: '', order: 3 },
          { name: 'Curl de Bíceps', sets: 3, reps: 12, notes: '', order: 4 },
        ]
      },
      {
        dayNumber: 2,
        name: 'Día B',
        muscleGroup: 'Full Body',
        exercises: [
          { name: 'Peso Muerto Rumano', sets: 4, reps: 8, notes: 'Espalda recta', order: 0 },
          { name: 'Press Militar', sets: 4, reps: 8, notes: '', order: 1 },
          { name: 'Dominadas o Jalón al Pecho', sets: 4, reps: 10, notes: '', order: 2 },
          { name: 'Zancadas o Estocadas', sets: 3, reps: 12, notes: 'Por pierna', order: 3 },
          { name: 'Extensión de Tríceps', sets: 3, reps: 12, notes: '', order: 4 },
        ]
      },
      {
        dayNumber: 3,
        name: 'Día C',
        muscleGroup: 'Full Body',
        exercises: [
          { name: 'Prensa Inclinada', sets: 4, reps: 10, notes: '', order: 0 },
          { name: 'Press Inclinado con Mancuernas', sets: 4, reps: 10, notes: '', order: 1 },
          { name: 'Remo en Polea Baja', sets: 4, reps: 12, notes: '', order: 2 },
          { name: 'Face Pull', sets: 3, reps: 15, notes: '', order: 3 },
          { name: 'Plancha Abdominal', sets: 3, reps: 1, notes: '60 segundos', order: 4 },
        ]
      }
    ]
  },
  {
    name: 'Push / Pull / Legs (6 Días)',
    description: 'Para intermedios/avanzados. Frecuencia 2 por grupo muscular.',
    days: [
      {
        dayNumber: 1,
        name: 'Push (Empuje)',
        muscleGroup: 'Pecho, Hombros, Tríceps',
        exercises: [
          { name: 'Press de Banca', sets: 4, reps: 8, notes: '', order: 0 },
          { name: 'Press Militar', sets: 4, reps: 8, notes: '', order: 1 },
          { name: 'Aperturas Inclinadas', sets: 3, reps: 12, notes: '', order: 2 },
          { name: 'Elevaciones Laterales', sets: 4, reps: 15, notes: '', order: 3 },
          { name: 'Extensión Tríceps Polea', sets: 4, reps: 12, notes: '', order: 4 },
        ]
      },
      {
        dayNumber: 2,
        name: 'Pull (Tirón)',
        muscleGroup: 'Espalda, Bíceps',
        exercises: [
          { name: 'Dominadas', sets: 4, reps: 8, notes: '', order: 0 },
          { name: 'Remo con Barra', sets: 4, reps: 8, notes: '', order: 1 },
          { name: 'Jalón al Pecho Supino', sets: 3, reps: 12, notes: '', order: 2 },
          { name: 'Curl Bíceps Barra', sets: 4, reps: 10, notes: '', order: 3 },
          { name: 'Curl Martillo', sets: 3, reps: 12, notes: '', order: 4 },
        ]
      },
      {
        dayNumber: 3,
        name: 'Legs (Piernas)',
        muscleGroup: 'Piernas, Glúteos',
        exercises: [
          { name: 'Sentadilla', sets: 4, reps: 8, notes: '', order: 0 },
          { name: 'Prensa', sets: 3, reps: 10, notes: '', order: 1 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: 10, notes: '', order: 2 },
          { name: 'Curl Femoral', sets: 3, reps: 12, notes: '', order: 3 },
          { name: 'Elevación de Talones (Gemelos)', sets: 4, reps: 15, notes: '', order: 4 },
        ]
      }
    ]
  }
];
