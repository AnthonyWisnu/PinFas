import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

const styles = StyleSheet.create({
  page: { padding: 56, fontSize: 10, fontFamily: 'Helvetica', color: '#0D2137' },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  logo: { width: 52, height: 52, objectFit: 'contain' },
  instansi: { flex: 1, textAlign: 'center' },
  instansiTitle: { fontSize: 16, fontWeight: 700, textTransform: 'uppercase' },
  lineBold: { height: 2, backgroundColor: '#0D2137', marginTop: 4 },
  lineThin: { height: 1, backgroundColor: '#0D2137', marginTop: 2, marginBottom: 18 },
  title: { textAlign: 'center', fontSize: 13, fontWeight: 700, textDecoration: 'underline' },
  nomor: { textAlign: 'center', marginTop: 4, marginBottom: 18 },
  paragraph: { lineHeight: 1.55, marginBottom: 10 },
  table: { borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 12 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E1' },
  rowLast: { flexDirection: 'row' },
  cellLabel: { width: 130, padding: 6, backgroundColor: '#F4F7FB', fontWeight: 700 },
  cellValue: { flex: 1, padding: 6 },
  footer: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  qr: { width: 80, height: 80 },
  signature: { width: 180, textAlign: 'center' },
  signatureSpace: { height: 58 },
  small: { fontSize: 8, color: '#475569', marginTop: 4 },
})

function DataRow({ label, value, last = false }) {
  return (
    <View style={last ? styles.rowLast : styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value ?? '-'}</Text>
    </View>
  )
}

export function SuratIzinPDF({ surat, konfigurasi, verificationBaseUrl, qrDataUrl }) {
  const baseUrl = verificationBaseUrl ?? 'https://pinfas.local'
  const verifyUrl = `${baseUrl}/verifikasi/${surat.nomorPengajuan}`
  const instansi = konfigurasi?.namaInstansi ?? 'Desa/Kelurahan'
  const alamat = konfigurasi?.alamat ?? '-'
  const jabatan = surat.jabatanAdmin ?? 'Petugas Berwenang'
  const admin = surat.namaAdmin ?? '-'

  return (
    <Document title={`Surat Izin ${surat.nomorPengajuan}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {konfigurasi?.logoUrl ? <Image src={konfigurasi.logoUrl} style={styles.logo} /> : <View style={styles.logo} />}
          <View style={styles.instansi}>
            <Text style={styles.instansiTitle}>{instansi}</Text>
            <Text>{alamat}</Text>
          </View>
          <View style={styles.logo} />
        </View>
        <View style={styles.lineBold} />
        <View style={styles.lineThin} />
        <Text style={styles.title}>SURAT IZIN PEMINJAMAN FASILITAS</Text>
        <Text style={styles.nomor}>Nomor: {surat.nomorPengajuan}</Text>
        <Text style={styles.paragraph}>
          Yang bertanda tangan di bawah ini menerangkan bahwa pemohon berikut telah mendapatkan izin peminjaman fasilitas
          sesuai data dan ketentuan yang tercantum dalam surat ini.
        </Text>
        <View style={styles.table}>
          <DataRow label="Nama" value={surat.nama} />
          <DataRow label="NIK" value={surat.nik} />
          <DataRow label="Banjar Asal" value={surat.banjarAsal} />
          <DataRow label="Nomor HP" value={surat.nomorHp} />
          <DataRow label="Estimasi Tamu" value={surat.estimasiTamu ? `${surat.estimasiTamu} orang` : '-'} last />
        </View>
        <View style={styles.table}>
          <DataRow label="Nama Aset" value={surat.namaAset} />
          <DataRow label="Lokasi" value={surat.lokasiAset} />
          <DataRow label="Keperluan" value={surat.keperluan} />
          <DataRow label="Tanggal Mulai" value={formatDate(surat.tanggalMulai)} />
          <DataRow label="Tanggal Selesai" value={formatDate(surat.tanggalSelesai)} />
          <DataRow label="Durasi" value={`${surat.durasiHari ?? 0} hari`} />
          <DataRow label="Biaya Sewa" value={formatCurrency(surat.totalBiaya)} last />
        </View>
        <Text style={styles.paragraph}>
          Pemohon wajib menjaga fasilitas selama masa peminjaman dan mengembalikan fasilitas sesuai kondisi awal.
          Surat ini sah apabila status verifikasi menunjukkan valid.
        </Text>
        <View style={styles.footer}>
          <View>
            {qrDataUrl ? <Image src={qrDataUrl} style={styles.qr} /> : null}
            <Text style={styles.small}>Scan untuk verifikasi keaslian</Text>
            <Text style={styles.small}>{surat.nomorPengajuan}</Text>
            <Text style={styles.small}>{verifyUrl}</Text>
          </View>
          <View style={styles.signature}>
            <Text>{formatDate(surat.approvedAt ?? new Date(), { fallback: '-' })}</Text>
            <Text>{jabatan}</Text>
            <View style={styles.signatureSpace} />
            <Text>{admin}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
