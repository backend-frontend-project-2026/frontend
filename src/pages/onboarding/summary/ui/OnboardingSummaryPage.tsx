import type { ReactNode } from 'react';
import { Button, Typography } from 'antd';
import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import '../../onboarding-pages.css';
import './onboarding-summary-page.css';

const { Title } = Typography;

type OnboardingSummaryPageProps = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
  onBack: () => void;
  onEditBasicInfo: () => void;
  onEditHabits: () => void;
  onEditLiving: () => void;
  onEditInterests: () => void;
  onComplete: () => void;
};

const GENDER_LABELS: Record<'female' | 'male', string> = {
  female: 'Женский',
  male: 'Мужской',
};

const SLEEP_LABELS: Record<'early_bird' | 'night_owl' | 'flexible', string> = {
  early_bird: 'Жаворонок',
  night_owl: 'Сова',
  flexible: 'Гибкий график',
};

const CLEANLINESS_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
};

const NOISE_LABELS: Record<'quiet' | 'moderate' | 'social', string> = {
  quiet: 'Тихо',
  moderate: 'Умеренно',
  social: 'Активно',
};

const GUEST_LABELS: Record<'never' | 'rarely' | 'sometimes' | 'often', string> = {
  never: 'Никогда',
  rarely: 'Редко',
  sometimes: 'Иногда',
  often: 'Часто',
};

const SMOKING_LABELS: Record<'no' | 'outside_only' | 'yes', string> = {
  no: 'Нет',
  outside_only: 'Только вне дома',
  yes: 'Да',
};

const ALCOHOL_LABELS: Record<'no' | 'rarely' | 'socially' | 'yes', string> = {
  no: 'Нет',
  rarely: 'Редко',
  socially: 'Иногда',
  yes: 'Да',
};

const ORDER_LABELS: Record<'strict' | 'balanced' | 'flexible', string> = {
  strict: 'Строгий порядок',
  balanced: 'Баланс',
  flexible: 'Гибко',
};

const PET_LABELS: Record<'no_pets' | 'has_pets' | 'pet_friendly', string> = {
  no_pets: 'Без питомцев',
  has_pets: 'Есть питомцы',
  pet_friendly: 'Можно с питомцами',
};

const HOUSING_LABELS: Record<'dormitory' | 'rental', string> = {
  dormitory: 'Общежитие',
  rental: 'Съём',
};

const STAY_LABELS: Record<'1-3 months' | '3-6 months' | '6-12 months' | '12+ months', string> = {
  '1-3 months': '1–3 месяца',
  '3-6 months': '3–6 месяцев',
  '6-12 months': '6–12 месяцев',
  '12+ months': '12+ месяцев',
};

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="onboarding-summary-row">
      <span className="onboarding-summary-row__label">{label}</span>
      <div className="onboarding-summary-row__value">{value}</div>
    </div>
  );
}

function fallbackText(value?: string) {
  return value?.trim() ? value.trim() : '—';
}

