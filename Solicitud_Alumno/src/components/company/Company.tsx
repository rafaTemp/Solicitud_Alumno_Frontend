import { ICompany } from '../../interfaces/ICompany';


export default function Company(props:ICompany) {
  return (
    <>
      <p>NIF: {props.NIF}</p>
      <p>Nombre: {props.name}</p>
      <p>Web: {props.website}</p>
    </>
  )
} 
