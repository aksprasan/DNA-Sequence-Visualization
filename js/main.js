function buildMapTable(r) {
  const table = new Array(256).fill('N');

  for (let i = r.Amin; i <= r.Amax; i++) table[i] = 'A';
  for (let i = r.Cmin; i <= r.Cmax; i++) table[i] = 'C';
  for (let i = r.Gmin; i <= r.Gmax; i++) table[i] = 'G';
  for (let i = r.Tmin; i <= r.Tmax; i++) table[i] = 'T';

  return table;
}

function getCellColor(val) {
  return `rgb(${val}, ${160 - val * 0.4}, ${255 - val})`;
}

function getTextColor(val) {
  return val > 140 ? '#000' : '#fff';
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
  const raw = lines[1].trim();

  if (raw.length === 0 || raw.length % 3 !== 0) {
    alert("Second line length must be divisible by 3.");
    return;
  }

  const ranges = {
    Amin: Number(document.getElementById('Amin').value),
    Amax: Number(document.getElementById('Amax').value),
    Cmin: Number(document.getElementById('Cmin').value),
    Cmax: Number(document.getElementById('Cmax').value),
    Gmin: Number(document.getElementById('Gmin').value),
    Gmax: Number(document.getElementById('Gmax').value),
    Tmin: Number(document.getElementById('Tmin').value),
    Tmax: Number(document.getElementById('Tmax').value)
  };

  const mapTable = buildMapTable(ranges);

  const values = [];
  for (let i = 0; i < raw.length; i += 3) {
    const v = parseInt(raw.slice(i, i + 3), 10);
    if (isNaN(v) || v < 0 || v > 255) {
      alert("Invalid 8-bit value detected.");
      return;
    }
    values.push(v);
  }

  let baseLine = '';
  let qualityLine = '';

  for (const val of values) {
    const base = mapTable[val];
    baseLine += base;

    let min;
    if (base === 'A') min = ranges.Amin;
    else if (base === 'C') min = ranges.Cmin;
    else if (base === 'G') min = ranges.Gmin;
    else if (base === 'T') min = ranges.Tmin;
    else min = 0;

    const quality = val - min;
    qualityLine += String.fromCharCode(quality + 33);
  }

  // FASTQ-like text output
  const textBlock = document.createElement('pre');
  textBlock.textContent =
    header + '\n' +
    baseLine + '\n' +
    qualityLine;

  // Existing visualization table
  const table = document.createElement('table');
  const row = document.createElement('tr');

  for (const val of values) {
    const cell = document.createElement('td');
    cell.style.backgroundColor = getCellColor(val);
    cell.style.color = getTextColor(val);
    cell.textContent = mapTable[val];
    row.appendChild(cell);
  }

  table.appendChild(row);

  output.innerHTML = '';
  output.appendChild(textBlock);
  output.appendChild(table);
}
