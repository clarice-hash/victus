
import { API_BASE_URL } from '../config/environment';
import { TokenManager } from './authService';

class CourseService {
  static async getCourseDetails(courseId) {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        throw new Error('Utilizador não autenticado.');
      }

      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do curso.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes do curso:', error);
      throw error;
    }
  }
}

export default CourseService;
