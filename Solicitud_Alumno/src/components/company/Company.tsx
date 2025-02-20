import { ICompanyData } from '../../interfaces/ICompany';


export default function Company(props:ICompanyData) {
  return (
    <>
      <p>NIF: {props.NIF}</p>
      <p>Nombre: {props.name}</p>
      <p>Web: {props.website}</p>
    </>
  )
} 
