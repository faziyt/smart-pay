import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    username: string;
    balance: bigint;
}
export interface Transaction {
    id: string;
    to: Principal;
    status: TransactionStatus;
    transactionType: TransactionType;
    from: Principal;
    timestamp: Time;
    amount: bigint;
}
export enum TransactionStatus {
    completed = "completed",
    failed = "failed"
}
export enum TransactionType {
    topup = "topup",
    send = "send"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBalance(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMoney(to: Principal, amount: bigint): Promise<void>;
    setUsername(username: string): Promise<void>;
    topUp(amount: bigint): Promise<void>;
    userExists(user: Principal): Promise<boolean>;
}
