import { Pipe, PipeTransform } from '@angular/core';
import { EquipmentStatus } from '../../core/models/equipment.model';

const LABELS: Record<EquipmentStatus, string> = {
  disponible: 'Disponible',
  affecte: 'Affecté',
  maintenance: 'Maintenance',
  hors_service: 'Hors service'
};

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: EquipmentStatus): string {
    return LABELS[value] ?? value;
  }
}
