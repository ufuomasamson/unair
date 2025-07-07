import html2pdf from 'html2pdf.js';

export function downloadTicket() {
  const ticket = document.getElementById('ticket');
  if (!ticket) {
    alert('Ticket element not found!');
    return;
  }
  console.log('Ticket element found:', ticket);
  html2pdf()
    .set({
      margin: 0.5,
      filename: 'flight-ticket.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    })
    .from(ticket)
    .save();
} 