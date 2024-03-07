import React from 'react';

interface ExitAppProps {
  code?: number;
  children?: React.ReactNode;
}

export function ExitApp({ children, code }: ExitAppProps) {
  React.useEffect(() => {
    process.exit(code ?? 0);
  });

  return children;
}
