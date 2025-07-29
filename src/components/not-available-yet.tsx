import { ReactNode } from 'react';

interface NotAvailableYetProps {
  children: ReactNode;
  message?: string;
}

export const NotAvailableYet = ({
  children,
  message = 'This feature is not available yet',
}: NotAvailableYetProps) => {
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">{children}</div>

      {/* Overlay with message */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center p-6 rounded-lg bg-card border shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">{message}</p>
          <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
};
