export interface AddressDto {
  id: number;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
}

export interface OrderTypeDto {
  id?: number;
  name?: string;
  description?: string;
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
  name: string;
  customerId: number;
  orderTypeId: number;
  billingAddressId: number;
  deliveryAddressId: number;
  itemsId: number[];
  assignedWorkerIds: number[];
  createdAt: string;
  startDate?: string;
  dueDate: string;
  endDate?: string;
    active: boolean;
}

export interface OrderDateUpdateDto{
  id: number;
  startDate?: string;
  dueDate?: string;
  endDate?: string;
}


export interface EmployeeDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roleId?: number;
}

export interface RoleDto {
  id: number;
  name: string;
}

export interface CustomerDto {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  addressId?: number;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
}