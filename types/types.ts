export interface User {
    id: number;
    login: string;
    password: string;
    role: string;
    createdAt: string;
    employee?: Employee;
}

export interface Station {
    id: number;
    name: string;
    lineName: string;
    lineId: number;
    travelTimesAsStart: TravelTime[];
    travelTimesAsEnd: TravelTime[];
    transferTimesAsStart: TransferTime[];
    transferTimesAsEnd: TransferTime[];
    requestsAsStart: Application[];
    requestsAsEnd: Application[];
}

export interface TravelTime {
    id: number;
    station1Id: number;
    station2Id: number;
    time: number;
    station1: Station;
    station2: Station;
}

export interface TransferTime {
    id: number;
    station1Id: number;
    station2Id: number;
    time: number;
    station1: Station;
    station2: Station;
}

export interface Employee {
    id: number;
    fullName: string;
    shortName: string;
    gender: string;
    lunchBreak: string;
    timeWork: string;
    shift: string;
    workPhone: string;
    personalPhone: string;
    rankNumber: string;
    entryDate: string;
    section: string;
    rank: string;
    workStatus?: string;
    extraShift?: string;
    studyTime?: string;
    workTimeChange?: string;
    internship: boolean;
    user?: User;
    userId?: number;
    assignments: ApplicationAssignment[];
    editingStatus: boolean;
}

export interface PhoneNumber {
    phone_number: string;
    description: string;
}

export interface Passenger {
    id: number;
    fullName: string;
    phoneNumbers: PhoneNumber[];
    gender: string;
    category: string;
    additionalInfo: string;
    createdAt: string;
    eks: boolean;
    applications: Application[];
    editingStatus: boolean;
}

export interface TransferStation {
    transfer_start: string;
    transfer_end: string;
    transfer_station_start: string;
    transfer_station_end: string;
    transfer_station_start_id: string;
    transfer_station_end_id: string;
    transfer_time: string;
}

export interface Application {
    id: number;
    passengerId: number;
    datetime: string;
    startTime?: string;
    endTime?: string;
    category: string;
    status: string;
    registrationTime: string;
    maleStaffCount: number;
    femaleStaffCount: number;
    station1Id: number;
    station2Id: number;
    applicationType: string;
    railway?: string;
    transferStations: TransferStation[];
    pathTime: number;
    pathString?: string;
    description: string;
    passengerQty: number;
    baggage?: string;
    station1: Station;
    station2: Station;
    passenger: Passenger;
    assignments: ApplicationAssignment[];
    cancellations: Cancellation[];
    changes: RequestChange[];
    noShows: NoShow[];
    editingStatus?: boolean;
}

export interface ApplicationAssignment {
    id: number;
    applicationId: number;
    employeeId: number;
    startTime: string;
    endTime: string;
    application: Application;
    employee: Employee;
}

export interface Cancellation {
    id: number;
    requestId: number;
    dateTime: string;
    request: Application;
}

export interface RequestChange {
    id: number;
    requestId: number;
    editTime: string;
    startTime: string;
    endTime: string;
    request: Application;
}

export interface NoShow {
    id: number;
    requestId: number;
    dateTime: string;
    request: Application;
}