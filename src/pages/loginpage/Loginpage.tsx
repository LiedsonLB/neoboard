import React, { useState, useEffect } from 'react';
import '../loginpage/Loginpage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @ts-ignore
import { auth, provider } from '../../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Popup from '../../components/popup/Popup';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoLockClosed, IoLockClosedOutline } from 'react-icons/io5';

const LoginPage = () => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [alert, setAlert] = useState('');
    const [title, setTitle] = useState('');

    const [user] = useAuthState(auth);

    useEffect(() => {
        document.title = `NeoBoard | Logue Agora`;
    }, []);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
            setAlert('alert');
            setTitle('Atenção');
            setMensagem('Por favor, preencha todos os campos.');
            hideMessageAfterTimeout();
            return;
        }
        try {
            //await axios.post('http://localhost:4000/v2/login', { email, password });
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setAlert('warning');
            setTitle('Erro');
            setMensagem('Erro ao fazer login: ' + error.message);
            console.error('Erro ao fazer login:', error.message);
            hideMessageAfterTimeout();
        }
    };

    const hideMessageAfterTimeout = () => {
        setTimeout(() => {
            setMensagem('');
        }, 3000);
    };

    const handleResetSenha = async () => {
        console.log('Entrou na função handleResetSenha');
        console.log('Email fornecido:', resetEmail);
    
        // Verifica se o campo de e-mail está vazio
        if (!resetEmail) {
            console.log('E-mail está vazio. Retornando...');
            setAlert('warning');
            setTitle('Erro');
            setMensagem('Por favor, preencha o e-mail corretamente.');
            hideMessageAfterTimeout();
            return; // Retorna imediatamente se o campo de e-mail estiver vazio
        }
    
        // Verifica se o e-mail fornecido é válido usando uma expressão regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resetEmail)) {
            console.log('E-mail inválido. Retornando...');
            setAlert('warning');
            setTitle('Erro');
            setMensagem('Por favor, insira um endereço de e-mail válido.');
            hideMessageAfterTimeout();
            return; // Retorna imediatamente se o e-mail não for válido
        }
    
        console.log('Enviando solicitação de redefinição de senha...');
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            console.log('Solicitação de redefinição de senha enviada com sucesso!');
            setAlert('sucess');
            setTitle('Redefinição Enviada');
            setMensagem('Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.');
            hideMessageAfterTimeout();
        } catch (error: any) {
            console.error('Erro ao resetar a senha:', error.message);
            setAlert('warning');
            setTitle('Erro');
            setMensagem('Erro ao redefinir a senha. Verifique o e-mail fornecido.');
            hideMessageAfterTimeout();
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignin = async () => {
        //await axios.post('http://localhost:4000/v2/login', { user, email, password });
        signInWithPopup(auth, provider).then((result) => {
            const user = result.user;
            console.log('Usuário autenticado:', user);
        })
            .catch((error) => {
                setAlert('warning');
                setTitle('Erro');
                setMensagem('Erro ao autenticar: ' + error.message);
                console.error('Erro ao autenticar:', error);
            });

    };

    function handleCadaster() {
        navigate("/cadaster");
    }

    return (
        <>
            {showModal && <div className="modal-reset">
                <div className='container-reset'>
                    <div className="header-reset">
                        <h4 className="reset-title"> Redefinir Senha <IoLockClosed /> </h4>
                    </div>
                    <p className='restore-password'><span>Restauração de Senha:</span> Restaure o Acesso a Sua Conta.</p>
                    <div className='reset-email-container'>
                        <input type="email" className='input-reset-email' placeholder='Informe seu email' 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        />
                        <button className='send-reset' onClick={handleResetSenha}>Enviar</button>
                    </div>
                    <button className='cancel-reset' onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
            </div>}

            {mensagem && <Popup type={alert} title={title} text={mensagem} />}
            <div className="background-color"></div>
            <main className="container">
                <section className="left">
                    <header className="container-logo">
                        <img src="img/icon_neoboard.png" alt="NeoBoard logo" className="logo" />
                        <p className="logo-name">NeoBoard</p>
                    </header>
                    <figure id='container-img'>
                        <img src="img/loginImg.png" alt="img login" className="left-image" />
                    </figure>
                </section>

                <section className="right">
                    <header id="login-header">
                        <h2 className="title">Seja Bem-Vindo Novamente</h2>
                        <p className="subtitle">Preencha corretamente os campos</p>
                    </header>
                    <div className="login-field">
                        <form>
                            <div className="input-field">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    className="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-field">
                                <label>Senha:</label>
                                <div className='password-container'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="senha"
                                        placeholder="password487@"
                                        className="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                        id='see-password-login'
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="login-btn" onClick={handleLogin}>
                                Logar
                            </button>
                        </form>
                        <div className="container-line">
                            <hr id="line" />
                            <p className="singup-text">
                                Ainda não tem conta? <span id='link-cadaster' onClick={handleCadaster}>Cadastre-se</span>
                            </p>
                        </div>
                        <button className="login-google" onClick={handleSignin}>Login com o Google</button>
                        <span id='link-resetPassword' onClick={() => setShowModal(true)} style={{ width: 'fit-content', margin: '1.5rem auto' }}>Esqueci minha senha</span>
                    </div>
                </section>
            </main>
        </>
    )
}

export default LoginPage;