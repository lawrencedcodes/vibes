'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<LayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

interface GridProps extends LayoutProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = 1,
  gap = 'md',
  mdCols,
  lgCols,
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const mdColsClass = mdCols ? {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  }[mdCols] : '';

  const lgColsClass = lgCols ? {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[lgCols] : '';

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-8',
  };

  return (
    <div className={`grid ${colsClass[cols]} ${mdColsClass} ${lgColsClass} ${gapClass[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface FlexProps extends LayoutProps {
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
  mdDirection?: 'row' | 'col';
  lgDirection?: 'row' | 'col';
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = '',
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'md',
  wrap = false,
  mdDirection,
  lgDirection,
}) => {
  const directionClass = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const mdDirectionClass = mdDirection ? {
    row: 'md:flex-row',
    col: 'md:flex-col',
  }[mdDirection] : '';

  const lgDirectionClass = lgDirection ? {
    row: 'lg:flex-row',
    col: 'lg:flex-col',
  }[lgDirection] : '';

  const justifyClass = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClass = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-8',
  };

  const wrapClass = wrap ? 'flex-wrap' : '';

  return (
    <div className={`flex ${directionClass[direction]} ${mdDirectionClass} ${lgDirectionClass} ${justifyClass[justify]} ${alignClass[align]} ${gapClass[gap]} ${wrapClass} ${className}`}>
      {children}
    </div>
  );
};

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  return orientation === 'horizontal' ? (
    <div className={`h-px w-full bg-border my-4 ${className}`} />
  ) : (
    <div className={`w-px h-full bg-border mx-4 ${className}`} />
  );
};

interface SectionProps extends LayoutProps {
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  title,
  description,
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <section className={`py-12 ${className}`}>
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className={`text-3xl font-bold mb-4 ${titleClassName}`}>{title}</h2>
          )}
          {description && (
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto ${descriptionClassName}`}>{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
