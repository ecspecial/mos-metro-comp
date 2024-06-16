"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Spinner, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, List, ListItem, useDisclosure
} from '@chakra-ui/react';
import { User } from '@/types/types';
import styles from '@/styles/ApplicationPage.module.css';
import { formatDateTime, getMoscowoffsetTimeString } from '@/app/lib/utility/utility';
import NewUserModal from '@/components/NewUserModal';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const role = session?.user?.role;

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isUserModalOpen, setUserModalOpen] = useState(false);

  const toggleUserModal = () => {
    setUserModalOpen(!isUserModalOpen);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
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

  const windowSize = useWindowSize();
  const isMobileLogo = windowSize.width <= 768;

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user/get/getAllUsers');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="xl" color='red.500' />
      </div>
    );
  }

  if (users.length === 0) {
    return <p>Пользователи не найдены.</p>;
  }

  if (role !== 'администратор') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <p
          style={{
            fontSize: '24px',
            textAlign: 'center',
            color: '#D4212D'
          }}
        >
          У вас не достаточно прав для отображения данной страницы.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles['application_container']}>
        <div className={styles['application_page_button_group']}>
          <Button
            className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
            onClick={(e) => {
              e.preventDefault();
              toggleUserModal();
            }}
          >
            Новый пользователь
          </Button>
        </div>
        <SimpleGrid padding={'10px'} spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
          {users.map((user) => (
            <Card className={styles['application_card']} key={user.id}>
              <CardHeader>
                <Heading size='md'>Пользователь № {user.id}</Heading>
              </CardHeader>
              <CardBody>
                <Text><strong>Логин:</strong> {user.login}</Text>
                <Text><strong>Роль:</strong> {user.role}</Text>
                <Text><strong>Зарегистрирован:</strong> {formatDateTime(getMoscowoffsetTimeString(user.createdAt))}</Text>
                {user.employee && (
                  <>
                    <Text><strong>Работник:</strong> {user.employee.fullName}</Text>
                    <Text><strong>Телефон рабочий:</strong> {user.employee.workPhone}</Text>
                    <Text><strong>Телефон личный:</strong> {user.employee.personalPhone}</Text>
                  </>
                )}
              </CardBody>
              <CardFooter>
                <Button onClick={() => router.push(`/user/${user.id}`)}>Подробнее</Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </div>
      <NewUserModal isOpen={isUserModalOpen} onClose={toggleUserModal} onUserCreated={fetchUsers}/>
    </>
  );
};

export default UsersPage;