import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  FileText,
  KeyRound,
  Lock,
  LogOut,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { SpotlightCard } from '../components/common/SpotlightCard';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminVaultPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [cvs, setCvs] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Upload state
  const [target, setTarget] = useState('certificate'); // 'certificate' | 'cv'
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState('workshop');
  const [dateLabel, setDateLabel] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const callAdminApi = async (body, tokenOverride = secret) => {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenOverride.trim()}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Error HTTP ${res.status}`);
    }
    return data;
  };

  const refreshFiles = async (tokenOverride = secret) => {
    const data = await callAdminApi({ action: 'list' }, tokenOverride);
    setCvs(data.cvs || []);
    setCertificates(data.certificates || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!secret.trim()) return;
    setLoading(true);
    setAuthError('');
    try {
      await refreshFiles(secret);
      setAuthenticated(true);
    } catch (err) {
      setAuthError(err.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.size > 4 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'El archivo supera el límite de 4 MB.' });
      return;
    }

    setUploading(true);
    setStatusMsg(null);
    try {
      const base64Data = await fileToBase64(selectedFile);
      const res = await callAdminApi({
        action: 'upload',
        target,
        fileName: selectedFile.name,
        contentType: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        base64Data,
        metadata:
          target === 'certificate'
            ? { title, issuer, category, dateLabel, skills, description, credentialUrl }
            : {}
      });

      setStatusMsg({ type: 'success', text: `Archivo subido a S3: ${res.key}` });
      setSelectedFile(null);
      setTitle('');
      setIssuer('');
      setDateLabel('');
      setSkills('');
      setDescription('');
      setCredentialUrl('');
      await refreshFiles();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`¿Eliminar ${key} de AWS S3?`)) return;
    setStatusMsg(null);
    try {
      await callAdminApi({ action: 'delete', key });
      setStatusMsg({ type: 'success', text: `Eliminado: ${key}` });
      await refreshFiles();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-24 sm:pt-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {!authenticated ? (
          <SpotlightCard className="mx-auto max-w-md p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">S3 Admin Vault</h1>
                <p className="text-xs text-zinc-400">
                  Acceso protegido con <code className="font-mono text-cyan-300">ADMIN_UPLOAD_SECRET</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-zinc-400">
                  Clave de administrador
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Ingresá ADMIN_UPLOAD_SECRET..."
                    className="w-full rounded-xl border border-white/12 bg-obsidian py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400/60"
                    autoFocus
                  />
                </div>
              </div>

              {authError && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !secret.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:brightness-110 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Desbloquear Vault'}
              </button>
            </form>
          </SpotlightCard>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                  AWS S3 Private Bucket · Authenticated
                </span>
                <h1 className="mt-1 font-display text-3xl font-bold text-white">
                  Gestor de CVs y Certificados
                </h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthenticated(false);
                  setSecret('');
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-rose-400/40 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>

            {/* Upload Form */}
            <SpotlightCard className="p-6">
              <div className="mb-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTarget('certificate');
                    setSelectedFile(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                    target === 'certificate'
                      ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/40'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Subir Certificado (PNG/JPG/WEBP/PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('cv');
                    setSelectedFile(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                    target === 'cv'
                      ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Subir CV (PDF)</span>
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-obsidian/70 px-6 py-8 text-center transition-colors hover:border-cyan-400/50">
                  <UploadCloud className="h-8 w-8 text-cyan-400" />
                  <span className="mt-2 text-sm font-medium text-zinc-200">
                    {selectedFile
                      ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`
                      : target === 'cv'
                      ? 'Seleccioná un archivo PDF (máx. 4 MB)'
                      : 'Seleccioná imagen PNG/JPG/WEBP o PDF del certificado (máx. 4 MB)'}
                  </span>
                  <input
                    type="file"
                    accept={
                      target === 'cv'
                        ? 'application/pdf,.pdf'
                        : 'application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg,.webp'
                    }
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>

                {target === 'certificate' && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título del certificado (ej. AWS Cloud Practitioner)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50"
                    />
                    <input
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="Institución (ej. Coderhouse, Coursera, UTN)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50"
                    />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400/50"
                    >
                      <option value="degree">Carrera / Título Universitario</option>
                      <option value="bootcamp">Bootcamp</option>
                      <option value="cloud-ai">Cloud &amp; IA</option>
                      <option value="fullstack">Frontend &amp; Full Stack</option>
                      <option value="workshop">Curso / Taller</option>
                    </select>
                    <input
                      type="text"
                      value={dateLabel}
                      onChange={(e) => setDateLabel(e.target.value)}
                      placeholder="Fecha o rango (ej. Mar 2019 – Dic 2023)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50"
                    />
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción breve (opcional, ej. Constancia de egreso UTN-FRGP)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50 sm:col-span-2"
                    />
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Skills separadas por coma (ej. AWS, Docker, CI/CD)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50 sm:col-span-2"
                    />
                    <input
                      type="url"
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                      placeholder="URL oficial de verificación (opcional)"
                      className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50 sm:col-span-2"
                    />
                  </div>
                )}

                {statusMsg && (
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                      statusMsg.type === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {statusMsg.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:brightness-110 disabled:opacity-40"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{uploading ? 'Subiendo a S3...' : 'Subir a AWS S3'}</span>
                </button>
              </form>
            </SpotlightCard>

            {/* Existing Files in S3 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SpotlightCard className="p-5">
                <h2 className="mb-3 font-display text-base font-bold text-white">
                  CVs en S3 ({cvs.length})
                </h2>
                <ul className="space-y-2">
                  {cvs.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-obsidian/70 px-3 py-2 text-xs"
                    >
                      <span className="truncate font-mono text-zinc-200">{item.key}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-cyan-300 hover:bg-white/10"
                          title="Abrir"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.key)}
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/15"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {cvs.length === 0 && <p className="text-xs text-zinc-500">Sin CVs en S3 todavía.</p>}
                </ul>
              </SpotlightCard>

              <SpotlightCard className="p-5">
                <h2 className="mb-3 font-display text-base font-bold text-white">
                  Certificados en S3 ({certificates.length})
                </h2>
                <ul className="space-y-2">
                  {certificates.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-obsidian/70 px-3 py-2 text-xs"
                    >
                      <span className="truncate font-mono text-zinc-200">{item.fileName}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-cyan-300 hover:bg-white/10"
                          title="Abrir"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.key)}
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/15"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {certificates.length === 0 && (
                    <p className="text-xs text-zinc-500">
                      Subí tu primer certificado arriba para guardarlo en <code className="font-mono">certificates/</code>.
                    </p>
                  )}
                </ul>
              </SpotlightCard>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
