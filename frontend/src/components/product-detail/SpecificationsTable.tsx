interface Props {
  specifications: string;
}

export default function SpecificationsTable({ specifications }: Props) {
  let specs: Record<string, string> = {};
  try {
    const parsed = JSON.parse(specifications);
    if (parsed && typeof parsed === 'object') specs = parsed;
  } catch {
    // malformed JSON, show nothing
  }

  const entries = Object.entries(specs);
  if (!entries.length) {
    return <p className="text-text-muted text-sm">No specifications available.</p>;
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {entries.map(([key, value], i) => (
        <div
          key={key}
          className={`flex ${i % 2 === 0 ? 'bg-bg-tertiary' : 'bg-bg-secondary'}`}
        >
          <span className="w-1/3 px-4 py-3 text-text-muted text-sm font-medium border-r border-border">{key}</span>
          <span className="flex-1 px-4 py-3 text-text-primary text-sm">{value}</span>
        </div>
      ))}
    </div>
  );
}
