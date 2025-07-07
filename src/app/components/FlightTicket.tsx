import React, { forwardRef } from 'react';

interface FlightTicketProps {
  passengerName: string;
  flightNumber: string;
  airlineName: string;
  airlineLogo: string; // URL
  departure: string;
  arrival: string;
  date: string;
  time: string;
  trackingNumber: string;
  trip: string;
  tourtype: string;
  passengerclass: string;
}

const FlightTicket = forwardRef<HTMLDivElement, FlightTicketProps>(({
  passengerName,
  flightNumber,
  airlineName,
  airlineLogo,
  departure,
  arrival,
  date,
  time,
  trackingNumber,
  trip,
  tourtype,
  passengerclass,
}, ref) => {
  return (
    <div ref={ref} id="ticket" style={{ 
      maxWidth: '28rem', 
      margin: '2rem auto', 
      backgroundColor: '#ffffff', 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
      borderRadius: '0.75rem', 
      padding: '1.5rem', 
      border: '1px solid #e5e7eb' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4f1032' }}>{airlineName}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Flight No: {flightNumber}</div>
        </div>
        <img src={airlineLogo} alt="Airline Logo" style={{ height: '3rem', width: '3rem', objectFit: 'contain' }} />
      </div>
      <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '1rem 0', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Passenger</span>
            <span style={{ color: '#111827' }}>{passengerName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Class</span>
            <span style={{ color: '#111827' }}>{passengerclass}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Trip</span>
            <span style={{ color: '#111827' }}>{trip}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Tour Type</span>
            <span style={{ color: '#111827' }}>{tourtype}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>From</div>
          <div style={{ fontWeight: 'bold', color: '#111827' }}>{departure}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>To</div>
          <div style={{ fontWeight: 'bold', color: '#111827' }}>{arrival}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Date</div>
          <div style={{ fontWeight: 'bold', color: '#111827' }}>{date}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Time</div>
          <div style={{ fontWeight: 'bold', color: '#111827' }}>{time}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tracking No</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#4f1032' }}>{trackingNumber}</div>
        </div>
        <div style={{ 
          backgroundColor: '#4f1032', 
          color: '#ffffff', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '9999px', 
          fontSize: '0.75rem', 
          fontWeight: '600' 
        }}>CONFIRMED</div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        Please present this ticket at check-in
      </div>
    </div>
  );
});

export default FlightTicket; 