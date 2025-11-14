import loginImg from '../assets/login3.png';
import sendEmailImg from '../assets/sendEmail.png';
import tokenImg from '../assets/token.png';
import resetSenhaImg from '../assets/resetSenha.png';

const Ilustration: Record<string, string> = {
    "login": loginImg,
    "email": sendEmailImg,
    "token": tokenImg,
    "reset-password": resetSenhaImg,
};

const useIlustracaoForm = (pageImg: string) => {
    return Ilustration[pageImg] || loginImg;
};

export default useIlustracaoForm;