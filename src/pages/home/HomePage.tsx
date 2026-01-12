import Header from '@/components/header/Header'
import HeaderTop from '@/components/header/HeaderTop'
import { Slider } from '@/components/home/slider/Slider'
const HomePage = () => {
  return (
    <div className='w-full h-full bg-[#333]'>
      <HeaderTop />
      <Header />
      <Slider/>
      <div>Content</div>  
      <div>Footer</div>
    </div>
  )
}

export default HomePage
