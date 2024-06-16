"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@chakra-ui/react";

import styles from "@/styles/LoginModal.module.css";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoginInProgress, setIsLoginInProgress] = useState(false);

    const regex = /^[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/;

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
        if (e.target.value.trim() === '') {
            setLoginError('');
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (e.target.value.trim() === '') {
            setPasswordError('');
        }
    };

    const clearLoginFields = async () => {
        setLogin('');
        setPassword('');
    };

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let loginErrorMessage = '';
        let passwordErrorMessage = '';

        if (!login) {
            loginErrorMessage = 'Пожалуйста, введите логин';
        } else if (!regex.test(login)) {
            loginErrorMessage = 'Только латинские символы';
        }

        if (!password) {
            passwordErrorMessage = 'Пожалуйста, введите пароль';
        } else if (!regex.test(password)) {
            passwordErrorMessage = 'Только латинские символы';
        }

        if (loginErrorMessage || passwordErrorMessage) {
            setLoginError(loginErrorMessage);
            setPasswordError(passwordErrorMessage);
        } else {
            setLoginError('');
            setPasswordError('');

            const result = await signIn('credentials', {
                login: login.toLowerCase(),
                password: password,
                redirect: false,
            });

            if (result?.ok) {
                router.push('/applications');
            }

            if (result?.error) {
                if (result.error === 'This login is not registered') {
                    setLoginError('Данный логин не зарегестрирован');
                } else if (result.error === 'Incorrect password') {
                    setPasswordError('Неверный пароль');
                } else {
                    setLoginError('Произошла ошибка, пожалуйста повторите');
                }
            } else {
                onClose();
            }
        }
    };

    const handleClose = () => {
        setIsLoginInProgress(false);
        onClose();
        clearLoginFields();
    };

    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const togglePasswordVisibility = () => setShowLoginPassword(!showLoginPassword);

    const initialRef = useRef(null);
    const finalRef = useRef(null);

    const useWindowSize = () => {
        const [windowSize, setWindowSize] = useState({
            width: 0,
            height: 0,
        });

        useEffect(() => {
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }

            window.addEventListener("resize", handleResize);
            handleResize();
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return windowSize;
    };

    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 768;
    const isMobileModal = windowSize.width <= 496;

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={handleClose}
            size={isMobileModal ? "xs" : "md"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Вход</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleLoginSubmit}>
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!loginError}>
                            <FormLabel>Логин</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder="Логин"
                                value={login}
                                size={isMobile ? "lg" : "md"}
                                onChange={handleUsernameChange}
                            />
                            {loginError && (
                                <div className={styles['input_error']}>{loginError}</div>
                            )}
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!passwordError}>
                            <FormLabel>Пароль</FormLabel>
                            <InputGroup size={isMobile ? "lg" : "md"}>
                                <Input
                                    type={showLoginPassword ? 'text' : 'password'}
                                    placeholder="Пароль"
                                    value={password}
                                    size={isMobile ? "lg" : "md"}
                                    onChange={handlePasswordChange}
                                />
                                <InputRightElement onClick={togglePasswordVisibility}>
                                    <div className={styles['input_password_show']}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye "><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </div>
                                </InputRightElement>
                            </InputGroup>
                            {passwordError && (
                                <div className={styles['input_error']}>{passwordError}</div>
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                    <button 
                        className={styles['login_modal_login_button']}
                    >
                        <p>
                            Войти
                        </p>
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.75 21.25L19 16l-5.25-5.25M4.996 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M13 4h12.6c.371 0 .727.105.99.293.262.187.41.442.41.707v22c0 .265-.148.52-.41.707a1.724 1.724 0 01-.99.293H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}