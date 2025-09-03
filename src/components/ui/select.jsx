import React, { createContext, useContext, useState } from "react";

const SelectContext = createContext();

const Select = ({ value, onValueChange, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ className = "", children, ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <svg
        className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

const SelectValue = ({ placeholder, className = "" }) => {
  const { value } = useContext(SelectContext);
  
  return (
    <span className={`truncate ${!value ? 'text-muted-foreground' : ''} ${className}`}>
      {value || placeholder}
    </span>
  );
};

const SelectContent = ({ className = "", children, ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
        {...props}
      >
        <div className="p-1 max-h-60 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
};

const SelectItem = ({ value, children, className = "", ...props }) => {
  const { onValueChange, setIsOpen } = useContext(SelectContext);
  
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${className}`}
      onClick={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };