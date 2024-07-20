import Image from 'next/image'

interface PoliCardProps {
  nama: string
  jumlahDokter: number
  icon: string
  onClick: () => void
}

const PoliCard: React.FC<PoliCardProps> = ({ nama, jumlahDokter, icon, onClick }) => {
  return (
    <div 
      className="flex flex-col min-w-52 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="flex-grow flex items-center justify-center bg-sky-200 rounded-t-lg p-4">
        <Image 
          src={`/images/poli/${icon}.png`} 
          alt={icon} 
          width={100} 
          height={100}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/poli/umum.png';
          }}
        />
      </div>
      <div className="bg-white text-black text-center p-2 rounded-b-lg">
        <h3 className="font-bold text-lg">{nama}</h3>
        <p className="text-sm">{jumlahDokter} Dokter</p>
      </div>
    </div>
  )
}

export default PoliCard