/**
 * Hook personalizado para gestão de autenticação
 * Centraliza a lógica de estado de autenticação na aplicação
 */
import { useState, useEffect, useCallback } from 'react';
import AuthService from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verifica o estado de autenticação ao carregar
   */
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = AuthService.isAuthenticated();
        const userData = AuthService.getCurrentUser();
        
        setIsAuthenticated(authenticated);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Função de login
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro inesperado no login' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Função de logout
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};

export default useAuth;
