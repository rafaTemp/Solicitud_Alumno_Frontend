export interface IStudent {
  dni: string;
  name: string;
  email: string;
  CV: string;
  group: '1-ASIR' | '2-ASIR' | '1-DAW' | '2-DAW' | '1-DAM' | '2-DAM';
  course: '24/25' | '25/26' | '26/27';
  password ?: string;
}

