
import fs from 'fs';
import path from 'path';
import { RoadmapParser } from './features/roadmap/services/roadmap-parser';

function generateSql() {
    const roadmapsDir = path.join(process.cwd(), 'docs/mallah-roadmap-and-topic-viewer');
    const files = [
        'frontend-roadmap.md',
        'fullstack-roadmap.md',
        'cybersecurity-roadmap.md',
        'datascience-roadmap.md'
    ];

    let sql = `-- Mallah Curriculum Seed Data\n`;

    for (const file of files) {
        const filePath = path.join(roadmapsDir, file);
        if (!fs.existsSync(filePath)) continue;

        const content = fs.readFileSync(filePath, 'utf-8');
        const { pathId, stages } = RoadmapParser.parseMarkdown(content);

        for (const stage of stages) {
            const stageVar = `stage_${pathId}_${stage.orderIndex}`;
            sql += `-- Stage: ${stage.title}\n`;
            sql += `DO $$\n`;
            sql += `DECLARE\n  ${stageVar}_id uuid;\n`;
            sql += `BEGIN\n`;
            sql += `  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)\n`;
            sql += `  VALUES ('${pathId}', '${stage.title.replace(/'/g, "''")}', ${stage.orderIndex}, 'beginner')\n`;
            sql += `  RETURNING stage_id INTO ${stageVar}_id;\n\n`;

            for (const topic of stage.topics) {
                let tType = "lesson";
                const lowType = topic.type.toLowerCase();
                if (lowType.includes("capstone")) tType = "project_capstone";
                else if (lowType.includes("project")) tType = "project_milestone";
                else if (lowType.includes("concept")) tType = "concept";
                else if (lowType.includes("lab")) tType = "lesson_lab";

                const topicVar = `topic_${pathId}_${stage.orderIndex}_${topic.orderIndex.toString().replace(/\./g, '_')}`;

                const sanitizedDiff = topic.difficulty.toLowerCase().includes('advanced') ? 'advanced' : topic.difficulty.toLowerCase().includes('intermediate') ? 'intermediate' : 'beginner';

                sql += `  DECLARE\n    ${topicVar}_id uuid;\n`;
                sql += `  BEGIN\n`;
                sql += `    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, estimated_time_text, difficulty_level, order_index)\n`;
                sql += `    VALUES (${stageVar}_id, '${topic.title.replace(/'/g, "''")}', '${topic.description.replace(/'/g, "''")}', '${tType}', ${topic.estimatedTime}, '${topic.estimatedTimeText.replace(/'/g, "''")}', '${sanitizedDiff}', ${topic.orderIndex})\n`;
                sql += `    RETURNING topic_id INTO ${topicVar}_id;\n\n`;

                // Resources
                topic.resources.forEach((res, resIdx) => {
                    sql += `    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)\n`;
                    sql += `    VALUES (${topicVar}_id, '${res.type}', '${res.title.replace(/'/g, "''")}', ${res.url ? `'${res.url.replace(/'/g, "''")}'` : 'NULL'}, ${res.content ? `'${res.content.replace(/'/g, "''")}'` : 'NULL'}, ${resIdx + 1});\n`;
                });

                // Skills and Projects
                for (const skill of topic.skills) {
                    sql += `    INSERT INTO public.skills (skill_id, name, category) VALUES ('${skill.id}', '${skill.name.replace(/'/g, "''")}', '${skill.category.replace(/'/g, "''")}') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;\n`;
                    sql += `    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (${topicVar}_id, '${skill.id}') ON CONFLICT DO NOTHING;\n`;
                }

                if (tType === "project_milestone" || tType === "project_capstone") {
                    sql += `    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (${stageVar}_id, '${topic.title.replace(/'/g, "''")}', '${(topic.practicalOutput || topic.description).replace(/'/g, "''")}', '${sanitizedDiff}') ON CONFLICT DO NOTHING;\n`;
                }

                sql += `  END;\n`;
            }
            sql += `END $$;\n\n`;
        }
    }

    fs.writeFileSync('seed.sql', sql);
    console.log("SQL Seed generated: seed.sql");
}

generateSql();
