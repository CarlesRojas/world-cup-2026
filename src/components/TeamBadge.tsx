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
        className={`inline-block rounded-[3px] bg-white/10 ring-1 ring-white/15 ${className}`}
        style={{ width, height: h }}
      />
    );
  }
  return (
    <span
      className={`fi fi-${code} inline-block rounded-[3px] ring-1 ring-black/30 ${className}`}
      title={team ?? undefined}
      style={{ width, height: h, backgroundSize: "cover" }}
    />
  );
}

/**
 * A team's crest (flag) + name.
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
      <Flag team={team} width={size} className="shrink-0 shadow" />
      {!hideName && (
        <span className={`truncate ${nameClassName}`}>{team ?? "—"}</span>
      )}
    </span>
  );
}
