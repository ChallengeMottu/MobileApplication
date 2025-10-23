import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

const EntradaMotoPatio = ({ navigation }) => {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  
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
      Alert.alert(t('atencao'), t('digite_placa_moto'));
      return;
    }
    setEtapaAtual(2);
  };

  const handleDigitalizarPlaca = () => {
    Alert.alert(t('camera'), t('funcionalidade_digitalizacao'));
  };

  const handleControlarMoto = () => {
    if (!formData.modelo || !formData.numeroChassi || !formData.condicaoMecanica || !formData.status || !formData.anoFabricacao) {
      Alert.alert(t('campos_obrigatorios'), t('preencha_todos_campos_antes_continuar'));
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
      Alert.alert(t('atencao'), t('digite_codigo_beacon'));
      return;
    }
    setBeaconDetectado({
      codigo: codigoBeacon,
      sinal: t('manual'),
      bateria: 'N/A'
    });
    setModalCodigoVisible(false);
    setEtapaAtual(4);
  };

  const handleFinalizarEntrada = () => {
    Alert.alert(
      t('sucesso'),
      t('beacon_associado_sucesso'),
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
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {etapaAtual === 1 && (
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>{t('entrada_moto_alocacao')}</Text>
            <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>{t('processo_entrada_moto_patio')}</Text>

            <View style={[styles.separador, { backgroundColor: colors.border }]} />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('escolha_entre')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={placa}
                onChangeText={handlePlacaChange}
                placeholder={t('digite_placa_moto')}
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('digitalizar_placa')}</Text>
              <TouchableOpacity style={[styles.cameraButton, { 
                backgroundColor: colors.inputBackground, 
                borderColor: colors.border 
              }]} onPress={handleDigitalizarPlaca}>
                <Ionicons name="camera" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.botao, { backgroundColor: colors.primary }]} onPress={handleBuscarMoto}>
              <Text style={[styles.textoBotao, { color: colors.primaryText }]}>{t('buscar')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 2 && (
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(1)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>{t('ficha_moto')}</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t('modelo')}</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.inputBackground, 
                borderColor: colors.border 
              }]}>
                <Picker
                  selectedValue={formData.modelo}
                  onValueChange={(value) => handleInputChange('modelo', value)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item style={styles.pickerItem} label={t('modelo')} value="" />
                  <Picker.Item style={styles.pickerItem} label="Sport 110i" value="Sport 110i" />
                  <Picker.Item style={styles.pickerItem} label="Mottu E" value="Mottu E" />
                  <Picker.Item style={styles.pickerItem} label="Mottu Pop 110i" value="Mottu Pop 110i" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t('ano_fabricacao')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.anoFabricacao}
                onChangeText={(value) => handleInputChange('anoFabricacao', value)}
                placeholder={t('ano_fabricacao')}
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t('numero_chassi')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={formData.numeroChassi}
                onChangeText={(value) => handleInputChange('numeroChassi', value)}
                placeholder={t('numero_chassi')}
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t('status')}</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.inputBackground, 
                borderColor: colors.border 
              }]}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item style={styles.pickerItem} label={t('status')} value="" />
                  <Picker.Item style={styles.pickerItem} label={t('sem_placa')} value="Sem Placa" />
                  <Picker.Item style={styles.pickerItem} label={t('com_placa')} value="Com Placa" />
                  <Picker.Item style={styles.pickerItem} label={t('situacao_furto')} value="Situação de Furto" />
                  <Picker.Item style={styles.pickerItem} label={t('situacao_acidente')} value="Situação de Acidente" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t('condicao_mecanica')}</Text>
              <View style={[styles.pickerContainer, { 
                backgroundColor: colors.inputBackground, 
                borderColor: colors.border 
              }]}>
                <Picker
                  selectedValue={formData.condicaoMecanica}
                  onValueChange={(value) => handleInputChange('condicaoMecanica', value)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item style={styles.pickerItem} label={t('condicao_mecanica')} value="" />
                  <Picker.Item style={styles.pickerItem} label={t('bom_estado_mecanico')} value="Bom Estado Mecânico" />
                  <Picker.Item style={styles.pickerItem} label={t('gravemente_danificada')} value="Gravemente Danificada" />
                  <Picker.Item style={styles.pickerItem} label={t('inoperante')} value="Inoperante" />
                  <Picker.Item style={styles.pickerItem} label={t('necessita_revisao')} value="Necessita de Revisão" />
                  <Picker.Item style={styles.pickerItem} label={t('pequenos_reparos')} value="Pequenos Reparos" />
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

            <TouchableOpacity style={[styles.botao, { backgroundColor: colors.primary }]} onPress={handleControlarMoto}>
              <Text style={[styles.textoBotao, { color: colors.primaryText }]}>{t('controlar_moto')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 3 && (
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(2)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>{t('ficha_moto')}</Text>

            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly, { 
                backgroundColor: colors.inputBackground, 
                color: colors.textSecondary,
                borderColor: colors.border 
              }]} value={formData.modelo} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly, { 
                backgroundColor: colors.inputBackground, 
                color: colors.textSecondary,
                borderColor: colors.border 
              }]} value={formData.anoFabricacao} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly, { 
                backgroundColor: colors.inputBackground, 
                color: colors.textSecondary,
                borderColor: colors.border 
              }]} value={formData.numeroChassi} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly, { 
                backgroundColor: colors.inputBackground, 
                color: colors.textSecondary,
                borderColor: colors.border 
              }]} value={formData.status} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.inputReadonly, { 
                backgroundColor: colors.inputBackground, 
                color: colors.textSecondary,
                borderColor: colors.border 
              }]} value={formData.condicaoMecanica} editable={false} />
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.cardProcedimento, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.tituloProcedimento, { color: colors.text }]}>{t('procedimento_controle')}</Text>
              <Text style={[styles.textoProcedimento, { color: colors.textSecondary }]}>{t('ligue_beacon')}</Text>
              <Text style={[styles.textoProcedimento, { color: colors.textSecondary }]}>{t('clique_rastrear_encontrar')}</Text>

              <TouchableOpacity 
                style={[styles.botaoRastrear, 
                  { backgroundColor: rastreandoBeacon ? colors.inputBackground : colors.primary },
                  rastreandoBeacon && styles.botaoRastreando
                ]} 
                onPress={handleRastrear}
                disabled={rastreandoBeacon}
              >
                {rastreandoBeacon ? (
                  <ActivityIndicator color={colors.primaryText} size="small" />
                ) : (
                  <Ionicons name="bluetooth" size={20} color={colors.primaryText} />
                )}
                <Text style={[styles.textoBotaoRastrear, { color: colors.primaryText }]}>
                  {rastreandoBeacon ? t('rastreando') : t('rastrear')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCodigoManual}>
                <Text style={[styles.linkCodigo, { color: colors.primary }]}>{t('informe_codigo_beacon')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 4 && (
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContentCenter}>
          <View style={styles.containerEtapa4}>
            <View style={[styles.cardSucesso, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primaryText} />
              <Text style={[styles.tituloSucesso, { color: colors.primaryText }]}>{t('beacon_associado')}</Text>
              <Text style={[styles.textoSucesso, { color: colors.primaryText }]}>{t('beacon_associado_sucesso')}</Text>
            </View>

            <View style={[styles.cardInfo, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.tituloInfo, { color: colors.text }]}>{t('beacon_detectado')}</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('codigo')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{beaconDetectado?.codigo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('sinal')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{beaconDetectado?.sinal}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('bateria')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{beaconDetectado?.bateria}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('status')}:</Text>
                <Text style={[styles.infoValue, { color: colors.primary }]}>{t('conectado')}</Text>
              </View>
            </View>

            <View style={[styles.cardInfo, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.tituloInfo, { color: colors.text }]}>{t('moto_registrada')}</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('placa')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{placa}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('modelo')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{formData.modelo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('status')}:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{formData.status}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.botao, { backgroundColor: colors.primary }]} onPress={handleFinalizarEntrada}>
              <Text style={[styles.textoBotao, { color: colors.primaryText }]}>{t('finalizar_entrada')}</Text>
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
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitulo, { color: colors.text }]}>{t('procedimento_controle')}</Text>
            <Text style={[styles.modalSubtitulo, { color: colors.textSecondary }]}>{t('digite_codigo_uuid_beacon')}</Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.inputBackground, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={codigoBeacon}
              onChangeText={handleCodigoBeaconChange}
              placeholder={t('codigo_beacon')}
              placeholderTextColor={colors.placeholderTextColor}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButtonCancel, { backgroundColor: colors.inputBackground }]}
                onPress={() => setModalCodigoVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>{t('cancelar')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButtonConfirm, { backgroundColor: colors.primary }]}
                onPress={confirmarCodigoManual}
              >
                <Text style={[styles.modalButtonText, { color: colors.primaryText }]}>{t('confirmar')}</Text>
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
  },
  scrollView: {
    flex: 1,
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
    width: '100%',
    maxWidth: 400,
    padding: 25,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  separador: {
    height: 1,
    marginVertical: 15,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  inputReadonly: {
    opacity: 0.7,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    height: 50,
  },
  picker: {
    fontSize: 16,
    height: 50,
  },
  pickerItem: {
    fontSize: 14,
    color: '#000',
  },
  cameraButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardProcedimento: {
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
  tituloProcedimento: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  textoProcedimento: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  botaoRastrear: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botaoRastreando: {
    opacity: 0.7,
  },
  textoBotaoRastrear: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  linkCodigo: {
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
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloSucesso: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  textoSucesso: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardInfo: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  tituloInfo: {
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
    fontSize: 14,
  },
  infoValue: {
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
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 300,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EntradaMotoPatio;