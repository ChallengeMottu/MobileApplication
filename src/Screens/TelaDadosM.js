import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaDadosM({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [placa, setPlaca] = useState('');
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');
  const [animacaoValor] = useState(new Animated.Value(0));
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    iniciarAnimacao();
  }, []);

  const iniciarAnimacao = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animacaoValor, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animacaoValor, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const buscarMoto = async () => {
    if (!placa.trim()) {
      setErro('Por favor, digite uma placa');
      return;
    }

    setBuscando(true);
    setErro('');
    setMotoEncontrada(null);

    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      
      if (motosSalvas) {
        const listaMotos = JSON.parse(motosSalvas);
        const moto = listaMotos.find(m => m.placa.toUpperCase() === placa.toUpperCase());
        
        if (moto) {
          setMotoEncontrada(moto);
          setErro('');
        } else {
          setErro('Moto não encontrada no sistema');
          setMotoEncontrada(null);
        }
      } else {
        setErro('Nenhuma moto cadastrada no sistema');
      }
    } catch (error) {
      console.error('Erro ao buscar moto:', error);
      setErro('Erro ao buscar dados da moto');
    } finally {
      setBuscando(false);
    }
  };

  const limparBusca = () => {
    setPlaca('');
    setMotoEncontrada(null);
    setErro('');
    setCapturedImage(null);
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Habilite o acesso à câmera para continuar.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri && asset.base64) {
        setCapturedImage(asset.uri);
        setShowCamera(true);
        sendToOCR(asset.base64);
      }
    }
  };

  const sendToOCR = async (base64Image, type = 'jpeg') => {
    setProcessando(true);
    try {
      const base64WithPrefix = `data:image/${type};base64,${base64Image}`;
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: 'K87694494388957',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `base64Image=${encodeURIComponent(base64WithPrefix)}&language=por`,
      });

      const data = await response.json();
      
      if (data.IsErroredOnProcessing) {
        Alert.alert('Erro', 'Não foi possível processar a imagem');
        setProcessando(false);
        return;
      }

      const parsedText = data?.ParsedResults?.[0]?.ParsedText || '';
      
      // Extrair placa do texto (formato brasileiro: ABC1234 ou ABC-1234)
      const placaMatch = parsedText.match(/[A-Z]{3}[-]?[0-9]{4}/i);
      
      if (placaMatch) {
        const placaDetectada = placaMatch[0].replace('-', '').toUpperCase();
        setPlaca(placaDetectada);
        setShowCamera(false);
        Alert.alert(
          'Placa Detectada',
          `Placa encontrada: ${placaDetectada}\n\nDeseja buscar os dados dessa moto?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Buscar', 
              onPress: () => {
                setPlaca(placaDetectada);
                setTimeout(() => buscarMoto(), 100);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Placa não detectada',
          'Não foi possível identificar a placa na imagem. Tente novamente com melhor iluminação.',
          [{ text: 'OK', onPress: () => setShowCamera(false) }]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao processar imagem');
    } finally {
      setProcessando(false);
    }
  };

  const closeCameraModal = () => {
    setShowCamera(false);
    setProcessando(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Moto normal com placa') return '#00FF94';
    if (status === 'Moto sem placa') return '#FFD600';
    if (status?.toLowerCase().includes('manutenção') || 
        status?.toLowerCase().includes('manutencao') ||
        status?.toLowerCase().includes('acidente') ||
        status?.toLowerCase().includes('furto')) return '#FF3D71';
    return colors.text;
  };

  const getStatusIcon = (status) => {
    if (status === 'Moto normal com placa') return 'checkmark-circle';
    if (status === 'Moto sem placa') return 'time';
    if (status?.toLowerCase().includes('manutenção') || 
        status?.toLowerCase().includes('manutencao') ||
        status?.toLowerCase().includes('acidente') ||
        status?.toLowerCase().includes('furto')) return 'construct';
    return 'alert-circle';
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR');
  };

  const calcularTempoDesde = (dataISO) => {
    const agora = new Date();
    const dataCadastro = new Date(dataISO);
    const diffMs = agora - dataCadastro;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDias > 0) {
      return `${diffDias} ${diffDias === 1 ? 'dia' : 'dias'}`;
    }
    return `${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
  };

  const pulseOpacity = animacaoValor.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const DataField = ({ icon, label, value, color }) => (
    <View style={[styles.dataField, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.dataIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.dataContent}>
        <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.dataValue, { color: colors.text }]}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Ionicons name="search" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Consultar Moto</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('TelaFuncionario')} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.searchTitle, { color: colors.text }]}>
          <Ionicons name="barcode" size={20} color={colors.primary} /> Digite a Placa
        </Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.buttonRow}>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.inputBackground, 
              borderColor: colors.border,
              flex: 1 
            }]}>
              <Ionicons name="car" size={24} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={placa}
                onChangeText={setPlaca}
                placeholder="Ex: ABC1234"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
                maxLength={7}
              />
              {placa.length > 0 && (
                <TouchableOpacity onPress={limparBusca}>
                  <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Botão da Câmera */}
            <TouchableOpacity
              style={[styles.cameraButton, { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              }]}
              onPress={openCamera}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: buscando ? colors.inputBackground : colors.primary }]}
            onPress={buscarMoto}
            disabled={buscando}
            activeOpacity={0.8}
          >
            <Ionicons name={buscando ? "hourglass" : "search"} size={24} color="#fff" />
            <Text style={styles.searchButtonText}>
              {buscando ? 'BUSCANDO...' : 'BUSCAR'}
            </Text>
          </TouchableOpacity>
        </View>

        {erro && (
          <View style={[styles.errorContainer, { backgroundColor: '#FF3D71' + '20', borderColor: '#FF3D71' }]}>
            <Ionicons name="alert-circle" size={24} color="#FF3D71" />
            <Text style={[styles.errorText, { color: '#FF3D71' }]}>{erro}</Text>
          </View>
        )}
      </View>

      {/* Modal da Câmera */}
      <Modal
        visible={showCamera}
        animationType="fade"
        transparent={true}
        onRequestClose={closeCameraModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Processando Imagem
              </Text>
              <TouchableOpacity onPress={closeCameraModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {capturedImage && (
              <Image 
                source={{ uri: capturedImage }} 
                style={styles.capturedImage}
                resizeMode="contain"
              />
            )}

            {processando ? (
              <View style={styles.processingContainer}>
                <Ionicons name="sync" size={40} color={colors.primary} />
                <Text style={[styles.processingText, { color: colors.text }]}>
                  Processando imagem...
                </Text>
              </View>
            ) : (
              <View style={styles.processingContainer}>
                <Ionicons name="checkmark-circle" size={40} color="#00FF94" />
                <Text style={[styles.processingText, { color: colors.text }]}>
                  Imagem processada com sucesso!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Results Section */}
      {motoEncontrada && (
        <View style={styles.resultsSection}>
          {/* Status Card */}
          <View style={[styles.statusCard, { 
            backgroundColor: colors.cardBackground,
            borderTopColor: getStatusColor(motoEncontrada.status)
          }]}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIconBg, { backgroundColor: getStatusColor(motoEncontrada.status) + '20' }]}>
                <Ionicons 
                  name={getStatusIcon(motoEncontrada.status)} 
                  size={40} 
                  color={getStatusColor(motoEncontrada.status)} 
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusPlaca, { color: colors.text }]}>{motoEncontrada.placa}</Text>
                <Text style={[styles.statusModelo, { color: colors.textSecondary }]}>
                  {motoEncontrada.modelo}
                </Text>
              </View>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(motoEncontrada.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(motoEncontrada.status) }]}>
                {motoEncontrada.status}
              </Text>
            </View>
          </View>

          {/* Information Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="information-circle" size={20} color={colors.primary} /> Informações Básicas
            </Text>

            <DataField
              icon="key"
              label="Número do Chassi"
              value={motoEncontrada.numeroChassi}
              color="#00D9FF"
            />

            <DataField
              icon="calendar"
              label="Ano de Fabricação"
              value={motoEncontrada.anoFabricacao?.toString()}
              color="#9D4EDD"
            />

            <DataField
              icon="bluetooth"
              label="Código Beacon"
              value={motoEncontrada.codigoBeacon === 'N/A' ? 'Não associado' : motoEncontrada.codigoBeacon}
              color={motoEncontrada.codigoBeacon === 'N/A' ? '#FF6B00' : '#00FF94'}
            />
          </View>

          {/* Technical Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="build" size={20} color={colors.primary} /> Condições Físicas
            </Text>

            <DataField
              icon="settings"
              label="Condição Mecânica"
              value={motoEncontrada.condicaoMecanica}
              color="#FFD600"
            />

            <DataField
              icon="checkmark-done"
              label="Aparato Físico"
              value={motoEncontrada.aparatoFisico}
              color="#00FF94"
            />
          </View>

          {/* Registry Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="time" size={20} color={colors.primary} /> Informações de Registro
            </Text>

            <View style={[styles.registryCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.registryItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    Data de Cadastro
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    {formatarData(motoEncontrada.dataCadastro)}
                  </Text>
                </View>
              </View>

              <View style={[styles.registryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.registryItem}>
                <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    Tempo no Sistema
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    {calcularTempoDesde(motoEncontrada.dataCadastro)}
                  </Text>
                </View>
              </View>

              <View style={[styles.registryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.registryItem}>
                <Ionicons name="finger-print" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    ID do Sistema
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    #{motoEncontrada.id}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={limparBusca}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>NOVA CONSULTA</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!motoEncontrada && !erro && placa.length === 0 && (
        <View style={styles.emptyState}>
          <Animated.View style={{ opacity: pulseOpacity }}>
            <Ionicons name="search-outline" size={80} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Consulte uma moto
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Digite a placa da moto ou use a câmera para escanear a placa
          </Text>
          
          {/* Botão da Câmera no Empty State */}
          <TouchableOpacity
            style={[styles.cameraButtonEmpty, { backgroundColor: colors.primary }]}
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={28} color="#fff" />
            <Text style={styles.cameraButtonText}>ESCANEAR PLACA</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraButton: {
    width: 60,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cameraButtonEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  errorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statusIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusPlaca: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusModelo: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dataField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dataIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registryCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  registryContent: {
    flex: 1,
  },
  registryLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  registryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  registryDivider: {
    height: 1,
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  capturedImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
});