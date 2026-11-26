import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Video,
  X
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import {
  detectEmailTypo,
  formatSlotInTimezone,
  getVisitorTimezone,
  isDifferentFromArgentina,
  useAvailability
} from '../../hooks/useAvailability';

const INTERVIEW_PRESETS = {
  es: [
    'Entrevista Full Stack',
    'Entrevista Frontend',
    'Entrevista AI Engineer',
    'Screening RRHH'
  ],
  en: [
    'Full Stack Interview',
    'Frontend Interview',
    'AI Engineer Interview',
    'Recruiter Screening'
  ]
};

/**
 * Interactive 15-Day Weekly Calendar ("Semanario") & Interview Booking Modal
 * Built on native HTML <dialog> with:
 * - 2-week (10 business days / ~15 calendar days) Mon–Fri column grid
 * - Automatic ART (UTC-3) + visitor local timezone display
 * - Interview title/role presets + live email typo detector + DNS MX check
 * - Optional 6-digit email OTP verification via Resend before creating the Google Calendar event
 * - Delivery time notice (1–5 min, check email after 5–7 min)
 */
export function AvailabilityModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const { lang, t } = useLanguage();
  const av = t.availability;

  const [duration, setDuration] = useState(30);
  const [weekIndex, setWeekIndex] = useState(0); // 0 = Semana 1 (days 0..4), 1 = Semana 2 (days 5..9)
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Booking form state
  const [interviewTitle, setInterviewTitle] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState(''); // anti-bot honeypot

  // OTP step state
  const [otpStep, setOtpStep] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedSlot, setCopiedSlot] = useState(false);

  const visitorTz = useMemo(() => getVisitorTimezone(), []);
  const showVisitorTz = useMemo(() => isDifferentFromArgentina(visitorTz), [visitorTz]);
  const typoSuggestion = useMemo(() => detectEmailTypo(recruiterEmail), [recruiterEmail]);

  const { availability, loading, refresh } = useAvailability({
    enabled: isOpen,
    durationMinutes: duration,
    days: 10
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const allDays = availability?.days || [];
  const weeks = useMemo(() => {
    if (allDays.length === 0) return [];
    const chunks = [];
    for (let i = 0; i < allDays.length; i += 5) {
      chunks.push(allDays.slice(i, i + 5));
    }
    return chunks;
  }, [allDays]);

  const visibleWeek = weeks[weekIndex] || weeks[0] || [];
  const bookingEnabled = Boolean(availability?.bookingEnabled);
  const otpRequired = Boolean(availability?.otpRequired);

  useEffect(() => {
    setSelectedSlot(null);
    setSelectedDay(null);
    setOtpStep(false);
    setOtpToken('');
    setOtpCode('');
    setBookingError('');
  }, [duration]);

  const handleClose = () => {
    if (submitting) return;
    setConfirmedBooking(null);
    setOtpStep(false);
    setOtpCode('');
    setBookingError('');
    onClose();
  };

  const handleSelectSlot = (day, slot) => {
    setSelectedDay(day);
    setSelectedSlot(slot);
    setOtpStep(false);
    setOtpToken('');
    setOtpCode('');
    setBookingError('');
    if (!interviewTitle) {
      setInterviewTitle(INTERVIEW_PRESETS[lang][0]);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!selectedSlot || submitting) return;
    setSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendOtp',
          startIso: selectedSlot.start,
          durationMinutes: duration,
          interviewTitle: interviewTitle.trim() || INTERVIEW_PRESETS[lang][0],
          recruiterName,
          recruiterEmail,
          company,
          notes,
          website
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || av.bookingErrorFallback);
      }

      setOtpToken(json.otpToken);
      setOtpStep(true);
      setOtpCode('');
    } catch (err) {
      setBookingError(err?.message || av.bookingErrorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot || submitting) return;

    if (!otpRequired) {
      if (recruiterEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
        setBookingError(av.emailMismatchError);
        return;
      }
    }

    setSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          startIso: selectedSlot.start,
          durationMinutes: duration,
          interviewTitle: interviewTitle.trim() || INTERVIEW_PRESETS[lang][0],
          recruiterName,
          recruiterEmail,
          company,
          notes,
          otpCode: otpRequired ? otpCode : '',
          otpToken: otpRequired ? otpToken : '',
          website
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || av.bookingErrorFallback);
      }

      setConfirmedBooking(json.booking);
      setSelectedSlot(null);
      setOtpStep(false);
      setOtpCode('');
      refresh();
    } catch (err) {
      setBookingError(err?.message || av.bookingErrorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  const buildProposalText = () => {
    if (!selectedSlot || !selectedDay) return '';
    const dayLabel = lang === 'es' ? selectedDay.dayLabelEs : selectedDay.dayLabelEn;
    const titlePart = interviewTitle.trim() ? ` (${interviewTitle.trim()})` : '';
    const localTime = showVisitorTz
      ? ` (${formatSlotInTimezone(selectedSlot.start, visitorTz)} ${visitorTz})`
      : '';
    if (lang === 'es') {
      return `Hola Carlos, vi tu disponibilidad en tu portfolio. ¿Podemos coordinar una entrevista${titlePart} de ${duration} min el ${dayLabel} a las ${selectedSlot.labelArt} ART${localTime}?`;
    }
    return `Hi Carlos, I checked your availability on your portfolio. Could we schedule a ${duration}-min interview${titlePart} on ${dayLabel} at ${selectedSlot.labelArt} ART${localTime}?`;
  };

  const handleCopySlot = async () => {
    const text = buildProposalText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSlot(true);
      setTimeout(() => setCopiedSlot(false), 1800);
    } catch {
      // ignore
    }
  };

  const proposalText = buildProposalText();
  const whatsappHref = `${professionalData.personal.whatsappUrl}?text=${encodeURIComponent(
    proposalText ||
      (lang === 'es'
        ? 'Hola Carlos, me gustaría coordinar una entrevista.'
        : 'Hi Carlos, I would like to schedule an interview.')
  )}`;
  const emailHref = `mailto:${professionalData.personal.email}?subject=${encodeURIComponent(
    interviewTitle.trim()
      ? `${interviewTitle.trim()} — Carlos Jesús`
      : lang === 'es'
      ? 'Coordinar entrevista — Carlos Jesús'
      : 'Interview Scheduling — Carlos Jesús'
  )}&body=${encodeURIComponent(proposalText)}`;

  const weekRangeLabel =
    visibleWeek.length > 0
      ? `${lang === 'es' ? visibleWeek[0].dayLabelEs : visibleWeek[0].dayLabelEn} — ${
          lang === 'es'
            ? visibleWeek[visibleWeek.length - 1].dayLabelEs
            : visibleWeek[visibleWeek.length - 1].dayLabelEn
        }`
      : '';

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
      aria-label={av.title}
      className="precision-dialog m-auto w-[min(96vw,54rem)]"
    >
      <div className="max-h-[92dvh] overflow-y-auto rounded-2xl border border-white/12 bg-surface/98 text-zinc-100 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-surface/95 px-6 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {bookingEnabled ? av.liveSynced : av.standardWindowBadge}
              </span>
              {otpRequired && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-200">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{av.otpBadge}</span>
                </span>
              )}
              <span className="font-mono text-[10px] text-zinc-400">
                {lang === 'es'
                  ? availability?.window?.labelEs || 'Lun–Vie · 11:00–17:00 ART (UTC-3)'
                  : availability?.window?.labelEn || 'Mon–Fri · 11:00–17:00 ART (UTC-3)'}
              </span>
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-white">{av.title}</h2>
            <p className="mt-0.5 text-xs text-zinc-400">{av.subtitle}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label={av.refresh}
              title={av.refresh}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-300 disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label={t.chat.close}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Confirmed Booking Success View */}
          {confirmedBooking ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {av.confirmedTitle}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-300">
                  {av.confirmedSubtitle.replace('{email}', confirmedBooking.recruiterEmail)}
                </p>
              </div>

              <div className="mx-auto max-w-md space-y-2.5 rounded-xl border border-white/10 bg-obsidian/80 p-4 text-left text-xs">
                {confirmedBooking.summary && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-zinc-400">{av.interviewTitleLabel}</span>
                    <span className="text-right font-semibold text-white">
                      {confirmedBooking.summary}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-400">{av.whenLabel}</span>
                  <span className="font-mono font-semibold text-white">
                    {confirmedBooking.startIso.slice(0, 10)} ·{' '}
                    {confirmedBooking.startIso.slice(11, 16)}–{confirmedBooking.endIso.slice(11, 16)}{' '}
                    ART
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-400">{av.emailLabel}</span>
                  <span className="font-mono text-cyan-200">{confirmedBooking.recruiterEmail}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-400">{av.durationLabel}</span>
                  <span className="font-mono text-cyan-300">
                    {confirmedBooking.durationMinutes} min
                  </span>
                </div>
                {confirmedBooking.meetLink && (
                  <div className="border-t border-white/10 pt-2.5">
                    <a
                      href={confirmedBooking.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-all hover:brightness-110"
                    >
                      <Video className="h-4 w-4" />
                      <span>{av.openMeetLink}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Delivery timing & email validation notice (1–5 min / 5–7 min check) */}
              <div className="mx-auto flex max-w-md items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-left text-xs text-amber-100/90">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="leading-relaxed">
                  {av.deliveryNotice.replace('{email}', confirmedBooking.recruiterEmail)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-white/12 bg-white/[0.05] px-5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"
              >
                {t.chat.close}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Top Controls: Duration + Week Pagination + Timezone */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Duration Toggle */}
                  <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-obsidian p-1">
                    {[30, 45].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDuration(mins)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                          duration === mins
                            ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/35'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{mins} min</span>
                      </button>
                    ))}
                  </div>

                  {/* Week 1 / Week 2 Switcher (15-day Semanario) */}
                  {weeks.length > 1 && (
                    <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-obsidian p-1">
                      <button
                        type="button"
                        onClick={() => setWeekIndex((w) => Math.max(0, w - 1))}
                        disabled={weekIndex === 0}
                        aria-label={av.prevWeek}
                        className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-30"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 font-mono text-[11px] font-medium text-zinc-200">
                        {av.weekLabel
                          .replace('{n}', String(weekIndex + 1))
                          .replace('{total}', String(weeks.length))}
                      </span>
                      <button
                        type="button"
                        onClick={() => setWeekIndex((w) => Math.min(weeks.length - 1, w + 1))}
                        disabled={weekIndex >= weeks.length - 1}
                        aria-label={av.nextWeek}
                        className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-30"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    {showVisitorTz
                      ? `ART (UTC-3) · ${av.yourTimezone}: ${visitorTz}`
                      : 'Hora Argentina (ART · UTC-3)'}
                  </span>
                </div>
              </div>

              {/* Semanario Weekly 5-Column Grid (up to 15 days / 2 weeks) */}
              {loading && allDays.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        <Calendar className="mr-1.5 inline h-3.5 w-3.5 text-cyan-400" />
                        {av.pickSlotLabel}
                      </span>
                      {weekRangeLabel && (
                        <span className="font-mono text-[11px] text-cyan-300/90">
                          {weekRangeLabel}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
                      {visibleWeek.map((day) => {
                        const slots = day.slots || [];
                        return (
                          <div
                            key={day.date}
                            className="flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-obsidian/75"
                          >
                            {/* Column Day Header */}
                            <div className="border-b border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-center">
                              <p className="font-display text-xs font-bold text-white">
                                {lang === 'es' ? day.dayLabelEs : day.dayLabelEn}
                              </p>
                              <p
                                className={`mt-0.5 font-mono text-[10px] ${
                                  slots.length > 0 ? 'text-emerald-300' : 'text-zinc-500'
                                }`}
                              >
                                {slots.length > 0 ? `${slots.length} ${av.slotsWord}` : av.noSlotsDay}
                              </p>
                            </div>

                            {/* Day's Time Slots Stack */}
                            <div className="grid max-h-56 grid-cols-3 gap-1.5 overflow-y-auto p-2 sm:grid-cols-1">
                              {slots.length > 0 ? (
                                slots.map((slot) => {
                                  const isChosen = selectedSlot?.start === slot.start;
                                  const localFormatted = showVisitorTz
                                    ? formatSlotInTimezone(slot.start, visitorTz)
                                    : null;
                                  return (
                                    <button
                                      key={slot.start}
                                      type="button"
                                      onClick={() => handleSelectSlot(day, slot)}
                                      className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 font-mono transition-all ${
                                        isChosen
                                          ? 'border-cyan-300 bg-gradient-to-r from-cyan-400/25 to-indigo-500/25 text-white ring-1 ring-cyan-300/60'
                                          : 'border-white/[0.08] bg-surface/80 text-zinc-200 hover:border-cyan-400/45 hover:bg-cyan-400/10'
                                      }`}
                                    >
                                      <span className="text-[11px] font-semibold">
                                        {slot.labelArt}
                                      </span>
                                      {localFormatted && (
                                        <span className="text-[9px] text-zinc-400">
                                          {localFormatted} loc
                                        </span>
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <p className="col-span-3 py-4 text-center text-[11px] text-zinc-500 sm:col-span-1">
                                  {av.noSlotsDay}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Booking / OTP Form (visible once a slot is selected) */}
                  {selectedSlot && selectedDay && (
                    <div className="rounded-2xl border border-cyan-400/25 bg-obsidian/90 p-4 sm:p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="text-xs">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                            {av.selectedSlotHeading}
                          </span>
                          <p className="mt-0.5 font-display text-sm font-bold text-white">
                            {lang === 'es' ? selectedDay.dayLabelEs : selectedDay.dayLabelEn} ·{' '}
                            {selectedSlot.labelArt} ART ({duration} min)
                            {showVisitorTz && (
                              <span className="ml-2 font-mono text-xs font-normal text-zinc-400">
                                ({formatSlotInTimezone(selectedSlot.start, visitorTz)} local)
                              </span>
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopySlot}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-cyan-400/40 hover:text-white"
                        >
                          {copiedSlot ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-300">{av.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-cyan-400" />
                              <span>{av.copyProposal}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {bookingEnabled ? (
                        otpStep ? (
                          /* Step 2B: Enter 6-digit OTP sent via Resend */
                          <form onSubmit={handleConfirmBooking} className="space-y-4">
                            <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/[0.07] px-4 py-3 text-xs text-cyan-100">
                              <p className="font-semibold text-white">{av.otpSentTitle}</p>
                              <p className="mt-1 text-zinc-300">
                                {av.otpSentSubtitle.replace('{email}', recruiterEmail)}
                              </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                              <div className="flex-1">
                                <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                  {av.otpInputLabel} *
                                </label>
                                <div className="relative">
                                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{6}"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    value={otpCode}
                                    onChange={(e) =>
                                      setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                                    }
                                    placeholder="000000"
                                    className="w-full rounded-xl border border-white/15 bg-surface py-2.5 pl-10 pr-4 font-mono text-base tracking-[0.35em] text-white outline-none focus:border-cyan-400"
                                  />
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={submitting || otpCode.length !== 6}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-xs font-semibold text-zinc-950 transition-all hover:brightness-110 disabled:opacity-45"
                              >
                                <Video className="h-4 w-4" />
                                <span>
                                  {submitting ? av.bookingSubmitting : av.verifyAndBookBtn}
                                </span>
                              </button>
                            </div>

                            {bookingError && (
                              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                                {bookingError}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpStep(false);
                                  setBookingError('');
                                }}
                                className="text-zinc-300 underline hover:text-white"
                              >
                                {av.changeEmailBtn}
                              </button>
                              <button
                                type="button"
                                onClick={handleRequestOtp}
                                disabled={submitting}
                                className="text-cyan-300 underline hover:text-cyan-200 disabled:opacity-40"
                              >
                                {av.resendCodeBtn}
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* Step 2A: Interview details & email validation */
                          <form
                            onSubmit={otpRequired ? handleRequestOtp : handleConfirmBooking}
                            className="space-y-3.5"
                          >
                            {/* Hidden anti-bot honeypot */}
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="hidden"
                              aria-hidden="true"
                            />

                            {/* Interview Title / Role Presets + Input */}
                            <div>
                              <label className="mb-1.5 block font-mono text-[11px] text-zinc-400">
                                {av.interviewTitleLabel} *
                              </label>
                              <div className="mb-2 flex flex-wrap gap-1.5">
                                {INTERVIEW_PRESETS[lang].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setInterviewTitle(preset)}
                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                      interviewTitle === preset
                                        ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200'
                                        : 'border-white/10 bg-surface text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                                    }`}
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                required
                                maxLength={100}
                                value={interviewTitle}
                                onChange={(e) => setInterviewTitle(e.target.value)}
                                placeholder={av.interviewTitlePlaceholder}
                                className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                  {av.nameLabel} *
                                </label>
                                <input
                                  type="text"
                                  required
                                  minLength={2}
                                  value={recruiterName}
                                  onChange={(e) => setRecruiterName(e.target.value)}
                                  placeholder={av.namePlaceholder}
                                  className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                  {av.companyLabel}
                                </label>
                                <input
                                  type="text"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                                  placeholder={av.companyPlaceholder}
                                  className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                                />
                              </div>

                              <div className={otpRequired ? 'sm:col-span-2' : ''}>
                                <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                  {av.emailLabel} *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={recruiterEmail}
                                  onChange={(e) => setRecruiterEmail(e.target.value)}
                                  placeholder={av.emailPlaceholder}
                                  className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                                />
                                {typoSuggestion && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRecruiterEmail(typoSuggestion);
                                      if (confirmEmail) setConfirmEmail(typoSuggestion);
                                    }}
                                    className="mt-1.5 inline-flex items-center gap-1 rounded-lg border border-amber-400/35 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-200 hover:bg-amber-500/20"
                                  >
                                    <span>
                                      {av.typoDidYouMean}{' '}
                                      <strong className="font-mono underline">
                                        {typoSuggestion}
                                      </strong>
                                      ?
                                    </span>
                                  </button>
                                )}
                              </div>

                              {!otpRequired && (
                                <div>
                                  <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                    {av.confirmEmailLabel} *
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    placeholder={av.emailPlaceholder}
                                    className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                                  />
                                </div>
                              )}

                              <div className="sm:col-span-2">
                                <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                  {av.notesLabel}
                                </label>
                                <input
                                  type="text"
                                  maxLength={400}
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder={av.notesPlaceholder}
                                  className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/60"
                                />
                              </div>
                            </div>

                            {bookingError && (
                              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                                {bookingError}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <p className="text-[11px] text-zinc-400">
                                {otpRequired ? av.otpInviteNotice : av.inviteNotice}
                              </p>
                              <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-xs font-semibold text-zinc-950 transition-all hover:brightness-110 disabled:opacity-50"
                              >
                                {otpRequired ? (
                                  <Mail className="h-3.5 w-3.5" />
                                ) : (
                                  <Video className="h-3.5 w-3.5" />
                                )}
                                <span>
                                  {submitting
                                    ? av.bookingSubmitting
                                    : otpRequired
                                    ? av.sendCodeBtn
                                    : av.confirmBookingBtn}
                                </span>
                              </button>
                            </div>
                          </form>
                        )
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-300">{av.directContactPrompt}</p>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/25"
                            >
                              <FaWhatsapp className="h-4 w-4" />
                              <span>{av.sendWhatsApp}</span>
                            </a>
                            <a
                              href={emailHref}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/15 px-4 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/25"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              <span>{av.sendEmail}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Footer Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3 text-[11px] text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{av.footerTip}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-emerald-400 hover:underline"
                      >
                        WhatsApp ↗
                      </a>
                      <a href={emailHref} className="font-mono text-cyan-300 hover:underline">
                        Email ↗
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
