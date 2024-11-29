interface Event_Mold {
  id: string;
  event: Event_Overview;
}

interface Event_Overview {
  id: string;
  event_type: 'plus' | 'minus' | 'special' | 'goal';
  title: string;
  overview: string;
  value: number;
  src: string;
  special_event: Event_Special;
}
interface Event_Special {
  id: string;
  conditions: string[]; //['1-3','4-6']
  effect_type: '+-' | '*/';
  effect_value: number[];
  base_amount: number[];
}
