export interface IRequest {
  companyId: string;
  question: string;
  studentId ?: string; // ID del alumno que ha iniciado sesión
}