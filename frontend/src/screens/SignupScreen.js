import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validatePassword = () => {
    if (password.trim() === '') {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
    } else if (password.length < 5) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
    } else if (password.length > 19) {
      setPasswordError('La contraseña no puede tener más de 20 caracteres.');
    } else {
      setPasswordError('');
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === '') {
      setEmailError('El campo de correo electrónico no puede estar vacío.');
    } else if (!emailRegex.test(value)) {
      setEmailError('Ingrese un correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };
  

  return (
    <Container className="small-container">
      <Helmet>
        <title>Registrar</title>
      </Helmet>
      <h1 className="my-3">Registrar</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo Electronico</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value)
              validateEmail(e.target.value);
            }}
          />
          {emailError && <Form.Text style={{color: 'red'}}>{emailError}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value)
              validatePassword(e.target.value);
            }}
          />
          {passwordError && <Form.Text style={{color: 'red'}}>{passwordError}</Form.Text>}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={!!passwordError || !!emailError}>Registrarse</Button>
        </div>
        <div className="mb-3">
          ¿Ya Tienes una Cuenta?{' '}
          <Link style={{ color: "#ee4988" }} to={`/signin?redirect=${redirect}`}>Registrarse</Link>
        </div>
      </Form>
    </Container>
  );
}
