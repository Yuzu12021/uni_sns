type RoleBadgeProps = {
  role: string;
};

import { roleColor } from "../utils/roleColor";

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${roleColor(role)}`}
    >
      {role}
    </span>
  );
}