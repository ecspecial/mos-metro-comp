"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Spinner, Card, CardHeader, CardBody, CardFooter, Heading, Text, Box, Stack, Button, List, ListItem, Divider, Input, Checkbox
} from '@chakra-ui/react';
import "react-datepicker/dist/react-datepicker.css";
import { NextPage } from 'next';
import styles from '@/styles/ApplicationPage.module.css';
import { Passenger, PhoneNumber } from '@/types/types';
import { formatDateTime } from '@/app/lib/utility/utility';

const PassengerPage: NextPage = () => {
    const { data: session, status } = useSession();

    const role = session?.user?.role;

    const [passenger, setPassenger] = useState<Passenger | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPassenger, setUpdatedPassenger] = useState<Partial<Passenger>>({});
    const id = usePathname().split('/').pop();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/');
        }
    }, [status, router]);

    const fetchPassenger = async () => {
        try {
            const response = await fetch(`/api/passenger/get/getPassenger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passengerId: id })
            });
            const data = await response.json();
            setPassenger(data);
            setUpdatedPassenger(data);
        } catch (error) {
            console.error('Error fetching passenger:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPassenger();
        }
    }, [id]);

    const handleInputChange = (field: keyof Passenger, value: any) => {
        setUpdatedPassenger({
            ...updatedPassenger,
            [field]: value,
        });
    };

    const handlePhoneNumberChange = (index: number, field: keyof PhoneNumber, value: string) => {
        const updatedPhoneNumbers = [...(updatedPassenger.phoneNumbers || [])];
        updatedPhoneNumbers[index] = {
            ...updatedPhoneNumbers[index],
            [field]: value
        };
        setUpdatedPassenger({
            ...updatedPassenger,
            phoneNumbers: updatedPhoneNumbers
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/passenger/update/updatePassenger`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedPassenger, id }),
            });
            const data = await response.json();
            setPassenger(data);
            setIsEditing(false);
            setLoading(true);
            await fetchPassenger();
        } catch (error) {
            setIsEditing(false); 
            console.error('Error updating passenger:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/passenger/delete/deletePassenger`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passengerId: passenger?.id }),
            });
            setIsEditing(false);
            router.push('/passengers');
        } catch (error) {
            setIsEditing(false);
            console.error('Error deleting passenger:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="xl" color='red.500' />
            </div>
        );
    }

    if (!passenger) {
        return <p>Пассажир не найден</p>;
    }

    return (
        <main className={styles['application_container']}>
            <Card className={styles['application_card']}>
                <CardHeader className={styles['application_header']}>
                    <Heading size="md">
                        {isEditing ? (
                            <Input
                                value={updatedPassenger.fullName || ''}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                        ) : (
                            passenger?.fullName ?? 'Нет данных'
                        )}
                    </Heading>
                </CardHeader>
                <CardBody className={styles['application_details']}>
                    <Stack spacing="4">
                        <Box>
                            <Text><strong>Пол:</strong> {isEditing ? (
                                <Input
                                    value={updatedPassenger.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                />
                            ) : (
                                passenger?.gender ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Категория:</strong> {isEditing ? (
                                <Input
                                    value={updatedPassenger.category || ''}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                />
                            ) : (
                                passenger?.category ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Дополнительная информация:</strong> {isEditing ? (
                                <Input
                                    value={updatedPassenger.additionalInfo || ''}
                                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                />
                            ) : (
                                passenger?.additionalInfo ?? 'Нет данных'
                            )}</Text>
                            <Text className='mt-3'><strong>Зарегистрирован:</strong> {passenger?.createdAt ? formatDateTime(new Date(passenger.createdAt)) : 'Нет данных'}</Text>
                            <Text className='mt-3'><strong>Наличие Электрокардиостимулятора:</strong> {isEditing ? (
                                <Checkbox
                                    isChecked={updatedPassenger.eks || false}
                                    onChange={(e) => handleInputChange('eks', e.target.checked)}
                                >
                                </Checkbox>
                            ) : (
                                passenger?.eks ? 'Да' : 'Нет'
                            )}</Text>
                            <Text className='mt-3'><strong>Номера телефонов:</strong></Text>
                            {isEditing ? (
                                updatedPassenger.phoneNumbers?.map((phoneNumber, index) => (
                                    <Box className='mt-3' key={index}>
                                        <Input
                                            value={phoneNumber.phone_number}
                                            onChange={(e) => handlePhoneNumberChange(index, 'phone_number', e.target.value)}
                                        />
                                        <Input
                                            value={phoneNumber.description}
                                            onChange={(e) => handlePhoneNumberChange(index, 'description', e.target.value)}
                                        />
                                    </Box>
                                ))
                            ) : (
                                <List className='mt-3'>
                                    {passenger.phoneNumbers.map((phoneNumber, index) => (
                                        <ListItem key={index}>
                                            <Text>{phoneNumber.phone_number} - {phoneNumber.description}</Text>
                                        </ListItem>
                                    ))}
                                </List>
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
                                    <Button onClick={handleDelete} minWidth={'150px'} backgroundColor={'#D4212D'} colorScheme="red">Удалить пассажира</Button>
                                )}
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
};

export default PassengerPage;