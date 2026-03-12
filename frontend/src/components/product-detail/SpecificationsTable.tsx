interface Props {
  specifications: string;
}

function formatKey(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
}

export default function SpecificationsTable({ specifications }: Props) {
  let specs: Record<string, string> = {};
  try {
    const parsed = JSON.parse(specifications);
    if (parsed && typeof parsed === 'object') specs = parsed;
  } catch {
    // malformed JSON
  }

  const entries = Object.entries(specs);
  if (!entries.length) {
    return <p className="text-text-muted text-sm">No specifications available.</p>;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      {entries.map(([key, value], i) => (
        <div
          key={key}
          className={`flex items-start gap-0 ${i % 2 === 0 ? 'bg-bg-tertiary' : 'bg-bg-secondary'}`}
        >
          <span className="w-2/5 px-5 py-3.5 text-text-muted text-sm font-medium border-r border-border capitalize">
            {formatKey(key)}
          </span>
          <span className="flex-1 px-5 py-3.5 text-text-primary text-sm">{value}</span>
        </div>
      ))}
    </div>
  );
}
