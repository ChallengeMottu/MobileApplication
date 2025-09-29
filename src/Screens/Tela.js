import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ContextTheme';

const LocalizarMotoPatio = ({ navigation }) => {
  const { colors, theme } = useTheme();
  
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [placa, setPlaca] = useState('');
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [alarmeAtivo, setAlarmeAtivo] = useState(false);

  const handlePlacaChange = useCallback((value) => {
    setPlaca(value);
  }, []);

  const handleBuscarMoto = () => {
    if (!placa.trim()) {
      Alert.alert('Atenção', 'Por favor, digite a placa da moto.');
      return;
    }

    // Simular busca da moto
    setMotoEncontrada({
      placa: placa.toUpperCase(),
      localizacao: 'Zona A - Setor 3',
      modelo: 'Sport 110i',
      status: 'Estacionada'
    });
    setEtapaAtual(2);
  };

  const handleDigitalizarPlaca = () => {
    Alert.alert('Câmera', 'Funcionalidade de digitalização será implementada');
  };

  const handleAcionarAlarme = () => {
    setAlarmeAtivo(true);
    setEtapaAtual(3);
    Alert.alert('Alarme Acionado', 'O alarme da moto foi ativado com sucesso!');
  };

  const handlePararAlarme = () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente parar o alarme?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Parar Alarme',
          onPress: () => {
            setAlarmeAtivo(false);
            Alert.alert(
              'Alarme Parado',
              'O alarme foi desativado com sucesso!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Resetar para nova busca
                    setEtapaAtual(1);
                    setPlaca('');
                    setMotoEncontrada(null);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {etapaAtual === 1 && (
        <ScrollView 
          style={[styles.scrollView, { backgroundColor: colors.background }]} 
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>Identificar Localização</Text>
            <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
              Busque uma moto específica dentro do pátio
            </Text>

            <View style={[styles.separador, { backgroundColor: colors.textSecondary }]} />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Escolha entre</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.textSecondary
                }]}
                value={placa}
                onChangeText={handlePlacaChange}
                placeholder="Digite a placa da moto"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Digitalizar a placa</Text>
              <TouchableOpacity 
                style={[styles.cameraButton, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.textSecondary
                }]} 
                onPress={handleDigitalizarPlaca}
              >
                <Ionicons name="camera" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.botao, { backgroundColor: colors.primary }]} 
              onPress={handleBuscarMoto}
            >
              <Text style={[styles.textoBotao, { color: colors.primaryText }]}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 2 && (
        <ScrollView 
          style={[styles.scrollView, { backgroundColor: colors.background }]} 
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(1)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>Moto procurada</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Placa</Text>
              <View style={[styles.inputInfo, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.textSecondary
              }]}>
                <Text style={[styles.inputInfoText, { color: colors.text }]}>
                  {motoEncontrada?.placa}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Localização da zona</Text>
              <View style={[styles.inputInfo, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.textSecondary
              }]}>
                <Text style={[styles.inputInfoText, { color: colors.text }]}>
                  {motoEncontrada?.localizacao}
                </Text>
              </View>
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.textoInstrucao, { color: colors.text }]}>
              Dirija-se a zona de localização antes de acionar alarme
            </Text>

            <TouchableOpacity 
              style={[styles.botao, { backgroundColor: colors.primary }]} 
              onPress={handleAcionarAlarme}
            >
              <Text style={[styles.textoBotao, { color: colors.primaryText }]}>Acionar alarme</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {etapaAtual === 3 && (
        <ScrollView 
          style={[styles.scrollView, { backgroundColor: colors.background }]} 
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.goBack} 
            onPress={() => setEtapaAtual(2)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.titulo, { color: colors.text }]}>Moto procurada</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Placa</Text>
              <View style={[styles.inputInfo, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.textSecondary
              }]}>
                <Text style={[styles.inputInfoText, { color: colors.text }]}>
                  {motoEncontrada?.placa}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Localização da zona</Text>
              <View style={[styles.inputInfo, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.textSecondary
              }]}>
                <Text style={[styles.inputInfoText, { color: colors.text }]}>
                  {motoEncontrada?.localizacao}
                </Text>
              </View>
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.textoInstrucao, { color: colors.text }]}>
              Dirija-se a zona de localização antes de acionar alarme
            </Text>

            {/* Card de controle do alarme */}
            <View style={[styles.cardAlarme, { backgroundColor: colors.primary }]}>
              <Text style={[styles.tituloAlarme, { color: colors.primaryText }]}>
                QUANDO ALARME ESTIVER ACIONADO
              </Text>
              
              <TouchableOpacity 
                style={[styles.botaoPararAlarme, { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primaryText
                }]} 
                onPress={handlePararAlarme}
              >
                <Text style={[styles.textoBotaoPararAlarme, { color: colors.primaryText }]}>
                  Parar alarme
                </Text>
              </TouchableOpacity>
              
              <Text style={[styles.textoAlarmeAtivo, { color: colors.primaryText }]}>
                Alarme em funcionamento...
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
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
  inputInfo: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
  },
  inputInfoText: {
    fontSize: 16,
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
  textoInstrucao: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
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
  cardAlarme: {
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  tituloAlarme: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoPararAlarme: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
  },
  textoBotaoPararAlarme: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoAlarmeAtivo: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default LocalizarMotoPatio;