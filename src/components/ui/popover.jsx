import React, { createContext, useContext, useState } from "react";

const PopoverContext = createContext();

const Popover = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = ({ asChild, children, ...props }) => {
  const { setIsOpen } = useContext(PopoverContext);

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

const PopoverContent = ({ className = "", children, align = "center", ...props }) => {
  const { isOpen, setIsOpen } = useContext(PopoverContext);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`absolute z-50 mt-1 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export { Popover, PopoverTrigger, PopoverContent };