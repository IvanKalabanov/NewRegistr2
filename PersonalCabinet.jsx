import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalCabinet.css';

const DataRow = ({ label, value }) => (
    <div className="data-row">
        <span className="data-label">{label}</span>
        <span className="dots">......</span>
        <span className="data-value">{value || 'Не указано'}</span>
    </div>
);

const PersonalCabinet = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Загружаем данные из localStorage
    const [userData, setUserData] = useState(() => {
        const savedData = localStorage.getItem('userData');
        return savedData ? JSON.parse(savedData) : {
            login: '',
            email: '',
            lastName: '',
            firstName: '',
            middleName: '',
            gender: '',
            phone: '',
            city: '',
            street: '',
            house: '',
            building: '',
            birthDate: '',
            completionStatus: '0%'
        };
    });

    // Форма редактирования
    const [editForm, setEditForm] = useState({ ...userData });

    // Обновляем форму редактирования при изменении userData
    useEffect(() => {
        setEditForm({ ...userData });
    }, [userData]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleContactClick = () => {
        setShowContactModal(true);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleChangePasswordClick = () => {
        setShowChangePasswordModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('userData');
        setShowLogoutModal(false);
        navigate('/registr');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmitMessage = () => {
        console.log('Отправлено сообщение:', message);
        setShowContactModal(false);
        setMessage('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveChanges = async () => {
        const filledFields = Object.values(editForm).filter(v => v).length;
        const totalFields = Object.keys(editForm).length - 1;
        const newCompletionStatus = `${Math.round((filledFields / totalFields) * 100)}%`;
        
        const updatedData = {
            ...editForm,
            completionStatus: newCompletionStatus
        };
        
        try {
            // Обновляем данные в Firestore
            await updateDoc(doc(db, "users", userData.email), updatedData);
            
            // Обновляем localStorage
            setUserData(updatedData);
            localStorage.setItem('userData', JSON.stringify(updatedData));
            
            setShowEditModal(false);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            alert("Произошла ошибка при сохранении данных");
        }
    };

    const savePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Новый пароль и подтверждение не совпадают");
            return;
        }

        try {
            // Обновляем пароль в Firestore
            await updateDoc(doc(db, "users", userData.email), {
                password: passwordData.newPassword
            });
            
            // Обновляем localStorage
            const updatedData = { ...userData, password: passwordData.newPassword };
            setUserData(updatedData);
            localStorage.setItem('userData', JSON.stringify(updatedData));
            
            setShowChangePasswordModal(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            alert("Пароль успешно изменен");
        } catch (error) {
            console.error("Ошибка при изменении пароля:", error);
            alert("Произошла ошибка при изменении пароля");
        }
    };

    const cancelEdit = () => {
        setShowEditModal(false);
    };

    const cancelContact = () => {
        setShowContactModal(false);
        setMessage('');
    };

    const cancelPasswordChange = () => {
        setShowChangePasswordModal(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="personal-cabinet">
            <header className="cabinet-header">
                <div className="header-content">
                    <h1>Личный кабинет</h1>
                    <div className="header-actions">
                        <button className="contact-btn" onClick={handleContactClick}>Написать нам</button>
                        <button className="logout-btn" onClick={handleLogoutClick}>Выйти</button>
                    </div>
                </div>
            </header>

            <main className="cabinet-main-content">
                <section className="user-info-section">
                    <div className="user-profile">
                        <h2 className="username">
                            {userData.lastName} {userData.firstName} {userData.middleName}
                        </h2>
                        <span className="completion-status">Заполнено на {userData.completionStatus}</span>
                    </div>
                    
                    <div className="user-actions">
                        <button className="action-btn" onClick={handleEditClick}>Редактировать данные</button>
                        <button className="action-btn" onClick={handleChangePasswordClick}>Изменить пароль</button>
                    </div>
                </section>

                <section className="user-data-section">
                    <div className="data-grid">
                        <DataRow label="Логин" value={userData.login} />
                        <DataRow label="Фамилия" value={userData.lastName} />
                        <DataRow label="Имя" value={userData.firstName} />
                        <DataRow label="Отчество" value={userData.middleName} />
                        <DataRow label="E-mail" value={userData.email} />
                        <DataRow label="Телефон" value={userData.phone} />
                        <DataRow label="Пол" value={userData.gender} />
                        <DataRow label="Город" value={userData.city} />
                        <DataRow label="Улица" value={userData.street} />
                        <DataRow label="Дом" value={userData.house} />
                        <DataRow label="Корпус" value={userData.building} />
                        <DataRow label="Дата рождения" value={userData.birthDate} />
                    </div>
                </section>
            </main>

            {/* Модальные окна */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Подтверждение выхода</h3>
                        <p>Вы действительно хотите выйти из личного кабинета?</p>
                        <div className="modal-actions">
                            <button className="modal-btn confirm-btn" onClick={confirmLogout}>Да, выйти</button>
                            <button className="modal-btn cancel-btn" onClick={cancelLogout}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            {showContactModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Написать нам</h3>
                        <textarea
                            className="message-input"
                            value={message}
                            onChange={handleMessageChange}
                            placeholder="Введите ваше сообщение..."
                            rows="5"
                        />
                        <div className="modal-actions">
                            <button className="modal-btn confirm-btn" onClick={handleSubmitMessage}>Отправить</button>
                            <button className="modal-btn cancel-btn" onClick={cancelContact}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h3>Редактирование данных</h3>
                        <form className="edit-form">
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Фамилия</label>
                                    <input type="text" name="lastName" value={editForm.lastName} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Имя</label>
                                    <input type="text" name="firstName" value={editForm.firstName} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Отчество</label>
                                    <input type="text" name="middleName" value={editForm.middleName} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input type="email" name="email" value={editForm.email} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Пол</label>
                                    <select name="gender" value={editForm.gender} onChange={handleEditChange}>
                                        <option value="">Не указано</option>
                                        <option value="мужской">Мужской</option>
                                        <option value="женский">Женский</option>
                                        <option value="другое">Другое</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Дата рождения</label>
                                    <input type="date" name="birthDate" value={editForm.birthDate} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Город</label>
                                    <input type="text" name="city" value={editForm.city} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Улица</label>
                                    <input type="text" name="street" value={editForm.street} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Дом</label>
                                    <input type="text" name="house" value={editForm.house} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Корпус</label>
                                    <input type="text" name="building" value={editForm.building} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="modal-btn confirm-btn" onClick={saveChanges}>Сохранить</button>
                                <button type="button" className="modal-btn cancel-btn" onClick={cancelEdit}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showChangePasswordModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Изменение пароля</h3>
                        <div className="password-form">
                            <div className="form-group">
                                <label>Текущий пароль</label>
                                <input 
                                    type="password" 
                                    name="currentPassword" 
                                    value={passwordData.currentPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="Введите текущий пароль" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Новый пароль</label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    value={passwordData.newPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="Введите новый пароль" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Подтвердите новый пароль</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={passwordData.confirmPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="Повторите новый пароль" 
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn confirm-btn" onClick={savePassword}>Сохранить</button>
                            <button className="modal-btn cancel-btn" onClick={cancelPasswordChange}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalCabinet;