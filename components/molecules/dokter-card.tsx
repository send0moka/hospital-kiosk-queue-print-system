import Image from 'next/image'

interface DokterCardProps {
  nama: string
  foto: string
  spesialisasi: string
  onClick: () => void
}

const DokterCard: React.FC<DokterCardProps> = ({ nama, foto, spesialisasi, onClick }) => {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer bg-white min-w-[560px] pl-3 py-2 rounded-lg transition-transform hover:scale-105"
      onClick={onClick}
    >
        <Image 
          src={`/icons/dokter/${foto}.svg`} 
          alt={nama} 
          width={65} 
          height={65}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/icons/dokter/joko.png';
          }}
          className='rounded-full h-fit'
        />
      <div className="text-black">
        <h3 className="font-bold text-xl">{nama}</h3>
        <p>{spesialisasi}</p>
      </div>
    </div>
  )
}

export default DokterCard