import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = 'http://192.168.1.100:8080/api'; 

// Função auxiliar para obter token (se sua API usar autenticação)
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.log('Erro ao obter token:', error);
    return null;
  }
};

// Mapear valores do formulário para os ENUMs da API
const mapModeloParaEnum = (modelo) => {
  const mapeamento = {
    'Sport 110i': 'SPORT_110I',
    'Mottu E': 'MOTTU_E',
    'Mottu Pop 110i': 'MOTTU_POP_110I',
  };
  return mapeamento[modelo] || modelo;
};

const mapStatusParaEnum = (status) => {
  const mapeamento = {
    'Moto normal com placa': 'AVAILABLE',
    'Moto sem placa': 'IN_USE',
    'Moto parada por situação de furto': 'MAINTENANCE_THEFT',
    'Moto parada por situação de acidente': 'MAINTENANCE_ACCIDENT',
    'Moto em manutenção': 'MAINTENANCE_GENERAL',
  };
  return mapeamento[status] || 'AVAILABLE';
};

// CADASTRAR MOTO
export const cadastrarMoto = async (dadosMoto) => {
  try {
    const token = await getAuthToken();
    
    const payload = {
      licensePlate: dadosMoto.placa.toUpperCase(),
      model: mapModeloParaEnum(dadosMoto.modelo),
      chassisNumber: dadosMoto.numeroChassi.toUpperCase(),
      operationalStatus: mapStatusParaEnum(dadosMoto.status),
      mechanicalCondition: dadosMoto.condicaoMecanica,
      parkingId: dadosMoto.parkingId || 1,
    };

    console.log('📤 Enviando para API:', payload);

    const response = await fetch(`${API_BASE_URL}/motorcycles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('📥 Resposta da API:', responseText);

    if (!response.ok) {
      let errorMessage = 'Erro ao cadastrar moto';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = responseText ? JSON.parse(responseText) : {};
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao cadastrar moto:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao conectar com o servidor' 
    };
  }
};

// BUSCAR MOTO POR ID
export const buscarMotoPorId = async (motorcycleId) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/motorcycles/${motorcycleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Moto não encontrada');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao buscar moto por ID:', error);
    return { success: false, error: error.message };
  }
};

// BUSCAR MOTO POR PLACA
export const buscarMotoPorPlaca = async (placa) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/motorcycles/placa/${placa.toUpperCase()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Moto de placa ${placa} não encontrada`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao buscar moto por placa:', error);
    return { success: false, error: error.message };
  }
};

// BUSCAR MOTOS POR PÁTIO
export const buscarMotosPorPatio = async (parkingId) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/motorcycles/parking/${parkingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Pátio não encontrado');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao buscar motos por pátio:', error);
    return { success: false, error: error.message };
  }
};

// ATUALIZAR MOTO
export const atualizarMoto = async (motorcycleId, dadosMoto) => {
  try {
    const token = await getAuthToken();

    const payload = {
      licensePlate: dadosMoto.placa.toUpperCase(),
      model: mapModeloParaEnum(dadosMoto.modelo),
      chassisNumber: dadosMoto.numeroChassi.toUpperCase(),
      operationalStatus: mapStatusParaEnum(dadosMoto.status),
      mechanicalCondition: dadosMoto.condicaoMecanica,
      parkingId: dadosMoto.parkingId || 1,
    };

    const response = await fetch(`${API_BASE_URL}/motorcycles/${motorcycleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao atualizar moto');
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar moto:', error);
    return { success: false, error: error.message };
  }
};

// DELETAR MOTO
export const deletarMoto = async (motorcycleId) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/motorcycles/${motorcycleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar moto');
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao deletar moto:', error);
    return { success: false, error: error.message };
  }
};

export default {
  cadastrarMoto,
  buscarMotoPorId,
  buscarMotoPorPlaca,
  buscarMotosPorPatio,
  atualizarMoto,
  deletarMoto,
};