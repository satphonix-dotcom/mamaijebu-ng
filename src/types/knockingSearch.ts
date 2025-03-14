
export type KnockingMatchLogicType = 'vertical' | 'diagonal';

export interface KnockingSearchParams {
  firstRowNumbers: string[];
  secondRowNumbers: string[];
  thirdRowNumbers: string[];
  gameTypeId: string | null;
  gameId: string | null;
  matchLogic: KnockingMatchLogicType;
}

export interface KnockingSearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  draw_number?: string;
  first_numbers: number[];
  second_numbers: number[]; // numbers from the second draw
  third_numbers: number[]; // numbers from the third draw
  knocking_positions: number[]; // positions where knocking occurred
}
