import { professionalData } from '../../src/data/professionalData.js';
import { certificatesData } from '../../src/data/certificatesData.js';
import { calculateDuration } from './promptBuilder.js';
import { getScopeRefusalMessage } from './securityGuard.js';

/**
 * Deterministic bilingual fallback engine.
 * Activates automatically if Gemini returns 402 (credits depleted), 429 (quota),
 * or if GEMINI_API_KEY is not configured — ensuring recruiters NEVER hit a broken chat.
 * Strictly enforces the same scope policy (work experience & past/current academic background).
 */
export function buildFallbackResponse(cleanMessage, lang = 'es', liveContext = {}) {
  const q = cleanMessage.toLowerCase();
  const isEs = lang === 'es';
  const exchangeRate = liveContext.exchangeRate || 1200;
  const salaryARS =
    liveContext.salaryARS ||
    Math.round(professionalData.salaryExpectations.argentina.amount * exchangeRate);
  const repoCount = liveContext.githubData?.count || 20;

  // 1. Academic background (past & current) + Certificates
  if (
    /\b(estudio|estudios|estudia|estudiando|carrera|universidad|utn|kennedy|\buk\b|tecnicatura|academic|académic|education|educaci|degree|study|studying|certificad|certificate|curso|cursos|bootcamp|taller|coderhouse|nucba|cac|formaci[oó]n)\b/i.test(
      q
    )
  ) {
    const currentEdu = professionalData.education.find((e) => e.status === 'in_progress');
    const pastEdu = professionalData.education.find((e) => e.status === 'completed');
    const certList = certificatesData
      .map((c) => `• **${c.title[lang]}** — ${c.issuer} (${c.dateLabel[lang]})`)
      .join('\n');

    if (isEs) {
      return `**Formación académica de Carlos Jesús (actual y pasada):**

• **En curso:** ${currentEdu.degree.es} — **${currentEdu.institution}** (${currentEdu.period.es}).
• **Graduado:** ${pastEdu.degree.es} — **${pastEdu.institution}** (${pastEdu.period.es}).

**Certificaciones y Bootcamps destacados** (podés verlos en la pestaña **/certificates**):
${certList}`;
    }

    return `**Carlos Jesús's Academic Background (Current & Past):**

• **In Progress:** ${currentEdu.degree.en} — **${currentEdu.institution}** (${currentEdu.period.en}).
• **Graduate:** ${pastEdu.degree.en} — **${pastEdu.institution}** (${pastEdu.period.en}).

**Certifications & Bootcamps** (also showcased in the **/certificates** tab):
${certList}`;
  }

  // 2. Salary expectations
  if (/\b(salario|salary|sueldo|pretensi|remuneraci|cuanto\s+pide|rate|compensation|usd|ars|dolar|dólar)\b/i.test(q)) {
    const argUsd = professionalData.salaryExpectations.argentina.amount.toLocaleString('en-US');
    const latamUsd = professionalData.salaryExpectations.latam.amount.toLocaleString('en-US');
    const arsFormatted = salaryARS.toLocaleString('es-AR');
    const rateFormatted = exchangeRate.toLocaleString('es-AR');

    if (isEs) {
      return `**Expectativas salariales de Carlos Jesús (bruto):**

• **Argentina:** **${arsFormatted} ARS** (${argUsd} USD brutos, calculado con dólar blue venta actual de ${rateFormatted} ARS/USD).
• **LATAM / Remoto Internacional:** **${latamUsd} USD** brutos.
• **Modalidad:** 100% remoto preferido (acepta híbrido hasta 1 día/semana en Buenos Aires).`;
    }

    return `**Carlos Jesús's Salary Expectations (Gross):**

• **Argentina:** **${arsFormatted} ARS** (${argUsd} USD gross, calculated using live dólar blue rate: ${rateFormatted} ARS/USD).
• **LATAM / International Remote:** **${latamUsd} USD** gross.
• **Modality:** 100% remote preferred (open to up to 1 day/week hybrid in Buenos Aires).`;
  }

  // 3. CV / Resume download
  if (/\b(cv|resume|curriculum|currículum|descargar|download|pdf)\b/i.test(q)) {
    if (isEs) {
      return `Podés descargar el **CV actualizado de Carlos Jesús** directamente desde acá:
• **Descargar CV (PDF):** ${professionalData.personal.cvPath}

Si estás buscando evaluar un rol puntual (**Frontend**, **Full Stack** o **Full Stack + AI Engineer**), decime cuál y te resumo su experiencia clave para esa posición.`;
    }
    return `You can download **Carlos Jesús's resume (PDF)** directly here:
• **Download Resume:** ${professionalData.personal.cvPath}

If you're hiring for a specific role (**Frontend**, **Full Stack**, or **AI Engineer**), let me know and I'll highlight his most relevant experience.`;
  }

  // 4. AI & Automation expertise
  if (/\b(\bia\b|\bai\b|inteligencia\s+artificial|gemini|claude|n8n|automatiz|automation|chatbot|copilot|cursor|prompt|rocky|kronos|kitchen|rappi)\b/i.test(q)) {
    if (isEs) {
      return `**Experiencia de Carlos Jesús en IA y Automatización:**

• **rocky-spec (2026):** Toolkit multi-agente open-source en Python para Spec-Driven Development compatible con Claude Code y Cursor (https://github.com/carlos0718/rocky-spec).
• **Kronos AI Assistant & Rappi AI (2026):** Asistente de escritorio por voz en Python con LLM + sistema de análisis operacional conversacional con **Claude Sonnet**.
• **Kitchen AI Companion & CharlyBot:** Apps de IA en producción integrando **Supabase**, **Gemini API (@google/genai)** y guardrails anti-prompt-injection.
• **Ingeniería Asistida por IA:** Skills propias para Claude Code (charly-skills-dev) y reducción de tiempos de entrega en un **25–40%** en Globons.`;
    }
    return `**Carlos Jesús's AI & Automation Experience:**

• **rocky-spec (2026):** Open-source Python multi-agent toolkit for Spec-Driven Development across Claude Code & Cursor (https://github.com/carlos0718/rocky-spec).
• **Kronos AI Assistant & Rappi AI (2026):** Voice-controlled desktop LLM assistant in Python + conversational ops analytics powered by **Claude Sonnet**.
• **Kitchen AI Companion & CharlyBot:** Production AI apps integrating **Supabase**, **Gemini API (@google/genai)**, and 3-layer prompt-injection guardrails.
• **AI-Assisted Engineering:** Custom Claude Code skills and **25–40%** faster feature delivery at Globons.`;
  }

  // 5. Work Experience & Impact
  if (
    /\b(experiencia|experience|trabajo|trabajos|trabaj[oó]|trayectoria|work|career|globons|istea|marfrig|rockstar|bief|logros|achievements|saas|cu[aá]nto\s+tiempo|a[nñ]os)\b/i.test(
      q
    )
  ) {
    const lines = professionalData.experience.map((job) => {
      const dur = calculateDuration(job.startDate, job.endDate);
      const proj = job.project ? ` (${job.project})` : '';
      return `• **${job.company}${proj}** — ${job.role[lang]} (${job.period[lang]} · ${dur[lang]}): ${job.achievements[lang][0]}`;
    });

    if (isEs) {
      return `Carlos cuenta con **+${professionalData.personal.yearsOfExperience} años de experiencia** profesional en desarrollo de software:

${lines.join('\n')}`;
    }

    return `Carlos has **${professionalData.personal.yearsOfExperience}+ years** of professional software engineering experience:

${lines.join('\n')}`;
  }

  // 6. Technical Stack / Skills
  if (
    /\b(stack|tecnolog|tech|skill|habilidad|frontend|backend|fullstack|full-stack|full stack|react|next|node|dotnet|\.net|c#|python|sql|postgres|supabase|rls|expo|docker|aws|lenguaje)\b/i.test(
      q
    )
  ) {
    const s = professionalData.technicalSkills;
    if (isEs) {
      return `**Stack técnico principal de Carlos Jesús:**

• **Frontend:** ${s.frontend.join(', ')}
• **Backend:** ${s.backend.join(', ')}
• **Bases de datos:** ${s.databases.join(', ')}
• **Cloud & DevOps:** ${s.cloud.join(', ')}
• **IA & Automatización:** ${s.aiTools.join(', ')}`;
    }

    return `**Carlos Jesús's Core Tech Stack:**

• **Frontend:** ${s.frontend.join(', ')}
• **Backend:** ${s.backend.join(', ')}
• **Databases:** ${s.databases.join(', ')}
• **Cloud & DevOps:** ${s.cloud.join(', ')}
• **AI & Automation:** ${s.aiTools.join(', ')}`;
  }

  // 7. Projects & GitHub
  if (/\b(proyecto|proyectos|project|projects|github|repo|portfolio|casos)\b/i.test(q)) {
    const cases = professionalData.featuredProjects
      .map((p) => `• **${p.name[lang]}** (${p.technologies.slice(0, 4).join(', ')}): ${p.impact[lang]}`)
      .join('\n');

    if (isEs) {
      return `**Proyectos destacados de Carlos Jesús** (+${repoCount} repositorios en GitHub):

${cases}

• **GitHub:** ${professionalData.personal.github}
También podés explorar todos sus repos filtrables en la sección **/projects**.`;
    }

    return `**Carlos Jesús's Featured Projects** (${repoCount}+ GitHub repositories):

${cases}

• **GitHub:** ${professionalData.personal.github}
You can also explore all filterable repositories in the **/projects** section.`;
  }

  // 8. Availability, Modality, Contact
  if (/\b(contact|contacto|email|mail|linkedin|whatsapp|disponib|availab|remoto|remote|hibrido|híbrido|hybrid|idioma|ingles|inglés|english)\b/i.test(q)) {
    const p = professionalData.personal;
    if (isEs) {
      return `**Disponibilidad y contacto directo de Carlos Jesús:**

• **Estado:** ${p.availability.es} (${professionalData.workPreferences.modality}; ${professionalData.workPreferences.maxHybrid}).
• **Idiomas:** Español nativo · Inglés B1 (en formación activa).
• **LinkedIn:** ${p.linkedin}
• **GitHub:** ${p.github}
• **Email:** ${p.email}
• **WhatsApp:** ${p.whatsappUrl}`;
    }

    return `**Carlos Jesús's Availability & Direct Contact:**

• **Status:** ${p.availability.en} (${professionalData.workPreferences.modality}; ${professionalData.workPreferences.maxHybrid}).
• **Languages:** Native Spanish · English B1 (actively improving).
• **LinkedIn:** ${p.linkedin}
• **GitHub:** ${p.github}
• **Email:** ${p.email}
• **WhatsApp:** ${p.whatsappUrl}`;
  }

  // 9. Greeting or generic profile query
  if (/\b(hola|hello|hi|hey|buenas|quien|quién|who|perfil|profile|sobre|about|ayuda|help|carlos)\b/i.test(q)) {
    if (isEs) {
      return `¡Hola! **Carlos Jesús** es **${professionalData.personal.title.es}** con **+${professionalData.personal.yearsOfExperience} años de experiencia**, graduado de **UTN-FRGP** y actualmente cursando la **Tecnicatura Universitaria en Sistemas orientado a Desarrollo Web en la UK**.

¿Sobre qué aspecto de su experiencia laboral o formación académica querés profundizar?
• Stack técnico (Frontend, Full Stack o IA)
• Experiencia laboral y logros medibles
• Formación académica actual (UK), título UTN y certificados
• Expectativas salariales (USD / ARS blue) y disponibilidad`;
    }

    return `Hi! **Carlos Jesús** is a **${professionalData.personal.title.en}** with **${professionalData.personal.yearsOfExperience}+ years of experience**, a **UTN-FRGP** graduate currently pursuing a **University Technical Degree in Systems (Web Development Focus) at Universidad Kennedy (UK)**.

What would you like to know about his work experience or academic background?
• Core tech stack (Frontend, Full Stack, or AI Engineering)
• Work history & measurable impact
• Past & current education (UK / UTN-FRGP) and certifications
• Salary expectations (USD / live ARS) & remote availability`;
  }

  // 10. Strict domain enforcement for unrecognized / off-topic queries
  return getScopeRefusalMessage(lang, false);
}
