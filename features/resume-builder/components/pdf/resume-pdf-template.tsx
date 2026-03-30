import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#000",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: "#555",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 2,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  text: {
    fontSize: 10,
    textAlign: "justify",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  small: {
    fontSize: 9,
    color: "#555",
  },
  bullet: {
    fontSize: 9,
    paddingLeft: 10,
    marginBottom: 1,
  },
  skillsText: {
    fontSize: 10,
  },
});

export const ResumePDFTemplate = ({
  sections,
  resumeInfo,
}: {
  sections: any[];
  resumeInfo: any;
}) => {
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
          {contactParts.length > 0 && (
            <Text style={styles.contact}>
              {contactParts.join(" • ")}
            </Text>
          )}
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
            <Text style={styles.skillsText}>
              {skills
                .map((item: any) =>
                  typeof item === "string"
                    ? item
                    : `${item.name}: ${item.skills.join(", ")}`
                )
                .join(" • ")}
            </Text>
          </View>
        ) : null}

        {/* ── Experience ───────────────────────── */}
        {experienceEntries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experienceEntries.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>
                    {exp.title}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.small}>
                    {exp.start}
                    {(exp.end || exp.current) &&
                      ` – ${exp.current ? "Present" : exp.end}`}
                  </Text>
                </View>
                {exp.location ? (
                  <Text style={styles.small}>{exp.location}</Text>
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
              <View key={i} style={{ marginBottom: 6 }}>
                {proj.description_override ? (
                  <Text style={styles.text}>{proj.description_override}</Text>
                ) : null}
                {(proj.github_override || proj.demo_override) && (
                  <Text style={styles.small}>
                    {[proj.github_override, proj.demo_override]
                      .filter(Boolean)
                      .join(" | ")}
                  </Text>
                )}
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
                <Text style={styles.bold}>
                  {edu.degree}
                  {edu.institution ? ` — ${edu.institution}` : ""}
                  {edu.field ? `, ${edu.field}` : ""}
                </Text>
                {edu.year ? (
                  <Text style={styles.small}>
                    {edu.in_progress ? `Expected ${edu.year}` : edu.year}
                  </Text>
                ) : null}
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
                <Text style={styles.text}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                  {cert.year ? ` (${cert.year})` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Empty state ──────────────────────── */}
        {sections.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.text}>
              This resume is currently empty. Edit it in Mallah to populate
              sections.
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
