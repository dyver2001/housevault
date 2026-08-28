import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Share2,
  Copy,
  Check,
  PlusSquare,
  MoreVertical,
  QrCode,
  Sparkles,
  Download
} from 'lucide-react';

interface InstallPhoneModalProps {
  onClose: () => void;
}

export const InstallPhoneModal: React.FC<InstallPhoneModalProps> = ({ onClose }) => {
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      const userAgent = navigator.userAgent || '';
      if (/android/i.test(userAgent)) {
        setDeviceType('android');
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        setDeviceType('ios');
      }
    }
  }, []);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl || 'https://housevault.app'
  )}&bgcolor=28-25-23&color=255-255-255&margin=10`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Add HouseVault to Your Phone
              </h2>
              <p className="text-xs text-stone-400">
                Install as a full-screen app on iPhone & Android with zero app store hassle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Scan / Share Bar */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-stone-900 p-2 rounded-xl border border-stone-700 shrink-0">
            <img
              src={qrCodeUrl}
              alt="Scan QR code on your phone"
              className="w-24 h-24 rounded-lg object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-semibold text-stone-300">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Scan with your Phone Camera</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Point your phone camera at the QR code to open this app instantly on your mobile browser.
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-650 text-white text-xs font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied! Send via WhatsApp / Message</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy App Link to Share with Spouse</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => setDeviceType('ios')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
              deviceType === 'ios'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span> iPhone (iOS Safari)</span>
          </button>
          <button
            onClick={() => setDeviceType('android')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
              deviceType === 'android'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🤖 Android (Chrome)</span>
          </button>
        </div>

        {/* Instructions Content */}
        {deviceType === 'ios' ? (
          <div className="space-y-3 bg-stone-950/40 p-4 rounded-2xl border border-stone-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              iPhone 4-Step Setup Guide
            </h3>

            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Open in Safari</p>
                  <p className="text-[11px] text-stone-400">
                    Open this app link in <strong>Apple Safari</strong> on your iPhone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1">
                    Tap the Share Button <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Tap the square icon with an arrow pointing up located at the bottom toolbar of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1">
                    Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-stone-300 inline" />
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Scroll down the sharing sheet menu and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-semibold text-white">Tap "Add" in Top-Right</p>
                  <p className="text-[11px] text-stone-400">
                    Confirm by tapping <strong>Add</strong>. HouseVault is now on your home screen with no browser bars!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-stone-950/40 p-4 rounded-2xl border border-stone-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Android 3-Step Setup Guide
            </h3>

            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Open in Google Chrome</p>
                  <p className="text-[11px] text-stone-400">
                    Open this app link in <strong>Google Chrome</strong> or Samsung Internet.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1">
                    Tap the 3-Dots Menu <MoreVertical className="w-3.5 h-3.5 text-stone-300 inline" />
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Tap the three vertical dots <strong>(⋮)</strong> in the top right corner of Chrome.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1">
                    Tap "Install app" or "Add to Home screen"
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Tap <strong>"Install app"</strong> (or "Add to Home screen") and confirm. The app icon will appear in your launcher!
                  </p>
                </div>
              </div>
            </div>

            {/* Direct APK Download Card */}
            <div className="pt-2">
              <a
                href="/HouseVault.apk"
                download="HouseVault.apk"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Standalone Android APK (22 MB)</span>
              </a>
            </div>
          </div>
        )}

        {/* Benefits Note */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong>Pro Tip:</strong> When installed on your home screen, HouseVault opens instantly in standalone full-screen mode, keeps your budgets and freelance pipeline synced locally, and gives you one-tap access whenever you get paid.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition"
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
};
