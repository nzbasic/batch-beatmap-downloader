import React from 'react';

type Colors = 'blue' | 'green' | 'red' | 'transparent';

interface PropTypes {
  color?: Colors,
  onClick?: () => void,
  disabled?: boolean,
  children?: React.ReactNode,
  className?: string,
  type?: 'button' | 'submit' | 'reset'
}

interface ColorData {
  default: string,
  hover: string,
}

const colorMap: Record<Colors, ColorData> = {
  blue: {
    default: 'bg-sky-500',
    hover: 'hover:bg-sky-600',
  },
  green: {
    default: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
  },
  red: {
    default: 'bg-red-500',
    hover: 'hover:bg-red-600',
  },
  transparent: {
    default: 'bg-transparent',
    hover: 'hover:bg-transparent',
  },
};

const Button: React.FC<PropTypes> = ({
  color = 'blue',
  type = 'button',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
  disabled = false,
  children = null,
  className = '',
}) => (
  <button
    type={type}
    className={`
      ${colorMap[color].default}
      ${colorMap[color].hover}
      px-2 py-1 rounded text-white font-semibold transition-colors disabled:opacity-50
      ${className}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
