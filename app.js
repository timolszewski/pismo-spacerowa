/* ============================================
   Oliva Koncept — Pismo Web App
   Zero backend, zero tracking, pdf-lib only
   ============================================ */

// PDF field coordinates — exact baselines from template content stream
// y = cm_origin_y + Tm_offset (pdf-lib uses bottom-left origin)
const PDF_FIELDS = {
  date:    { x: 410, y: 753.02 },   // cm 747.02 + Tm 6
  name:    { x: 182, y: 717.02 },   // cm 713.02 + Tm 4
  address: { x: 204, y: 693.02 },   // cm 689.02 + Tm 4
  apt:     { x: 151, y: 669.02 },   // cm 665.02 + Tm 4
  kw:      { x: 236, y: 645.02 },   // cm 641.02 + Tm 4
  pesel:   { x: 211, y: 621.02 },   // cm 617.02 + Tm 4
};

let generatedPdfBytes = null;
let currentStep = 1;

// ============================================
// STEP NAVIGATION
// ============================================
function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step-' + n);
  if (target) target.classList.add('active');

  // Update progress dots
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
// PDF GENERATION (pdf-lib)
// ============================================
async function generatePDF() {
  if (!validateForm()) return;

  showStep(3);

  const name = document.getElementById('field-name').value.trim();
  const building = document.getElementById('field-building').value.trim().toUpperCase();
  const apt = document.getElementById('field-apt').value.trim();
  const address = buildAddress();
  const kw = document.getElementById('field-kw').value.trim();
  const pesel = document.getElementById('field-pesel').value.trim();

  // Format today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    // Load template PDF
    const templateUrl = 'szablon.pdf';
    const templateBytes = await fetch(templateUrl).then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);

    // Register fontkit for custom font embedding
    pdfDoc.registerFontkit(fontkit);

    // Embed Liberation Serif (supports Polish diacritics: ą,ć,ę,ł,ń,ó,ś,ź,ż)
    const fontUrl = 'LiberationSerif-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(r => r.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];
    const fontSize = 12;

    // Helper: draw text at field position
    function drawField(field, text) {
      if (!text) return;
      const coords = PDF_FIELDS[field];
      page.drawText(text, {
        x: coords.x,
        y: coords.y,
        size: fontSize,
        font: font,
        color: PDFLib.rgb(0.1, 0.1, 0.1),
      });
    }

    // Fill in fields
    drawField('date', dateStr);
    drawField('name', name);
    drawField('address', address);
    drawField('apt', apt);
    drawField('kw', kw);
    if (pesel) drawField('pesel', pesel);

    // Save
    generatedPdfBytes = await pdfDoc.save();

    // Short delay for UX (show spinner briefly)
    await new Promise(r => setTimeout(r, 800));

    showStep(4);

  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Wystąpił błąd podczas generowania PDF. Spróbuj ponownie.');
    showStep(2);
  }
}

// ============================================
// METHOD SELECTION
// ============================================
function selectMethod(method) {
  // Hide all method instructions, show selected
  document.querySelectorAll('.method-instructions').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById('method-' + method).style.display = 'block';
  showStep(5);
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
  // Open ePUAP "Pismo ogólne" after a short delay
  setTimeout(() => {
    window.open('https://obywatel.gov.pl/wyslij-pismo-ogolne', '_blank');
  }, 1000);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  showStep(1);

  // Live address preview when building or apt changes
  ['field-building', 'field-apt'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateAddressPreview);
  });

  // Enter key in form fields submits
  document.querySelectorAll('#step-2 input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generatePDF();
    });
  });
});
