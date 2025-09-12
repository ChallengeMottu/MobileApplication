import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TelaAssociacao() {
  const [placaBusca, setPlacaBusca] = useState('');
  const [dadosMoto, setDadosMoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [codigoBeacon, setCodigoBeacon] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Buscar moto pela placa
  const buscarMoto = async () => {
    if (!placaBusca.trim()) {
      Alert.alert("ERRO", "Digite uma placa válida.");
      return;
    }

    setCarregando(true);
    
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
      if (dadosSalvos) {
        const moto = JSON.parse(dadosSalvos);

        // Comparar a placa digitada com a salva
        if (moto.placa.toLowerCase() === placaBusca.toLowerCase()) {
          setDadosMoto(moto);
        } else {
          Alert.alert("ACESSO NEGADO", "Nenhuma moto cadastrada com essa placa.");
          setDadosMoto(null);
        }
      } else {
        Alert.alert("BASE DE DADOS VAZIA", "Nenhuma moto cadastrada no sistema.");
        setDadosMoto(null);
      }
    } catch (error) {
      console.log("Erro ao buscar moto: ", error);
      Alert.alert("ERRO CRÍTICO", "Falha ao acessar base de dados.");
    } finally {
      setCarregando(false);
    }
  };

  // Associar beacon à moto
  const associarBeacon = async () => {
    if (!codigoBeacon.trim()) {
      Alert.alert("ERRO", "Digite um código de beacon válido.");
      return;
    }

    try {
      const novosDados = { ...dadosMoto, codigoBeacon };
      await AsyncStorage.setItem('dadosMoto', JSON.stringify(novosDados));
      setDadosMoto(novosDados);
      setModalVisible(false);
      setCodigoBeacon('');
      Alert.alert("SISTEMA ATUALIZADO", "Beacon associado com sucesso!");
    } catch (error) {
      console.log("Erro ao salvar beacon: ", error);
      Alert.alert("ERRO CRÍTICO", "Falha ao salvar associação.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header da operação */}
      <View style={styles.operationHeader}>
        <View/>
        <Ionicons name="link" size={28} color="#11881D" />
        <Text style={styles.operationTitle}>ASSOCIAÇÃO DE BEACON</Text>
        <Text style={styles.operationSubtitle}>VINCULAR DISPOSITIVO DE RASTREAMENTO</Text>
      </View>

      {/* Painel de busca */}
      <View style={styles.searchPanel}>
        <View style={styles.panelHeader}>
          <Ionicons name="search" size={20} color="#11881D" />
          <Text style={styles.panelTitle}>BUSCAR VEÍCULO</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PLACA DO VEÍCULO</Text>
          <TextInput
            style={styles.input}
            value={placaBusca}
            onChangeText={setPlacaBusca}
            placeholder="DIGITE A PLACA"
            placeholderTextColor="#666"
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity 
          style={[styles.searchButton, carregando && styles.buttonDisabled]} 
          onPress={buscarMoto}
          disabled={carregando}
        >
        
          {carregando ? (
            <Text style={styles.buttonText}>PROCESSANDO...</Text>
          ) : (
            <>
              <Ionicons name="search" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>INICIAR BUSCA</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Ficha do veículo */}
      {dadosMoto && (
        <View style={styles.vehicleCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bicycle" size={24} color="#11881D" />
            <Text style={styles.cardTitle}>DADOS DA MOTO</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ATIVO</Text>
            </View>
          </View>

          <View style={styles.dataGrid}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>MODELO</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{dadosMoto.modelo}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ANO DE FABRICAÇÃO</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{dadosMoto.anoFabricacao}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>CHASSI</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{dadosMoto.numeroChassi}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>CONDIÇÃO MECÂNICA</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{dadosMoto.condicaoMecanica}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>STATUS OPERACIONAL</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{dadosMoto.status}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>BEACON ASSOCIADO</Text>
              <View style={[
                styles.dataValueContainer, 
                dadosMoto.codigoBeacon ? styles.beaconActive : styles.beaconInactive
              ]}>
                <Text style={styles.dataValue}>
                  {dadosMoto.codigoBeacon || 'NÃO VINCULADO'}
                </Text>
                {dadosMoto.codigoBeacon && (
                  <Ionicons name="checkmark-circle" size={16} color="#11881D" style={styles.beaconIcon} />
                )}
              </View>
            </View>
          </View>

          {/* Imagem do veículo */}
          <View style={styles.vehicleImageContainer}>
            <Image
              style={styles.vehicleImage}
              source={require('../../assets/moto.png')}
            />
            <View style={styles.imageOverlay} />
          </View>

          {/* Botão de associação */}
          <TouchableOpacity 
            style={styles.associateButton} 
            onPress={() => setModalVisible(true)}
          >
            
            <Ionicons name="link" size={20} color="#ffffff" />
            <Text style={styles.associateText}>ASSOCIAR BEACON</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal futurista */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            <View style={styles.modalHeader}>
              <Ionicons name="settings" size={24} color="#11881D" />
              <Text style={styles.modalTitle}>CONFIGURAÇÃO DE BEACON</Text>
            </View>

            <Text style={styles.modalSubtitle}>INSIRA O CÓDIGO DO DISPOSITIVO</Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>CÓDIGO BEACON</Text>
              <TextInput
                style={styles.modalInput}
                value={codigoBeacon}
                onChangeText={setCodigoBeacon}
                placeholder="EX: B12345"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSave} 
                onPress={associarBeacon}
              >
                
                <Ionicons name="save" size={18} color="#ffffff" />
                <Text style={styles.modalButtonText}>SALVAR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonCancel} 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={18} color="#ffffff" />
                <Text style={styles.modalButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  // Operation Header
  operationHeader: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  
  operationTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 15,
    textAlign: 'center',
  },
  operationSubtitle: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },

  // Search Panel
  searchPanel: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#11881D',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    letterSpacing: 0.5,
  },
  searchButton: {
    backgroundColor: '#11881D',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  // Vehicle Card
  vehicleCard: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    position: 'relative',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#11881D',
    marginRight: 8,
  },
  statusText: {
    color: '#11881D',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Data Grid
  dataGrid: {
    marginBottom: 25,
  },
  dataRow: {
    marginBottom: 15,
  },
  dataLabel: {
    color: '#11881D',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  dataValueContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataValue: {
    color: '#ffffff',
    fontSize: 14,
    letterSpacing: 0.2,
    flex: 1,
  },
  beaconActive: {
    borderColor: '#11881D',
    backgroundColor: 'rgba(17, 136, 29, 0.1)',
  },
  beaconInactive: {
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  beaconIcon: {
    marginLeft: 10,
  },

  // Vehicle Image
  vehicleImageContainer: {
    position: 'relative',
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'transparent',
  },

  // Associate Button
  associateButton: {
    backgroundColor: '#11881D',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  associateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  modalSubtitle: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  modalInputContainer: {
    marginBottom: 30,
  },
  modalInputLabel: {
    color: '#11881D',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    letterSpacing: 0.5,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: '#11881D',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  
  modalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});