import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { HeaderBar } from "@/widgets/HeaderBar";

function GuidelinesPage() {
  const [inputQuery, setInputQeury] = useState("");
  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-4">
        <HeaderBar inputQuery={inputQuery} onChangeInput={setInputQeury} />
      </div>
      <div className="fadeIn">
        <div className="text-sm opacity-75">Guidelines: no data source yet.</div>
      </div>
    </Layout>
  );
}

export default GuidelinesPage;
