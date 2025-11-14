import { useSearchParams } from "react-router-dom";

import AuthBgLayout from "../../layouts/auth/AuthBgLayout";
import AuthSplitLayout from "../../layouts/auth/AuthSplitLayout";
import { Card } from "antd";

import LoginForm from "../../components/form/LoginForm";
import SendEmailForm from "../../components/form/EmailForm";
import TokenForm from "../../components/form/TokenForm";
import ResetPasswordForm from "../../components/form/ResetPasswordForm";
import AnimationImg from "../../components/AnimationImg";

import useIlustracaoForm from "../../hooks/ilustrationHook";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [paramens, setParamens] = useSearchParams();
  const activeTabKey = paramens.get("page") || "login"
  const currentIllustration = useIlustracaoForm(activeTabKey);
  const [content, setContent] = useState<"login" | "email" | "token" | "reset-password">(activeTabKey as any);

  useEffect(() => {
    setContent(activeTabKey as "login" | "email" | "token" | "reset-password")
  }, [activeTabKey])

  const forms = {
    "login": <LoginForm onForgot={() => { setContent("email"); setParamens({ page: "email" }) }} />,
    "email": <SendEmailForm onBack={() => { setContent("login"); setParamens({ page: "login" })}} onNext={() => { setContent("token"); setParamens( {page: "token"})}} />,
    "token": <TokenForm onBack={() => { setContent("email"); setParamens({page:"email"}) }} onNext={() => { setContent("reset-password"); setParamens({ page: "reset-password"})}} />,
    "reset-password": <ResetPasswordForm onDone={() => { setContent("login"); setParamens("login")}} />,
  }

  return (
    <AuthBgLayout>
      <AuthSplitLayout
        left={
          <div className="flex flex-col items-center h-full justify-center relative">
            <div className="absolute top-5">
              <img
                src="./src/assets/empresa.png" 
                alt="Logo"
                className="w-80 object-contain"
              />
            </div>

            <div className="flex flex-1 items-center justify-center w-full overflow-hidden mt-12">
              <AnimationImg
                  uniqueKey={activeTabKey}
                  src={currentIllustration}
                  alt="Ilustração"
                  className="w-90 object-contain drop-shadow-lg mx-auto"
                />
            </div>
          </div>
        }
        right={
          <Card className="w-full max-w-md mx-auto">
            {forms[content]}
          </Card>
        }
      />
    </AuthBgLayout>
  );
}