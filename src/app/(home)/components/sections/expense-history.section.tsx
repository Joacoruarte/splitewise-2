import { Progress } from '@radix-ui/react-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Car, Coffee, Plane, Plus, ShoppingBag, Utensils } from 'lucide-react';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { AddExpenseDialog } from '../dialog/add-expense-dialog';

// Datos de ejemplo
const recentExpenses = [
  {
    id: 1,
    description: 'Cena en restaurante',
    amount: 85.5,
    date: '2023-05-01',
    category: 'Comida',
    icon: Utensils,
    participants: ['Ana', 'Carlos', 'Tú'],
  },
  {
    id: 2,
    description: 'Taxi al aeropuerto',
    amount: 45.0,
    date: '2023-04-28',
    category: 'Transporte',
    icon: Car,
    participants: ['María', 'Tú'],
  },
  {
    id: 3,
    description: 'Compras supermercado',
    amount: 62.35,
    date: '2023-04-25',
    category: 'Compras',
    icon: ShoppingBag,
    participants: ['Pedro', 'Laura', 'Tú'],
  },
  {
    id: 4,
    description: 'Entradas al cine',
    amount: 36.0,
    date: '2023-04-22',
    category: 'Ocio',
    icon: Coffee,
    participants: ['Ana', 'Tú'],
  },
  {
    id: 5,
    description: 'Alojamiento hotel',
    amount: 120.0,
    date: '2023-04-20',
    category: 'Viaje',
    icon: Plane,
    participants: ['Carlos', 'María', 'Pedro', 'Laura', 'Tú'],
  },
];

const categoryExpenses = [
  { category: 'Comida', amount: 245.8, icon: Utensils, color: 'bg-green-500' },
  { category: 'Transporte', amount: 128.5, icon: Car, color: 'bg-blue-500' },
  { category: 'Viaje', amount: 350.0, icon: Plane, color: 'bg-purple-500' },
  { category: 'Compras', amount: 95.35, icon: ShoppingBag, color: 'bg-yellow-500' },
  { category: 'Ocio', amount: 75.2, icon: Coffee, color: 'bg-pink-500' },
];

export function ExpenseHistorySection() {
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Gastos</h2>
        <Button onClick={() => setShowAddExpense(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Gasto
        </Button>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="categories">Por Categorías</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4 pt-4">
          {recentExpenses.map(expense => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10`}
                    >
                      <expense.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{expense.amount.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {expense.participants.map((participant, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {categoryExpenses.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${category.color}`}
                        >
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <span className="font-medium">€{category.amount.toFixed(2)}</span>
                    </div>
                    <Progress value={category.amount / 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
    </>
  );
}