export function OnboardingSummaryPage({
  basicInfo,
  habits,
  living,
  interests,
  onBack,
  onEditBasicInfo,
  onEditHabits,
  onEditLiving,
  onEditInterests,
  onComplete,
}: OnboardingSummaryPageProps) {
  const mediaLabel = basicInfo.avatar
    ? `Аватар + ${basicInfo.photos.length} доп. фото`
    : `${basicInfo.photos.length} фото`;

  const quietHoursLabel = habits.hasQuietHours
    ? `${habits.quietFrom} — ${habits.quietTo}`
    : 'Не нужны';

  return (
    <section className="onboarding-page onboarding-page--summary">
      <OnboardingProgress currentStep={4} />

      <div className="rm-form-card onboarding-summary-card">
        <div className="rm-form-head">
          <p className="rm-form-step">Финальная проверка</p>
          <Title level={3} className="rm-form-title">
            Проверь анкету перед завершением
          </Title>
          <p className="rm-form-description">Всё можно исправить до перехода в discover.</p>
        </div>

        <section className="onboarding-summary-section">
          <div className="onboarding-summary-section__head">
            <div>
              <h3 className="onboarding-summary-section__title">Профиль</h3>
              <p className="onboarding-summary-section__text">Базовая информация и фото.</p>
            </div>

            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost onboarding-summary-edit"
              onClick={onEditBasicInfo}
            >
              <span>Изменить</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          </div>

          <div className="onboarding-summary-list">
            <SummaryRow label="Имя" value={fallbackText(basicInfo.name)} />
            <SummaryRow label="Возраст" value={fallbackText(basicInfo.age)} />
            <SummaryRow
              label="Пол"
              value={basicInfo.gender ? GENDER_LABELS[basicInfo.gender] : '—'}
            />
            <SummaryRow label="Вуз" value={fallbackText(basicInfo.university)} />
            <SummaryRow label="Факультет" value={fallbackText(basicInfo.faculty)} />
            <SummaryRow label="Курс" value={fallbackText(basicInfo.course)} />
            <SummaryRow label="Локация" value={fallbackText(basicInfo.location)} />
            <SummaryRow
              label="Био"
              value={<span className="onboarding-summary-text">{fallbackText(basicInfo.bio)}</span>}
            />
            <SummaryRow label="Фото" value={mediaLabel} />
          </div>
        </section>

        <section className="onboarding-summary-section">
          <div className="onboarding-summary-section__head">
            <div>
              <h3 className="onboarding-summary-section__title">Привычки</h3>
              <p className="onboarding-summary-section__text">Режим, порядок и бытовые правила.</p>
            </div>

            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost onboarding-summary-edit"
              onClick={onEditHabits}
            >
              <span>Изменить</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          </div>

          <div className="onboarding-summary-list">
            <SummaryRow
              label="Режим сна"
              value={habits.sleepSchedule ? SLEEP_LABELS[habits.sleepSchedule] : '—'}
            />
            <SummaryRow
              label="Чистота"
              value={habits.cleanliness ? CLEANLINESS_LABELS[habits.cleanliness] : '—'}
            />
            <SummaryRow
              label="Шум"
              value={habits.noiseLevel ? NOISE_LABELS[habits.noiseLevel] : '—'}
            />
            <SummaryRow
              label="Гости"
              value={habits.guestFrequency ? GUEST_LABELS[habits.guestFrequency] : '—'}
            />
            <SummaryRow
              label="Курение"
              value={habits.smokingPreference ? SMOKING_LABELS[habits.smokingPreference] : '—'}
            />
            <SummaryRow
              label="Алкоголь"
              value={habits.alcoholPreference ? ALCOHOL_LABELS[habits.alcoholPreference] : '—'}
            />
            <SummaryRow
              label="Порядок в комнате"
              value={habits.roomOrderPreference ? ORDER_LABELS[habits.roomOrderPreference] : '—'}
            />
            <SummaryRow
              label="Питомцы"
              value={habits.petPreference ? PET_LABELS[habits.petPreference] : '—'}
            />
            <SummaryRow label="Тихие часы" value={quietHoursLabel} />
            <SummaryRow
              label="Курение дома разрешено"
              value={habits.isSmokingAllowed ? 'Да' : 'Нет'}
            />
            <SummaryRow label="Есть питомцы" value={habits.hasPets ? 'Да' : 'Нет'} />
          </div>
        </section>

        <section className="onboarding-summary-section">
          <div className="onboarding-summary-section__head">
            <div>
              <h3 className="onboarding-summary-section__title">Условия проживания</h3>
              <p className="onboarding-summary-section__text">Бюджет, срок и пожелания к жилью.</p>
            </div>

            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost onboarding-summary-edit"
              onClick={onEditLiving}
            >
              <span>Изменить</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          </div>

          <div className="onboarding-summary-list">
            <SummaryRow label="Бюджет" value={`${living.budgetMin} — ${living.budgetMax} ₽/мес`} />
            <SummaryRow label="Дата заезда" value={fallbackText(living.moveInDate)} />
            <SummaryRow
              label="Срок"
              value={living.stayDuration ? STAY_LABELS[living.stayDuration] : '—'}
            />
            <SummaryRow
              label="Тип жилья"
              value={living.housingType ? HOUSING_LABELS[living.housingType] : '—'}
            />
            <SummaryRow
              label="Доп. условия"
              value={
                <span className="onboarding-summary-text">{fallbackText(living.livingNotes)}</span>
              }
            />
            <SummaryRow
              label="Идеальный сосед"
              value={
                <span className="onboarding-summary-text">
                  {fallbackText(living.idealRoommateDescription)}
                </span>
              }
            />
            <SummaryRow
              label="Критерии аренды"
              value={
                <span className="onboarding-summary-text">
                  {fallbackText(living.rentalCriteria)}
                </span>
              }
            />
          </div>
        </section>

        <section className="onboarding-summary-section">
          <div className="onboarding-summary-section__head">
            <div>
              <h3 className="onboarding-summary-section__title">Интересы</h3>
              <p className="onboarding-summary-section__text">
                Теги и короткая заметка о совместимости.
              </p>
            </div>

            <Button
              htmlType="button"
              className="rm-nav-button rm-nav-button--ghost onboarding-summary-edit"
              onClick={onEditInterests}
            >
              <span>Изменить</span>
              <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
            </Button>
          </div>

          <div className="onboarding-summary-list">
            <SummaryRow
              label="Интересы"
              value={
                <div className="onboarding-summary-tags">
                  {interests.interests.map((tag) => (
                    <span key={tag} className="onboarding-summary-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
            <SummaryRow
              label="Заметка"
              value={
                <span className="onboarding-summary-text">
                  {fallbackText(interests.compatibilityNote)}
                </span>
              }
            />
          </div>
        </section>

        <div className="onboarding-summary-note">После подтверждения откроется discover.</div>

        <div className="rm-form-actions">
          <Button htmlType="button" className="rm-nav-button rm-nav-button--ghost" onClick={onBack}>
            <span>Назад</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--dark">↗</span>
          </Button>

          <Button
            htmlType="button"
            className="rm-nav-button rm-nav-button--primary"
            onClick={onComplete}
          >
            <span>Завершить онбординг</span>
            <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
