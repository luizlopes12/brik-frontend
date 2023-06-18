import React, { useState } from "react";
import { Typography, TextField, Button, CircularProgress } from "@mui/material";
import style from "./style.module.scss";
import { toast } from "react-toastify";

export async function getStaticPaths() {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/list`);
  const data = await res.json();
  const paths = data.map((lot) => ({ params: { id: lot.id.toString() } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/${params.id}`);
  const data = await res.json();
  let data2 = await fetch(`${process.env.BACKEND_URL}/divisions/list`);
  let divisionData = await data2.json();
  divisionData = divisionData
    .map((division) =>
      division.lotes.find((lote) => lote.id === data[0].id) ? division : null
    )
    .filter((division) => division !== null)[0];

  return { props: { lotData: data[0], divisionData } };
}

const Form = ({ lotData, divisionData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    rg: "",
    endereco: "",
    nacionalidade: "",
    profissao: "",
    telefone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Call your contractFill function or perform your desired fetch request here
    // You can access the form data from the formData state

    // Simulating an asynchronous operation for demonstration purposes
    await fetch(`${process.env.BACKEND_URL}/sales/contract/fill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        rg: formData.rg,
        endereco: formData.endereco,
        nacionalidade: formData.nacionalidade,
        profissao: formData.profissao,
        telefone: formData.telefone,
        loteId: lotData.id,
      }),
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Contrato preenchido com sucesso!");
      } else {
        toast.error("Erro ao preencher contrato!");
      }
    });
    setLoading(false);
  };
  return (
    <section className={style.formContainer}>
      <Typography
        variant="h4"
        component="h1"
        style={{ textAlign: "center", fontWeight: "bold", color: "#292929" }}
      >
        Formulário de compra
      </Typography>
      <Typography variant="subtitle1" className={style.subText}>
        <span>
          Preencha o formulário para que o contrato de venda seja feito
        </span>
        <span>Loteamento: {divisionData.name}</span>
        <span>Imóvel: {lotData.name}</span>
      </Typography>
      <TextField
        name="name"
        color="success"
        label="Nome"
        value={formData.name}
        onChange={handleInputChange}
      />
      <TextField
        name="email"
        color="success"
        label="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <TextField
        name="cpf"
        color="success"
        label="CPF"
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <TextField
        name="rg"
        color="success"
        label="RG"
        value={formData.rg}
        onChange={handleInputChange}
      />
      <TextField
        name="endereco"
        color="success"
        label="Endereço"
        value={formData.endereco}
        onChange={handleInputChange}
      />
      <TextField
        name="nacionalidade"
        color="success"
        label="Nacionalidade"
        value={formData.nacionalidade}
        onChange={handleInputChange}
      />
      <TextField
        name="profissao"
        color="success"
        label="Profissão"
        value={formData.profissao}
        onChange={handleInputChange}
      />
      <TextField
        name="telefone"
        color="success"
        label="Telefone"
        value={formData.telefone}
        onChange={handleInputChange}
      />

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "1rem", padding: ".8rem 1rem", fontWeight: "bold" }}
        size="large"
      >
        {loading ? <CircularProgress size={24} color="success" /> : "Enviar"}
      </Button>
    </section>
  );
};

export default Form;
