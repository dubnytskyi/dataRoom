import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <p className="mt-4 text-destructive">{error}</p>
    </div>
  );
};
