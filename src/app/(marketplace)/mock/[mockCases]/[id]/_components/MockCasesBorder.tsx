export default function MockCasesBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="border-[0.5px] border-gray-2 p-6 space-y-8 rounded-[12px] mt-3">
      {children}
    </section>
  );
}

export function MockCasesPurpleBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary-white rounded-[8px] p-4 space-y-2.5 mt-2">
      {children}
    </div>
  );
}
