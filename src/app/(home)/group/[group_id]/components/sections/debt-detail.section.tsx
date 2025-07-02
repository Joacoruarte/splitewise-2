'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AddPaymentDialog } from '../dialog/add-payment.dialog';

const debtors = [
  {
    id: 1,
    name: 'Ana García',
    amount: 45.5,
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'AG',
  },
  {
    id: 2,
    name: 'Carlos López',
    amount: 23.75,
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'CL',
  },
  {
    id: 3,
    name: 'María Rodríguez',
    amount: 12.3,
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'MR',
  },
];

const creditors = [
  {
    id: 4,
    name: 'Pedro Sánchez',
    amount: 18.9,
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'PS',
  },
  {
    id: 5,
    name: 'Laura Martínez',
    amount: 32.4,
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'LM',
  },
];

export function DebtDetailSection() {
  const [showAddPayment, setShowAddPayment] = useState(false);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Te Deben</CardTitle>
            <CardDescription>Personas que te deben dinero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debtors.map(debtor => (
                <div key={debtor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={debtor.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{debtor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{debtor.name}</p>
                      <p className="text-xs text-muted-foreground">Te debe</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-500">
                      +€{debtor.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setShowAddPayment(true)}>
              Registrar Pago Recibido
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debes</CardTitle>
            <CardDescription>Personas a las que debes dinero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditors.map(creditor => (
                <div key={creditor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={creditor.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{creditor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{creditor.name}</p>
                      <p className="text-xs text-muted-foreground">Le debes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-500">
                      -€{creditor.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setShowAddPayment(true)}>
              Registrar Pago Realizado
            </Button>
          </CardFooter>
        </Card>
      </div>
      <AddPaymentDialog open={showAddPayment} onOpenChange={setShowAddPayment} />
    </>
  );
}
