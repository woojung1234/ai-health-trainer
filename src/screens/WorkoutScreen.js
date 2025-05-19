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
import {getOpenAIWorkoutRecommendation} from '../services/openaiService';

const WorkoutScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  useEffect(() => {
    loadUserProfile();
    loadSavedWorkouts();
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

  const loadSavedWorkouts = async () => {
    try {
      const workoutsData = await AsyncStorage.getItem('savedWorkouts');
      if (workoutsData) {
        setSavedWorkouts(JSON.parse(workoutsData));
      }
    } catch (error) {
      console.error('Error loading saved workouts:', error);
    }
  };

  const generateWorkoutPlan = async () => {
    if (!userProfile) {
      alert('프로필을 먼저 설정해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await getOpenAIWorkoutRecommendation(
        userProfile,
        additionalInfo,
      );
      setWorkoutPlan(response);
    } catch (error) {
      console.error('Workout plan generation error:', error);
      alert('운동 계획 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkoutPlan = async () => {
    if (!workoutPlan) return;

    try {
      const newWorkout = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        plan: workoutPlan,
      };

      const updatedWorkouts = [...savedWorkouts, newWorkout];
      await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkouts));
      setSavedWorkouts(updatedWorkouts);
      alert('운동 계획이 저장되었습니다.');
    } catch (error) {
      console.error('Error saving workout plan:', error);
      alert('운동 계획 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteSavedWorkout = async workoutId => {
    try {
      const updatedWorkouts = savedWorkouts.filter(workout => workout.id !== workoutId);
      await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkouts));
      setSavedWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
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
        <Card.Title title="맞춤형 운동 루틴 생성" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="추가 정보 (부상, 선호 운동 등)"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={generateWorkoutPlan}
            disabled={loading}
            style={styles.button}>
            운동 루틴 생성하기
          </Button>
        </Card.Content>
      </Card>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>운동 계획 생성 중...</Text>
        </View>
      )}

      {workoutPlan && !loading && (
        <Card style={styles.card}>
          <Card.Title title="맞춤형 운동 계획" />
          <Card.Content>
            <Text style={styles.workoutPlan}>{workoutPlan}</Text>
            <Button
              mode="contained"
              onPress={saveWorkoutPlan}
              style={styles.button}>
              이 운동 계획 저장하기
            </Button>
          </Card.Content>
        </Card>
      )}

      {savedWorkouts.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="저장된 운동 계획" />
          <Card.Content>
            {savedWorkouts.map((workout, index) => (
              <View key={workout.id} style={styles.savedWorkoutItem}>
                <Text style={styles.savedWorkoutDate}>
                  {formatDate(workout.date)}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteSavedWorkout(workout.id)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
                <Text numberOfLines={3} style={styles.savedWorkoutPreview}>
                  {workout.plan.substring(0, 100)}...
                </Text>
                {index < savedWorkouts.length - 1 && <Divider style={styles.divider} />}
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
  workoutPlan: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  savedWorkoutItem: {
    marginBottom: 8,
    position: 'relative',
  },
  savedWorkoutDate: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedWorkoutPreview: {
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

export default WorkoutScreen;