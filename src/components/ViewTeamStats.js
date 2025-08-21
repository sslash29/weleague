"use client";

function ViewTeamStats({ titleName, items = [] }) {
  return (
    <div>
      {titleName && <h3 className="text-3xl">{titleName}</h3>}
      <div className="translate-x-2">
        {items.map(({ label, value }, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between w-[240px]"
          >
            <span>{label}</span>
            <span className="inline-block w-16 text-center">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewTeamStats;
