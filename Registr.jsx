import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registr.css';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        email: '',
        lastName: '',
        firstName: '',
        middleName: '',
        gender: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Для чекбоксов обрабатываем отдельно
        const val = type === 'checkbox' ? (checked ? value : '') : value;
        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userData = {
            ...formData,
            phone: '',
            city: '',
            street: '',
            house: '',
            building: '',
            birthDate: '',
            completionStatus: '20%',
            createdAt: new Date().toISOString()
        };

        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            
            navigate('/proj');
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
            alert("Произошла ошибка при регистрации");
        }
    };

    const handleLoginRedirect = () => {
        navigate('/auth');
    };

    return (
        <div className="registration-container">
            <h2>Форма регистрации</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-label">Логин</div>
                    <input type="text" name="login" value={formData.login} 
                           onChange={handleChange} placeholder="Введите логин" 
                           className="form-input" required />
                </div>

                <div className="form-row">
                    <div className="form-label">Пароль</div>
                    <input type="password" name="password" value={formData.password} 
                           onChange={handleChange} placeholder="Введите пароль" 
                           className="form-input" required />
                </div>

                <div className="form-row">
                    <div className="form-label">Электронная почта</div>
                    <input type="email" name="email" value={formData.email} 
                           onChange={handleChange} placeholder="Введите электронную почту" 
                           className="form-input" required />
                </div>

                <div className="form-row">
                    <div className="form-label">Фамилия</div>
                    <input type="text" name="lastName" value={formData.lastName} 
                           onChange={handleChange} placeholder="Введите фамилию" 
                           className="form-input" required />
                </div>

                <div className="form-row">
                    <div className="form-label">Имя</div>
                    <input type="text" name="firstName" value={formData.firstName} 
                           onChange={handleChange} placeholder="Введите своё имя" 
                           className="form-input" required />
                </div>

                <div className="form-row">
                    <div className="form-label">Отчество</div>
                    <input type="text" name="middleName" value={formData.middleName} 
                           onChange={handleChange} placeholder="Введите своё отчество" 
                           className="form-input" />
                </div>

                <div className="form-row">
                    <div className="form-label">Пол</div>
                    <div className="gender-options">
                        {['мужской', 'женский', 'другое'].map(gender => (
                            <label key={gender} className="gender-option">
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value={gender}
                                    checked={formData.gender === gender}
                                    onChange={handleChange}
                                />
                                <p className='gtext'>
                                    {gender === 'мужской' ? 'Муж.' : 
                                     gender === 'женский' ? 'Жен.' : 'Другое...'}
                                </p>
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">Зарегистрироваться</button>
                
                <div className="login-link">
                    Уже есть аккаунт? 
                    <button type="button" className='log' onClick={handleLoginRedirect}>Войти</button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;