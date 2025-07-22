
"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import FlightTicket from "../components/FlightTicket";
import { downloadTicket } from "@/lib/downloadTicket";
import { useCurrencyStore } from "@/lib/currencyManager";
import { useSearchParams } from "next/navigation";

export default function TrackFlightPage() {
  // Payment modal state and handlers must be inside the component
  const [wallets, setWallets] = useState<any[]>([]);
  const [showWalletsModal, setShowWalletsModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [proofFile, setProofFile] = useState<File|null>(null);
  const [submittingProof, setSubmittingProof] = useState(false);

  // Fetch wallets only when needed
  const handleOpenWalletsModal = async () => {
    setShowWalletsModal(true);
    if (wallets.length === 0) {
      try {
        const res = await fetch("/api/crypto-wallets");
        const data = await res.json();
        setWallets(data);
      } catch {}
    }
  };

  const handleSelectWallet = (wallet: any) => {
    setSelectedWallet(wallet);
    setShowWalletsModal(false);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedWallet(null);
    setPaymentAmount("");
    setProofFile(null);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  // Submit payment proof
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[DEBUG] handleSubmitProof booking:', booking);
    if (!selectedWallet || !paymentAmount || !proofFile || !booking || !booking.id) {
      setError("Booking not found or invalid. Please book the flight first.");
      return;
    }
    setSubmittingProof(true);
    // Get user info from cookie
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
    let userObj = null;
    if (userCookie) {
      userObj = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    }
    
    if (!userObj || !userObj.id) {
      setError("User information not found. Please log in again.");
      setSubmittingProof(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("booking_id", booking.id);
    formData.append("amount", paymentAmount);
    formData.append("payment_proof", proofFile); // Renamed from proof to payment_proof
    formData.append("payment_method", "crypto"); // Add payment method
    formData.append("currency", "USD"); // Add default currency
    formData.append("user_id", userObj.id); // Add user ID
    formData.append("user_email", userObj.email || ""); // Add user email if available
    
    console.log('[DEBUG] Submitting payment proof with data:', {
      booking_id: booking.id,
      amount: paymentAmount,
      payment_method: "crypto",
      user_id: userObj.id
    });
    
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        handleClosePaymentModal();
        setShowWalletsModal(false);
        setSuccess("Payment proof submitted successfully!");
        // Always re-fetch booking from backend to get latest status
        // Use current flight.id and user id from cookie
        try {
          const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
          let userObj = null;
          if (userCookie) {
            userObj = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          }
          if (userObj && flight && flight.id) {
            const bookingRes = await fetch(`/api/bookings?user_id=${userObj.id}&flight_id=${flight.id}`);
            let bookingData = await bookingRes.json();
            let bookingObj = null;
            if (Array.isArray(bookingData)) {
              bookingObj = bookingData.length > 0 ? bookingData[0] : null;
            } else if (bookingData && typeof bookingData === 'object') {
              bookingObj = bookingData;
            }
            console.log('[DEBUG] After proof upload, fetched booking:', bookingObj);
            if (bookingRes.ok && bookingObj) {
              // Update the booking status to "awaiting_approval" after payment submission
              if (bookingObj.status !== 'approved') {
                const updateBookingRes = await fetch(`/api/bookings/${bookingObj.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'awaiting_approval' })
                });
                if (updateBookingRes.ok) {
                  bookingObj.status = 'awaiting_approval';
                }
              }
              setBooking(bookingObj);
              console.log('[DEBUG] After proof upload, passenger_name:', bookingObj.passenger_name);
            }
          }
        } catch (err) {
          console.log('[DEBUG] Error fetching booking after proof upload:', err);
        }
      } else {
        setError("Failed to submit proof. Try again.");
      }
    } catch (err) {
      setError("Failed to submit proof. Try again.");
      console.log('[DEBUG] Error in handleSubmitProof:', err);
    }
    setSubmittingProof(false);
  };
  const [trackingNumber, setTrackingNumber] = useState("");
  const [flight, setFlight] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const searchParams = useSearchParams();
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  // DEBUG LOGGING
  useEffect(() => {
    if (flight) {
      // Log the full flight object and key fields
      console.log('[DEBUG] Flight object:', flight);
      console.log('[DEBUG] Airline:', flight.airline);
      console.log('[DEBUG] Departure:', flight.departure);
      console.log('[DEBUG] Arrival:', flight.arrival);
      console.log('[DEBUG] Tracking Number:', flight.tracking_number);
      console.log('[DEBUG] Raw Price:', flight.price);
      try {
        const formatted = formatPrice(flight.price);
        console.log('[DEBUG] Formatted Price:', formatted);
      } catch (e) {
        console.log('[DEBUG] formatPrice error:', e);
      }
    }
    if (booking) {
      // Log the full booking object and key fields
      console.log('[DEBUG] Booking object:', booking);
      console.log('[DEBUG] Passenger Name:', booking.passenger_name);
      console.log('[DEBUG] Paid:', booking.paid);
    }
  }, [flight, booking]);

  useEffect(() => {
    // Optionally auto-track if tracking number is in query params
    const trackNum = searchParams.get("tracking_number");
    if (trackNum) {
      handleTrackFlight(trackNum);
    }
  }, [searchParams]);

  const handleTrackFlight = async (trackNumber: string) => {
    setError("");
    setFlight(null);
    setBooking(null);
    setLoading(true);
    try {
      console.log('Tracking flight with number:', trackNumber);
      // Fetch flight info from API
      const response = await fetch(`/api/flights?tracking_number=${trackNumber}`);
      const flightData = await response.json();
      console.log('Flight data response:', flightData);
      
      if (!response.ok || !flightData) {
        setError("Flight not found with this tracking number");
        setLoading(false);
        return;
      }
      // Map nested fields to UI-compatible format
      const mappedFlight = {
        ...flightData,
        airline: flightData.airline ? {
          name: flightData.airline.name,
          logo_url: flightData.airline.logo_url
        } : undefined,
        departure: flightData.departure_location ? {
          city: flightData.departure_location.city,
          country: flightData.departure_location.country
        } : undefined,
        arrival: flightData.arrival_location ? {
          city: flightData.arrival_location.city,
          country: flightData.arrival_location.country
        } : undefined
      };
      setFlight(mappedFlight);
      // Fetch booking info for logged-in user (from cookie)
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (userCookie) {
        try {
          const userObj = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          const bookingRes = await fetch(`/api/bookings?user_id=${userObj.id}&flight_id=${flightData.id}`);
          let bookingData = await bookingRes.json();
          // Always set booking to an object or null, never an array
          let bookingObj = null;
          if (Array.isArray(bookingData)) {
            bookingObj = bookingData.length > 0 ? bookingData[0] : null;
          } else if (bookingData && typeof bookingData === 'object') {
            bookingObj = bookingData;
          }
          // Only set booking if it matches the current flight
          if (bookingRes.ok && bookingObj && bookingObj.flight_id === flightData.id) {
            setBooking(bookingObj);
            console.log('[DEBUG] setBooking (object):', bookingObj);
          } else {
            setBooking(null);
            console.log('[DEBUG] setBooking: null (no booking found for this flight)');
          }
        } catch (err) {
          setBooking(null);
          console.log('[DEBUG] setBooking: null (error)', err);
        }
      } else {
        setBooking(null);
        console.log('[DEBUG] setBooking: null (no user cookie)');
      }
    } catch (err) {
      setError("Flight not found with this tracking number");
    }
    setLoading(false);
  };

    const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTrackFlight(trackingNumber);
  };

  // Payment and proof upload logic will be handled via UI and admin approval

  const handleBookFlight = async () => {
    if (!flight) return;
    // Get user from cookie
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
    if (!userCookie) {
      setError("You must be logged in to book a flight.");
      return;
    }
    let userObj;
    try {
      userObj = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    } catch {
      setError("Invalid user session. Please log in again.");
      return;
    }
    // Use passenger name from the tracked flight if available, otherwise fallback to user info
    let passengerName = flight.passenger_name || userObj.full_name || userObj.name || userObj.email || "N/A";
    console.log('[DEBUG] handleBookFlight userObj:', userObj);
    console.log('[DEBUG] handleBookFlight passengerName:', passengerName);
    // Check if booking already exists
    const bookingRes = await fetch(`/api/bookings?user_id=${userObj.id}&flight_id=${flight.id}`);
    let existingBooking = await bookingRes.json();
    let bookingObj = null;
    if (Array.isArray(existingBooking)) {
      bookingObj = existingBooking.length > 0 ? existingBooking[0] : null;
    } else if (existingBooking && typeof existingBooking === 'object') {
      bookingObj = existingBooking;
    }
    // Only set booking if it matches the current flight
    if (bookingRes.ok && bookingObj && bookingObj.flight_id === flight.id) {
      setBooking(bookingObj);
      setError("");
      return;
    }
    setBooking(null); // No valid booking for this flight
    // Use ISO format for Supabase timestamps
    const createdAt = new Date().toISOString();
    // Create booking
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userObj.id,
        flight_id: flight.id,
        passenger_name: passengerName,
        paid: false,
        created_at: createdAt
      })
    });
    if (!res.ok) {
      setError("Failed to book flight.");
    } else {
      let bookingData = await res.json();
      let newBookingObj = null;
      if (Array.isArray(bookingData)) {
        newBookingObj = bookingData.length > 0 ? bookingData[0] : null;
      } else if (bookingData && typeof bookingData === 'object') {
        newBookingObj = bookingData;
      }
      setBooking(newBookingObj);
      setError("");
    }
  };

  const ticketRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4f1032] to-[#4f1032]/90 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Track Your Flight</h1>
          <p className="text-xl mb-8">Enter your tracking number to view flight details and manage your booking</p>
          
          <form onSubmit={handleTrack} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter Tracking Number"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="flex-1 p-3 rounded text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-[#cd7e0f] text-white px-6 py-3 rounded hover:bg-[#cd7e0f]/90 transition"
                disabled={loading}
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </div>
            {error && <div className="text-red-200 mt-4 font-semibold">{error}</div>}
            {success && <div className="text-green-200 mt-4 font-semibold">{success}</div>}
          </form>
        </div>
      </section>

      {/* Flight Details */}
      {flight && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#4f1032] mb-6">Flight Details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Flight Information */}
                <div className="space-y-6">
                  {/* Airline Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {flight.airline?.logo_url ? (
                      <img src={flight.airline.logo_url} alt={flight.airline.name} className="w-16 h-16 object-contain rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500">Logo</span>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-xl">{flight.airline?.name || "Airline"}</div>
                      <div className="text-gray-600">Flight No: <span className="font-mono">{flight.flight_number}</span></div>
                    </div>
                  </div>
                  
                  {/* Route Information */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg text-[#4f1032] mb-4">Route Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Departure</div>
                          <div className="text-gray-600">{flight.departure?.city}, {flight.departure?.country}</div>
                        </div>
                        <div className="text-2xl text-[#cd7e0f]">→</div>
                        <div className="text-right">
                          <div className="font-semibold">Destination</div>
                          <div className="text-gray-600">{flight.arrival?.city}, {flight.arrival?.country}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date and Time */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg text-[#4f1032] mb-4">Schedule</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold">Date</div>
                        <div className="text-gray-600">{flight.date}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Time</div>
                        <div className="text-gray-600">{flight.time}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="p-4 bg-[#4f1032] text-white rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">${Number(flight.price).toFixed(2)}</div>
                      <div>Total Price</div>
                    </div>
                  </div>
                </div>
                
                {/* Booking Status and Actions */}
                <div className="space-y-6">
                  {/* Passenger Information */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg text-[#4f1032] mb-4">Passenger Information</h3>
                    <div>
                      <div className="font-semibold">Passenger Name</div>
                      <div className="text-gray-600">
                        {(booking && booking.passenger_name) ? booking.passenger_name : (flight.passenger_name || "N/A")}
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Status */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg text-[#4f1032] mb-4">Booking Status</h3>
                    {booking ? (
                      <div>
                        {/* Status indicator */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-3 h-3 rounded-full 
                            ${booking.status === 'approved' && booking.paid ? 'bg-green-500' : 
                              booking.status === 'awaiting_approval' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                          <span className="font-semibold">
                            {booking.status === 'approved' && booking.paid ? 'Approved' :
                              booking.status === 'awaiting_approval' ? 'Awaiting Approval' :
                              'Pending'}
                          </span>
                        </div>
                        {/* Show Download Ticket only if approved and paid */}
                        {booking.status === 'approved' && booking.paid ? (
                          <div className="space-y-3">
                            <div className="text-green-600 font-semibold">✓ Your flight is confirmed and approved!</div>
                            <div className="my-6">
                              <FlightTicket
                                ref={ticketRef}
                                passengerName={booking.passenger_name}
                                flightNumber={flight.flight_number}
                                airlineName={flight.airline?.name || "-"}
                                airlineLogo={flight.airline?.logo_url || "/globe.svg"}
                                departure={flight.departure?.city || "-"}
                                arrival={flight.arrival?.city || "-"}
                                date={flight.date || "-"}
                                time={flight.time || "-"}
                                trackingNumber={flight.tracking_number || booking.id}
                                trip={flight.trip || "-"}
                                tourtype={flight.tour_type || "-"}
                                passengerclass={booking.passenger_class || "Economy"}
                              />
                            </div>
                            <button
                              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-center block"
                              onClick={() => downloadTicket(ticketRef)}
                            >
                              Download Ticket (PDF)
                            </button>
                          </div>
                        ) : booking.status === 'awaiting_approval' ? (
                          <div className="space-y-3">
                            <div className="text-yellow-600 font-semibold">Your payment proof has been submitted. Awaiting admin approval.</div>
                          </div>
                        ) : booking.status === 'approved' ? (
                          <div className="space-y-3">
                            <div className="text-green-600 font-semibold">Payment confirmed! Your booking has been approved.</div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-yellow-600 font-semibold">Payment required to confirm your booking</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-600">
                        <p>No booking found for this flight.</p>
                        <p className="mt-2">Please log in and book this flight to manage your ticket.</p>
                        <button
                          className="mt-4 w-full bg-[#4f1032] text-white py-3 rounded-lg hover:bg-[#cd7e0f] transition"
                          onClick={handleBookFlight}
                        >
                          Book This Flight
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Tracking Information */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-[#4f1032]">Tracking Information</h4>
                    <div className="text-sm text-gray-600">
                      <p>Tracking Number: <span className="font-mono font-semibold">{flight.tracking_number}</span></p>
                      <p className="mt-2">Use this number to track your flight status anytime.</p>
                    </div>
                  </div>

                  {/* Payment Section for Tracked Flights */}
                  {!booking?.paid && (
                    <div className="space-y-4 mt-6">
                      <h4 className="font-bold text-lg text-[#4f1032]">Pay For Flight</h4>
                      <button
                        className="w-full bg-[#4f1032] text-white py-3 rounded-lg hover:bg-[#cd7e0f] transition"
                        onClick={handleOpenWalletsModal}
                      >
                        Pay For Flight
                      </button>
                    </div>
                  )}
      {/* Wallets Modal */}
      <Modal open={showWalletsModal} onClose={() => setShowWalletsModal(false)} title="Select a Crypto Wallet">
        <div className="space-y-4">
          {wallets.length === 0 && <div>Loading wallets...</div>}
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full border rounded p-4 flex flex-col items-start hover:bg-gray-50"
              onClick={() => handleSelectWallet(wallet)}
            >
              <div className="font-bold text-lg">{wallet.name}</div>
              <div className="text-gray-600 text-sm">Network: {wallet.network}</div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal open={showPaymentModal} onClose={handleClosePaymentModal} title="Pay With Crypto">
        {selectedWallet && (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            <div>
              <div className="font-bold">{selectedWallet.name}</div>
              <div className="text-gray-600">Network: {selectedWallet.network}</div>
              <div className="text-gray-600">Address: <span className="font-mono break-all">{selectedWallet.wallet_address}</span></div>
              {selectedWallet.qr_code_url && (
                <img src={selectedWallet.qr_code_url} alt="QR Code" className="w-32 h-32 object-contain my-2" />
              )}
              <div className="text-blue-700 font-semibold mt-2">Send the exact amount to this address and upload your payment proof below.</div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Amount Paid</label>
              <input
                type="number"
                min="0"
                step="any"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Upload Proof of Payment</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleProofFileChange}
                className="w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4f1032] text-white py-2 rounded hover:bg-[#cd7e0f] transition"
              disabled={submittingProof}
            >
              {submittingProof ? "Submitting..." : "Submit Proof"}
            </button>
          </form>
        )}
      </Modal>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}