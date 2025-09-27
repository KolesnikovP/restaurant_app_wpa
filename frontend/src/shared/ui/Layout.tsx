import { ReactNode } from "react";

type Props = { children: ReactNode };

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 max-w-xl mx-auto">
      {children}
    </div>
  );
}

export default Layout;
