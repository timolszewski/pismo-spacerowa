/* ============================================
   Oliva Koncept — Pismo Web App
   Zero backend, zero tracking, pdf-lib only
   ============================================ */

// PDF field coordinates — exact baselines from template content stream
const PDF_FIELDS = {
  date:    { x: 410, y: 753.02 },
  name:    { x: 182, y: 717.02 },
  address: { x: 204, y: 693.02 },
  apt:     { x: 151, y: 669.02 },
  kw:      { x: 236, y: 645.02 },
  pesel:   { x: 211, y: 621.02 },
};

let generatedPdfBytes = null;
let currentStep = 1;

// ============================================
// QUIZ DATA — 19 questions, 6 categories
// ============================================
const QUIZ_QUESTIONS = [
  // --- Ochrona przed hałasem ---
  { id: 'Q1', category: 'Ochrona przed hałasem',
    title: 'Lepsza klasa ochrony ekranów akustycznych',
    desc: 'Planowane ekrany mają minimalną klasę A3 (8 dB). Klasa A4 daje dodatkowe 3 dB zapasu ochrony.',
    codes: ['AK-10'] },
  { id: 'Q1a', category: 'Ochrona przed hałasem',
    title: 'Analiza ekranów dla wyższych kondygnacji',
    desc: 'Ekrany mogą nie chronić mieszkań na wyższych piętrach. Postulat wymaga dodatkowej analizy.',
    codes: ['AK-4'] },
  { id: 'Q2', category: 'Ochrona przed hałasem',
    title: 'Transparentne ekrany (światło i estetyka)',
    desc: 'Nieprzezroczyste ekrany mogą zasłaniać światło na parterze i I piętrze. Panele transparentne to rozwiązują.',
    codes: ['AK-17'] },
  { id: 'Q3', category: 'Ochrona przed hałasem',
    title: 'Cisza nocą — hałas pojedynczego autobusu',
    desc: 'Nawet jeden autobus nocą może budzić. Postulat wymaga analizy hałasu maksymalnego LAmax wg WHO.',
    codes: ['AK-5'] },
  { id: 'Q4', category: 'Ochrona przed hałasem',
    title: 'Cicha nawierzchnia na buspasie',
    desc: 'Nawierzchnia poroelastyczna lub SMA LA zmniejsza hałas toczenia o 3-5 dB.',
    codes: ['AK-11'] },
  { id: 'Q5', category: 'Ochrona przed hałasem',
    title: 'Hałas niskoczęstotliwościowy (20-200 Hz)',
    desc: 'Autobusy generują dudnienie, które przenika przez ściany. KIP w ogóle nie analizuje tego pasma.',
    codes: ['AK-7'] },
  { id: 'Q6', category: 'Ochrona przed hałasem',
    title: 'Łączny hałas ze wszystkich źródeł',
    desc: 'KIP analizuje buspas osobno, ale hałas kumuluje się z koleją, al. Grunwaldzką i zoo.',
    codes: ['AK-12', 'BU-7'] },

  // --- Ochrona budynków ---
  { id: 'Q7', category: 'Ochrona budynków',
    title: 'Stan zero budynków przed budową',
    desc: 'Dokumentacja fotograficzna spękań i stanu technicznego — dowód w razie szkód.',
    codes: ['BU-2'] },
  { id: 'Q8', category: 'Ochrona budynków',
    title: 'Analiza wpływu drgań na budynki',
    desc: '80% podłoża to grunty niespoiste — drgania z budowy mogą powodować osiadanie i pękanie.',
    codes: ['AK-8', 'BU-1', 'BU-3'] },
  { id: 'Q9', category: 'Ochrona budynków',
    title: 'Fundusz gwarancyjny 10 mln zł',
    desc: 'Depozyt bankowy na naprawy szkód budowlanych, z niezależnym inspektorem nadzoru.',
    codes: ['BU-12'] },
  { id: 'Q10', category: 'Ochrona budynków',
    title: 'Ochrona przed osuszeniem gruntu',
    desc: 'Pompy odwadniające (50-80 m³/h) mogą obniżyć poziom wód gruntowych pod fundamentami.',
    codes: ['BU-5'] },

  // --- Wartość nieruchomości ---
  { id: 'Q11', category: 'Wartość nieruchomości',
    title: 'Wycena nieruchomości przed budową',
    desc: 'Niezależna wycena + mechanizm kompensacji spadku wartości. 4 podstawy prawne roszczeń.',
    codes: ['BU-10', 'BU-13'] },

  // --- Życie podczas budowy ---
  { id: 'Q12', category: 'Życie podczas budowy',
    title: 'Plan dojazdu na czas 18-24 mies. budowy',
    desc: 'Gwarancja dojazdu ratunkowego do 15 min, przystanek tymczasowy ≤300 m, bezpieczne trasy szkolne.',
    codes: ['DR-4', 'DR-5', 'DR-6'] },

  // --- Pakiet kompensacyjny ---
  { id: 'Q13', category: 'Pakiet kompensacyjny',
    title: 'Pomiar akustyczny + filtry wentylacji',
    desc: 'Indywidualny pomiar hałasu w budynkach osiedla + wymiana filtrów rekuperacji na czas budowy.',
    codes: ['AK-16(a,b)'] },
  { id: 'Q14', category: 'Pakiet kompensacyjny',
    title: 'Stacja monitoringu hałasu online',
    desc: 'Stała stacja pomiarowa z publicznym dostępem do wyników + dedykowany monitoring osiedla.',
    codes: ['AK-16(c)', 'AD-11'] },
  { id: 'Q15', category: 'Pakiet kompensacyjny',
    title: 'Pas zieleni izolacyjnej 15 m',
    desc: 'Wielopiętrowy pas drzew, krzewów i pnączy jako bufor akustyczny i filtr powietrza.',
    codes: ['FL-15'] },
  { id: 'Q16', category: 'Pakiet kompensacyjny',
    title: 'Oświetlenie bez świecenia w okna',
    desc: 'Lampy ≤2700K z pełnym cut-off — ciepłe światło skierowane na drogę, nie na budynki.',
    codes: ['FA-15'] },
  { id: 'Q17', category: 'Pakiet kompensacyjny',
    title: 'Biuro informacyjne dla mieszkańców',
    desc: 'Stały punkt kontaktu z dostępem do dokumentacji, harmonogramu i danych monitoringowych.',
    codes: ['PR-8'] },

  // --- Bezpieczeństwo na drodze ---
  { id: 'Q18', category: 'Bezpieczeństwo na drodze',
    title: 'Analiza bezpieczeństwa drogowego (BRD)',
    desc: 'Minimalne parametry drogi (pasy 3.0 m, pobocza 0.5 m) budzą wątpliwości przy autobusach 18 m.',
    codes: ['DR-1'] },
];

