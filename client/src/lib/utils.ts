import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get total from cart items
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Icon mapping for categories
export const categoryIcons: Record<string, string> = {
  'Bebidas': 'local_bar',
  'Hortifruti': 'eco',
  'Limpeza': 'cleaning_services',
  'Alimentos': 'restaurant',
  'Diversos': 'category',
};

// Payment method options
export const paymentMethods = [
  { id: 'cash', label: 'Dinheiro', icon: 'payments' },
  { id: 'credit', label: 'Cartão de Crédito', icon: 'credit_card' },
  { id: 'debit', label: 'Cartão de Débito', icon: 'credit_card' },
  { id: 'pix', label: 'PIX', icon: 'qr_code' },
];

// Map payment method ID to label
export const paymentMethodLabels: Record<string, string> = {
  'cash': 'Dinheiro',
  'credit': 'Cartão de Crédito',
  'debit': 'Cartão de Débito',
  'pix': 'PIX',
};

// Reason options for adding balance
export const balanceReasons = [
  { id: 'opening', label: 'Abertura de Caixa' },
  { id: 'adjustment', label: 'Ajuste de Saldo' },
  { id: 'other', label: 'Outro' },
];
