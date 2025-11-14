import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import Label from "../Label";
import { Mail } from "lucide-react";
import type { EmailFormProps } from "../../types/layouts/auth/emailForm";

export default function SendEmailForm({ onBack, onNext }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Email é obrigatório");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Digite um email válido");
      return;
    }

    setIsLoading(true);
    setError("");
    
    setIsLoading(false);
    onNext();
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Recuperar senha</h2>
        <div className="mb-6">
          <hr className="border-t-2 rounded-full w-68 mx-auto" style={{ borderColor: "#8e8e8fff" }} />
        </div>
      </div>

      <div className="flex items-center justify-center mb-8 w-full max-w-md mx-auto">
        <p className="text-center text-sm text-gray-600 p-3 bg-blue-50 w-full rounded-md border border-blue-100">
          O token de recuperação será enviado para o seu e-mail
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="font-semibold text-base text-gray-700 mb-2 block">
            E-mail
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Digite seu e-mail" 
            icon={<Mail size={18} />}
            className="placeholder:text-gray-400 placeholder:opacity-90"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onBack} 
            className="cursor-pointer min-w-[100px]"
            disabled={isLoading}
          >
            Voltar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="cursor-pointer min-w-[100px]"
            disabled={!email || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </Button>
        </div>
      </form>
    </>
  );
}