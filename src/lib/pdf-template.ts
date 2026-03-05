export function buildPDFHtml(data: any, language: string, formMeta: any) {
  const isEn = language === 'en';
  
  const activeServices = formMeta.services || ["branding"];

  const escapeHtml = (str: string) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  const renderChips = (arr: string[] | string | undefined) => {
    if (!arr || (Array.isArray(arr) && !arr.length)) return '-';
    if (typeof arr === 'string') return `<div class="q-value">${escapeHtml(arr)}</div>`;
    return `<div class="chips-container">\n${arr.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('\n')}\n</div>`;
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=DM+Mono&display=swap');
          
          :root {
            --accent: #00E5A0;
            --bg: #080808;
          }

          * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; }
          body { 
            background: #ffffff; 
            color: #111; 
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.5;
          }

          .page {
            width: 210mm;
            height: 297mm;
            padding: 25mm;
            position: relative;
            page-break-after: always;
            background: #ffffff;
            overflow: hidden;
          }

          .page.cover {
            background: var(--bg);
            color: #fff;
          }

          .mono { font-family: 'DM Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; }
          .accent { color: var(--accent); }
          
          .cover-content {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 25mm;
            right: 25mm;
          }

          .title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 72pt;
            font-weight: 800;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            line-height: 0.9;
            margin-bottom: 20px;
          }

          .section-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 32pt;
            text-transform: uppercase;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid #111;
          }

          .q-box {
            margin-bottom: 25px;
          }

          .q-label {
            color: #888;
            font-family: 'DM Mono', monospace;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
            line-height: 1.4;
            border-left: 2px solid #ddd;
            padding-left: 10px;
          }

          .q-value {
            font-size: 15px;
            color: #111;
            white-space: pre-wrap;
          }

          .chips-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 5px;
          }

          .chip {
            display: inline-block;
            padding: 4px 10px;
            background: #f5f5f5;
            border: 1px solid #eee;
            border-radius: 4px;
            font-size: 11px;
            color: #555;
          }

          .footer {
            position: absolute;
            bottom: 20mm;
            left: 25mm;
            right: 25mm;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #eee;
            padding-top: 10px;
            font-family: 'DM Mono', monospace;
            font-size: 9px;
            color: #aaa;
          }
        </style>
      </head>
      <body>
        <!-- PAGE 1: COVER -->
        <div class="page cover">
          <div class="cover-content">
            <div class="mono accent" style="margin-bottom: 15px;">${escapeHtml(formMeta.client_name)}</div>
            <h1 class="title">Technical<br>Discovery</h1>
            <div class="mono" style="color: #666; margin-top: 40px;">
              ${activeServices.join(" + ").toUpperCase()}
            </div>
          </div>
          <div class="footer mono">
            <span>Noctra Studio</span>
            <span>${new Date().getFullYear()}</span>
          </div>
        </div>

        <!-- PAGE 2: COMMON -->
        <div class="page">
          <h2 class="section-title">Common Insight</h2>
          <div class="q-box">
            <div class="q-label">¿Por qué existe la empresa? ¿Cuál fue la frustración original o la oportunidad que nadie estaba aprovechando?</div>
            <div class="q-value">${escapeHtml(data.q_origin) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿Quién es exactamente el cliente con el que MÁS disfrutan trabajar?</div>
            <div class="q-value">${escapeHtml(data.q_ideal_client) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿Cuál es el resultado más concreto y medible que le entregan a un cliente?</div>
            <div class="q-value">${escapeHtml(data.q_concrete_result) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿Por qué un cliente que cotizó con la competencia terminó eligiéndolos a ustedes?</div>
            <div class="q-value">${escapeHtml(data.q_differentiator) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿Has intentado resolver este problema antes?</div>
            <div class="q-value">${escapeHtml(data.q_previous_attempts) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Si tuvieran una varita mágica, ¿qué proceso interno eliminarían?</div>
            <div class="q-value">${escapeHtml(data.q_internal_obstacle) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿En qué momento está la empresa hoy?</div>
            <div class="q-value">
              <strong>${data.q_business_stage || '-'}</strong>
              ${data.q_business_stage_detail ? `<div style="margin-top: 5px; font-style: italic; color: #666;">${escapeHtml(data.q_business_stage_detail)}</div>` : ''}
            </div>
          </div>
          <div class="footer mono">
            <span>Discovery Report</span>
            <span>02</span>
          </div>
        </div>

        <!-- SERVICE SPECIFIC PAGES -->
        ${activeServices.includes("branding") ? `
        <div class="page">
          <h2 class="section-title">Branding & Identity</h2>
          <div class="q-box">
            <div class="q-label">¿Qué marca tiene la identidad visual que MÁS te gusta, y qué la hace especial?</div>
            <div class="q-value">${escapeHtml(data.q_visual_inspiration) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Estilos visuales a EVITAR</div>
            <div>${renderChips(data.q_visual_avoid)}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Accent Color</div>
            <div class="q-value" style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 24px; height: 24px; background: ${data.q_accent_color}; border: 1px solid #eee; border-radius: 4px;"></div>
              ${escapeHtml(data.q_accent_color_name)} (${escapeHtml(data.q_accent_color)})
            </div>
          </div>
          <div class="q-box">
            <div class="q-label">Más allá del logo, ¿qué tiene que lograr esta nueva identidad?</div>
            <div class="q-value">${escapeHtml(data.q_concrete_result_brand) || escapeHtml(data.q_concrete_result) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Atributos de Voz</div>
             <div>${renderChips(data.q_voice_attrs)}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Evitar Tono</div>
            <div class="q-value">${escapeHtml(data.q_tone_avoid) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">¿Qué tipo de empresa o reputación sería un FRACASO total?</div>
            <div class="q-value">${escapeHtml(data.q_never) || '-'}</div>
          </div>
          <div class="footer mono">
            <span>Branding Section</span>
            <span>03</span>
          </div>
        </div>` : ''}

        ${activeServices.includes("web") ? `
        <div class="page">
          <h2 class="section-title">Web & Experience</h2>
          <div class="q-box">
            <div class="q-label">Tipo de Proyecto</div>
            <div class="q-value">${escapeHtml(data.web_type) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Si pudieras pedirle al visitante que haga SOLO UNA COSA, ¿qué sería?</div>
            <div class="q-value">${escapeHtml(data.web_goal) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Características (Features)</div>
             <div>${renderChips(data.web_features)}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Estatus de Contenido</div>
            <div class="q-value">${escapeHtml(data.web_content_owner) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Fecha Límite</div>
            <div class="q-value">${escapeHtml(data.web_deadline) || '-'}</div>
          </div>
          <div class="footer mono">
            <span>Web Section</span>
            <span>04</span>
          </div>
        </div>` : ''}

        ${activeServices.includes("seo") ? `
        <div class="page">
          <h2 class="section-title">SEO & Growth</h2>
          <div class="q-box">
             <div class="q-label">Sitio Actual</div>
             <div class="q-value">${escapeHtml(data.seo_current_site) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Palabras Clave (Keywords)</div>
             <div class="q-value">${escapeHtml(data.seo_target_keywords) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Competidores</div>
             <div class="q-value">${escapeHtml(data.seo_competitors) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Intentos Previos</div>
             <div class="q-value">${escapeHtml(data.seo_previous_attempts) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Capacidad de Contenido</div>
             <div class="q-value">${escapeHtml(data.seo_content_capacity) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Alcance (Geo)</div>
             <div class="q-value">${escapeHtml(data.seo_geo) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Objetivo de Tráfico</div>
             <div class="q-value">${escapeHtml(data.seo_goal) || '-'}</div>
          </div>
          <div class="footer mono"><span>SEO Section</span><span>05</span></div>
        </div>` : ''}

        ${activeServices.includes("ai-automations") ? `
        <div class="page">
          <h2 class="section-title">AI & Automations</h2>
          <div class="q-box">
             <div class="q-label">Herramientas Actuales</div>
             <div class="q-value">${escapeHtml(data.ai_current_tools) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">¿Qué tarea hace tu equipo hoy que, si desapareciera mañana, nadie la extrañaría, pero hoy no pueden evitar hacer?</div>
             <div class="q-value">${escapeHtml(data.ai_pain_points) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Si pudieras automatizar UNA SOLA COSA esta misma semana, ¿cuál sería?</div>
             <div class="q-value">${escapeHtml(data.ai_first_priority) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Procesos a Automatizar</div>
             <div>${renderChips(data.ai_processes)}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Tamaño del Equipo</div>
             <div class="q-value">${escapeHtml(data.ai_team_size) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Nivel Tecnológico</div>
             <div class="q-value">${escapeHtml(data.ai_tech_level) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">¿Tienen un presupuesto mensual contemplado para pagar licencias de software y automatizaciones?</div>
             <div class="q-value">${escapeHtml(data.ai_budget_range) || '-'}</div>
          </div>
          <div class="footer mono"><span>AI Section</span><span>06</span></div>
        </div>` : ''}

        ${activeServices.includes("crm") ? `
        <div class="page">
          <h2 class="section-title">CRM & Systems</h2>
          <div class="q-box">
             <div class="q-label">¿Qué usan hoy para gestionar clientes/ventas?</div>
             <div class="q-value">${escapeHtml(data.crm_current_crm) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">¿Han intentado implementar un CRM antes y la gente dejó de usarlo? ¿Por qué crees que fracasó?</div>
             <div class="q-value">${escapeHtml(data.crm_previous_attempt) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">¿En qué parte exacta del proceso comercial actual se están estancando los leads o perdiendo el tiempo?</div>
             <div class="q-value">${escapeHtml(data.crm_pain_points) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">¿Cómo es tu proceso de ventas hoy (tu pipeline)?</div>
             <div class="q-value">${escapeHtml(data.crm_pipeline) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Tamaño del Equipo (CRM)</div>
             <div class="q-value">${escapeHtml(data.crm_team_size) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Integraciones Necesarias</div>
             <div>${renderChips(data.crm_integrations)}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Funciones de IA Deseadas</div>
             <div>${renderChips(data.crm_ai_features)}</div>
          </div>
          <div class="footer mono"><span>CRM Section</span><span>07</span></div>
        </div>` : ''}

      </body>
    </html>
  `;
}
