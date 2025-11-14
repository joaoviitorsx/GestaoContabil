export interface InputOTPProps{
    length: number;
    value: string;
    onChange: (otp: string) => void;
    className?: string;
}