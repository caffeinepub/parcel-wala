import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Trip {
    id: bigint;
    verified: boolean;
    details: Conditional;
    travelMode: Mode;
    carrier: Principal;
}
export interface Rating {
    user: Principal;
    score: number;
}
export interface FlightDetails {
    flightNumber: string;
    airline: string;
    confirmed: boolean;
    bookingPNR: string;
}
export interface CarDetails {
    verified: boolean;
    registration: string;
}
export interface BusDetails {
    verified: boolean;
    operator: string;
    ticketReference?: string;
    seatNumber: bigint;
}
export interface TrainDetails {
    pnr: string;
    verified: boolean;
    trainNumber: string;
    trainName: string;
    seatBerth: string;
}
export type Conditional = {
    __kind__: "onFlight";
    onFlight: FlightDetails;
} | {
    __kind__: "onBus";
    onBus: BusDetails;
} | {
    __kind__: "onCar";
    onCar: CarDetails;
} | {
    __kind__: "onTrain";
    onTrain: TrainDetails;
};
export interface Parcel {
    id: bigint;
    description: string;
    sender: Principal;
    travelMode: Mode;
}
export interface UserProfile {
    governmentIdAddress?: string;
    governmentIdUploaded: boolean;
    identityVerified: boolean;
    emailVerified: boolean;
    name: string;
    phoneNumber?: string;
    phoneVerified: boolean;
}
export enum Mode {
    bus = "bus",
    car = "car",
    train = "train",
    flight = "flight",
    bike = "bike"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNotif(message: string): Promise<void>;
    adminVerifyUserId(user: Principal): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createParcel(desc: string, mode: Mode): Promise<bigint>;
    createTrip(details: Conditional, mode: Mode): Promise<bigint>;
    deleteParcel(id: bigint): Promise<void>;
    deleteTrip(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNotifications(): Promise<Array<string>>;
    getParcel(id: bigint): Promise<Parcel | null>;
    getRatings(user: Principal): Promise<Array<Rating>>;
    getTrip(id: bigint): Promise<Trip | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listParcels(): Promise<Array<Parcel>>;
    listTrips(): Promise<Array<Trip>>;
    markTripVerified(id: bigint, verified: boolean): Promise<void>;
    mustBeAdmin(): Promise<void>;
    mustBeUser(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    signUp(name: string, phoneNumber: string, governmentIdAddress: string): Promise<void>;
    submitRating(user: Principal, score: number): Promise<void>;
    updateParcel(id: bigint, desc: string, mode: Mode): Promise<void>;
    updateTrip(id: bigint, details: Conditional, mode: Mode): Promise<void>;
    uploadFrontIdScan(blob: ExternalBlob): Promise<{
        __kind__: "external";
        external: ExternalBlob;
    }>;
    verifyEmail(otp: string): Promise<boolean>;
    verifyMobileNumber(otp: string): Promise<boolean>;
}
