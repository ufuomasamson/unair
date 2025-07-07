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
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto', 
      backgroundColor: '#ffffff', 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
      borderRadius: '1rem', 
      padding: '2rem',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header with Airline Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '2px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={airlineLogo} alt="Airline Logo" style={{ height: '4rem', width: '4rem', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4f1032', marginBottom: '0.25rem' }}>{airlineName}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Flight No: {flightNumber}</div>
          </div>
        </div>
        <div style={{ 
          backgroundColor: '#4f1032', 
          color: '#ffffff', 
          padding: '0.5rem 1rem', 
          borderRadius: '9999px', 
          fontSize: '0.875rem', 
          fontWeight: '600' 
        }}>CONFIRMED</div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left Column - Passenger Info */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4f1032', marginBottom: '1rem' }}>Passenger Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Passenger</span>
                <span style={{ color: '#111827', fontWeight: '500' }}>{passengerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Class</span>
                <span style={{ color: '#111827', fontWeight: '500' }}>{passengerclass}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Trip</span>
                <span style={{ color: '#111827', fontWeight: '500' }}>{trip}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Tour Type</span>
                <span style={{ color: '#111827', fontWeight: '500' }}>{tourtype}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4f1032', marginBottom: '1rem' }}>Tracking</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#4f1032', fontWeight: '600' }}>{trackingNumber}</div>
          </div>
        </div>

        {/* Center Column - Route Info */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4f1032', marginBottom: '1rem' }}>Route Information</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: '1', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>From</div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '1rem' }}>{departure}</div>
            </div>
            <div style={{ fontSize: '1.5rem', color: '#4f1032', fontWeight: 'bold' }}>→</div>
            <div style={{ flex: '1', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>To</div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '1rem' }}>{arrival}</div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Date</div>
              <div style={{ fontWeight: 'bold', color: '#111827' }}>{date}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Time</div>
              <div style={{ fontWeight: 'bold', color: '#111827' }}>{time}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '0.875rem', 
        color: '#6b7280', 
        marginTop: '1.5rem', 
        borderTop: '1px solid #e5e7eb', 
        paddingTop: '1rem',
        fontStyle: 'italic'
      }}>
        Please present this ticket at check-in
      </div>
    </div>
  );
});

export default FlightTicket; 