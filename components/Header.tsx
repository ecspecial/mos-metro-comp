"use client";
import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import Image from 'next/image';

import { Stack, useDisclosure } from '@chakra-ui/react';
import { AspectRatio, Link, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerHeader, DrawerFooter, DrawerCloseButton } from '@chakra-ui/react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
  } from '@chakra-ui/react';

import styles from '@/styles/Header.module.css';
import MetroLogo from '@/public/assets/images/mm-logo-red.svg'
import MetroIcon from '@/public/assets/images/metro-app-icon-red.svg'
import MetroIconMain from '@/public/assets/images/metro-icon.svg'

import LoginModal from './LoginModal';

export default function Header() {

	const { data: session, status, update } = useSession();
    const router = useRouter();

    useEffect(() => {
		if (status === "unauthenticated") {
		//   console.log("No user session");
		  router.push('/');
		}
	}, [status, router]);

    // Hook to get window size
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
            handleResize(); // Initialize size immediately
    
            return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures effect only runs on mount and unmount
    
        return windowSize;
    };

    const { width } = useWindowSize();
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileLogo, setIsMobileLogo] = useState(false);

    useEffect(() => {
        // These checks will initially be false since the default state is set to false
        setIsMobile(width <= 980);
        setIsMobileLogo(width <= 768);
    }, [width]); // Only re-run the effect if width changes

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

	const toggleLoginModal = () => {
		setLoginModalOpen(!isLoginModalOpen);
	};

    const renderLinks = () => {
        const role = session?.user?.role;
        if (!session) {
            return (
                <>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="https://www.mosmetro.ru/" target="_blank" rel="noopener noreferrer">Метрополитен</Link>
                </>
            );
        }
        else if (role === 'администратор' || role === 'специалист') {
            return (
                <>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/applications">Заявки</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/passengers">Пассажиры</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/users">Пользователи</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/employees">Сотрудники</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/schedule">Расписание</Link>
                </>
            );
        } else if (role === 'ЦИО') {
            return (
                <>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/applications">Заявки</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/passengers">Пассажиры</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/employees">Сотрудники</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/schedule">Расписание</Link>
                </>
            );
        } else {
            return (
                <>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/applications">Заявки</Link>
                    <Link className={`${styles['nav_item']} ${styles['nav_link']}`} href="/schedule">Расписание</Link>
                </>
            );
        }
    };

    return (
        <>
            <div className={styles['header_container_wrapper']}>
                <div className={styles['header_container']}>
                    <div className={styles['header_container_top']}>
                        <div className={styles['header_container_top_logo']}>
                            <Link href="/">
                                    {isMobileLogo ? (
                                        <div
                                            className={styles['header_logo_wrapper_mobile']}
                                        >
                                            <Image
                                                src={MetroIconMain}
                                                className={styles['header_logo_image_logo']}
                                                alt='Moscow Metro Logo'
                                            />
                                        </div>
                                    ) : (
                                        <Image
                                            src={MetroLogo}
                                            className={styles['header_logo_image']}
                                            alt='Moscow Metro Logo'
                                        />
                                    )}
                            </Link>
                        </div>
                        
                        <div className={styles['header_actions']}>

                            {!session?.user && (
                                <Link
                                    className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleLoginModal();
                                    }}
                                >
                                    <button 
                                        className={styles['header_login_button']}
                                    >
                                        <p>
                                            Войти
                                        </p>
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.75 21.25L19 16l-5.25-5.25M4.996 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M13 4h12.6c.371 0 .727.105.99.293.262.187.41.442.41.707v22c0 .265-.148.52-.41.707a1.724 1.724 0 01-.99.293H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </Link>
                            )}

                            {session?.user && (
                                <Link
                                    className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        signOut();
                                    }}
                                >
                                    <button 
                                        className={styles['header_login_button']}
                                    >
                                        <p>
                                            Выйти
                                        </p>
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.75 21.25L19 16l-5.25-5.25M4.996 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M13 4h12.6c.371 0 .727.105.99.293.262.187.41.442.41.707v22c0 .265-.148.52-.41.707a1.724 1.724 0 01-.99.293H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </Link>
                            )}

                            {isMobile && (
                                <div className={styles['header_nav_burger_wrapper']}>
                                    <button onClick={onOpen} className={styles['header_nav_burger_button']}>
                                        <svg viewBox="0 0 19 11" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1h17M1 5.5h17M1 10h17" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <Drawer 
                                isOpen={isOpen} 
                                placement="right"
                                onClose={onClose}
                            >
                                <DrawerOverlay />
                                <DrawerContent>
                                    <DrawerHeader borderBottomWidth='1px'>
                                        <Link className={`${styles['nav_logo_banner_wrapper']} ${styles['nav_link']}`} href="/">
                                            <div className={styles['nav_header_banner']}>
                                                <Image
                                                    src={MetroIcon}
                                                    className={styles['menu_logo_image']}
                                                    alt='Moscow Metro Logo'
                                                />
                                                <div className={styles['menu_logo_text_wrapper']}>
                                                    <p className={styles['menu_logo_text']}>
                                                        Центр обеспечения мобильности пассажиров
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </DrawerHeader>
                                    <DrawerBody>
                                        <nav className={styles['drawer_nav']}>
                                            {renderLinks()}
                                        </nav>
                                    </DrawerBody>
                                </DrawerContent>
                            </Drawer>
                        </div>

                    </div>
                    <div className={styles['header_container_menu']}>
                        <nav className={styles['header_container_menu_nav']}>
                            {renderLinks()}
                        </nav>
                    </div>
                </div>
            </div>
            <LoginModal isOpen={isLoginModalOpen} onClose={toggleLoginModal} />
        </>        
    );
}