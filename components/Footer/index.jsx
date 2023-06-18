import React from "react";
import style from "./style.module.scss";

const Footer = ({
  brandLogo,
  instagramIcon,
  linkedinIcon,
  facebookIcon,
  twitterIcon,
}) => {
  return (
    <section className={style.footerSection}>
      <div className={style.footerContainer}>
        <div className={style.contact}>
          <div className={style.footerItem}>
            <span className={style.itemTitle}>Telefone</span>
            <span className={style.itemContent}>+55 (13) 99679-8101</span>
          </div>

          <div className={style.footerItem}>
            <span className={style.itemTitle}>Email</span>
            <span className={style.itemContent}>
              atendimento@brikempreendimentos.com
            </span>
          </div>
          <div className={style.footerItem}>
            <span className={style.itemTitle}>Endereço</span>
            <span className={style.itemContent}>
              Rua Tamekichi Osawa, 348 - Vila Sao Nicolau, Registro - SP
            </span>
          </div>
          <div className={style.footerItem}>
            <span className={style.itemTitle}>Redes sociais</span>
            <span className={style.socials}>
              <a href="#">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="#">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#">
                <img src={twitterIcon} alt="Twitter" />
              </a>
            </span>
          </div>
        </div>
        <div className={style.about}>
          <img src={brandLogo} alt="BRIK" />
          <p>
            A origem da logo vem das iniciais dos fundadores da empresa, Brandão
            e Ikeda. A ideia é que a logo seja uma marca forte e que remeta a
            confiança e a solidez da empresa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
