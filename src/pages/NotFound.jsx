
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl mb-6 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center text-accent hover:text-accent/80 transition-colors animated-link"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
