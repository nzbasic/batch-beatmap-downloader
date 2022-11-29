import React from 'react';

type Colors = 'blue' | 'green' | 'red' | 'transparent' | 'none';

interface PropTypes {
  color?: Colors,
  onClick?: () => void,
  disabled?: boolean,
  children?: React.ReactNode,
  className?: string,
  type?: 'button' | 'submit' | 'reset'
}

const colorMap: Record<Colors, string> = {
  blue: 'bg-sky-500 hover:bg-sky-600',
  green: 'bg-emerald-600 hover:bg-emerald-700',
  red: 'bg-red-500 hover:bg-red-600',
  transparent: 'bg-transparent hover:bg-transparent',
  none: '',
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
      ${colorMap[color]}
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
