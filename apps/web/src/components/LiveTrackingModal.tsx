'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Navigation,
  ShieldCheck,
  Clock,
  MapPin,
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface LiveTrackingModalProps {
  booking: any;
  onClose: () => void;
  onStatusUpdate?: (newStatus: string) => void;
}

// Waypoints along Arniko Highway from Koteshwor towards Lokanthali, Bhaktapur
const ROUTE_WAYPOINTS = [
  { lat: 27.6788, lng: 85.3475, name: 'Koteshwor Chowk' },
  { lat: 27.6775, lng: 85.3512, name: 'Jadibuti Bridge' },
  { lat: 27.6748, lng: 85.355, name: 'Lokanthali Foothill' },
  { lat: 27.6722, lng: 85.3578, name: 'Lokanthali Chowk' },
  { lat: 27.671, lng: 85.3587, name: 'Client Location (Destination)' },
];

export default function LiveTrackingModal({
  booking,
  onClose,
  onStatusUpdate,
}: LiveTrackingModalProps) {
  const [waypointIndex, setWaypointIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'accepted');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Client target coordinates (Lokanthali, Bhaktapur)
  const clientCoords = {
    lat: booking?.jobLocation?.coordinates?.[1] || 27.671,
    lng: booking?.jobLocation?.coordinates?.[0] || 85.3587,
    address: booking?.address?.formattedAddress || 'Lokanthali Chowk, Madhyapur Thimi, Bhaktapur',
    city: booking?.address?.city || 'Bhaktapur',
  };

  // Provider current live coordinates
  const providerCoords = ROUTE_WAYPOINTS[waypointIndex];

  // Dynamic telemetry calculations
  const totalWaypoints = ROUTE_WAYPOINTS.length - 1;
  const progressRatio = waypointIndex / totalWaypoints;
  const remainingDistanceKm = Math.max(0, Math.round((1.8 * (1 - progressRatio)) * 10) / 10);
  const remainingEtaMinutes = Math.max(1, Math.ceil(remainingDistanceKm * 3.5));

  // Auto-advance simulation
  useEffect(() => {
    if (isSimulating) {
      timerRef.current = setInterval(() => {
        setWaypointIndex((prev) => {
          if (prev < ROUTE_WAYPOINTS.length - 1) {
            const nextIdx = prev + 1;
            if (nextIdx === 1 && currentStatus === 'accepted') {
              setCurrentStatus('en_route');
              onStatusUpdate?.('en_route');
            }
            if (nextIdx === ROUTE_WAYPOINTS.length - 1) {
              setCurrentStatus('in_progress');
              onStatusUpdate?.('in_progress');
              setIsSimulating(false);
            }
            return nextIdx;
          } else {
            setIsSimulating(false);
            return prev;
          }
        });
      }, 2500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, currentStatus, onStatusUpdate]);

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setWaypointIndex(0);
    setCurrentStatus('accepted');
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${providerCoords.lat},${providerCoords.lng}&destination=${clientCoords.lat},${clientCoords.lng}`;

  const providerName =
    booking?.providerId?.name || booking?.providerId?.businessName || 'Ramesh Sharma (रमेश शर्मा)';
  const providerPhone = booking?.providerId?.phoneNumber || '9841000000';
  const serviceName = booking?.subCategoryId?.name || 'Plumbing Service';

  // Map SVG coordinates normalization (scaling lat/lng into 600x320 SVG space)
  const minLng = 85.345;
  const maxLng = 85.361;
  const minLat = 27.669;
  const maxLat = 27.681;

  const toSvgX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 560 + 20;
  const toSvgY = (lat: number) => 300 - ((lat - minLat) / (maxLat - minLat)) * 260;

  const clientSvg = { x: toSvgX(clientCoords.lng), y: toSvgY(clientCoords.lat) };
  const providerSvg = { x: toSvgX(providerCoords.lng), y: toSvgY(providerCoords.lat) };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#331e6a] border border-[#5c38ab]/40 flex items-center justify-center text-[#f59e0b] shadow-lg shadow-[#331e6a]/40">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ● प्रत्यक्ष ट्र्याकिङ (LIVE)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {booking?.bookingCode || 'SWX-2026-10492'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                सेवा प्रदायक प्रत्यक्ष लोकेसन ट्र्याकर
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Stepper Banner */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-xl mx-auto text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>अनुरोध प्राप्त</span>
            </div>
            <div className="h-0.5 w-6 sm:w-10 bg-emerald-400"></div>

            {/* Step 2 */}
            <div
              className={`flex items-center gap-1.5 font-bold ${
                currentStatus !== 'requested' ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>प्रदायकले स्वीकार गर्यो</span>
            </div>
            <div
              className={`h-0.5 w-6 sm:w-10 ${
                currentStatus === 'en_route' || currentStatus === 'in_progress'
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
            ></div>

            {/* Step 3 */}
            <div
              className={`flex items-center gap-1.5 font-bold ${
                currentStatus === 'en_route'
                  ? 'text-red-600 animate-pulse'
                  : currentStatus === 'in_progress'
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>बाटोमा (En Route)</span>
            </div>
            <div
              className={`h-0.5 w-6 sm:w-10 ${
                currentStatus === 'in_progress' ? 'bg-emerald-400' : 'bg-slate-200'
              }`}
            ></div>

            {/* Step 4 */}
            <div
              className={`flex items-center gap-1.5 font-bold ${
                currentStatus === 'in_progress' ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>स्थानमा पुग्नुभयो</span>
            </div>
          </div>
        </div>

        {/* Interactive Map Visual */}
        <div className="relative bg-slate-900 overflow-hidden flex-1 min-h-[280px] sm:min-h-[340px]">
          {/* Map Grid / Roads Backdrop */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Real Kathmandu Valley highway map representation */}
          <svg className="w-full h-full min-h-[280px]" viewBox="0 0 600 320">
            {/* Arniko Highway Main Spine */}
            <path
              d="M 20 80 Q 150 110 240 130 T 400 190 T 560 250"
              fill="none"
              stroke="#334155"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 20 80 Q 150 110 240 130 T 400 190 T 560 250"
              fill="none"
              stroke="#475569"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Highway Center Dotted Line */}
            <path
              d="M 20 80 Q 150 110 240 130 T 400 190 T 560 250"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Side Roads to Lokanthali & Koteshwor */}
            <path d="M 240 130 L 240 260" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M 400 190 L 400 80" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M 400 190 L 520 280" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

            {/* Landmark text labels */}
            <text x="30" y="60" fill="#94a3b8" fontSize="11" fontWeight="bold">
              कोटेश्वर चोक (Koteshwor)
            </text>
            <text x="210" y="110" fill="#94a3b8" fontSize="10" fontWeight="bold">
              जडीबुटी पुल (Jadibuti Bridge)
            </text>
            <text x="380" y="225" fill="#cbd5e1" fontSize="11" fontWeight="bold">
              लोकन्थली (Lokanthali Chowk)
            </text>
            <text x="430" y="305" fill="#f87171" fontSize="11" fontWeight="bold">
              तपाईंको ठेगाना (Destination)
            </text>

            {/* Dotted Route Polyline from current Provider to Client */}
            <line
              x1={providerSvg.x}
              y1={providerSvg.y}
              x2={clientSvg.x}
              y2={clientSvg.y}
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Client Marker */}
            <g transform={`translate(${clientSvg.x}, ${clientSvg.y})`}>
              {/* Radar pulse ring */}
              <circle r="22" fill="#ef4444" opacity="0.25">
                <animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
              {/* House/Pin Icon */}
              <circle r="5" fill="#ffffff" />
            </g>

            {/* Provider Live Moving Marker */}
            <g
              transform={`translate(${providerSvg.x}, ${providerSvg.y})`}
              className="transition-all duration-1000 ease-in-out"
            >
              {/* Green active radar ring */}
              <circle r="26" fill="#22c55e" opacity="0.3">
                <animate attributeName="r" values="14;34;14" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.05;0.5" dur="1.6s" repeatCount="indefinite" />
              </circle>
              {/* Pro vehicle circle */}
              <circle r="16" fill="#16a34a" stroke="#ffffff" strokeWidth="3" />
              <text x="-6" y="5" fill="#ffffff" fontSize="12" fontWeight="bold">
                🛵
              </text>
            </g>
          </svg>

          {/* Floating Live Telemetry HUD */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700 text-white shadow-xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                अनुमानित समय (ETA)
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                {remainingDistanceKm === 0 ? 'आइपुग्नुभयो (Arrived!)' : `~${remainingEtaMinutes} मिनेट बाँकी`}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                दूरी: <strong className="text-white">{remainingDistanceKm} कि.मि.</strong> ({providerCoords.name})
              </div>
            </div>
          </div>

          {/* Live Simulation Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'गति रोक्नुहोस् (Pause)' : 'प्रत्यक्ष गति डेमो (Simulate)'}</span>
            </button>

            <button
              onClick={handleResetSimulation}
              title="Reset Simulation"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assigned Provider Profile & One-Click Contact */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black text-lg border border-red-200">
                {providerName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {providerName}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>नागरिकता प्रमाणित</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {serviceName} • ४.९ ★ (४८ सम्पन्न सेवाहरू)
                </p>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${providerPhone}`}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#331e6a] hover:bg-[#25154f] text-white text-xs font-bold shadow-md shadow-[#331e6a]/25 flex items-center justify-center gap-2 transition-all border border-[#5c38ab]/30"
              >
                <Phone className="w-4 h-4 text-[#f59e0b]" />
                <span>फोन गर्नुहोस्</span>
              </a>

              <a
                href={`sms:${providerPhone}`}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>सन्देश</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Google Maps</span>
              </a>
            </div>
          </div>

          {/* Location Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-700 block">ग्राहकको गन्तव्य (Your Location):</span>
                <p className="text-slate-600 font-medium">{clientCoords.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Compass className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-700 block">प्रदायकको हालको विन्दु (Live Position):</span>
                <p className="text-slate-600 font-medium">
                  {providerCoords.name} • {providerCoords.lat.toFixed(4)}, {providerCoords.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

