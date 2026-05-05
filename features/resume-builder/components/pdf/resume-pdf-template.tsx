import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer";

// Register Fonts is now handled in pdf-service.tsx to avoid bundling issues

const styles = StyleSheet.create({
  page: {
    padding: 36, // 0.5in
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#000",
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 20,
    textAlign: "left",
  },
  name: {
    fontSize: 20,
    fontWeight: 600,
    fontFamily: "Inter",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9.5,
    color: "#64748b", // Slate-500
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1", // Slate-300
    paddingBottom: 2,
    marginBottom: 8,
    fontFamily: "Inter",
    letterSpacing: 0.1,
  },
  text: {
    fontSize: 9.5,
    textAlign: "left",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  title: {
    fontSize: 10.5,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  companyLine: {
    fontSize: 9.5,
    color: "#64748b", // Slate-500
  },
  dates: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    color: "#64748b", // Slate-500
  },
  bullet: {
    fontSize: 9.5,
    paddingLeft: 10,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  link: {
    color: "#1a56db", // Darker blue
    textDecoration: "none",
  },
  skillLabel: {
    fontSize: 9.5,
    fontWeight: 600,
    fontFamily: "Inter",
  },
});

export const ResumePDFTemplate = ({
  sections,
  resumeInfo,
}: {
  sections: any[];
  resumeInfo: any;
}) => {
  const ensureValidUrl = (url: string | undefined | null) => {
    if (!url) return undefined;
    const trimmed = url.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const personalInfo =
    sections.find((s) => s.section_type === "PERSONAL_INFO")?.content || {};
  const displayName =
    personalInfo.full_name || resumeInfo.title || "Your Name";
  const summary =
    sections.find((s) => s.section_type === "SUMMARY")?.content?.text || "";
  const skills =
    sections.find((s) => s.section_type === "SKILLS")?.content?.manual_skills ||
    [];
  const experience = sections.find(
    (s) => s.section_type === "EXPERIENCE"
  )?.content;
  const experienceEntries = Array.isArray(experience) ? experience : [];
  const projects = sections.find(
    (s) => s.section_type === "PROJECTS"
  )?.content;
  const projectEntries = Array.isArray(projects)
    ? projects.filter((p: any) => p.included !== false)
    : [];
  const education = sections.find(
    (s) => s.section_type === "EDUCATION"
  )?.content;
  const educationEntries = Array.isArray(education) ? education : [];
  const certifications = sections.find(
    (s) => s.section_type === "CERTIFICATIONS"
  )?.content;
  const certEntries = Array.isArray(certifications) ? certifications : [];

  const contactParts = [
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header ───────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {displayName}
          </Text>
          <View style={styles.contact}>
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {personalInfo.phone && (personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <Text>•</Text>}
            
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.location && (personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <Text>•</Text>}

            {personalInfo.linkedin && (
              <Link src={ensureValidUrl(personalInfo.linkedin)} style={styles.link}>LinkedIn</Link>
            )}
            {personalInfo.linkedin && (personalInfo.github || personalInfo.portfolio) && <Text>•</Text>}

            {personalInfo.github && (
              <Link src={ensureValidUrl(personalInfo.github)} style={styles.link}>GitHub</Link>
            )}
            {personalInfo.github && personalInfo.portfolio && <Text>•</Text>}

            {personalInfo.portfolio && (
              <Link src={ensureValidUrl(personalInfo.portfolio)} style={styles.link}>Portfolio</Link>
            )}
          </View>
        </View>

        {/* ── Summary ──────────────────────────── */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.text}>{summary}</Text>
          </View>
        ) : null}

        {/* ── Skills ───────────────────────────── */}
        {skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((item: any, i: number) => (
              <View key={i} style={{ marginBottom: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                {typeof item === "string" ? (
                  <Text style={styles.text}>{item}</Text>
                ) : (
                  <>
                    <Text style={styles.skillLabel}>{item.name}</Text>
                    <Text style={styles.text}> — {Array.isArray(item.skills) ? item.skills.join(", ") : ""}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Experience ───────────────────────── */}
        {experienceEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experienceEntries.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.title}>
                    {exp.title}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.dates}>
                    {exp.start}
                    {(exp.end || exp.current) &&
                      ` – ${exp.current ? "Present" : exp.end}`}
                  </Text>
                </View>
                {exp.location ? (
                  <Text style={{ ...styles.companyLine, marginBottom: 2 }}>{exp.location}</Text>
                ) : null}
                {exp.bullets
                  ?.filter(Boolean)
                  .map((b: string, bIdx: number) => (
                    <Text key={bIdx} style={styles.bullet}>
                      • {b}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Projects ─────────────────────────── */}
        {projectEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projectEntries.map((proj: any, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                    {proj.demo || proj.demo_override ? (
                      <Link
                        src={ensureValidUrl(proj.demo || proj.demo_override)}
                        style={{ ...styles.title, ...styles.link }}
                      >
                        {proj.title || "Untitled Project"}
                      </Link>
                    ) : (
                      <Text style={styles.title}>
                        {proj.title || "Untitled Project"}
                      </Text>
                    )}
                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <Text style={styles.dates}>
                        {" | "}
                        {proj.technologies.join(", ")}
                      </Text>
                    )}
                  </View>
                </View>

                {(proj.github || proj.github_override) && (
                  <Link
                    src={ensureValidUrl(proj.github || proj.github_override)}
                    style={{ ...styles.companyLine, ...styles.link, marginTop: 1, fontSize: 9 }}
                  >
                    GitHub Codebase
                  </Link>
                )}

                {proj.description || proj.description_override ? (
                  <Text style={{ ...styles.text, marginTop: 2 }}>{proj.description || proj.description_override}</Text>
                ) : null}

                {proj.bullets
                  ?.filter(Boolean)
                  .map((b: string, bIdx: number) => (
                    <Text key={bIdx} style={{ ...styles.bullet, marginTop: 1 }}>
                      • {b}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Education ────────────────────────── */}
        {educationEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educationEntries.map((edu: any, i: number) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.title}>
                    {edu.degree}
                    {edu.institution ? ` — ${edu.institution}` : ""}
                    {edu.field ? `, ${edu.field}` : ""}
                  </Text>
                  {edu.year ? (
                    <Text style={styles.dates}>
                      {edu.in_progress ? `Expected ${edu.year}` : edu.year}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Certifications ──────────────────── */}
        {certEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certEntries.map((cert: any, i: number) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                   <Text style={styles.text}>
                    <Text style={styles.title}>{cert.name}</Text>
                    {cert.issuer ? ` — ${cert.issuer}` : ""}
                  </Text>
                  {cert.year ? (
                    <Text style={styles.dates}>{cert.year}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
