"use client";

import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  Wrench,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type SectionType =
  | "PERSONAL_INFO"
  | "SUMMARY"
  | "SKILLS"
  | "PROJECTS"
  | "EXPERIENCE"
  | "EDUCATION"
  | "CERTIFICATIONS";

export type CompletionStatus = "green" | "amber" | "grey";

export interface SectionNavItem {
  type: SectionType;
  label: string;
  icon: React.ReactNode;
  status: CompletionStatus;
  /** Show "→ Fill this" indicator during wizard mode */
  wizardIndicator?: boolean;
}

interface Props {
  sections: SectionNavItem[];
  activeSection: SectionType;
  onSectionChange: (type: SectionType) => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  PERSONAL_INFO: <User className="w-4 h-4" />,
  SUMMARY: <FileText className="w-4 h-4" />,
  SKILLS: <Wrench className="w-4 h-4" />,
  PROJECTS: <FolderKanban className="w-4 h-4" />,
  EXPERIENCE: <Briefcase className="w-4 h-4" />,
  EDUCATION: <GraduationCap className="w-4 h-4" />,
  CERTIFICATIONS: <Award className="w-4 h-4" />,
};

function StatusDot({ status }: { status: CompletionStatus }) {
  return (
    <span
      className={cn(
        "w-2 h-2 rounded-full shrink-0",
        status === "green" && "bg-green-500",
        status === "amber" && "bg-amber-500",
        status === "grey" && "bg-muted-foreground/30"
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SectionNav({
  sections,
  activeSection,
  onSectionChange,
}: Props) {
  return (
    <nav className="w-[220px] border-r bg-background flex flex-col overflow-y-auto shrink-0">
      <ul className="py-2 space-y-0.5">
        {sections.map((item) => {
          const isActive = item.type === activeSection;
          return (
            <li key={item.type}>
              <button
                type="button"
                onClick={() => onSectionChange(item.type)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                  "hover:bg-muted/50",
                  isActive &&
                    "bg-primary/5 border-l-2 border-primary text-primary",
                  !isActive && "border-l-2 border-transparent text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate flex-1">{item.label}</span>
                <StatusDot status={item.status} />
                {item.wizardIndicator && (
                  <span className="text-xs text-primary font-normal">→</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Builder helper — used by parent to construct the nav items                */
/* -------------------------------------------------------------------------- */

export function buildSectionNavItems(
  sections: { section_type: string; content: any; is_visible?: boolean }[],
  t: (key: string) => string
): SectionNavItem[] {
  function getContent(type: string) {
    return sections.find((s) => s.section_type === type)?.content;
  }

  function getStatus(type: string): CompletionStatus {
    const c = getContent(type);
    switch (type) {
      case "PERSONAL_INFO":
        return "green"; // always auto-filled
      case "SUMMARY": {
        const text = c?.text || "";
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (words >= 20) return "green";
        if (words >= 1) return "amber";
        return "grey";
      }
      case "SKILLS": {
        const ids = c?.included_skill_ids || [];
        const manual = c?.manual_skills || [];
        if (ids.length > 0 || manual.length > 0) return "green";
        return "grey";
      }
      case "PROJECTS": {
        const projects = Array.isArray(c) ? c : [];
        const included = projects.filter((p: any) => p.included);
        if (included.length > 0) return "green";
        if (projects.length > 0) return "amber";
        return "grey";
      }
      case "EXPERIENCE": {
        const entries = Array.isArray(c) ? c : [];
        if (entries.length === 0) return "grey";
        const hasBullets = entries.some(
          (e: any) => e.bullets?.filter(Boolean).length > 0
        );
        return hasBullets ? "green" : "amber";
      }
      case "EDUCATION": {
        const entries = Array.isArray(c) ? c : [];
        if (entries.length === 0) return "grey";
        const isComplete = entries.some(
          (e: any) => e.degree && e.institution
        );
        return isComplete ? "green" : "amber";
      }
      case "CERTIFICATIONS": {
        const entries = Array.isArray(c) ? c : [];
        if (entries.length > 0) return "green";
        return "grey";
      }
      default:
        return "grey";
    }
  }

  const items: { type: SectionType; labelKey: string }[] = [
    { type: "PERSONAL_INFO", labelKey: "PersonalInfo" },
    { type: "SUMMARY", labelKey: "Summary" },
    { type: "SKILLS", labelKey: "Skills" },
    { type: "PROJECTS", labelKey: "Projects" },
    { type: "EXPERIENCE", labelKey: "Experience" },
    { type: "EDUCATION", labelKey: "Education" },
    { type: "CERTIFICATIONS", labelKey: "Certifications" },
  ];

  return items.map((item) => ({
    type: item.type,
    label: t(item.labelKey),
    icon: SECTION_ICONS[item.type],
    status: getStatus(item.type),
  }));
}
