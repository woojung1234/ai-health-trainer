import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button, Card, TextInput, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getOpenAIDietRecommendation} from '../services/openaiService';

const DietScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [savedDiets, setSavedDiets] = useState([]);

  useEffect(() => {
    loadUserProfile();
    loadSavedDiets();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSavedDiets = async () => {
    try {
      const dietsData = await AsyncStorage.getItem('savedDiets');
      if (dietsData) {
        setSavedDiets(JSON.parse(dietsData));
      }
    } catch (error) {
      console.error('Error loading saved diets:', error);
    }
  };

  const generateDietPlan = async () => {
    if (!userProfile) {
      alert('프로필을 먼저 설정해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await getOpenAIDietRecommendation(
        userProfile,
        additionalInfo,
      );
      setDietPlan(response);
    } catch (error) {
      console.error('Diet plan generation error:', error);
      alert('식단 계획 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveDietPlan = async () => {
    if (!dietPlan) return;

    try {
      const newDiet = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        plan: dietPlan,
      };

      const updatedDiets = [...savedDiets, newDiet];
      await AsyncStorage.setItem('savedDiets', JSON.stringify(updatedDiets));
      setSavedDiets(updatedDiets);
      alert('식단 계획이 저장되었습니다.');
    } catch (error) {
      console.error('Error saving diet plan:', error);
      alert('식단 계획 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteSavedDiet = async dietId => {
    try {
      const updatedDiets = savedDiets.filter(diet => diet.id !== dietId);
      await AsyncStorage.setItem('savedDiets', JSON.stringify(updatedDiets));
      setSavedDiets(updatedDiets);
    } catch (error) {
      console.error('Error deleting diet plan:', error);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>프로필을 설정해주세요.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="맞춤형 식단 생성" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="추가 정보 (알레르기, 선호 음식 등)"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={generateDietPlan}
            disabled={loading}
            style={styles.button}>
            식단 생성하기
          </Button>
        </Card.Content>
      </Card>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>식단 계획 생성 중...</Text>
        </View>
      )}

      {dietPlan && !loading && (
        <Card style={styles.card}>
          <Card.Title title="맞춤형 식단 계획" />
          <Card.Content>
            <Text style={styles.dietPlan}>{dietPlan}</Text>
            <Button
              mode="contained"
              onPress={saveDietPlan}
              style={styles.button}>
              이 식단 저장하기
            </Button>
          </Card.Content>
        </Card>
      )}

      {savedDiets.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="저장된 식단 계획" />
          <Card.Content>
            {savedDiets.map((diet, index) => (
              <View key={diet.id} style={styles.savedDietItem}>
                <Text style={styles.savedDietDate}>
                  {formatDate(diet.date)}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteSavedDiet(diet.id)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
                <Text numberOfLines={3} style={styles.savedDietPreview}>
                  {diet.plan.substring(0, 100)}...
                </Text>
                {index < savedDiets.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  dietPlan: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  savedDietItem: {
    marginBottom: 8,
    position: 'relative',
  },
  savedDietDate: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedDietPreview: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff5252',
    borderRadius: 4,
    padding: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  divider: {
    marginVertical: 8,
  },
});

export default DietScreen;