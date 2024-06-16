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
import { User, Employee } from '@/types/types';
import { formatDateTime } from '@/app/lib/utility/utility';

const UserPage: NextPage = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
    const id = usePathname().split('/').pop();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/');
        }
    }, [status, router]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/user/get/getUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id })
            });
            const data = await response.json();
            setUser(data);
            setUpdatedUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const handleInputChange = (field: keyof User, value: any) => {
        setUpdatedUser({
            ...updatedUser,
            [field]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/user/update/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedUser, userId: id }),
            });
            const data = await response.json();
            setUser(data);
            setIsEditing(false);
            setLoading(true);
            await fetchUser();
        } catch (error) {
            setIsEditing(false);    
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/user/delete/deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id }),
            });
            setIsEditing(false);
            router.push('/users');
        } catch (error) {
            setIsEditing(false);
            console.error('Error deleting user:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="xl" color='red.500' />
            </div>
        );
    }

    if (!user) {
        return <p>Пользователь не найден</p>;
    }

    return (
        <main className={styles['application_container']}>
            <Card className={styles['application_card']}>
                <CardHeader className={styles['application_header']}>
                    <Heading size="md">
                        {user?.login ?? 'Нет данных'}
                    </Heading>
                </CardHeader>
                <CardBody className={styles['application_details']}>
                    <Stack spacing="4">
                        <Box>
                            <Text><strong>Роль:</strong> {isEditing ? (
                                <Input
                                    value={updatedUser.role || ''}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                />
                            ) : (
                                user?.role ?? 'Нет данных'
                            )}</Text>
                            <Text className='mt-3'><strong>Зарегистрирован:</strong> {user?.createdAt ? formatDateTime(new Date(user.createdAt)) : 'Нет данных'}</Text>
                            {user?.employee && (
                                <>
                                    <Text className='mt-3'><strong>Работник:</strong> {user.employee.fullName}</Text>
                                    <Text><strong>Телефон рабочий:</strong> {user.employee.workPhone}</Text>
                                    <Text><strong>Телефон личный:</strong> {user.employee.personalPhone}</Text>
                                </>
                            )}
                        </Box>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <div className={styles['application_footer']}>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Сохранить изменения</Button>
                                <Button onClick={() => setIsEditing(false)} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Отменить изменения</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsEditing(true)} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Обновить данные</Button>
                                <Button onClick={handleDelete} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Удалить пользователя</Button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
};

export default UserPage;