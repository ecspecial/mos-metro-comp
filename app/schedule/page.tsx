"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import TimelineChart from '@/components/TimelineChart';
import Select, { SingleValue } from 'react-select';
import { ApplicationAssignment } from '@/types/types';
import styles from '@/styles/Global.module.css';
import {
    Spinner, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, useDisclosure
} from '@chakra-ui/react';
import { formatDateTime, getMoscowoffsetTimeString } from '@/app/lib/utility/utility';


type EmployeeOptionType = {
  label: string;
  value: string;
};

type Application = {
  id: number;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
};

const EmployeeSelect: React.FC<{ onChange: (selectedEmployee: SingleValue<EmployeeOptionType>) => void }> = ({ onChange }) => {
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOptionType[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employee/get/getEmployeesWithAssignments');
        const data = await response.json();
        const options = data.map((employee: any) => ({
          label: employee.fullName,
          value: employee.userId.toString(),
        }));
        setEmployeeOptions(options);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Select<EmployeeOptionType>
      isSearchable
      options={employeeOptions}
      onChange={onChange}
      placeholder="Выберите сотрудника"
    />
  );
};



const Schedule: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [key, setKey] = useState<number>(0);

  const [assignments, setAssignments] = useState<ApplicationAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScheduleLoading, setNewScheduleLoading] = useState(false);


  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const role = session?.user?.role;
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
    //   console.log("No user session");
      router.push('/');
    }
  }, [status, router]);

  const fetchApplications = async (userId: number) => {
    try {
      const response = await fetch('api/applicationAssignment/get/getUserAssignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      const assignments = data.assignments.map((assignment: any) => ({
        id: assignment.id,
        description: assignment.application.description,
        category: assignment.application.category,
        startTime: assignment.startTime,
        endTime: assignment.endTime,
      }));
      setApplications(assignments);
      setKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

useEffect(() => {
  if (role !== 'администратор' && role !== 'специалист' && role !== 'ЦИО' && userId) {
    setSelectedEmployee(parseInt(userId));
    fetchApplications(parseInt(userId));
  }
}, [role, userId]);

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

const fetchAssignments = async () => {
    try {
      const response = await fetch('api/applicationAssignment/get/getAllApplicationAssignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    //   console.log('data', data)

    let filteredAssignments = data;

    if (role !== 'администратор' && role !== 'специалист' && role !== 'ЦИО') {
      if (userId) {
        filteredAssignments = data.filter((assignment: ApplicationAssignment) => {
          return assignment.employeeId === parseInt(userId);
        });
        setAssignments(filteredAssignments);
      } else {
        filteredAssignments = [];
        setAssignments(filteredAssignments);
      }
    } else {
      setAssignments(data);
    }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

    useEffect(() => {
        fetchAssignments();
    }, [userId]);

    // if (assignments.length === 0) {
    //     return <p>Не найдено распределенных заявок.</p>;
    //   }

    if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner size="xl" color='red.500' />
          </div>
        );
      }


  const handleEmployeeChange = (option: SingleValue<EmployeeOptionType>) => {
    const userId = option ? parseInt(option.value) : null;
    setSelectedEmployee(userId);

    if (userId !== null) {
      fetchApplications(userId);
    }
  };

  const handleScheduleTomorrow = async () => {
    try {
        setNewScheduleLoading(true);
        await fetch(`/api/schedule/get/generateEmployeeLunches`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await fetch(`/api/schedule/get/generateEmployeeSchedules`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetchAssignments();
        setNewScheduleLoading(false);
    } catch (error) {
        console.error('Error deleting passenger:', error);
    }
};

  return (
    <div className={styles['schedule_container_wrapper']}>
        <div className={styles['schedule_container']}>
          {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
            <>
              <Button className='mb-3' onClick={handleScheduleTomorrow} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Адаптивное распределение заявок на завтра</Button>
              <EmployeeSelect onChange={handleEmployeeChange} />
            </>
          )}
            {newScheduleLoading ? (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner size="xl" color='red.500' />
                </div>
            ) : (
                <>
                {selectedEmployee && <TimelineChart key={key} applications={applications} />}
                {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
                  <>
                    <Text marginTop={10} marginBottom={5}>Все заявки:</Text>
                  </>
                )}
                <SimpleGrid spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
                    {assignments?.map((assignment) => (
                        <Card className={styles['application_card']} key={assignment.id}>
                        <CardHeader>
                            <Heading size='md'>Заявка № {assignment?.id}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text><strong>Дата и время:</strong> {assignment?.startTime ? formatDateTime(getMoscowoffsetTimeString(assignment.startTime)) : 'Нет данных'}</Text>
                            <Text><strong>Ответственный сотрудник:</strong> {assignment?.employee?.shortName ? assignment.employee.shortName : 'Нет данных'} </Text>
                            <Text><strong>ID сотрудника:</strong> {assignment?.employee?.id ? assignment.employee.id : 'Нет данных'} </Text>
                            <Text><strong>Табельный номер:</strong> {assignment?.employee?.rankNumber ? assignment.employee.rankNumber : 'Нет данных'} </Text>
                            <Text><strong>Статус:</strong> {assignment?.application?.status ? assignment.application.status : 'Нет данных'} </Text>
                        </CardBody>
                        <CardFooter className={styles['application_card_footer']}>
                            <Button onClick={() => router.push(`/application/${assignment?.application?.id}`)}>О заявке</Button>
                            <Button onClick={() => router.push(`/passenger/${assignment?.application?.passengerId}`)}>О пассажире</Button>
                            <Button onClick={() => router.push(`/employee/${assignment?.employeeId}`)}>О сотруднике</Button>
                        </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
                </>
            )}
        </div>
    </div>
  );
};

export default Schedule;