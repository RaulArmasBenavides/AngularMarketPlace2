export interface IVariante {
  atributos: Record<string, string>;
  sku: string;
  precio?: number;
  stock: number;
}

export interface IProducto {
  id?: string;
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: string | { id?: string; nombre: string; slug: string };
  marca?: string;
  precio: number;
  precioOferta?: number;
  sku: string;
  imagenes: string[];
  variantes: IVariante[];
  stock: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
