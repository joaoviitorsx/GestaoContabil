import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import Label from "../Label";
import { Eye, EyeOff } from "lucide-react";
import type { ResetPasswordFormProps } from "../../types/layouts/auth/resetPasswordForm";

export default function ResetPasswordForm({ onDone }: ResetPasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError("Nova senha é obrigatória");
      return;
    }
    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (!confirmPassword) {
      setError("Confirmação de senha é obrigatória");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");
    console.log("Nova senha definida:", newPassword);
    onDone();
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Redefinir senha</h2>
        <div className="mb-6">
          <hr className="border-t-2 rounded-full w-68 mx-auto" style={{ borderColor: "#8e8e8fff" }} />
        </div>
      </div>

      <div className="flex items-center justify-center mb-8 w-full max-w-md mx-auto">
        <p className="text-center text-sm text-gray-600 p-3 bg-blue-50 w-full rounded-md border border-blue-100">
          Defina uma nova senha para sua conta
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="new-password" className="font-semibold text-base text-gray-700 mb-2 block">
            Nova senha
          </Label>
          <div className="relative">
            <Input 
              id="new-password" 
              type={showNewPassword ? "text" : "password"} 
              placeholder="Digite sua nova senha" 
              className="placeholder:text-gray-400 placeholder:opacity-90 pr-10"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="font-semibold text-base text-gray-700 mb-2 block">
            Confirmar senha
          </Label>
          <div className="relative">
            <Input 
              id="confirm-password" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirme sua nova senha" 
              className="placeholder:text-gray-400 placeholder:opacity-90 pr-10"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-center pt-6">
          <Button type="submit" variant="primary" className="cursor-pointer min-w-[150px]" disabled={!newPassword || !confirmPassword}>
            Salvar nova senha
          </Button>
        </div>
      </form>
    </>
  );
}