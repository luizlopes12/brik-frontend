import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import nextCookies from "next-cookies";
import { useState } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';


export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
  let users = [];
  const { token, refreshToken } = cookies?cookies:{};
  await fetch(`${process.env.BACKEND_URL}/users/list`)
  .then((res) => res.json())
  .then((data) => {
    users = data;
  });

  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token,
      refreshToken,
      users,
    },
  };
}

const Configs = ({users}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [checkboxValues, setCheckboxValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState(users);
  const handleUserSelect = (event, value) => {
    setSelectedUser(value);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
    if(event.target.name === 'admin' && event.target.checked){
      setCheckboxValues({
        ...checkboxValues,
        admin: true,
        editDivisions: true,
        editLots: true,
        editPartners: true,
        editBanners: true,
        editTaxes: true,
      });
    }
  };

  const handleSubmit = async () => {
    const requestBody = {
      id: selectedUser.id,
      admin: checkboxValues.admin ?? false,
      editDivisions: checkboxValues.editDivisions ?? false,
      editLots: checkboxValues.editLots ?? false,
      editPartners: checkboxValues.editPartners ?? false,
      editBanners: checkboxValues.editBanners ?? false,
      editTaxes: checkboxValues.editTaxes ?? false,
    };
  
    console.log(requestBody);
  
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/users/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log(data.message);
        setLoading(false);
        toast.success('Permisões alteradas com sucesso!');
      } else {
        setLoading(false);
        const errorMessage = data.message || 'Erro ao alterar permissões!';
        toast.error(errorMessage);
        console.log(data.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error('Erro ao alterar permissões!');
      console.log(err);
    }
  };
  
  
  return (
    <div className={style.configsContainer}>
    <div className={style.heading}>
          <HeadingText>Configurações</HeadingText>
    </div>
    <div className={style.userSelectContainer}>
      <Autocomplete
        className={style.userSelect}
        options={usersList}
        getOptionLabel={(option) => `${option?.name} (${option?.email})`}
        renderInput={(params) => (
<TextField
  {...params}
  label="Usuário"
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#63C600',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#63C600',
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#63C600',
    },
  }}
/>

        )}
        onChange={handleUserSelect}
      />

      {selectedUser && (
        <>
        <div className={style.checkboxesContainer}>
        <FormControlLabel
            control={
              <Checkbox
              name="admin"
                checked={checkboxValues.admin || selectedUser.admin}
                onChange={handleCheckboxChange}
                color="success"
              />
            }
            label="Todos"
          />
          <FormControlLabel
            control={
              <Checkbox
              name="editDivisions"
              checked={checkboxValues.editDivisions || selectedUser.editDivisions }
              onChange={handleCheckboxChange}
              color="success"
              />
            }
            label="Editar Loteamentos"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="editLots"
                checked={checkboxValues.editLots || selectedUser.editLots  }
                onChange={handleCheckboxChange}
                color="success"
              />
            }
            label="Editar Lotes"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="editPartners"
                checked={checkboxValues.editPartners || selectedUser.editPartners }
                onChange={handleCheckboxChange}
                color="success"
                />
              }
            label="Editar Sócios"
          />
          <FormControlLabel
            control={
              <Checkbox
              name="editBanners"
              checked={checkboxValues.editBanners || selectedUser.editBanners  }
              onChange={handleCheckboxChange}
                color="success"
              />
            }
            label="Editar Banners"
            />
          <FormControlLabel
            control={
              <Checkbox
                name="editTaxes"
                checked={checkboxValues.editTaxes ||  selectedUser.editTaxes }
                onChange={handleCheckboxChange}
                color="success"
                />
              }
              label="Editar Juros"
              />
        </div>
        <Button
  variant="contained"
  onClick={handleSubmit}
  sx={{
    mt: 2,
    backgroundColor: '#7FFE00',
    color: '#141414',
    fontWeight: 'bold',
    width: 'max-content',
    alignSelf: 'flex-end',
    fontSize: '1rem',
    textTransform: 'none',
    padding: '4px 3rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#6ae800',
      fontSize: '1rem',
      textTransform: 'none',
      padding: '4px 3rem',
      boxShadow: 'none',
    },
  }}
  className={style.userSelectBtn}
>
  {loading ? <CircularProgress color="inherit" size={28} /> : 'Salvar'}
</Button>

              </>
        
      )}

      </div>

    </div>
  )
}

export default Configs