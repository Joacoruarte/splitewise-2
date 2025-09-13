# Hooks de Expenses

## useCreateExpense

Hook para crear un nuevo gasto en un grupo con validaciones completas usando Zod.

### Uso

```tsx
import { useCreateExpense } from '@/hooks/use-create-expense';

const MyComponent = ({ groupId }: { groupId: string }) => {
  const { createExpense, validateExpense, isPending, error } = useCreateExpense({ groupId });

  const handleCreateExpense = async () => {
    const expenseData = {
      description: 'Cena en restaurante',
      amount: 50.0,
      date: '2024-01-15',
      categoryId: 'category-id',
      groupId: 'group-id',
      participants: ['user1', 'user2', 'user3'],
      splitMethod: 'equal', // 'equal' | 'percentage' | 'exact'
      splitDetails: {
        // Solo necesario para 'percentage' o 'exact'
        user1: 33.33, // porcentaje o monto exacto
        user2: 33.33,
        user3: 33.34,
      },
    };

    // Validar antes de enviar
    const validation = validateExpense(expenseData);
    if (!validation.success) {
      const firstError = validation.errors?.errors[0];
      console.error('Error de validación:', firstError?.message);
      return;
    }

    try {
      await createExpense(expenseData);
    } catch (error) {
      console.error('Error al crear el gasto:', error);
    }
  };

  return (
    <button onClick={handleCreateExpense} disabled={isPending}>
      {isPending ? 'Creando...' : 'Crear Gasto'}
    </button>
  );
};
```

### Parámetros

- `groupId` (opcional): ID del grupo para invalidar queries específicas

### Retorno

- `createExpense`: Función para crear el gasto
- `validateExpense`: Función para validar los datos antes de enviar
- `isPending`: Estado de carga
- `error`: Error si ocurre alguno

### Métodos de división

1. **equal**: Divide el gasto en partes iguales entre todos los participantes
2. **percentage**: Divide según porcentajes específicos (debe sumar 100%)
3. **exact**: Divide según montos exactos (debe sumar el total del gasto)

### Validaciones con Zod

#### Validaciones básicas:

- **Descripción**: Requerida, máximo 100 caracteres
- **Monto**: Mayor a 0, máximo 999,999.99
- **Fecha**: Requerida, no puede ser futura
- **Categoría**: Requerida
- **Participantes**: Al menos uno seleccionado
- **Método de división**: Debe ser 'equal', 'percentage' o 'exact'

#### Validaciones específicas por método:

- **Equal**: No requiere splitDetails
- **Percentage**: Los porcentajes deben sumar 100%
- **Exact**: Los montos exactos deben sumar el total del gasto

#### Validaciones del servidor:

- Usuario autenticado
- Usuario es miembro del grupo
- Validación adicional con Zod en el servidor
