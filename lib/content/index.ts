export type {
  BadgeDefinition,
  BossTipContent,
  ChallengeContent,
  ChallengeKind,
  ConsistencyRuleContent,
  ContentEntityType,
  ContentValidationResult,
  ContentWarning,
  ContentWarningCode,
  CorrectAnswer,
  CourseContentBundle,
  ExpectedJournalLineAnswer,
  FeedbackRule,
  LessonContent,
  LessonExample,
  TransactionScenario,
  TransactionScenarioType,
} from "@/lib/content/schemas";

export {
  RICH_CHALLENGE_ADAPTERS,
  adaptCatalogChallengeToPlaceholder,
  hasCorrectAnswer,
  hasFeedbackContent,
} from "@/lib/content/adapters";

export {
  COURSE_META,
  getChallengeContentById,
  getCourseContent,
  getLessonContentById,
  getValidatedCourseContent,
} from "@/lib/content/registry";

export {
  WARNING_LABELS,
  filterWarningsByEntity,
  validateCourseContent,
} from "@/lib/content/validation";
