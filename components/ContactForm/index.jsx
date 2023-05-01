import React,{useState} from 'react'
import style from './style.module.scss'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

const ContactForm = ({arrowIcon}) => {
    const [contactEmail, setContactEmail] = useState({
        name: '',
        email: '',
        loading: false
    })
    const handleChangeInputs = (e) => {
        const {name, value} = e.target
        setContactEmail({...contactEmail, [name]: value})
    }

    const handleSendEmail = () => {
        setContactEmail({...contactEmail, loading: true});
        if (contactEmail.name === '' || contactEmail.email === '') {
          toast.error('Preencha todos os campos!');
          setContactEmail({...contactEmail, loading: false});
          return;
        }
        fetch(`${process.env.BACKEND_URL}/email/home`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: contactEmail.name,
            email: contactEmail.email
          })
        })
        .then(async res => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then(data => {
                data.status = res.status;
                throw data;
            });
          }
        })
        .then(data => {
          toast.success(data.message);
          setContactEmail({...contactEmail, loading: false});
        })
        .catch(err => {
          toast.error(err.message);
          setContactEmail({...contactEmail, loading: false});
        });
      };
    
  return (
    <section className={style.contactFormContainer}>
        <div className={style.linkToLanding}>
            <h1>Quem somos</h1>
            <p>Leia sobre a Brick, entre em contato ou se torne um parceiro!</p>
            <Link href={'#'} target='_blank'>Navegue para o nosso site <img src={arrowIcon} alt="" /></Link>
        </div>
        <div className={style.contactForm}>
            <h2 className={style.contactFormTitle}>Entre em contato</h2>
            <div className={style.inputs}>
            <input type="text" name='name' placeholder='Nome completo' className={style.nameInput} onChange={handleChangeInputs}/>
            <input type="email" name='email' placeholder='E-mail' className={style.emailInput} onChange={handleChangeInputs}/>
            </div>
            <button className={style.sendEmailBtn} onClick={() => handleSendEmail()}>
                {contactEmail.loading ? <CircularProgress size={20} color='inherit'/> : 'Enviar'}
            </button>
        </div>
    </section>
  )
}

export default ContactForm