import { z } from 'zod';

export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(100, 'La descripción no puede tener más de 100 caracteres'),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999.99, 'El monto no puede ser mayor a 999,999.99'),
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .refine(
      date => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Fin del día actual
        return selectedDate <= today;
      },
      {
        message: 'La fecha no puede ser futura',
      }
    ),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  groupId: z.string().min(1, 'El ID del grupo es requerido'),
  participants: z.array(z.string()).min(1, 'Debes seleccionar al menos un participante'),
  splitMethod: z.enum(['equal', 'percentage', 'exact'], {
    required_error: 'Debes seleccionar un método de división',
  }),
  splitDetails: z
    .record(z.string(), z.number())
    .optional()
    .refine(
      details => {
        // Si no hay detalles, es válido (para método 'equal')
        if (!details) return true;

        // Para percentage, la suma debe ser 100
        if (Object.values(details).some(val => val < 0)) {
          return false;
        }

        return true;
      },
      {
        message: 'Los valores no pueden ser negativos',
      }
    ),
});
// .refine(
//   data => {
//     // Validaciones específicas según el método de división
//     if (data.splitMethod === 'percentage' && data.splitDetails) {
//       const total = Object.values(data.splitDetails).reduce((sum, val) => sum + val, 0);
//       return Math.abs(total - 100) < 0.01; // Permitir pequeñas diferencias por decimales
//     }

//     if (data.splitMethod === 'exact' && data.splitDetails) {
//       const total = Object.values(data.splitDetails).reduce((sum, val) => sum + val, 0);
//       return Math.abs(total - data.amount) < 0.01; // Permitir pequeñas diferencias por decimales
//     }

//     return true;
//   },
//   {
//     message: data => {
//       if (data.splitMethod === 'percentage') {
//         return 'Los porcentajes deben sumar 100%';
//       }
//       if (data.splitMethod === 'exact') {
//         return 'Los montos exactos deben sumar el total del gasto';
//       }
//       return 'Datos de división inválidos';
//     },
//     path: ['splitDetails'],
//   }
// );

export type CreateExpenseData = z.infer<typeof createExpenseSchema>;

// Esquema para validar solo los datos básicos (sin splitDetails)
export const basicExpenseSchema = createExpenseSchema; //.omit({ splitDetails: true });

export type BasicExpenseData = z.infer<typeof basicExpenseSchema>;