// Quiz answers — default all true
const quizAnswers = {};
QUIZ_QUESTIONS.forEach(q => { quizAnswers[q.id] = true; });

// ============================================
// QUIZ RENDERING
// ============================================
function renderQuiz() {
  const container = document.getElementById('quiz-container');
  let html = '';
  let lastCat = '';

  QUIZ_QUESTIONS.forEach(q => {
    if (q.category !== lastCat) {
      if (lastCat) html += '</div>';
      html += `<div class="quiz-category"><h3 class="quiz-cat-title">${q.category}</h3>`;
      lastCat = q.category;
    }
    html += `
      <div class="quiz-item" data-quiz="${q.id}" id="qi-${q.id}">
        <div class="quiz-text">
          <strong>${q.title}</strong>
          <p>${q.desc}</p>
        </div>
        <div class="quiz-toggle">
          <button class="toggle-btn active" data-value="yes" onclick="quizToggle('${q.id}',true,this)">TAK</button>
          <button class="toggle-btn" data-value="no" onclick="quizToggle('${q.id}',false,this)">NIE</button>
        </div>
      </div>`;
  });
  if (lastCat) html += '</div>';
  container.innerHTML = html;
  updateQuizCount();
}

function quizToggle(id, value, btn) {
  quizAnswers[id] = value;
  const item = document.getElementById('qi-' + id);
  const btns = item.querySelectorAll('.toggle-btn');
  btns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  item.classList.toggle('off', !value);
  updateQuizCount();
}

