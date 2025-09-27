import { ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: Props) {
  const [mounted, setMounted] = useState(false);
  const target = useMemo(() => container ?? (typeof document !== 'undefined' ? document.body : null), [container]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !target) return null;
  return createPortal(children, target);
}

export default Portal;

