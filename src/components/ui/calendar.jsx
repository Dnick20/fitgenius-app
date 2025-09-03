import React from "react";

// Simple calendar component - in a real app you'd use a proper calendar library
const Calendar = ({ className = "", ...props }) => {
  return (
    <div className={`p-3 ${className}`} {...props}>
      <p className="text-sm text-muted-foreground">
        Calendar component - integrate with date-fns or similar library
      </p>
    </div>
  );
};

export { Calendar };