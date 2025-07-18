import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  rounded?: 'none' | 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  style
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };

  const roundedClasses = {
    none: '',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  };

  const classes = `
    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${className}
  `.trim();

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

export default Card;