function quizSelectAll(value) {
  QUIZ_QUESTIONS.forEach(q => {
    quizAnswers[q.id] = value;
    const item = document.getElementById('qi-' + q.id);
    if (!item) return;
    const btns = item.querySelectorAll('.toggle-btn');
    btns.forEach(b => {
      b.classList.remove('active');
      if ((value && b.dataset.value === 'yes') || (!value && b.dataset.value === 'no'))
        b.classList.add('active');
    });
    item.classList.toggle('off', !value);
  });
  updateQuizCount();
}

function updateQuizCount() {
  const count = Object.values(quizAnswers).filter(v => v).length;
  const total = QUIZ_QUESTIONS.length;
  document.getElementById('quiz-count').textContent = `${count} z ${total}`;
}

// ============================================
// QUIZ → PETITUM MAPPING
// ============================================
function getSelectedPetitumItems() {
  // Build set of excluded codes from quiz
  const excludedCodes = new Set();
  QUIZ_QUESTIONS.forEach(q => {
    if (!quizAnswers[q.id]) {
      q.codes.forEach(c => excludedCodes.add(c));
    }
  });

  const items = PETITUM_CONFIG.items;
  const result = [];

  for (const item of items) {
    // AK-16 special handling
    if (item.code === 'AK-16') {
      const text = buildAK16Text();
      if (text) result.push({ code: 'AK-16', text: text });
      continue;
    }

    // Check if code is excluded
    if (excludedCodes.has(item.code)) continue;

    result.push(item);
  }
  return result;
}

function buildAK16Text() {
  // AK-16 sub-items: Q13→(a,b), Q14→(c), (d) always
  const parts = [];
  if (quizAnswers.Q13) {
    parts.push('(a) przeprowadzenie indywidualnego pomiaru akustycznego w budynkach osiedla (KIP zawiera pomiar tylko w 1 punkcie na 5,7 km trasy)');
    parts.push('(b) sfinansowanie wymiany filtrów wentylacji rekuperacyjnej w okresie budowy i przez 2 lata po jej zakończeniu (zwiększone zapylenie i spaliny z budowy przyspieszają zużycie filtrów istniejącej instalacji)');
  }
  if (quizAnswers.Q14) {
    parts.push('(c) zainstalowanie stałej stacji monitoringu hałasu i drgań z publicznym dostępem do wyników online');
  }
  // (d) always included
  parts.push('(d) ustanowienie funduszu gwarancyjnego na naprawę ewentualnych szkód budowlanych');

  if (parts.length <= 1) {
    // Only (d) — if all quiz items off, still include with just (d)
  }

  return 'Objęcie osiedla Oliva Koncept \u2014 jako zabudowy wielorodzinnej bezpośrednio narażonej na skumulowane oddziaływanie akustyczne, wibracyjne i niskoczęstotliwościowe \u2014 pakietem środków kompensacyjnych obejmującym: ' + parts.join(', ') + '.';
}

