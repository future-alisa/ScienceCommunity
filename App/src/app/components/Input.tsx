"use client";

import { useTheme } from "@/theme/ThemeContext";
import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "filled";
  fullWidth?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      className = "",
      fullWidth = false,
      error = false,
      icon,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    const variantStyles = {
      default: {
        backgroundColor: theme.backgroundColor || theme.backgroundColor,
        border: `1px solid ${
          error ? theme.errorColor : theme.borderColor || "#E0E0E0"
        }`,
      },
      outline: {
        backgroundColor: "transparent",
        border: `2px solid ${error ? theme.errorColor : theme.primaryColor}`,
      },
      filled: {
        backgroundColor: theme.backgroundColor || "#F5F5F5",
        border: "none",
      },
    };

    return (
      <div
        className={`${styles.input_container} ${
          fullWidth ? styles.fullWidth : ""
        }`}
        style={style}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          ref={ref}
          className={`${styles.input} ${styles[variant]} ${
            error ? styles.error : ""
          } ${className}`}
          style={{
            color: theme.color,
            paddingLeft: icon ? "2.5rem" : "1rem",
            ...variantStyles[variant],
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
