import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import RecompensaTab from './RecompensaTab.jsx';

// Mock axios
jest.mock('axios');

// Mock de la prop showNotif
const mockShowNotif = jest.fn();

const mockColors = {
  primary: '#3f51b5',
  primaryDark: '#303f9f',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#d32f2f',
  text: '#212121',
  secondaryText: '#757575',
  gradient: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
  gradientAlt: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
  gradientWarning: 'linear-gradient(135deg, #ff9800 0%, #ffb300 100%)',
  cardBg: '#ffffff',
  border: '#e0e0e0',
  shadow: '0 4px 20px rgba(0,0,0,0.1)',
  paper: '#f5f5f5',
  glassBlur: 'blur(10px)',
};

// Datos exactos del endpoint
const mockRecompensaData = {
  id: 1,
  nombre: 'Descuento ',
  descripcion: 'Recibe un descuento al acompletar un porcentaje de citas',
  tipo: 'descuento',
  puntos_requeridos: 100,
  icono: 'crown', // Ajustado a 'crown' para coincidir con ICONOS_DISPONIBLES
  premio: '10% de descuento',
  estado: 1,
  orden: 0,
};

describe('RecompensaTab - Obtención de Datos del Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockReset();
  });

  test('obtiene y muestra los datos de la recompensa correctamente', async () => {
    // Mock del endpoint con un retraso simulado
    axios.get.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: mockRecompensaData }), 100))
    );

    render(
      <RecompensaTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    // Verificar que se llame al endpoint correcto
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/recompensa',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    // Verificar que se muestre el nombre
    await waitFor(() => {
      expect(screen.getByText('Descuento')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre la descripción
    await waitFor(() => {
      expect(
        screen.getByText('Recibe un descuento al acompletar un porcentaje de citas')
      ).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el premio (ajustado al texto completo renderizado)
    await waitFor(() => {
      expect(screen.getByText('Premio: 10% de descuento')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre los puntos
    await waitFor(() => {
      expect(screen.getByText('100 puntos')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el tipo
    await waitFor(() => {
      expect(screen.getByText('descuento')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el estado
    await waitFor(() => {
      expect(screen.getByText('Activa')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('muestra mensaje de no hay recompensa cuando no está configurada', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    render(
      <RecompensaTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/recompensa',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No hay recompensa configurada')).toBeInTheDocument();
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('Crea una recompensa para comenzar')).toBeInTheDocument();
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockShowNotif).not.toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test('maneja el error de timeout de la API correctamente', async () => {
    axios.get.mockRejectedValueOnce({ code: 'ECONNABORTED' });

    render(
      <RecompensaTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/recompensa',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockShowNotif).toHaveBeenCalledWith(
        'Tiempo de espera agotado. Intenta nuevamente.',
        'error'
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No hay recompensa configurada')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('maneja errores genéricos de la API correctamente', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error inesperado'));

    render(
      <RecompensaTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/recompensa',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockShowNotif).toHaveBeenCalledWith('Error al cargar recompensa', 'error');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No hay recompensa configurada')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('muestra el CircularProgress mientras se cargan los datos', () => {
    axios.get.mockReturnValueOnce(new Promise(() => {})); // Nunca resuelve

    render(
      <RecompensaTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});