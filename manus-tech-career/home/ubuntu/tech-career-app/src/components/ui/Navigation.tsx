'use client';

import React from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  variant?: 'underline' | 'pills' | 'enclosed';
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'underline',
  onChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = React.useState<string>(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const getTabStyles = (tabId: string) => {
    const isActive = activeTab === tabId;

    switch (variant) {
      case 'underline':
        return isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent';
      case 'pills':
        return isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30';
      case 'enclosed':
        return isActive
          ? 'bg-background border-border border-b-transparent'
          : 'bg-muted/30 border-transparent text-muted-foreground hover:text-foreground';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <div className={`flex ${variant === 'enclosed' ? 'border-b border-border' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${getTabStyles(tab.id)} ${
              variant === 'pills' ? 'rounded-md m-1' : ''
            } ${variant === 'enclosed' ? 'border-t border-l border-r rounded-t-lg -mb-px' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  isOpen = false,
  onToggle,
  className = '',
}) => {
  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
    }
  };

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-muted/30 transition-colors"
      >
        <div className="font-medium">{title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border bg-card">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  items: {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
  }[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = [],
  allowMultiple = false,
  className = '',
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen);

  const handleToggle = (id: string) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter((itemId) => itemId !== id));
    } else {
      if (allowMultiple) {
        setOpenItems([...openItems, id]);
      } else {
        setOpenItems([id]);
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openItems.includes(item.id)}
          onToggle={handleToggle}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
