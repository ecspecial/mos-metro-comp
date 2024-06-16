"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Spinner, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, List, ListItem, useDisclosure
} from '@chakra-ui/react';
import { Employee } from '@/types/types';
import styles from '@/styles/ApplicationPage.module.css';
import { formatDateTime } from '@/app/lib/utility/utility';
import NewEmployeeModal from '@/components/NewEmployeeModal';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);

  const toggleEmployeeModal = () => {
    setEmployeeModalOpen(!isEmployeeModalOpen);
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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employee/get/getAllEmployees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="xl" color='red.500' />
      </div>
    );
  }

  if (employees.length === 0) {
    return <p>No employees found.</p>;
  }

  return (
    <>
      <div className={styles['application_container']}>
        <div className={styles['application_page_button_group']}>
          <Button
            className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
            onClick={(e) => {
              e.preventDefault();
              toggleEmployeeModal();
            }}
          >
            Новый сотрудник
          </Button>
        </div>
        <SimpleGrid padding={'10px'} spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
          {employees.map((employee) => (
            <Card className={styles['application_card']} key={employee.id}>
              <CardHeader>
                <Heading size='md'>Сотрудник № {employee.id}</Heading>
              </CardHeader>
              <CardBody>
                <Text><strong>ФИО:</strong> {employee.fullName}</Text>
                <Text><strong>Пол:</strong> {employee.gender}</Text>
                <Text><strong>Должность:</strong> {employee.rank}</Text>
                <Text><strong>Телефон рабочий:</strong> {employee.workPhone}</Text>
                <Text><strong>Телефон личный:</strong> {employee.personalPhone}</Text>
                <Text><strong>Дата вступления:</strong> {formatDateTime(new Date(employee.entryDate))}</Text>
              </CardBody>
              <CardFooter>
                <Button onClick={() => router.push(`/employee/${employee.id}`)}>Подробнее</Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </div>
      <NewEmployeeModal isOpen={isEmployeeModalOpen} onClose={toggleEmployeeModal} onEmployeeCreated={fetchEmployees}/>
    </>
  );
};

export default EmployeesPage;