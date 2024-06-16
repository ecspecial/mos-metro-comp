"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Textarea,
    NumberInput,
    NumberInputField,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { Application, Passenger, TransferStation } from "@/types/types";
import Select, { SingleValue } from 'react-select';
import metroStations from '@/app/lib/data/metroStations.json';

registerLocale("ru", ru);

export type OptionType = {
    label: string;
    value: string;
}

export type PassengerOptionType = {
    label: string;
    value: string;
    category?: string;
}

interface NewApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplicationCreated: () => void;
}

const categories = ["ИЗТ", "ИЗ", "ИС", "ИК", "ИО", "ДИ", "ПЛ", "РД", "РДК", "ОГД", "ОВ", "ИУ"];
const statusOptions = ["Принята", "Инспектор выехал", "Инспектор на месте", "Поездка", "Заявка закончена", "Пассажир опаздывает", "Инспектор опаздывает"];
const methodOptions = ["по телефону", "через электронные сервисы"];
const railwayOptions = [
    "Белорусский вокзал",
    "Восточный вокзал",
    "Казанский вокзал",
    "Киевский вокзал",
    "Курский вокзал",
    "Ленинградский вокзал",
    "Павелецкий вокзал",
    "Рижский вокзал",
    "Савёловский вокзал",
];

