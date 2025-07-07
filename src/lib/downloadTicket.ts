export async function downloadTicket(ticketRef?: React.RefObject<HTMLDivElement | null>) {
  const ticket = ticketRef?.current || document.getElementById('ticket');
  console.log('downloadTicket: ticketRef', ticketRef);
  console.log('downloadTicket: ticket element', ticket);
  if (!ticket) {
    alert('Ticket element not found!');
    return;
  }
  // Print the outer HTML for debugging
  console.log('downloadTicket: ticket outerHTML', ticket.outerHTML);
  // Dynamically import html2pdf.js only on the client
  const html2pdf = (await import('html2pdf.js')).default;
  setTimeout(() => {
    try {
      console.log('downloadTicket: calling html2pdf');
      html2pdf()
        .set({
          margin: 0.5,
          filename: 'flight-ticket.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(ticket)
        .save();
    } catch (err) {
      console.error('downloadTicket: html2pdf error', err);
    }
  }, 200);
} 