"""
Generate a simplified research paper PDF with pseudocode algorithms 
and database schema (without full implementation code)
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
import os

# Create PDF
pdf_path = os.path.join(os.path.dirname(__file__), "Resume_AI_Algorithms_and_Schema.pdf")
doc = SimpleDocTemplate(pdf_path, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)

story = []
styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=22,
    textColor=colors.HexColor('#1a5490'),
    spaceAfter=6,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=13,
    textColor=colors.HexColor('#2E5266'),
    spaceAfter=8,
    spaceBefore=8,
    fontName='Helvetica-Bold'
)

subheading_style = ParagraphStyle(
    'CustomSubHeading',
    parent=styles['Heading3'],
    fontSize=11,
    textColor=colors.HexColor('#4A4A4A'),
    spaceAfter=6,
    spaceBefore=6,
    fontName='Helvetica-Bold'
)

normal_style = ParagraphStyle(
    'CustomNormal',
    parent=styles['BodyText'],
    fontSize=10,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
    leading=12,
    fontName='Helvetica'
)

pseudo_style = ParagraphStyle(
    'Pseudo',
    parent=styles['BodyText'],
    fontSize=9,
    spaceAfter=4,
    fontName='Courier',
    leftIndent=20,
    rightIndent=20,
    backColor=colors.HexColor('#f0f0f0'),
    borderPadding=5
)

# ========== TITLE PAGE ==========
story.append(Spacer(1, 0.7*inch))
story.append(Paragraph("RESUME AI ANALYSIS SYSTEM", title_style))
story.append(Paragraph("Algorithms & Database Schema", 
    ParagraphStyle('Subtitle', parent=styles['Heading2'], fontSize=12, alignment=TA_CENTER, textColor=colors.grey)))
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", normal_style))
story.append(Paragraph("<b>Project Type:</b> Final Year Academic Research", normal_style))
story.append(Spacer(1, 0.5*inch))

# ========== ALGORITHM 1: SEMANTIC SIMILARITY ==========
story.append(PageBreak())
story.append(Paragraph("1. SEMANTIC SIMILARITY ALGORITHM", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Model:</b> SentenceTransformer (all-MiniLM-L6-v2)", normal_style))
story.append(Paragraph("<b>Output:</b> Similarity Score (0-100%)", normal_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Pseudocode:</b>", subheading_style))
pseudo1 = """
ALGORITHM SemanticSimilarity(resume_text, job_description)<br/>
&nbsp;&nbsp;INPUT: resume_text, job_description<br/>
&nbsp;&nbsp;OUTPUT: similarity_score (0-100)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;1. Load pre-trained SentenceTransformer model<br/>
&nbsp;&nbsp;2. resume_embedding ← encode(resume_text)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Returns 384-dimensional dense vector<br/>
&nbsp;&nbsp;3. jd_embedding ← encode(job_description)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Returns 384-dimensional dense vector<br/>
&nbsp;&nbsp;4. similarity ← cosine_similarity(resume_embedding, jd_embedding)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Formula: (A·B) / (||A|| × ||B||)<br/>
&nbsp;&nbsp;5. score ← similarity × 100<br/>
&nbsp;&nbsp;6. RETURN round(score, 2)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;TIME COMPLEXITY: O(n) where n = text length<br/>
&nbsp;&nbsp;SPACE COMPLEXITY: O(d) where d = 384 (embedding dimension)<br/>
&nbsp;&nbsp;LATENCY: ~50-100ms
"""
story.append(Paragraph(pseudo1, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Mathematical Formula:</b>", subheading_style))
story.append(Paragraph("cos(θ) = (A · B) / (||A|| × ||B||)", 
    ParagraphStyle('Math', parent=styles['BodyText'], fontSize=11, leftIndent=40, fontName='Courier')))

story.append(Spacer(1, 0.08*inch))
story.append(Paragraph("""
<b>Where:</b><br/>
• A, B = 384-dimensional embedding vectors<br/>
• · = Dot product<br/>
• || || = L2 norm (Euclidean length)<br/>
• Output: [-1, 1] scaled to [0%, 100%]
""", normal_style))

# ========== ALGORITHM 2: DOMAIN CLASSIFICATION ==========
story.append(PageBreak())
story.append(Paragraph("2. DOMAIN CLASSIFICATION ALGORITHM", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Models:</b> TF-IDF Vectorizer + Logistic Regression (Multi-class)", normal_style))
story.append(Paragraph("<b>Output:</b> Domain + Probability Distribution", normal_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Stage 1: TF-IDF Feature Extraction</b>", subheading_style))
pseudo2a = """
ALGORITHM TFIDFVectorization(resume_text, vocabulary)<br/>
&nbsp;&nbsp;INPUT: resume_text, pre-built vocabulary (6000 terms)<br/>
&nbsp;&nbsp;OUTPUT: feature_vector (6000 dimensions)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;FOR EACH term IN vocabulary DO<br/>
&nbsp;&nbsp;&nbsp;&nbsp;tf ← frequency of term in resume_text<br/>
&nbsp;&nbsp;&nbsp;&nbsp;idf ← log(total_documents / documents_containing_term)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;tfidf_score[term] ← tf × idf<br/>
&nbsp;&nbsp;END FOR<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;RETURN normalize(tfidf_score)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// L2 normalization<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;TIME COMPLEXITY: O(n + m) where n = text length, m = vocabulary<br/>
&nbsp;&nbsp;SPACE COMPLEXITY: O(m) where m = 6000
"""
story.append(Paragraph(pseudo2a, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>TF-IDF Formula:</b>", subheading_style))
story.append(Paragraph("TF-IDF(t,d) = TF(t,d) × log(N / DF(t))", 
    ParagraphStyle('Math', parent=styles['BodyText'], fontSize=11, leftIndent=40, fontName='Courier')))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Stage 2: Logistic Regression Classification</b>", subheading_style))

pseudo2b = """
ALGORITHM DomainClassification(feature_vector)<br/>
&nbsp;&nbsp;INPUT: feature_vector (6000 dimensions)<br/>
&nbsp;&nbsp;OUTPUT: domain, probability_distribution<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;1. Load trained LogisticRegression model (multi-class)<br/>
&nbsp;&nbsp;2. probabilities ← model.predict_proba(feature_vector)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Returns probabilities for each domain class<br/>
&nbsp;&nbsp;3. domain_scores ← {}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOR EACH class IN model.classes_ DO<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;domain_scores[class] ← probabilities[class] × 100<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;END FOR<br/>
&nbsp;&nbsp;4. best_domain ← argmax(domain_scores)<br/>
&nbsp;&nbsp;5. confidence ← domain_scores[best_domain] / 100<br/>
&nbsp;&nbsp;6. RETURN (best_domain, confidence, domain_scores)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;TIME COMPLEXITY: O(m) where m = number of classes<br/>
&nbsp;&nbsp;LATENCY: ~10-20ms
"""
story.append(Paragraph(pseudo2b, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Logistic Regression Formula (Multi-class):</b>", subheading_style))
story.append(Paragraph("P(Y=c|X) = exp(w_c·X + b_c) / Σ exp(w_j·X + b_j) for all j", 
    ParagraphStyle('Math', parent=styles['BodyText'], fontSize=9, leftIndent=40, fontName='Courier')))

# ========== ALGORITHM 3: SKILL MATCHING ==========
story.append(PageBreak())
story.append(Paragraph("3. SKILL MATCHING ALGORITHM", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Approach:</b> Pattern Matching + Jaccard Similarity", normal_style))
story.append(Paragraph("<b>Output:</b> Skill Score, Matched Skills, Missing Skills", normal_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Pseudocode:</b>", subheading_style))

pseudo3 = """
ALGORITHM SkillMatching(resume_text, job_description)<br/>
&nbsp;&nbsp;INPUT: resume_text, job_description<br/>
&nbsp;&nbsp;OUTPUT: skill_score (0-100), matched_skills[], missing_skills[]<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;1. Load skill_taxonomy (all recognized skills + aliases)<br/>
&nbsp;&nbsp;2. resume_skills ← ExtractSkills(resume_text)<br/>
&nbsp;&nbsp;3. job_skills ← ExtractSkills(job_description)<br/>
&nbsp;&nbsp;4. matched ← SetIntersection(resume_skills, job_skills)<br/>
&nbsp;&nbsp;5. missing ← SetDifference(job_skills, resume_skills)<br/>
&nbsp;&nbsp;6. score ← (|matched| / |job_skills|) × 100<br/>
&nbsp;&nbsp;7. RETURN (score, matched, missing)<br/>
&nbsp;&nbsp;<br/>
---<br/>
FUNCTION ExtractSkills(text)<br/>
&nbsp;&nbsp;OUTPUT: skill_set[]<br/>
&nbsp;&nbsp;skills ← {}<br/>
&nbsp;&nbsp;FOR EACH alias IN skill_taxonomy.aliases DO<br/>
&nbsp;&nbsp;&nbsp;&nbsp;pattern ← "\\b" + alias + "\\b" // Word boundary<br/>
&nbsp;&nbsp;&nbsp;&nbsp;IF regex_search(pattern, text, case_insensitive) THEN<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;canonical_name ← skill_taxonomy[alias].canonical<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skills.add(canonical_name)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;END IF<br/>
&nbsp;&nbsp;END FOR<br/>
&nbsp;&nbsp;RETURN sorted(skills)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;TIME COMPLEXITY: O(n × m) where n = text length, m = vocabulary<br/>
&nbsp;&nbsp;LATENCY: ~5-10ms
"""
story.append(Paragraph(pseudo3, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Jaccard Similarity Formula:</b>", subheading_style))
story.append(Paragraph("Score = |Resume_Skills ∩ Job_Skills| / |Job_Skills| × 100", 
    ParagraphStyle('Math', parent=styles['BodyText'], fontSize=11, leftIndent=40, fontName='Courier')))

# ========== ALGORITHM 4: FINAL SCORING ==========
story.append(PageBreak())
story.append(Paragraph("4. FINAL SCORING ALGORITHM", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Approach:</b> Weighted Aggregation of Component Scores", normal_style))
story.append(Paragraph("<b>Output:</b> Final Score (0-100%)", normal_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Pseudocode:</b>", subheading_style))

pseudo4 = """
ALGORITHM ComputeFinalScore(resume_text, job_description, profile_score)<br/>
&nbsp;&nbsp;INPUT: resume_text, job_description, profile_score<br/>
&nbsp;&nbsp;OUTPUT: final_score (0-100)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;1. semantic_score ← SemanticSimilarity(resume_text, job_description)<br/>
&nbsp;&nbsp;2. skill_score, matched, missing ← SkillMatching(resume_text, job_description)<br/>
&nbsp;&nbsp;3. domain_score ← DomainClassification(resume_text)<br/>
&nbsp;&nbsp;4. profile_score ← provided_input<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;5. weights ← {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;semantic: 0.40,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skill: 0.35,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;domain: 0.15,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;profile: 0.10<br/>
&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;6. final ← (semantic_score × 0.40) +<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(skill_score × 0.35) +<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(domain_score × 0.15) +<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(profile_score × 0.10)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;7. RETURN (final_score, semantic_score, skill_score,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;domain_score, matched, missing)<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;TIME COMPLEXITY: O(n + m)<br/>
&nbsp;&nbsp;TOTAL LATENCY: ~300-500ms (dominated by semantic encoding)
"""
story.append(Paragraph(pseudo4, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Weighted Aggregation Formula:</b>", subheading_style))
story.append(Paragraph("Final = (0.40×S) + (0.35×K) + (0.15×D) + (0.10×P)", 
    ParagraphStyle('Math', parent=styles['BodyText'], fontSize=11, leftIndent=40, fontName='Courier')))

story.append(Spacer(1, 0.08*inch))
story.append(Paragraph("""
<b>Where:</b><br/>
• S = Semantic Similarity Score<br/>
• K = Skill Overlap Score<br/>
• D = Domain Match Score<br/>
• P = Profile Completeness Score
""", normal_style))

# ========== DATABASE SCHEMA ==========
story.append(PageBreak())
story.append(Paragraph("5. DATABASE SCHEMA", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Database System:</b> MongoDB (NoSQL)", normal_style))
story.append(Paragraph("<b>Database Name:</b> resume_platform", normal_style))
story.append(Paragraph("<b>Collection Name:</b> resume_analysis", normal_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("<b>Document Structure:</b>", subheading_style))

schema_fields = [
    ["Field Name", "Type", "Description"],
    ["_id", "ObjectId", "Unique MongoDB identifier"],
    ["user_id", "String", "User identifier"],
    ["resume_domain", "String", "Predicted domain (Backend/Frontend/etc)"],
    ["resume_domain_confidence", "Number", "Domain confidence 0-100"],
    ["jd_domain", "String", "Job description domain"],
    ["jd_domain_confidence", "Number", "JD domain confidence 0-100"],
    ["resume_domain_scores", "Object", "All domain probabilities"],
    ["jd_domain_scores", "Object", "All JD domain probabilities"],
    ["domain_match", "Boolean", "Does resume match JD domain?"],
    ["semantic_score", "Number", "NLP similarity 0-100"],
    ["skill_score", "Number", "Skill overlap 0-100"],
    ["final_score", "Number", "Weighted total 0-100"],
    ["matched_skills", "Array", "Skills in both resume & JD"],
    ["missing_skills", "Array", "Required skills not in resume"],
    ["suggestions", "Array", "Improvement recommendations"]
]

schema_table = Table(schema_fields, colWidths=[1.6*inch, 1.1*inch, 2.8*inch])
schema_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E5266')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ('FONTSIZE', (0, 1), (-1, -1), 8),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
story.append(schema_table)

story.append(Spacer(1, 0.15*inch))
story.append(Paragraph("<b>Example Document:</b>", subheading_style))

example = """
{<br/>
&nbsp;&nbsp;"_id": ObjectId(...),<br/>
&nbsp;&nbsp;"user_id": "user_123",<br/>
&nbsp;&nbsp;"resume_domain": "Backend",<br/>
&nbsp;&nbsp;"resume_domain_confidence": 87.45,<br/>
&nbsp;&nbsp;"jd_domain": "Backend",<br/>
&nbsp;&nbsp;"semantic_score": 82.34,<br/>
&nbsp;&nbsp;"skill_score": 75.00,<br/>
&nbsp;&nbsp;"final_score": 81.68,<br/>
&nbsp;&nbsp;"matched_skills": ["Python", "SQL", "Flask", "Docker"],<br/>
&nbsp;&nbsp;"missing_skills": ["Kubernetes", "Go"],<br/>
&nbsp;&nbsp;"suggestions": ["Learn Kubernetes...", "Strengthen DevOps..."]<br/>
}
"""
story.append(Paragraph(example, pseudo_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>Key Indexes:</b>", subheading_style))
indexes = """
• Index on "user_id" - Fast user-scoped queries<br/>
• Index on "final_score" - Efficient ranking and sorting<br/>
• Compound index on (user_id, final_score) - Top-N queries<br/>
• Index on "resume_domain" - Domain-based filtering
"""
story.append(Paragraph(indexes, normal_style))

# ========== SUMMARY TABLE ==========
story.append(PageBreak())
story.append(Paragraph("6. ALGORITHM SUMMARY", heading_style))
story.append(Spacer(1, 0.1*inch))

summary_data = [
    ["Algorithm", "Model", "Input", "Output", "Time", "Weight"],
    ["Semantic", "SentenceTransformer", "Text", "Score (0-100)", "50-100ms", "40%"],
    ["Domain", "TF-IDF + LogReg", "Text", "Domain + Prob", "10-20ms", "15%"],
    ["Skill", "Regex + Set Match", "Text", "Score (0-100)", "5-10ms", "35%"],
    ["Profile", "User Input", "Value", "Score (0-100)", "1ms", "10%"]
]

summary_table = Table(summary_data, colWidths=[1.1*inch, 1.2*inch, 1.0*inch, 1.2*inch, 1.0*inch, 0.8*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E5266')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 8.5),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ('FONTSIZE', (0, 1), (-1, -1), 8),
]))
story.append(summary_table)

story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("<b>Total System Latency:</b> 300-500ms per analysis", 
    ParagraphStyle('Bold', parent=styles['BodyText'], fontSize=10, fontName='Helvetica-Bold')))

story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("<b>Technology Stack:</b>", subheading_style))
stack = """
• Language: Python 3.8+<br/>
• Semantic Model: SentenceTransformer (HuggingFace)<br/>
• ML Libraries: scikit-learn<br/>
• Text Processing: NLTK, regex<br/>
• Database: MongoDB Atlas<br/>
• API Framework: FastAPI
"""
story.append(Paragraph(stack, normal_style))

# ========== BUILD PDF ==========
doc.build(story)
print(f"✓ PDF generated: {pdf_path}")
print(f"✓ File size: {os.path.getsize(pdf_path) / 1024:.1f} KB")
