import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Ban,
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

const WEEKDAY_HEADERS = {
  es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
};

const FULL_MONTHS = {
  es: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

function buildMonthGrid(year, monthIndex) {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  // Monday-first offset (Mon=0 .. Sun=6)
  const startOffset = (firstDay.getUTCDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ empty: true, key: `pad-start-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(Date.UTC(year, monthIndex, day)).getUTCDay();
    cells.push({
      empty: false,
      day,
      dow,
      isWeekend: dow === 0 || dow === 6,
      dateStr: `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`,
      key: `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ empty: true, key: `pad-end-${cells.length}` });
  }
  return cells;
}

/**
 * Literal Monthly Grid Calendar + Red Blocked Slots & Interview Booking Modal
 * Supports two modes:
 * - `mode="book"`: Full interactive booking flow (Title, Name, Email MX/Typo, Resend 6-digit OTP, Google Meet)
 * - `mode="view"`: Clean visual calendar overlay opened from CharlyBot (inspect green free vs red blocked slots,
 *                  then close and reply in chat with chosen date & time)
 */
export function AvailabilityModal({ isOpen, mode = 'book', onSwitchToBook, onClose }) {
  const dialogRef = useRef(null);
  const { lang, t } = useLanguage();
  const av = t.availability;
  const isViewOnly = mode === 'view';

  const [duration, setDuration] = useState(30);
  const [activeMonthIdx, setActiveMonthIdx] = useState(0);
  const [selectedDateStr, setSelectedDateStr] = useState('');
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
  const daysByDate = useMemo(() => {
    const map = new Map();
    for (const d of allDays) {
      map.set(d.date, d);
    }
    return map;
  }, [allDays]);

  // Unique (year, month) pairs covered by the 15-day availability window (e.g. Nov 2026 & Dec 2026)
  const calendarMonths = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const d of allDays) {
      const [yStr, mStr] = d.date.split('-');
      const key = `${yStr}-${mStr}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({ year: Number(yStr), monthIndex: Number(mStr) - 1, key });
      }
    }
    if (list.length === 0) {
      const now = new Date();
      list.push({ year: now.getFullYear(), monthIndex: now.getMonth(), key: 'current' });
    }
    return list;
  }, [allDays]);

  // Default select the first day with available slots
  useEffect(() => {
    if (allDays.length === 0) return;
    if (!selectedDateStr || !daysByDate.has(selectedDateStr)) {
      const firstOpen = allDays.find((d) => (d.slots?.length || 0) > 0) || allDays[0];
      if (firstOpen) {
        setSelectedDateStr(firstOpen.date);
        const [yStr, mStr] = firstOpen.date.split('-');
        const idx = calendarMonths.findIndex((m) => m.key === `${yStr}-${mStr}`);
        if (idx >= 0) setActiveMonthIdx(idx);
      }
    }
  }, [allDays, daysByDate, selectedDateStr, calendarMonths]);

  const currentMonth = calendarMonths[activeMonthIdx] || calendarMonths[0];
  const monthGrid = useMemo(
    () => (currentMonth ? buildMonthGrid(currentMonth.year, currentMonth.monthIndex) : []),
    [currentMonth]
  );

  const selectedDay = daysByDate.get(selectedDateStr) || allDays[0] || null;
  const bookingEnabled = Boolean(availability?.bookingEnabled);
  const otpRequired = Boolean(availability?.otpRequired);

  useEffect(() => {
    setSelectedSlot(null);
    setOtpStep(false);
    setOtpToken('');
    setOtpCode('');
    setBookingError('');
  }, [duration, selectedDateStr, mode]);

  const handleClose = () => {
    if (submitting) return;
    setConfirmedBooking(null);
    setOtpStep(false);
    setOtpCode('');
    setBookingError('');
    onClose();
  };

  const handleSelectDay = (dateStr) => {
    setSelectedDateStr(dateStr);
    setSelectedSlot(null);
    setBookingError('');
  };

  const handleSelectSlot = (slot) => {
    if (slot.status !== 'available' || isViewOnly) return;
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

  const dayAllSlots = selectedDay?.allSlots || selectedDay?.slots?.map((s) => ({ ...s, status: 'available' })) || [];

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
      className="precision-dialog m-auto w-[min(96vw,56rem)]"
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
              {!isViewOnly && otpRequired && (
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
            <p className="mt-0.5 text-xs text-zinc-400">
              {isViewOnly ? av.viewOnlySubtitle : av.subtitle}
            </p>
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
              {/* Top Controls: Duration + Timezone */}
              <div className="flex flex-wrap items-center justify-between gap-3">
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

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    {showVisitorTz
                      ? `ART (UTC-3) · ${av.yourTimezone}: ${visitorTz}`
                      : 'Hora Argentina (ART · UTC-3)'}
                  </span>
                </div>
              </div>

              {/* View-only helper bar when opened from CharlyBot */}
              {isViewOnly && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-3 text-xs text-indigo-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 shrink-0 text-indigo-300" />
                    <span>{av.viewOnlyHint}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onSwitchToBook && bookingEnabled && (
                      <button
                        type="button"
                        onClick={onSwitchToBook}
                        className="rounded-lg border border-cyan-400/35 bg-cyan-400/15 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400/25"
                      >
                        {av.bookHereInstead}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg bg-indigo-400 px-3 py-1 font-semibold text-zinc-950 hover:brightness-110"
                    >
                      {av.backToChat}
                    </button>
                  </div>
                </div>
              )}

              {/* Literal Monthly Calendar Grid + Day Slots Side-by-Side */}
              {loading && allDays.length === 0 ? (
                <div className="flex items-center justify-center py-14">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
                    {/* LEFT: Real Monthly Grid Calendar */}
                    <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/15 bg-obsidian/80 p-3.5 sm:p-4 md:col-span-6 md:mx-0 md:max-w-none">
                      {/* Month Navigation Header */}
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-display text-sm font-bold text-white">
                          {currentMonth
                            ? `${FULL_MONTHS[lang][currentMonth.monthIndex]} ${currentMonth.year}`
                            : ''}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveMonthIdx((i) => Math.max(0, i - 1))}
                            disabled={activeMonthIdx === 0}
                            aria-label={av.prevMonth}
                            className="rounded-lg border border-white/15 bg-surface p-1.5 text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-white disabled:opacity-30"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMonthIdx((i) => Math.min(calendarMonths.length - 1, i + 1))
                            }
                            disabled={activeMonthIdx >= calendarMonths.length - 1}
                            aria-label={av.nextMonth}
                            className="rounded-lg border border-white/15 bg-surface p-1.5 text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-white disabled:opacity-30"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weekday Column Headers (Lu..Do) */}
                      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center">
                        {WEEKDAY_HEADERS[lang].map((wd) => (
                          <div
                            key={wd}
                            className="py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
                          >
                            {wd}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Day Cells Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {monthGrid.map((cell) => {
                          if (cell.empty) {
                            return <div key={cell.key} className="aspect-square" />;
                          }

                          const dayData = daysByDate.get(cell.dateStr);
                          const isSelected = cell.dateStr === selectedDay?.date;
                          const hasSlots = Boolean(dayData && (dayData.slots?.length || 0) > 0);
                          const hasBlocked = Boolean(dayData && (dayData.blockedCount || 0) > 0);
                          const isFullyBlocked = Boolean(dayData?.isFullyBlocked);
                          const isInteractive = Boolean(dayData && (hasSlots || hasBlocked));

                          let cellStyle;
                          if (isSelected) {
                            cellStyle = hasSlots
                              ? 'border-white bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 text-white ring-2 ring-cyan-300/80 shadow-sm cursor-pointer'
                              : 'border-white bg-rose-500/40 text-white ring-2 ring-rose-400/80 shadow-sm cursor-pointer';
                          } else if (hasSlots) {
                            cellStyle =
                              'border-white/70 bg-surface/95 text-white hover:border-white hover:bg-cyan-400/15 cursor-pointer';
                          } else if (isInteractive || isFullyBlocked) {
                            cellStyle =
                              'border-white/60 bg-rose-500/35 text-rose-100 hover:border-white hover:bg-rose-500/45 cursor-pointer';
                          } else {
                            cellStyle =
                              'border-white/45 bg-rose-500/25 text-rose-100/90 cursor-not-allowed';
                          }

                          return (
                            <button
                              key={cell.key}
                              type="button"
                              disabled={!isInteractive}
                              onClick={() => isInteractive && handleSelectDay(cell.dateStr)}
                              title={
                                hasSlots
                                  ? `${dayData.slots.length} ${av.slotsWord}`
                                  : isFullyBlocked
                                  ? av.blockedLabel
                                  : av.noSlotsDay
                              }
                              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-all ${cellStyle}`}
                            >
                              <span>{cell.day}</span>
                              {hasSlots && (
                                <span className="mt-0.5 flex items-center gap-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                  {hasBlocked && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                  )}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Calendar Color Legend */}
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-white/[0.07] pt-3 font-mono text-[10px] text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>{av.legendAvailable}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-sm border border-white/50 bg-rose-500/35" />
                          <span>{av.legendUnavailable}</span>
                        </span>
                      </div>
                    </div>

                    {/* RIGHT: Selected Day Schedule (Green Available + Red Blocked Slots) */}
                    <div className="flex flex-col rounded-2xl border border-white/15 bg-obsidian/80 p-3.5 sm:p-4 md:col-span-6">
                      <div className="mb-3 border-b border-white/[0.07] pb-3">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{av.selectedDayHeading}</span>
                        </span>
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-base font-bold text-white">
                            {selectedDay
                              ? lang === 'es'
                                ? selectedDay.dayLabelEs
                                : selectedDay.dayLabelEn
                              : '—'}
                          </h3>
                          {selectedDay && (
                            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                              <span className="whitespace-nowrap rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                                {selectedDay.slots?.length || 0} {av.legendAvailable.toLowerCase()}
                              </span>
                              {(selectedDay.blockedCount || 0) > 0 && (
                                <span className="whitespace-nowrap rounded-md border border-rose-500/35 bg-rose-500/15 px-2 py-0.5 text-rose-300">
                                  {selectedDay.blockedCount} {av.blockedLabel.toLowerCase()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {dayAllSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                          {dayAllSlots.map((slot) => {
                            const isBlocked = slot.status === 'blocked';
                            const isPast = slot.status === 'past';
                            const isAvailable = slot.status === 'available';
                            const isChosen = selectedSlot?.start === slot.start;
                            const localFormatted = showVisitorTz
                              ? formatSlotInTimezone(slot.start, visitorTz)
                              : null;

                            if (isBlocked) {
                              return (
                                <div
                                  key={slot.start}
                                  aria-disabled="true"
                                  title={av.blockedLabel}
                                  className="flex cursor-not-allowed flex-col items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 px-2.5 py-2 font-mono text-rose-200"
                                >
                                  <span className="flex items-center gap-1 text-xs font-semibold line-through decoration-rose-400/70">
                                    <Ban className="h-3 w-3 text-rose-400" />
                                    {slot.labelArt}
                                  </span>
                                  <span className="text-[9px] uppercase tracking-wider text-rose-300/80">
                                    {av.blockedLabel}
                                  </span>
                                </div>
                              );
                            }

                            if (isPast) {
                              return (
                                <div
                                  key={slot.start}
                                  aria-disabled="true"
                                  className="flex cursor-not-allowed flex-col items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-2 font-mono text-zinc-600"
                                >
                                  <span className="text-xs line-through">{slot.labelArt}</span>
                                  <span className="text-[9px] uppercase">{av.pastSlotLabel}</span>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={slot.start}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => handleSelectSlot(slot)}
                                className={`flex flex-col items-center justify-center rounded-xl border px-2.5 py-2 font-mono transition-all ${
                                  isChosen
                                    ? 'border-cyan-300 bg-gradient-to-br from-cyan-400/25 to-indigo-500/25 text-white ring-1 ring-cyan-300/70'
                                    : isViewOnly
                                    ? 'cursor-default border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                                    : 'cursor-pointer border-emerald-400/25 bg-emerald-500/[0.08] text-emerald-100 hover:border-cyan-400/60 hover:bg-cyan-400/15 hover:text-white'
                                }`}
                              >
                                <span className="text-xs font-semibold">{slot.labelArt} ART</span>
                                {localFormatted ? (
                                  <span className="text-[9px] text-zinc-300">
                                    {localFormatted} local
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-emerald-300/80">
                                    {av.legendAvailable}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="my-auto py-8 text-center text-xs text-zinc-400">
                          {av.noSlotsSelectedDay}
                        </div>
                      )}

                      {!isViewOnly && (
                        <p className="mt-auto pt-4 text-center font-mono text-[10px] text-zinc-500">
                          {av.clickGreenSlotHint}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking / OTP Form (visible in book mode once a green slot is selected) */}
                  {!isViewOnly && selectedSlot && selectedDay && (
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
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="hidden"
                              aria-hidden="true"
                            />

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
