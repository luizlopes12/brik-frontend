import { createContext, useState } from "react";

const bannerPreviewContext = createContext()
const BannerPreviewProvider = ({children}) =>{
    
  const [bannerPreview, setBannerPreview] = useState(false) 

    return <bannerPreviewContext.Provider value={{bannerPreview, setBannerPreview}}>{children}</bannerPreviewContext.Provider>
}

export {BannerPreviewProvider, bannerPreviewContext};