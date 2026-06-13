export interface CreateProductDto {
  fabrica: string;
  articulo: string;
  color: string;
  costo: number;
  precioPublico: number;
  stock: {
    '5': number;
    '6': number;
    '7': number;
    '8': number;
    '9': number;
    '0': number;
    '1': number;
  };
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface SaleItemDto {
  productId: string;
  talle: string;
  cantidad: number;
}

export interface CreateSaleDto {
  items: SaleItemDto[];
}

export interface CreateExchangeDto {
  devuelto: SaleItemDto;
  entregado: SaleItemDto;
}

export interface CreateReturnDto {
  productId: string;
  talle: string;
  cantidad: number;
  montoDevuelto: number;
}