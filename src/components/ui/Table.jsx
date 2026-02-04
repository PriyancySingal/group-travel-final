export default function Table({ columns, data }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/10 text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left p-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-t border-white/10 hover:bg-white/5"
            >
              {Object.values(row).map((cell, idx) => (
                <td key={idx} className="p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
