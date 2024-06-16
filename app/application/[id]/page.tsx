"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
    Spinner, Card, CardHeader, CardBody, CardFooter, Heading, Text, Box, Stack, Button, List, ListItem, Divider, Input
} from '@chakra-ui/react';
import DatePicker, { registerLocale } from "react-datepicker";
import { setHours, setMinutes } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { ru } from 'date-fns/locale';
import { NextPage } from 'next';
import styles from '@/styles/ApplicationPage.module.css';
import { Application, ApplicationAssignment } from '@/types/types';
import { formatDateTime, getMoscowoffsetTimeString } from '@/app/lib/utility/utility';

registerLocale("ru", ru);

const ApplicationPage: NextPage = () => {
    const { data: session, status, update } = useSession();

    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDateEditing, setIsDateEditing] = useState(false);
    const [updatedApplication, setUpdatedApplication] = useState<Partial<Application>>({});
    const [startDate, setStartDate] = useState<Date | null>(null);
    const id = usePathname().split('/').pop();
    const router = useRouter();

    const role = session?.user?.role;

    useEffect(() => {
		if (status === "unauthenticated") {
		//   console.log("No user session");
		  router.push('/');
		}
	}, [status, router]);

    const fetchApplication = async () => {
        try {
            const response = await fetch(`/api/application/get/getApplication`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId: id })
            });
            const data = await response.json();
            setApplication(data);
            setUpdatedApplication(data);
            if (data.datetime) {
                const localDate = getMoscowoffsetTimeString(data.datetime);
                setStartDate(new Date(localDate));
            }
        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchApplication();
        }
    }, [id]);

    const handleInputChange = (field: keyof Application, value: any) => {
        setUpdatedApplication({
            ...updatedApplication,
            [field]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/application/update/updateApplication`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedApplication, id }),
            });
            const data = await response.json();
            setApplication(data);
            toggleIsEditingDate();
            setLoading(true);
            await fetchApplication();
        } catch (error) {
            console.error('Error updating application:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/application/delete/deleteApplication`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId: application?.id }),
            });
            toggleIsEditingDate();
            router.push('/applications');
        } catch (error) {
            toggleIsEditingDate();
            console.error('Error deleting application:', error);
        }
    };

    const handleCancellation = async () => {
        try {
            await fetch(`/api/application/delete/deleteApplication`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId: application?.id }),
            });

            // Create a cancellation record
            await fetch(`/api/cancellation/post/createCancellation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: application?.id, dateTime: startDate?.toISOString() }),
            });
            toggleIsEditingDate();

            router.push('/applications');
        } catch (error) {
            toggleIsEditingDate();
            console.error('Error deleting application:', error);
        }
    };

    const toggleIsEditingDate = () => {
        setIsEditing(false);
        setIsDateEditing(false);
    }

    const handleTransfer = async () => {
        try {
            // Save the updated application
            await handleSave();

            // Create a request change record
            await fetch(`/api/requestChange/post/createRequestChange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: application?.id,
                    editTime: new Date().toISOString(),
                    startTime: startDate?.toISOString(),
                    endTime: '',
                }),
            });

            setIsEditing(false);
            setIsDateEditing(false);
            setLoading(true);
            await fetchApplication();
        } catch (error) {
            console.error('Error transferring application:', error);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            console.log('date handleDateChange', date)
            console.log('date handleDateChange toISOString', date.toISOString())
            setStartDate(date);
    
            handleInputChange('datetime', date.toISOString());

        }
    };

    const handleDateBlur = () => {
        if (!startDate || isNaN(startDate.getTime())) {
            setStartDate(application?.datetime ? new Date(application.datetime) : new Date());
            setUpdatedApplication({
                ...updatedApplication,
                datetime: application?.datetime,
            });
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="xl" color='red.500' />
            </div>
        );
    }

    if (!application) {
        return <p>Заявка не найдена</p>;
    }

    return (
        <main className={styles['application_container']}>
            <Card className={styles['application_card']}>
                <CardHeader className={styles['application_header']}>
                    <Heading size="md">
                        {isEditing ? (
                            <Input
                                value={updatedApplication.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        ) : (
                            application?.description ?? 'Нет данных'
                        )}
                    </Heading>
                    <Text>
                        {(isEditing || isDateEditing) ? (
                            <div className="mt-3">
                                <DatePicker
                                    locale="ru"
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    onBlur={handleDateBlur}
                                    timeInputLabel="Время"
                                    timeFormat="HH:mm"
                                    timeCaption="Время"
                                    timeIntervals={5}
                                    showTwoColumnMonthYearPicker
                                    showTimeSelect
                                    dateFormat="dd.MM.yyyy / HH:mm"
                                    customInput={
                                        <Input
                                            className="react-datepicker-ignore-onclickoutside"
                                            placeholder="Дата поездки"
                                        />
                                    }
                                />
                            </div>
                        ) : (
                            startDate ? formatDateTime(startDate) : 'Ошибка при загрузке времени начала заявки'
                        )}
                    </Text>
                </CardHeader>
                <CardBody className={styles['application_details']}>
                    <Stack spacing="4">
                        <Box>
                            <Text><strong>Пассажир:</strong> {application?.passenger?.fullName ?? 'Нет данных'}</Text>
                            <Text><strong>Категория Пассажира:</strong> {application?.passenger?.category ?? 'Нет данных'}</Text>
                            <Text><strong>Дополнительная информация:</strong> {application?.passenger?.additionalInfo ?? 'Нет данных'}</Text>
                            <br />
                            <Divider />
                            <br />
                            <Text><strong>Станция отправления:</strong> {application?.station1?.name ?? 'Нет данных'}</Text>
                            <Text><strong>Станция прибытия:</strong> {application?.station2?.name ?? 'Нет данных'}</Text>
                            <br />
                            <Divider />
                            <br />
                            <Text><strong>Тип заявки:</strong> {application?.applicationType ?? 'Нет данных'}</Text>
                            <Text><strong>Статус заявки:</strong> {application?.status ?? 'Нет данных'}</Text>
                            <Text><strong>Время регистрации:</strong> {application?.registrationTime ? formatDateTime(getMoscowoffsetTimeString(application.registrationTime)) : 'Нет данных'}</Text>
                            <Text><strong>Вокзал:</strong> {application?.railway ?? 'Нет данных'}</Text>
                            <Text><strong>Багаж:</strong> {application?.baggage ?? 'Нет данных'}</Text>
                            <Text><strong>Описание:</strong> {isEditing ? (
                                <Input
                                    value={updatedApplication.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            ) : (
                                application?.description ?? 'Нет данных'
                            )}</Text>
                            <br />
                            <Divider />
                            <br />
                            <Text><strong>Количество пассажиров:</strong> {application?.passengerQty ?? 'Нет данных'}</Text>
                            <Text><strong>Количество сотрудников мужского пола:</strong> {isEditing ? (
                                <Input
                                    value={updatedApplication.maleStaffCount || ''}
                                    onChange={(e) => handleInputChange('maleStaffCount', e.target.value)}
                                />
                            ) : (
                                application?.maleStaffCount ?? 'Нет данных'
                            )}</Text>
                            <Text><strong>Количество сотрудников женского пола:</strong> {isEditing ? (
                                <Input
                                    value={updatedApplication.femaleStaffCount || ''}
                                    onChange={(e) => handleInputChange('femaleStaffCount', e.target.value)}
                                />
                            ) : (
                                application?.femaleStaffCount ?? 'Нет данных'
                            )}</Text>
                            <br />
                            <Divider />
                            <br />
                            <Text><strong>Пересадки:</strong>
                                {(application?.transferStations?.length === 0 && " Отсутствуют")}
                            </Text>
                            <br />
                            <List spacing={3}>
                                {application?.transferStations?.map((transfer, index) => (
                                    <ListItem key={index} border="1px" borderRadius="md" padding="2" borderColor="gray.200">
                                        <Text><strong>Станция пересадки с:</strong> {transfer.transfer_station_start}</Text>
                                        <Text><strong>Станция пересадки на:</strong> {transfer.transfer_station_end}</Text>
                                        <Text><strong>Время пересадки:</strong> {transfer.transfer_time} минут</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        {application?.assignments?.map((assignment: ApplicationAssignment) => (
                            <Box key={assignment.id}>
                                <Text><strong>Работник, назначенный на заявку:</strong> {`${assignment?.employee?.shortName} [${assignment?.employee?.rankNumber}]`}</Text>
                            </Box>
                        ))}
                    </Stack>
                </CardBody>
                <CardFooter>
                    <div className={styles['application_footer']}>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Сохранить изменения</Button>
                                <Button onClick={() => setIsEditing(false)} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Отменить изменения</Button>
                            </>
                        ) : (
                            <>
                                {isDateEditing ? (
                                    (role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
                                        <>
                                            <Button onClick={toggleIsEditingDate} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Отменить перенос</Button>
                                            <Button onClick={handleTransfer} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Сохранить новое время</Button>
                                        </>
                                    )
                                ) : (
                                    <>
                                        {(role === 'администратор' || role === 'специалист' || role === 'ЦИО') && (
                                            <>
                                                <Button onClick={() => { setIsDateEditing(true); setIsEditing(false); }} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Перенести заявку</Button>
                                                <Button onClick={() => setIsEditing(true)} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Изменить</Button>
                                                <Button onClick={handleCancellation} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Отменить заявку</Button>
                                            </>
                                        )}

                                        {(role === 'администратор') && (
                                            <Button onClick={handleDelete} minWidth={'150px'}  backgroundColor={'#D4212D'} colorScheme="red">Удалить</Button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
};

export default ApplicationPage;