import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocalizarMotoPatio = ({ navigation }) => {
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
            <Text style={styles.titulo}>Identificar Localização</Text>
            <Text style={styles.subtitulo}>Busque uma moto específica dentro do pátio</Text>

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
            <Text style={styles.titulo}>Moto procurada</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Placa</Text>
              <View style={styles.inputInfo}>
                <Text style={styles.inputInfoText}>{motoEncontrada?.placa}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Localização da zona</Text>
              <View style={styles.inputInfo}>
                <Text style={styles.inputInfoText}>{motoEncontrada?.localizacao}</Text>
              </View>
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.textoInstrucao}>
              Dirija-se a zona de localização antes de acionar alarme
            </Text>

            <TouchableOpacity style={styles.botao} onPress={handleAcionarAlarme}>
              <Text style={styles.textoBotao}>Acionar alarme</Text>
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
            <Text style={styles.titulo}>Moto procurada</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Placa</Text>
              <View style={styles.inputInfo}>
                <Text style={styles.inputInfoText}>{motoEncontrada?.placa}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Localização da zona</Text>
              <View style={styles.inputInfo}>
                <Text style={styles.inputInfoText}>{motoEncontrada?.localizacao}</Text>
              </View>
            </View>

            <View style={styles.imagemMotoContainer}>
              <Image 
                source={require('../../assets/moto.png')} 
                style={styles.imagemMoto}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.textoInstrucao}>
              Dirija-se a zona de localização antes de acionar alarme
            </Text>

            {/* Card de controle do alarme */}
            <View style={styles.cardAlarme}>
              <Text style={styles.tituloAlarme}>QUANDO ALARME ESTIVER ACIONADO</Text>
              
              <TouchableOpacity style={styles.botaoPararAlarme} onPress={handlePararAlarme}>
                <Text style={styles.textoBotaoPararAlarme}>Parar alarme</Text>
              </TouchableOpacity>
              
              <Text style={styles.textoAlarmeAtivo}>Alarme em funcionamento...</Text>
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
  inputInfo: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#555',
  },
  inputInfoText: {
    color: '#fff',
    fontSize: 16,
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
  textoInstrucao: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
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
  cardAlarme: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  tituloAlarme: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoPararAlarme: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: '#fff',
  },
  textoBotaoPararAlarme: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoAlarmeAtivo: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default LocalizarMotoPatio;