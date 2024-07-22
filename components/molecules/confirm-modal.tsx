import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms"

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, onCancel }: ConfirmModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="text-black">
      <DialogHeader>
        <DialogTitle>Konfirmasi Booking</DialogTitle>
      </DialogHeader>
      <p>Apakah Anda yakin untuk melanjutkan proses ke cetak nomor antrian?</p>
      <DialogFooter>
        <Button variant="destructive" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Lanjutkan
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default ConfirmModal
