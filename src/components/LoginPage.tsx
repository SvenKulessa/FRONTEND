import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  User,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe2,
  TrendingUp,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { trackEvent } from '../utils/analytics';

interface LoginPageProps {
  onBackToHome: () => void;
  onNavigateFaq?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onNavigateFaq }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [regError, setRegError] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick FAQ Accordion state for login view
  const [openQuickFaq, setOpenQuickFaq] = useState<number | null>(null);

  const quickFaqs = [
    {
      icon: Globe2,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      q: 'Welche Märkte werden in Echtzeit analysiert?',
      a: 'Capital-AI überwacht kontinuierlich 5 globale Anlageklassen: Kryptowährungen, Aktien, Leitindizes, Forex und Rohstoffe mit synchronisierter Latenz unter 45 Millisekunden.',
    },
    {
      icon: TrendingUp,
      color: 'text-[#44DE88]',
      borderColor: 'border-emerald-500/20',
      q: 'Wie funktioniert das neuronale KI-Scoring?',
      a: 'Unsere Modelle (u.a. Enterprise Scorer und Buffett Value Check) werten fundamentale Bilanzkennzahlen, On-Chain-Bewegungen und Marktstimmung quantitativ aus, um objektive Qualitäts-Scores (0–100) zu ermitteln.',
    },
    {
      icon: Shield,
      color: 'text-[#8D26FF]',
      borderColor: 'border-purple-500/20',
      q: 'Sind meine Daten und mein Zugang sicher?',
      a: 'Vollständige 256-Bit-TLS-Verschlüsselung, ISO-27001 zertifizierte Serverinfrastruktur in der Europäischen Union (Frankfurt am Main) und strikte DSGVO-Konformität schützen Ihre Identität.',
    },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    trackEvent('login_form_submitted', {
      category: 'authentication',
      has_email: Boolean(loginEmail),
    });

    // Simulated secure sign-in verification
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Anmeldung erfolgreich! Sie werden zum Live-Terminal weitergeleitet.');
      trackEvent('login_success', {
        category: 'authentication',
      });
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword.length < 8) {
      setRegError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (!acceptTerms) {
      setRegError('Bitte stimmen Sie den Nutzungsbedingungen und Datenschutzhinweisen zu.');
      return;
    }

    setIsLoading(true);
    trackEvent('register_form_submitted', {
      category: 'authentication',
      has_name: Boolean(regName),
    });

    // Simulated account creation
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Konto erfolgreich erstellt! Willkommen bei Capital-AI.');
      trackEvent('register_success', {
        category: 'authentication',
      });
    }, 900);
  };

  const handleGoogleSSOClick = () => {
    trackEvent('sso_login_click', {
      category: 'authentication',
      label: 'google',
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 pb-16 relative overflow-hidden select-none">
      {/* Background Ambient Cyber Glows (Gold, Emerald, Magenta, Purple) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8D26FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-[#F9BF21]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#44DE88]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-[#FF2E93]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Back Button and Live Security Status */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 pt-2 pb-4">
        <button
          type="button"
          id="login-back-to-home-btn"
          onClick={onBackToHome}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          data-analytics="login-back-home"
          data-ga-category="navigation"
          data-ga-action="back_to_landing"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Zurück zur Übersicht</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SSL 256-Bit TLS</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OBERHALB DES LOGINS: Kurze Beschreibung des Webanwendungs-Potenzials      */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg mb-5 z-10 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-400/10 via-[#FF2E93]/10 to-[#8D26FF]/15 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-amber-300">
            Webanwendungs-Potenzial
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
          Institutionelle Marktintelligenz für fundierte Entscheidungen
        </h2>

        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Capital-AI transformiert komplexe Finanzströme in verständliche, handlungsrelevante Signale: Echtzeit-Synthese über 5 globale Anlageklassen, neuronales Value- & Momentum-Scoring sowie Sub-45ms Latenz garantieren maximalen Informationsvorsprung.
        </p>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold">&lt; 45ms Latenz</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <Globe2 className="w-3.5 h-3.5 text-[#44DE88] shrink-0" />
            <span className="font-semibold">5 Assetklassen</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <TrendingUp className="w-3.5 h-3.5 text-[#FF2E93] shrink-0" />
            <span className="font-semibold">Quant-Scoring</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200">
            <Shield className="w-3.5 h-3.5 text-[#8D26FF] shrink-0" />
            <span className="font-semibold">DSGVO & MiCA</span>
          </div>
        </div>
      </motion.div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-[#070b19]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(249,191,33,0.12)] backdrop-blur-xl relative z-10"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <BrandLogo variant="stacked" size="md" />
          <h1 className="text-xl font-bold text-white mt-4 tracking-tight">
            {authMode === 'login' ? 'Terminal Anmeldung' : 'Neues Konto erstellen'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {authMode === 'login'
              ? 'Sicherer Zugang zu KI-gestützten Echtzeit-Marktdaten und Portfolio-Analysen.'
              : 'Registrieren Sie sich kostenfrei für den Zugang zur Capital-AI Intelligence Plattform.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Anmelden vs. Registrieren) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl mb-5">
          <button
            type="button"
            id="tab-mode-login"
            onClick={() => {
              setAuthMode('login');
              setSuccessMessage(null);
              setRegError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Anmelden</span>
          </button>
          <button
            type="button"
            id="tab-mode-register"
            onClick={() => {
              setAuthMode('register');
              setSuccessMessage(null);
              setRegError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-[#FF2E93] to-[#8D26FF] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registrieren</span>
          </button>
        </div>

        {/* Success View */}
        {successMessage ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Vorgang abgeschlossen</h3>
            <p className="text-xs text-slate-300 max-w-xs">{successMessage}</p>
            <button
              type="button"
              onClick={onBackToHome}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 text-black font-extrabold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer"
            >
              Zum Dashboard
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              /* LOGIN FORM */
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    E-Mail-Adresse
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-medium text-slate-300">
                      Passwort
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        trackEvent('forgot_password_click', { category: 'authentication' });
                        alert('Passwort-Rücksetzungslink wurde an Ihre verifizierte E-Mail-Adresse gesendet.');
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      Passwort vergessen?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      aria-label={showLoginPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & WebAuthn */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-black/60 text-amber-400 focus:ring-amber-400/50 cursor-pointer"
                    />
                    <span>Angemeldet bleiben</span>
                  </label>
                  <span className="flex items-center gap-1 text-[11px] text-purple-300">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Passkey / WebAuthn</span>
                  </span>
                </div>

                {/* Login Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F9BF21] via-[#44DE88] to-[#8D26FF] text-black font-extrabold text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_20px_rgba(249,191,33,0.25)] flex items-center justify-center gap-2 mt-2"
                  data-analytics="submit-login"
                  data-ga-category="authentication"
                  data-ga-action="submit_login_form"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Verifiziere Anmeldedaten...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 stroke-[2.5]" />
                      <span>Anmelden</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* REGISTRATION FORM */
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-3.5"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1">
                    Vollständiger Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Max Mustermann"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1">
                    E-Mail-Adresse
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-medium text-slate-300 mb-1">
                    Passwort (mind. 8 Zeichen)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mindestens 8 Zeichen"
                      className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      aria-label={showRegPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm-password" className="block text-xs font-medium text-slate-300 mb-1">
                    Passwort wiederholen
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-confirm-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Passwort wiederholen"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {regError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {regError}
                  </div>
                )}

                {/* Accept Terms Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 leading-snug">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-black/60 text-[#FF2E93] focus:ring-[#FF2E93]/50 cursor-pointer"
                    />
                    <span>
                      Ich akzeptiere die{' '}
                      <span className="text-slate-200 underline">Nutzungsbedingungen (AGB)</span> und die{' '}
                      <span className="text-slate-200 underline">Datenschutzrichtlinie</span> von Capital-AI.
                    </span>
                  </label>
                </div>

                {/* Register Submit Button */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF2E93] via-[#8D26FF] to-[#44DE88] text-white font-extrabold text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,46,147,0.3)] flex items-center justify-center gap-2 mt-2"
                  data-analytics="submit-register"
                  data-ga-category="authentication"
                  data-ga-action="submit_register_form"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Erstelle Capital-AI Konto...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Konto registrieren</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#070b19] text-slate-500 uppercase tracking-widest text-[10px]">
              Oder fortfahren mit
            </span>
          </div>
        </div>

        {/* Google SSO Button */}
        <div>
          <button
            type="button"
            id="login-sso-google-btn"
            onClick={handleGoogleSSOClick}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm hover:border-white/20"
            data-analytics="sso-google"
            data-ga-category="authentication"
            data-ga-action="sso_google_click"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.6 2.8C6.4 7.1 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.5 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.6-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.1-6.5-5.1L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Mit Google fortfahren</span>
          </button>
        </div>

        {/* Security Disclaimers */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>MiCA Konform</span>
          <span>SOC-2 Type II</span>
          <span>Ende-zu-Ende verschlüsselt</span>
        </div>
      </motion.div>

      {/* Switcher between Login & Register */}
      <div className="w-full max-w-lg text-center text-xs text-slate-400 py-3 z-10">
        {authMode === 'login' ? (
          <>
            Noch kein Konto?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setSuccessMessage(null);
                setRegError('');
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer ml-1"
            >
              Jetzt registrieren
            </button>
          </>
        ) : (
          <>
            Bereits registriert?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setSuccessMessage(null);
                setRegError('');
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer ml-1"
            >
              Jetzt anmelden
            </button>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* UNTERHALB DES LOGINS: Kurze grafische Übersicht des FAQ                  */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg mt-4 z-10 p-5 rounded-3xl bg-[#070b19]/90 border border-slate-800/90 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">FAQ-Kurzübersicht</h3>
              <p className="text-[10px] text-slate-400">Wichtige Antworten auf einen Blick</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateFaq}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer group"
          >
            <span>Alle FAQs</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Quick Expandable Cards */}
        <div className="space-y-2">
          {quickFaqs.map((faq, idx) => {
            const isOpen = openQuickFaq === idx;
            const Icon = faq.icon;
            return (
              <div
                key={faq.q}
                className={`rounded-xl border ${faq.borderColor} bg-black/40 overflow-hidden transition-all`}
              >
                <button
                  type="button"
                  onClick={() => setOpenQuickFaq(isOpen ? null : idx)}
                  className="w-full p-3 flex items-center justify-between text-left gap-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${faq.color} shrink-0`} />
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {faq.q}
                    </span>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="px-3 pb-3 pt-0 text-[11px] text-slate-400 border-t border-white/5 leading-relaxed"
                    >
                      <p className="mt-2">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Call to Action Button to full FAQ page */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Häufig gestellte Fragen & Hilfe</span>
          <button
            type="button"
            onClick={onNavigateFaq}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Ausführliche FAQ aufrufen</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
