import bgImage from '../assets/hero-bg.png'

const ProductCarousel = () => {
  return (
    <div className='bg-primary mb-4'>
      <img src={bgImage} alt="background" className="hero-bg" />
    </div>
  )
}

export default ProductCarousel