// import bgImage from '../assets/hero-bg.png'
// import multibg from '../assets/multi-bg-2.png'
import phones from '../assets/group-phones.png'

const ProductCarousel = () => {
  return (
    <div className='bg-primary mb-4'>
      {/* <img src={mdbgImage} alt="background" className="hero-bg" /> */}
      <div className='left'>
        <h1>SplashScreen</h1>
        <h2>iPhone & Macbook Wallpaper Packs</h2>
      </div>
      <div className='right'>
        <img src={phones} alt="phones" />
      </div>
    </div>
  )
}

export default ProductCarousel