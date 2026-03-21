import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Standard styling focused on ATS readability (no crazy tables/columns, standard fonts)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactContent: {
    fontSize: 9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  text: {
    fontSize: 10,
    textAlign: 'justify',
  }
});

export const ResumePDFTemplate = ({ sections, resumeInfo }: { sections: any[], resumeInfo: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resumeInfo.title || "Navigator Name"}</Text>
        <View style={styles.contactContent}>
            <Text>navigator@mallah.com • Riyadh, SA • github.com/mallah</Text>
        </View>
      </View>
      
      {sections.map((sec, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.section_type}</Text>
            <Text style={styles.text}>{sec.content?.text || "..."}</Text>
          </View>
      ))}

      {sections.length === 0 && (
          <View style={styles.section}>
             <Text style={styles.text}>This resume is currently empty. Edit it in Mallah to populate sections.</Text>
          </View>
      )}
    </Page>
  </Document>
);
