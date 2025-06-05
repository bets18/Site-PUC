import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Phone, Building2, MapPin, FileText, Briefcase } from 'lucide-react';
import './App.css';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function PUCRestaurantRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRestaurantForm, setIsRestaurantForm] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    // Campos para restaurante
    restaurantName: '',
    responsibleName: '',
    rg: '',
    cnpj: '',
    restaurantPhone: '',
    address: '',
    cep: '',
    businessLicense: '',
    foodLicense: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Se não houver números, retorna string vazia
    if (numbers.length === 0) {
      return '';
    }
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    }
    if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    }
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  };

  const formatDate = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos (ddmmaaaa)
    const limitedNumbers = numbers.slice(0, 8);
    
    // Aplica a máscara dd/mm/aaaa
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    }
    if (limitedNumbers.length <= 4) {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
    }
    return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2, 4)}/${limitedNumbers.slice(4)}`;
  };

  const validateDate = (dateStr) => {
    // Remove as barras para pegar apenas os números
    const numbers = dateStr.replace(/\D/g, '');
    if (numbers.length !== 8) return false;

    const day = parseInt(numbers.slice(0, 2));
    const month = parseInt(numbers.slice(2, 4));
    const year = parseInt(numbers.slice(4, 8));

    // Verifica se o ano está em um intervalo razoável (entre 1900 e o ano atual)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) return false;

    // Verifica se o mês é válido
    if (month < 1 || month > 12) return false;

    // Array com o número de dias em cada mês
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ajusta fevereiro para anos bissextos
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      daysInMonth[1] = 29;
    }

    // Verifica se o dia é válido para o mês
    return day > 0 && day <= daysInMonth[month - 1];
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'phone') {
      const value = e.target.value;
      if (value.length < formData.phone.length) {
        const numbers = value.replace(/\D/g, '');
        setFormData({
          ...formData,
          [e.target.name]: formatPhone(numbers)
        });
      } else {
        setFormData({
          ...formData,
          [e.target.name]: formatPhone(value)
        });
      }
    } else if (e.target.name === 'birthDate') {
      const value = e.target.value;
      if (value.length < formData.birthDate.length) {
        const numbers = value.replace(/\D/g, '');
        setFormData({
          ...formData,
          birthDate: formatDate(numbers)
        });
      } else {
        const formattedDate = formatDate(value);
        setFormData({
          ...formData,
          birthDate: formattedDate
        });
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRestaurantForm) {
        // Lógica de cadastro de restaurante
        // Implemente a lógica para salvar os dados do restaurante no banco de dados
        console.log('Restaurante cadastrado com sucesso!');
      } else {
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
          // Validação específica para a data
          if (!validateDate(formData.birthDate)) {
            setError('Data de nascimento inválida');
            return;
          }
          // Lógica de registro
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          console.log('Conta criada com sucesso!');
        }
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
          setError('Erro ao ' + (isRestaurantForm ? 'cadastrar o restaurante' : (isLogin ? 'fazer login' : 'criar conta')) + '. Tente novamente.');
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
      confirmPassword: '',
      restaurantName: '',
      responsibleName: '',
      rg: '',
      cnpj: '',
      restaurantPhone: '',
      address: '',
      cep: '',
      businessLicense: '',
      foodLicense: ''
    });
  };

  const toggleRestaurantForm = () => {
    setIsRestaurantForm(!isRestaurantForm);
    setSlideDirection(isRestaurantForm ? 'right' : 'left');
    setError('');
    setFormData({
      ...formData,
      restaurantName: '',
      responsibleName: '',
      rg: '',
      cnpj: '',
      restaurantPhone: '',
      address: '',
      cep: '',
      businessLicense: '',
      foodLicense: ''
    });
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
    }
    return numbers.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  const formatRG = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 9) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3-$4');
    }
    return numbers.slice(0, 9).replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3-$4');
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/g, '$1-$2');
    }
    return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/g, '$1-$2');
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
              <h2 className="text-2xl font-semibold mb-2" style={{color: '#002347'}}>
                {isRestaurantForm ? 'Cadastrar Restaurante' : (isLogin ? 'Fazer Login' : 'Criar Conta')}
              </h2>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRestaurantForm ? (
                <>
                  {/* Campo Nome do Restaurante */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="restaurantName"
                      placeholder="Nome do Restaurante"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      maxLength={100}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Campo Nome do Responsável */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="responsibleName"
                      placeholder="Nome do Responsável Legal"
                      value={formData.responsibleName}
                      onChange={handleInputChange}
                      maxLength={100}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Container para RG e CNPJ */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Campo RG */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="rg"
                        placeholder="RG"
                        value={formData.rg}
                        onChange={(e) => {
                          const formatted = formatRG(e.target.value);
                          setFormData({...formData, rg: formatted});
                        }}
                        maxLength={12}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                        required
                      />
                    </div>

                    {/* Campo CNPJ */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="cnpj"
                        placeholder="CNPJ"
                        value={formData.cnpj}
                        onChange={(e) => {
                          const formatted = formatCNPJ(e.target.value);
                          setFormData({...formData, cnpj: formatted});
                        }}
                        maxLength={18}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Telefone do Restaurante */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="restaurantPhone"
                      placeholder="Telefone do Restaurante"
                      value={formData.restaurantPhone}
                      onChange={handleInputChange}
                      maxLength={15}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Campo CEP */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cep"
                      placeholder="CEP"
                      value={formData.cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        setFormData({...formData, cep: formatted});
                      }}
                      maxLength={9}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Campo Endereço */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Endereço completo (Rua, Número, Bairro, Cidade, Estado)"
                      value={formData.address}
                      onChange={handleInputChange}
                      maxLength={200}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Campo Alvará */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="businessLicense"
                      placeholder="Número do Alvará"
                      value={formData.businessLicense}
                      onChange={handleInputChange}
                      maxLength={50}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>

                  {/* Campo Licença Sanitária */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="foodLicense"
                      placeholder="Número da Licença Sanitária"
                      value={formData.foodLicense}
                      onChange={handleInputChange}
                      maxLength={50}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Campos visíveis apenas no registro */}
                  {!isLogin && (
                    <>
                      {/* Campo Nome Completo */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
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
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="(21) 99999-9999"
                            value={formData.phone}
                            onChange={handleInputChange}
                            maxLength={15}
                            pattern="\([0-9]{2}\) [0-9]{5}-[0-9]{4}"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                          />
                        </div>

                        {/* Campo Data de Nascimento */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="birthDate"
                            placeholder="dd/mm/aaaa"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            maxLength={10}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm focus:outline-none focus:ring-yellow-400 input-focus-animation bg-gray-50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Campo Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
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
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 shine-on-hover" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 shine-on-hover" />
                        )}
                      </button>
                    </div>
                  )}
                </>
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
                {loading ? 'Carregando...' : (isRestaurantForm ? 'Cadastrar Restaurante' : (isLogin ? 'Entrar' : 'Criar Conta'))}
              </button>
            </form>

            {/* Links de alternância */}
            <div className="text-center">
              {!isRestaurantForm ? (
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
              ) : (
                <p className="text-gray-600 text-sm">
                  <button 
                    onClick={toggleRestaurantForm}
                    className="font-semibold hover:underline shine-on-hover" 
                    style={{color: '#002347'}}
                  >
                    Voltar para Criar Conta
                  </button>
                </p>
              )}
            </div>

            {/* Link para Cadastro de Restaurante - Mostrar apenas quando não estiver no formulário de restaurante */}
            {!isRestaurantForm && (
              <div className="text-center mt-4 border-t pt-4">
                <p className="text-gray-600 text-sm">
                  Quer cadastrar seu restaurante?{' '}
                  <button 
                    onClick={toggleRestaurantForm}
                    className="font-semibold hover:underline shine-on-hover" 
                    style={{color: '#002347'}}
                  >
                    Registrar Restaurante
                  </button>
                </p>
              </div>
            )}

            {/* Termos e Condições */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Ao {isRestaurantForm ? 'cadastrar seu restaurante' : (isLogin ? 'entrar' : 'criar sua conta')}, você concorda com nossos{' '}
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