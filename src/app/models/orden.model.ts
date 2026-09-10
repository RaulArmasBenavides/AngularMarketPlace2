export interface IItemOrden {
  producto: string;
  varianteSku?: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface IDireccionEnvio {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal?: string;
}

export interface IPago {
  metodo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  referencia?: string;
  monto: number;
}

export interface ITransicion {
  estado: string;
  fecha: string;
  usuario?: string;
  nota?: string;
}

export type EstadoOrden =
  | 'pendiente_pago'
  | 'pagado'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'reembolsado';

export interface IOrden {
  id?: string;
  numeroOrden: string;
  usuario: string;
  items: IItemOrden[];
  subtotal: number;
  impuesto: number;
  envio: number;
  descuento: number;
  total: number;
  direccionEnvio: IDireccionEnvio;
  estado: EstadoOrden;
  pago: IPago;
  historialTransiciones: ITransicion[];
  createdAt?: string;
  updatedAt?: string;
}
