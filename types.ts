
export interface Evaluation {
  is_correct: boolean;
  score: number;
  feedback: string;
  technical_details: string;
}

export interface TraineeGraphUpdate {
  current_node: string;
  edge_type: 'progression' | 'detour' | 'mistake';
  concept_drift: string;
}

export interface NextContent {
  theory: string;
  lab_setup: string;
}

export interface Payload {
  evaluation?: Evaluation;
  trainee_graph_update?: TraineeGraphUpdate;
  hints?: string[];
  next_content?: NextContent;
}

export interface CyberPathResponse {
  header: {
    status: 'success' | 'error' | 'security_alert';
    timestamp: string;
  };
  payload?: Payload;
}

export interface GenerateLessonRequest {
  action: 'generate_lesson';
  module_id: string;
  difficulty: string;
}

export interface EvaluateCommandRequest {
  action: 'evaluate';
  user_command: string;
  terminal_output: string;
  lesson_objective: string;
}

export type CyberPathRequest = GenerateLessonRequest | EvaluateCommandRequest;

export interface LessonState {
  title: string;
  objective: string;
  xp: number;
  video_url?: string;
}

export interface CommandHistoryItem {
  command: string;
  output: string;
}
