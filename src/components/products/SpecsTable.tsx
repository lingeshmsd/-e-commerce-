import type { ProductSpecs } from "@/types";

type SpecsTableProps = {
  specs: ProductSpecs;
};

export function SpecsTable({ specs }: SpecsTableProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <tbody>
          {entries.map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
              <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-1/3">
                {key}
              </td>
              <td className="px-4 py-3 text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
