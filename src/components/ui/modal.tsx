'use client';

import { ReactNode } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-[550px]', className)}>{children}</DialogContent>
    </Dialog>
  );
}
