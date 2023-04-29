import React,{useState} from 'react'
import style from './style.module.scss'
import Link from 'next/link'


const UserNavBar = ({ imageSrc, treeIcon, homeIcon, userImage }) => {
    const [isActive, setIsActive] = useState({
        urban: true,
        rural: false,
        actions: false
    })

    const handleSwitchType = (e) => {
        const { active } = e.target.dataset
        if(active === 'true') return
        setIsActive(prev => ({
            urban: !isActive.urban,
            rural: !isActive.rural,
            actions: prev.actions,
        }))
    }
    const handleSwitchVisibility = (e) => {
        const { active } = e.target.dataset
        if(active === 'true') return
        setIsActive((prev) => ({
            ...prev,
            actions: !isActive.actions,
        }))
    }

  return (
    <header className={style.headerContainer}>
        <nav className={style.navbarContainer}>
        <div className={style.navItem}>
            <img src={imageSrc} alt="Logo" className={style.brandLogo}/>
        </div>
        <div className={style.navItemBtns}>
            <button className={style.switchType} data-active={isActive.urban} onClick={handleSwitchType}>
                <img src={homeIcon} alt="Loteamentos Urbanos" />
                <span>
                Loteamentos Urbanos
                </span>
            </button>
            <button className={style.switchType} data-active={isActive.rural} onClick={handleSwitchType}>
                <img src={treeIcon} alt="Loteamentos Rurais" />
                <span>
                Loteamentos Rurais
                </span>
            </button>
        </div>
        <div className={style.navMenu} onClick={handleSwitchVisibility}>
                <span>...</span>
                <img src={userImage} alt="Usuário" />
                <ul className={style.userActions} data-active={isActive.actions} >
                    <li>Cadastre-se</li>
                    <li>
                    <Link href="/login">Login</Link>
                        
                    </li>
                </ul>
        </div>
        </nav>
    </header>
  )
}

export default UserNavBar