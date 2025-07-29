import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export function formatCurrency(amount: number, showPrefix: boolean = false) {
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
    amount
  );

  if (showPrefix && amount > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success('Link copiado al portapapeles');
    })
    .catch(() => {
      toast.error('Error al copiar el link');
    });
}
