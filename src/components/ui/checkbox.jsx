import React from "react";

const Checkbox = ({ className = "", checked, onCheckedChange, id, ...props }) => {
  return (
    <input
      type="checkbox"
      id={id}
      className={`h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
};

export { Checkbox };