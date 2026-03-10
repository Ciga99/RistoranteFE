export default function Hero ({inputH,srcImg, altIMg, title,description} : {inputH: number, srcImg: string, altIMg: string, title: string, description: string}) {
    return (
      <div className={`relative h-[${inputH}vh]`}>
        <img
          src={srcImg}
          alt={altIMg}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
}