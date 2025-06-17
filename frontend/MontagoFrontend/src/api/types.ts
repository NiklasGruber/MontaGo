export interface AddressDto {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
}

export interface OrderTypeDto {
  name?: string;
  description?: string;
}

export interface OrderItemDto {
  productName?: string;
  quantity: number;
}

export interface WorkerDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface OrderDto {
  id: number;
  customerName?: string;
  createdAt: string;
  billingAddress?: AddressDto;
  deliveryAddress?: AddressDto;
  orderType?: OrderTypeDto;
  items?: OrderItemDto[];
  assignedWorkers?: WorkerDto[];
}

export interface EmployeeDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

