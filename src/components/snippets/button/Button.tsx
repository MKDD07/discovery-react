import React from "react";

export type ButtonVariant = "background" | "stroke";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Universal Button Snippet for Discovery
 * Gradient: linear-gradient(52deg, #84C418 11.5%, #A8D94E 129.52%)
 *
 * Types:
 * - "background": Full gradient fill with soft glow and elevated hover
 * - "stroke": 2px gradient stroke / border outline with smooth gradient fill on hover
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "background",
  size = "md",
  href,
  target,
  icon,
  iconPosition = "right",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  onClick,
  style,
  ...restProps
}) => {
  // Base classes
  const variantClass =
    variant === "stroke"
      ? "tp-btn-universal-stroke"
      : "tp-btn-universal-bg";

  const sizeClass =
    size === "sm"
      ? "tp-btn-size-sm"
      : size === "lg"
      ? "tp-btn-size-lg"
      : "tp-btn-size-md";

  const combinedClass = [
    "tp-btn-universal",
    variantClass,
    sizeClass,
    fullWidth ? "w-100" : "",
    disabled || loading ? "opacity-75 pe-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
      )}
      {icon && iconPosition === "left" && (
        <span className="tp-btn-icon-left d-inline-flex align-items-center">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {icon && iconPosition === "right" && (
        <span className="tp-btn-icon-right d-inline-flex align-items-center">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={combinedClass}
        onClick={onClick as any}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={combinedClass}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...restProps}
    >
      {content}
    </button>
  );
};

export default Button;
