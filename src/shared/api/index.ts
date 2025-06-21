// src/shared/api/index.ts

const mockApi = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

// 1. Воронка звонков и конверсии
export const getFunnelData = () =>
  mockApi({
    totalCalls: 120,
    bookings: 35,
    preorders: 18,
    conversionToBookingPercent: 29.2,
    conversionToPreorderPercent: 15.0,
    missedCalls: 12,
    trend: [
      { date: '2024-05-01', calls: 20, bookings: 6, preorders: 2 },
      { date: '2024-05-02', calls: 22, bookings: 7, preorders: 3 },
      { date: '2024-05-03', calls: 18, bookings: 5, preorders: 1 },
      { date: '2024-05-04', calls: 25, bookings: 8, preorders: 4 },
      { date: '2024-05-05', calls: 30, bookings: 9, preorders: 5 },
      { date: '2024-05-06', calls: 28, bookings: 7, preorders: 2 },
      { date: '2024-05-07', calls: 27, bookings: 8, preorders: 3 },
    ],
  });

// 2. Качество обработки звонков
export const getQualityData = () =>
  mockApi({
    averageScriptCompliance: 8.2,
    fullCompliancePercent: 45.0,
    partialCompliancePercent: 40.0,
    noCompliancePercent: 15.0,
    mostFrequentErrors: [
      { scriptPoint: 'Приветствие', count: 15 },
      { scriptPoint: 'Выявление потребностей', count: 10 },
      { scriptPoint: 'Презентация', count: 8 },
      { scriptPoint: 'Работа с возражениями', count: 5 },
      { scriptPoint: 'Завершение разговора', count: 3 },
    ],
    bestStaffers: [
      { id: 1, name: 'Иванов И.И.', averageCompliance: 10.5 },
      { id: 3, name: 'Сидоров А.А.', averageCompliance: 9.8 },
      { id: 5, name: 'Кузнецов В.В.', averageCompliance: 9.5 },
    ],
    worstStaffers: [
      { id: 2, name: 'Петров П.П.', averageCompliance: 5.2 },
      { id: 4, name: 'Смирнов К.К.', averageCompliance: 6.1 },
      { id: 6, name: 'Попов Д.Д.', averageCompliance: 6.5 },
    ],
  });

// 3. Причины отказов и отрицаний
export const getNegationsData = () =>
  mockApi({
    totalNegations: 23,
    negationsPercent: 18.4,
    mostFrequentNegations: [
      { phrase: 'Нет свободных слотов', count: 7 },
      { phrase: 'Слишком дорого', count: 5 },
      { phrase: 'Неудобное время', count: 4 },
      { phrase: 'Передумал', count: 4 },
      { phrase: 'Нашел другое место', count: 3 },
    ],
    negationsTrend: [
      { date: '2024-05-01', count: 2 },
      { date: '2024-05-02', count: 3 },
      { date: '2024-05-03', count: 1 },
      { date: '2024-05-04', count: 4 },
      { date: '2024-05-05', count: 5 },
      { date: '2024-05-06', count: 4 },
      { date: '2024-05-07', count: 4 },
    ],
  });

// 4. Аналитика по ресторанам и сотрудникам
export const getRestaurantStafferAnalyticsData = () =>
  mockApi({
    restaurants: [
      {
        id: 1,
        name: 'СХ Гончарная',
        averageCompliance: 9.1,
        callsCount: 25,
        bookings: 10,
        negations: 3,
        conversionPercent: 40.0,
      },
      {
        id: 2,
        name: 'СХ Спортивная',
        averageCompliance: 7.5,
        callsCount: 30,
        bookings: 8,
        negations: 8,
        conversionPercent: 26.7,
      },
      {
        id: 3,
        name: 'СХ Загородный',
        averageCompliance: 8.2,
        callsCount: 22,
        bookings: 9,
        negations: 4,
        conversionPercent: 40.9,
      },
      {
        id: 4,
        name: 'СХ Науки',
        averageCompliance: 6.8,
        callsCount: 40,
        bookings: 12,
        negations: 15,
        conversionPercent: 30.0,
      },
    ],
    topRestaurants: [
      { id: 3, name: 'СХ Гончарная', conversionPercent: 40.9 },
      { id: 1, name: 'СХ Загородный', conversionPercent: 40.0 },
      { id: 4, name: 'СХ Науки', conversionPercent: 30.0 },
    ],
    bottomRestaurants: [
      { id: 2, name: 'СХ Спортивная', conversionPercent: 26.7 },
    ],
    topStaffers: [
      { id: 1, name: 'Иванов И.И.', conversionPercent: 50.0 },
      { id: 3, name: 'Сидоров А.А.', conversionPercent: 45.0 },
      { id: 5, name: 'Кузнецов В.В.', conversionPercent: 42.0 },
    ],
    bottomStaffers: [
      { id: 2, name: 'Петров П.П.', conversionPercent: 10.0 },
      { id: 4, name: 'Смирнов К.К.', conversionPercent: 15.0 },
      { id: 6, name: 'Попов Д.Д.', conversionPercent: 20.0 },
    ],
  });

// 5. Звонки
const allCalls = Array.from({ length: 125 }, (_, i) => {
  const staff = [
    { id: 1, role: 'Администратор', name: 'Иванов И.И.' },
    { id: 2, role: 'Хостес', name: 'Петрова А.С.' },
    { id: 3, role: 'Администратор', name: 'Сидоров А.А.' },
  ];
  const topics = ['Бронирование', 'Доставка', 'Вопрос по меню', 'Отмена брони'];
  const units = [
    { name: 'Старик хинкалыч', address: 'ул. Гончарная, 1' },
    { name: 'Пицца Хаус', address: 'пр. Науки, 25' },
    { name: 'Суши WOK', address: 'Невский пр., 100' },
  ];
  const errors = [
    'Не уточнил адрес',
    'Не попрощался',
    'Не предложил альтернативу',
  ];
  const negations = [
    'На сегодня мы уже не бронируем столики',
    'Доставка в ваш район не осуществляется',
  ];

  const unit = units[i % units.length];
  return {
    id: 12345 + i,
    businessUnit: unit.name,
    address: unit.address,
    date: new Date(2024, 4, 1 + (i % 30)).toISOString().split('T')[0],
    time: `${10 + (i % 12)}:${String(i % 60).padStart(2, '0')}:00`,
    topic: topics[i % topics.length],
    staffer: staff[i % staff.length],
    transcription:
      'Здравствуйте, чем могу помочь? ... Да, конечно, сейчас проверю наличие свободных мест. ... К сожалению, на это время все занято.',
    scriptCompliance: 4 + (i % 8), // 4 to 11
    scriptErrors: i % 3 === 0 ? [errors[i % errors.length]] : [],
    numberNegations: i % 5 === 0 ? 1 : 0,
    negations: i % 5 === 0 ? [negations[i % negations.length]] : [],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder URL
    downloadAudioUrl:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  };
});

export const getCalls = (params: { page?: number; pageSize?: number }) => {
  const { page = 1, pageSize = 20 } = params;

  // Filtering logic would go here
  const filteredCalls = allCalls;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedCalls = filteredCalls.slice(start, end);

  return mockApi({
    total: filteredCalls.length,
    page: Number(page),
    pageSize: Number(pageSize),
    calls: paginatedCalls,
  });
};
