"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Textarea,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Stack,
    Box
} from "@chakra-ui/react";
import { Passenger, PhoneNumber } from "@/types/types";
import Select, { SingleValue } from 'react-select';


interface NewPassengerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPassengerCreated: () => void;
}

export type OptionType = {
    label: string;
    value: string;
}

const categories = ["ИЗТ", "ИЗ", "ИС", "ИК", "ИО", "ДИ", "ПЛ", "РД", "РДК", "ОГД", "ОВ", "ИУ"];
const genders = ["Мужской", "Женский"];

const NewPassengerModal: React.FC<NewPassengerModalProps> = ({ isOpen, onClose, onPassengerCreated }) => {
    const [passenger, setPassenger] = useState<Partial<Passenger>>({
        phoneNumbers: [{ phone_number: '', description: '' }]
    });

    const router = useRouter();


    const handleInputChange = (field: keyof Passenger, value: any) => {
        setPassenger({
            ...passenger,
            [field]: value,
        });
    };

    const handlePhoneNumberChange = (index: number, field: keyof PhoneNumber, value: string) => {
        const updatedPhoneNumbers = [...(passenger.phoneNumbers || [])];
        updatedPhoneNumbers[index] = {
            ...updatedPhoneNumbers[index],
            [field]: value,
        };
        setPassenger({
            ...passenger,
            phoneNumbers: updatedPhoneNumbers
        });
    };

    const addPhoneNumberField = () => {
        setPassenger({
            ...passenger,
            phoneNumbers: [...(passenger.phoneNumbers || []), { phone_number: '', description: '' }]
        });
    };

    const removePhoneNumberField = (index: number) => {
        const updatedPhoneNumbers = passenger.phoneNumbers?.filter((_, i) => i !== index);
        setPassenger({
            ...passenger,
            phoneNumbers: updatedPhoneNumbers
        });
    };

    const handleSave = async () => {
        try {
            await fetch('/api/passenger/post/createPassenger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passenger),
            });
            onClose();
            onPassengerCreated();
            router.push('/passengers');
        } catch (error) {
            console.error('Error creating passenger:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Добавить Пассажира</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>ФИО</FormLabel>
                        <Input
                            placeholder="ФИО"
                            value={passenger.fullName || ''}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Пол</FormLabel>
                        <Select
                            isSearchable
                            options={genders.map(gender => ({ label: gender, value: gender }))}
                            value={{ label: passenger.gender || "", value: passenger.gender || "" }}
                            onChange={(option) => handleInputChange('gender', option?.value || "")}
                            placeholder="Пол"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Категория</FormLabel>
                        <Select
                            isSearchable
                            options={categories.map(category => ({ label: category, value: category }))}
                            value={{ label: passenger.category || "", value: passenger.category || "" }}
                            onChange={(option) => handleInputChange('category', option?.value || "")}
                            placeholder="Выберите категорию"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Дополнительная информация</FormLabel>
                        <Textarea
                            placeholder="Дополнительная информация"
                            value={passenger.additionalInfo || ''}
                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Номера телефонов</FormLabel>
                        <Stack spacing={3}>
                            {passenger.phoneNumbers?.map((phoneNumber, index) => (
                                <Box key={index}>
                                    <Input
                                        placeholder="Номер телефона"
                                        value={phoneNumber.phone_number}
                                        onChange={(e) => handlePhoneNumberChange(index, 'phone_number', e.target.value)}
                                        mb={2}
                                    />
                                    <Input
                                        placeholder="Описание"
                                        value={phoneNumber.description}
                                        onChange={(e) => handlePhoneNumberChange(index, 'description', e.target.value)}
                                        mb={2}
                                    />
                                    <Button width='100%' onClick={() => removePhoneNumberField(index)} colorScheme="red">Удалить номер телефона</Button>
                                </Box>
                            ))}
                            <Button onClick={addPhoneNumberField} colorScheme="blue">Добавить номер телефона</Button>
                        </Stack>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Наличие Электрокардиостимулятора</FormLabel>
                        <Checkbox
                            isChecked={passenger.eks || false}
                            onChange={(e) => handleInputChange('eks', e.target.checked)}
                        >
                            Наличие Электрокардиостимулятора
                        </Checkbox>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleSave} colorScheme="blue" mr={3}>Сохранить</Button>
                    <Button onClick={onClose}>Отмена</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewPassengerModal;