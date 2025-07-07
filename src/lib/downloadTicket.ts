export async function downloadTicket(ticketRef?: React.RefObject<HTMLDivElement>) {
  const ticket = ticketRef?.current || document.getElementById('ticket');
  if (!ticket) {
    alert('Ticket element not found!');
    return;
  }
  // Dynamically import html2pdf.js only on the client
  const html2pdf = (await import('html2pdf.js')).default;
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'flight-ticket.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(ticket)
      .save();
  }, 200);
} 