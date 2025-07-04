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

export const getCalls = (params: {
  page?: number;
  pageSize?: number;
  address?: string;
  stafferId?: number[];
  topic?: string[];
  compliance?: [number, number];
  dateRange?: [string, string];
  negations?: string[];
  scriptErrors?: string[];
  search?: string;
}) => {
  const {
    page = 1,
    pageSize = 20,
    address,
    stafferId,
    topic,
    compliance,
    dateRange,
    negations,
    scriptErrors,
    search,
  } = params;

  let filteredCalls = allCalls;

  if (address) {
    filteredCalls = filteredCalls.filter((call) =>
      call.address.toLowerCase().includes(address.toLowerCase())
    );
  }

  if (stafferId && stafferId.length > 0) {
    filteredCalls = filteredCalls.filter((call) =>
      stafferId.includes(call.staffer.id)
    );
  }

  if (topic && topic.length > 0) {
    filteredCalls = filteredCalls.filter((call) => topic.includes(call.topic));
  }

  if (compliance) {
    filteredCalls = filteredCalls.filter(
      (call) =>
        call.scriptCompliance >= compliance[0] &&
        call.scriptCompliance <= compliance[1]
    );
  }

  if (dateRange && dateRange[0] && dateRange[1]) {
    filteredCalls = filteredCalls.filter((call) => {
      return call.date >= dateRange[0] && call.date <= dateRange[1];
    });
  }

  if (negations && negations.length > 0) {
    filteredCalls = filteredCalls.filter((call) =>
      call.negations.some((n) => negations.includes(n))
    );
  }

  if (scriptErrors && scriptErrors.length > 0) {
    filteredCalls = filteredCalls.filter((call) =>
      call.scriptErrors.some((e) => scriptErrors.includes(e))
    );
  }

  if (search && search.trim()) {
    const lower = search.trim().toLowerCase();
    filteredCalls = filteredCalls.filter(
      (call) =>
        call.negations.some((n) => n.toLowerCase().includes(lower)) ||
        call.scriptErrors.some((e) => e.toLowerCase().includes(lower)) ||
        call.transcription.toLowerCase().includes(lower)
    );
  }

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

// Моки аналитики за год с фильтрами по дате и ресторану
import { addDays, format } from 'date-fns';

const RESTAURANTS = [
  { id: 'rest1', name: 'СХ Гончарная' },
  { id: 'rest2', name: 'СХ Спортивная' },
  { id: 'rest3', name: 'СХ Загородный' },
  { id: 'rest4', name: 'СХ Науки' },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDateArray(start: Date, end: Date) {
  const arr = [];
  let dt = new Date(start);
  while (dt <= end) {
    arr.push(format(dt, 'yyyy-MM-dd'));
    dt = addDays(dt, 1);
  }
  return arr;
}

// Генерация моковых данных с 1 января текущего года по сегодняшний день
const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const YEAR_START = new Date(`${CURRENT_YEAR}-01-01`);
const TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
const ALL_DATES = getDateArray(YEAR_START, TODAY);

// Генерируем данные по дням и ресторанам
const analyticsRawData = ALL_DATES.flatMap((date) =>
  RESTAURANTS.map((rest) => {
    // Моки: звонки, пропущенные, отрицания, ошибки, темы
    const totalCalls = randomInt(10, 30);
    const missedCalls = randomInt(0, 5);
    const negations = randomInt(0, 6);
    const scriptErrors = randomInt(0, 8);
    const instruction = randomInt(1, 6);
    const booking = randomInt(2, 8);
    const pickup = randomInt(1, 6);
    const complaint = randomInt(0, 5);
    const other =
      totalCalls -
      missedCalls -
      negations -
      instruction -
      booking -
      pickup -
      complaint;
    const topics = [
      { type: 'Бронирование', value: booking },
      { type: 'Самовывоз', value: pickup },
      { type: 'Жалоба', value: complaint },
      { type: 'Пропущено', value: missedCalls },
      { type: 'Прочее', value: other > 0 ? other : randomInt(1, 5) },
    ];
    return {
      date,
      restaurant: rest.id,
      totalCalls,
      missedCalls,
      negations,
      scriptErrors,
      instruction,
      booking,
      pickup,
      complaint,
      other: other > 0 ? other : randomInt(1, 5),
      topics,
      bestStaffer: `Сотрудник ${randomInt(1, 5)}`,
      avgCompliance: randomInt(70, 98),
    };
  })
);

// Фильтрация по дате и ресторану
function filterAnalyticsData({
  dateRange,
  restaurant,
}: {
  dateRange?: [string | null, string | null];
  restaurant?: string;
}) {
  return analyticsRawData.filter((item) => {
    const inDate =
      !dateRange ||
      (!dateRange[0] && !dateRange[1]) ||
      (item.date &&
        (!dateRange[0] || item.date >= dateRange[0]) &&
        (!dateRange[1] || item.date <= dateRange[1]));
    const inRest = !restaurant || item.restaurant === restaurant;
    return inDate && inRest;
  });
}

// Моковый эндпоинт: Обзор
export const getAnalyticsOverview = async ({
  dateRange,
  restaurant,
}: {
  dateRange?: [string | null, string | null];
  restaurant?: string;
}) => {
  const data = filterAnalyticsData({ dateRange, restaurant });
  // Метрики
  const totalCalls = data.reduce((sum, d) => sum + d.totalCalls, 0);
  const missedCalls = data.reduce((sum, d) => sum + d.missedCalls, 0);
  const negations = data.reduce((sum, d) => sum + d.negations, 0);
  const scriptErrors = data.reduce((sum, d) => sum + d.scriptErrors, 0);
  // Темы звонков
  const topicsMap: Record<string, number> = {};
  data.forEach((d) => {
    d.topics.forEach((t: { type: string; value: number }) => {
      topicsMap[t.type] = (topicsMap[t.type] || 0) + t.value;
    });
  });
  const topics = Object.entries(topicsMap).map(([type, value]) => ({
    type,
    value,
  }));
  // Динамика по дням
  const dynamic = {} as Record<
    string,
    {
      other: number;
      missed: number;
      booking: number;
      pickup: number;
      complaint: number;
    }
  >;
  data.forEach((d) => {
    if (!dynamic[d.date])
      dynamic[d.date] = {
        other: 0,
        missed: 0,
        booking: 0,
        pickup: 0,
        complaint: 0,
      };
    dynamic[d.date].other += d.other;
    dynamic[d.date].missed += d.missedCalls;
    dynamic[d.date].booking += d.booking;
    dynamic[d.date].pickup += d.pickup;
    dynamic[d.date].complaint += d.complaint;
  });
  const dynamicArr = Object.entries(dynamic).map(([date, v]) => ({
    date,
    ...v,
  }));
  return mockApi({
    totalCalls,
    missedCalls,
    negations,
    scriptErrors,
    topics,
    dynamic: dynamicArr,
  });
};

// Моковый эндпоинт: Инструкция
export const getAnalyticsScript = async ({
  dateRange,
  restaurant,
}: {
  dateRange?: [string | null, string | null];
  restaurant?: string;
}) => {
  const data = filterAnalyticsData({ dateRange, restaurant });
  // Средний % соответствия
  const avgCompliance = data.length
    ? Math.round(
        data.reduce((sum, d) => sum + d.avgCompliance, 0) / data.length
      )
    : 0;
  // Лучший сотрудник
  const bestStaffer = data.length
    ? data[Math.floor(Math.random() * data.length)].bestStaffer
    : '-';
  // Ошибки по скрипту
  const scriptErrors = data.reduce((sum, d) => sum + d.scriptErrors, 0);
  // Ошибки по типам (моки)
  const errorTypes = [
    'Не уточнил адрес',
    'Не попрощался',
    'Не уточнил тему',
    'Не представился',
    'Не уточнил имя',
  ];
  const topErrors = errorTypes.map((type) => ({
    errorType: type,
    count: randomInt(2, 12),
  }));
  // Ошибки по сотрудникам (моки)
  const staffers = ['Иванов', 'Петрова', 'Сидоров', 'Смирнова'];
  const staffErrorData = staffers.flatMap((staffer) =>
    errorTypes.map((type) => ({
      staffer,
      errorType: type,
      count: randomInt(0, 4),
    }))
  );
  return mockApi({
    avgCompliance,
    bestStaffer,
    scriptErrors,
    topErrors,
    staffErrorData,
  });
};

// Моковый эндпоинт: Отрицания
export const getAnalyticsNegations = async ({
  dateRange,
  restaurant,
}: {
  dateRange?: [string | null, string | null];
  restaurant?: string;
}) => {
  const data = filterAnalyticsData({ dateRange, restaurant });
  // % звонков с отрицаниями
  const totalCalls = data.reduce((sum, d) => sum + d.totalCalls, 0);
  const callsWithNeg = data.reduce(
    (sum, d) => sum + (d.negations > 0 ? 1 : 0),
    0
  );
  const percentWithNeg = totalCalls
    ? Math.round((callsWithNeg / totalCalls) * 100)
    : 0;
  // Всего отрицаний
  const totalNegations = data.reduce((sum, d) => sum + d.negations, 0);
  // Сотрудник с мин. отрицаниями (>= 5 звонков)
  const staffers = ['Иванов', 'Петрова', 'Сидоров', 'Смирнова', 'Кузнецова'];
  const staffNegations = staffers.map((name) => ({
    name,
    count: randomInt(0, 6),
    type: 'Грубость',
  }));
  const eligible = staffNegations.filter((s) => s.count >= 0);
  const minNegStaff = eligible.length
    ? eligible.reduce((min, s) => (s.count < min.count ? s : min), eligible[0])
    : null;
  // Причины отрицаний (моки)
  const reasons = [
    'Не можем забронировать',
    'Нет оплаты по QR-коду',
    'Нет доставки',
    'Нет свободных столов',
    'Слишком далеко',
  ];
  const topNegations = reasons.map((reason) => ({
    reason,
    count: randomInt(1, 5),
  }));
  // По сотрудникам (stacked)
  const staffNegationsStacked = staffers.flatMap((name) =>
    reasons.map((type) => ({ name, count: randomInt(0, 4), type }))
  );
  return mockApi({
    percentWithNeg,
    totalNegations,
    minNegStaff,
    topNegations,
    staffNegations,
    staffNegationsStacked,
  });
};
