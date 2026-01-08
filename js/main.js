function buildMapTable(r) {
  const table = new Array(256).fill('N');
  for (let i = r.Amin; i <= r.Amax; i++) table[i] = 'A';
  for (let i = r.Cmin; i <= r.Cmax; i++) table[i] = 'C';
  for (let i = r.Gmin; i <= r.Gmax; i++) table[i] = 'G';
  for (let i = r.Tmin; i <= r.Tmax; i++) table[i] = 'T';
  return table;
}

function qualityToAccuracy(q) {
  // Phred score to accuracy percentage
  const errorProb = Math.pow(10, -q / 10);
  return ((1 - errorProb) * 100).toFixed(1);
}

function qualityColor(q) {
  if (q >= 30) return 'green';
  if (q >= 20) return 'orange';
  return 'red';
}

function generateImage() {
  const input = document.getElementById('sequenceInput').value.trim();
  const output = document.getElementById('output');

  const lines = input.split('\n');
  if (lines.length !== 2 || !lines[0].startsWith('@')) {
    alert("Input must have two lines. First line must start with @.");
    return;
  }

  const header = lines[0];
  const raw = lines[1];

  if (raw.length % 3 !== 0) {
    alert("Second line length must be divisible by 3.");
    return;
  }

  const ranges = {
    Amin: +Amin.value, Amax: +Amax.value,
    Cmin: +Cmin.value, Cmax: +Cmax.value,
    Gmin: +Gmin.value, Gmax: +Gmax.value,
    Tmin: +Tmin.value, Tmax: +Tmax.value
  };

  const mapTable = buildMapTable(ranges);

  let baseLine = '';
  let qualityLine = '';
  let explanationLine = '';

  const table = document.createElement('table');
  const row = document.createElement('tr');

  for (let i = 0; i < raw.length; i += 3) {
    const val = parseInt(raw.slice(i, i + 3), 10);
    const base = mapTable[val];
    baseLine += base;

    let min = 0;
    if (base === 'A') min = ranges.Amin;
    else if (base === 'C') min = ranges.Cmin;
    else if (base === 'G') min = ranges.Gmin;
    else if (base === 'T') min = ranges.Tmin;

    const q = val - min;
    qualityLine += String.fromCharCode(q + 33);

    const acc = qualityToAccuracy(q);
    explanationLine += `[${acc}%] `;

    const cell = document.createElement('td');
    cell.textContent = base;
    cell.className = `base-${base}`;
    row.appendChild(cell);
  }

  table.appendChild(row);

  const text = document.createElement('pre');
  text.innerHTML =
    header + '\n' +
    baseLine + '\n' +
    qualityLine + '\n' +
    explanationLine;

  output.innerHTML = '';
  output.appendChild(text);
  output.appendChild(table);

  // Add new improved visualization below
  generateImprovedVisualization(header, raw, ranges, mapTable);
}

function generateImprovedVisualization(header, raw, ranges, mapTable) {
  const output = document.getElementById('output');
  
  // Create separator
  const separator = document.createElement('hr');
  separator.style.margin = '30px 0';
  output.appendChild(separator);
  
  const title = document.createElement('h3');
  title.textContent = 'Improved Visualization';
  output.appendChild(title);
  
  // Create container for aligned visualization
  const container = document.createElement('div');
  container.className = 'improved-viz';
  
  // Header
  const headerDiv = document.createElement('div');
  headerDiv.className = 'viz-header';
  headerDiv.textContent = header;
  container.appendChild(headerDiv);
  
  // Create aligned rows
  const baseRow = document.createElement('div');
  baseRow.className = 'viz-row base-row';
  
  const qualityRow = document.createElement('div');
  qualityRow.className = 'viz-row quality-row';
  
  // Add an additional row for quality boxes (reusing the colored box concept)
  const qualityBoxRow = document.createElement('div');
  qualityBoxRow.className = 'viz-row quality-box-row';
  
  for (let i = 0; i < raw.length; i += 3) {
    const val = parseInt(raw.slice(i, i + 3), 10);
    const base = mapTable[val];
    
    let min = 0;
    if (base === 'A') min = ranges.Amin;
    else if (base === 'C') min = ranges.Cmin;
    else if (base === 'G') min = ranges.Gmin;
    else if (base === 'T') min = ranges.Tmin;
    
    const q = val - min;
    const qualityChar = String.fromCharCode(q + 33);
    const acc = qualityToAccuracy(q);
    
    // Create base character with color (text-based, no boxes)
    const baseSpan = document.createElement('span');
    baseSpan.textContent = base;
    baseSpan.className = `colored-base base-${base}`;
    baseRow.appendChild(baseSpan);
    
    // Create quality character with hover tooltip
    const qualitySpan = document.createElement('span');
    qualitySpan.textContent = qualityChar;
    qualitySpan.className = 'quality-char-text';
    qualitySpan.title = `Quality: ${q}, Accuracy: ${acc}%`;
    qualitySpan.setAttribute('data-accuracy', acc);
    qualitySpan.setAttribute('data-quality', q);
    qualityRow.appendChild(qualitySpan);
    
    // Create quality box (reusing Mohammed's liked colored boxes concept)
    const qualityBox = document.createElement('span');
    qualityBox.textContent = ' '; // Empty space to create a box
    qualityBox.className = `quality-box quality-${qualityColor(q)}`;
    qualityBox.title = `Quality: ${q}, Accuracy: ${acc}%`;
    qualityBox.setAttribute('data-accuracy', acc);
    qualityBox.setAttribute('data-quality', q);
    qualityBoxRow.appendChild(qualityBox);
  }
  
  container.appendChild(baseRow);
  container.appendChild(qualityRow);
  container.appendChild(qualityBoxRow);
  
  output.appendChild(container);
}
