import React from 'react';

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

const FlightTicket: React.FC<FlightTicketProps> = ({
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
}) => {
  return (
    <div id="ticket" className="max-w-md mx-auto bg-white shadow-2xl rounded-xl p-6 mt-8 mb-8 border border-gray-200 print:shadow-none print:border print:rounded-none print:p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-bold text-[#4f1032]">{airlineName}</div>
          <div className="text-xs text-gray-500">Flight No: {flightNumber}</div>
        </div>
        <img src={airlineLogo} alt="Airline Logo" className="h-12 w-12 object-contain" />
      </div>
      <div className="border-t border-b py-4 mb-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Passenger</span>
          <span className="text-gray-900">{passengerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Class</span>
          <span className="text-gray-900">{passengerclass}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Trip</span>
          <span className="text-gray-900">{trip}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Tour Type</span>
          <span className="text-gray-900">{tourtype}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500">From</div>
          <div className="font-bold text-gray-900">{departure}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">To</div>
          <div className="font-bold text-gray-900">{arrival}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Date</div>
          <div className="font-bold text-gray-900">{date}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Time</div>
          <div className="font-bold text-gray-900">{time}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xs text-gray-500">Tracking No</div>
          <div className="font-mono text-sm text-[#4f1032]">{trackingNumber}</div>
        </div>
        <div className="bg-[#4f1032] text-white px-3 py-1 rounded-full text-xs font-semibold">CONFIRMED</div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-6 border-t pt-4">
        Please present this ticket at check-in
      </div>
    </div>
  );
};

export default FlightTicket; 