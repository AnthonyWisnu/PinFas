import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { FormDataDiri } from '../../components/pengajuan/FormDataDiri'
import { FormDetailAcara } from '../../components/pengajuan/FormDetailAcara'
import { FormKonfirmasi } from '../../components/pengajuan/FormKonfirmasi'
import { StepIndicator } from '../../components/common/StepIndicator'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { kalkulasiTarif } from '../../utils/kalkulasiTarif'
import { validasiPengajuan } from '../../utils/validasiPengajuan'
import { useAppContext } from '../../hooks/useAppContext'
import { useAset } from '../../hooks/useAset'
import { usePengajuan } from '../../hooks/usePengajuan'

const steps = [
  { id: 'data', label: 'Data Diri' },
  { id: 'acara', label: 'Detail Acara' },
  { id: 'konfirmasi', label: 'Konfirmasi' },
]

function stepForErrors(fields = {}) {
  if (fields.nik || fields.nama || fields.nomorHp || fields.banjarAsal) return 0
  if (fields.keperluan || fields.tanggalMulai || fields.tanggalSelesai || fields.estimasiTamu) return 1
  return 2
}

function createInitialForm(citizen) {
  return {
    nik: citizen?.nik ?? '',
    nama: citizen?.nama ?? '',
    nomorHp: citizen?.nomorHp ?? '',
    banjarAsal: citizen?.banjarAsal ?? '',
    estimasiTamu: '',
    keperluan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
  }
}

export function FormPengajuanPage() {
  const { id } = useParams()
  const {
    state: { currentCitizen, konfigurasi },
  } = useAppContext()
  const { aset, banjarOptions, tanggalTerpakai, blacklistTanggal, loading: asetLoading } = useAset()
  const { submitPengajuan, hitungAktif, loading, error } = usePengajuan()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => createInitialForm(currentCitizen))
  const [errors, setErrors] = useState({})
  const [fotoKtpFile, setFotoKtpFile] = useState(null)
  const [buktiTransferFile, setBuktiTransferFile] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [success, setSuccess] = useState(null)
  const [submitMessage, setSubmitMessage] = useState('')
  const [checkingNik, setCheckingNik] = useState(false)

  const detail = aset.find((item) => item.id === id)
  const biaya = useMemo(() => kalkulasiTarif(detail ?? {}, form), [detail, form])

  const validateCurrent = () => {
    const validation = validasiPengajuan({
      pengajuan: form,
      aset: detail,
      konfigurasi,
      tanggalTerpakai: tanggalTerpakai.filter((item) => item.asetId === id),
      blacklistTanggal,
      pengajuanAktif: [],
    })
    setErrors(validation.errors)
    if (step === 0) return !validation.errors.nik && !validation.errors.nama && !validation.errors.nomorHp && !validation.errors.banjarAsal
    if (step === 1) return !validation.errors.keperluan && !validation.errors.tanggalMulai && !validation.errors.tanggalSelesai
    if (biaya.totalBiaya > 0 && !buktiTransferFile) {
      setSubmitMessage('Unggah bukti transfer terlebih dahulu untuk pengajuan berbayar.')
      return false
    }
    if (!agreed) {
      setSubmitMessage('Setujui syarat dan ketentuan sebelum mengirim pengajuan.')
      return false
    }
    setSubmitMessage('')
    return validation.valid && agreed
  }

  const checkNikAktif = async () => {
    if (step !== 0) return true

    setCheckingNik(true)
    const result = await hitungAktif(form.nik)
    setCheckingNik(false)

    if (result.error) {
      setSubmitMessage(result.error.message)
      return false
    }

    const jumlahAktif = Number(result.data ?? 0)

    if (jumlahAktif >= 2) {
      const message = 'NIK ini sudah memiliki 2 pengajuan aktif. Selesaikan atau kembalikan salah satu pengajuan terlebih dahulu.'
      setErrors((current) => ({ ...current, nik: message }))
      setSubmitMessage(message)
      return false
    }

    if (jumlahAktif === 1) {
      setSubmitMessage('NIK ini sudah memiliki 1 pengajuan aktif. Batas maksimal adalah 2 pengajuan aktif.')
    } else {
      setSubmitMessage('')
    }

    return true
  }

  const nextStep = async () => {
    if (!validateCurrent()) return
    if (!(await checkNikAktif())) return
    setStep((value) => Math.min(value + 1, 2))
  }

  const submit = async () => {
    if (loading) return
    setSubmitMessage('')
    if (!validateCurrent()) return
    const result = await submitPengajuan({
      aset: detail,
      konfigurasi,
      currentCitizen,
      form,
      fotoKtpFile,
      buktiTransferFile,
      banjarOptions,
    })
    if (result.error?.fields) {
      setErrors(result.error.fields)
      setStep(stepForErrors(result.error.fields))
      setSubmitMessage(result.error.message)
    } else if (result.error?.message) {
      setSubmitMessage(result.error.message)
    }
    if (result.data) setSuccess(result.data)
  }

  if (asetLoading) return <LoadingSpinner mode="section" />
  if (!detail) return <EmptyState description="Aset yang dipilih tidak ditemukan." title="Aset Tidak Tersedia" />

  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-12 text-center">
        <div className="rounded-2xl bg-secondary-pale p-8">
          <CheckCircle aria-hidden="true" className="mx-auto text-secondary" size={56} />
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">Pengajuan Berhasil Dikirim</h1>
          <p className="mt-3 font-mono text-sm font-semibold text-primary">{success.nomorPengajuan}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white" to="/lacak">Lacak Status</Link>
            <Link className="rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary" to="/">Kembali ke Katalog</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary" to={`/aset/${id}`}>
        <ArrowLeft aria-hidden="true" size={16} />
        Kembali ke Detail Aset
      </Link>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
        <p className="text-sm font-semibold text-slate-500">Pengajuan Peminjaman</p>
        <h1 className="font-display text-2xl font-bold text-primary">{detail.nama}</h1>
      </div>
      <StepIndicator currentStep={step} steps={steps} />
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
        {step === 0 ? <FormDataDiri banjarOptions={banjarOptions} currentCitizen={currentCitizen} errors={errors} value={form} onChange={setForm} /> : null}
        {step === 1 ? <FormDetailAcara errors={errors} fotoKtpFile={fotoKtpFile} value={form} onChange={setForm} onFileChange={setFotoKtpFile} /> : null}
        {step === 2 ? (
          <FormKonfirmasi
            agreed={agreed}
            aset={detail}
            biaya={biaya}
            buktiTransferFile={buktiTransferFile}
            form={form}
            konfigurasi={konfigurasi}
            onAgreeChange={setAgreed}
            onBuktiChange={setBuktiTransferFile}
          />
        ) : null}
        {submitMessage || error ? (
          <p className="mt-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#9B1C1C]">
            {submitMessage || error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-between gap-3">
          <ButtonPrimary disabled={step === 0} variant="ghost" onClick={() => setStep((value) => Math.max(value - 1, 0))}>Kembali</ButtonPrimary>
          {step < 2 ? <ButtonPrimary loading={checkingNik} onClick={nextStep}>Lanjut</ButtonPrimary> : <ButtonPrimary loading={loading} onClick={submit}>Kirim Pengajuan</ButtonPrimary>}
        </div>
      </div>
    </section>
  )
}
