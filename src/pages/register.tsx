import React from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";

interface RegisterPageProps {
  onBackHome?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackHome }) => {
  return (
    <>
      <Header />
      <main>
        {/* Register Page Content Placeholder */}
      </main>
      <Footer />
    </>
  );
};

export default RegisterPage;
