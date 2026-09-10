import { IProducto } from './producto.model';

export interface IItemCarrito {
  producto: string | IProducto;
  varianteSku?: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ICarrito {
  id?: string;
  usuario: string;
  items: IItemCarrito[];
  createdAt?: string;
  updatedAt?: string;
}
