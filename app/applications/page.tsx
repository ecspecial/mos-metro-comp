"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Spinner, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, useDisclosure
} from '@chakra-ui/react';
import { Application, ApplicationAssignment } from '@/types/types';
import { formatDateTime, getMoscowoffsetTimeString } from '@/app/lib/utility/utility';
import styles from '@/styles/ApplicationPage.module.css'

import NewApplicationModal from '@/components/NewApplicationModal';

const ApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const { data: session, status, update } = useSession();
    const router = useRouter();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);

    const toggleApplicationModal = () => {
        setApplicationModalOpen(!isApplicationModalOpen);
    };

    useEffect(() => {
		if (status === "unauthenticated") {
		//   console.log("No user session");
		  router.push('/');
		}
	}, [status, router]);

    const role = session?.user?.role;
    const userId = session?.user?.id;
    // console.log('session?.user?', session?.user)

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
    const isMobile = windowSize.width <= 980;
    const isMobileLogo = windowSize.width <= 768;

    const fetchApplications = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('/api/application/get/getAllApplications');
        const data = await response.json();

        let filteredApplications = data;

        if (role !== 'администратор' && role !== 'специалист' && role !== 'ЦИО') {
          if (userId) {
            filteredApplications = data.filter((application: Application) => {
              return application.assignments.some((assignment: ApplicationAssignment) => assignment?.employeeId === parseInt(userId));
            });
          } else {
            filteredApplications = [];
          }
        }

        setApplications(filteredApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="xl" color='red.500' />
      </div>
    );
  }



  return (
    <>
        <div className={styles['application_container']}>
          {
            applications.length === 0 && !isFetching ? (
              <p>Не найдено назначенных заявок.</p>
            ) : (
              <>
                {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') ? (
                    <div className={styles['application_page_button_group']}>
                    <Button
                        className={`${styles['header_login_button_wrapper']} ${styles['nav_link']}`} 
                        onClick={(e) => {
                            e.preventDefault();
                            toggleApplicationModal();
                        }}
                    >
                        Новая заявка
                    </Button>
                </div>
                ) : (
                  <div className={styles['application_page_button_group']}>
                    <Text><strong>Обед:</strong> {applications[0].assignments[0].employee.lunchBreak}</Text>                
                  </div>
                )}   
              <SimpleGrid padding={'10px'} spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
                  {applications.map((application) => (
                      <Card className={styles['application_card']} key={application.id}>
                      <CardHeader>
                          <Heading size='md'>Заявка № {application.id}</Heading>
                      </CardHeader>
                      <CardBody>
                          <Text><strong>Дата и время:</strong> {formatDateTime(getMoscowoffsetTimeString(application.datetime))}</Text>
                          <Text><strong>Станция отправления:</strong> {application.station1.name}</Text>
                          <Text><strong>Станция прибытия:</strong> {application.station2.name}</Text>
                          <Text><strong>Категория:</strong> {application.category}</Text>
                      </CardBody>
                      <CardFooter>
                          <Button onClick={() => router.push(`/application/${application.id}`)}>Подробнее</Button>
                      </CardFooter>
                      </Card>
                  ))}
              </SimpleGrid>
            </>
            )
          }
        </div>
        <NewApplicationModal isOpen={isApplicationModalOpen} onClose={toggleApplicationModal} onApplicationCreated={fetchApplications}/>
    </>
  );
};

export default ApplicationsPage;