// ============================================
// STEP NAVIGATION
// ============================================
function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step-' + n);
  if (target) target.classList.add('active');

  document.querySelectorAll('.progress-dot').forEach((dot, i) => {
    dot.classList.remove('done', 'current');
    if (i + 1 < n) dot.classList.add('done');
    else if (i + 1 === n) dot.classList.add('current');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ADDRESS HELPERS
// ============================================
const BASE_STREET = 'ul. Karwieńska 1';
const BASE_ZIP_CITY = '80-328 Gdańsk';

function buildAddress() {
  const building = document.getElementById('field-building').value.trim().toUpperCase();
  const apt = document.getElementById('field-apt').value.trim();
  let addr = BASE_STREET;
  if (building) addr += building;
  if (apt) addr += '/' + apt;
  addr += ', ' + BASE_ZIP_CITY;
  return addr;
}

function updateAddressPreview() {
  document.getElementById('address-preview').textContent = buildAddress();
}

// ============================================
// FORM VALIDATION
// ============================================
function validateForm() {
  const fields = ['name', 'building', 'apt', 'kw'];
  let valid = true;
  fields.forEach(id => {
    const input = document.getElementById('field-' + id);
    if (!input.value.trim()) {
      input.style.borderColor = '#DC2626';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return valid;
}

// ============================================
// PDF GENERATION
// ============================================
async function generatePDF() {
  if (!validateForm()) return;

  // Update loading message with count
  const selectedItems = getSelectedPetitumItems();
  const loadingMsg = document.getElementById('loading-msg');
  if (loadingMsg) {
    loadingMsg.innerHTML = 'Trwa składanie dokumentu z <strong>' + selectedItems.length + '</strong> wnioskami formalnymi.';
  }

  showStep(4);

  const name = document.getElementById('field-name').value.trim();
  const building = document.getElementById('field-building').value.trim().toUpperCase();
  const apt = document.getElementById('field-apt').value.trim();
  const address = buildAddress();
  const kw = document.getElementById('field-kw').value.trim();
  const pesel = document.getElementById('field-pesel').value.trim();

  const today = new Date();
  const dateStr = today.toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    const allSelected = Object.values(quizAnswers).every(v => v);

    if (allSelected) {
      // FAST PATH: all petitum selected → use full template as-is
      const templateBytes = await fetch('szablon.pdf').then(r => r.arrayBuffer());
      const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
      pdfDoc.registerFontkit(fontkit);

      const fontBytes = await fetch('LiberationSerif-Regular.ttf').then(r => r.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);

      const page = pdfDoc.getPages()[0];
      fillPersonalData(page, font, { dateStr, name, address, apt, kw, pesel });

      generatedPdfBytes = await pdfDoc.save();

    } else {
      // DYNAMIC PATH: build PDF from parts
      const templateBytes = await fetch('szablon.pdf').then(r => r.arrayBuffer());
      const srcDoc = await PDFLib.PDFDocument.load(templateBytes);

      const finalDoc = await PDFLib.PDFDocument.create();
      finalDoc.registerFontkit(fontkit);

      // Embed fonts
      const fontRegBytes = await fetch('LiberationSerif-Regular.ttf').then(r => r.arrayBuffer());
      const fontBoldBytes = await fetch('LiberationSerif-Bold.ttf').then(r => r.arrayBuffer());
      const fontReg = await finalDoc.embedFont(fontRegBytes);
      const fontBold = await finalDoc.embedFont(fontBoldBytes);

      // Page indices (0-based)
      const petStart = PETITUM_CONFIG.petitumStartPage - 1; // 95
      const closingStart = PETITUM_CONFIG.closingStartPage - 1; // 105
      const totalPages = PETITUM_CONFIG.totalPages; // 107

      // 1. Copy body pages (before petitum)
      const bodyIndices = [];
      for (let i = 0; i < petStart; i++) bodyIndices.push(i);
      const bodyPages = await finalDoc.copyPages(srcDoc, bodyIndices);
      bodyPages.forEach(p => finalDoc.addPage(p));

      // 2. Generate PETITUM pages dynamically
      await renderPetitumPages(finalDoc, fontReg, fontBold, selectedItems);

      // 3. Copy closing pages (after petitum)
      const closingIndices = [];
      for (let i = closingStart; i < totalPages; i++) closingIndices.push(i);
      const closingPages = await finalDoc.copyPages(srcDoc, closingIndices);
      closingPages.forEach(p => finalDoc.addPage(p));

      // 4. Fill personal data on page 1
      const firstPage = finalDoc.getPages()[0];
      fillPersonalData(firstPage, fontReg, { dateStr, name, address, apt, kw, pesel });

      // 5. Add page numbers to ALL pages
      addPageNumbers(finalDoc, fontReg);

      generatedPdfBytes = await finalDoc.save();
    }

    await new Promise(r => setTimeout(r, 800));
    showStep(5);

  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Wystąpił błąd podczas generowania PDF. Spróbuj ponownie.');
    showStep(3);
  }
}

// ============================================
// FILL PERSONAL DATA ON PAGE 1
// ============================================
function fillPersonalData(page, font, data) {
  const fontSize = 12;
  function drawField(field, text) {
    if (!text) return;
    const coords = PDF_FIELDS[field];
    page.drawText(text, {
      x: coords.x, y: coords.y,
      size: fontSize, font: font,
      color: PDFLib.rgb(0.1, 0.1, 0.1),
    });
  }
  drawField('date', data.dateStr);
  drawField('name', data.name);
  drawField('address', data.address);
  drawField('apt', data.apt);
  drawField('kw', data.kw);
  if (data.pesel) drawField('pesel', data.pesel);
}

// ============================================
// RENDER PETITUM PAGES (dynamic)
// ============================================
async function renderPetitumPages(pdfDoc, fontReg, fontBold, selectedItems) {
  const PAGE_W = 595.28; // A4
  const PAGE_H = 841.89;
  const ML = 85;   // 3cm left margin
  const MR = 57;   // 2cm right margin
  const MT = 71;   // 2.5cm top margin
  const MB = 85;   // 3cm bottom margin (room for page number)
  const MAX_W = PAGE_W - ML - MR;
  const PET_INDENT = 28; // indent for petitum text
  const FONT_SIZE = 11;
  const LEADING = 16;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MT;

  // Header: "8. PETITUM"
  page.drawText('8. PETITUM', { x: ML, y, size: 13, font: fontBold, color: PDFLib.rgb(0, 0, 0) });
  y -= 26;
  page.drawText('Wobec powyższego, wnoszę o:', { x: ML, y, size: 12, font: fontBold, color: PDFLib.rgb(0, 0, 0) });
  y -= 22;

  for (let i = 0; i < selectedItems.length; i++) {
    const item = selectedItems[i];
    const num = i + 1;
    const prefix = num + '. ';
    const prefixWidth = fontBold.widthOfTextAtSize(prefix, FONT_SIZE);

    // Wrap the text
    const textLines = wrapText(item.text, fontReg, FONT_SIZE, MAX_W - PET_INDENT - prefixWidth);

    // Check if at least 3 lines fit (widow prevention)
    const neededHeight = Math.min(textLines.length, 3) * LEADING + 10;
    if (y - neededHeight < MB) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MT;
    }

    // Draw number (bold)
    page.drawText(prefix, {
      x: ML + PET_INDENT, y,
      size: FONT_SIZE, font: fontBold, color: PDFLib.rgb(0, 0, 0)
    });

    // Draw first line after number
    if (textLines.length > 0) {
      page.drawText(textLines[0], {
        x: ML + PET_INDENT + prefixWidth, y,
        size: FONT_SIZE, font: fontReg, color: PDFLib.rgb(0, 0, 0)
      });
    }
    y -= LEADING;

    // Draw remaining lines
    for (let j = 1; j < textLines.length; j++) {
      if (y < MB) {
        page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MT;
      }
      page.drawText(textLines[j], {
        x: ML + PET_INDENT + prefixWidth, y,
        size: FONT_SIZE, font: fontReg, color: PDFLib.rgb(0, 0, 0)
      });
      y -= LEADING;
    }

    y -= 6; // spacing between items
  }
}

// ============================================
// WORD WRAP HELPER
// ============================================
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    try {
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    } catch (e) {
      // Font encoding issue — skip problematic character
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

// ============================================
// PAGE NUMBERS
// ============================================
function addPageNumbers(pdfDoc, font) {
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const text = 'Strona ' + (i + 1);
    const textWidth = font.widthOfTextAtSize(text, 9);

    // White rectangle to cover existing page number
    page.drawRectangle({
      x: 0, y: 0,
      width: width, height: 40,
      color: PDFLib.rgb(1, 1, 1),
      opacity: 1,
    });

    // Draw new page number centered
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 28,
      size: 9,
      font: font,
      color: PDFLib.rgb(0.4, 0.4, 0.4),
    });
  });
}

// ============================================
// METHOD SELECTION
// ============================================
function selectMethod(method) {
  document.querySelectorAll('.method-instructions').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById('method-' + method).style.display = 'block';
  showStep(6);
}

// ============================================
// DOWNLOAD PDF
// ============================================
function downloadPDF() {
  if (!generatedPdfBytes) return;
  const blob = new Blob([generatedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pismo-uwagi-do-KIP-Spacerowa.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// EPUAP REDIRECT
// ============================================
function downloadAndOpenEpuap() {
  downloadPDF();
  setTimeout(() => {
    window.open('https://obywatel.gov.pl/wyslij-pismo-ogolne', '_blank');
  }, 1000);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  showStep(1);
  renderQuiz();

  ['field-building', 'field-apt'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateAddressPreview);
  });

  // Enter key in form fields (step 3 now)
  document.querySelectorAll('#step-3 input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generatePDF();
    });
  });
});
