import React, { lazy, useRef, useState, useEffect } from "react";
import "../styles/main.scss";
import Head from "next/head";
import io from "socket.io-client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import { UserProvider } from "../context/userContext";
import LotRegisterPopUp from "../components/LotRegisterPopUp";
import LotEditPopUp from "../components/LotEditPopUp";
import RegisterSalePopUp from "../components/RegisterSalePopUp";
import DivisionRegisterPopUp from "../components/DivisionRegisterPopUp";
import BannerAddPopUp from "../components/BannerAddPopUp";
import { PopUpsProvider } from "../context/popUpsContext";
import TaxesEditPopUp from "../components/TaxesEditPopUp";
import DivisionEditPopUp from "../components/DivisionEditPopUp";
import { LotTypeProvider } from "../context/lotTypeContext";
import { LotSelectedProvider } from "../context/selectedLotContext";
import { DivisionSelectedProvider } from "../context/selectedDivisionContext";
import { GlobalDivisionsDataProvider } from "../context/globalDivisionsDataContext";
import { BannerPreviewProvider } from "../context/bannerPreviewContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // var socket = io('${process.env.BACKEND_URL}')
  return (
    <BannerPreviewProvider>
      <UserProvider>
        {router.pathname.includes("/admin") ? (
          <GlobalDivisionsDataProvider>
            <PopUpsProvider>
              <DivisionSelectedProvider>
                <LotSelectedProvider>
                  <Head>
                    <title>Brik Admin</title>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1.0"
                    />
                    <link rel="icon" href="/images/favicons/pageIcon.png" />
                  </Head>
                  <main className={styles.mainContainer}>
                    <ToastContainer />
                    <RegisterSalePopUp />
                    <BannerAddPopUp
                      defaultBanner="/images/labels/defaultBanner.png"
                      closeIcon="/images/closeIcon.svg"
                    />
                    <LotEditPopUp />
                    <LotRegisterPopUp />
                    <TaxesEditPopUp />
                    <DivisionRegisterPopUp />
                    <DivisionEditPopUp />
                    <Sidebar />
                    <section className={styles.contentContainer}>
                      <Navbar />
                      <section className={styles.content}>
                        <Component {...pageProps} />
                      </section>
                    </section>
                  </main>
                </LotSelectedProvider>
              </DivisionSelectedProvider>
            </PopUpsProvider>
          </GlobalDivisionsDataProvider>
        ) : (
          <>
            <Head>
              <title>Brik Empreendimentos</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <link rel="icon" href="/images/favicons/pageIcon.png" />
              <meta
                name="description"
                content="BRIK é uma empresa que te ajuda a encontrar e comprar o seu lote da melhor maneira possível."
              />
              <meta
                property="og:title"
                content="BRIK - O lote dos seus sonhos!"
              />
              <meta
                name="og:description"
                content="BRIK é uma empresa que te ajuda a encontrar e comprar o seu lote da melhor maneira possível."
              />
              <meta
                property="og:url"
                content="https://imoveis.brikempreendimentos.com/"
              />
              <meta property="og:type" content="website" />
              <meta
                name="robots"
                content="lotes, loteamentos, lote, loteamento, imóvel, imóveis"
              />
              <meta
                name="googlebot"
                content="lotes, loteamentos, lote, loteamento, imóvel, imóveis"
              />
            </Head>
            <main>
              <ToastContainer />
              <LotTypeProvider>
                <Component {...pageProps} />
                <ContactForm arrowIcon={"/images/arrowDownIcon.svg"} />
                <Footer
                  brandLogo={"/images/brandLogoWhite.png"}
                  instagramIcon={"/images/instagramIcon.svg"}
                  linkedinIcon={"/images/linkedinIcon.svg"}
                  facebookIcon={"/images/facebookIcon.svg"}
                  twitterIcon={"/images/twitterIcon.svg"}
                />
              </LotTypeProvider>
            </main>
          </>
        )}
      </UserProvider>
    </BannerPreviewProvider>
  );
}

export default MyApp;
