import styles from './ReactionFeedback.module.css';

export type ReactionType = 'like' | 'skip' | 'superlike';

type ReactionFeedbackMessages = Record<
  ReactionType,
  {
    title: string;
    text: string;
    icon: string;
  }
>;

type ReactionFeedbackProps = {
  reaction: ReactionType;
  messages: ReactionFeedbackMessages;
  className?: string;
  variant: 'discover' | 'profile';
};

export function ReactionFeedback({
                                   reaction,
                                   messages,
                                   className,
                                   variant,
                                 }: ReactionFeedbackProps) {
  const current = messages[reaction];

  return (
    <div
      className={[
        styles.feedback,
        styles[`feedback--${reaction}`],
        styles[`feedback--variant-${variant}`],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles.feedback__icon} aria-hidden="true">
        {current.icon}
      </span>

      <div className={styles.feedback__content}>
        <strong>{current.title}</strong>
        <span>{current.text}</span>
      </div>
    </div>
  );
}