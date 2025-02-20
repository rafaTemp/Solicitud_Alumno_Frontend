export interface ICompanyData {
    id : number;
    website : string;
    name : string;
    NIF : string;

}


export interface ICompany {
    data: ICompanyData[];

}