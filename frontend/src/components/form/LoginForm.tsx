import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import Button from "../Button";
import Label from "../Label";
import Checkbox from "../Checkbox";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import type { LoginFormProps } from "../../types/layouts/auth/loginForm";

export default function LoginForm({ onForgot }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Acesse o sistema</h2>
        <div className="mb-6">
          <hr className="border-t-2 rounded-full w-68 mx-auto" style={{ borderColor: "#8e8e8fff" }} />
        </div>
      </div>

      <form className="space-y-6">
        <div>
          <Label htmlFor="username" className="font-semibold text-base text-gray-700 mb-2 block">
            Usuário
          </Label>
          <Input 
            id="username" 
            type="text"
            placeholder="Digite seu usuário"
            icon={<User size={18} />}
            className="placeholder:text-gray-400 placeholder:opacity-90"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password" className="font-semibold text-base text-gray-700 mb-2 block">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              icon={<Lock size={18} />}
              className="placeholder:text-gray-400 placeholder:opacity-90 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 pt-2">
          <div className="flex items-center justify-between text-sm">
            <Checkbox Checked={rememberMe} onChange={setRememberMe} label="Lembre-se de mim" className="" />
            <button type="button" onClick={onForgot} className="text-gray-600 hover:text-blue-800 font-semibold underline transition-colors duration-200 cursor-pointer">
              Esqueceu a senha?
            </button>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button type="submit" className="w-full max-w-xs h-10 cursor-pointer bg-[#7499C3] hover:bg-[#1359bbff] transition-colors duration-200" disabled={!username || !password} onClick={handleSubmit}>
            Entrar
          </Button>
        </div>
      </form>
    </>
  );
}