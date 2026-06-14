import { Suspense } from "react";

import ObituaryListContainer from "../../../Component/public/obituary/ObituaryListContainer";

/**
 * Wrapper for the obituary listing page.
 *
 * @returns {JSX.Element} The obituary list container.
 */
export default function ObituaryListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading obituaries...</div>}>
      <ObituaryListContainer />
    </Suspense>
  );
}
