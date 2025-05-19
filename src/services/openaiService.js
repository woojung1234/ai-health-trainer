import axios from 'axios';
import Config from 'react-native-config';

// 식단 추천 API 호출
export const getOpenAIDietRecommendation = async (userProfile, additionalInfo = '') => {
  try {
    const OPENAI_API_KEY = Config.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const prompt = `
다음 정보를 바탕으로 건강한 맞춤형 식단 계획을 일주일 분량으로 작성해주세요:

이름: ${userProfile.name}
나이: ${userProfile.age}
성별: ${userProfile.gender === 'male' ? '남성' : '여성'}
키: ${userProfile.height} cm
체중: ${userProfile.weight} kg
활동 수준: ${getActivityLevelText(userProfile.activityLevel)}
목표: ${getGoalText(userProfile.goal)}
건강 상태: ${userProfile.healthConditions || '특이사항 없음'}
추가 정보: ${additionalInfo || '없음'}

식단에는 아침, 점심, 저녁 식사와 간식을 포함해 주세요.
각 식단에 대한 칼로리와 대략적인 영양소 분포(탄수화물, 단백질, 지방)도 포함해 주세요.
한국어로 응답해 주세요.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw error;
  }
};

// 운동 루틴 추천 API 호출
export const getOpenAIWorkoutRecommendation = async (userProfile, additionalInfo = '') => {
  try {
    const OPENAI_API_KEY = Config.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const prompt = `
다음 정보를 바탕으로 개인화된 주간 운동 루틴을 작성해주세요:

이름: ${userProfile.name}
나이: ${userProfile.age}
성별: ${userProfile.gender === 'male' ? '남성' : '여성'}
키: ${userProfile.height} cm
체중: ${userProfile.weight} kg
활동 수준: ${getActivityLevelText(userProfile.activityLevel)}
목표: ${getGoalText(userProfile.goal)}
건강 상태: ${userProfile.healthConditions || '특이사항 없음'}
추가 정보: ${additionalInfo || '없음'}

일주일 동안의 운동 계획을 요일별로 작성해 주세요.
각 운동에 대한 세트, 반복 횟수, 휴식 시간을 포함해 주세요.
적절한 워밍업과 마무리 스트레칭도 포함해 주세요.
한국어로 응답해 주세요.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw error;
  }
};

// 활동 수준 텍스트 변환 함수
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

// 목표 텍스트 변환 함수
const getGoalText = goalType => {
  const goalTexts = {
    weightLoss: '체중 감량',
    maintenance: '체중 유지',
    muscleGain: '근육 증가',
  };
  return goalTexts[goalType];
};