const form = document.getElementById('donationForm');
const blockList = document.getElementById('blockList');
const status = document.getElementById('status');

// Obtener historial de bloques
async function loadBlockchain() {
  const res = await fetch('http://localhost:3000/blockchain');
  const data = await res.json();

  blockList.innerHTML = '';
  data.forEach(block => {
    const row = document.createElement('tr');
    const { index, timestamp, data } = block;

    row.innerHTML = `
      <td>${index}</td>
      <td>${new Date(parseInt(timestamp)).toLocaleString()}</td>
      <td>${data.donor || '-'}</td>
      <td>${data.receiver || '-'}</td>
      <td>${data.type || '-'}</td>
      <td>${data.quantity || '-'}</td>
    `;
    blockList.appendChild(row);
  });
}

// Enviar nueva donación
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const donor = document.getElementById('donor').value;
  const receiver = document.getElementById('receiver').value;
  const type = document.getElementById('type').value;
  const quantity = document.getElementById('quantity').value;

  const res = await fetch('http://localhost:3000/donation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ donor, receiver, type, quantity })
  });

  const result = await res.json();
  status.textContent = result.message || 'Error';
  form.reset();
  loadBlockchain();
});

// Cargar historial al iniciar
loadBlockchain();
