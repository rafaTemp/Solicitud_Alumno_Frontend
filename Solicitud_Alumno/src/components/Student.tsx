import { IStudent } from '../interfaces/IStudent';

export default function Student(props:IStudent) {
  return (
    <>
      <p>DNI: {props.dni}</p>
      <p>Nombre: {props.name}</p>
      <p>Email: {props.email}</p>
      <p>CV: {props.CV}</p>
      <p>Grupo: {props.group}</p>
      <p>Curso: {props.course}</p>
    </>
  )
} 
