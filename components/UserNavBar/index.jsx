import React, { useState, useContext } from "react";
import style from "./style.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { lotTypeContext } from "../../context/lotTypeContext";

const UserNavBar = ({
  imageSrc,
  treeIcon,
  homeIcon,
  userImage,
  bannerPreview,
  navLocation,
}) => {
  const { setLotType, lotType } = useContext(lotTypeContext);
  const router = useRouter();
  const [isActive, setIsActive] = useState({
    urban: true,
    rural: false,
    actions: false,
  });
  const handleGoBackToBanners = () => {
    router.push("/admin/banners");
  };

  const handleSwitchType = (e) => {
    setLotType((prev) => (prev == "Urbano" ? "Rural" : "Urbano"));
    const { active } = e.target.dataset;
    if (active === "true") return;
    setIsActive((prev) => ({
      urban: !isActive.urban,
      rural: !isActive.rural,
      actions: prev.actions,
    }));
  };
  const handleSwitchVisibility = (e) => {
    const { active } = e.target.dataset;
    if (active === "true") return;
    setIsActive((prev) => ({
      ...prev,
      actions: !isActive.actions,
    }));
  };

  return (
    <header className={style.headerContainer}>
      <nav className={style.navbarContainer}>
        <div className={style.navItem}>
          <Link href="/">
            <img src={imageSrc} alt="Logo" className={style.brandLogo} />
          </Link>
        </div>
        {navLocation !== "details" && (
          <div className={style.navItemBtns}>
            <button
              className={style.switchType}
              data-name="urban"
              data-active={isActive.urban}
              onClick={(e) => handleSwitchType(e)}
            >
              <img src={homeIcon} alt="Loteamentos Urbanos" />
              <span>Imóveis Urbanos</span>
            </button>
            <button
              className={style.switchType}
              data-name="rural"
              data-active={isActive.rural}
              onClick={(e) => handleSwitchType(e)}
            >
              <img src={treeIcon} alt="Loteamentos Rurais" />
              <span>Imóveis Rurais</span>
            </button>
          </div>
        )}
        {bannerPreview ? (
          <button
            className={style.bannerGoBack}
            onClick={handleGoBackToBanners}
          >
            Voltar
          </button>
        ) : (
          <div className={style.navMenu} onClick={handleSwitchVisibility}>
            <span>...</span>
            <img src={userImage} alt="Usuário" />
            <ul className={style.userActions} data-active={isActive.actions}>
              <li>
                <Link href="/login">Login</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default UserNavBar;
