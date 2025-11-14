import { useState } from "react";
import InputOTP from "../InputOTP";
import Button from "../Button";
import Label from "../Label";
import { RotateCcw } from "lucide-react";
import type { TokenFormProps } from "../../types/layouts/auth/tokenForm";

export default function TokenForm({ onBack, onNext }: TokenFormProps) {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isResending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            console.log("Token:", otp);
            setError("");
            onNext();
        } else {
            setError("Digite o código completo");
        }
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Verificação de código</h2>
                <div className="mb-6">
                    <hr className="border-t-2 rounded-full w-68 mx-auto" style={{ borderColor: "#8e8e8fff" }} />
                </div>
            </div>

            <div className="flex items-center justify-center mb-8 w-full max-w-md mx-auto">
                <p className="text-center text-sm text-gray-600 p-3 bg-blue-50 w-full rounded-md border border-blue-100">
                    Insira o código enviado para o seu e-mail
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <Label className="font-semibold text-base text-gray-700">Código de verificação</Label>
                    <InputOTP 
                        value={otp} 
                        onChange={(value) => { setOtp(value); setError(""); }} 
                        length={6} 
                        className="mb-2"
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                    )}
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-2 pt-4 m-auto w-64 p-4">
                    <p className="text-sm text-gray-600">Não recebeu o código?</p>
                    <button
                        type="button"
                        disabled={isResending}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                            console.log("popoco medoin")
                        }}
                    >
                        <RotateCcw size={14} className={`mr-1 ${isResending ? 'animate-spin' : ''}`} />
                        {isResending ? 'Reenviando...' : 'Reenviar código'}
                    </button>
                </div>

                <div className="flex justify-between pt-6">
                    <Button type="button" variant="secondary" onClick={onBack} className="cursor-pointer min-w-[100px]">
                        Voltar
                    </Button>
                    <Button type="submit" variant="primary" className="cursor-pointer min-w-[100px]" disabled={otp.length < 6}>
                        Confirmar
                    </Button>
                </div>
            </form>
        </>
    );
}