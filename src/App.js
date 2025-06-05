import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Phone } from 'lucide-react';
import './App.css';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function PUCRestaurantRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Lógica de login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Login realizado com sucesso!');
      } else {
        // Validações para registro
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }
        if (!formData.fullName || !formData.phone || !formData.birthDate) {
          setError('Por favor, preencha todos os campos');
          return;
        }
        // Lógica de registro
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Conta criada com sucesso!');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está em uso');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta');
          break;
        default:
          setError('Erro ao ' + (isLogin ? 'fazer login' : 'criar conta') + '. Tente novamente.');
      }
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setSlideDirection(isLogin ? 'right' : 'left');
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen elegant-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Lado Esquerdo - Ilustração */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          {/* Ícone da PUC baseado na imagem 2 */}
          <div className="w-64 h-64 rounded-full flex items-center justify-center shadow-2xl overflow-hidden" 
               style={{
                 backgroundColor: '#002347',
                 background: '#002347'
               }}>
            <img 
              src="icone.ico" 
              alt="Logo PUC"
              className="w-48 h-48 object-contain rotate-on-hover"
            />
          </div>

          {/* Ilustração de pessoas */}
          <div className="flex space-x-6 mt-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg pulse-on-hover" 
                 style={{backgroundColor: '#D9A93A'}}>
              <User className="w-8 h-8" style={{color: '#002347'}} />
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg pulse-on-hover" 
                 style={{backgroundColor: '#002347'}}>
              <User className="w-8 h-8" style={{color: '#D9A93A'}} />
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg pulse-on-hover" 
                 style={{backgroundColor: '#D9A93A'}}>
              <User className="w-8 h-8" style={{color: '#002347'}} />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mt-6">
            <h2 className="text-4xl font-bold mb-2 animate-fade-in-up restaurant-title tracking-wide" 
                style={{
                  color: '#FFFFFF', 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '0.025em'
                }}>
              PUC Foodie
            </h2>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 max-w-md mx-auto w-full form-transition">
          <div className={`space-y-6 ${slideDirection === 'right' ? 'slide-enter' : 'slide-exit'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2" style={{color: '#002347'}}>{isLogin ? 'Fazer Login' : 'Criar Conta'}</h2>
              <p className="text-gray-600 text-sm">
              </p>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos visíveis apenas no registro */}
              {!isLogin && (
                <>
                  {/* Campo Nome Completo */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nome Completo"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                    />
                  </div>

                  {/* Container para Telefone e Data de Nascimento */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Campo Telefone */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="(21) 99999-9999"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      />
                    </div>

                    {/* Campo Data de Nascimento */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="birthDate"
                        placeholder="mm/dd/yyyy"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text'
                        }}
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campo Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                />
              </div>

              {/* Campo Senha */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={isLogin ? "Senha" : "Mínimo 8 caracteres"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 shine-on-hover" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 shine-on-hover" />
                  )}
                </button>
              </div>

              {/* Campo Confirmar Senha - apenas no registro */}
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 shine-on-hover" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 shine-on-hover" />
                    )}
                  </button>
                </div>
              )}

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                style={{
                  backgroundColor: '#D9A93A'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c49430')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#D9A93A')}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </button>
            </form>

            {/* Link para alternar entre Login e Registro */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button 
                  onClick={toggleMode}
                  className="font-semibold hover:underline shine-on-hover" 
                  style={{color: '#002347'}}
                >
                  {isLogin ? 'Criar Conta' : 'Fazer Login'}
                </button>
              </p>
            </div>

            {/* Termos e Condições */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Ao {isLogin ? 'entrar' : 'criar sua conta'}, você concorda com nossos{' '}
                <button 
                  onClick={() => {}} 
                  className="underline shine-on-hover" 
                  style={{color: '#002347'}}
                >
                  Termos de Uso
                </button>{' '}
                e{' '}
                <button 
                  onClick={() => {}} 
                  className="underline shine-on-hover" 
                  style={{color: '#002347'}}
                >
                  Política de Privacidade
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}