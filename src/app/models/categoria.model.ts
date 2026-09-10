export interface ICategoria {
  id?: string;
  nombre: string;
  slug: string;
  categoriaPadre?: string | null;
  activo: boolean;
  orden: number;
  createdAt?: string;
  updatedAt?: string;
}
