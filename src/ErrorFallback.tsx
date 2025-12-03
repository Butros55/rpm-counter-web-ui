import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangleIcon />
          <AlertTitle>This spark has encountered a runtime error</AlertTitle>
          </AlertDescription
        
          <h3 className="font
            {err
        
        <Button 
          className="w-full"
        >
          Try Again
      </div>
  );













