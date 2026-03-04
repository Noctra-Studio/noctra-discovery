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

  const renderChips = (arr: string[] | undefined) => {
    if (!arr || !arr.length) return '-';
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
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 6px;
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
            <div class="q-label">One Liner</div>
            <div class="q-value">${escapeHtml(data.q_company_one_liner) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Why? (Propósito)</div>
            <div class="q-value">${escapeHtml(data.q_company_why) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Diferenciador</div>
            <div class="q-value">${escapeHtml(data.q_differentiator) || '-'}</div>
          </div>
          <div class="q-box">
            <div class="q-label">Cliente Ideal</div>
            <div class="q-value">${escapeHtml(data.q_ideal_client) || '-'}</div>
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
            <div class="q-label">Accent Color</div>
            <div class="q-value" style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 24px; height: 24px; background: ${data.q_accent_color}; border: 1px solid #eee; border-radius: 4px;"></div>
              ${escapeHtml(data.q_accent_color_name)} (${escapeHtml(data.q_accent_color)})
            </div>
          </div>
          <div class="q-box">
            <div class="q-label">Tagline</div>
            <div class="q-value">${escapeHtml(data.q_tagline) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Atributos de Voz</div>
             <div>${renderChips(data.q_voice_attrs)}</div>
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
            <div class="q-label">Objetivo Principal</div>
            <div class="q-value">${escapeHtml(data.web_goal) || '-'}</div>
          </div>
          <div class="q-box">
             <div class="q-label">Páginas Requeridas</div>
             <div>${renderChips(data.web_pages)}</div>
          </div>
          <div class="footer mono">
            <span>Web Section</span>
            <span>04</span>
          </div>
        </div>` : ''}

      </body>
    </html>
  `;
}
