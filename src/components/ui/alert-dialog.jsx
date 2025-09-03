import React, { createContext, useContext, useState } from "react";

const AlertDialogContext = createContext();

const AlertDialog = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50 bg-background rounded-lg shadow-lg max-w-lg w-full mx-4">
            {React.Children.map(children, child => {
              if (child?.type === AlertDialogContent) {
                return child;
              }
              return null;
            })}
          </div>
        </div>
      )}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = ({ children, asChild, ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext);
  
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(true),
      ...props
    });
  }
  
  return (
    <button onClick={() => setIsOpen(true)} {...props}>
      {children}
    </button>
  );
};

const AlertDialogContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const AlertDialogHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const AlertDialogTitle = ({ className = "", children, ...props }) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h2>
  );
};

const AlertDialogDescription = ({ className = "", children, ...props }) => {
  return (
    <p className={`text-sm text-muted-foreground mt-2 ${className}`} {...props}>
      {children}
    </p>
  );
};

const AlertDialogFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex justify-end gap-2 mt-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const AlertDialogAction = ({ className = "", children, onClick, ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext);
  
  return (
    <button
      className={`bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
      onClick={(e) => {
        onClick?.(e);
        setIsOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel = ({ className = "", children, ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext);
  
  return (
    <button
      className={`border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
      onClick={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};