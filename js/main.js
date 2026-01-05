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
}
