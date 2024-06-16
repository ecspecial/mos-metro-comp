"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Checkbox
} from "@chakra-ui/react";
import { User } from "@/types/types";
import Select, { SingleValue } from 'react-select';

interface NewUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export type OptionType = {
    label: string;
    value: string;
}

const roles = ["администратор", "специалист", "ЦИО", "ЦУ", "ЦСИ", "ЦИ"];


const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
    const [user, setUser] = useState<Partial<User>>({});
    const router = useRouter();

    const handleInputChange = (field: keyof User, value: any) => {
        setUser({
            ...user,
            [field]: value,
        });
    };

    const handleSave = async () => {
        try {
            await fetch('/api/user/post/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            onClose();
            onUserCreated();
            router.push('/users');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Добавить Пользователя</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Логин</FormLabel>
                        <Input
                            placeholder="Логин"
                            value={user.login || ''}
                            onChange={(e) => handleInputChange('login', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            placeholder="Пароль"
                            type="password"
                            value={user.password || ''}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Должность</FormLabel>
                        <Select
                            isSearchable
                            options={roles.map(role => ({ label: role, value: role }))}
                            value={{ label: user.role || "", value: user.role || "" }}
                            onChange={(option) => handleInputChange('role', option?.value || "")}
                            placeholder="Выберите должность"
                        />
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

export default NewUserModal;