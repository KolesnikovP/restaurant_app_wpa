import { ReactNode } from "react";

type Props = { children: ReactNode };

function Layout({ children }: Props) {
  return (
    <div className="min-h-[100svh] bg-[#1a1a1a] text-white p-6 max-w-xl mx-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {children}
    </div>
  );
}

export default Layout;
