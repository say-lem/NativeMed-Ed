import { use } from "react";

export default function ViewMockCases({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div>
      <h1>View Mock Cases</h1>
      <p>Case ID: {id}</p>
    </div>
  );
}
