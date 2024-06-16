"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Spinner, Card, CardHeader, CardBody, CardFooter, Heading, Text, Box, Stack, Button, Input, Checkbox
} from '@chakra-ui/react';
import "react-datepicker/dist/react-datepicker.css";
import { NextPage } from 'next';
import styles from '@/styles/ApplicationPage.module.css';
import { Employee } from '@/types/types';
import { formatDateTime } from '@/app/lib/utility/utility';

const EmployeePage: NextPage = () => {
    const { data: session, status } = useSession();

    const role = session?.user?.role;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedEmployee, setUpdatedEmployee] = useState<Partial<Employee>>({});
    const id = usePathname().split('/').pop();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/');
        }
    }, [status, router]);

    const fetchEmployee = async () => {
        try {
            const response = await fetch(`/api/employee/get/getEmployee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            setEmployee(data);
            setUpdatedEmployee(data);
        } catch (error) {
            console.error('Error fetching employee:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const handleInputChange = (field: keyof Employee, value: any) => {
        setUpdatedEmployee({
            ...updatedEmployee,
            [field]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/employee/update/updateEmployee`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedEmployee, id }),
            });
            const data = await response.json();
            setEmployee(data);
            setIsEditing(false);
            setLoading(true);
            await fetchEmployee();
        } catch (error) {
            setIsEditing(false);    
            console.error('Error updating employee:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/employee/delete/deleteEmployee`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: employee?.id }),
            });
            setIsEditing(false);
            router.push('/employees');
        } catch (error) {
            setIsEditing(false);
            console.error('Error deleting employee:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="xl" color='red.500' />
            </div>
        );
    }

    if (!employee) {
        return <p>Сотрудник не найден</p>;
    }

    return (
        <main className={styles['application_container']}>
            <Card className={styles['application_card']}>
                <CardHeader className={styles['application_header']}>
                    <Heading size="md">
                        {isEditing ? (
                            <Input
                                value={updatedEmployee.fullName || ''}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                        ) : (
                            employee?.fullName ?? 'Нет данных'
                        )}
                    </Heading>
                </CardHeader>
                <CardBody className={styles['application_details']}>
                    <Stack spacing="4">
                        <Box>
                            <Text><strong>Пол:</strong> {isEditing ? (
                                <Input
                                    value={updatedEmployee.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                />
                            ) : (
                                employee?.gender ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Должность:</strong> {isEditing ? (
                                <Input
                                    value={updatedEmployee.rank || ''}
                                    onChange={(e) => handleInputChange('rank', e.target.value)}
                                />
                            ) : (
                                employee?.rank ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Логин сотрудника:</strong> {employee?.user?.login ?? 'Нет данных'}</Text>
                            <Text><strong>Телефон рабочий:</strong> {isEditing ? (
                                <Input
                                    value={updatedEmployee.workPhone || ''}
                                    onChange={(e) => handleInputChange('workPhone', e.target.value)}
                                />
                            ) : (
                                employee?.workPhone ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Телефон личный:</strong> {isEditing ? (
                                <Input
                                    value={updatedEmployee.personalPhone || ''}
                                    onChange={(e) => handleInputChange('personalPhone', e.target.value)}
                                />
                            ) : (
                                employee?.personalPhone ?? 'Нет данных'
                            )}</Text>
                            <Text className='mt-3'><strong>Дата вступления:</strong> {employee?.entryDate ? formatDateTime(new Date(employee.entryDate)) : 'Нет данных'}</Text>
                            <Text className='mt-3'><strong>Стажировка:</strong> {isEditing ? (
                                <Checkbox
                                    isChecked={updatedEmployee.internship || false}
                                    onChange={(e) => handleInputChange('internship', e.target.checked)}
                                >
                                </Checkbox>
                            ) : (
                                employee?.internship ? 'Да' : 'Нет'
                            )}</Text>

                            {(employee?.rank === 'ЦСИ' || employee?.rank === 'ЦИ') && (
                                <>
                                    <Text><strong>Перерыв на обед:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.lunchBreak || ''}
                                            onChange={(e) => handleInputChange('lunchBreak', e.target.value)}
                                        />
                                    ) : (
                                        employee?.lunchBreak ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Время работы:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.timeWork || ''}
                                            onChange={(e) => handleInputChange('timeWork', e.target.value)}
                                        />
                                    ) : (
                                        employee?.timeWork ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Смена:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.shift || ''}
                                            onChange={(e) => handleInputChange('shift', e.target.value)}
                                        />
                                    ) : (
                                        employee?.shift ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Номер табеля:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.rankNumber || ''}
                                            onChange={(e) => handleInputChange('rankNumber', e.target.value)}
                                        />
                                    ) : (
                                        employee?.rankNumber ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Участок сотрудника:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.section || ''}
                                            onChange={(e) => handleInputChange('section', e.target.value)}
                                        />
                                    ) : (
                                        employee?.section ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Статус работы:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.workStatus || ''}
                                            onChange={(e) => handleInputChange('workStatus', e.target.value)}
                                        />
                                    ) : (
                                        employee?.workStatus ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Дополнительная смена:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.extraShift || ''}
                                            onChange={(e) => handleInputChange('extraShift', e.target.value)}
                                        />
                                    ) : (
                                        employee?.extraShift ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Учебное время:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.studyTime || ''}
                                            onChange={(e) => handleInputChange('studyTime', e.target.value)}
                                        />
                                    ) : (
                                        employee?.studyTime ?? 'Нет данных'
                                    )}</Text>
                                    <Text><strong>Изменение времени работы:</strong> {isEditing ? (
                                        <Input
                                            value={updatedEmployee.workTimeChange || ''}
                                            onChange={(e) => handleInputChange('workTimeChange', e.target.value)}
                                        />
                                    ) : (
                                        employee?.workTimeChange ?? 'Нет данных'
                                    )}</Text>
                                </>
                            )}
                        </Box>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <div className={styles['application_footer']}>
                        {isEditing ? (
                            (role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
                                <>
                                    <Button onClick={handleSave} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Сохранить изменения</Button>
                                    <Button onClick={() => setIsEditing(false)} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Отменить изменения</Button>
                                </>
                            )
                        ) : (
                            <>
                                {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
                                    <Button onClick={() => setIsEditing(true)} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Обновить данные</Button>
                                )}
                                
                                {(role === 'администратор') && (
                                    <Button onClick={handleDelete} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Удалить сотрудника</Button>
                                )}
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
};

export default EmployeePage;