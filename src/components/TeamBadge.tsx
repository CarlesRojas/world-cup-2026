import { flagCode } from "@/data/teams";

/**
 * A rectangular flag crest rendered from the bundled flag-icons SVGs.
 * `width`/`height` in px. Renders a neutral box when the team is unknown/null.
 */
export function Flag({
  team,
  width = 28,
  height,
  className = "",
}: {
  team: string | null;
  width?: number;
  height?: number;
  className?: string;
}) {
  const h = height ?? Math.round((width * 2) / 3);
  const code = team ? flagCode(team) : "";
  if (!code) {
    return (
      <span
        className={`inline-block rounded bg-line ring-1 ring-line ${className}`}
        style={{ width, height: h }}
      />
    );
  }
  return (
    <span
      className={`fi fi-${code} inline-block rounded ring-1 ring-black/5 ${className}`}
      title={team ?? undefined}
      style={{ width, height: h, backgroundSize: "cover" }}
    />
  );
}

/**
 * A team's crest (flag) + name on one line. Used in compact rows.
 */
export default function TeamBadge({
  team,
  size = 28,
  className = "",
  nameClassName = "",
  hideName = false,
}: {
  team: string | null;
  size?: number;
  className?: string;
  nameClassName?: string;
  hideName?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Flag team={team} width={size} className="shrink-0" />
      {!hideName && (
        <span className={`truncate ${nameClassName}`}>{team ?? "—"}</span>
      )}
    </span>
  );
}

/**
 * A vertical team crest: flag on top, name underneath. Used for the two sides
 * of a match (left vs right). `dimmed` greys out a team that lost; `highlight`
 * is the winner.
 */
export function TeamColumn({
  team,
  flagWidth = 64,
  dimmed = false,
}: {
  team: string | null;
  flagWidth?: number;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center gap-2.5 text-center transition ${
        dimmed ? "opacity-35" : ""
      }`}
    >
      <Flag team={team} width={flagWidth} className="shadow-sm" />
      <span className="text-sm font-medium leading-tight text-ink">
        {team ?? "—"}
      </span>
    </div>
  );
}
