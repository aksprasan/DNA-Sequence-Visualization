const ranges = {
  A: [3, 65],
  C: [66, 128],
  G: [129, 191],
  T: [192, 253]
};

function buildMapTable() {
  const table = new Array(256).fill('N');
  for (let i = ranges.A[0]; i <= ranges.A[1]; i++) table[i] = 'A';
  for (let i = ranges.C[0]; i <= ranges.C[1]; i++) table[i] = 'C';
  for (let i = ranges.G[0]; i <= ranges.G[1]; i++) table[i] = 'G';
  for (let i = ranges.T[0]; i <= ranges.T[1]; i++) table[i] = 'T';
  return table;
}

const map_table = buildMapTable();

function getColor(val, useColor) {
  if (useColor) {
    return `rgb(${val}, ${255 - val}, ${Math.floor(val / 2)})`;
  }
  return `rgb(${val}, ${val}, ${val})`;
}

function generateImage() {
  const rawInput = document.getElementById('sequenceInput').value.trim();
  const useColor = document.getElementById('colorMode').checked;
  const outputDiv = document.getElementById('output');

  if (!rawInput) {
    alert("Please enter 8-bit values.");
    return;
  }

  const values = rawInput
    .split(/[\s,]+/)
    .map(v => Number(v))
    .filter(v => !isNaN(v) && v >= 0 && v <= 255);

  if (values.length === 0) {
    alert("No valid 8-bit values found.");
    return;
  }

  const table = document.createElement('table');
  const row = document.createElement('tr');

  for (let val of values) {
    const cell = document.createElement('td');
    cell.style.backgroundColor = getColor(val, useColor);
    cell.textContent = map_table[val];
    row.appendChild(cell);
  }

  table.appendChild(row);
  outputDiv.innerHTML = '';
  outputDiv.appendChild(table);
}
