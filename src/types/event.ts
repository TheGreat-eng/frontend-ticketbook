export interface SeatDTO {
  id: number;
  row: string;
  number: string;
  status: 'AVAILABLE' | 'HOLDING' | 'SOLD';
  price: number;
}