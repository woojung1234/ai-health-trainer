import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Button,
  Card,
  TextInput,
  RadioButton,
  Text,
  Divider,
  Title,
  HelperText,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('weightLoss');
  const [healthConditions, setHealthConditions] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setName(profile.name || '');
        setAge(profile.age ? profile.age.toString() : '');
        setGender(profile.gender || 'male');
        setHeight(profile.height ? profile.height.toString() : '');
        setWeight(profile.weight ? profile.weight.toString() : '');
        setActivityLevel(profile.activityLevel || 'moderate');
        setGoal(profile.goal || 'weightLoss');
        setHealthConditions(profile.healthConditions || '');
        setProfileSaved(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return false;
    }

    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      Alert.alert('알림', '유효한 나이를 입력해주세요.');
      return false;
    }

    if (!height.trim() || isNaN(Number(height)) || Number(height) <= 0) {
      Alert.alert('알림', '유효한 키를 입력해주세요.');
      return false;
    }

    if (!weight.trim() || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('알림', '유효한 체중을 입력해주세요.');
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateForm()) return;

    const profile = {
      name,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      activityLevel,
      goal,
      healthConditions,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setProfileSaved(true);
      Alert.alert('성공', '프로필이 저장되었습니다.');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('오류', '프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) return null;

    const heightInMeters = Number(height) / 100;
    const weightInKg = Number(weight);
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const interpretBMI = bmi => {
    if (bmi < 18.5) return '저체중';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중';
    if (bmi < 30) return '비만 1단계';
    if (bmi < 35) return '비만 2단계';
    return '고도비만';
  };

  const calculateBMR = () => {
    if (!height || !weight || !age || !gender) return null;

    // 해리스-베네딕트 방정식 사용
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * Number(weight) + 4.799 * Number(height) - 5.677 * Number(age);
    } else {
      bmr = 447.593 + 9.247 * Number(weight) + 3.098 * Number(height) - 4.33 * Number(age);
    }

    return Math.round(bmr);
  };

  const calculateTDEE = bmr => {
    if (!bmr) return null;

    const activityMultipliers = {
      sedentary: 1.2, // 거의 운동 안함
      light: 1.375, // 가벼운 운동(주 1-3일)
      moderate: 1.55, // 보통 수준 운동(주 3-5일)
      active: 1.725, // 활발한 운동(주 6-7일)
      veryActive: 1.9, // 매우 활발한 운동(하루 2회 이상)
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  };

  const getActivityLevelText = level => {
    const activityTexts = {
      sedentary: '거의 운동 안함',
      light: '가벼운 운동(주 1-3일)',
      moderate: '보통 수준 운동(주 3-5일)',
      active: '활발한 운동(주 6-7일)',
      veryActive: '매우 활발한 운동(하루 2회 이상)',
    };
    return activityTexts[level];
  };

  const getGoalText = goalType => {
    const goalTexts = {
      weightLoss: '체중 감량',
      maintenance: '체중 유지',
      muscleGain: '근육 증가',
    };
    return goalTexts[goalType];
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const tdee = calculateTDEE(bmr);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="기본 정보" />
        <Card.Content>
          <TextInput
            label="이름"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="나이"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <Text style={styles.label}>성별</Text>
          <RadioButton.Group
            onValueChange={value => setGender(value)}
            value={gender}>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setGender('male')}>
                <RadioButton value="male" />
                <Text>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setGender('female')}>
                <RadioButton value="female" />
                <Text>여성</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>

          <TextInput
            label="키 (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="체중 (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <Text style={styles.label}>활동 수준</Text>
          <RadioButton.Group
            onValueChange={value => setActivityLevel(value)}
            value={activityLevel}>
            <View style={styles.radioOptionColumn}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setActivityLevel('sedentary')}>
                <RadioButton value="sedentary" />
                <Text>거의 운동 안함</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setActivityLevel('light')}>
                <RadioButton value="light" />
                <Text>가벼운 운동(주 1-3일)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setActivityLevel('moderate')}>
                <RadioButton value="moderate" />
                <Text>보통 수준 운동(주 3-5일)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setActivityLevel('active')}>
                <RadioButton value="active" />
                <Text>활발한 운동(주 6-7일)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setActivityLevel('veryActive')}>
                <RadioButton value="veryActive" />
                <Text>매우 활발한 운동(하루 2회 이상)</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>목표</Text>
          <RadioButton.Group
            onValueChange={value => setGoal(value)}
            value={goal}>
            <View style={styles.radioOptionColumn}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setGoal('weightLoss')}>
                <RadioButton value="weightLoss" />
                <Text>체중 감량</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setGoal('maintenance')}>
                <RadioButton value="maintenance" />
                <Text>체중 유지</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setGoal('muscleGain')}>
                <RadioButton value="muscleGain" />
                <Text>근육 증가</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>

          <TextInput
            label="건강 상태 (알레르기, 질병 등)"
            value={healthConditions}
            onChangeText={setHealthConditions}
            multiline
            numberOfLines={3}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={saveProfile}
            style={styles.button}>
            프로필 저장
          </Button>
        </Card.Content>
      </Card>

      {profileSaved && bmi && bmr && tdee && (
        <Card style={styles.card}>
          <Card.Title title="건강 지표" />
          <Card.Content>
            <View style={styles.healthIndicator}>
              <Text style={styles.indicatorLabel}>BMI (체질량지수):</Text>
              <Text style={styles.indicatorValue}>
                {bmi} ({interpretBMI(bmi)})
              </Text>
            </View>

            <View style={styles.healthIndicator}>
              <Text style={styles.indicatorLabel}>BMR (기초대사량):</Text>
              <Text style={styles.indicatorValue}>{bmr} kcal/일</Text>
            </View>

            <View style={styles.healthIndicator}>
              <Text style={styles.indicatorLabel}>
                TDEE (일일 총 에너지 소모량):
              </Text>
              <Text style={styles.indicatorValue}>{tdee} kcal/일</Text>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.summaryTitle}>요약</Text>
            <Text style={styles.summary}>
              {`${name}님은 ${age}세 ${gender === 'male' ? '남성' : '여성'}으로, 현재 활동량은 "${getActivityLevelText(activityLevel)}"이며, "${getGoalText(goal)}"을 목표로 하고 있습니다.`}
            </Text>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOptionColumn: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  healthIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  indicatorLabel: {
    fontSize: 16,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ProfileScreen;