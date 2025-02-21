export interface IRequest {
  companyId: string;
  question: string;
  studentId ?: number; // ID del alumno que ha iniciado sesión
}