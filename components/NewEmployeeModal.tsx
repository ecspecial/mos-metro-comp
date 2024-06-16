"use client";
import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Stack,
    Box
} from "@chakra-ui/react";
import { Employee } from "@/types/types";
import Select, { SingleValue } from 'react-select';


interface NewEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeCreated: () => void;
}

export type OptionType = {
    label: string;
    value: string;
}

const genders = ["Мужской", "Женский"];
const shifts = ["1", "2", "1Н", "2Н"];
const roles = ["администратор", "специалист", "ЦИО", "ЦУ", "ЦСИ", "ЦИ"];
const sections = ["ЦУ-1", "ЦУ-2", "ЦУ-3", "ЦУ-3(Н)", "ЦУ-4", "ЦУ-4(Н)", "ЦУ-5",  "ЦУ-8", ];

const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ isOpen, onClose, onEmployeeCreated }) => {
    const { data: session } = useSession();
    const [employee, setEmployee] = useState<Partial<Employee>>({
        internship: false,
    });
    const [timeWorkError, setTimeWorkError] = useState<string | null>(null);

    const handleInputChange = (field: keyof Employee, value: any) => {
        setEmployee({
            ...employee,
            [field]: value,
        });
    };

    const validateTimeWork = (timeWork: string): boolean => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
        console.log(regex.test(timeWork))
        return regex.test(timeWork);
    };

    const handleSave = async () => {
        if (employee.timeWork && !validateTimeWork(employee.timeWork)) {
            setTimeWorkError('Формат времени работы: "08:00-20:00"');
            return;
        }

        try {
            await fetch('/api/employee/post/addEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });
            onClose();
            onEmployeeCreated();
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    const isCSIorCI = employee?.rank === 'ЦСИ' || session?.user?.role === 'ЦИ';

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Добавить Сотрудника</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>ФИО</FormLabel>
                        <Input
                            placeholder="ФИО"
                            value={employee.fullName || ''}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Короткое Имя</FormLabel>
                        <Input
                            placeholder="Иванов А.А."
                            value={employee.shortName || ''}
                            onChange={(e) => handleInputChange('shortName', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Пол</FormLabel>
                        <Select
                            isSearchable
                            options={genders.map(gender => ({ label: gender, value: gender }))}
                            value={{ label: employee.gender || "", value: employee.gender || "" }}
                            onChange={(option) => handleInputChange('gender', option?.value || "")}
                            placeholder="Пол"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Телефон рабочий</FormLabel>
                        <Input
                            placeholder="Телефон рабочий"
                            value={employee.workPhone || ''}
                            onChange={(e) => handleInputChange('workPhone', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Телефон личный</FormLabel>
                        <Input
                            placeholder="Телефон личный"
                            value={employee.personalPhone || ''}
                            onChange={(e) => handleInputChange('personalPhone', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!timeWorkError}>
                        <FormLabel>Время работы</FormLabel>
                        <Input
                            placeholder="08:00-20:00"
                            value={employee.timeWork || ''}
                            onChange={(e) => handleInputChange('timeWork', e.target.value)}
                        />
                        {timeWorkError && <Box color="red.500" mt={2}>{timeWorkError}</Box>}
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Смена</FormLabel>
                        <Select
                            isSearchable
                            options={shifts.map(shift => ({ label: shift, value: shift }))}
                            value={{ label: employee.shift || "", value: employee.shift || "" }}
                            onChange={(option) => handleInputChange('shift', option?.value || "")}
                            placeholder="Смена"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Номер табеля</FormLabel>
                        <Input
                            placeholder="Номер табеля"
                            value={employee.rankNumber || ''}
                            onChange={(e) => handleInputChange('rankNumber', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Участок сотрудника</FormLabel>
                        <Select
                            isSearchable
                            options={sections.map(section => ({ label: section, value: section }))}
                            value={{ label: employee.section || "", value: employee.section || "" }}
                            onChange={(option) => handleInputChange('section', option?.value || "")}
                            placeholder="Участок сотрудника"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Должность</FormLabel>
                        <Select
                            isSearchable
                            options={roles.map(role => ({ label: role, value: role }))}
                            value={{ label: employee.rank || "", value: employee.rank || "" }}
                            onChange={(option) => handleInputChange('rank', option?.value || "")}
                            placeholder="Выберите должность"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Стажировка</FormLabel>
                        <Checkbox
                            isChecked={employee.internship || false}
                            onChange={(e) => handleInputChange('internship', e.target.checked)}
                        >
                            Стажировка
                        </Checkbox>
                    </FormControl>

                    {isCSIorCI && (
                        <>
                            <FormControl mt={4}>
                                <FormLabel>Статус работы</FormLabel>
                                <Input
                                    placeholder="Выходной"
                                    value={employee.workStatus || ''}
                                    onChange={(e) => handleInputChange('workStatus', e.target.value)}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Дополнительная смена</FormLabel>
                                <Input
                                    placeholder="Дополнительная смена"
                                    value={employee.extraShift || ''}
                                    onChange={(e) => handleInputChange('extraShift', e.target.value)}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Учебное время</FormLabel>
                                <Input
                                    placeholder="Учебное время"
                                    value={employee.studyTime || ''}
                                    onChange={(e) => handleInputChange('studyTime', e.target.value)}
                                />
                            </FormControl>
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleSave} colorScheme="blue" mr={3}>Сохранить</Button>
                    <Button onClick={onClose}>Отмена</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewEmployeeModal;