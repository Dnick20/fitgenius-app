import React, { createContext, useContext } from "react";

const RadioGroupContext = createContext();

const RadioGroup = ({ value, onValueChange, className = "", children, ...props }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`grid gap-2 ${className}`} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const RadioGroupItem = ({ value, id, className = "", ...props }) => {
  const context = useContext(RadioGroupContext);
  
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={context?.value === value}
      onChange={() => context?.onValueChange(value)}
      className={`h-4 w-4 border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export { RadioGroup, RadioGroupItem };