import React from "react";

export const Card = ({ children, className }) => (
  <div className={`rounded-2xl shadow-md p-4 bg-white ${className || ""}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`border-b p-2 ${className || ""}`}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className || ""}`}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
  <div className={`p-2 ${className || ""}`}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={`border-t p-2 ${className || ""}`}>{children}</div>
);
