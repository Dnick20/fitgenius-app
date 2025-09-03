import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

const SidebarProvider = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({ className = "", children, ...props }) => {
  const context = useContext(SidebarContext);

  return (
    <>
      {/* Mobile backdrop */}
      {context?.isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => context.setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          context?.isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
        {...props}
      >
        {children}
      </aside>
    </>
  );
};

const SidebarContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex-1 overflow-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarGroup = ({ className = "", children, ...props }) => {
  return (
    <div className={`px-3 py-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarGroupContent = ({ className = "", children, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

const SidebarMenu = ({ className = "", children, ...props }) => {
  return (
    <ul className={`space-y-1 ${className}`} {...props}>
      {children}
    </ul>
  );
};

const SidebarMenuItem = ({ className = "", children, ...props }) => {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
};

const SidebarMenuButton = ({ 
  asChild, 
  isActive, 
  className = "", 
  children, 
  ...props 
}) => {
  if (asChild) {
    return React.cloneElement(children, {
      className: `${children.props.className || ''} ${className}`,
      ...props
    });
  }

  return (
    <button 
      className={`w-full text-left ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const SidebarHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`px-3 py-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`px-3 py-2 mt-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarTrigger = ({ className = "", ...props }) => {
  const context = useContext(SidebarContext);

  return (
    <button
      onClick={() => context?.setIsOpen(!context.isOpen)}
      className={`p-2 ${className}`}
      {...props}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

export {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
};