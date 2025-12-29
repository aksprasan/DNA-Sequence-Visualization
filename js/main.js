const nucleotideMap = {
      'A': 64,
      'C': 128,
      'G': 192,
      'T': 255,
      'N': 0
    };

    function generateImage() {
      const input = document.getElementById('sequenceInput').value.toUpperCase().trim();
      const useColor = document.getElementById('colorMode').checked;
      const outputDiv = document.getElementById('output');

      if (!input) {
        alert("Please enter a DNA sequence.");
        return;
      }

      let table = document.createElement('table');
      let row = document.createElement('tr');

      for (let char of input) {
        let value = nucleotideMap[char] ?? 0;

        let color;
        if (useColor) {
          color = `rgb(${value}, ${255 - value}, ${value / 2})`;
        } else {
          color = `rgb(${value}, ${value}, ${value})`;
        }

        let cell = document.createElement('td');
        cell.style.backgroundColor = color;

        if (value === 0) {
          cell.textContent = 'N';
        } else if (value <= 63) {
          cell.textContent = 'A';
        } else if (value <= 127) {
          cell.textContent = 'C';
        } else if (value <= 191) {
          cell.textContent = 'G';
        } else {
          cell.textContent = 'T';
        }

        row.appendChild(cell);
      }

      table.appendChild(row);
      outputDiv.innerHTML = '';
      outputDiv.appendChild(table);
    }