export interface IStudent {
  id: number;              // ID único del estudiante
  dni: string;             // DNI (identificación única)
  name: string;            // Nombre del estudiante
  email: string;           // Correo electrónico único
  CV?: string | null;      // CV (opcional, puede ser nulo)
  group: '1-ASIR' | '2-ASIR' | '1-DAW' | '2-DAW' | '1-DAM' | '2-DAM'; // Grupo
  course: '24/25' | '25/26' | '26/27';   // Curso (Año académico)
  password: string;        // Contraseña (aunque normalmente no se devuelve por seguridad)
  created_at: string;      // Fecha de creación
  updated_at: string;      // Fecha de actualización
}
