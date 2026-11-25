import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Mail,
  MessageSquare,
  RefreshCw,
  Video,
  X
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatSlotInTimezone,
  getVisitorTimezone,
  isDifferentFromArgentina,
  useAvailability
} from '../../hooks/useAvailability';

/**
 * Interactive Recruiter Availability & Interview Booking Modal
 * Built on native HTML <dialog> with Top-Layer backdrop and Esc handling.
 * Displays live open windows in ART (UTC-3) + automatic visitor timezone conversion,
 * supports direct Google Calendar booking (with Google Meet + email invites to both parties),
 * and provides 1-click WhatsApp / Email / Copy fallbacks.
 */
export function AvailabilityModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const { lang, t } = useLanguage();
  const av = t.availability;

  const [duration, setDuration] = useState(30);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Booking form state
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedSlot, setCopiedSlot] = useState(false);

  const visitorTz = useMemo(() => getVisitorTimezone(), []);
  const showVisitorTz = useMemo(() => isDifferentFromArgentina(visitorTz), [visitorTz]);

  const { availability, loading, refresh } = useAvailability({
    enabled: isOpen,
    durationMinutes: duration
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

  const days = availability?.days || [];
  const activeDay = days[selectedDayIndex] || days[0] || null;

  // Reset selected slot when switching duration or opening fresh
  useEffect(() => {
    setSelectedSlot(null);
    setBookingError('');
  }, [duration, selectedDayIndex]);

  const handleClose = () => {
    if (submitting) return;
    setConfirmedBooking(null);
    setBookingError('');
    onClose();
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || submitting) return;
    setSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startIso: selectedSlot.start,
          durationMinutes: duration,
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

      setConfirmedBooking(json.booking);
      setSelectedSlot(null);
      refresh();
    } catch (err) {
      setBookingError(err?.message || av.bookingErrorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  const buildProposalText = () => {
    if (!selectedSlot || !activeDay) return '';
    const dayLabel = lang === 'es' ? activeDay.dayLabelEs : activeDay.dayLabelEn;
    const localTime = showVisitorTz
      ? ` (${formatSlotInTimezone(selectedSlot.start, visitorTz)} ${visitorTz})`
      : '';
    if (lang === 'es') {
      return `Hola Carlos, vi tu disponibilidad en tu portfolio. ¿Podemos coordinar una entrevista de ${duration} min el ${dayLabel} a las ${selectedSlot.labelArt} ART${localTime}?`;
    }
    return `Hi Carlos, I checked your availability on your portfolio. Could we schedule a ${duration}-min interview on ${dayLabel} at ${selectedSlot.labelArt} ART${localTime}?`;
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
    proposalText || (lang === 'es' ? 'Hola Carlos, me gustaría coordinar una entrevista.' : 'Hi Carlos, I would like to schedule an interview.')
  )}`;
  const emailHref = `mailto:${professionalData.personal.email}?subject=${encodeURIComponent(
    lang === 'es' ? 'Coordinar entrevista — Carlos Jesús' : 'Interview Scheduling — Carlos Jesús'
  )}&body=${encodeURIComponent(proposalText)}`;

  const bookingEnabled = Boolean(availability?.bookingEnabled);

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
      className="precision-dialog m-auto w-[min(94vw,44rem)]"
    >
      <div className="max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/12 bg-surface/98 text-zinc-100 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-surface/95 px-6 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {bookingEnabled ? av.liveSynced : av.standardWindowBadge}
              </span>
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

        <div className="p-6">
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

              <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-obsidian/80 p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-400">{av.whenLabel}</span>
                  <span className="font-mono font-semibold text-white">
                    {confirmedBooking.startIso.slice(0, 10)} ·{' '}
                    {confirmedBooking.startIso.slice(11, 16)}–{confirmedBooking.endIso.slice(11, 16)}{' '}
                    ART
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-400">{av.durationLabel}</span>
                  <span className="font-mono text-cyan-300">
                    {confirmedBooking.durationMinutes} min
                  </span>
                </div>
                {confirmedBooking.meetLink && (
                  <div className="pt-2 border-t border-white/10">
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
              {/* Top Controls: Duration + Timezone indicator */}
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

              {/* Day Selector Strip */}
              {loading && days.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {days.map((day, idx) => {
                      const isSelected = idx === selectedDayIndex;
                      const slotCount = day.slots?.length || 0;
                      return (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => setSelectedDayIndex(idx)}
                          className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all ${
                            isSelected
                              ? 'border-cyan-400/50 bg-cyan-400/12 text-white'
                              : 'border-white/[0.08] bg-obsidian/70 text-zinc-300 hover:border-white/20'
                          }`}
                        >
                          <span className="font-display text-xs font-bold">
                            {lang === 'es' ? day.dayLabelEs : day.dayLabelEn}
                          </span>
                          <span
                            className={`mt-0.5 font-mono text-[10px] ${
                              slotCount > 0 ? 'text-emerald-300' : 'text-zinc-500'
                            }`}
                          >
                            {slotCount > 0 ? `${slotCount} ${av.slotsWord}` : av.noSlotsDay}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Open Slots Grid */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        <Calendar className="mr-1.5 inline h-3.5 w-3.5 text-cyan-400" />
                        {av.pickSlotLabel}
                      </span>
                      {activeDay?.freeWindows?.length > 0 && (
                        <span className="font-mono text-[11px] text-zinc-500">
                          {activeDay.freeWindows.map((w) => w.labelArt).join(' · ')} ART
                        </span>
                      )}
                    </div>

                    {activeDay?.slots?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {activeDay.slots.map((slot) => {
                          const isChosen = selectedSlot?.start === slot.start;
                          const localFormatted = showVisitorTz
                            ? formatSlotInTimezone(slot.start, visitorTz)
                            : null;
                          return (
                            <button
                              key={slot.start}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                setBookingError('');
                              }}
                              className={`flex flex-col items-center justify-center rounded-xl border px-2.5 py-2 font-mono transition-all ${
                                isChosen
                                  ? 'border-cyan-300 bg-gradient-to-br from-cyan-400/25 to-indigo-500/25 text-white ring-1 ring-cyan-300/60'
                                  : 'border-white/10 bg-obsidian/80 text-zinc-200 hover:border-cyan-400/40 hover:bg-cyan-400/10'
                              }`}
                            >
                              <span className="text-xs font-semibold">{slot.labelArt} ART</span>
                              {localFormatted && (
                                <span className="text-[10px] text-zinc-400">
                                  {localFormatted} local
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/[0.08] bg-obsidian/60 px-4 py-6 text-center text-xs text-zinc-400">
                        {av.noSlotsSelectedDay}
                      </div>
                    )}
                  </div>

                  {/* Booking Form (visible once a slot is selected) */}
                  {selectedSlot && activeDay && (
                    <div className="rounded-2xl border border-cyan-400/25 bg-obsidian/85 p-4 sm:p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="text-xs">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                            {av.selectedSlotHeading}
                          </span>
                          <p className="mt-0.5 font-display text-sm font-bold text-white">
                            {lang === 'es' ? activeDay.dayLabelEs : activeDay.dayLabelEn} ·{' '}
                            {selectedSlot.labelArt} ART ({duration} min)
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
                        <form onSubmit={handleBookSubmit} className="space-y-3">
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
                            </div>
                            <div className="sm:col-span-2">
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
                            <p className="text-[11px] text-zinc-400">{av.inviteNotice}</p>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-xs font-semibold text-zinc-950 transition-all hover:brightness-110 disabled:opacity-50"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>{submitting ? av.bookingSubmitting : av.confirmBookingBtn}</span>
                            </button>
                          </div>
                        </form>
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
