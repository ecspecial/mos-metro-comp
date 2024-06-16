"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import Select, { SingleValue } from 'react-select';
import styles from '@/styles/Global.module.css';
import {
  Spinner, SimpleGrid, Card, CardHeader, CardBody, Heading, Text
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

const Schedule: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOptionType[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<Timeline | null>(null);
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

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

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('api/applicationAssignment/get/getAllApplicationAssignments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('data', data)
        const assignments = data.map((assignment: any) => ({
          id: assignment.id,
          description: assignment.application.description,
          category: assignment.application.category,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
        }));
        setAssignments(assignments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    if (timelineRef.current && applications.length > 0) {
      const items = new DataSet(
        applications.map((application) => ({
          id: application.id,
          content: application.description,
          start: application.startTime,
          end: application.endTime,
        }))
      );

      const options = {
        editable: true,
        margin: {
          item: 10,
          axis: 5,
        },
        orientation: 'top',
        showCurrentTime: true,
        zoomMin: 1000 * 60 * 60 * 1, // One hour in milliseconds
        zoomMax: 1000 * 60 * 60 * 24, // One day in milliseconds
      };

      if (timeline.current) {
        timeline.current.setItems(items);
      } else {
        timeline.current = new Timeline(timelineRef.current, items, options);
      }
    }
  }, [applications]);

  const handleEmployeeChange = (option: SingleValue<EmployeeOptionType>) => {
    const userId = option ? parseInt(option.value) : null;
    setSelectedEmployee(userId);

    if (userId !== null) {
      fetchApplications(userId);
    } else {
      setApplications([]); // Clear applications if no employee is selected
    }
  };

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
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="xl" color='red.500' />
      </div>
    );
  }

  return (
    <div className={styles['schedule_container_wrapper']}>
      <div className={styles['schedule_container']}>
        <Select<EmployeeOptionType>
          isSearchable
          options={employeeOptions}
          onChange={handleEmployeeChange}
          placeholder="Выберите сотрудника"
        />
        {selectedEmployee && <div ref={timelineRef} style={{ height: '400px' }} />}
        <SimpleGrid padding={'10px'} spacing={3} templateColumns={`repeat(auto-fill, minmax(${isMobileLogo ? 300 : 400}px, 1fr))`}>
          {assignments.map((assignment) => (
            <Card className={styles['application_card']} key={assignment.id}>
              <CardHeader>
                <Heading size='md'>Заявка № {assignment.id}</Heading>
              </CardHeader>
              <CardBody>
                <Text><strong>Дата и время:</strong> {formatDateTime(getMoscowoffsetTimeString(assignment.startTime))}</Text>
                <Text><strong>Описание:</strong> {assignment.description}</Text>
                <Text><strong>Категория:</strong> {assignment.category}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default Schedule;