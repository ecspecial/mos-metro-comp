"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Spinner, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, List, ListItem, useDisclosure
} from '@chakra-ui/react';
import { Passenger } from '@/types/types';
import styles from '@/styles/ApplicationPage.module.css';
import { formatDateTime, getMoscowoffsetTimeString } from '@/app/lib/utility/utility';
import NewPassengerModal from '@/components/NewPassengerModal';

const PassengersPage = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  const role = session?.user?.role;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isPassengerModalOpen, setPassengerModalOpen] = useState(false);

  const togglePassengerModal = () => {
    setPassengerModalOpen(!isPassengerModalOpen);
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

  const fetchPassengers = async () => {
    try {
      const response = await fetch('/api/passenger/get/getAllPassengers');
      const data = await response.json();
      setPassengers(data);
    } catch (error) {
      console.error('Error fetching passengers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="xl" color='red.500' />
      </div>
    );
  }

  if (passengers.length === 0) {
    return <p>No passengers found.</p>;
  }

  return (
    <>
      <div className={styles['application_container']}>
      <div className={styles['application_page_button_group']}>
      {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
          <Button
            className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
            onClick={(e) => {
                e.preventDefault();
                togglePassengerModal();
            }}
          >
            Новый пассажир
          </Button>
        )}
            </div>
        <SimpleGrid padding={'10px'} spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
          {passengers.map((passenger) => (
            <Card className={styles['application_card']} key={passenger.id}>
              <CardHeader>
                <Heading size='md'>Пассажир № {passenger.id}</Heading>
              </CardHeader>
              <CardBody>
                <Text><strong>ФИО:</strong> {passenger.fullName}</Text>
                <Text><strong>Пол:</strong> {passenger.gender}</Text>
                <Text><strong>Категория:</strong> {passenger.category}</Text>
                <Text><strong>Наличие Электрокардиостимулятора:</strong> {passenger.eks ? 'Да' : 'Нет'}</Text>
                <Text><strong>Зарегистрирован:</strong> {formatDateTime(getMoscowoffsetTimeString(passenger.createdAt))}</Text>
                <Text><strong>Номера телефонов:</strong></Text>
                <List>
                  {passenger.phoneNumbers.map((phone, index) => (
                    <ListItem key={index}>
                      {phone.phone_number} - {phone.description}
                    </ListItem>
                  ))}
                </List>
              </CardBody>
              <CardFooter>
                <Button onClick={() => router.push(`/passenger/${passenger.id}`)}>Подробнее</Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </div>
      <NewPassengerModal isOpen={isPassengerModalOpen} onClose={togglePassengerModal} onPassengerCreated={fetchPassengers}/>
    </>
  );
};

export default PassengersPage;