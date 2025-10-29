import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import ServiciosTab from './ServiciosTab.jsx';

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

const mockServiciosData = [
  {
    id: 1,
    nombre_servicio: 'Limpieza Dental',
    descripcion_servicio: 'Limpieza profesional de dientes',
    puntos: 50,
    estado: 1,
  },
  {
    id: 2,
    nombre_servicio: 'Blanqueamiento',
    descripcion_servicio: 'Blanqueamiento dental avanzado',
    puntos: 100,
    estado: 0,
  },
];

describe('ServiciosTab - Obtención de Datos del Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockReset();
  });

  test('obtiene y muestra los datos de los servicios correctamente', async () => {
    // Mock del endpoint con un retraso simulado
    axios.get.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: mockServiciosData }), 100))
    );

    render(
      <ServiciosTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    // Verificar que se llame al endpoint correcto
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/servicios-gamificacion',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    // Verificar que se muestre el nombre del primer servicio
    await waitFor(() => {
      expect(screen.getByText('Limpieza Dental')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre la descripción del primer servicio
    await waitFor(() => {
      expect(screen.getByText('Limpieza profesional de dientes')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre los puntos del primer servicio
    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el estado del primer servicio
    await waitFor(() => {
      expect(screen.getByText('Activo')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el nombre del segundo servicio
    await waitFor(() => {
      expect(screen.getByText('Blanqueamiento')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre la descripción del segundo servicio
    await waitFor(() => {
      expect(screen.getByText('Blanqueamiento dental avanzado')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre los puntos del segundo servicio
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que se muestre el estado del segundo servicio
    await waitFor(() => {
      expect(screen.getByText('Inactivo')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('muestra mensaje de no hay servicios cuando no están configurados', async () => {
    axios.get.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );

    render(
      <ServiciosTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/servicios-gamificacion',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No hay servicios asignados')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('maneja el error de la API de servicios correctamente', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error al obtener servicios'));

    render(
      <ServiciosTab
        colors={mockColors}
        isMobile={false}
        isTablet={false}
        showNotif={mockShowNotif}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://back-end-4803.onrender.com/api/gamificacion/servicios-gamificacion',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockShowNotif).toHaveBeenCalledWith('Error al cargar servicios', 'error');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No hay servicios asignados')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});