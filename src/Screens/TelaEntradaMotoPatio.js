import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const EntradaMotoPatio = ({ navigation }) => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [placa, setPlaca] = useState('');
  const [formData, setFormData] = useState({
    modelo: '',
    numeroChassi: '',
    condicaoMecanica: '',
    status: '',
    anoFabricacao: ''
  });
  const [codigoBeacon, setCodigoBeacon] = useState('');
  const [modalCodigoVisible, setModalCodigoVisible] = useState(false);
  const [rastreandoBeacon, setRastreandoBeacon] = useState(false);
  const [beaconDetectado, setBeaconDetectado] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  const handlePlacaChange = useCallback((value) => {
    setPlaca(value);
  }, []);

  const handleCodigoBeaconChange = useCallback((value) => {
    setCodigoBeacon(value);
  }, []);

  const handleBuscarMoto = () => {
    if (!placa.trim()) {
      Alert.alert('Atenção', 'Por favor, digite a placa da moto.');
      return;
    }
    setEtapaAtual(2);
  };

  const handleDigitalizarPlaca = () => {
    Alert.alert('Câmera', 'Funcionalidade de digitalização será implementada');
  };

  const handleControlarMoto = () => {
    if (!formData.modelo || !formData.numeroChassi || !formData.condicaoMecanica || !formData.status || !formData.anoFabricacao) {
      Alert.alert('Campos obrigatórios', 'Por favor preencha todos os campos antes de continuar.');
      return;
    }
    setEtapaAtual(3);
  };

  const handleRastrear = () => {
    setRastreandoBeacon(true);
    setTimeout(() => {
      setBeaconDetectado({
        codigo: 'BCN-2024-001',
        sinal: '-45dBm',
        bateria: '85%'
      });
      setRastreandoBeacon(false);
      setEtapaAtual(4);
    }, 3000);
  };

  const handleCodigoManual = () => {
    setModalCodigoVisible(true);
  };

  const confirmarCodigoManual = () => {
    if (!codigoBeacon.trim()) {
      Alert.alert('Atenção', 'Por favor, digite o código do beacon.');
      return;
    }
    setBeaconDetectado({
      codigo: codigoBeacon,
      sinal: 'Manual',
      bateria: 'N/A'
    });
    setModalCodigoVisible(false);
    setEtapaAtual(4);
  };

  const handleFinalizarEntrada = () => {
    Alert.alert(
      'Sucesso!',
      'Beacon associado à moto com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => {
            setEtapaAtual(1);
            setPlaca('');
            setFormData({
              modelo: '',
              numeroChassi: '',
              condicaoMecanica: '',
              status: '',
              anoFabricacao: ''
            });
            setBeaconDetectado(null);
            setCodigoBeacon('');
            navigation.navigate('TelaFuncionario');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {etapaAtual === 1 && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.titulo}>Entrada de moto e Alocação</Text>
            <Text style={styles.subtitulo}>Processo de entrada de moto informada no pátio</Text>

            <View style={styles.separador} />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Escolha entre</Text>
              <TextInput
                style={styles.input}
                value={placa}
                onChangeText={handlePlacaChange}
                placeholder="Digite a placa da moto"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Digitalizar a placa</Text>
              <TouchableOpacity style={styles.cameraButton} onPress={handleDigitalizarPlaca}>
                <Ionicons name="camera" size={24} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleBuscarMoto}>
              <Text style={styles.textoBotao}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 2 && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(1)}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.titulo}>Ficha da Moto</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Modelo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.modelo}
                  onValueChange={(value) => handleInputChange('modelo', value)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item style={styles.pickerItem} label="Modelo" value="" />
                  <Picker.Item style={styles.pickerItem} label="Sport 110i" value="Sport 110i" />
                  <Picker.Item style={styles.pickerItem} label="Mottu E" value="Mottu E" />
                  <Picker.Item style={styles.pickerItem} label="Mottu Pop 110i" value="Mottu Pop 110i" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ano Fabricação</Text>
              <TextInput
                style={styles.input}
                value={formData.anoFabricacao}
                onChangeText={(value) => handleInputChange('anoFabricacao', value)}
                placeholder="Ano Fabricação"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número de Chassi</Text>
              <TextInput
                style={styles.input}
                value={formData.numeroChassi}
                onChangeText={(value) => handleInputChange('numeroChassi', value)}
                placeholder="Número de Chassi"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item style={styles.pickerItem} label="Status" value="" />
                  <Picker.Item style={styles.pickerItem} label="Sem Placa" value="Sem Placa" />
                  <Picker.Item style={styles.pickerItem} label="Com Placa" value="Com Placa" />
                  <Picker.Item style={styles.pickerItem} label="Situação de Furto" value="Situação de Furto" />
                  <Picker.Item style={styles.pickerItem} label="Situação de Acidente" value="Situação de Acidente" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Condição Mecânica</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.condicaoMecanica}
                  onValueChange={(value) => handleInputChange('condicaoMecanica', value)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item style={styles.pickerItem} label="Condição Mecânica" value="" />
                  <Picker.Item style={styles.pickerItem} label="Bom Estado Mecânico" value="Bom Estado Mecânico" />
                  <Picker.Item style={styles.pickerItem} label="Gravemente Danificada" value="Gravemente Danificada" />
                  <Picker.Item style={styles.pickerItem} label="Inoperante" value="Inoperante" />
                  <Picker.Item style={styles.pickerItem} label="Necessita de Revisão" value="Necessita de Revisão" />
                  <Picker.Item style={styles.pickerItem} label="Pequenos Reparos" value="Pequenos Reparos" />
                </Picker>
              </View>
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleControlarMoto}>
              <Text style={styles.textoBotao}>Controlar moto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 3 && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(2)}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.titulo}>Ficha da Moto</Text>

            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly]} value={formData.modelo} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly]} value={formData.anoFabricacao} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly]} value={formData.numeroChassi} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly]} value={formData.status} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly]} value={formData.condicaoMecanica} editable={false} />
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <View style={styles.cardProcedimento}>
              <Text style={styles.tituloProcedimento}>Procedimento de controle</Text>
              <Text style={styles.textoProcedimento}>1. Ligue o beacon</Text>
              <Text style={styles.textoProcedimento}>2. Clique no botão rastrear para encontrar automaticamente ou dispositivo</Text>

              <TouchableOpacity 
                style={[styles.botaoRastrear, rastreandoBeacon && styles.botaoRastreando]} 
                onPress={handleRastrear}
                disabled={rastreandoBeacon}
              >
                {rastreandoBeacon ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="bluetooth" size={20} color="#fff" />
                )}
                <Text style={styles.textoBotaoRastrear}>
                  {rastreandoBeacon ? 'Rastreando...' : 'Rastrear'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCodigoManual}>
                <Text style={styles.linkCodigo}>Se preferir, informe diretamente o código do Beacon</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 4 && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentCenter}>
          <View style={styles.containerEtapa4}>
            <View style={styles.cardSucesso}>
              <Ionicons name="checkmark-circle" size={48} color="#4ade80" />
              <Text style={styles.tituloSucesso}>Beacon Associado</Text>
              <Text style={styles.textoSucesso}>O beacon foi associado à moto com sucesso!</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.tituloInfo}>Beacon Detectado</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Código:</Text>
                <Text style={styles.infoValue}>{beaconDetectado?.codigo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sinal:</Text>
                <Text style={styles.infoValue}>{beaconDetectado?.sinal}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bateria:</Text>
                <Text style={styles.infoValue}>{beaconDetectado?.bateria}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[styles.infoValue, {color: '#4ade80'}]}>Conectado</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.tituloInfo}>Moto Registrada</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Placa:</Text>
                <Text style={styles.infoValue}>{placa}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo:</Text>
                <Text style={styles.infoValue}>{formData.modelo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{formData.status}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleFinalizarEntrada}>
              <Text style={styles.textoBotao}>Finalizar Entrada</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCodigoVisible}
        onRequestClose={() => setModalCodigoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Procedimento de controle</Text>
            <Text style={styles.modalSubtitulo}>Digite o código UUID do Beacon</Text>
            
            <TextInput
              style={styles.modalInput}
              value={codigoBeacon}
              onChangeText={handleCodigoBeaconChange}
              placeholder="Código do beacon"
              placeholderTextColor="#aaa"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setModalCodigoVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButtonConfirm}
                onPress={confirmarCodigoManual}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  scrollContentCenter: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  goBack: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#000',
    width: '100%',
    maxWidth: 400,
    padding: 25,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  separador: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 15,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  inputReadonly: {
    color: '#aaa',
  },
  pickerContainer: {
    backgroundColor: '#212121',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#555',
    height: 50,
  },
  picker: {
    color: '#fff',
    fontSize: 16,
    height: 50,
  },
  pickerItem: {
    fontSize: 14,
    color: '#000',
  },
  cameraButton: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#555',
    height: 60,
  },
  imagemMotoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagemMoto: {
    width: 300,
    height: 220,
  },
  botao: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardProcedimento: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
  tituloProcedimento: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  textoProcedimento: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  botaoRastrear: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botaoRastreando: {
    backgroundColor: '#555',
  },
  textoBotaoRastrear: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  linkCodigo: {
    color: '#01743A',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  containerEtapa4: {
    width: '100%',
    maxWidth: 400,
  },
  cardSucesso: {
    backgroundColor: '#014d26',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloSucesso: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  textoSucesso: {
    color: '#4ade80',
    fontSize: 14,
    textAlign: 'center',
  },
  cardInfo: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  tituloInfo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 300,
  },
  modalTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitulo: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EntradaMotoPatio;