const NewApplicationModal: React.FC<NewApplicationModalProps> = ({ isOpen, onClose, onApplicationCreated }) => {
    const [application, setApplication] = useState<Partial<Application>>({
        maleStaffCount: 0, // Default value set to 0
        femaleStaffCount: 0 // Default value set to 0
    });
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStation1, setSelectedStation1] = useState<SingleValue<OptionType>>(null);
    const [selectedStation2, setSelectedStation2] = useState<SingleValue<OptionType>>(null);
    const [selectedPassenger, setSelectedPassenger] = useState<SingleValue<PassengerOptionType>>(null);
    const [stationOptions, setStationOptions] = useState<OptionType[]>([]);
    const [passengerOptions, setPassengerOptions] = useState<PassengerOptionType[]>([]);
    const [route, setRoute] = useState<string>("");
    const [shortestPath, setShortestPath] = useState<number>(0);
    const [transfers, setTransfers] = useState<TransferStation[]>([]);
    const [selectedRailway, setSelectedRailway] = useState<SingleValue<OptionType>>(null);


    useEffect(() => {
        // Transform metro stations JSON into options for Select component
        const stationOptions = metroStations.map(station => ({
            label: station.name_station,
            value: station.id,
        }));
        setStationOptions(stationOptions);
    }, []);

    useEffect(() => {
        // Fetch all passengers and transform into options for Select component
        const fetchPassengers = async () => {
            try {
                const response = await fetch('/api/passenger/get/getAllPassengers');
                const data = await response.json();
                const passengerOptions = data.map((passenger: Passenger) => ({
                    label: passenger.fullName,
                    value: passenger.id.toString(),
                    category: passenger.category,
                }));
                setPassengerOptions(passengerOptions);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        };

        fetchPassengers();
    }, []);

    const handleInputChange = (field: keyof Application, value: any) => {
        // Parse integer values for staff count to prevent NaN issues
        if (field === "maleStaffCount" || field === "femaleStaffCount") {
            value = parseInt(value) || 0; // Default to 0 if NaN
        }
        setApplication(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCalculateRoute = async () => {
        if (selectedStation1 && selectedStation2) {
            const startStation = metroStations.find(station => station.id === selectedStation1.value);
            const endStation = metroStations.find(station => station.id === selectedStation2.value);

            if (startStation && endStation) {
                const start = `${startStation.id}_${startStation.id_line}`;
                const end = `${endStation.id}_${endStation.id_line}`;

                try {
                    const response = await fetch('/api/path/post/getShortestPath', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ start, end }),
                    });
                    const result = await response.json();
                    setRoute(result.result.path);
                    setShortestPath(result.result.shortestPath);
                    setTransfers(result.result.transfers);
                    handleInputChange('pathString', result.result.path);
                    handleInputChange('pathTime', result.result.shortestPath);
                    handleInputChange('transferStations', result.result.transfers);
                } catch (error) {
                    console.error('Error calculating route:', error);
                }
            }
        }
    };

    const handlePassengerChange = (option: SingleValue<PassengerOptionType>) => {
        setSelectedPassenger(option);
        if (option) {
            const passenger = passengerOptions.find(p => p.value === option.value);
            if (passenger) {
                handleInputChange('category', passenger.category); // assuming category is part of the passenger's name
            }
        }
    };

    const handleSave = async () => {
        const newApplication: Partial<Application> = {
            ...application,
            datetime: startDate ? startDate.toISOString() : "",
            endTime: endDate ? endDate.toISOString() : undefined,
            station1Id: selectedStation1 ? parseInt(selectedStation1.value) : undefined,
            station2Id: selectedStation2 ? parseInt(selectedStation2.value) : undefined,
            passengerId: selectedPassenger ? parseInt(selectedPassenger.value) : undefined,
            pathTime: shortestPath,
            transferStations: transfers,
            railway: selectedRailway ? selectedRailway.value : undefined,
        };

        try {
            const response = await fetch('/api/application/post/createApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newApplication),
            });

            if (response.ok) {
                const result = await response.json();
                onApplicationCreated();
                handleClose();
            } else {
                console.error('Failed to create application');
            }
        } catch (error) {
            console.error('Error creating application:', error);
        }
    };

    const handleClose = () => {
        setApplication({});
        setStartDate(null);
        setEndDate(null);
        setSelectedStation1(null);
        setSelectedStation2(null);
        setSelectedPassenger(null);
        setSelectedRailway(null);
        setRoute("");
        setShortestPath(0);
        setTransfers([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Создать Заявку</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Начальная станция метро</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={stationOptions}
                            value={selectedStation1}
                            onChange={(option) => setSelectedStation1(option)}
                            placeholder="Выберите начальную станцию метро"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Конечная станция метро</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={stationOptions}
                            value={selectedStation2}
                            onChange={(option) => setSelectedStation2(option)}
                            placeholder="Выберите конечную станцию метро"
                        />
                    </FormControl>

                    <Button mt={4} colorScheme="blue" onClick={handleCalculateRoute}>Рассчитать маршрут</Button>

                    {route && (
                        <FormControl mt={4}>
                            <FormLabel>Маршрут</FormLabel>
                            <Textarea value={route} isReadOnly />
                        </FormControl>
                    )}

                    {shortestPath !== 0 && (
                        <FormControl mt={4}>
                            <FormLabel>Время маршрута</FormLabel>
                            <Textarea value={`${shortestPath} мин.`} isReadOnly />
                        </FormControl>
                    )}

                    <FormControl mt={4}>
                        <FormLabel>Метод приема</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={methodOptions.map(method => ({ label: method, value: method }))}
                            value={{ label: application.applicationType || "", value: application.applicationType || "" }}
                            onChange={(option) => handleInputChange('applicationType', option?.value || "")}
                            placeholder="Выберите метод приема"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Пассажир</FormLabel>
                        <Select<PassengerOptionType>
                            isSearchable
                            options={passengerOptions}
                            value={selectedPassenger}
                            onChange={handlePassengerChange}
                            placeholder="Выберите пассажира"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Категория</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={categories.map(category => ({ label: category, value: category }))}
                            value={{ label: application.category || "", value: application.category || "" }}
                            onChange={(option) => handleInputChange('category', option?.value || "")}
                            placeholder="Выберите категорию"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Описание</FormLabel>
                        <Textarea
                            placeholder="Описание"
                            value={application.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Статус</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={statusOptions.map(status => ({ label: status, value: status }))}
                            value={{ label: application.status || "", value: application.status || "" }}
                            onChange={(option) => handleInputChange('status', option?.value || "")}
                            placeholder="Выберите статус"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Дата и Время</FormLabel>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            dateFormat="dd.MM.yyyy / HH:mm"
                            locale="ru"
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            customInput={
                                <Input
                                    placeholder="Дата и Время"
                                />
                            }
                        />
                    </FormControl>


                    <FormControl mt={4}>
                        <FormLabel>Количество сотрудников мужского пола</FormLabel>
                        <NumberInput
                            value={application.maleStaffCount || 0}
                            onChange={(valueString) => handleInputChange('maleStaffCount', valueString)}
                            min={0}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Количество сотрудников женского пола</FormLabel>
                        <NumberInput
                            value={application.femaleStaffCount || 0}
                            onChange={(valueString) => handleInputChange('femaleStaffCount', valueString)}
                            min={0}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Количество пассажиров</FormLabel>
                        <NumberInput
                            value={application.passengerQty || 0}
                            onChange={(valueString) => handleInputChange('passengerQty', parseInt(valueString))}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Вокзал</FormLabel>
                        <Select<OptionType>
                            isSearchable
                            options={railwayOptions.map(railway => ({ label: railway, value: railway }))}
                            value={{ label: application.railway || "", value: application.railway || "" }}
                            onChange={(option) => handleInputChange('railway', option?.value || "")}
                            placeholder="Выберите вокзал"
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Багаж</FormLabel>
                        <Input
                            placeholder="Багаж"
                            value={application.baggage || ''}
                            onChange={(e) => handleInputChange('baggage', e.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleSave} colorScheme="blue" mr={3}>Сохранить</Button>
                    <Button onClick={handleClose}>Отмена</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewApplicationModal;